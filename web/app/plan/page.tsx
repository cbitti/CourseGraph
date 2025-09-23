'use client';

import { useEffect, useState } from 'react';
import type { CourseNode, Edge } from '@/lib/graph/plan';
import { buildGraph, planTerms } from '@/lib/graph/plan';

type GraphResponse = { nodes: { id: string; label: string }[]; edges: Edge[] };

export default function PlanPreviewPage() {
  const [terms, setTerms] = useState<string[][]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const r = await fetch('/api/courses/graph', { cache: 'no-store' });
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        const data: GraphResponse = await r.json();

        // Convert nodes: split "CODE — Title" back into fields when possible
        const nodes: CourseNode[] = data.nodes.map(n => {
          const [code, title] = n.label.split(' — ');
          return { id: n.id, code: code || n.label, title };
        });

        const g = buildGraph(nodes, data.edges);
        const planned = planTerms(g, { maxPerTerm: 4 });
        setTerms(planned);
      } catch (e) {
        setErr(e instanceof Error ? e.message : 'Failed to build plan');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Planner Preview</h1>
      {loading && <p className="text-sm text-gray-500">Computing…</p>}
      {err && <p className="text-sm text-red-600">{err}</p>}
      {!loading && !err && (
        <div className="grid gap-4 md:grid-cols-2">
          {terms.map((term, i) => (
            <div key={i} className="rounded-xl border p-4">
              <h2 className="font-semibold mb-2">Term {i + 1}</h2>
              {term.length === 0 ? (
                <p className="text-sm text-gray-500">No courses.</p>
              ) : (
                <ul className="list-disc pl-5">
                  {term.map(id => <li key={id}>{id}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}
      <p className="text-sm text-gray-500">
        This is a simple greedy planner (max 4 courses/term). We’ll refine with credits & priorities next.
      </p>
    </div>
  );
}
