import './globals.css';
import type { Metadata } from 'next';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: '微博热搜舆情监测',
  description: '微博热搜舆情监测系统 - 每日热点汇总与分析',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <Header />
        <main className="min-h-screen pt-20 pb-12">
          {children}
        </main>
        
        {/* 页脚 */}
        <footer className="border-t border-gray-100 dark:border-dark-border py-8">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-500 dark:text-dark-muted">
                © 2026 微博热搜舆情监测系统 · 自动更新
              </div>
              <div className="flex items-center gap-6">
                <a href="#" className="text-sm text-gray-500 hover:text-primary-600">
                  GitHub
                </a>
                <a href="#" className="text-sm text-gray-500 hover:text-primary-600">
                  API
                </a>
                <a href="#" className="text-sm text-gray-500 hover:text-primary-600">
                  关于
                </a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
