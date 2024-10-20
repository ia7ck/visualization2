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
):
  | { ok: true; data: Graph }
  | {
      ok: false;
      error: { field: "N" | "M" | "edge"; line: number; message: string };
    } {
  const lines = input.trimEnd().split("\n");

  const n_m = lines[0].trim().split(/ +/);
  const n = PositiveInt.safeParse(n_m[0]);
  if (n.error) {
    return {
      ok: false,
      error: {
        field: "N",
        line: 0,
        message: `Invalid node number: "${n_m[0]}". It must be a positive integer.`,
      },
    };
  }

  const m = n_m.length < 2 ? undefined : NonNegativeInt.safeParse(n_m[1]);
  if (m?.error) {
    return {
      ok: false,
      error: {
        field: "M",
        line: 0,
        message: `Invalid edge number: "${n_m[1]}". It must be a non-negative integer.`,
      },
    };
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
      return {
        ok: false,
        error: {
          field: "edge",
          line: i,
          message: `Invalid edge: "${lines[i].trim()}". It must be space-separated integers.`,
        },
      };
    }
    if (option.weighted) {
      const w = Int.safeParse(weight);
      if (w.error) {
        return {
          ok: false,
          error: {
            field: "edge",
            line: i,
            message: `Invalid edge weight: "${weight ?? ""}". It must be an integer.`,
          },
        };
      }
      edges.push({ ...e.data, weight: w.data });
    } else {
      edges.push(e.data);
    }
  }

  if (m !== undefined && edges.length < m.data) {
    return {
      ok: false,
      error: {
        field: "edge",
        line: lines.length,
        message: `Too few edges. Expected ${m.data}, but got ${edges.length}.`,
      },
    };
  }

  return { ok: true, data: { n: n.data, edges } };
}
