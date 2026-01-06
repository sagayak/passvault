
import React from 'react';
import { 
  Users, 
  Shield, 
  Wrench, 
  Lock, 
  ChevronLeft, 
  ChevronRight, 
  LayoutDashboard,
  LogOut,
  Menu,
  X,
  ClipboardList
} from 'lucide-react';
import { Section } from '../types';

interface SidebarProps {
  activeSection: Section;
  setActiveSection: (section: Section) => void;
  onLock: () => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

const NavItem: React.FC<{
  id: Section;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
  isCollapsed: boolean;
}> = ({ label, icon, isActive, onClick, isCollapsed }) => {
  return (
    <button
      onClick={onClick}
      className={`flex items-center w-full px-3 py-2.5 rounded-lg transition-all ${
        isActive 
          ? 'bg-blue-600 text-white shadow-md' 
          : 'text-gray-600 hover:bg-blue-50 hover:text-blue-700'
      } ${isCollapsed ? 'justify-center' : 'gap-3'}`}
      title={isCollapsed ? label : ''}
    >
      <span className={isActive ? 'text-white' : ''}>{icon}</span>
      {!isCollapsed && <span className="font-medium text-sm">{label}</span>}
    </button>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  activeSection,
  setActiveSection,
  onLock,
  isCollapsed,
  setIsCollapsed,
  isMobileOpen,
  setIsMobileOpen
}) => {
  const sidebarClasses = `fixed inset-y-0 left-0 z-40 bg-white border-r border-gray-200 transition-all duration-300 transform 
    ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} 
    md:translate-x-0 
    ${isCollapsed ? 'w-20' : 'w-64'}`;

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={sidebarClasses}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`p-4 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} border-b border-gray-100`}>
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-1.5 rounded-lg text-white">
                <Lock size={20} />
              </div>
              {!isCollapsed && <h1 className="font-bold text-xl tracking-tight text-blue-900">PassVault</h1>}
            </div>
            {!isCollapsed && (
              <button 
                onClick={() => setIsCollapsed(true)}
                className="hidden md:block p-1 hover:bg-gray-100 rounded text-gray-400"
              >
                <ChevronLeft size={18} />
              </button>
            )}
            {isCollapsed && (
              <button 
                onClick={() => setIsCollapsed(false)}
                className="hidden md:block absolute -right-3 top-10 bg-white border border-gray-200 p-1 rounded-full shadow-sm text-gray-500"
              >
                <ChevronRight size={14} />
              </button>
            )}
            <button 
              onClick={() => setIsMobileOpen(false)}
              className="md:hidden p-1 hover:bg-gray-100 rounded text-gray-400"
            >
              <X size={20} />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-3 space-y-2 mt-4">
            <NavItem 
              id={Section.SOCIAL} 
              label="Social Passwords" 
              icon={<Users size={20} />} 
              isActive={activeSection === Section.SOCIAL}
              onClick={() => { setActiveSection(Section.SOCIAL); setIsMobileOpen(false); }}
              isCollapsed={isCollapsed}
            />
            <NavItem 
              id={Section.PERSONAL} 
              label="Personal Passwords" 
              icon={<Shield size={20} />} 
              isActive={activeSection === Section.PERSONAL}
              onClick={() => { setActiveSection(Section.PERSONAL); setIsMobileOpen(false); }}
              isCollapsed={isCollapsed}
            />
            <NavItem 
              id={Section.INSURANCE} 
              label="Insurances" 
              icon={<ClipboardList size={20} />} 
              isActive={activeSection === Section.INSURANCE}
              onClick={() => { setActiveSection(Section.INSURANCE); setIsMobileOpen(false); }}
              isCollapsed={isCollapsed}
            />
            <NavItem 
              id={Section.MISCELLANEOUS} 
              label="Miscellaneous" 
              icon={<Wrench size={20} />} 
              isActive={activeSection === Section.MISCELLANEOUS}
              onClick={() => { setActiveSection(Section.MISCELLANEOUS); setIsMobileOpen(false); }}
              isCollapsed={isCollapsed}
            />
          </nav>

          {/* Footer */}
          <div className="p-3 border-t border-gray-100">
            <button
              onClick={onLock}
              className={`flex items-center w-full px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors ${isCollapsed ? 'justify-center' : 'gap-3'}`}
              title={isCollapsed ? 'Lock Vault' : ''}
            >
              <LogOut size={20} />
              {!isCollapsed && <span className="font-medium text-sm">Lock Vault</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
