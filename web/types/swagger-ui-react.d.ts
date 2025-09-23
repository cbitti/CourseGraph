declare module 'swagger-ui-react' {
  import { CSSProperties } from 'react';

  type DocExpansion = 'list' | 'full' | 'none';

  interface SwaggerUIProps {
    url?: string;
    spec?: unknown;
    docExpansion?: DocExpansion;
    defaultModelsExpandDepth?: number;
    deepLinking?: boolean;
    className?: string;
    style?: CSSProperties;
  }

  const SwaggerUI: (props: SwaggerUIProps) => JSX.Element;
  export default SwaggerUI;
}
