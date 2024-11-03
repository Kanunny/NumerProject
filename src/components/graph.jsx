import React, { useEffect, useState } from "react";
import Plot from "react-plotly.js";

function Graph({ data, methodName }) {
  const [plotData, setPlotData] = useState([]); // Changed from `data` to `plotData` to avoid confusion
  const [layout, setLayout] = useState({});
  const [config, setConfig] = useState({});

  useEffect(() => {
    // Check if methodName is valid and set the plotData accordingly
    if (['Bisection', 'False Position', 'Graphical'].includes(methodName)) {
      setPlotData([
        {
          x: data.map((row) => row.Iteration),
          y: data.map((row) => row.Xm),
          type: "scatter",
          mode: "lines+markers",
          name: "Xm",
          marker: { color: "blue" },
        },
      ]);
    } else if (methodName === 'Newton Raphson') {
      setPlotData([
        {
          x: data.map((row) => row.xNew),
          y: data.map((row) => row.xOld),
          type: "scatter",
          mode: "lines+markers",
          name: "Xm",
          marker: { color: "blue" },
        },
        {
          x: data.map((row) => row.X0),
          y: data.map((row) => row.Error), // Assuming Error is a valid property
          type: "scatter",
          mode: "lines+markers",
          name: "Error",
          marker: { color: "red" },
        },
      ]);
    }
  }, [data, methodName]);

  useEffect(() => {
    // Set layout for the plot
    setLayout({
      xaxis: {
        title: 'iter,Xm',
        zeroline: true,
        showlegend: true,
      },
      yaxis: {
        title: 'f(X)',
        zeroline: true,
        showlegend: true,
      },
      autosize: true,
      margin: { l: 40, r: 10, t: 40, b: 40 },
    });

    // Set configuration for the plot
    setConfig({
      responsive: true,
      displayModeBar: true,
      modeBarButtonsToRemove: ['zoom2d', 'boxsec'],
      displaylogo: false,
      modeBarButtonsToAdd: ['drawline'],
      scrollZoom: true,
      dragmode: 'pan',
    });
  }, []);

  // Render the plot when plotData changes
  return (
    <>
      <div>
        <h1 className="flex justify-center">Graph - {methodName}</h1>
      </div>
      <Plot
        data={plotData}
        layout={layout}
        config={config}
        className="w-[800px] h-[1000px] sm:h-80 rounded-lg"
      />
    </>
  );
}

export default Graph;
