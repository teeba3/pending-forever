'use client';
import { useApp } from '@/lib/AppContext';
import { Banner, TopStrip, Header, Footer } from './Chrome';
import { NoticeModal, SessionWarn, Popups } from './Overlays';
import BugPanel from './BugPanel';
import HomeView from './views/HomeView';
import { LoginView, RegisterView } from './views/AuthViews';
import { DeadView, ExpiredView } from './views/DeadViews';
import { TrackView, DoneView } from './views/TrackViews';
import Wizard from './wizard/Wizard';

const VIEWS = { home: HomeView, login: LoginView, register: RegisterView, dead: DeadView, expired: ExpiredView, track: TrackView, done: DoneView, wizard: Wizard };

export default function Shell() {
  const { ready, view } = useApp();
  if (!ready) return null;
  const View = VIEWS[view.name] || HomeView;
  return (
    <div dir="rtl" className="min-h-screen">
      <Banner /><TopStrip /><Header />
      <main className="max-w-5xl mx-auto p-4"><View /></main>
      <Footer />
      <Popups /><NoticeModal /><SessionWarn /><BugPanel />
    </div>
  );
}
