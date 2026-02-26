'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import dayjs from 'dayjs';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentDate, setCurrentDate] = useState(dayjs().format('YYYY-MM-DD'));
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 dark:bg-dark-bg/80 backdrop-blur-lg shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
              <span className="text-white text-lg">🔥</span>
            </div>
            <div>
              <h1 className="font-bold text-gray-900 dark:text-dark-text">
                微博热搜舆情
              </h1>
              <p className="text-xs text-gray-500 dark:text-dark-muted">
                {currentDate} 舆情报告
              </p>
            </div>
          </Link>
          
          {/* 导航 */}
          <nav className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className="text-sm font-medium text-gray-600 dark:text-dark-muted hover:text-primary-600 transition-colors"
            >
              今日热点
            </Link>
            <Link 
              href="/archives" 
              className="text-sm font-medium text-gray-600 dark:text-dark-muted hover:text-primary-600 transition-colors"
            >
              历史汇总
            </Link>
            <Link 
              href="/trends" 
              className="text-sm font-medium text-gray-600 dark:text-dark-muted hover:text-primary-600 transition-colors"
            >
              趋势分析
            </Link>
          </nav>
          
          {/* 右侧 */}
          <div className="flex items-center gap-4">
            <select 
              className="text-sm bg-gray-100 dark:bg-dark-card border-0 rounded-lg px-3 py-2 text-gray-700 dark:text-dark-text"
              value={currentDate}
              onChange={(e) => window.location.href = `/${e.target.value}/`}
            >
              {Array.from({ length: 7 }, (_, i) => {
                const date = dayjs().subtract(i, 'day');
                return (
                  <option key={date.format('YYYY-MM-DD')} value={date.format('YYYY-MM-DD')}>
                    {date.format('MM月DD日')}{i === 0 ? ' (今天)' : ''}
                  </option>
                );
              })}
            </select>
            
            <button className="btn-primary text-sm">
              订阅推送
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
