export const chartArea = {
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
export const yScalePlugin = {
  id: "yScalePlugin",
  afterDraw(chart, args, options) {
    const {
      ctx,
      chartArea: { top },
    } = chart;
    ctx.save();
    ctx.font = "bolder 14px Arial";
    ctx.fillStyle = options.fontColor;
    ctx.fillText(options.text, 3, top - 15);
    ctx.restore();
  },
};
