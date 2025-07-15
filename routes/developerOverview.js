const echarts = require('../index.js');

/**
 * 生成开发者概览图表配置
 * @param {Object} data - 开发者数据
 * @param {number} data.commit_count - 提交数量
 * @param {number} data.pr_count - PR数量
 * @param {number} data.issue_count - Issue数量
 * @param {number} data.code_review_count - 代码审查数量
 * @param {number} data.contributed_to_count - 贡献项目数量
 * @param {Object} data.level - 等级信息
 * @param {string} data.level.score - 评分等级（如 A+）
 * @param {string} data.level.rank - 排名百分比（如 20%）
 * @returns {Object} ECharts配置对象
 */
function generateDeveloperOverviewOption(data) {
    const { commit_count, pr_count, issue_count, code_review_count, contributed_to_count, level } = data;

    // SVG图标定义（转换为data URI）
    const icons = {
        commits: 'data:image/svg+xml;base64,' + Buffer.from('<svg stroke="#ff9d36" fill="#ff9d36" stroke-width="0" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M12 6c-2.967 0-5.431 2.167-5.909 5H2v2h4.092c.479 2.832 2.942 4.998 5.909 4.998s5.43-2.166 5.909-4.998H22v-2h-4.09c-.478-2.833-2.942-5-5.91-5zm0 9.998c-2.205 0-3.999-1.794-3.999-3.999S9.795 8 12 8c2.206 0 4 1.794 4 3.999s-1.794 3.999-4 3.999z"></path></svg>').toString('base64'),
        prs: 'data:image/svg+xml;base64,' + Buffer.from('<svg stroke="#ff9d36" fill="#ff9d36" stroke-width="0" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M19.01 15.163V7.997C19.005 6.391 17.933 4 15 4V2l-4 3 4 3V6c1.829 0 2.001 1.539 2.01 2v7.163c-1.44.434-2.5 1.757-2.5 3.337 0 1.93 1.57 3.5 3.5 3.5s3.5-1.57 3.5-3.5c0-1.58-1.06-2.903-2.5-3.337zm-1 4.837c-.827 0-1.5-.673-1.5-1.5s.673-1.5 1.5-1.5 1.5.673 1.5 1.5-.673 1.5-1.5 1.5zM9.5 5.5C9.5 3.57 7.93 2 6 2S2.5 3.57 2.5 5.5c0 1.58 1.06 2.903 2.5 3.337v6.326c-1.44.434-2.5 1.757-2.5 3.337C2.5 20.43 4.07 22 6 22s3.5-1.57 3.5-3.5c0-1.58-1.06-2.903-2.5-3.337V8.837C8.44 8.403 9.5 7.08 9.5 5.5zm-5 0C4.5 4.673 5.173 4 6 4s1.5.673 1.5 1.5S6.827 7 6 7s-1.5-.673-1.5-1.5zm3 13c0 .827-.673 1.5-1.5 1.5s-1.5-.673-1.5-1.5S5.173 17 6 17s1.5.673 1.5 1.5z"></path></svg>').toString('base64'),
        issues: 'data:image/svg+xml;base64,' + Buffer.from('<svg stroke="#ff9d36" fill="#ff9d36" stroke-width="0" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M12 1c6.075 0 11 4.925 11 11s-4.925 11-11 11S1 18.075 1 12 5.925 1 12 1ZM2.5 12a9.5 9.5 0 0 0 9.5 9.5 9.5 9.5 0 0 0 9.5-9.5A9.5 9.5 0 0 0 12 2.5 9.5 9.5 0 0 0 2.5 12Zm9.5 2a2 2 0 1 1-.001-3.999A2 2 0 0 1 12 14Z"></path></svg>').toString('base64'),
        codeReviews: 'data:image/svg+xml;base64,' + Buffer.from('<svg stroke="#ff9d36" fill="#ff9d36" stroke-width="0" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M5 18v3.766l1.515-.909L11.277 18H16c1.103 0 2-.897 2-2V8c0-1.103-.897-2-2-2H4c-1.103 0-2 .897-2 2v8c0 1.103.897 2 2 2h1zM4 8h12v8h-5.277L7 18.234V16H4V8z"></path><path d="M20 2H8c-1.103 0-2 .897-2 2h12c1.103 0 2 .897 2 2v8c1.103 0 2-.897 2-2V4c0-1.103-.897-2-2-2z"></path></svg>').toString('base64'),
        contributedTo: 'data:image/svg+xml;base64,' + Buffer.from('<svg stroke="#ff9d36" fill="#ff9d36" stroke-width="0" viewBox="0 0 24 24" height="18" width="18" xmlns="http://www.w3.org/2000/svg"><path d="M3 2.75A2.75 2.75 0 0 1 5.75 0h14.5a.75.75 0 0 1 .75.75v20.5a.75.75 0 0 1-.75.75h-6a.75.75 0 0 1 0-1.5h5.25v-4H6A1.5 1.5 0 0 0 4.5 18v.75c0 .716.43 1.334 1.05 1.605a.75.75 0 0 1-.6 1.374A3.251 3.251 0 0 1 3 18.75ZM19.5 1.5H5.75c-.69 0-1.25.56-1.25 1.25v12.651A2.989 2.989 0 0 1 6 15h13.5Z"></path><path d="M7 18.25a.25.25 0 0 1 .25-.25h5a.25.25 0 0 1 .25.25v5.01a.25.25 0 0 1-.397.201l-2.206-1.604a.25.25 0 0 0-.294 0L7.397 23.46a.25.25 0 0 1-.397-.2v-5.01Z"></path></svg>').toString('base64')
    };

    return {
        backgroundColor: '#ffffff',
        graphic: [
            // 左侧统计信息容器
            {
                type: 'group',
                left: 50,
                top: 106,
                children: [
                    // Commits 行
                    {
                        type: 'group',
                        top: 0,
                        children: [
                            // 图标背景圆形
                            {
                                type: 'circle',
                                shape: { cx: 20, cy: 20, r: 20 },
                                style: { fill: '#ff9d36', opacity: 0.1 }
                            },
                            // Commit 图标
                            {
                                type: 'image',
                                style: {
                                    image: icons.commits,
                                    x: 10,
                                    y: 10,
                                    width: 20,
                                    height: 20
                                }
                            },
                            // 标签文本
                            {
                                type: 'text',
                                style: {
                                    text: 'Commits',
                                    x: 55,
                                    y: 10,
                                    fontSize: '24px',
                                    fill: '#374151',
                                    fontWeight: '500',
                                    textBaseline: 'middle'
                                }
                            },
                            // 数值文本
                            {
                                type: 'text',
                                style: {
                                    text: commit_count.toString(),
                                    x: 320,
                                    y: 10,
                                    font: 'bold 24px Arial',
                                    fill: '#1f2937',
                                    textAlign: 'right',
                                    textBaseline: 'middle'
                                }
                            }
                        ]
                    },
                    // PRs 行
                    {
                        type: 'group',
                        top: 60,
                        children: [
                            // 图标背景圆形
                            {
                                type: 'circle',
                                shape: { cx: 20, cy: 20, r: 20 },
                                style: { fill: '#ff9d36', opacity: 0.1 }
                            },
                            // PR 图标
                            {
                                type: 'image',
                                style: {
                                    image: icons.prs,
                                    x: 10,
                                    y: 10,
                                    width: 20,
                                    height: 20
                                }
                            },
                            // 标签文本
                            {
                                type: 'text',
                                style: {
                                    text: 'PRs',
                                    x: 55,
                                    y: 10,
                                    fontSize: '24px',
                                    fill: '#374151',
                                    fontWeight: '500',
                                    textBaseline: 'middle'
                                }
                            },
                            // 数值文本
                            {
                                type: 'text',
                                style: {
                                    text: pr_count.toString(),
                                    x: 320,
                                    y: 10,
                                    font: 'bold 24px Arial',
                                    fill: '#1f2937',
                                    textAlign: 'right',
                                    textBaseline: 'middle'
                                }
                            }
                        ]
                    },
                    // Issues 行
                    {
                        type: 'group',
                        top: 120,
                        children: [
                            // 图标背景圆形
                            {
                                type: 'circle',
                                shape: { cx: 20, cy: 20, r: 20 },
                                style: { fill: '#ff9d36', opacity: 0.1 }
                            },
                            // Issue 图标
                            {
                                type: 'image',
                                style: {
                                    image: icons.issues,
                                    x: 10,
                                    y: 10,
                                    width: 20,
                                    height: 20
                                }
                            },
                            // 标签文本
                            {
                                type: 'text',
                                style: {
                                    text: 'Issues',
                                    x: 55,
                                    y: 10,
                                    fontSize: '24px',
                                    fill: '#374151',
                                    fontWeight: '500',
                                    textBaseline: 'middle'
                                }
                            },
                            // 数值文本
                            {
                                type: 'text',
                                style: {
                                    text: issue_count.toString(),
                                    x: 320,
                                    y: 10,
                                    font: 'bold 24px Arial',
                                    fill: '#1f2937',
                                    textAlign: 'right',
                                    textBaseline: 'middle'
                                }
                            }
                        ]
                    },
                    // Code Reviews 行
                    {
                        type: 'group',
                        top: 180,
                        children: [
                            // 图标背景圆形
                            {
                                type: 'circle',
                                shape: { cx: 20, cy: 20, r: 20 },
                                style: { fill: '#ff9d36', opacity: 0.1 }
                            },
                            // Code Reviews 图标
                            {
                                type: 'image',
                                style: {
                                    image: icons.codeReviews,
                                    x: 10,
                                    y: 10,
                                    width: 20,
                                    height: 20
                                }
                            },
                            // 标签文本
                            {
                                type: 'text',
                                style: {
                                    text: 'Code Reviews',
                                    x: 55,
                                    y: 10,
                                    fontSize: '24px',
                                    fill: '#374151',
                                    fontWeight: '500',
                                    textBaseline: 'middle'
                                }
                            },
                            // 数值文本
                            {
                                type: 'text',
                                style: {
                                    text: code_review_count.toString(),
                                    x: 320,
                                    y: 10,
                                    font: 'bold 24px Arial',
                                    fill: '#1f2937',
                                    textAlign: 'right',
                                    textBaseline: 'middle'
                                }
                            }
                        ]
                    },
                    // Contributed to 行
                    {
                        type: 'group',
                        top: 240,
                        children: [
                            // 图标背景圆形
                            {
                                type: 'circle',
                                shape: { cx: 20, cy: 20, r: 20 },
                                style: { fill: '#ff9d36', opacity: 0.1 }
                            },
                            // Contributed to 图标
                            {
                                type: 'image',
                                style: {
                                    image: icons.contributedTo,
                                    x: 10,
                                    y: 10,
                                    width: 20,
                                    height: 20
                                }
                            },
                            // 标签文本
                            {
                                type: 'text',
                                style: {
                                    text: 'Contributed to',
                                    x: 55,
                                    y: 10,
                                    fontSize: '24px',
                                    fill: '#374151',
                                    fontWeight: '500',
                                    textBaseline: 'middle'
                                }
                            },
                            // 数值文本
                            {
                                type: 'text',
                                style: {
                                    text: contributed_to_count.toString(),
                                    x: 320,
                                    y: 10,
                                    font: 'bold 24px Arial',
                                    fill: '#1f2937',
                                    textAlign: 'right',
                                    textBaseline: 'middle'
                                }
                            }
                        ]
                    }
                ]
            },

        ],
        // 右侧圆形评级
        series: [
            {
                type: 'pie',
                center: ['75%', '50%'],
                radius: ['36%', '42%'],
                clockwise: false,
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10
                },
                label: {
                    show: false
                },
                labelLine: {
                    show: false
                },
                tooltip: {
                    show: false
                },
                data: [
                    {
                        name: 'progress',
                        value: 100 - (parseInt(level.rank) || 80),
                        itemStyle: {
                            color: '#8b5cf6',
                            borderRadius: 10
                        }
                    },
                    {
                        name: 'remaining',
                        value: parseInt(level.rank) || 20,
                        itemStyle: {
                            color: '#e2e8f0',
                        }
                    }
                ]
            },
            // 中心文本系列（用于精确显示评级文本）
            {
                type: 'pie',
                center: ['75%', '50%'],
                radius: [0, 0],
                silent: true,
                label: {
                    show: true,
                    position: 'center',
                    fontSize: 28,
                    fontWeight: 'bold',
                    color: '#1e293b',
                    formatter: level.score || 'A+'
                },
                data: [{ value: 1, itemStyle: { color: 'transparent' } }]
            }
        ]
    };
}

/**
 * 处理开发者概览路由请求
 * @param {Object} config - 请求配置
 * @param {Object} response - HTTP响应对象
 */
function handleDeveloperOverview(config, response) {
    if (!config || !config.option) {
        response.end('request parameter "config" format invalid');
        return;
    }

    try {
        // 生成开发者概览图表配置
        const chartOption = generateDeveloperOverviewOption(config.option);

        // 渲染图表
        echarts({
            option: chartOption,
            width: config.width || 700,
            height: config.height || 400,
            type: config.type || 'svg'
        }, response);
    } catch (error) {
        console.error('Developer overview generation error:', error);
        response.statusCode = 500;
        response.end('Internal server error while generating developer overview');
    }
}

module.exports = {
    path: '/developer_overview',
    handler: handleDeveloperOverview,
    generateDeveloperOverviewOption
}; 