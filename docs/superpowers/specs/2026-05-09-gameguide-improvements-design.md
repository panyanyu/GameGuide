# GameGuide 网站改进设计规范

## 概述

对 GameGuide 游戏导航站进行交互体验和功能增强，包括：标签导航、收藏功能、键盘快捷键、移动端优化和 SEO 增强。

---

## 1. Hero 标签可点击导航

### 功能描述
Hero 区域的标签（热门、直播、优惠等）变成可点击的锚点，点击后页面平滑滚动到对应的分类区块。

### 交互流程
1. 用户点击 Hero 区域下的某个标签（如"直播"）
2. 页面平滑滚动到带有对应标签的站点区块
3. 如果搜索框有内容，清除搜索以显示全量数据

### 技术实现
- 在 `section-block` 上添加 `id` 属性（如 `id="live"`）
- Hero 标签使用 `<a href="#live">` 实现锚点跳转
- 添加 CSS `scroll-behavior: smooth` 实现平滑滚动

---

## 2. 分类导航区块

### 功能描述
在页面顶部（Hero 下方）添加一个可视化分类标签栏，作为快速导航锚点。

### UI 设计
```
[全部] [商店] [媒体] [社区] [直播] [工具] [数据] [独立] [优惠]
```

### 交互行为
- 点击标签筛选对应分类的站点
- 选中状态高亮显示
- 支持键盘左右箭头切换标签

### 技术实现
- 新增 `CategoryNav` 组件
- 使用 `useState` 管理当前选中的分类
- 分类数据从 `curatedSites` 的 `tag` 字段动态提取

---

## 3. 搜索框增强

### 功能描述
- 添加一键清除按钮
- 添加键盘快捷键支持

### 键盘快捷键
| 快捷键 | 功能 |
|---------|------|
| `/` | 聚焦搜索框 |
| `Esc` | 清除搜索内容并取消聚焦 |

### 清除按钮
- 搜索框有内容时显示清除图标（×）
- 点击清除所有内容

### 技术实现
- 使用 `useEffect` 监听键盘事件
- 清除按钮使用 SVG 图标或 Unicode 字符

---

## 4. 无结果状态提示

### 功能描述
当用户搜索没有匹配结果时，显示友好提示。

### UI 设计
```
┌─────────────────────────────────────┐
│  🔍 没有找到匹配结果                  │
│                                     │
│  尝试使用不同的关键词，或点击"全部"    │
│  查看所有站点。                       │
└─────────────────────────────────────┘
```

### 技术实现
- 当 `filteredSites.length === 0` 且 `query.trim() !== ''` 时显示此提示
- 包含"清除搜索"按钮

---

## 5. 收藏功能

### 功能描述
用户可以收藏喜欢的游戏网站，收藏数据保存到 localStorage。

### UI 设计
- 每张站点卡片右上角添加收藏按钮（☆/★ 图标）
- 点击切换收藏状态
- 新增"我的收藏"标签页/区块显示收藏的站点

### 收藏状态
- 未收藏：空心星星 (☆)
- 已收藏：实心星星 (★)，带主题色高亮

### 技术实现
- `useState` 管理收藏列表（站点名称数组）
- `useEffect` 初始化时从 localStorage 读取
- 收藏变更时同步写入 localStorage（key: `gameguide_favorites`）
- 收藏数据格式：`string[]`（站点名称列表）

### 边界情况
- 重复点击切换收藏状态
- 站点名称作为唯一标识

---

## 6. 移除联网搜索功能

### 功能描述
删除"联网搜索推荐"区块及其相关代码。

### 移除内容
- `searchNetwork` 函数
- `networkResults` 和 `loading` 状态
- `network-section` DOM 结构
- 相关 CSS 样式

---

## 7. 移动端优化

### 优化项
1. **搜索框布局** — 在小屏幕上保持良好间距
2. **分类导航** — 支持水平滚动（overflow-x: auto）
3. **站点卡片** — 优化内边距和字体大小
4. **触摸反馈** — 添加 `-webkit-tap-highlight-color` 优化

### 响应式断点
- 移动端：< 640px
- 平板端：640px - 900px
- 桌面端：> 900px

---

## 8. SEO 增强

### Schema.org 结构化数据

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "GameGuide",
  "description": "游戏导航站，汇集热门游戏平台、资讯媒体、社区与工具",
  "url": "https://gameguide.example.com",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://gameguide.example.com/?q={search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
}
```

### 技术实现
- 在 `layout.tsx` 的 `<head>` 中添加 `<script type="application/ld+json">`
- 使用 Next.js 的 `<Script>` 组件或直接内联

---

## 9. 外部链接安全

### 修复内容
确保所有 `target="_blank"` 的链接都包含 `rel="noopener"`。

### 当前状态
已有 `rel="noreferrer"`，需要补充 `noopener`。

---

## 10. 代码质量改进

### 代码组织
- 将 `curatedSites` 数据分离到 `data/sites.ts`
- 将类型定义分离到 `types/index.ts`
- 组件内逻辑提取为自定义 hooks（如 `useFavorites`、`useKeyboard`）

### 组件结构
```
app/
├── page.tsx                 # 主页面
├── components/
│   ├── CategoryNav.tsx      # 分类导航
│   ├── SiteCard.tsx         # 站点卡片
│   ├── SearchBar.tsx        # 搜索框组件
│   └── FavoritesPanel.tsx   # 收藏面板
├── hooks/
│   ├── useFavorites.ts      # 收藏逻辑
│   └── useKeyboard.ts        # 键盘快捷键
├── data/
│   └── sites.ts             # 站点数据
└── types/
    └── index.ts             # 类型定义
```

---

## 实施顺序

1. 数据分离（types + sites data）
2. 组件创建（CategoryNav、SiteCard、SearchBar）
3. 收藏功能（hooks + FavoritesPanel）
4. 键盘快捷键
5. 无结果提示
6. SEO 结构化数据
7. 移动端优化
8. 移除联网搜索区块
9. 清理和测试

---

## 验收标准

- [ ] Hero 标签可点击并平滑滚动到对应区块
- [ ] 分类导航栏显示正常，点击可筛选
- [ ] 搜索框有清除按钮，/`Esc` 快捷键正常工作
- [ ] 收藏功能正常，数据持久化到 localStorage
- [ ] 无结果搜索显示友好提示
- [ ] 移动端布局正常，触摸交互流畅
- [ ] SEO 结构化数据已添加
- [ ] 联网搜索区块已移除
- [ ] 所有外部链接安全（noopener）
- [ ] 代码组织清晰，类型安全
