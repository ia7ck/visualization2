import { z } from "zod";

type Graph = {
  n: number;
  edges: { from: number; to: number; weight?: number }[];
};

type ParseOption = {
  indexStart?: "0-indexed" | "1-indexed";
  weighted?: boolean;
};

const Int = z.coerce.number().int();
const NonNegativeInt = Int.nonnegative();
const PositiveInt = Int.positive();

export function parseGraph(
  input: string,
  option: ParseOption = { indexStart: "1-indexed", weighted: false },
): Graph | null {
  const lines = input.trimEnd().split("\n");

  const n_m = lines[0].trim().split(/ +/);
  const n = PositiveInt.safeParse(n_m[0]);
  if (n.error) {
    return null;
  }
  const m = n_m.length < 2 ? undefined : NonNegativeInt.safeParse(n_m[1]);
  if (m?.error) {
    return null;
  }

  const NodeIndex =
    option.indexStart === "0-indexed"
      ? NonNegativeInt.max(n.data - 1)
      : PositiveInt.max(n.data);
  const Edge = z.object({
    from: NodeIndex,
    to: NodeIndex,
  });
  const edges: Graph["edges"] = [];
  for (
    let i = 1;
    i < (m === undefined ? lines.length : Math.min(lines.length, m.data + 1));
    i++
  ) {
    const [from, to, weight] = lines[i].trim().split(" ");
    const e = Edge.safeParse({ from, to });
    if (e.error) {
      return null;
    }
    if (option.weighted) {
      const w = Int.safeParse(weight);
      if (w.error) {
        return null;
      }
      edges.push({ ...e.data, weight: w.data });
    } else {
      edges.push(e.data);
    }
  }

  if (m !== undefined && edges.length < m.data) {
    return null;
  }

  return { n: n.data, edges };
}
