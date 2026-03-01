import React from 'react';
import { cn } from '@/lib/utils';
import { Zap, Search, Bell, Menu, X, Github } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-2.5 group cursor-pointer">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
            <Zap className="w-5 h-5 text-white fill-white" />
          </div>
          <span className="text-lg font-bold text-slate-900 tracking-tight">App Directory</span>
        </div>

        <div className="hidden md:flex items-center gap-1">
          <nav className="flex items-center gap-1 mr-4">
            {['Discover', 'Categories', 'Submit'].map((item) => (
              <a
                key={item}
                href="#"
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>
          
          <div className="h-4 w-px bg-slate-200 mx-2" />
          
          <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative group">
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
          </button>
          
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>

        <button className="md:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </header>
  );
}
