const http = require('http');
const echarts = require('./index.js');
const url = require('url');
const router = require('./routes');

function processConfig(request, response, callback) {
  let queryData = '';
  if (typeof callback !== 'function') {
    return null;
  }
  if (request.method === 'GET') {
    const { query } = url.parse(request.url, true);
    if (!query.config) {
      response.end('request parameter "config" invalid');
      return null;
    }
    request.config = query.config;
    callback();
  } else {
    request.on('data', function(data) {
      queryData += data;
      if (queryData.length > 1e6) {
        response.end('request body too large');
      }
    });
    request.on('end', function() {
      request.config = queryData;
      callback();
    });
  }
}

const server = http.createServer(function(request, response) {
  processConfig(request, response, function() {
    let config;
    try {
      config = JSON.parse(request.config);
    } catch (e) {
      response.end('request parameter "config" format invalid, is not JSON');
      return null;
    }

    // 尝试使用路由处理器
    const handled = router.handleRoute(request, response, config);
    if (handled) {
      return; // 路由已处理，直接返回
    }

    // 原有的默认路由处理（向下兼容）
    if (!config || !config.option) {
      response.end('request parameter "config" format invalid');
      return null;
    }

    // 检查是否有yAxis配置
    if (config.option.yAxis && Array.isArray(config.option.yAxis)) {
      for (let index = 0; index < config.option.yAxis.length; index++) {
        config.option.yAxis[index].axisLabel = config.option.yAxis[index].axisLabel || {};
        config.option.yAxis[index].axisLabel.formatter = function(value) {
          if (Math.abs(value) >= 1000) {
            return (value / 1000).toFixed(0) + "k";
          }
          return value;
        };
      }
    }

    config.option.backgroundColor = "#ffffff";
    echarts({
      option: config.option,
      width: config.width || 600,
      height: config.height || 400,
      type: config.type
    }, response);
  });
});

const hostName = '0.0.0.0';
const port = 8081;
server.listen(port, hostName, function() {
  console.log(`Server started at port ${port}`);
  console.log('Registered routes:');
  router.getRegisteredRoutes().forEach(route => {
    console.log(`  - http://localhost:${port}${route}`);
  });
});
