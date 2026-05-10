# GameGuide 游戏新闻区块设计规范

## 概述

在 Hero 区域下方添加游戏新闻滚动区块，显示来自 Steam 新闻和游民星空的最新资讯。

---

## 功能描述

### RSS 新闻源

| 来源 | RSS 地址 | 显示标签 |
|------|----------|----------|
| Steam 新闻 | `https://store.steampowered.com/feeds/news/?l=schinese` | [Steam] |
| 游民星空 | `https://www.gamersky.com/news/rss.xml` | [游民星空] |

### API 转换
- 使用 `rss2json.com` API 将 RSS 转换为 JSON
- API 端点: `https://api.rss2json.com/v1/api.json?rss_url=<encoded_url>`
- 免费额度: 10,000 次/天

### 数据处理
- 合并两个 RSS 源的数据
- 按发布时间倒序排列（最新的在前）
- 最多显示 6 条新闻（每源各 3 条）
- 过滤无效或无标题的条目

---

## UI 设计

### 布局
```
┌─────────────────────────────────────────────────────────────┐
│ 🎮 游戏资讯                                        [刷新]   │
├─────────────────────────────────────────────────────────────┤
│ • [Steam] 2024年Steam游戏大奖候选名单公布                  │
│ • [游民星空] 《黑神话：悟空》获年度最佳游戏提名             │
│ • [Steam] Steam 冬季特卖已于今日正式开启                  │
│ • [游民星空] 《塞尔达传说》新预告片解析                    │
└─────────────────────────────────────────────────────────────┘
```

### 样式
- 卡片式布局，圆角 24px
- 来源标签使用不同颜色区分
  - Steam: 蓝色系
  - 游民星空: 橙色系
- 标题悬停时显示下划线
- 刷新按钮手动刷新新闻

### 状态

**加载中:**
```
┌─────────────────────────────────────────────────────────────┐
│ 🎮 游戏资讯                                                  │
├─────────────────────────────────────────────────────────────┤
│ ▌ ▌ ▌ ▌ ▌ ▌  正在加载最新资讯...                          │
└─────────────────────────────────────────────────────────────┘
```

**加载失败:**
```
┌─────────────────────────────────────────────────────────────┐
│ 🎮 游戏资讯                                                  │
├─────────────────────────────────────────────────────────────┤
│ ⚠ 资讯加载失败，请检查网络后重试                [重试]   │
└─────────────────────────────────────────────────────────────┘
```

**无数据:**
```
┌─────────────────────────────────────────────────────────────┐
│ 🎮 游戏资讯                                                  │
├─────────────────────────────────────────────────────────────┤
│ 暂无最新资讯                                                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 组件设计

### NewsSection 组件

**文件:** `app/components/NewsSection.tsx`

**Props:**
```typescript
interface NewsItem {
  title: string;
  link: string;
  source: 'steam' | 'gamersky';
  pubDate: string;
}

interface NewsSectionProps {
  items: NewsItem[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
}
```

### useNews Hook

**文件:** `app/hooks/useNews.ts`

```typescript
export function useNews() {
  // 返回:
  // - items: NewsItem[]
  // - loading: boolean
  // - error: string | null
  // - refresh: () => void
}
```

---

## 技术实现

### API 调用
```typescript
const RSS_FEEDS = [
  { url: 'https://store.steampowered.com/feeds/news/?l=schinese', source: 'steam' as const },
  { url: 'https://www.gamersky.com/news/rss.xml', source: 'gamersky' as const },
];

async function fetchNews(): Promise<NewsItem[]> {
  const results = await Promise.all(
    RSS_FEEDS.map(async (feed) => {
      const response = await fetch(
        `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}`
      );
      const data = await response.json();
      return (data.items || []).slice(0, 3).map((item: any) => ({
        title: item.title,
        link: item.link,
        source: feed.source,
        pubDate: item.pubDate,
      }));
    })
  );
  return results.flat().sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
}
```

### 错误处理
- 网络错误: 显示"请检查网络后重试"
- API 返回错误: 显示"资讯加载失败"
- 超时: 10 秒超时，显示超时错误

---

## 实施顺序

1. 创建 `app/hooks/useNews.ts` — 新闻数据获取逻辑
2. 创建 `app/components/NewsSection.tsx` — 新闻区块组件
3. 修改 `app/page.tsx` — 集成新闻区块
4. 添加相关 CSS 样式
5. 测试和调试

---

## 验收标准

- [ ] 新闻区块正确显示 Steam 和游民星空的最新资讯
- [ ] 加载状态显示骨架屏/加载动画
- [ ] 错误状态显示友好提示
- [ ] 点击标题可跳转到原文
- [ ] 刷新按钮可手动刷新新闻
- [ ] 移动端布局正常
