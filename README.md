# GameGuide

## 介绍

GameGuide 是一个基于 Next.js 的游戏导航站，聚合热门游戏平台、资讯媒体、社区、工具和游戏资源推荐。项目使用 React + TypeScript 构建，并包含 Google AdSense 广告加载组件。

## 功能

- 热门游戏网站和资源推荐
- 关键词搜索过滤展示内容
- 联网获取公共游戏 API 数据
- AdSense 广告脚本动态注入
- 支持 Next.js 16、React 19 和 TypeScript 6

## 软件架构

- `Next.js`：基于 App Router 的服务端渲染与静态生成
- `React`：页面 UI 和交互逻辑
- `TypeScript`：类型安全和开发体验
- `app/`：包含页面、布局和客户端组件
- `config/adsense.ts`：Google AdSense 配置

## 安装教程

1. 克隆仓库
2. 进入项目目录：`cd GameGuide`
3. 安装依赖：`npm install`
4. 启动开发模式：`npm run dev`

## 使用说明

1. 打开浏览器访问：`http://localhost:3000`
2. 在首页搜索框输入关键词，快速过滤导航站点
3. 点击“联网搜索推荐”按钮获取更多游戏 API 推荐数据
4. 如需启用 AdSense，请修改 `config/adsense.ts` 中的 `clientId` 和 `homepageSlot`

## 目录结构

- `app/`：Next.js 页面、布局与组件
- `config/`：广告配置
- `public/`：静态资源
- `package.json`：依赖与脚本

## 参与贡献

1. Fork 本仓库
2. 新建分支：`feat/xxx`
3. 提交代码并推送
4. 创建 Pull Request

## 备注

当前项目使用 `https://api.publicapis.org/entries?category=Games` 作为联网推荐数据来源。
