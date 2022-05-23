import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
// @ts-ignore-error
import { debugPrint } from '@iter-tools/regex/internal/debug';

export const useD3 = (render, dependencies) => {
  const ref = useRef(null);

  useEffect(() => {
    const onResize = () => {
      computeViewbox(d3.select(ref.current));
    };
    window.addEventListener('resize', onResize);
    render(d3.select(ref.current));
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [ref.current, ...dependencies]);
  return ref;
};

const computeViewbox = (svg) => {
  const parentBox = svg.node().parentElement.getBoundingClientRect();
  const idealBox = document.getElementById('ideal_viewbox')?.getBoundingClientRect()!;

  const topPadding = idealBox.top - parentBox.top;

  // To root is 0,0
  const leftExtent = -idealBox.left;
  const topExtent = -(topPadding + idealBox.height / 2);

  const viewBox = [leftExtent, topExtent, parentBox.width, parentBox.height];

  svg.attr('viewBox', viewBox);
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
  }: any = {},
) {
  const zoomGroup = svg.select('g[data-selector="pan"]');
  const zoom = d3
    .zoom()
    .scaleExtent([1, 1])
    .on('zoom', (event) => {
      zoomGroup.attr('transform', event.transform);
    });

  const root = d3.hierarchy(data, children);
  const dx = 50;
  const dy = 150;
  d3.tree().nodeSize([dx, dy])(root);

  computeViewbox(svg);
  svg.call(zoom);

  // prettier-ignore
  svg
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
      <g data-selector="pan">
        <g data-selector="first" />
        <g data-selector="second" />
      </g>
    </svg>
  );
};
