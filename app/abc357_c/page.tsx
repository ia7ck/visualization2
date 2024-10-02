"use client";

import TextInput, { Hint, Input, Label } from "@/components/TextInput";
import { VSpace } from "@/components/VSpace";
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

      <VSpace size="M" />

      <TextInput invalid={!carpetLevel.success}>
        <Label>
          Carpet level <var>N</var>
        </Label>
        <Input
          type="number"
          inputMode="numeric"
          min={N_MIN}
          max={N_MAX}
          value={carpetLevelText}
          onChange={handleInputChange}
        />
        <Hint>
          {N_MIN} ≦ N ≦ {N_MAX}
        </Hint>
      </TextInput>

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
