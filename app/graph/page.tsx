"use client";

import clsx from "clsx";
import { useRef, useState } from "react";

import type cytoscape from "cytoscape";
import CytoscapeComponent from "react-cytoscapejs";

import { VSpace } from "@/components/VSpace";
import { parseGraph } from "./parse";

export default function Graph() {
  const layouts = ["random", "grid", "circle"] as const;
  type Layout = (typeof layouts)[number];
  const indexings = ["0-indexed", "1-indexed"] as const;
  type Indexing = (typeof indexings)[number];

  const cyRef = useRef<cytoscape.Core>();
  const [graphText, setGraphText] = useState("3\n1 2");
  const [layout, setLayout] = useState<Layout>("random");
  const [indexing, setIndexing] = useState<Indexing>("1-indexed");
  const [elements, setElements] = useState<cytoscape.ElementDefinition[]>([
    { data: { id: "1" }, renderedPosition: { x: 50, y: 50 } },
    { data: { id: "2" }, renderedPosition: { x: 100, y: 150 } },
    { data: { id: "3" }, renderedPosition: { x: 200, y: 100 } },
    { data: { source: "1", target: "2" } },
  ]);

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    updateElements(value, { indexing });
    setGraphText(value);
  };

  const handleLayoutChange = (ly: Layout) => {
    setLayout(ly);
    cyRef.current?.layout({ name: ly }).run();
  };

  const handleIndexingChange = (ind: Indexing) => {
    setIndexing(ind);
    updateElements(graphText, { indexing: ind });
  };

  const updateElements = (text: string, option: { indexing: Indexing }) => {
    const graph = parseGraph(text, {
      indexStart: option.indexing,
    });
    if (graph.ok) {
      const newElements: typeof elements = [];
      const width = cyRef.current?.width() ?? 300;
      const height = cyRef.current?.height() ?? 400;
      for (let i = 1; i <= graph.data.n; i++) {
        newElements.push({
          data: { id: option.indexing === "0-indexed" ? `${i - 1}` : `${i}` },
          renderedPosition: {
            x: (Math.random() + 0.5) * (width / 2),
            y: (Math.random() + 0.5) * (height / 2),
          },
        });
      }
      for (const e of graph.data.edges) {
        newElements.push({ data: { source: `${e.from}`, target: `${e.to}` } });
      }
      setElements(newElements);
    }
  };

  // invalid を state にしたほうがいい？
  const invalid = parseGraph(graphText, { indexStart: indexing }).ok === false;

  return (
    <>
      <label
        htmlFor="graph-text"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Graph Input
      </label>
      <div className="mt-2">
        <textarea
          id="graph-text"
          rows={4}
          className={clsx(
            "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6",
            invalid && "text-red-900 ring-red-300 focus:ring-red-500",
          )}
          value={graphText}
          onChange={handleTextAreaChange}
        />
      </div>
      <VSpace size="M" />
      <fieldset>
        <legend className="text-sm font-semibold leading-6 text-gray-900">
          Layout
        </legend>
        <div className="mt-2 space-y-2 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
          {layouts.map((ly) => (
            <div key={ly} className="flex items-center">
              <input
                id={ly}
                type="radio"
                checked={ly === layout}
                onChange={() => handleLayoutChange(ly)}
                className={clsx(
                  "h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600",
                  invalid && "cursor-not-allowed opacity-50",
                )}
              />
              <label
                htmlFor={ly}
                className={clsx(
                  "ml-3 block text-sm font-medium leading-6 text-gray-900",
                  invalid && "cursor-not-allowed text-opacity-50",
                )}
              >
                {ly}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
      <VSpace size="M" />
      <fieldset>
        <legend className="text-sm font-semibold leading-6 text-gray-900">
          Indexing
        </legend>
        <div className="mt-2 space-y-2 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
          {indexings.map((ind) => (
            <div key={ind} className="flex items-center">
              <input
                id={ind}
                type="radio"
                checked={ind === indexing}
                disabled={invalid}
                onChange={() => handleIndexingChange(ind)}
                className={clsx(
                  "h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600",
                  invalid && "cursor-not-allowed opacity-50",
                )}
              />
              <label
                htmlFor={ind}
                className={clsx(
                  "ml-3 block text-sm font-medium leading-6 text-gray-900",
                  invalid && "cursor-not-allowed text-opacity-50",
                )}
              >
                {ind}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
      <VSpace size="L" />
      <CytoscapeComponent
        className="border"
        cy={(cy) => {
          cyRef.current = cy;
        }}
        elements={elements}
        style={{ width: "100%", height: "80vh" }}
        stylesheet={[
          {
            selector: "node",
            style: {
              label: "data(id)",
              color: "white",
              "text-halign": "center",
              "text-valign": "center",
            },
          },
        ]}
      />
      <VSpace size="L" />
    </>
  );
}
