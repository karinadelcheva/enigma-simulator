
import React from 'react';
import { LockKeyhole, Github } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavBarProps {
  className?: string;
}

const NavBar: React.FC<NavBarProps> = ({ className }) => {
  return (
    <header className={cn("w-full bg-white/80 backdrop-blur-md border-b border-enigma-accent/10 py-4", className)}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-enigma-dark rounded-full w-10 h-10 flex items-center justify-center">
            <LockKeyhole className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-medium text-enigma-dark tracking-tight">Enigma</h1>
            <p className="text-xs text-enigma-accent">Machine Simulator</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs text-enigma-accent hover:text-enigma-dark transition-colors"
          >
            <Github className="h-4 w-4" />
            <span className="hidden sm:inline">View on GitHub</span>
          </a>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
