import React from "react";
import DocumentFrame from "../DocumentFrame";
import { NetworkFrame } from "semiotic";
import theme from "../theme";
import MarkdownText from "../MarkdownText";
import { flextree } from "d3-flextree";
// const ROOT = process.env.PUBLIC_URL;
// console.log(flextree);
const tree = {
  name: "root",
  height: 25,
  width: 100,
  children: [
    {
      name: "a",
      height: 40,
      width: 40,
      children: [
        {
          name: "b",
          height: 80,
          width: 40,
          children: [
            {
              name: "c",
              height: 40,
              width: 100,
              children: [{ name: "d", height: 200, width: 40 }]
            }
          ]
        }
      ]
    },
    {
      name: "e",
      height: 40,
      width: 40,
      children: [
        {
          name: "f",
          height: 40,
          width: 40,
          children: [
            {
              name: "g",
              height: 40,
              width: 200,
              children: [
                { name: "h", height: 60, width: 30 },
                { name: "h1", height: 80, width: 30 },
                { name: "h2", height: 40, width: 30 }
              ]
            }
          ]
        }
      ]
    },
    {
      name: "i",
      height: 40,
      width: 40,
      children: [
        {
          name: "j",
          height: 40,
          width: 100,
          children: [{ name: "k", height: 200, width: 40 }]
        }
      ]
    }
  ]
};

const colors = ["#00a2ce", "#b6a756", "#4d430c", "#b3331d"];

const flexLayoutSize = [700, 700];
//Because flextree returns nodes spaced in a way unlike the standard d3-hierarchy layouts, we need to pass a custom function to the networkType zoom prop. That function is passed (nodes, size) and you can adjust the position of the nodes accordingly
const flextreeZoom = (nodes, size) => {
  const minX = Math.min(...nodes.map(node => node.x - node.width / 2));
  const maxX = Math.max(...nodes.map(node => node.x + node.width / 2));
  const minY = Math.min(...nodes.map(node => node.y - node.height / 2));
  const maxY = Math.max(...nodes.map(node => node.y + node.height / 2));

  const xScalingFactor = size[0] / (maxX - minX);
  const yScalingFactor = size[1] / (maxY - minY);

  nodes.forEach(node => {
    //This is enough to display on screen
    node.x = node.x + Math.abs(minX);
    //But if you wanted to zoom-to-fit you can do this:
    node.x = node.x * xScalingFactor;
    node.data.width = node.data.width * xScalingFactor;
    node.y = node.y * yScalingFactor;
    node.data.height = node.data.height * yScalingFactor;
  });
};

const frameProps = {
  size: flexLayoutSize,
  edges: tree,
  edgeStyle: d => ({
    fill: colors[d.source.depth],
    stroke: colors[d.source.depth],
    strokeWidth: 5,
    opacity: 0.5
  }),
  nodeIDAccessor: "name",
  hoverAnnotation: true,
  customNodeIcon: ({ d }) => {
    return (
      <rect
        x={d.x - d.data.width / 2}
        y={d.y - 10}
        height={d.data.height - 10}
        width={d.data.width}
        fill="orange"
        stroke="gold"
      />
    );
  },
  networkType: {
    zoom: flextreeZoom,
    type: "tree",
    layout: flextree(),
    nodeSize: d => [d.data.width, d.data.height],
    spacing: 10
  },
  margin: 50
};

const overrideProps = {
  title: `(
    <text textAnchor="middle">
      Weekly(1-52) Box Office Totals from <tspan fill={
        theme[0]}
      >2016</tspan> -
      mid <tspan fill={theme[2]}>2017</tspan>
    </text>
  )`,
  tooltipContent: `d => (
    <div>
      {d.date} - {Math.round(d.total / 1000000)}m
    </div>
  )
  `,
  foregroundGraphics: ` [
    <g transform="translate(440, 73)" key="legend">
      <text key={1} fill={theme[0]}>
        New York
      </text>
      <text key={1} y={20} fill={theme[1]}>
        Las Vegas
      </text>
      <text key={1} y={40} fill={theme[2]}>
        San Diego
      </text>
      <text key={1} y={60} fill={theme[3]}>
        Denver
      </text>
      <text key={1} y={80} fill={theme[4]}>
        Oakland
      </text>
    </g>
  ]`
};

export default function SwarmPlot() {
  return (
    <div>
      <MarkdownText
        text={`

A way to show change between two points in time. 

`}
      />
      <DocumentFrame
        frameProps={frameProps}
        overrideProps={overrideProps}
        type={NetworkFrame}
        pre={`
const theme = ${JSON.stringify(theme)}          
          `}
        useExpanded
      />
    </div>
  );
}
