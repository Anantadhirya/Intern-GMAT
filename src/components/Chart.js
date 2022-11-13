import Plot from "react-plotly.js";

export default function Chart({
  x = [],
  y = [],
  title = "Chart",
  lineColor = "red",
}) {
  return (
    <Plot
      data={[
        {
          x: x,
          y: y,
          mode: "lines",
          line: { color: lineColor },
        },
      ]}
      layout={{ width: 400, height: 300, title: title }}
    />
  );
}
