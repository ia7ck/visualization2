"use client";

import { FireIcon } from "@heroicons/react/16/solid";
import clsx from "clsx";
import { StrictMode, useState } from "react";
import { z } from "zod";

const N_MIN = 1;
const N_MAX = 10;

const GridSize = z.coerce.number().int().min(N_MIN).max(N_MAX);
type GridSize = z.infer<typeof GridSize>;

type Position = { i: number; j: number };

export default function ARC176_A() {
  const [gridSizeText, setGridSizeText] = useState("4");
  const [positions, setPositions] = useState([
    { i: 0, j: 3 },
    { i: 2, j: 1 },
  ]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const parsedValue = GridSize.safeParse(value);
    if (parsedValue.success) {
      // shrink
      setPositions(
        positions.filter(
          (p) =>
            0 <= p.i &&
            p.i < parsedValue.data &&
            0 <= p.j &&
            p.j < parsedValue.data,
        ),
      );
    } else {
      setPositions([]);
    }
    setGridSizeText(value);
  };

  const gridSize = GridSize.safeParse(gridSizeText);

  const handleCellClick = (p: Position) => {
    if (gridSize.success) {
      if (positions.some((q) => p.i === q.i && p.j === q.j)) {
        // remove p
        const newPositions = positions.filter(
          (q) => !(p.i === q.i && p.j === q.j),
        );
        setPositions(newPositions);
      } else {
        // add p
        const newPositions = [...positions, p];
        if (newPositions.length <= gridSize.data) {
          setPositions(newPositions);
        }
      }
    }
  };

  const filledPositions = gridSize.success
    ? fillGrid(gridSize.data, positions)
    : [];

  return (
    <StrictMode>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
            Problem
          </h1>
          <a
            className="inline-block mt-2 leading-6 text-indigo-600 hover:text-indigo-500"
            href="https://atcoder.jp/contests/arc176/tasks/arc176_a"
            target="blank"
          >
            ARC176 A - 01 Matrix Again
          </a>
          <label
            htmlFor="grid_size"
            className="block mt-5 text-sm font-medium leading-6 text-gray-900"
          >
            Grid size <var>N</var>
          </label>
          <input
            name="grid_size"
            id="grid_size"
            type="number"
            min={N_MIN}
            max={N_MAX}
            inputMode="numeric"
            className={clsx(
              "block w-full rounded-md border-0 mt-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
              {
                "text-red-900 ring-red-300 focus:ring-red-500":
                  !gridSize.success,
              },
            )}
            value={gridSizeText}
            onChange={(e) => handleInputChange(e)}
          />
          <p
            className={clsx("mt-2 text-sm text-gray-500", {
              "text-red-600": !gridSize.success,
            })}
          >
            {N_MIN} ≦ N ≦ {N_MAX}
          </p>
          <label
            htmlFor="n_fire"
            className="block mt-2 text-sm font-medium leading-6 text-gray-900"
          >
            Number of fire <var>M</var>
          </label>
          <input
            name="n_fire"
            id="n_fire"
            type="number"
            className="block w-full rounded-md border-0 mt-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 disabled:ring-gray-200 sm:text-sm sm:leading-6"
            value={positions.length}
            readOnly={true}
            disabled={true}
          />
          <p
            className={clsx("mt-2 text-sm text-gray-500", {
              invisible: !gridSize.success,
            })}
          >
            0 ≦ M ≦ {gridSize.success ? gridSize.data : 0}
          </p>
          {gridSize.success && (
            <div className="grid place-items-center mt-8 mb-8">
              {range(0, gridSize.data - 1).map((i) => (
                <div
                  key={i}
                  className="grid grid-flow-col place-items-start border-t last:border-b border-gray-400"
                >
                  {range(0, gridSize.data - 1).map((j) => (
                    // biome-ignore lint/a11y/useKeyWithClickEvents: ;_;
                    <div
                      key={j}
                      className={clsx(
                        "grid place-items-center h-8 w-8 border-l last:border-r border-gray-400",
                        {
                          "bg-indigo-100": filledPositions.some(
                            (p) => p.i === i && p.j === j,
                          ),
                        },
                        {
                          "cursor-pointer":
                            positions.length < gridSize.data ||
                            positions.some((p) => p.i === i && p.j === j),
                        },
                      )}
                      onClick={(_e) => handleCellClick({ i, j })}
                    >
                      {positions.some((p) => p.i === i && p.j === j) && (
                        <FireIcon className="inline-block h-6 w-6" />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StrictMode>
  );
}

function fillGrid(n: GridSize, positions: Position[]): Position[] {
  // positions.length <= n

  const result: Position[] = [];

  const i_plus_j = new Set<number>();
  for (const { i, j } of positions) {
    i_plus_j.add((i + j) % n);
  }
  for (let k = 0; k < n; k++) {
    if (i_plus_j.size < positions.length && !i_plus_j.has(k)) {
      i_plus_j.add(k);
    }
  }
  // Set -> Array にしてごまかす
  // Type 'Set<number>' can only be iterated through when using the '--downlevelIteration' flag or with a '--target' of 'es2015' or higher.
  for (const k of Array.from(i_plus_j)) {
    for (let i = 0; i < n; i++) {
      const j = (n + k - i) % n;
      result.push({ i, j });
    }
  }

  return result;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
