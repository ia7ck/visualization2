"use client";

import TextInput, { Hint, Input, Label } from "@/components/TextInput";
import { VSpace } from "@/components/VSpace";
import * as Slider from "@radix-ui/react-slider";
import clsx from "clsx";
import { StrictMode, useState } from "react";
import { z } from "zod";

const S_LENGTH_LIMIT = 15;

const StringToArray01 = z
  .string()
  .max(S_LENGTH_LIMIT)
  .transform((s) => s.split(""))
  .pipe(z.array(z.enum(["0", "1"])));
type Array01 = z.infer<typeof StringToArray01>;

const NumberPair = z.tuple([z.number(), z.number()]);
type NumberPair = z.infer<typeof NumberPair>;

export default function ABC341_E() {
  const [text, setText] = useState(StringToArray01.parse("10100"));
  const [checked, setChecked] = useState(true);
  const [range, setRange] = useState<NumberPair>([1, text.length]);

  const diff = adjacentDifference(text);
  const flipEnabled = checked && text.length >= 2;

  function handleTextChange(e: React.ChangeEvent<HTMLInputElement>) {
    const result = StringToArray01.safeParse(e.target.value);
    if (result.success) {
      const newText = result.data;
      setText(newText);
      setRange([
        clamp(range[0], 1, newText.length),
        clamp(range[1], 1, newText.length),
      ]);
    }
  }

  function handleSliderValueChange(value: number[]) {
    const newRange = NumberPair.parse(value);
    setRange(newRange);
  }

  return (
    <StrictMode>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
        Problem
      </h1>
      <a
        className="inline-block mt-2 leading-6 text-indigo-600 hover:text-indigo-500"
        href="https://atcoder.jp/contests/abc341/tasks/abc341_e"
        target="blank"
      >
        ABC341 E - Alternating String
      </a>
      <VSpace size="M" />
      <TextInput>
        <Label>
          Problem input <var>S</var>
        </Label>
        <Input
          type="number"
          inputMode="numeric"
          value={text.join("")}
          onChange={handleTextChange}
        />
        <Hint>
          S<sub>i</sub> ∈ &#123;0, 1&#125;, S.length ≦ {S_LENGTH_LIMIT}
        </Hint>
      </TextInput>
      <div className="relative mt-2 flex items-start">
        <div className="flex h-6 items-center">
          <input
            id="flip_01"
            name="flip_01"
            type="checkbox"
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
            checked={checked}
            onChange={() => setChecked(!checked)}
          />
        </div>
        <div className="ml-2 text-sm leading-6">
          <label htmlFor="flip_01" className="font-medium text-gray-900">
            flip 0/1
          </label>
        </div>
      </div>
      <div className="sm:flex sm:items-center mt-8">
        <div className="sm:w-20 sm:text-sm font-medium text-gray-900">L, R</div>
        <form className="w-full">
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-6"
            disabled={!flipEnabled}
            min={1}
            max={text.length}
            step={1}
            value={range}
            onValueChange={handleSliderValueChange}
          >
            <Slider.Track className="relative grow rounded-full h-1 bg-slate-100">
              <Slider.Range className="absolute bg-indigo-500 rounded-full h-full data-[disabled]:bg-slate-200" />
            </Slider.Track>
            <Slider.Thumb className="block w-5 h-5 bg-indigo-500 rounded-full hover:bg-indigo-600 focus:outline-none cursor-pointer data-[disabled]:bg-slate-200 data-[disabled]:cursor-default" />
            <Slider.Thumb className="block w-5 h-5 bg-indigo-500 rounded-full hover:bg-indigo-600 focus:outline-none cursor-pointer data-[disabled]:bg-slate-200 data-[disabled]:cursor-default" />
          </Slider.Root>
        </form>
      </div>
      <div className="sm:flex sm:items-center mt-5">
        <div className="sm:w-20 sm:text-sm font-medium text-gray-900">S</div>
        <div className="flex justify-between w-full mt-1 sm:mt-0">
          {text.map((v, index) => {
            const inRange = range[0] <= index + 1 && index + 1 <= range[1];
            return (
              <span
                className={clsx(
                  "inline-flex items-center rounded-md px-2 py-1 text-2xl font-medium",
                  flipEnabled && inRange && "bg-red-100 text-red-700",
                )}
                // biome-ignore lint/suspicious/noArrayIndexKey: uum...
                key={index}
              >
                {flipEnabled && inRange ? (v === "0" ? "1" : "0") : v}
              </span>
            );
          })}
        </div>
      </div>
      <div className="sm:flex sm:items-center mt-3">
        <div className="sm:w-20 sm:text-sm font-medium text-gray-900">
          S<sub>i</sub> xor S<sub>i+1</sub>
        </div>
        <div className="flex justify-evenly w-full mt-1 sm:mt-0">
          {diff.map((v, index) => {
            const rangeBound =
              index + 1 === range[0] - 1 || index + 1 === range[1];
            return (
              <span
                className={clsx(
                  "inline-flex items-center rounded-md px-2 py-1 text-2xl font-medium",
                  flipEnabled && rangeBound && "bg-red-100 text-red-700",
                )}
                // biome-ignore lint/suspicious/noArrayIndexKey: uum...
                key={index}
              >
                {flipEnabled && rangeBound ? (v === "0" ? "1" : "0") : v}
              </span>
            );
          })}
        </div>
      </div>
    </StrictMode>
  );
}

function adjacentDifference(text: Array01): Array01 {
  const result: Array01 = [];
  for (let i = 0; i + 1 < text.length; i++) {
    if (text[i] === text[i + 1]) {
      result.push("0");
    } else {
      result.push("1");
    }
  }
  return result;
}

function clamp(x: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, x));
}
