// Minimal typing for our usage of react-cytoscapejs
declare module 'react-cytoscapejs' {
  import { CSSProperties } from 'react';
  import type { Core as CyCore, ElementDefinition, LayoutOptions } from 'cytoscape';

  export interface CytoscapeComponentProps {
    elements: ElementDefinition[];
    layout?: LayoutOptions;
    // keep flexible but typed (avoid `any`)
    stylesheet?: unknown;
    style?: CSSProperties;
    cy?: (cy: CyCore) => void;
  }

  const CytoscapeComponent: (props: CytoscapeComponentProps) => JSX.Element;
  export default CytoscapeComponent;
}
