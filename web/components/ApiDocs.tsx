'use client';

import { useEffect } from 'react';
import dynamic from 'next/dynamic';

// Load Swagger UI on the client
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

export default function ApiDocs() {
  // Inject Swagger UI CSS via <link> to avoid global CSS import issues
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/swagger-ui-dist/swagger-ui.css';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <div className="rounded-2xl border">
      {/* Use the file in /public/openapi/openapi.yaml */}
      <SwaggerUI url="/openapi/openapi.yaml" docExpansion="list" defaultModelsExpandDepth={0} deepLinking />
    </div>
  );
}
