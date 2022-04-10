import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
// @ts-ignore-error
// import { debugPrint } from '@iter-tools/regex/internal/debug';

const _debugPrint = (matcher: any, sentinel: any): string | null => {
  if (matcher === null) return null;

  let m = matcher;
  let str = '';
  while (m !== null) {
    if (typeof matcher.match !== 'function') {
      throw new Error('debugPrint can only print matchers.');
    }

    switch (m.name) {
      case 'literal':
        str += m.value;
        break;
      case 'boundaryAssertion':
        str += '\\b';
        break;
      case 'edgeAssertion':
        str += m.kind === 'start' ? '^' : '$';
        break;
      case 'expression':
        str += `(${m.matchers.map((m: any) => _debugPrint(m, sentinel)).join('|')})`;
        break;
      case 'repeat':
        if (m.repeatCont.name !== 'unmatched') {
          str += `(${m.exprCont.seqs
            .map((m: any) => _debugPrint(m, m.next))
            .filter(Boolean)
            .join('|')})*`;
        }
        break;
      default:
        break;
    }

    if (m.next === sentinel) {
      return str === '' ? null : str;
    } else {
      m = m.next;
    }
  }
  return str;
};

const debugPrint = (matcher: any) => _debugPrint(matcher, null);

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
  const dy = 150;
  d3.tree().nodeSize([dx, dy])(root);

  // Center the tree.
  let x0 = Infinity;
  let x1 = -Infinity;
  let y0 = Infinity;
  let y1 = -Infinity;
  root.each((d: any) => {
    if (d.x > x1) x1 = d.x;
    if (d.x < x0) x0 = d.x;
    if (d.y > y1) y1 = d.y;
    if (d.y < y0) y0 = d.y;
  });

  const ideal = document.getElementById('ideal_viewbox')?.getBoundingClientRect()!;

  const viewBox = [x0 - ideal.left, y0 - dy - ideal.top, width, height];

  // prettier-ignore
  svg
      .attr('viewBox', viewBox)
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
