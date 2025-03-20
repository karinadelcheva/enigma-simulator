
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface ApiToggleProps {
  useBackend: boolean;
  onToggle: (value: boolean) => void;
  className?: string;
}

const ApiToggle: React.FC<ApiToggleProps> = ({ 
  useBackend, 
  onToggle,
  className
}) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Switch 
        id="api-mode" 
        checked={useBackend} 
        onCheckedChange={onToggle} 
      />
      <Label htmlFor="api-mode" className="text-sm cursor-pointer">
        Use Python Backend
      </Label>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <InfoCircledIcon className="h-4 w-4 text-enigma-accent cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <div className="max-w-xs">
              <p>
                Toggle between the TypeScript implementation (frontend) and the Python backend API.
                Using the Python backend requires starting the Flask server in the backend directory.
              </p>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default ApiToggle;
