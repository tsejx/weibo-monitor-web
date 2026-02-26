"""
微博热搜舆情监测系统 - 静态页面生成器
"""
import json
import os
from datetime import datetime, timedelta
from pathlib import Path
from .config import DATA_DIR
from .models import Event, Report, CategorySummary
from .classifier import get_category_name, classify
from .topic_merger import generate_event_id


class StaticPageGenerator:
    """静态页面数据生成器"""
    
    def __init__(self, output_dir: str = None):
        self.output_dir = output_dir or os.path.join(DATA_DIR, '..', 'weibo-monitor-web', 'public', 'data')
        Path(self.output_dir).mkdir(parents=True, exist_ok=True)
    
    def generate_daily_report(self, events: list, hours: int = 24) -> dict:
        """生成每日报告数据"""
        now = datetime.now()
        start_time = now - timedelta(hours=hours)
        
        # 过滤时间范围内的事件
        period_events = [
            e for e in events 
            if e.last_updated >= start_time
        ]
        
        # 按分类汇总
        categories = {}
        for event in period_events:
            cat = event.category or 'entertainment'
            if cat not in categories:
                categories[cat] = []
            categories[cat].append(event)
        
        # 构建分类数据
        categories_data = {}
        category_order = [
            'social', 'government', 'tech', 'business', 'lifestyle',
            'knowledge', 'platform', 'sports', 'anime', 'entertainment'
        ]
        
        for cat_id in category_order:
            cat_events = categories.get(cat_id, [])
            # 按热度排序
            cat_events.sort(key=lambda x: x.total_heat, reverse=True)
            
            categories_data[cat_id] = {
                'id': cat_id,
                'name': get_category_name(cat_id),
                'emoji': self._get_category_emoji(cat_id),
                'color': self._get_category_color(cat_id),
                'events': [
                    {
                        'id': e.event_id,
                        'title': e.standard_name,
                        'hotValue': e.total_heat,
                        'heatScore': e.total_heat,
                        'rank': idx + 1,
                        'category': cat_id,
                        'firstSeen': e.first_seen.isoformat(),
                        'lastUpdated': e.last_updated.isoformat(),
                        'originalTitles': e.original_titles
                    }
                    for idx, e in enumerate(cat_events[:10])
                ],
                'totalHeat': sum(e.total_heat for e in cat_events)
            }
        
        # 汇总数据
        all_events_flat = []
        for cat_events in categories.values():
            for e in cat_events:
                all_events_flat.append({
                    'id': e.event_id,
                    'title': e.standard_name,
                    'hotValue': int(e.total_heat),
                    'heatScore': e.total_heat,
                    'rank': 0,
                    'category': e.category or 'entertainment',
                    'firstSeen': e.first_seen.isoformat(),
                    'lastUpdated': e.last_updated.isoformat()
                })
        
        # 按热度排序并分配排名
        all_events_flat.sort(key=lambda x: x['heatScore'], reverse=True)
        for idx, e in enumerate(all_events_flat):
            e['rank'] = idx + 1
        
        # 峰值事件
        peak_event = all_events_flat[0] if all_events_flat else None
        
        # 构建报告
        report = {
            'date': now.strftime('%Y-%m-%d'),
            'timeRange': f'00:00-{now.strftime("%H:%M")}',
            'generatedAt': now.isoformat(),
            'summary': {
                'totalEvents': len(all_events_flat),
                'totalHeat': sum(e['heatScore'] for e in all_events_flat),
                'categoryCount': len([c for c in categories_data.values() if c['events']]),
                'newEvents': len(period_events),
                'peakEvent': peak_event,
                'topCategories': [
                    cat_id for cat_id in category_order 
                    if categories_data.get(cat_id, {}).get('events')
                ][:5]
            },
            'categories': categories_data,
            'topEvents': all_events_flat[:50]
        }
        
        return report
    
    def save_report(self, report: dict, date: str = None):
        """保存报告到文件"""
        if date is None:
            date = datetime.now().strftime('%Y-%m-%d')
        
        filepath = os.path.join(self.output_dir, f'{date}.json')
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        print(f"Report saved: {filepath}")
        return filepath
    
    def update_dates_index(self):
        """更新日期索引"""
        dates = []
        today = datetime.now()
        
        # 扫描已有数据文件
        for i in range(30):
            date = today - timedelta(days=i)
            date_str = date.strftime('%Y-%m-%d')
            filepath = os.path.join(self.output_dir, f'{date_str}.json')
            
            if os.path.exists(filepath):
                dates.append({
                    'date': date_str,
                    'label': date.strftime('%m月%d日') + (' (今天)' if i == 0 else ''),
                    'url': f'/{date_str}/'
                })
        
        # 按日期排序
        dates.sort(key=lambda x: x['date'], reverse=True)
        
        # 保存索引
        filepath = os.path.join(self.output_dir, 'dates.json')
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(dates, f, ensure_ascii=False, indent=2)
        
        print(f"Dates index updated: {len(dates)} dates")
        return dates
    
    def _get_category_emoji(self, cat_id: str) -> str:
        emojis = {
            'social': '🔥', 'government': '🏛', 'tech': '🤖', 'business': '📈',
            'lifestyle': '🌸', 'knowledge': '💡', 'platform': '🌐', 'sports': '🏆',
            'anime': '🎮', 'entertainment': '🎬'
        }
        return emojis.get(cat_id, '📌')
    
    def _get_category_color(self, cat_id: str) -> str:
        colors = {
            'social': '#ef4444', 'government': '#3b82f6', 'tech': '#8b5cf6',
            'business': '#22c55e', 'lifestyle': '#ec4899', 'knowledge': '#f59e0b',
            'platform': '#06b6d4', 'sports': '#eab308', 'anime': '#f97316',
            'entertainment': '#a855f7'
        }
        return colors.get(cat_id, '#6b7280')


def generate_static_pages():
    """生成静态页面数据"""
    from .scheduler import EventStore
    
    # 加载事件
    store = EventStore()
    events = store.load()
    
    if not events:
        print("No events to generate")
        return
    
    # 创建生成器
    generator = StaticPageGenerator()
    
    # 生成当日报告
    report = generator.generate_daily_report(events)
    generator.save_report(report)
    
    # 更新日期索引
    generator.update_dates_index()
    
    print("Static pages generated successfully!")
    return report
