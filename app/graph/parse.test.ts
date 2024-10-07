import { describe, expect, test } from "vitest";
import { parseGraph } from "./parse";

describe("valid", () => {
  test("single node", () => {
    expect(parseGraph("1")).toStrictEqual({ n: 1, edges: [] });

    expect(
      parseGraph(`1
1 1`),
    ).toStrictEqual({ n: 1, edges: [{ from: 1, to: 1 }] });

    expect(
      parseGraph(`1
1 1
1 1`),
    ).toStrictEqual({
      n: 1,
      edges: [
        { from: 1, to: 1 },
        { from: 1, to: 1 },
      ],
    });
  });

  test("two nodes", () => {
    expect(parseGraph("2")).toStrictEqual({ n: 2, edges: [] });

    expect(
      parseGraph(`2
1 2`),
    ).toStrictEqual({ n: 2, edges: [{ from: 1, to: 2 }] });

    expect(
      parseGraph(`2
1 2
2 1`),
    ).toStrictEqual({
      n: 2,
      edges: [
        { from: 1, to: 2 },
        { from: 2, to: 1 },
      ],
    });
  });
});

describe("invalid", () => {
  test.each([
    ["0"],
    ["-1"],
    ["0.5"],
    ["ABC"],
    [
      `4
1 `,
    ],
    [
      `4
1 0.5`,
    ],
    [
      `4
-1 2`,
    ],
    [
      `4
2 7`,
    ],
    [
      `4
1 AAA`,
    ],
  ])('"%s"', (input) => {
    expect(parseGraph(input)).toBe(null);
  });
});
