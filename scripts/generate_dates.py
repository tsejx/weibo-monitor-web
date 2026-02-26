#!/usr/bin/env python3
"""
生成日期索引文件
"""
import json
import os
from datetime import datetime, timedelta

def generate_dates_index(output_path: str = 'public/data/dates.json'):
    """生成可用日期列表"""
    dates = []
    today = datetime.now()
    
    # 生成过去30天的日期
    for i in range(30):
        date = today - timedelta(days=i)
        dates.append({
            'date': date.strftime('%Y-%m-%d'),
            'label': date.strftime('%m月%d日') + (' (今天)' if i == 0 else ''),
            'url': f"/{date.strftime('%Y-%m-%d')}/"
        })
    
    # 确保目录存在
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # 写入文件
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(dates, f, ensure_ascii=False, indent=2)
    
    print(f"Generated dates index: {len(dates)} dates")
    return dates

if __name__ == '__main__':
    generate_dates_index()
