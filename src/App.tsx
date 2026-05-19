import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Shell from '@/src/components/Shell';
import { ToastProvider } from '@/src/components/ui/ToastProvider';
import { WorkspaceProvider, useWorkspace } from '@/src/context/WorkspaceContext';

const Dashboard = lazy(() => import('@/src/pages/Dashboard'));
const AgentSettings = lazy(() => import('@/src/pages/AgentSettings'));
const PhoneNumbers = lazy(() => import('@/src/pages/PhoneNumbers'));
const Messenger = lazy(() => import('@/src/pages/Messenger'));
const CallLogs = lazy(() => import('@/src/pages/CallLogs'));
const OutreachScheduler = lazy(() => import('@/src/pages/OutreachScheduler'));
const Notifications = lazy(() => import('@/src/pages/Notifications'));
const Leads = lazy(() => import('@/src/pages/Leads'));
const Team = lazy(() => import('@/src/pages/Team'));
const Billing = lazy(() => import('@/src/pages/Billing'));
const Settings = lazy(() => import('@/src/pages/Settings'));
const Login = lazy(() => import('@/src/pages/Login'));
const Onboarding = lazy(() => import('@/src/pages/Onboarding'));
const Landing = lazy(() => import('@/src/pages/Landing'));
const Contact = lazy(() => import('@/src/pages/Contact'));
const Terms = lazy(() => import('@/src/pages/Terms'));
const Privacy = lazy(() => import('@/src/pages/Privacy'));

const AppLoading = () => (
  <div className="flex h-screen w-full items-center justify-center bg-pearl">
    <div className="flex flex-col items-center gap-4">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
      <p className="text-sm text-slate-lux font-medium">Loading Agently...</p>
    </div>
  </div>
);

const PageLoader = () => (
  <div className="flex h-full w-full items-center justify-center p-12">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-orange border-t-transparent" />
  </div>
);

function AppRoutes() {
  const { workspace, isInitializing } = useWorkspace();
  const user = workspace?.user ?? null;
  const org = workspace?.organization ?? null;

  if (isInitializing) return <AppLoading />;

  return (
    <Routes>
      <Route path="/" element={<Suspense fallback={<PageLoader />}><Landing /></Suspense>} />
      <Route path="/features" element={<Suspense fallback={<PageLoader />}><Landing section="features" /></Suspense>} />
      <Route path="/pricing" element={<Suspense fallback={<PageLoader />}><Landing section="pricing" /></Suspense>} />
      <Route path="/login" element={
        user ? <Navigate to="/dashboard" replace /> :
        <Suspense fallback={<PageLoader />}><Login /></Suspense>
      } />
      <Route path="/onboarding" element={
        !user ? <Navigate to="/login" replace /> :
        org?.profile?.onboarded ? <Navigate to="/dashboard" replace /> :
        <Suspense fallback={<PageLoader />}><Onboarding /></Suspense>
      } />
      <Route element={
        !user ? <Navigate to="/login" replace /> :
        !org?.profile?.onboarded ? <Navigate to="/onboarding" replace /> :
        <Shell />
      }>
        <Route path="/dashboard" element={<Suspense fallback={<PageLoader />}><Dashboard /></Suspense>} />
        <Route path="/agent" element={<Suspense fallback={<PageLoader />}><AgentSettings /></Suspense>} />
        <Route path="/phone-numbers" element={<Suspense fallback={<PageLoader />}><PhoneNumbers /></Suspense>} />
        <Route path="/messenger" element={<Suspense fallback={<PageLoader />}><Messenger /></Suspense>} />
        <Route path="/calls" element={<Suspense fallback={<PageLoader />}><CallLogs /></Suspense>} />
        <Route path="/outreach" element={<Suspense fallback={<PageLoader />}><OutreachScheduler /></Suspense>} />
        <Route path="/notifications" element={<Suspense fallback={<PageLoader />}><Notifications /></Suspense>} />
        <Route path="/leads" element={<Suspense fallback={<PageLoader />}><Leads /></Suspense>} />
        <Route path="/team" element={<Suspense fallback={<PageLoader />}><Team /></Suspense>} />
        <Route path="/billing" element={<Suspense fallback={<PageLoader />}><Billing /></Suspense>} />
        <Route path="/settings" element={<Suspense fallback={<PageLoader />}><Settings /></Suspense>} />
        <Route index element={<Navigate to="/dashboard" replace />} />
      </Route>
      <Route path="/contact" element={<Suspense fallback={<PageLoader />}><Contact /></Suspense>} />
      <Route path="/terms" element={<Suspense fallback={<PageLoader />}><Terms /></Suspense>} />
      <Route path="/privacy" element={<Suspense fallback={<PageLoader />}><Privacy /></Suspense>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <WorkspaceProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </WorkspaceProvider>
    </ToastProvider>
  );
}
