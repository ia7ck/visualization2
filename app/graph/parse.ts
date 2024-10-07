import { z } from "zod";

type Graph = {
  n: number;
  edges: { from: number; to: number }[];
};

const PositiveInt = z.coerce.number().int().positive();

export function parseGraph(input: string): Graph | null {
  const lines = input.trimEnd().split("\n");

  const n = PositiveInt.safeParse(lines[0].trim());
  if (n.error) {
    return null;
  }

  const NodeIndex = PositiveInt.max(n.data);
  const Edge = z.object({
    from: NodeIndex,
    to: NodeIndex,
  });
  const edges: Graph["edges"] = [];
  for (let i = 1; i < lines.length; i++) {
    const [from, to] = lines[i].trim().split(" ");
    const e = Edge.safeParse({ from, to });
    if (e.error) {
      return null;
    }
    edges.push(e.data);
  }

  return { n: n.data, edges };
}
