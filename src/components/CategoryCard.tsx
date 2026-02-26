'use client';

import { Category, CategoryType, CATEGORY_CONFIG } from '@/types';
import { formatHotValue } from '@/utils';
import { motion } from 'framer-motion';

interface CategoryCardProps {
  category: Category;
  index: number;
}

export default function CategoryCard({ category, index }: CategoryCardProps) {
  const config = CATEGORY_CONFIG[category.id];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* 分类头部 */}
      <div 
        className="px-6 py-4 flex items-center justify-between"
        style={{ backgroundColor: `${config.color}10` }}
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{config.emoji}</span>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-dark-text">
              {config.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-dark-muted">
              {config.description}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold" style={{ color: config.color }}>
            {formatHotValue(category.totalHeat)}
          </div>
          <div className="text-xs text-gray-500 dark:text-dark-muted">
            {category.events.length} 个事件
          </div>
        </div>
      </div>
      
      {/* 事件列表 */}
      <div className="p-4 space-y-3">
        {category.events.slice(0, 5).map((event, idx) => (
          <div 
            key={event.id}
            className="flex items-center gap-3 group"
          >
            <span 
              className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium"
              style={{ 
                backgroundColor: idx < 3 ? config.color : '#e5e7eb',
                color: idx < 3 ? 'white' : '#6b7280'
              }}
            >
              {idx + 1}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-900 dark:text-dark-text truncate group-hover:text-primary-600 transition-colors">
                {event.title}
              </p>
            </div>
            <span className="text-xs text-gray-400">
              #{event.rank}
            </span>
          </div>
        ))}
        
        {category.events.length > 5 && (
          <div className="text-center pt-2">
            <span className="text-sm text-primary-600 hover:text-primary-700 cursor-pointer">
              查看全部 {category.events.length} 个事件 →
            </span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
