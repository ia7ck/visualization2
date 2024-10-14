import { describe, expect, test } from "vitest";
import { parseGraph } from "./parse";

describe("valid", () => {
  describe("N=1", () => {
    test.each([
      {
        name: "M=0",
        input: "1",
        expected: { n: 1, edges: [] },
      },
      {
        name: "M=1",
        input: `1
1 1`,
        expected: { n: 1, edges: [{ from: 1, to: 1 }] },
      },
      {
        name: "多重辺",
        input: `1
1 1
1 1`,
        expected: {
          n: 1,
          edges: [
            { from: 1, to: 1 },
            { from: 1, to: 1 },
          ],
        },
      },
    ])("$name", ({ input, expected }) => {
      expect(parseGraph(input)).toStrictEqual(expected);
    });
  });
  describe("N=2", () => {
    test.each([
      {
        name: "M=0",
        input: "2",
        expected: { n: 2, edges: [] },
      },
      {
        name: "M=1",
        input: `2
1 2`,
        expected: { n: 2, edges: [{ from: 1, to: 2 }] },
      },
      {
        name: "多重辺",
        input: `2
1 2
2 1`,
        expected: {
          n: 2,
          edges: [
            { from: 1, to: 2 },
            { from: 2, to: 1 },
          ],
        },
      },
    ])("$name", ({ input, expected }) => {
      expect(parseGraph(input)).toStrictEqual(expected);
    });
  });
  describe("辺数Mを指定", () => {
    test.each([
      {
        name: "ちょうど",
        input: `3 2
1 2
1 3`,
        expected: {
          n: 3,
          edges: [
            { from: 1, to: 2 },
            { from: 1, to: 3 },
          ],
        },
      },
      {
        name: "Mの後ろは無視",
        input: `3 2 xxx
1 2
1 3`,
        expected: {
          n: 3,
          edges: [
            { from: 1, to: 2 },
            { from: 1, to: 3 },
          ],
        },
      },
      {
        name: "Mを超えた辺は無視",
        input: `3 2
1 2
1 3
2 3`,
        expected: {
          n: 3,
          edges: [
            { from: 1, to: 2 },
            { from: 1, to: 3 },
          ],
        },
      },
    ])("$name", ({ input, expected }) => {
      expect(parseGraph(input)).toStrictEqual(expected);
    });
  });
  describe("parse option", () => {
    describe("0-indexed", () => {
      test("0, N-1", () => {
        expect(
          parseGraph(
            `3
0 2`,
            { indexStart: "0-indexed" },
          ),
        ).toStrictEqual({
          n: 3,
          edges: [{ from: 0, to: 2 }],
        });
      });
    });
  });
});

describe("invalid", () => {
  test.each([
    { name: "N=0", input: "0" },
    { name: "N<0", input: "-1" },
    { name: "N float", input: "0.5" },
    { name: "N 文字列", input: "ABC" },
    {
      name: "fromのみ, toが無い",
      input: `4
1 `,
    },
    {
      name: "to float",
      input: `4
1 0.5`,
    },
    {
      name: "from<0",
      input: `4
-1 2`,
    },
    {
      name: "to>N",
      input: `4
2 7`,
    },
    {
      name: "to 文字列",
      input: `4
1 AAA`,
    },
    {
      name: "辺が足りない",
      input: `4 2
1 2`,
    },
  ])("$name", ({ input }) => {
    expect(parseGraph(input)).toBe(null);
  });
});
