import { describe, expect, test } from "vitest";
import { prufer_decode } from "./prufer";

test.each([
  {
    // 0 -- 1
    code: [],
    edges: [[0, 1]],
  },
  {
    // 1 -- 0 -- 2
    code: [0],
    edges: [
      [0, 1],
      [0, 2],
    ],
  },
  {
    // 0 -- 1 -- 2
    code: [1],
    edges: [
      [1, 0],
      [1, 2],
    ],
  },
  {
    // 0 -- 2 -- 1
    code: [2],
    edges: [
      [2, 0],
      [1, 2],
    ],
  },
  {
    //      1
    //      |
    // 0 -- 3 -- 4 -- 5
    //      |
    //      2
    code: [3, 3, 3, 4],
    edges: [
      [3, 0],
      [3, 1],
      [3, 2],
      [4, 3],
      [4, 5],
    ],
  },
])("$code", ({ code, edges }) => {
  expect(prufer_decode(code)).toStrictEqual(edges);
});
