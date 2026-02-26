import { DailyReport } from '@/types';
import { formatHotValue, formatHeatScore } from '@/utils';

interface ReportSummaryProps {
  report: DailyReport;
}

export default function ReportSummary({ report }: ReportSummaryProps) {
  const { summary } = report;
  
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {/* 总事件数 */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-dark-border">
        <div className="text-sm text-gray-500 dark:text-dark-muted mb-1">热搜事件</div>
        <div className="text-3xl font-bold text-gray-900 dark:text-dark-text">
          {summary.totalEvents}
        </div>
      </div>
      
      {/* 总热度 */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-dark-border">
        <div className="text-sm text-gray-500 dark:text-dark-muted mb-1">总热度</div>
        <div className="text-3xl font-bold gradient-text">
          {formatHotValue(summary.totalHeat)}
        </div>
      </div>
      
      {/* 分类数 */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-dark-border">
        <div className="text-sm text-gray-500 dark:text-dark-muted mb-1">涵盖分类</div>
        <div className="text-3xl font-bold text-gray-900 dark:text-dark-text">
          {summary.categoryCount}
        </div>
      </div>
      
      {/* 峰值事件 */}
      <div className="bg-white dark:bg-dark-card rounded-2xl p-6 border border-gray-100 dark:border-dark-border">
        <div className="text-sm text-gray-500 dark:text-dark-muted mb-1">最热事件</div>
        <div className="text-lg font-semibold text-gray-900 dark:text-dark-text truncate">
          {summary.peakEvent?.title || '-'}
        </div>
      </div>
    </div>
  );
}
