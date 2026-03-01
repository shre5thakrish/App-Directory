import React, { useEffect, useState, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { useDebounce } from '@/hooks/use-debounce';
import { 
  Zap, 
  Github, 
  Globe, 
  Star, 
  TrendingUp, 
  Users, 
  Code, 
  Database, 
  Cloud, 
  Server, 
  Terminal, 
  Box, 
  Layers, 
  Cpu, 
  Activity, 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  GitMerge, 
  GitFork, 
  GitCompare, 
  GitPullRequestDraft, 
  GitPullRequestClosed, 
  GitPullRequestCreate, 
  MessageSquare, 
  Share2, 
  ExternalLink,
  ArrowUpRight,
  Loader2,
  RefreshCw,
  User,
  BookOpen,
  Filter,
  Calendar,
  Trophy,
  Scale
} from 'lucide-react';
import { Modal } from '@/components/ui/modal';

interface AppItem {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode | string;
  stars: number;
  forks: number;
  tags: string[];
  url: string;
  category: string;
  type: 'repository' | 'user';
  owner?: string;
  language?: string;
  updatedAt?: string;
  followers?: number;
  following?: number;
  public_repos?: number;
  location?: string;
  license?: string;
  createdAt?: string;
}

const staticApps: AppItem[] = [
  {
    id: '1',
    name: 'react',
    description: 'A JavaScript library for building user interfaces. Declarative, component-based, and learn once, write anywhere.',
    icon: <Code className="w-8 h-8 text-blue-500" />,
    stars: 213000,
    forks: 45000,
    tags: ['Frontend', 'JavaScript', 'UI'],
    url: 'https://react.dev',
    category: 'Framework',
    type: 'repository',
    owner: 'facebook',
    license: 'MIT',
    createdAt: '2013-05-24T16:15:54Z'
  },
];

interface AppGridProps {
  searchQuery?: string;
  searchType?: 'repositories' | 'users';
}

export function AppGrid({ searchQuery = '', searchType = 'repositories' }: AppGridProps) {
  const [apps, setApps] = useState<AppItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedApp, setSelectedApp] = useState<AppItem | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Filter states
  const [filterLanguage, setFilterLanguage] = useState('');
  const [filterStars, setFilterStars] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const fetchData = useCallback(async (query: string, type: 'repositories' | 'users', pageNum: number, signal?: AbortSignal) => {
    if (pageNum === 1) {
      setLoading(true);
    } else {
      setLoadingMore(true);
    }
    setError(null);
    try {
      let url = '';
      const PER_PAGE = 12;
      
      if (type === 'users') {
        // User search mode
        if (query) {
          url = `https://api.github.com/search/users?q=${encodeURIComponent(query)}&per_page=${PER_PAGE}&page=${pageNum}`;
        } else {
          setApps([]);
          setLoading(false);
          setLoadingMore(false);
          return;
        }
      } else {
        // Repository mode (Search or Trending)
        // Removed fork:false and archived:false to show all repositories
        let qParts: string[] = ['is:public'];
        
        if (query) {
          qParts.push(query);
        }

        if (filterLanguage) {
          qParts.push(`language:${filterLanguage}`);
        }

        if (filterStars) {
          qParts.push(`stars:${filterStars}`);
        }

        if (filterDate) {
          const date = new Date();
          if (filterDate === 'Last 7 days') date.setDate(date.getDate() - 7);
          else if (filterDate === 'Last 30 days') date.setDate(date.getDate() - 30);
          else if (filterDate === 'Last year') date.setFullYear(date.getFullYear() - 1);
          
          const dateString = date.toISOString().split('T')[0];
          qParts.push(`created:>${dateString}`);
        } else if (!query) {
          // Default trending: Last 7 days if no query and no specific date filter
          const date = new Date();
          date.setDate(date.getDate() - 7);
          const dateString = date.toISOString().split('T')[0];
          qParts.push(`created:>${dateString}`);
        }

        const q = qParts.join(' ');
        url = `https://api.github.com/search/repositories?q=${encodeURIComponent(q)}&sort=stars&order=desc&per_page=${PER_PAGE}&page=${pageNum}`;
      }

      const response = await fetch(url, { signal });

      if (!response.ok) {
        if (response.status === 403) {
          throw new Error('API rate limit exceeded. Please try again later.');
        } else if (response.status === 422) {
          throw new Error('Invalid search query. Please refine your criteria.');
        } else if (response.status === 503) {
          throw new Error('GitHub service is currently unavailable.');
        } else {
          throw new Error(`Failed to load data (Status: ${response.status}).`);
        }
      }

      const data = await response.json();
      
      const items: AppItem[] = data.items.map((item: any) => {
        if (type === 'users') {
           return {
            id: item.id.toString(),
            name: item.login,
            description: item.bio || 'No bio available.',
            icon: item.avatar_url,
            stars: 0,
            forks: 0,
            tags: ['User'],
            url: item.html_url,
            category: 'User',
            type: 'user',
            owner: item.login
          };
        } else {
          return {
            id: item.id.toString(),
            name: item.name,
            description: item.description || 'No description available.',
            icon: item.owner.avatar_url,
            stars: item.stargazers_count,
            forks: item.forks_count,
            tags: [item.language || 'Code', 'GitHub'],
            url: item.html_url,
            category: item.language || 'Open Source',
            type: 'repository',
            owner: item.owner.login,
            language: item.language,
            updatedAt: item.updated_at,
            license: item.license?.name,
            createdAt: item.created_at
          };
        }
      });
      
      if (pageNum === 1) {
        setApps(items);
      } else {
        setApps(prev => [...prev, ...items]);
      }
      
      setHasMore(items.length === PER_PAGE);
      
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      console.error('Error fetching data:', err);
      if (pageNum === 1) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
        if (!query && type === 'repositories') setApps(staticApps);
        else setApps([]);
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
        setLoadingMore(false);
      }
    }
  }, [filterLanguage, filterStars, filterDate]);

  useEffect(() => {
    const controller = new AbortController();
    setPage(1);
    fetchData(debouncedSearchQuery, searchType, 1, controller.signal);
    return () => controller.abort();
  }, [debouncedSearchQuery, searchType, fetchData]);

  const handleRefresh = () => {
    setPage(1);
    fetchData(debouncedSearchQuery, searchType, 1);
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(debouncedSearchQuery, searchType, nextPage);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
        <p className="text-slate-500 font-medium">Loading...</p>
      </div>
    );
  }

  const handleAppClick = async (app: AppItem) => {
    setSelectedApp(app);
    
    if (app.type === 'user') {
      try {
        const res = await fetch(`https://api.github.com/users/${app.name}`);
        if (res.ok) {
          const data = await res.json();
          setSelectedApp(prev => {
            if (prev?.id === app.id) {
              return {
                ...prev,
                description: data.bio || 'No bio available.',
                followers: data.followers,
                following: data.following,
                public_repos: data.public_repos,
                location: data.location,
                name: data.name || data.login // Use full name if available
              };
            }
            return prev;
          });
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    } else if (app.type === 'repository' && app.owner) {
      try {
        const res = await fetch(`https://api.github.com/repos/${app.owner}/${app.name}`);
        if (res.ok) {
          const data = await res.json();
          setSelectedApp(prev => {
            if (prev?.id === app.id) {
              return {
                ...prev,
                description: data.description || prev?.description,
                stars: data.stargazers_count,
                forks: data.forks_count,
                license: data.license?.name,
                createdAt: data.created_at,
                updatedAt: data.updated_at,
                language: data.language,
              };
            }
            return prev;
          });
        }
      } catch (error) {
        console.error('Error fetching repo details:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      {!searchQuery && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-slate-900">
              {filterDate ? `Trending on GitHub (${filterDate})` : "Live Trending on GitHub (Last 7 Days)"}
            </h3>
          </div>
          <button 
            onClick={handleRefresh}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-blue-600 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      )}

      {searchType === 'repositories' && (
        <div className="flex flex-wrap items-center gap-3 pb-2">
          <div className="flex items-center gap-2 text-sm text-slate-500 mr-2">
            <Filter className="w-4 h-4" />
            <span className="font-medium">Filters:</span>
          </div>
          
          <div className="relative">
            <select 
              value={filterLanguage} 
              onChange={(e) => setFilterLanguage(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-colors cursor-pointer"
            >
              <option value="">All Languages</option>
              <option value="JavaScript">JavaScript</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="Go">Go</option>
              <option value="Rust">Rust</option>
              <option value="C++">C++</option>
              <option value="Swift">Swift</option>
              <option value="Kotlin">Kotlin</option>
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
               <Code className="w-3 h-3" />
            </div>
          </div>

          <div className="relative">
            <select 
              value={filterStars} 
              onChange={(e) => setFilterStars(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-colors cursor-pointer"
            >
              <option value="">Any Stars</option>
              <option value=">1000">&gt; 1k Stars</option>
              <option value=">5000">&gt; 5k Stars</option>
              <option value=">10000">&gt; 10k Stars</option>
              <option value=">50000">&gt; 50k Stars</option>
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
               <Trophy className="w-3 h-3" />
            </div>
          </div>

           <div className="relative">
            <select 
              value={filterDate} 
              onChange={(e) => setFilterDate(e.target.value)}
              className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 hover:border-slate-300 transition-colors cursor-pointer"
            >
              <option value="">Any time</option>
              <option value="Last 7 days">Last 7 days</option>
              <option value="Last 30 days">Last 30 days</option>
              <option value="Last year">Last year</option>
            </select>
            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
               <Calendar className="w-3 h-3" />
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm flex items-center gap-2">
          <Activity className="w-4 h-4" />
          {error}
        </div>
      )}

      {apps.length === 0 && !loading && !error && (
        <div className="text-center py-20 text-slate-500">
          No results found for "{searchQuery}"
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {apps.map((app) => (
          <div 
            key={app.id} 
            onClick={() => handleAppClick(app)}
            className="group relative block w-full p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl hover:border-blue-300 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 overflow-hidden text-left cursor-pointer"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ArrowUpRight className="w-5 h-5 text-blue-500" />
            </div>
            
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                {typeof app.icon === 'string' ? (
                  <img src={app.icon} alt={app.name} className="w-full h-full object-cover" />
                ) : (
                  app.icon
                )}
              </div>
            </div>
            
            <div className="min-w-0 mb-2">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate pr-6">
                {app.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                  {app.category}
                </span>
              </div>
            </div>
            
            <p className="text-slate-600 mb-4 line-clamp-2 text-sm sm:text-base leading-relaxed h-10 sm:h-12">
              {app.description}
            </p>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
              <div className="flex items-center gap-4 text-sm text-slate-500">
                {app.type === 'repository' ? (
                  <>
                    <div className="flex items-center gap-1.5 hover:text-slate-700 transition-colors">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-medium">
                        {app.stars > 1000 ? `${(app.stars / 1000).toFixed(1)}k` : app.stars}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-slate-700 transition-colors">
                      <GitFork className="w-4 h-4 text-slate-400" />
                      <span>
                        {app.forks > 1000 ? `${(app.forks / 1000).toFixed(1)}k` : app.forks}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex items-center gap-1.5 hover:text-slate-700 transition-colors">
                    <User className="w-4 h-4 text-slate-400" />
                    <span>User Profile</span>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                {app.tags.slice(0, 2).map((tag, i) => (
                  <span key={i} className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {apps.length > 0 && hasMore && (
        <div className="flex justify-center pt-8 pb-4">
          <button
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-700 font-medium hover:bg-slate-50 hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Loading more...
              </>
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}

      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title={selectedApp?.type === 'repository' ? 'Repository Details' : 'User Profile'}
      >
        {selectedApp && (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden flex-shrink-0">
                {typeof selectedApp.icon === 'string' ? (
                  <img src={selectedApp.icon} alt={selectedApp.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">{selectedApp.icon}</div>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{selectedApp.name}</h3>
                <p className="text-slate-500">{selectedApp.owner || selectedApp.location || 'GitHub User'}</p>
                <div className="flex gap-2 mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {selectedApp.category}
                  </span>
                  {selectedApp.language && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                      {selectedApp.language}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 text-lg leading-relaxed">
                {selectedApp.description}
              </p>
            </div>

            {selectedApp.type === 'repository' ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <div className="flex items-center justify-center gap-2 text-amber-500 mb-1">
                      <Star className="w-5 h-5 fill-current" />
                      <span className="text-xl font-bold text-slate-900">
                        {selectedApp.stars.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">Stars</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center">
                    <div className="flex items-center justify-center gap-2 text-blue-500 mb-1">
                      <GitFork className="w-5 h-5" />
                      <span className="text-xl font-bold text-slate-900">
                        {selectedApp.forks.toLocaleString()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">Forks</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
                  {selectedApp.license && (
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <Scale className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-900">License:</span>
                      <span>{selectedApp.license}</span>
                    </div>
                  )}
                  {selectedApp.createdAt && (
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-900">Created:</span>
                      <span>{new Date(selectedApp.createdAt).toLocaleDateString()}</span>
                    </div>
                  )}
                  {selectedApp.updatedAt && (
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                      <RefreshCw className="w-4 h-4 text-slate-400" />
                      <span className="font-medium text-slate-900">Updated:</span>
                      <span>{new Date(selectedApp.updatedAt).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <div className="flex items-center justify-center gap-2 text-slate-700 mb-1">
                    <Users className="w-5 h-5" />
                    <span className="text-lg font-bold text-slate-900">
                      {selectedApp.followers?.toLocaleString() || '-'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Followers</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <div className="flex items-center justify-center gap-2 text-slate-700 mb-1">
                    <User className="w-5 h-5" />
                    <span className="text-lg font-bold text-slate-900">
                      {selectedApp.following?.toLocaleString() || '-'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Following</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <div className="flex items-center justify-center gap-2 text-slate-700 mb-1">
                    <BookOpen className="w-5 h-5" />
                    <span className="text-lg font-bold text-slate-900">
                      {selectedApp.public_repos?.toLocaleString() || '-'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">Repos</p>
                </div>
              </div>
            )}

            <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
              <a 
                href={selectedApp.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </a>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
