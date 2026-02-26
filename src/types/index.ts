// 数据类型定义

export interface HotEvent {
  id: string;
  title: string;
  hotValue: number;
  heatScore: number;
  rank: number;
  category: CategoryType;
  firstSeen: string;
  lastUpdated: string;
  originalTitles: string[];
}

export type CategoryType = 
  | 'social'      // 社会新闻
  | 'government'  // 政务政策
  | 'tech'        // 科技互联网
  | 'business'    // 财经商业
  | 'lifestyle'   // 生活方式
  | 'knowledge'  // 知识科普
  | 'platform'   // 平台生态
  | 'sports'      // 体育赛事
  | 'anime'       // 游戏动漫
  | 'entertainment'; // 娱乐文娱

export interface Category {
  id: CategoryType;
  name: string;
  emoji: string;
  color: string;
  events: HotEvent[];
  totalHeat: number;
}

export interface DailyReport {
  date: string;                    // 日期 2026-02-27
  timeRange: string;               // 时间范围 "00:00-24:00"
  generatedAt: string;              // 生成时间
  
  // 汇总数据
  summary: {
    totalEvents: number;
    totalHeat: number;
    categoryCount: number;
    newEvents: number;
    peakEvent: HotEvent | null;
    topCategories: CategoryType[];
  };
  
  // 分类数据
  categories: Record<CategoryType, Category>;
  
  // 热门事件
  topEvents: HotEvent[];
  
  // 时间线（每小时热度变化）
  timeline: TimelineEntry[];
}

export interface TimelineEntry {
  hour: number;
  timestamp: string;
  topEvents: HotEvent[];
  totalHeat: number;
}

export interface DateArchive {
  date: string;
  label: string;
  url: string;
}

// 分类配置
export const CATEGORY_CONFIG: Record<CategoryType, { name: string; emoji: string; color: string; description: string }> = {
  social: {
    name: '社会新闻',
    emoji: '🔥',
    color: '#ef4444',
    description: '公共事件、事故、犯罪等社会热点'
  },
  government: {
    name: '政务政策',
    emoji: '🏛',
    color: '#3b82f6',
    description: '政府发布、政策法规、人事变动等'
  },
  tech: {
    name: '科技互联网',
    emoji: '🤖',
    color: '#8b5cf6',
    description: 'AI、科技产品、互联网公司动态'
  },
  business: {
    name: '财经商业',
    emoji: '📈',
    color: '#22c55e',
    description: '股市、公司财报、经济数据等'
  },
  lifestyle: {
    name: '生活方式',
    emoji: '🌸',
    color: '#ec4899',
    description: '美食、旅游、时尚、健康等'
  },
  knowledge: {
    name: '知识科普',
    emoji: '💡',
    color: '#f59e0b',
    description: '科学知识、教育考试、历史文化的'
  },
  platform: {
    name: '平台生态',
    emoji: '🌐',
    color: '#06b6d4',
    description: '社交平台、网络文化、网红等'
  },
  sports: {
    name: '体育赛事',
    emoji: '🏆',
    color: '#eab308',
    description: '体育比赛、运动员动态'
  },
  anime: {
    name: '游戏动漫',
    emoji: '🎮',
    color: '#f97316',
    description: '游戏、动漫、二次元相关内容'
  },
  entertainment: {
    name: '娱乐文娱',
    emoji: '🎬',
    color: '#a855f7',
    description: '电影、电视剧、综艺、音乐等'
  }
};
