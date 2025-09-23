export type CourseNode = { id: string; code: string; title?: string };
export type Edge = { from: string; to: string };

type Graph = {
  nodes: Map<string, CourseNode>;
  prereqsOf: Map<string, Set<string>>;    // node <- prerequisites
  dependentsOf: Map<string, Set<string>>; // node -> dependents
};

export function buildGraph(nodes: CourseNode[], edges: Edge[]): Graph {
  const nodeMap = new Map(nodes.map(n => [n.id, n]));
  const prereqsOf = new Map<string, Set<string>>();
  const dependentsOf = new Map<string, Set<string>>();
  for (const id of nodeMap.keys()) {
    prereqsOf.set(id, new Set());
    dependentsOf.set(id, new Set());
  }
  for (const e of edges) {
    if (!nodeMap.has(e.from) || !nodeMap.has(e.to)) continue;
    prereqsOf.get(e.to)!.add(e.from);
    dependentsOf.get(e.from)!.add(e.to);
  }
  return { nodes: nodeMap, prereqsOf, dependentsOf };
}

// Custom typed error for cycles
export class CycleError extends Error {
  readonly stuck: string[];
  constructor(stuck: string[]) {
    super(`Cycle detected among: ${stuck.join(", ")}`);
    this.name = "CycleError";
    this.stuck = stuck;
  }
}

// Courses whose all prereqs are satisfied by `completed`
export function eligibleNext(g: Graph, completed: Set<string>): string[] {
  const res: string[] = [];
  for (const [id, prereqs] of g.prereqsOf.entries()) {
    if (completed.has(id)) continue;
    let ok = true;
    for (const p of prereqs) {
      if (!completed.has(p)) {
        ok = false;
        break;
      }
    }
    if (ok) res.push(id);
  }
  // stable-ish order: by code, then title, then id
  res.sort((a, b) => {
    const A = g.nodes.get(a)!;
    const B = g.nodes.get(b)!;
    return (
      (A.code ?? "").localeCompare(B.code ?? "") ||
      (A.title ?? "").localeCompare(B.title ?? "") ||
      a.localeCompare(b)
    );
  });
  return res;
}

// Kahn topo; returns order or throws CycleError with the stuck nodes
export function topoOrder(g: Graph): string[] {
  const indeg = new Map<string, number>();
  for (const [id, prereqs] of g.prereqsOf) indeg.set(id, prereqs.size);

  const q: string[] = [];
  for (const [id, d] of indeg) if (d === 0) q.push(id);
  q.sort();

  const out: string[] = [];
  while (q.length) {
    const id = q.shift()!;
    out.push(id);
    for (const dep of g.dependentsOf.get(id) ?? []) {
      indeg.set(dep, (indeg.get(dep) ?? 0) - 1);
      if (indeg.get(dep) === 0) q.push(dep);
    }
    q.sort();
  }

  if (out.length !== g.nodes.size) {
    const stuck = [...g.nodes.keys()].filter(id => !out.includes(id));
    throw new CycleError(stuck);
  }
  return out;
}

// Simple term planner: greedily fill up to maxPerTerm with eligible courses
export function planTerms(
  g: Graph,
  opts: { maxPerTerm?: number; targetIds?: string[] } = {}
): string[][] {
  const maxPerTerm = opts.maxPerTerm ?? 4;
  const target = new Set(opts.targetIds ?? [...g.nodes.keys()]);
  const completed = new Set<string>();
  const planned: string[][] = [];

  // pre-check for cycles (will throw CycleError if present)
  topoOrder(g);

  while (true) {
    const eligible = eligibleNext(g, completed).filter(id => target.has(id));
    const remaining = [...target].filter(id => !completed.has(id));
    if (remaining.length === 0) break;
    if (eligible.length === 0) {
      // No eligible among targets, but still remaining -> unmet prereqs outside target or cycle
      break;
    }
    const take = eligible.slice(0, Math.max(1, maxPerTerm));
    planned.push(take);
    for (const id of take) completed.add(id);
  }
  return planned;
}
