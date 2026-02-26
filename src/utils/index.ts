import { DailyReport, DateArchive, HotEvent, CategoryType } from '@/types';
import dayjs from 'dayjs';

// 获取当前日期的报告
export async function fetchTodayReport(): Promise<DailyReport | null> {
  const today = dayjs().format('YYYY-MM-DD');
  return fetchReportByDate(today);
}

// 根据日期获取报告
export async function fetchReportByDate(date: string): Promise<DailyReport | null> {
  try {
    const response = await fetch(`/data/${date}.json`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch report:', error);
    return null;
  }
}

// 获取可用的日期列表
export async function fetchAvailableDates(): Promise<DateArchive[]> {
  try {
    const response = await fetch('/data/dates.json');
    if (!response.ok) return [];
    return await response.json();
  } catch {
    return [];
  }
}

// 格式化热度数值
export function formatHotValue(value: number): string {
  if (value >= 100000000) {
    return (value / 100000000).toFixed(1) + '亿';
  }
  if (value >= 10000) {
    return (value / 10000).toFixed(1) + '万';
  }
  return value.toString();
}

// 格式化热度得分
export function formatHeatScore(score: number): string {
  return score.toFixed(1);
}

// 获取分类颜色
export function getCategoryColor(categoryId: CategoryType): string {
  const colors: Record<CategoryType, string> = {
    social: '#ef4444',
    government: '#3b82f6',
    tech: '#8b5cf6',
    business: '#22c55e',
    lifestyle: '#ec4899',
    knowledge: '#f59e0b',
    platform: '#06b6d4',
    sports: '#eab308',
    anime: '#f97316',
    entertainment: '#a855f7',
  };
  return colors[categoryId] || '#6b7280';
}

// 排序事件
export function sortEvents(events: HotEvent[], sortBy: 'rank' | 'heat' = 'heat'): HotEvent[] {
  return [...events].sort((a, b) => {
    if (sortBy === 'rank') return a.rank - b.rank;
    return b.heatScore - a.heatScore;
  });
}

// 获取相对时间
export function getRelativeTime(dateString: string): string {
  const date = dayjs(dateString);
  const now = dayjs();
  const diffHours = now.diff(date, 'hour');
  
  if (diffHours < 1) return '刚刚';
  if (diffHours < 24) return `${diffHours}小时前`;
  return date.format('MM-DD HH:mm');
}

// 计算排名变化
export function calculateRankChange(currentRank: number, previousRank: number): { value: number; direction: 'up' | 'down' | 'same' } {
  const change = previousRank - currentRank;
  if (change > 0) return { value: change, direction: 'up' };
  if (change < 0) return { value: Math.abs(change), direction: 'down' };
  return { value: 0, direction: 'same' };
}

// 导出日期选项
export function getDateOptions(days: number = 30): DateArchive[] {
  const dates: DateArchive[] = [];
  const today = dayjs();
  
  for (let i = 0; i < days; i++) {
    const date = today.subtract(i, 'day');
    dates.push({
      date: date.format('YYYY-MM-DD'),
      label: date.format('MM月DD日') + (i === 0 ? ' (今天)' : ''),
      url: `/${date.format('YYYY-MM-DD')}/`,
    });
  }
  
  return dates;
}
