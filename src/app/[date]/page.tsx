import { fetchReportByDate } from '@/utils';
import ReportSummary from '@/components/ReportSummary';
import CategoryCard from '@/components/CategoryCard';
import dayjs from 'dayjs';
import { notFound } from 'next/navigation';

interface PageProps {
  params: { date: string };
}

export async function generateStaticParams() {
  // 生成最近30天的静态路径
  const dates = [];
  for (let i = 0; i < 30; i++) {
    dates.push({ date: dayjs().subtract(i, 'day').format('YYYY-MM-DD') });
  }
  return dates;
}

export default async function DatePage({ params }: PageProps) {
  const { date } = params;
  
  // 验证日期格式
  if (!dayjs(date).isValid()) {
    notFound();
  }
  
  const report = await fetchReportByDate(date);
  
  if (!report) {
    return (
      <div className="container-custom">
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {dayjs(date).format('MM月DD日')} 无数据
          </h1>
          <p className="text-gray-500">
            该日期暂无舆情数据
          </p>
        </div>
      </div>
    );
  }
  
  const categories = Object.values(report.categories)
    .filter(cat => cat.events.length > 0)
    .sort((a, b) => b.totalHeat - a.totalHeat);
  
  return (
    <div className="container-custom">
      {/* 面包屑 */}
      <nav className="mb-6 text-sm">
        <a href="/" className="text-primary-600 hover:underline">
          ← 返回今日
        </a>
      </nav>
      
      {/* 页面标题 */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-dark-text mb-2">
          {dayjs(date).format('MM月DD日')} 舆情报告
        </h1>
        <p className="text-gray-500 dark:text-dark-muted">
          {report.timeRange} · 生成于 {dayjs(report.generatedAt).format('HH:mm')}
        </p>
      </div>
      
      <ReportSummary report={report} />
      
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
  );
}
