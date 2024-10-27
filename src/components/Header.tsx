import React from 'react';
import { Link as LinkIcon } from 'lucide-react';

interface HeaderProps {
  onReset?: () => void;
  showReset?: boolean;
  onFeaturesClick?: () => void;
}

function Header({ onReset, showReset = false, onFeaturesClick }: HeaderProps) {
  const handleLogoClick = () => {
    if (onReset) {
      onReset();
    } else {
      window.location.href = '/';
    }
  };

  const handleFeaturesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onFeaturesClick) {
      onFeaturesClick();
    }
  };

  return (
    <header className="w-full py-6 px-4 backdrop-blur-sm border-b border-slate-800 fixed top-0 z-50 bg-slate-900/80">
      <div className="container mx-auto flex justify-between items-center">
        <button 
          onClick={handleLogoClick}
          className="flex items-center gap-2 hover:text-purple-400 transition-colors cursor-pointer"
        >
          <LinkIcon className="w-6 h-6 text-purple-400" />
          <span className="text-white font-bold text-xl">EntreLink</span>
        </button>
        
        <nav>
          <ul className="flex gap-8">
            {showReset ? (
              <li>
                <button 
                  onClick={onReset}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Upload New Resume
                </button>
              </li>
            ) : (
              <li>
                <a 
                  href="#features" 
                  onClick={handleFeaturesClick}
                  className="text-slate-300 hover:text-white transition-colors"
                >
                  Features
                </a>
              </li>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;