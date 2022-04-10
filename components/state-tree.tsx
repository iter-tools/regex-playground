import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
// @ts-ignore-error
import { debugPrint } from '@iter-tools/regex/internal/debug';

export const useD3 = (render, dependencies) => {
  const ref = useRef(null);

  useEffect(() => {
    render(d3.select(ref.current));
    return () => {};
  }, [ref.current, ...dependencies]);
  return ref;
};

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/tree
function Tree(
  svg,
  data,
  {
    // data is either tabular (array of objects) or hierarchy (nested objects)
    children, // if hierarchical data, given a d in data, returns its children
    padding = 1, // horizontal padding for first and last column
  }: any = {},
) {
  const root = d3.hierarchy(data, children);
  const { height, width } = svg.node().parentElement.getBoundingClientRect();

  // Compute the layout.
  const dx = 50;
  const dy = width / (root.height + padding);
  d3.tree().nodeSize([dx, dy])(root);

  // Center the tree.
  let x0 = Infinity;
  let x1 = -x0;
  root.each((d: any) => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
  });

  // prettier-ignore
  svg
      .attr('viewBox', [(-dy * padding) / 2, x0 - dx, width, height])
      .attr('font-family', 'sans-serif')
      .attr('font-size', 16);

  // prettier-ignore
  svg.select("g[data-selector=\"first\"]")
      .attr("fill", "none")
      .attr("stroke", '#555')
      .attr("stroke-width", 1.5)
    .selectAll("path")
      .data(root.links())
      .join("path")
        .attr("d", d3.linkHorizontal()
            .x((d: any) => d.y)
            .y((d: any) => d.x));

  // prettier-ignore
  const As = svg.select("g[data-selector=\"second\"]")
    .selectAll('a')
    .data(root.descendants())
    .join("a")
      .attr("transform", d => `translate(${d.y},${d.x})`);

  // prettier-ignore
  As
    .selectAll("circle")
    .data([_ => _])
    .join('circle')
      .attr("fill", d => d.children ? '#555' : '#999')
      .attr("r", 10);

  // prettier-ignore
  As
    .selectAll('text')
    .data(_ => [_])
    .join('text')
      .attr('dy', '0.32em')
      .attr('x', (d) => (d.children ? -16 : 16))
      .attr('text-anchor', (d) => (d.children ? 'end' : 'start'))
      .text((d, i) => {
        const type = Object.getPrototypeOf(d.data).constructor.name;
        if (type === 'Sequence') {
          return 'Sequence: ' + debugPrint(d.data.next);
        } else {
          return type;
        }
      })

  return svg.node();
}

export const StateTree = ({ engine, style }) => {
  if (!engine) return null;

  const svg = useD3(
    (svg) => {
      return Tree(svg, engine.root);
    },
    [engine.root, engine.index, engine.width],
  );

  return (
    <svg ref={svg} style={style}>
      <g data-selector="first" />
      <g data-selector="second" />
    </svg>
  );
};
