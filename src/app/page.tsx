import { fetchTodayReport } from '@/utils';
import ReportSummary from '@/components/ReportSummary';
import CategoryCard from '@/components/CategoryCard';
import dayjs from 'dayjs';

export default async function HomePage() {
  const report = await fetchTodayReport();
  
  if (!report) {
    return (
      <div className="container-custom">
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            暂无今日数据
          </h1>
          <p className="text-gray-500">
            舆情数据将在每小时更新
          </p>
        </div>
      </div>
    );
  }
  
  // 转换为分类数组并排序
  const categories = Object.values(report.categories)
    .filter(cat => cat.events.length > 0)
    .sort((a, b) => b.totalHeat - a.totalHeat);
  
  return (
    <div className="container-custom">
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-dark-text mb-2">
          微博热搜舆情报告
        </h1>
        <p className="text-gray-500 dark:text-dark-muted">
          {report.timeRange} · 更新于 {dayjs(report.generatedAt).format('HH:mm')}
        </p>
      </div>
      
      {/* 数据汇总 */}
      <ReportSummary report={report} />
      
      {/* 分类卡片 */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-6">
          分类热点
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <CategoryCard 
              key={category.id} 
              category={category} 
              index={index}
            />
          ))}
        </div>
      </div>
      
      {/* 热门事件排行 */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-dark-border p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-dark-text mb-6">
          热门事件 TOP 50
        </h2>
        <div className="space-y-4">
          {report.topEvents.slice(0, 20).map((event, index) => (
            <div 
              key={event.id}
              className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-dark-border transition-colors"
            >
              <span 
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                  index < 3 
                    ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-white' 
                    : 'bg-gray-100 dark:bg-dark-border text-gray-600 dark:text-dark-muted'
                }`}
              >
                {index + 1}
              </span>
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 dark:text-dark-text truncate">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-500 dark:text-dark-muted">
                  热度: {event.hotValue.toLocaleString()}
                </p>
              </div>
              <span 
                className="px-3 py-1 rounded-full text-xs font-medium"
                style={{ 
                  backgroundColor: `${event.category === 'social' ? '#fee2e2' : '#f3f4f6'}`,
                  color: `${event.category === 'social' ? '#dc2626' : '#6b7280'}`
                }}
              >
                {event.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
