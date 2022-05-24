import { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { when } from 'iter-tools-es';
// @ts-ignore-error
import { debugPrint } from '@iter-tools/regex/internal/debug';

const computeViewbox = (svg) => {
  const parentBox = svg.node().parentElement.getBoundingClientRect();
  const idealBox = document.getElementById('ideal_viewbox')?.getBoundingClientRect()!;

  const topPadding = idealBox.top - parentBox.top;

  // To root is 0,0
  const leftExtent = -idealBox.left - 8;
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
  const dx = 70;
  const dy = 200;
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
      .attr("stroke-width", 3)
    .selectAll("path")
      .data(root.links())
      .join("path")
        .attr("d", d3.linkHorizontal()
            .x((d: any) => d.y + 80)
            .y((d: any) => d.x));

  // prettier-ignore
  const Gs = svg.select("g[data-selector=\"second\"]")
    .selectAll('g')
    .data(root.descendants())
    .join("g")
      .attr("transform", d => `translate(${d.y},${d.x})`);

  // prettier-ignore
  Gs.selectAll('rect')
  .data(_ => [_])
  .join('rect')
    .attr("width", '140px')
    .attr("height", '3em')
    .attr('rx', 6)
    .attr('ry', 6)
    .attr("fill", '#fff')
    .attr("y", '-1.5em')
    .attr("stroke", '#555')
    .attr("stroke-width", 3);

  // prettier-ignore
  Gs
    .selectAll('text')
    .data(d => {
      const type = Object.getPrototypeOf(d.data).constructor.name;
      const isUnmatchedSequence = d.data.next?.name === 'unmatched';
      return [
        {
          ...d,
          text: type,
          weight: 'bold',
          style: 'normal',
          dy: '-.3em',
        },
        ...when(type === 'Sequence', () => [{
          ...d,
          text: isUnmatchedSequence ? 'unmatched' : debugPrint(d.data.next),
          weight: 'normal',
          style: isUnmatchedSequence ? 'italic' : 'normal',
          dy: '.9em',
        }]),
      ];
    })
    .join('text')
      .attr('y', d => d.dy)
      .attr('x', '70px')
      .attr('font-weight', d => d.weight)
      .attr('font-style', d => d.style)
      .attr('text-anchor', 'middle')
      .text(d => d.text)

  return svg.node();
}

export const StateTree = ({ engine, style }) => {
  if (!engine) return null;

  const ref = useRef(null);

  useEffect(() => {
    const onResize = () => {
      computeViewbox(d3.select(ref.current));
    };
    window.addEventListener('resize', onResize);
    Tree(d3.select(ref.current), engine.root);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [ref.current, engine.root, engine.index, engine.width]);

  return (
    <svg ref={ref} style={style}>
      <g data-selector="pan">
        <g data-selector="first" />
        <g data-selector="second" />
      </g>
    </svg>
  );
};
