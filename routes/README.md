# 路由模块说明

## 📁 模块结构

```
routes/
├── index.js              # 路由管理器
├── developerOverview.js  # 开发者概览路由
├── projectOverview.js    # 项目概览路由示例 
└── README.md             # 本说明文档
```

## 🚀 如何添加新路由

### 1. 创建路由模块文件

在 `routes/` 文件夹下创建新的路由文件，例如 `teamOverview.js`：

```javascript
const echarts = require('../index.js');

/**
 * 生成团队概览图表配置
 */
function generateTeamOverviewOption(data) {
  // 你的图表配置逻辑
  return {
    backgroundColor: '#ffffff',
    // ... ECharts配置
  };
}

/**
 * 处理团队概览路由请求
 */
function handleTeamOverview(config, response) {
  if (!config || !config.option) {
    response.end('request parameter "config" format invalid');
    return;
  }
  
  try {
    const chartOption = generateTeamOverviewOption(config.option);
    
    echarts({
      option: chartOption,
      width: config.width || 600,
      height: config.height || 400,
      type: config.type || 'svg'
    }, response);
  } catch (error) {
    console.error('Team overview generation error:', error);
    response.statusCode = 500;
    response.end('Internal server error while generating team overview');
  }
}

module.exports = {
  path: '/team_overview',           // 路由路径
  handler: handleTeamOverview,      // 处理函数
  generateTeamOverviewOption       // 可选：导出配置生成函数
};
```

### 2. 注册新路由

在 `routes/index.js` 中添加新路由：

```javascript
// 1. 导入新路由模块
const teamOverview = require('./teamOverview');

// 2. 在 initRoutes() 函数中注册
function initRoutes() {
  registerRoute(developerOverview);
  registerRoute(teamOverview);  // 添加这一行
}
```

### 3. 使用新路由

启动服务器后，新路由将自动可用：

```bash
curl -X POST http://localhost:8081/team_overview \
  -H "Content-Type: application/json" \
  -d '{"width": 800, "height": 500, "option": {...}}'
```

## 📊 现有路由

### `/developer_overview` - 开发者概览
展示开发者的活动统计和等级评分。

**请求格式**：
```json
{
  "width": 800,
  "height": 500,
  "type": "svg",
  "option": {
    "commit_count": 256,
    "pr_count": 186,
    "issue_count": 4,
    "code_review_count": 78,
    "contributed_to_count": 23,
    "level": {
      "score": "A+",
      "rank": "20"
    }
  }
}
```

## 🔧 路由模块规范

每个路由模块必须导出以下结构：

```javascript
module.exports = {
  path: '/your_route',        // 路由路径（必需）
  handler: yourHandler,       // 处理函数（必需）
  // ... 其他可选导出
};
```

### 处理函数规范

```javascript
function yourHandler(config, response) {
  // config: 解析后的请求配置对象
  // response: HTTP响应对象
  
  // 1. 验证配置
  if (!config || !config.option) {
    response.end('request parameter "config" format invalid');
    return;
  }
  
  // 2. 生成图表配置
  const chartOption = generateYourChartOption(config.option);
  
  // 3. 渲染图表
  echarts({
    option: chartOption,
    width: config.width || 600,
    height: config.height || 400,
    type: config.type || 'svg'
  }, response);
}
```

## 🎯 最佳实践

1. **模块化**：每个路由一个文件，功能单一
2. **错误处理**：始终包含 try-catch 和参数验证
3. **文档注释**：为函数添加 JSDoc 注释
4. **默认值**：为 width、height、type 提供合理默认值
5. **命名规范**：使用下划线分隔的路由路径 (`/feature_name`)

## 🚦 启用/禁用路由

在 `routes/index.js` 中注释/取消注释相应的 `registerRoute()` 调用即可启用或禁用路由。

```javascript
// 启用
registerRoute(projectOverview);

// 禁用
// registerRoute(projectOverview);
``` 