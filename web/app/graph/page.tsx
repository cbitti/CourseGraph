import GraphClient from "@/components/GraphClient";

export default function GraphPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  const raw = searchParams?.focus;
  const focusId = Array.isArray(raw) ? raw[0] : raw;

  return <GraphClient focusId={focusId} />;
}
