import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { SearchBar } from '@/components/search-bar';
import { AppGrid } from '@/components/app-grid';
import { Modal } from '@/components/ui/modal';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'repositories' | 'users'>('repositories');
  const [activeModal, setActiveModal] = useState<'privacy' | 'terms' | 'about' | 'contact' | null>(null);

  const renderModalContent = () => {
    switch (activeModal) {
      case 'privacy':
        return (
          <div className="space-y-4 text-slate-600">
            <p>Your privacy is important to us. It is App Directory's policy to respect your privacy regarding any information we may collect from you across our website.</p>
            <p>We only ask for personal information when we truly need it to provide a service to you. We collect it by fair and lawful means, with your knowledge and consent.</p>
            <p>We only retain collected information for as long as necessary to provide you with your requested service. What data we store, we'll protect within commercially acceptable means to prevent loss and theft, as well as unauthorized access, disclosure, copying, use or modification.</p>
          </div>
        );
      case 'terms':
        return (
          <div className="space-y-4 text-slate-600">
            <p>By accessing the website at App Directory, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws.</p>
            <p>Use License: Permission is granted to temporarily download one copy of the materials (information or software) on App Directory's website for personal, non-commercial transitory viewing only.</p>
            <p>Disclaimer: The materials on App Directory's website are provided on an 'as is' basis. App Directory makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>
          </div>
        );
      case 'about':
        return (
          <div className="space-y-4 text-slate-600">
            <p>App Directory is a curated collection of the best developer tools, libraries, and resources. Our mission is to help developers discover the tools they need to build amazing things.</p>
            <p>We believe in the power of open source and community-driven development. That's why we've built this platform to showcase the incredible work being done by developers around the world.</p>
            <p>Whether you're looking for a new frontend framework, a robust backend service, or a handy utility library, you'll find it here.</p>
          </div>
        );
      case 'contact':
        return (
          <div className="space-y-4">
            <p className="text-slate-600">Have questions or suggestions? We'd love to hear from you. Fill out the form below or send us an email.</p>
            <form
              action="https://formspree.io/f/xwvnjnkp"
              method="POST"
              className="space-y-4"
            >
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  Your email:
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  required
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-1">
                  Your message:
                </label>
                <textarea
                  name="message"
                  id="message"
                  required
                  rows={4}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all resize-none"
                  placeholder="How can we help?"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg transition-colors font-medium"
              >
                Send
              </button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  const getModalTitle = () => {
    switch (activeModal) {
      case 'privacy': return 'Privacy Policy';
      case 'terms': return 'Terms of Service';
      case 'about': return 'About Us';
      case 'contact': return 'Contact Us';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="text-center mb-12 max-w-2xl mx-auto">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
            Discover the best tools
          </h1>
          <p className="text-lg text-slate-600 mb-8 leading-relaxed">
            A curated directory of the best developer tools, libraries, and resources.
            Find what you need to build your next big thing.
          </p>
          
          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchType={searchType}
            setSearchType={setSearchType}
          />
          
          <div className="mt-8 flex flex-wrap justify-center gap-2 text-sm text-slate-500">
            <span className="font-medium text-slate-700">Popular:</span>
            {['React', 'Vue', 'Tailwind', 'Next.js', 'Supabase', 'Stripe'].map((tag) => (
              <button 
                key={tag}
                onClick={() => setSearchQuery(tag)}
                className="px-3 py-1 bg-white border border-slate-200 rounded-full hover:border-blue-300 hover:text-blue-600 transition-colors shadow-sm"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <span className="w-2 h-8 bg-blue-500 rounded-full inline-block"></span>
            {searchQuery ? `Search Results for "${searchQuery}"` : 'Featured Apps'}
          </h2>
          
          <div className="flex items-center gap-2">
            <select className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 hover:border-slate-300 transition-colors cursor-pointer outline-none">
              <option>Most Popular</option>
              <option>Newest</option>
              <option>Trending</option>
            </select>
          </div>
        </div>

        <AppGrid searchQuery={searchQuery} searchType={searchType} />
        

      </main>
      
      <footer className="bg-white border-t border-slate-200 mt-20 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <button 
              onClick={() => { setSearchQuery(''); setSearchType('repositories'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-slate-900 font-semibold hover:text-blue-600 transition-colors"
            >
              App Directory
            </button>
            <p className="text-slate-500 text-sm mt-1">© 2024 All rights reserved.</p>
          </div>
          
          <div className="flex items-center gap-6 text-slate-500">
            <button onClick={() => setActiveModal('privacy')} className="hover:text-slate-900 transition-colors">Privacy</button>
            <button onClick={() => setActiveModal('terms')} className="hover:text-slate-900 transition-colors">Terms</button>
            <button onClick={() => setActiveModal('about')} className="hover:text-slate-900 transition-colors">About</button>
            <button onClick={() => setActiveModal('contact')} className="hover:text-slate-900 transition-colors">Contact</button>
          </div>
        </div>
      </footer>

      <Modal 
        isOpen={!!activeModal} 
        onClose={() => setActiveModal(null)} 
        title={getModalTitle()}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
}

export default App;
