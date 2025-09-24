import { buildGraph, eligibleNext, topoOrder, planTerms, CycleError } from "./plan";

const nodes = [
  { id: "a", code: "CS101", title: "Intro" },
  { id: "b", code: "CS201", title: "Data Structures" },
  { id: "c", code: "CS301", title: "Algorithms" },
];

const edges = [
  { from: "a", to: "b" },
  { from: "b", to: "c" },
];

describe("planner graph utils", () => {
  it("topoOrder returns all nodes in dependency order", () => {
    const g = buildGraph(nodes, edges);
    const order = topoOrder(g);
    expect(order).toHaveLength(3);
    expect(order.indexOf("a")).toBeLessThan(order.indexOf("b"));
    expect(order.indexOf("b")).toBeLessThan(order.indexOf("c"));
  });

  it("eligibleNext respects prerequisites", () => {
    const g = buildGraph(nodes, edges);
    expect(eligibleNext(g, new Set())).toEqual(["a"]);
    expect(eligibleNext(g, new Set(["a"]))).toContain("b");
    expect(eligibleNext(g, new Set(["a", "b"]))).toContain("c");
  });

  it("planTerms batches by maxPerTerm", () => {
    const g = buildGraph(nodes, edges);
    const terms = planTerms(g, { maxPerTerm: 1 });
    expect(terms).toEqual([["a"], ["b"], ["c"]]);
  });

  it("throws CycleError on cycles", () => {
    const g = buildGraph(nodes, [...edges, { from: "c", to: "a" }]); // cycle
    expect(() => topoOrder(g)).toThrow(CycleError);
  });
});
