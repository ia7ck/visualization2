"use client";

import clsx from "clsx";
import { StrictMode, useState } from "react";
import { z } from "zod";

const N_MIN = 0;
const N_MAX = 4;

const CarpetLevel = z.coerce.number().int().min(N_MIN).max(N_MAX);
type CarpetLevel = z.infer<typeof CarpetLevel>;

export default function ABC357_C() {
  const [carpetLevelText, setCarpetLevelText] = useState("2");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCarpetLevelText(value);
  };

  const carpetLevel = CarpetLevel.safeParse(carpetLevelText);

  return (
    <StrictMode>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        Problem
      </h1>
      <a
        className="inline-block mt-2 leading-6 text-indigo-600 hover:text-indigo-500"
        href="https://atcoder.jp/contests/abc357/tasks/abc357_c"
        target="blank"
      >
        ABC357 C - Sierpinski carpet
      </a>

      <label
        htmlFor="carpet_level"
        className="block mt-5 text-sm font-medium leading-6 text-gray-900"
      >
        Carpet level <var>N</var>
      </label>
      <input
        name="carpet_level"
        id="carpet_level"
        type="number"
        min={N_MIN}
        max={N_MAX}
        inputMode="numeric"
        className={clsx(
          "block w-full rounded-md border-0 mt-2 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
          {
            "text-red-900 ring-red-300 focus:ring-red-500":
              !carpetLevel.success,
          },
        )}
        value={carpetLevelText}
        onChange={(e) => handleInputChange(e)}
      />

      <p
        className={clsx("mt-2 text-sm text-gray-500", {
          "text-red-600": !carpetLevel.success,
        })}
      >
        {N_MIN} ≦ N ≦ {N_MAX}
      </p>

      {carpetLevel.success && (
        <div className="grid place-items-center mt-4 mb-8">
          {range(0, 3 ** carpetLevel.data - 1).map((i) => (
            <div
              key={i}
              className="grid grid-flow-col place-items-start border-t last:border-b border-gray-400"
            >
              {range(0, 3 ** carpetLevel.data - 1).map((j) => (
                <div
                  key={j}
                  className={clsx(
                    "grid place-items-center border-l last:border-r border-gray-400",
                    carpetLevel.data <= 3
                      ? "h-3 w-3 sm:h-5 sm:w-5"
                      : "h-1 w-1 sm:h-2 sm:w-2",
                    range(1, carpetLevel.data).some(
                      (l) => kth(i, l - 1) === 1 && kth(j, l - 1) === 1,
                    )
                      ? "bg-white"
                      : "bg-slate-900",
                  )}
                />
              ))}
            </div>
          ))}
        </div>
      )}
    </StrictMode>
  );
}

// 3進数でk桁目の数
function kth(n: number, k: number): number {
  return Math.floor(n / 3 ** k) % 3;
}

function range(start: number, end: number): number[] {
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}
