# 微博热搜舆情展示网站

## 技术栈
- React 18 + Vite
- Next.js (SSG)
- TailwindCSS
- TanStack Router

## 项目结构

```
weibo-monitor-web/
├── public/
│   └── data/              # 静态数据文件
│       ├── 2026-02-27.json
│       └── ...
├── src/
│   ├── components/        # 组件
│   ├── pages/            # 页面
│   ├── hooks/            # 自定义Hook
│   ├── utils/           # 工具函数
│   ├── styles/           # 样式
│   └── App.tsx
├── next.config.js
├── tailwind.config.js
├── package.json
└── .env
```

## 数据格式

```json
{
  "date": "2026-02-27",
  "timeRange": "00:00-24:00",
  "generatedAt": "2026-02-27T00:00:00Z",
  "summary": {
    "totalEvents": 50,
    "topCategories": [...]
  },
  "categories": {
    "social": {
      "name": "社会新闻",
      "emoji": "🔥",
      "events": [...]
    }
  },
  "topEvents": [...],
  "timeline": [...]
}
```

## 部署
- 自动构建：GitHub Actions
- 托管：GitHub Pages
- 域名：可通过自定义域名访问
