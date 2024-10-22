// https://en.wikipedia.org/wiki/Pr%C3%BCfer_sequence

export function pruferDecode(code: number[]): [number, number][] {
  const n = code.length + 2;
  const deg = new Array(n).fill(1);
  for (const x of code) {
    deg[x]++;
  }

  const edges: [number, number][] = [];
  for (const x of code) {
    const y = deg.findIndex((d) => d === 1);
    deg[x]--;
    deg[y]--;
    edges.push([x, y]);
  }

  const x = deg.findIndex((d) => d === 1);
  const y = deg.findLastIndex((d) => d === 1);
  edges.push([x, y]);

  return edges;
}
