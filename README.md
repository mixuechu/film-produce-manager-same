# 制片管理平台 (Film Production Management Platform)

一个现代化的影视制片管理平台，提供智能剧本分析和全流程制作管理功能。使用 Next.js 15 和 TypeScript 开发，采用最新的 Web 技术栈。

## 🌟 主要功能

### 1. 智能剧本管理
- 支持剧本文件上传和文本粘贴
- 智能结构化分析剧本内容
- 自动识别和提取关键元素

### 2. 自动化元素提取
- 自动生成角色表
- 场景分析和统计
- 服装、化妆、道具清单生成
- 智能分类和标注

### 3. 可视化工具
- 剧情知识图谱展示
- 顺场表自动生成和管理
- 拍摄排期表规划工具
- 数据可视化统计和分析

### 4. 项目管理
- 项目创建和配置
- 进度追踪和管理
- 资源分配和调度
- 数据导出和共享

## 🛠️ 技术栈

- **前端框架**: Next.js 15
- **开发语言**: TypeScript
- **样式方案**: Tailwind CSS
- **数据可视化**: ECharts
- **代码质量**: ESLint, Biome
- **包管理器**: Bun/npm

## 🚀 快速开始

1. **安装依赖**
```bash
# 使用 bun（推荐）
bun install

# 或使用 npm
npm install
```

2. **启动开发服务器**
```bash
# 使用 bun
bun dev

# 或使用 npm
npm run dev
```

3. **访问应用**
打开浏览器访问 [http://localhost:3000](http://localhost:3000)

## 📦 构建部署

```bash
# 构建生产版本
bun run build

# 启动生产服务
bun start
```

## 🔧 环境要求

- Node.js 18.0.0 或更高版本
- Bun 1.0.0 或更高版本（推荐）

## 📝 项目结构

```
src/
├── app/                # Next.js App Router 页面
│   ├── project/       # 项目管理相关页面
│   │   ├── new/      # 新建项目
│   │   ├── parse/    # 剧本解析
│   │   ├── sequence/ # 顺场表
│   │   ├── schedule/ # 排期表
│   │   └── graph/    # 知识图谱
│   ├── api/          # API 路由
│   └── ...
├── lib/              # 工具函数和共享逻辑
└── ...
```

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

[MIT License](LICENSE)
