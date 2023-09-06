const echarts = require("echarts");
const { createCanvas, registerFont } = require("canvas");
const fs = require("fs");

registerFont("arial.ttf", { family: "arial" });
registerFont("msyhl.ttc", { family: "msyhl" });

module.exports = function (config, res) {
  const width = parseInt(config.width, 10) || 500;
  const height = parseInt(config.height, 10) || 500;
  const canvas = createCanvas(width, height);

  echarts.setPlatformAPI(function () {
    return canvas;
  });

  const option = {
    title: { text: "test" },
    tooltip: {},
    legend: { data: ["test"] },
    xAxis: { data: ["a", "b", "c", "d", "f", "g"] },
    yAxis: {},
    series: [{ name: "test", type: "bar", data: [5, 20, 36, 10, 10, 20] }],
  };

  const defaultConfig = {
    width,
    height,
    option,
    enableAutoDispose: true,
  };

  config = Object.assign({}, defaultConfig, config);
  config.option.animation = false;

  const context = canvas.getContext("2d");
  context.fillStyle = "#000";
  context.fillRect(0, 0, width, height);

  let chart;
  if (config.type === "svg") {
    chart = echarts.init(null, null, {
      renderer: "svg",
      ssr: true,
      width: width,
      height: height,
    });
  } else {
    chart = echarts.init(canvas);
  }

  chart.setOption(config.option);

  if (config.path) {
    try {
      fs.writeFileSync(config.path, chart.getDom().toBuffer());
      if (config.enableAutoDispose) {
        chart.dispose();
      }
      console.log("Create Img: " + config.path);
    } catch (err) {
      console.error("Error: Failed to write file " + config.path + ". " + err.message);
    }
  } else {
    if (config.type === "svg") {
      renderSvg(chart, res);
    } else {
      renderCanvas(chart, res);
    }
    try {
      if (config.enableAutoDispose) {
        chart.dispose();
      }
    } catch (e) {}
  }
};

function renderCanvas(chart, res) {
  const buffer = chart.getDom().toBuffer();
  res.setHeader("Content-Type", "image/png");
  res.write(buffer);
  res.end();
}

function renderSvg(chart, res) {
  const svg_data = chart.renderToSVGString();
  const filename = Math.random().toString(36).slice(-6);
  fs.writeFileSync(filename, svg_data, {
    encoding: "utf8",
    mode: 0o644,
    flag: "w",
  });
  var stream = fs.createReadStream(filename);
  stream.on("open", function () {
    res.setHeader("Content-Type", "image/svg+xml");
    stream.pipe(res);
  });
  stream.on("close", function () {
    res.end();
    fs.unlink(filename, function (err) {
      if (err) {
        console.error(
          "Failed to unlink file " + result.filename + "! " + err.toString()
        );
      }
    });
  });
  stream.on("error", function (err) {
    res.statusCode = 500; // 500 == Internal Server Error
    res.setHeader("Content-Type", "text/plain");
    res.end("Failed to serve file due to I/O error.\n");
    console.error("Failed to serve file " + filename + ": " + err.toString());
  });
}
