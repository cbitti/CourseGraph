'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import type {
  Core as CyCore,
  ElementDefinition,
  Stylesheet,
  LayoutOptions,
} from 'cytoscape';

// react-cytoscapejs must render on the client
const CytoscapeComponent = dynamic(() => import('react-cytoscapejs'), {
  ssr: false,
});

type Node = { id: string; label: string };
type Edge = { from: string; to: string };

type GraphResponse = {
  nodes: Node[];
  edges: Edge[];
};

export default function GraphPage() {
  const searchParams = useSearchParams();
  const focusId = searchParams.get('focus');

  const [els, setEls] = useState<ElementDefinition[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cyRef, setCyRef] = useState<CyCore | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/courses/graph', { cache: 'no-store' });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const { nodes, edges }: GraphResponse = await res.json();

        if (!alive) return;

        const elements: ElementDefinition[] = [
          ...nodes.map<ElementDefinition>((n) => ({
            data: { id: n.id, label: n.label },
            group: 'nodes',
          })),
          ...edges.map<ElementDefinition>((e, i) => ({
            data: { id: `e-${i}`, source: e.from, target: e.to },
            group: 'edges',
          })),
        ];
        setEls(elements);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : 'Failed to load graph');
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Styles & layout
  const stylesheet: Stylesheet[] = useMemo(
    () => [
      {
        selector: 'node',
        style: {
          label: 'data(label)',
          'text-wrap': 'wrap',
          'text-max-width': 170,
          'font-size': 10,
          'background-opacity': 1,
        },
      },
      {
        selector: 'edge',
        style: {
          'curve-style': 'bezier',
          'target-arrow-shape': 'triangle',
          'arrow-scale': 1.2,
          width: 2,
        },
      },
      { selector: '.faded', style: { opacity: 0.2 } },
      { selector: '.focus', style: { 'border-width': 3 } },
      { selector: '.path', style: { width: 4 } },
    ],
    []
  );

  const layout: LayoutOptions = useMemo(
    () => ({ name: 'breadthfirst', directed: true, padding: 20, spacingFactor: 1.1 }),
    []
  );

  // Click to highlight predecessors/successors
  function onCyReady(cy: CyCore) {
    setCyRef(cy);
    cy.on('tap', 'node', (e) => {
      const node = e.target;
      cy.elements().removeClass('faded focus path');
      const predecessors = node.predecessors();
      const successors = node.successors();
      node.addClass('focus');
      predecessors.addClass('path');
      successors.addClass('path');
      cy.elements().difference(predecessors.union(successors).union(node)).addClass('faded');
    });
    cy.on('tap', (e) => {
      if (e.target === cy) cy.elements().removeClass('faded focus path');
    });
  }

  // Optional: center/zoom if ?focus=<courseId> is provided
  useEffect(() => {
    if (!cyRef || !focusId) return;
    const n = cyRef.$id(focusId);
    if (n.length > 0) {
      cyRef.animate({ center: { eles: n }, zoom: 1.2 }, { duration: 400 });
    }
  }, [cyRef, focusId]);

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-semibold">Prerequisite Graph</h1>

      {loading && <p className="text-sm text-gray-500">Loading graph…</p>}
      {error && (
        <div className="text-sm text-red-600">
          Failed to load the graph: {error}
        </div>
      )}

      {!loading && !error && els.length === 0 && (
        <div className="rounded-xl border p-6 text-sm text-gray-600">
          No courses or prerequisites yet. Add some on the <a className="underline" href="/courses">Courses</a> page to see the graph.
        </div>
      )}

      {!loading && !error && els.length > 0 && (
        <div className="h-[75vh] rounded-2xl border">
          <CytoscapeComponent
            elements={els}
            layout={layout}
            stylesheet={stylesheet}
            style={{ width: '100%', height: '100%' }}
            cy={onCyReady}
          />
        </div>
      )}

      <p className="text-sm text-gray-500">
        Tip: click a course to highlight its prerequisites and dependents; click the background to reset.
      </p>
    </div>
  );
}
