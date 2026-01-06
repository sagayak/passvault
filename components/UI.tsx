
import React from 'react';

// --- Toast Implementation ---
export interface Toast {
  id: number;
  title: string;
  description?: string;
  variant?: 'default' | 'destructive';
}

let toastCount = 0;
const toastListeners: Set<(toasts: Toast[]) => void> = new Set();
let activeToasts: Toast[] = [];

export const useToast = () => {
  const [toasts, setToasts] = React.useState<Toast[]>(activeToasts);

  React.useEffect(() => {
    const listener = (newToasts: Toast[]) => setToasts(newToasts);
    toastListeners.add(listener);
    return () => {
      toastListeners.delete(listener);
    };
  }, []);

  const toast = ({ title, description, variant = 'default' }: Omit<Toast, 'id'>) => {
    const id = ++toastCount;
    activeToasts = [...activeToasts, { id, title, description, variant }];
    toastListeners.forEach((l) => l(activeToasts));

    setTimeout(() => {
      activeToasts = activeToasts.filter((t) => t.id !== id);
      toastListeners.forEach((l) => l(activeToasts));
    }, 3000);
  };

  return { toast, toasts };
};

export const ToastContainer: React.FC = () => {
  const { toasts } = useToast();
  return (
    <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`p-4 rounded-lg shadow-lg min-w-[300px] border transform transition-all animate-in fade-in slide-in-from-right-4 ${
            t.variant === 'destructive'
              ? 'bg-red-600 text-white border-red-700'
              : 'bg-white text-gray-900 border-gray-200'
          }`}
        >
          <div className="font-semibold">{t.title}</div>
          {t.description && <div className="text-sm opacity-90">{t.description}</div>}
        </div>
      ))}
    </div>
  );
};

// --- Dropdown Menu ---
export interface DropdownItem {
  label: string;
  onClick: () => void;
  icon?: React.ReactNode;
}

export const Dropdown: React.FC<{
  trigger: React.ReactNode;
  items: DropdownItem[];
}> = ({ trigger, items }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
          <div className="py-1">
            {items.map((item, idx) => (
              <button
                key={idx}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
              >
                {item.icon && <span className="mr-2">{item.icon}</span>}
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// --- Modal ---
export const Modal: React.FC<{
  isOpen: boolean;
  children: React.ReactNode;
}> = ({ isOpen, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

// --- Progress Bar ---
export const Progress: React.FC<{ value: number }> = ({ value }) => {
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5">
      <div
        className="bg-blue-600 h-2.5 rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      ></div>
    </div>
  );
};
