import React from 'react';
import { Search, Command, X, ChevronDown } from 'lucide-react';

interface SearchBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchType: 'repositories' | 'users';
  setSearchType: (type: 'repositories' | 'users') => void;
}

export function SearchBar({ searchQuery, setSearchQuery, searchType, setSearchType }: SearchBarProps) {
  return (
    <div className="relative w-full max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <Search className="w-5 h-5" />
        </div>
        
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={`Search for ${searchType}...`}
          className="w-full pl-12 pr-12 h-14 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm hover:shadow-md hover:border-slate-300"
        />
        
        {searchQuery && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button 
              onClick={() => setSearchQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      <div className="relative min-w-[140px]">
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value as 'repositories' | 'users')}
          className="w-full h-14 pl-4 pr-10 bg-white border border-slate-200 rounded-xl text-slate-700 text-base focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm cursor-pointer appearance-none"
        >
          <option value="repositories">Repositories</option>
          <option value="users">Users</option>
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
