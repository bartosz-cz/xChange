import React, { useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  Tooltip,
  Legend,
  registerables,
} from "chart.js";
import { Line } from "react-chartjs-2";
import classnames from "classnames";

// Register necessary components for Line chart
ChartJS.register(
  ...registerables,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineController,
  Tooltip,
  Legend
);

const LineChart = ({ data, labels, title, styleClass, color, isReady }) => {
  const chartRef = useRef(null);

  const verticalLine = {
    id: "verticalLine",
    beforeInit(chart) {
      chart.crosshair = { x: null, y: null, active: false };

      chart.canvas.addEventListener("mousemove", (event) => {
        const rect = chart.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        chart.crosshair.x = x;
        chart.crosshair.active = true;
        chart.draw();
      });

      chart.canvas.addEventListener("mouseleave", () => {
        chart.crosshair.active = false;
        chart.draw();
      });
    },
    afterDraw(chart) {
      if (!chart.crosshair.active || chart.crosshair.x === null) return;

      const ctx = chart.ctx;
      const x = chart.crosshair.x;
      const yAxes = chart.scales.y;
      const xAxes = chart.scales.x;

      // Find the closest point and draw lines
      let minDistance = Number.MAX_VALUE;
      let closestPoint = null;
      let dataValue = null;
      let labelValue = null;

      chart.data.datasets.forEach((dataset, i) => {
        dataset.data.forEach((value, j) => {
          const pointX = xAxes.getPixelForValue(j, j, i);
          const distance = Math.abs(x - pointX);
          if (distance < minDistance) {
            minDistance = distance;
            closestPoint = {
              x: pointX,
              y: yAxes.getPixelForValue(value),
            };
            dataValue = formatNumber(format(value));
            //  let shortNotation = format(value);

            //return formatNumber(shortNotation);
            labelValue = chart.data.labels[j];
          }
        });
      });

      if (!closestPoint) return;

      // Draw vertical line
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(closestPoint.x, yAxes.top);
      ctx.lineTo(closestPoint.x, yAxes.bottom);
      ctx.strokeStyle = "#ffe8ff";
      ctx.setLineDash([5, 3]);
      ctx.stroke();

      // Draw horizontal line
      ctx.beginPath();
      ctx.moveTo(xAxes.left, closestPoint.y);
      ctx.lineTo(xAxes.right, closestPoint.y);
      ctx.stroke();

      const textY = `${labelValue}`;
      const textX = `${dataValue}`;
      ctx.font = "bolder 14px Arial";
      ctx.textBaseline = "top";

      // Calculate text width and padding
      const padding = 4;
      const textWidthY = ctx.measureText(textY).width;
      const textWidthX = ctx.measureText(textX).width;
      const textHeight = parseInt("14px Arial", 10); // Rough height of one line of text

      // Draw background rectangle for vertical line text
      ctx.fillStyle = "#563964"; // Semi-transparent white

      const rectX =
        closestPoint.x + 5 - (textWidthY + 2 * padding) / 2 - padding;
      const rectY = yAxes.bottom + 10 - padding;
      const rectWidth = textWidthY + 2 * padding;
      const rectHeight = textHeight + 2 * padding;

      drawRoundedRect(ctx, rectX, rectY, rectWidth, rectHeight, 8);

      // Draw background rectangle for horizontal line text
      const rectX2 = xAxes.left - 10 - textWidthX - padding;
      const rectY2 = closestPoint.y - textHeight / 2 - padding;
      const rectWidth2 = textWidthX + 2 * padding;
      const rectHeight2 = textHeight + 2 * padding;

      drawRoundedRect(ctx, rectX2, rectY2, rectWidth2, rectHeight2, 8);

      // Draw text over the rectangle
      ctx.fillStyle = "#ffe8ff"; // Text color
      ctx.fillText(
        textY,
        closestPoint.x + 4 - (textWidthY + 2 * padding) / 2,
        yAxes.bottom + 11
      );
      ctx.fillText(
        textX,
        xAxes.left - 10 - textWidthX,
        closestPoint.y - textHeight / 2 + 1
      );

      ctx.restore();
    },
  };

  function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    ctx.fill();
  }

  const chartArea = {
    id: "chartArea",
    beforeDraw(chart, args, options) {
      const {
        ctx,
        chartArea: { left, top, width, height },
      } = chart;
      ctx.save();
      ctx.fillStyle = options.backgroundColor;
      ctx.fillRect(left, top, width, height);
      ctx.strokeStyle = options.borderColor;
      ctx.lineWidth = options.borderWidth;
      ctx.setLineDash(options.borderDash || []);
      ctx.lineDashOffset = options.borderDashOffset;
      ctx.strokeRect(left, top, width, height);
      ctx.restore();
    },
  };

  const yScalePlugin = {
    id: "yScalePlugin",
    afterDraw(chart) {
      const {
        ctx,
        chartArea: { top, left },
      } = chart;
      if (!chartArea) {
        console.log("Chart area is undefined.");
        return;
      }

      ctx.save();
      ctx.font = "bolder 10px Arial";
      ctx.fillStyle = chart.options.plugins.yScalePlugin.fontColor || "#000";
      ctx.fillText(
        chart.options.plugins.yScalePlugin.text || "$",
        left - 9,
        top
      );
      ctx.restore();
    },
  };

  const GradientPlugin = {
    id: "GradientPlugin",
    afterLayout: (chart, args, options) => {
      const ctx = chart.ctx;
      const chartArea = chart.chartArea;
      if (!chartArea) {
        return;
      }
      const centerX = chart.width / 2;
      const centerY =
        options.type === "Radial"
          ? chart.height / 6
          : chart.height / 6 - chart.height * 0.2;
      const radius =
        options.type === "Radial"
          ? Math.min(chart.width, chart.height)
          : chart.width * 0.8;
      const gradient = ctx.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        radius
      );
      gradient.addColorStop(0, options.color);
      gradient.addColorStop(0.9, options.color + "00");
      chart.data.datasets[0].backgroundColor = gradient;

      var gradientStroke = ctx.createLinearGradient(4, 0, 11, 0);
      gradientStroke.addColorStop(0, options.color + "00");
      gradientStroke.addColorStop(1, options.color);
      chart.data.datasets[0].borderColor = gradientStroke;
    },
  };

  const allData =
    styleClass !== "MainChart"
      ? {
          labels,
          datasets: [
            {
              label: title,
              data,
              fill: true,
              tension: 0.5,
              pointRadius: 0,
              borderColor: color,
              backgroundColor: color,
            },
          ],
        }
      : {
          labels,
          datasets: [
            {
              label: title,
              data,
              fill: true,
              tension: 0.5,
              pointRadius: 0,
              pointBorderColor: "#ffe8ff00",
              pointBackgroundColor: "#ffe8ff00",
              borderColor: color,
              backgroundColor: color,
            },
          ],
        };

  const options =
    styleClass !== "MainChart"
      ? {
          scales: {
            x: { display: false },
            y: { display: false, beginAtZero: false },
          },
          plugins: {
            legend: { display: false },
            tooltip: { enabled: false },
            GradientPlugin: {
              color: color,
              type: "Radial",
            },
          },
          maintainAspectRatio: false,
        }
      : {
          layout: {
            padding: {
              right: 23, // Sets 50 pixels of padding on the right side of the chart
            },
          },
          scales: {
            x: {
              grid: { color: "#001c1f00" },
              ticks: {
                color: "#ffe8ff",
                font: { weight: "bolder", size: "12px" },
                autoSkip: true,
                maxRotation: 0,
                autoSkipPadding: 10,
              },
            },
            y: {
              afterFit: function (scaleInstance) {
                // Adjust the width of the scale to add padding
                scaleInstance.width = scaleInstance.width + 10; // Add 20px of padding to the left of Y-axis labels
              },
              grid: { color: "#15081d" },
              ticks: {
                color: "#ffe8ff",
                font: { weight: "bolder", size: "12px" },
                callback: function (value) {
                  let shortNotation = format(value);

                  return formatNumber(shortNotation);
                },
                autoSkip: true,
                maxRotation: 0,
                autoSkipPadding: 10,
              },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              enabled: false,
              displayColors: false,
              callbacks: {
                label: function (tooltipItem) {
                  const data = tooltipItem.dataset.data[tooltipItem.dataIndex]; // Accessing the data
                  return formatNumber(data) + "$";
                },
              },
            },
            GradientPlugin: {
              color: color,
            },
            yScalePlugin: {
              fontColor: "#ffe8ff",
              text: "$",
            },
            chartArea: {
              borderColor: "#15081d",
              borderWidth: 1,
              backgroundColor: "#ffe8ff00",
            },
          },
          maintainAspectRatio: false,
        };

  const plugins =
    styleClass !== "MainChart"
      ? [GradientPlugin]
      : [GradientPlugin, chartArea, yScalePlugin, verticalLine];

  return (
    <div className={classnames(styleClass, "d-flex", "flex-fill")}>
      <Line ref={chartRef} data={allData} options={options} plugins={plugins} />
    </div>
  );
};

function formatNumber(number) {
  const parts = number.toString().split(".");
  // Check if there is a fractional part
  if (parts.length < 2 || !parseInt(parts[1])) {
    // If there is no fractional part or fractional part is zero, return the number as a string
    return number.toString();
  }

  // Match leading zeros in the fractional part
  const matches = parts[1].match(/^0+/);
  if (matches) {
    const zerosCount = matches[0].length; // Number of leading zeros
    const significantDigits = parts[1].substring(zerosCount); // Digits after zeros
    if (zerosCount >= 3) {
      // Apply subscript notation only if there are at least 3 leading zeros
      const subscriptZeros = zerosCount
        .toString()
        .split("")
        .map((digit) => String.fromCharCode(8320 + Number(digit)))
        .join("");
      return `0.0${subscriptZeros}${significantDigits}`;
    }
  }

  // If there are fewer than 3 leading zeros, or other special formatting needs, return the number as is
  return parts[0] + "." + parts[1];
}

function format(value) {
  if (value === 0) {
    return "0"; // Directly handle zero
  }

  // Determine the order of magnitude of the number
  const magnitude = Math.floor(Math.log10(Math.abs(value)));

  // Format based on the magnitude
  if (magnitude < 3) {
    // For small numbers, use precision
    return Number(value).toPrecision(3); // Ensures three significant digits
  } else if (magnitude < 6) {
    // For medium size numbers, reduce to two decimal places
    return Number(value).toFixed(0);
  } else {
    // For large numbers, use thousands, millions, etc.
    const suffixes = ["", "K", "M", "B", "T"];
    let suffixIndex = 0;
    let scaledValue = value;
    while (Math.abs(scaledValue) >= 1000 && suffixIndex < suffixes.length - 1) {
      suffixIndex++;
      scaledValue /= 1000;
    }
    return scaledValue.toFixed(1) + suffixes[suffixIndex]; // Rounds and adds appropriate suffix
  }
}

export default LineChart;
