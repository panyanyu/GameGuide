# GameGuide 新闻页面设计规范

## 概述

将游戏新闻区块从首页独立为 `/news` 页面，提供更丰富的内容展示和交互体验。

---

## 页面结构

**路由：** `/news`

**布局：** 全宽瀑布流（Masonry Layout），响应式多列布局

---

## RSS 新闻源

| 来源 | RSS 地址 | 标签 |
|------|----------|------|
| Steam 新闻 | `https://store.steampowered.com/feeds/news/?l=schinese` | Steam |
| 游民星空 | `https://www.gamersky.com/news/rss.xml` | 游民星空 |
| 3DM 游戏网 | `https://www.3dmgame.com/news/rss.xml` | 3DM |
| NGA 玩家社区 | `https://nga.178.com/rss/news.xml` | NGA |

---

## 功能描述

### 数据获取
- 使用 rss2json API 转换 RSS 为 JSON
- API 端点: `https://api.rss2json.com/v1/api.json?rss_url=<encoded_url>`
- 初始加载 20 条，按发布时间倒序
- 无限滚动：滚动到底部时自动加载更多
- 图片抓取：通过新闻链接尝试获取配图（降级方案：显示来源图标）

### 瀑布流布局
- 多列布局（桌面 3-4 列，平板 2 列，手机 1 列）
- 每条新闻卡片高度根据内容自适应
- 卡片之间间距 16px
- 支持图片懒加载

### 新闻卡片内容
- **来源标签** - 彩色标签区分来源（Steam=蓝，3DM=紫，游民=橙，NGA=绿）
- **标题** - 最多显示 3 行，超出省略
- **摘要** - 最多显示 2 行，描述性文字
- **时间** - 相对时间（"2小时前"）或具体日期
- **配图** - 优先使用原文图片，失败时降级为来源图标

### 交互功能
- 点击卡片跳转原新闻链接（新窗口打开）
- 点击图片查看大图弹窗
- 下拉刷新 / 滚动加载更多
- 页面顶部显示加载状态

### 错误处理
- 网络错误：显示重试按钮
- 全部加载完成：显示"已加载全部新闻"
- 图片加载失败：降级为来源图标

---

## 组件设计

### NewsCard 组件

**文件:** `app/components/NewsCard.tsx`

**Props:**
```typescript
interface NewsCardProps {
  item: NewsItem;
  onImageClick: (src: string) => void;
}
```

**显示内容：** 来源标签 + 标题 + 摘要 + 时间 + 配图/图标

---

### NewsList 组件

**文件:** `app/components/NewsList.tsx`

**Props:**
```typescript
interface NewsListProps {
  items: NewsItem[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onImageClick: (src: string) => void;
}
```

**功能：** 瀑布流容器，处理无限滚动逻辑

---

### ImageModal 组件

**文件:** `app/components/ImageModal.tsx`

**功能：** 点击图片时显示大图弹窗，支持关闭

---

### useNewsFeed Hook

**文件:** `app/hooks/useNewsFeed.ts`

```typescript
export function useNewsFeed() {
  // items: NewsItem[]
  // loading: boolean
  // error: string | null
  // hasMore: boolean
  // loadMore: () => void
  // refresh: () => void
}
```

---

## 页面布局

### `/news` 页面布局
```
┌─────────────────────────────────────────────────────────────┐
│ Header（复用现有布局）                                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  游戏资讯                                                刷新 │
│                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │ [Steam] │  │ [3DM]   │  │ [游民]  │  │ [NGA]   │         │
│  │ 标题    │  │ 标题    │  │ 标题    │  │ 标题    │         │
│  │ 摘要... │  │ 摘要... │  │ 摘要... │  │ 摘要... │         │
│  │ 2小时前 │  │ 3小时前  │  │ 5小时前 │  │ 昨天    │         │
│  │ [图片]  │  │ [图片]  │  │ [图片]  │  │ [图片]  │         │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘         │
│                                                             │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐         │
│  │ ...     │  │ ...     │  │ ...     │  │ ...     │         │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘         │
│                                                             │
│                    [加载更多...]                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### 首页新闻入口（简化版）
首页保留简短新闻列表（只显示 3-5 条最新），点击"查看更多"跳转 `/news`

---

## 技术实现

### 瀑布流布局
使用 CSS `column-count` 实现简单瀑布流，或使用 `react-masonry-css` 库

### 图片抓取降级策略
1. 尝试通过 og:image 获取
2. 失败时尝试从页面内容提取第一张图片
3. 完全失败时显示来源对应颜色的 SVG 图标

### 无限滚动
使用 Intersection Observer 监听底部元素，进入可视区域时触发 loadMore

---

## 验收标准

- [ ] `/news` 页面瀑布流正常显示
- [ ] Steam、3DM、游民星空、NGA 四个 RSS 源数据正确加载
- [ ] 无限滚动加载正常
- [ ] 图片加载失败时降级为来源图标
- [ ] 点击图片显示大图弹窗
- [ ] 首页保留新闻入口，显示 3-5 条最新新闻
- [ ] 移动端布局正常（单列）
- [ ] 加载状态、错误状态友好展示
