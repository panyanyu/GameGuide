import { Site } from '../types';

export const curatedSites: Site[] = [
  {
    name: 'Steam',
    description: '全球最大的PC游戏平台，提供折扣、社区和云存档。',
    url: 'https://store.steampowered.com',
    tag: '商店',
  },
  {
    name: 'Epic Games Store',
    description: '热门大作免费领取与独占游戏。',
    url: 'https://www.epicgames.com/store/zh-CN/',
    tag: '商店',
  },
  {
    name: 'GOG',
    description: '无DRM经典游戏与独立佳作收藏。',
    url: 'https://www.gog.com',
    tag: '商店',
  },
  {
    name: 'WeGame',
    description: '腾讯旗下游戏平台，支持国服游戏、促销与社区交流。',
    url: 'https://www.wegame.com.cn',
    tag: '商店',
  },
  {
    name: 'TapTap',
    description: '国内主流手游社区与移动游戏下载平台。',
    url: 'https://www.taptap.com',
    tag: '社区',
  },
  {
    name: 'Netease Games',
    description: '网易游戏官网，覆盖热门网游与手游新闻。',
    url: 'https://game.163.com',
    tag: '媒体',
  },
  {
    name: '17173',
    description: '中文游戏资讯、攻略与玩家交流社区。',
    url: 'https://www.17173.com',
    tag: '媒体',
  },
  {
    name: 'Bilibili 游戏',
    description: 'B站游戏频道，结合视频、直播与社区互动。',
    url: 'https://www.bilibili.com/v/game',
    tag: '直播',
  },
  {
    name: '4399',
    description: '经典网页游戏与小游戏平台，适合快速娱乐。',
    url: 'https://www.4399.com',
    tag: '工具',
  },
  {
    name: 'IGN',
    description: '游戏新闻、评测、攻略与新游专题。',
    url: 'https://www.ign.com',
    tag: '媒体',
  },
  {
    name: 'GameSpot',
    description: '最新游戏资讯、评测和视频内容。',
    url: 'https://www.gamespot.com',
    tag: '媒体',
  },
  {
    name: 'Metacritic',
    description: '汇总评分与新游口碑数据。',
    url: 'https://www.metacritic.com',
    tag: '数据',
  },
  {
    name: 'Kotaku',
    description: '深度游戏报道与业界观察。',
    url: 'https://kotaku.com',
    tag: '媒体',
  },
  {
    name: 'Polygon',
    description: '游戏文化、评论和原创专题。',
    url: 'https://www.polygon.com',
    tag: '社区',
  },
  {
    name: 'GameFAQs',
    description: '最全游戏攻略、FAQ和玩家问答。',
    url: 'https://www.gamefaqs.com',
    tag: '工具',
  },
  {
    name: 'Twitch',
    description: '实时游戏直播与互动社区。',
    url: 'https://www.twitch.tv',
    tag: '直播',
  },
  {
    name: 'itch.io',
    description: '独立游戏创作者和实验性作品聚集地。',
    url: 'https://itch.io',
    tag: '独立',
  },
  {
    name: 'Humble Bundle',
    description: '游戏礼包与慈善捐赠组合优惠。',
    url: 'https://www.humblebundle.com',
    tag: '优惠',
  },
];

export const allTags = ['全部', ...Array.from(new Set(curatedSites.map((s) => s.tag)))];
