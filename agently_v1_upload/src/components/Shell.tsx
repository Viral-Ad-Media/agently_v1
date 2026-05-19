import * as React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Mic2, 
  Hash, 
  MessageSquare, 
  PhoneCall, 
  Send, 
  Bell, 
  Users, 
  CreditCard, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Play
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { LuxuryButton } from '@/src/components/ui/LuxuryButton';
import CallSimulator from '@/src/components/CallSimulator';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Voice Agent', href: '/agent', icon: Mic2 },
  { name: 'Numbers', href: '/phone-numbers', icon: Hash },
  { name: 'Chatbot', href: '/messenger', icon: MessageSquare },
  { name: 'Call Logs', href: '/calls', icon: PhoneCall },
  { name: 'Outreach', href: '/outreach', icon: Send },
  { name: 'Leads CRM', href: '/leads', icon: Users },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Team', href: '/team', icon: Users },
  { name: 'Billing', href: '/billing', icon: CreditCard },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Shell() {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isSimOpen, setIsSimOpen] = React.useState(false);
  const location = useLocation();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="flex h-screen bg-ivory text-ink-900 overflow-hidden">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={toggleSidebar}
            className="fixed inset-0 z-40 bg-ink-950/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-ink-950 text-white transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 outline outline-white/5",
          !isSidebarOpen && "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex items-center gap-3 px-6 h-20">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-brand-orange shadow-lg shadow-brand-orange/20">
               <ShieldCheck className="h-6 w-6 text-white" />
               <div className="absolute -right-1 -top-1 h-3 w-3 animate-pulse rounded-full bg-white/20" />
            </div>
            <div>
              <span className="text-xl font-display font-semibold tracking-tight">Agently</span>
              <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-medium">Enterprise AI</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-4 custom-scrollbar">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "group relative flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-luxury transition-all",
                      isActive 
                        ? "bg-white/10 text-white ring-1 ring-white/10 shadow-lg" 
                        : "text-white/50 hover:text-white hover:bg-white/5"
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="nav-pill"
                        className="absolute inset-y-2 left-0 w-1 bg-brand-orange rounded-full"
                      />
                    )}
                    <item.icon className={cn(
                      "h-5 w-5",
                      isActive ? "text-brand-orange" : "text-white/30 group-hover:text-white/70"
                    )} />
                    {item.name}
                    {isActive && (
                      <ChevronRight className="ml-auto h-4 w-4 text-white/20" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Plan Usage Card */}
            <div className="mt-8 px-2">
              <div className="rounded-2xl bg-white/5 p-4 border border-white/10 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Lab</span>
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <LuxuryButton 
                  onClick={() => setIsSimOpen(true)}
                  variant="glass" 
                  size="sm" 
                  className="w-full bg-brand-orange border-brand-orange/20 hover:bg-brand-orange-600 text-white text-[11px] h-9"
                >
                  <Play className="h-3 w-3 mr-2 fill-current" />
                  Test Your Agent
                </LuxuryButton>
              </div>

              <div className="rounded-2xl bg-white/5 p-4 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Usage</span>
                  <TrendingUp className="h-3 w-3 text-brand-orange" />
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-white/60">Voice Minutes</span>
                      <span className="text-white">1,240 / 5,000</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '25%' }}
                        className="h-full bg-brand-orange" 
                      />
                    </div>
                  </div>
                </div>
                <LuxuryButton variant="glass" size="sm" className="w-full mt-4 bg-white/10 border-white/10 hover:bg-white/20 text-white text-[11px] h-8">
                  Upgrade Plan
                </LuxuryButton>
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/5">
            <button className="flex items-center gap-3 w-full px-4 py-3 text-sm text-white/40 hover:text-white hover:bg-white/5 rounded-luxury transition-colors">
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 luxury-glass-dark lg:bg-transparent lg:backdrop-blur-none lg:border-none border-b border-line-soft flex items-center justify-between px-6 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 text-ink-800 hover:bg-black/5 rounded-lg"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden lg:flex items-center gap-2">
               <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-xs font-semibold text-slate-lux uppercase tracking-wider">System Live</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 mr-4">
               <div className="px-3 py-1.5 rounded-full bg-ink-950 text-white text-[10px] font-bold uppercase tracking-wider">
                  Pro Plan
               </div>
               <div className="px-3 py-1.5 rounded-full bg-brand-orange/10 text-brand-orange text-[10px] font-bold uppercase tracking-wider border border-brand-orange/20">
                  8 active agents
               </div>
            </div>

            <button className="relative p-2 text-slate-lux hover:text-ink-900 transition-colors">
              <Bell className="h-6 w-6" />
              <span className="absolute top-2 right-2 h-2 w-2 bg-brand-orange rounded-full border-2 border-ivory" />
            </button>

            <div className="h-10 w-10 rounded-xl bg-ink-900 border border-white/10 flex items-center justify-center p-0.5 overflow-hidden">
               <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Agently" alt="User" referrerPolicy="no-referrer" />
            </div>
          </div>
        </header>

        {/* Page Container */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
           <div className="max-w-7xl mx-auto p-6 md:p-10">
              <div className="relative">
                 <Outlet />
              </div>
           </div>
        </div>

        <CallSimulator isOpen={isSimOpen} onClose={() => setIsSimOpen(false)} />
      </main>
    </div>
  );
}
