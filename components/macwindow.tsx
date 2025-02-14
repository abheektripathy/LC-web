import React, { useState, useRef, useEffect } from 'react';
import { Maximize2, Minimize2, X } from 'lucide-react';

interface MacWindowProps {
  children: React.ReactNode;
  title?: string;
  initialWidth?: number;
  initialHeight?: number;
}

const MacWindow: React.FC<MacWindowProps> = ({ 
  children, 
  title = "Avail Light Client", 
  initialWidth = 1280, 
  initialHeight = 820 
}) => {
  const [isResizing, setIsResizing] = useState(false);
  const [dimensions, setDimensions] = useState({
    width: initialWidth,
    height: initialHeight
  });
  const [isMaximized, setIsMaximized] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);
  const resizeStartPos = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight
        });
      } else {
        setDimensions({
          width: initialWidth,
          height: initialHeight
        });
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [initialWidth, initialHeight]);

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleResize);
      document.addEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = 'se-resize';
      document.body.style.userSelect = 'none';
    }

    return () => {
      document.removeEventListener('mousemove', handleResize);
      document.removeEventListener('mouseup', handleResizeEnd);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
  }, [isResizing]);

  const handleResizeStart = (e: React.MouseEvent) => {
    if (isMobile) return;
    e.preventDefault();
    setIsResizing(true);
    resizeStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      width: dimensions.width,
      height: dimensions.height
    };
  };

  const handleResize = (e: MouseEvent) => {
    if (!isResizing || isMobile) return;

    const deltaX = e.clientX - resizeStartPos.current.x;
    const deltaY = e.clientY - resizeStartPos.current.y;

    requestAnimationFrame(() => {
      setDimensions({
        width: Math.max(720, resizeStartPos.current.width + deltaX),
        height: Math.max(480, resizeStartPos.current.height + deltaY)
      });
    });
  };

  const handleResizeEnd = () => {
    setIsResizing(false);
  };

  const handleMaximize = () => {
    if (isMobile) return;
    setIsMaximized(!isMaximized);
    if (!isMaximized) {
      setDimensions({
        width: window.innerWidth - 48, // Account for padding
        height: window.innerHeight - 48
      });
    } else {
      setDimensions({
        width: initialWidth,
        height: initialHeight
      });
    }
  };

  const handleMinimize = () => {
    if (isMobile) return;
    if (windowRef.current) {
      windowRef.current.style.transform = 'scale(0.8)';
      windowRef.current.style.opacity = '0';
      windowRef.current.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        if (windowRef.current) {
          windowRef.current.style.display = 'none';
        }
      }, 300);
    }
  };

  return (
    <div className=" min-h-screen w-full flex items-center justify-center bg-[#0D1117]">
          <style jsx global>{`
        ::-webkit-scrollbar {
          width: 10px;
          height: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: #1F2129;
        }
        
        ::-webkit-scrollbar-thumb {
          background: #363945;
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: #454957;
        }

        ::-webkit-scrollbar-corner {
          background: #1F2129;
        }

        * {
          scrollbar-width: thin;
          scrollbar-color: #363945 #1F2129;
        }
      `}</style>
      <div 
        ref={windowRef}
        className={`
          relative bg-[#1F2129] overflow-hidden transition-transform duration-200
          ${isMobile ? '' : 'rounded-xl shadow-xl border border-gray-800'}
          ${isMaximized ? 'fixed inset-6' : ''}
        `}
        style={{
          width: isMobile ? '100%' : dimensions.width,
          height: isMobile ? '100%' : dimensions.height,
          transition: isResizing ? 'none' : 'width 0.2s ease, height 0.2s ease'
        }}
      >
        {!isMobile && (
          <div className="h-8 flex items-center justify-between px-4 select-none">
            <div className="flex space-x-2">
              <button 
                className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-600 transition-colors"
                onClick={() => window.location.reload()}
              >
                <X className="w-2 h-2 mx-auto text-red-800 opacity-0 hover:opacity-100" />
              </button>
              <button 
                className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-colors"
                onClick={handleMinimize}
              >
                <Minimize2 className="w-2 h-2 mx-auto text-yellow-800 opacity-0 hover:opacity-100" />
              </button>
              <button 
                className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-600 transition-colors"
                onClick={handleMaximize}
              >
                <Maximize2 className="w-2 h-2 mx-auto text-green-800 opacity-0 hover:opacity-100" />
              </button>
            </div>
            <div className="absolute inset-x-0 text-center text-sm text-gray-400">
              {title}
            </div>
          </div>
        )}
        <div className={`relative ${isMobile ? 'h-full' : 'h-[calc(100%-2rem)]'} overflow-auto`}>
          {children}
        </div>

        {!isMobile && !isMaximized && (
          <div
            className={`
              absolute bottom-0 right-0 w-6 h-6 cursor-se-resize
              hover:bg-gray-800 hover:bg-opacity-50
              ${isResizing ? 'bg-gray-700 bg-opacity-50' : ''}
            `}
            onMouseDown={handleResizeStart}
          >
            <div className="absolute bottom-1 right-1 w-2 h-2 bg-gray-500 rounded-sm" />
            <div className="absolute bottom-3 right-1 w-2 h-2 bg-gray-600 rounded-sm" />
            <div className="absolute bottom-1 right-3 w-2 h-2 bg-gray-600 rounded-sm" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MacWindow;