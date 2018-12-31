import React from "react";
import MarkdownText from "../MarkdownText";
import DocumentFrame from "../DocumentFrame";
import { OrdinalFrame } from "semiotic";
import theme from "../theme";

const gradient = (
  <linearGradient x1="0" x2="0" y1="0" y2="1" id="gradient">
    <stop stopColor={theme[0]} offset="0%" />
    <stop stopColor={theme[4]} offset="100%" />
  </linearGradient>
);

const trianglePattern = (
  <pattern id="triangle" width="10" height="10" patternUnits="userSpaceOnUse">
    <rect fill={theme[2]} width="10" height="10" />
    <circle fill={theme[4]} r="5" cx="3" cy="3" />
  </pattern>
);

const glowyCanvas = (canvas, context, size) => {
  const dataURL = canvas.toDataURL("image/png");
  const baseImage = document.createElement("img");

  baseImage.src = dataURL;
  baseImage.onload = () => {
    context.clearRect(0, 0, size[0] + 120, size[1] + 120);
    context.filter = "blur(10px)";
    context.drawImage(baseImage, 0, 0);
    context.filter = "blur(5px)";
    context.drawImage(baseImage, 0, 0);
    context.filter = "none";
    context.drawImage(baseImage, 0, 0);
  };
};

const frameProps = {
  size: [400, 200],
  // title: "Custom Pattern",
  data: [5, 8, 2, 3, 10, 5, 8, 2, 3, 10],
  type: "bar",
  style: (d, i) => ({ fill: i < 5 ? "url(#gradient)" : "url(#triangle)" }),
  additionalDefs: [trianglePattern, gradient],
  oPadding: 2,
  margin: 20
};

// {...barChartSettings}
// size={[350, 350]}
// title="Sketchy + Gradient"
// style={{ fill: "url(#paleWoodGradient)" }}
// additionalDefs={gradient}
// renderMode="sketchy"

const sketchyFrameProps = {
  ...frameProps,
  renderMode: "sketchy"
};

const paintyFrameProps = {
  ...frameProps,
  renderMode: "painty"
};

export default () => {
  return (
    <div>
      <MarkdownText
        text={`
      
Semiotic does a few things to make it easier for you to use textures, render viz in a sketchy way, or otherwise modify the appearance of your data visualization. Below you'll find examples for how to use textures, gradients and Semiotic's built-in sketchy rendering, painty rendering and canvas post-processing.

We'll get started with using textures for a visualization like this bar chart. You can use textures in a couple different ways:

Make your own textures by hand
Use a texture generating library like textures.js (or the react equivalent: vx/patterns)
This example uses both. Notice that textures are added to the defs of an SVG by adding them to the additionalDefs property of the frame and then referenced as the fill property of the items in the frame  
      
      `}
      />
      <DocumentFrame frameProps={frameProps} type={OrdinalFrame} useExpanded />

      <MarkdownText
        text={`
      
Under the hood, Semiotic uses the semiotic-mark library, which allows you to declare different render modes that can produce what's called non-photorealistic rendering, better known as "sketchy" rendering, as well as "painty" rendering. To enable this, you send the corresponding renderMode of the item you want rendered in a different fashion either "sketchy" or "painty" or a function that takes the item and returns "sketchy" or "painty". Sketchy fill density reflects the fillOpacity sent to the object, with higher opacity giving more fill lines.

1. XYFrame: pointRenderMode, areaRenderMode, lineRenderMode
1. OrdinalFrame: renderMode, summaryRenderMode
1. NetworkFrame: nodeRenderMode, edgeRenderMode
      
      `}
      />
      <DocumentFrame
        frameProps={sketchyFrameProps}
        type={OrdinalFrame}
        startHidden
      />
      <DocumentFrame
        frameProps={paintyFrameProps}
        type={OrdinalFrame}
        startHidden
      />

      <MarkdownText
        text={`
      
Except for summary types and custom shape types, frames can render their graphics in canvas. This can be useful to reduce the number of nodes in the DOM, which can show performance gains. Canvas graphics will not be animated.

XYFrame: canvasPoints, canvasAreas, canvasLines
OrdinalFrame: canvasPieces
NetworkFrame: canvasNodes, canvasEdges
Additionally the canvas itself can be used for post-processing effects using the frames canvasPostProcess property, which will be sent (canvas, context, size) is shown below using the demo "chuckClose" restyling (which does a fun Chuck Close style filter) and also a custom glow filter.
      `}
      />

      <OrdinalFrame
        {...frameProps}
        style={() => ({
          fill: theme[0],
          stroke: theme[0]
        })}
        canvasPieces={true}
        canvasPostProcess={"chuckClose"}
      />
      <OrdinalFrame
        {...frameProps}
        style={{ fill: theme[0] }}
        canvasPieces={true}
        canvasPostProcess={glowyCanvas}
      />
    </div>
  );
};