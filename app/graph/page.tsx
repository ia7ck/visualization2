"use client";

import { VSpace } from "@/components/VSpace";
import type cytoscape from "cytoscape";
import { useRef, useState } from "react";
import CytoscapeComponent from "react-cytoscapejs";
import { parseGraph } from "./parse";

export default function Graph() {
  const cyRef = useRef<cytoscape.Core>();
  const [graphText, setGraphText] = useState("");
  const [elements, setElements] = useState<cytoscape.ElementDefinition[]>([]);

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const graph = parseGraph(value);
    if (graph !== null) {
      const width = cyRef.current?.width() ?? 0;
      const height = cyRef.current?.height() ?? 0;
      const newElements: typeof elements = [];
      for (let i = 1; i <= graph.n; i++) {
        newElements.push({
          data: { id: `${i}`, label: `Node ${i}` },
          renderedPosition: {
            x: (Math.random() + 0.5) * (width / 2),
            y: (Math.random() + 0.5) * (height / 2),
          },
        });
      }
      for (const e of graph.edges) {
        newElements.push({ data: { source: `${e.from}`, target: `${e.to}` } });
      }
      setElements(newElements);
    }
    setGraphText(value);
  };

  return (
    <>
      <textarea value={graphText} onChange={handleTextAreaChange} />
      <div />
      <button
        type="button"
        onClick={() => {
          cyRef.current?.layout({ name: "random" }).run();
        }}
      >
        layout
      </button>
      <CytoscapeComponent
        className="border"
        cy={(cy) => {
          cyRef.current = cy;
        }}
        elements={elements}
        style={{ width: "100%", height: "80vh" }}
      />
      <VSpace size="L" />
    </>
  );
}
