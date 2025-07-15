const url = require('url');

// 导入所有路由模块
const developerOverview = require('./developerOverview');
// const projectOverview = require('./projectOverview'); // 示例：项目概览路由

// 注册所有路由
const routes = new Map();

/**
 * 注册路由
 * @param {Object} route - 路由对象
 * @param {string} route.path - 路由路径
 * @param {Function} route.handler - 路由处理函数
 */
function registerRoute(route) {
    routes.set(route.path, route.handler);
    console.log(`Route registered: ${route.path}`);
}

/**
 * 初始化所有路由
 */
function initRoutes() {
    // 注册开发者概览路由
    registerRoute(developerOverview);

    // 添加新路由示例（取消注释即可启用）：
    // registerRoute(projectOverview);
}

/**
 * 路由分发器
 * @param {Object} request - HTTP请求对象
 * @param {Object} response - HTTP响应对象
 * @param {Object} config - 解析后的配置对象
 * @returns {boolean} 是否找到并处理了路由
 */
function handleRoute(request, response, config) {
    const parsedUrl = url.parse(request.url, true);
    const pathname = parsedUrl.pathname;

    // 查找对应的路由处理器
    const handler = routes.get(pathname);

    if (handler) {
        // 找到路由，执行处理器
        handler(config, response);
        return true;
    }

    // 未找到路由
    return false;
}

/**
 * 获取所有已注册的路由
 * @returns {Array} 路由路径列表
 */
function getRegisteredRoutes() {
    return Array.from(routes.keys());
}

// 初始化路由
initRoutes();

module.exports = {
    handleRoute,
    getRegisteredRoutes,
    registerRoute
}; 