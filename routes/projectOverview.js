const echarts = require('../index.js');

/**
 * 生成项目概览图表配置
 * @param {Object} data - 项目数据
 * @param {number} data.total_commits - 总提交数
 * @param {number} data.total_contributors - 总贡献者数
 * @param {number} data.active_days - 活跃天数
 * @param {Array} data.language_stats - 语言统计
 * @returns {Object} ECharts配置对象
 */
function generateProjectOverviewOption(data) {
    const { total_commits, total_contributors, active_days, language_stats = [] } = data;

    return {
        backgroundColor: '#ffffff',
        title: {
            text: '项目概览',
            left: 'center',
            top: 20,
            textStyle: {
                fontSize: 24,
                fontWeight: 'bold',
                color: '#1e293b'
            }
        },
        grid: {
            left: '10%',
            right: '10%',
            bottom: '15%',
            top: '25%'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}: {c} ({d}%)'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            top: 'middle'
        },
        series: [
            // 左侧语言分布饼图
            {
                name: '语言分布',
                type: 'pie',
                radius: ['40%', '70%'],
                center: ['25%', '60%'],
                data: language_stats.map(lang => ({
                    value: lang.percentage,
                    name: lang.language
                })),
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ],
        graphic: [
            // 右侧统计信息
            {
                type: 'group',
                right: '20%',
                top: '35%',
                children: [
                    {
                        type: 'text',
                        style: {
                            text: '项目统计',
                            font: 'bold 18px Arial',
                            fill: '#1e293b'
                        }
                    },
                    {
                        type: 'text',
                        style: {
                            text: `总提交数: ${total_commits}`,
                            font: '14px Arial',
                            fill: '#64748b',
                            y: 40
                        }
                    },
                    {
                        type: 'text',
                        style: {
                            text: `贡献者数: ${total_contributors}`,
                            font: '14px Arial',
                            fill: '#64748b',
                            y: 70
                        }
                    },
                    {
                        type: 'text',
                        style: {
                            text: `活跃天数: ${active_days}`,
                            font: '14px Arial',
                            fill: '#64748b',
                            y: 100
                        }
                    }
                ]
            }
        ]
    };
}

/**
 * 处理项目概览路由请求
 * @param {Object} config - 请求配置
 * @param {Object} response - HTTP响应对象
 */
function handleProjectOverview(config, response) {
    if (!config || !config.option) {
        response.end('request parameter "config" format invalid');
        return;
    }

    try {
        // 生成项目概览图表配置
        const chartOption = generateProjectOverviewOption(config.option);

        // 渲染图表
        echarts({
            option: chartOption,
            width: config.width || 800,
            height: config.height || 600,
            type: config.type || 'svg'
        }, response);
    } catch (error) {
        console.error('Project overview generation error:', error);
        response.statusCode = 500;
        response.end('Internal server error while generating project overview');
    }
}

module.exports = {
    path: '/project_overview',
    handler: handleProjectOverview,
    generateProjectOverviewOption
}; 