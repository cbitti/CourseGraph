// Minimal typing for our usage of react-cytoscapejs
declare module 'react-cytoscapejs' {
  import { CSSProperties } from 'react';
  import type { Core as CyCore, ElementDefinition, LayoutOptions } from 'cytoscape';

  export interface CytoscapeComponentProps {
    elements: ElementDefinition[];
    layout?: LayoutOptions;
    // Accept any here to avoid strict coupling to cytoscape's stylesheet types
    stylesheet?: any;
    style?: CSSProperties;
    cy?: (cy: CyCore) => void;
  }

  const CytoscapeComponent: (props: CytoscapeComponentProps) => JSX.Element;
  export default CytoscapeComponent;
}
