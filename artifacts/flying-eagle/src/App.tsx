import { useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  ArrowUpRight,
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronDown,
  Compass,
  History,
  Home as HomeIcon,
  Library,
  ListFilter,
  Menu,
  MoreHorizontal,
  Play,
  Radio,
  Search,
  Crosshair,
  ThumbsUp,
  Users,
  X,
  Zap,
} from 'lucide-react';
import { useLocation } from 'wouter';
import airsoftFieldHero from '@assets/generated_images/airsoft-field-hero.jpg';
import airsoftGameDay from '@assets/generated_images/airsoft-game-day.jpg';
import airsoftLoadout from '@assets/generated_images/airsoft-loadout.jpg';
import airsoftNightGame from '@assets/generated_images/airsoft-night-game.jpg';

const queryClient = new QueryClient();

type Category = 'All' | 'Airsoft Fields' | 'Loadouts' | 'Game Days' | 'Gear' | 'Tuning';
type Video = {
  id: string;
  title: string;
  creator: string;
  category: Exclude<Category, 'All'>;
  duration: string;
  views: string;
  age: string;
  image: string;
  description: string;
  live?: boolean;
};

const videos: Video[] = [
  {
    id: 'f-01',
    title: 'THE EDGE OF THE FIELD',
    creator: 'Fieldcraft North',
    category: 'Airsoft Fields',
    duration: '18:42',
    views: '1.2M',
    age: '3 days ago',
    image: airsoftFieldHero,
    description: 'A full day at Black Pine Airsoft: tight lanes, fast pushes, and the split-second calls that win a round.',
    live: true,
  },
  {
    id: 'f-02',
    title: 'THE QUIET PUSH THROUGH NORTH WOODS',
    creator: 'Game Day Radio',
    category: 'Game Days',
    duration: '31:07',
    views: '842K',
    age: '1 week ago',
    image: airsoftGameDay,
    description: 'A quiet flank, a patient squad, and the game-day discipline behind a clean objective capture.',
  },
  {
    id: 'f-03',
    title: 'THE LOADOUT // LAST CHECK',
    creator: 'Vector Airsoft',
    category: 'Loadouts',
    duration: '24:19',
    views: '2.7M',
    age: '2 weeks ago',
    image: airsoftLoadout,
    description: 'A practical pre-game loadout check covering mags, comms, eye pro, and the kit that actually earns its space.',
  },
  {
    id: 'f-04',
    title: 'MOVE, COVER, RESET',
    creator: 'Ground Truth Airsoft',
    category: 'Gear',
    duration: '12:53',
    views: '496K',
    age: '4 days ago',
    image: airsoftFieldHero,
    description: 'How to move through a field without giving away your angle, your pace, or your next play.',
  },
  {
    id: 'f-05',
    title: 'HOW TO TUNE YOUR HOP-UP',
    creator: 'The Tech Bench',
    category: 'Tuning',
    duration: '16:08',
    views: '318K',
    age: '6 days ago',
    image: airsoftLoadout,
    description: 'A clean, practical guide to hop-up adjustment, consistency, and getting more from every BB.',
  },
  {
    id: 'f-06',
    title: 'NIGHT GAME: 02:17 LOCAL',
    creator: 'Fieldcraft North',
    category: 'Game Days',
    duration: '09:32',
    views: '207K',
    age: '8 days ago',
    image: airsoftNightGame,
    description: 'Low light, wet ground, and a night objective that turns every flashlight decision into a team call.',
  },
  {
    id: 'f-07',
    title: 'THE FIELD MAP: READ THE TERRAIN',
    creator: 'Archive Unit',
    category: 'Airsoft Fields',
    duration: '42:11',
    views: '155K',
    age: '2 months ago',
    image: airsoftGameDay,
    description: 'A field walk-through on sightlines, dead ground, choke points, and the routes players miss on the first lap.',
  },
  {
    id: 'f-08',
    title: 'READING THE FIELD',
    creator: 'Ground Truth Airsoft',
    category: 'Loadouts',
    duration: '21:40',
    views: '293K',
    age: '3 weeks ago',
    image: airsoftNightGame,
    description: 'Terrain is information. A practical lesson in cover, movement, and keeping your squad in the game.',
  },
];

const navItems = [
  { label: 'Home', icon: HomeIcon },
  { label: 'Following', icon: Users },
  { label: 'Library', icon: Library },
  { label: 'History', icon: History },
];

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ErrorBoundary>
          <FlyingEagle />
        </ErrorBoundary>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function FlyingEagle() {
  const [activeNav, setActiveNav] = useState('Home');
  const [category, setCategory] = useState<Category>('All');
  const [query, setQuery] = useState('');
  const [saved, setSaved] = useState<string[]>(['f-03']);
  const [liked, setLiked] = useState<string[]>([]);
  const [activeVideo, setActiveVideo] = useState<Video | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [, setLocation] = useLocation();

  const filteredVideos = useMemo(() => {
    let list = videos;
    if (category !== 'All') list = list.filter((video) => video.category === category);
    if (activeNav === 'Following') list = list.filter((video) => video.creator === 'Fieldcraft North' || video.creator === 'Ground Truth Airsoft');
    if (activeNav === 'Library') list = list.filter((video) => saved.includes(video.id));
    if (activeNav === 'History') list = list.filter((video) => video.id === 'f-03' || video.id === 'f-01');
    const normalized = query.trim().toLowerCase();
    if (normalized) {
      list = list.filter((video) => `${video.title} ${video.creator} ${video.category}`.toLowerCase().includes(normalized));
    }
    return showAll ? list : list.slice(0, 6);
  }, [activeNav, category, query, saved, showAll]);

  const openVideo = (video: Video) => {
    setActiveVideo(video);
    setLocation(`/watch/${video.id}`);
  };

  const closeVideo = () => {
    setActiveVideo(null);
    setLocation('/');
  };

  const toggleSave = (id: string) => setSaved((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const toggleLike = (id: string) => setLiked((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);

  return (
    <div className="noise min-h-[100dvh] bg-[#070b13] text-slate-100">
      <div className="flex min-h-[100dvh]">
        <aside className={`${mobileNav ? 'translate-x-0' : '-translate-x-full'} fixed inset-y-0 left-0 z-40 flex w-[248px] flex-col border-r border-[#182536] bg-[#090f1a] transition-transform duration-300 lg:static lg:translate-x-0`}>
          <div className="flex h-[74px] items-center gap-3 border-b border-[#182536] px-6">
            <div className="relative grid h-9 w-9 place-items-center rounded-sm bg-[#b6d95b] text-[#10150d]">
              <Crosshair size={19} strokeWidth={2.6} />
              <span className="absolute -bottom-1 -right-1 h-2.5 w-2.5 border-2 border-[#090f1a] bg-[#c98b4d]" />
            </div>
            <div>
              <p className="font-condensed text-[21px] font-bold tracking-[.12em] text-slate-100">FLYING EAGLE</p>
              <p className="font-mono-app text-[8px] tracking-[.22em] text-[#6f8299]">OPEN AIRSOFT INTELLIGENCE</p>
            </div>
            <button data-testid="button-close-mobile-nav" onClick={() => setMobileNav(false)} className="ml-auto rounded p-1 text-slate-500 hover:text-[#4bd6d7] lg:hidden"><X size={18} /></button>
          </div>
          <div className="px-4 pt-7">
            <p className="mb-3 px-3 font-mono-app text-[9px] font-bold tracking-[.2em] text-[#5f7287]">FIELD OPERATIONS</p>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const selected = activeNav === item.label;
                return (
                  <button data-testid={`button-nav-${item.label.toLowerCase()}`} key={item.label} onClick={() => { setActiveNav(item.label); setMobileNav(false); setShowAll(false); }} className={`group flex w-full items-center gap-3 rounded-sm px-3 py-3 text-left text-[13px] font-semibold transition-colors ${selected ? 'bg-[#102b35] text-[#59e1dc]' : 'text-[#8c9bae] hover:bg-[#0e1b29] hover:text-slate-100'}`}>
                    <Icon size={17} strokeWidth={selected ? 2.2 : 1.7} />
                    <span>{item.label}</span>
                    {item.label === 'Library' && <span className="ml-auto font-mono-app text-[10px] text-[#5f7287]">{saved.length}</span>}
                  </button>
                );
              })}
            </nav>
          </div>
          <div className="mt-8 px-4">
            <p className="mb-3 px-3 font-mono-app text-[9px] font-bold tracking-[.2em] text-[#5f7287]">CHANNELS</p>
            <div className="space-y-1">
              {['Fieldcraft North', 'Ground Truth Airsoft', 'The Tech Bench'].map((name, index) => (
                <button data-testid={`button-channel-${index}`} key={name} onClick={() => { setQuery(name); setActiveNav('Home'); }} className="flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-left text-[12px] text-[#8293a5] transition-colors hover:bg-[#0e1b29] hover:text-slate-100">
                  <span className={`grid h-7 w-7 place-items-center rounded-full border text-[10px] font-bold ${index === 0 ? 'border-[#4bd6d7] bg-[#11383c] text-[#64e3dd]' : index === 1 ? 'border-[#dfaa52] bg-[#312818] text-[#e9bc68]' : 'border-[#60738a] bg-[#1d2936] text-[#a7b3c0]'}`}>{name.split(' ').map((part) => part[0]).join('')}</span>
                  <span>{name}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="mt-auto border-t border-[#182536] p-6">
            <div className="mb-4 flex items-center gap-2 text-[#7890a3]"><Radio size={14} className="text-[#b6d95b]" /><span className="font-mono-app text-[9px] tracking-[.16em]">NO ADS. NO TIERS.</span></div>
            <p className="text-[11px] leading-relaxed text-[#5f7287]">An independent airsoft library. Built for people who play fair and play hard.</p>
          </div>
        </aside>

        {mobileNav && <button data-testid="button-mobile-nav-backdrop" aria-label="Close navigation" onClick={() => setMobileNav(false)} className="fixed inset-0 z-30 bg-[#02050a]/70 lg:hidden" />}
        <main className="min-w-0 flex-1">
          <header className="sticky top-0 z-20 flex h-[74px] items-center gap-4 border-b border-[#182536] bg-[#080e18]/95 px-4 backdrop-blur-md sm:px-8">
            <button data-testid="button-open-mobile-nav" onClick={() => setMobileNav(true)} className="rounded-sm border border-[#203144] p-2 text-[#9aabbb] hover:border-[#4bd6d7] hover:text-[#4bd6d7] lg:hidden"><Menu size={18} /></button>
            <div className="relative max-w-[520px] flex-1">
              <Search size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#64788d]" />
              <input data-testid="input-search-videos" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the airsoft library..." className="h-10 w-full rounded-sm border border-[#203144] bg-[#0c1522] pl-10 pr-10 text-[13px] text-slate-200 outline-none placeholder:text-[#53677d] focus:border-[#b6d95b] focus:ring-1 focus:ring-[#b6d95b]/30" />
              {query && <button data-testid="button-clear-search" onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6c8093] hover:text-slate-200"><X size={15} /></button>}
            </div>
            <div className="ml-auto hidden items-center gap-4 sm:flex">
              <span className="font-mono-app text-[9px] tracking-[.15em] text-[#5d7186]">SIGNAL / STABLE</span>
              <div className="h-2 w-2 rounded-full bg-[#b6d95b] shadow-[0_0_0_3px_rgba(182,217,91,.12)]" />
              <button data-testid="button-user-profile" className="grid h-9 w-9 place-items-center rounded-full border border-[#405367] bg-[#192433] text-[11px] font-bold text-[#c0ccd7]">FE</button>
            </div>
          </header>

          <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-7 sm:px-8 lg:px-10">
            <div className="mb-7 flex flex-wrap items-end justify-between gap-4 fade-up">
              <div>
                <div className="mb-2 flex items-center gap-2 font-mono-app text-[10px] tracking-[.18em] text-[#91a758]"><span className="h-px w-7 bg-[#b6d95b]" />{activeNav === 'Home' ? 'FIELD LIBRARY / TODAY' : `YOUR ${activeNav.toUpperCase()}`}</div>
                <h1 data-testid="text-page-title" className="font-condensed text-4xl font-bold tracking-[.03em] text-slate-100 sm:text-5xl">{activeNav === 'Home' ? 'THE FIELD BRIEFING' : activeNav}</h1>
                <p className="mt-1 text-sm text-[#77899b]">{activeNav === 'Home' ? 'Game days, gear guides, and hard-earned fieldcraft.' : activeNav === 'Following' ? 'New uploads from the channels you keep close.' : activeNav === 'Library' ? 'Your saved watchlist, ready for the next game day.' : 'A record of the matches and guides you have viewed.'}</p>
              </div>
              <div className="flex items-center gap-2 font-mono-app text-[9px] tracking-[.12em] text-[#65788c]"><span className="rounded-sm border border-[#23384a] bg-[#0c1522] px-2.5 py-1.5">EST. 2025</span><span className="rounded-sm border border-[#23384a] bg-[#0c1522] px-2.5 py-1.5">VOL. 01</span></div>
            </div>

            {activeNav === 'Home' && !query && category === 'All' && (
              <section className="relative mb-10 overflow-hidden rounded-sm border border-[#244252] bg-[#0b1a27] shadow-[0_18px_60px_rgba(0,0,0,.24)] fade-up fade-up-delay-1">
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,15,24,.98)_0%,rgba(7,20,31,.83)_42%,rgba(7,20,31,.18)_100%)]" />
                <img src={videos[0].image} alt="" className="absolute inset-0 h-full w-full object-cover object-center opacity-70 mix-blend-screen" />
                <div className="scanline absolute inset-0 opacity-40" />
                <div className="relative grid min-h-[330px] items-end p-6 sm:min-h-[390px] sm:p-10 lg:grid-cols-[minmax(0,570px)_1fr]">
                  <div>
                    <div className="mb-4 flex flex-wrap items-center gap-2 font-mono-app text-[9px] font-bold tracking-[.16em] text-[#c8e474]"><span className="flex items-center gap-1.5 rounded-sm bg-[#33451f] px-2 py-1"><span className="h-1.5 w-1.5 rounded-full bg-[#d99852]" />FEATURED GAME DAY</span><span className="text-[#7890a3]">FD-001 / 18:42</span></div>
                    <h2 className="max-w-xl font-condensed text-5xl font-bold leading-[.9] tracking-[.02em] text-slate-50 sm:text-7xl">THE EDGE<br />OF THE FIELD</h2>
                    <p className="mt-5 max-w-md text-sm leading-relaxed text-[#b2c1cb]">A full day at Black Pine Airsoft: tight lanes, fast pushes, and the split-second calls that win a round.</p>
                    <div className="mt-7 flex flex-wrap gap-3">
                      <button data-testid="button-play-featured" onClick={() => openVideo(videos[0])} className="flex items-center gap-2 rounded-sm bg-[#b6d95b] px-5 py-3 text-[12px] font-bold tracking-[.08em] text-[#10150d] transition-transform hover:-translate-y-0.5 hover:bg-[#c9eb70]"><Play size={15} fill="currentColor" /> WATCH NOW</button>
                      <button data-testid="button-save-featured" onClick={() => toggleSave(videos[0].id)} className="flex items-center gap-2 rounded-sm border border-[#516d7c] bg-[#0d202c]/80 px-4 py-3 text-[11px] font-bold tracking-[.08em] text-[#c4d2d9] hover:border-[#4bd6d7] hover:text-[#65e2de]">{saved.includes(videos[0].id) ? <BookmarkCheck size={15} /> : <Bookmark size={15} />} {saved.includes(videos[0].id) ? 'IN LIBRARY' : 'SAVE'}</button>
                    </div>
                  </div>
                  <div className="absolute bottom-7 right-7 hidden flex-col items-end gap-2 text-right lg:flex"><span className="font-mono-app text-[9px] tracking-[.2em] text-[#7694a3]">LIVE ARCHIVE INDEX</span><span className="font-mono-app text-[26px] text-[#c0dadc]">04:17:32 <span className="text-[10px] text-[#66818d]">UTC</span></span></div>
                </div>
              </section>
            )}

            <div className="mb-6 flex items-center justify-between gap-4 fade-up fade-up-delay-2">
              <div className="flex min-w-0 items-center gap-2 overflow-x-auto pb-1">
                <span className="mr-1 hidden items-center gap-1.5 font-mono-app text-[9px] tracking-[.15em] text-[#64788d] sm:flex"><ListFilter size={14} /> FILTER</span>
                {(['All', 'Airsoft Fields', 'Loadouts', 'Game Days', 'Gear', 'Tuning'] as Category[]).map((item) => (
                  <button data-testid={`button-filter-${item.toLowerCase().replace(' ', '-')}`} key={item} onClick={() => { setCategory(item); setShowAll(false); }} className={`whitespace-nowrap rounded-sm border px-3 py-2 text-[11px] font-semibold transition-colors ${category === item ? 'border-[#3f9ea3] bg-[#11363d] text-[#62e4df]' : 'border-[#203144] bg-[#0c1522] text-[#7f92a5] hover:border-[#3a5266] hover:text-slate-200'}`}>{item}</button>
                ))}
              </div>
              <button data-testid="button-sort-options" className="hidden items-center gap-1.5 whitespace-nowrap text-[11px] text-[#8092a4] hover:text-slate-100 sm:flex">Latest <ChevronDown size={14} /></button>
            </div>

            {filteredVideos.length === 0 ? (
              <div data-testid="status-empty-library" className="flex min-h-[320px] flex-col items-center justify-center rounded-sm border border-dashed border-[#294052] bg-[#0a131f] px-6 text-center fade-up">
                <div className="mb-4 grid h-14 w-14 place-items-center rounded-full border border-[#2b5860] bg-[#102d35] text-[#55d9d7]"><Compass size={24} /></div>
                <h2 className="font-condensed text-2xl font-bold tracking-wide text-slate-100">{activeNav === 'Library' ? 'YOUR LIBRARY IS CLEAR' : 'NO MATCHES ON THIS FREQUENCY'}</h2>
                <p className="mt-2 max-w-sm text-sm text-[#75899c]">{activeNav === 'Library' ? 'Save a dispatch to build your personal flight library.' : 'Try another category or broaden the search parameters.'}</p>
                <button data-testid="button-reset-filters" onClick={() => { setQuery(''); setCategory('All'); setActiveNav('Home'); }} className="mt-5 rounded-sm border border-[#3f6571] px-4 py-2 text-[11px] font-bold tracking-wider text-[#63dcda] hover:bg-[#123038]">RESET FILTERS</button>
              </div>
            ) : (
               <section className="fade-up fade-up-delay-3">
                 <div className="mb-4 flex items-center justify-between"><h2 className="font-condensed text-2xl font-bold tracking-wide text-slate-100">{query ? 'SEARCH RESULTS' : category === 'All' ? 'RECENT UPLOADS' : category.toUpperCase()}</h2><span className="font-mono-app text-[9px] tracking-[.14em] text-[#62788b]">{filteredVideos.length} FILES</span></div>
                <div className="grid gap-x-5 gap-y-8 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredVideos.map((video, index) => (
                    <VideoCard key={video.id} video={video} index={index} isSaved={saved.includes(video.id)} isLiked={liked.includes(video.id)} onOpen={() => openVideo(video)} onSave={() => toggleSave(video.id)} onLike={() => toggleLike(video.id)} />
                  ))}
                </div>
                 {!showAll && filteredVideos.length < videos.length && !query && <button data-testid="button-load-more" onClick={() => setShowAll(true)} className="mx-auto mt-10 flex items-center gap-2 border-b border-[#b6d95b] pb-1 font-mono-app text-[10px] tracking-[.16em] text-[#b6d95b] hover:text-slate-100">LOAD MORE UPLOADS <ArrowUpRight size={14} /></button>}
              </section>
            )}
          </div>
           <footer className="border-t border-[#182536] px-4 py-6 sm:px-10"><div className="mx-auto flex max-w-[1440px] flex-col gap-2 text-[10px] text-[#52677b] sm:flex-row sm:items-center sm:justify-between"><span className="font-mono-app tracking-[.12em]">FLYING EAGLE / FOR PLAYERS, BY PLAYERS</span><span>Independent airsoft library. No ads. No paid tiers.</span></div></footer>
        </main>
      </div>
      {activeVideo && <PlaybackModal video={activeVideo} isSaved={saved.includes(activeVideo.id)} isLiked={liked.includes(activeVideo.id)} onClose={closeVideo} onSave={() => toggleSave(activeVideo.id)} onLike={() => toggleLike(activeVideo.id)} />}
    </div>
  );
}

function VideoCard({ video, index, isSaved, isLiked, onOpen, onSave, onLike }: { video: Video; index: number; isSaved: boolean; isLiked: boolean; onOpen: () => void; onSave: () => void; onLike: () => void }) {
  return (
    <article data-testid={`card-video-${video.id}`} className="group min-w-0">
      <button data-testid={`button-open-video-${video.id}`} onClick={onOpen} className="relative block aspect-video w-full overflow-hidden rounded-sm border border-[#203144] bg-[#101c2a] text-left">
        <img src={video.image} alt={video.title} className="h-full w-full object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071017]/80 via-transparent to-transparent" />
        <div className="absolute left-3 top-3 flex gap-2">{video.live && <span className="flex items-center gap-1 rounded-sm bg-[#c08b3e] px-1.5 py-1 font-mono-app text-[8px] font-bold tracking-[.1em] text-[#10151a]"><span className="h-1.5 w-1.5 rounded-full bg-[#10151a]" />FEATURED</span>}<span className="rounded-sm bg-[#071017]/80 px-1.5 py-1 font-mono-app text-[8px] tracking-[.1em] text-[#d1dce2]">{video.category.toUpperCase()}</span></div>
        <span className="absolute bottom-2 right-2 rounded-sm bg-[#071017]/90 px-1.5 py-1 font-mono-app text-[9px] text-[#d6e2e6]">{video.duration}</span>
        <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 scale-90 place-items-center rounded-full border border-[#a2e7e2]/60 bg-[#0d3038]/85 text-[#a2e7e2] opacity-0 transition duration-300 group-hover:scale-100 group-hover:opacity-100"><Play size={17} fill="currentColor" /></span>
        <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#4bd6d7] transition-all duration-500 group-hover:w-full" />
      </button>
      <div className="mt-3 flex gap-3">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-[#314356] bg-[#182635] text-[9px] font-bold text-[#9eb5bf]">{video.creator.split(' ').map((word) => word[0]).join('')}</div>
        <div className="min-w-0 flex-1"><button data-testid={`button-title-video-${video.id}`} onClick={onOpen} className="line-clamp-2 text-left font-condensed text-[18px] font-bold leading-[1.05] tracking-[.03em] text-slate-100 transition-colors hover:text-[#5de0dc]">{video.title}</button><p className="mt-1.5 truncate text-[11px] text-[#718497]">{video.creator} <span className="px-1 text-[#40566a]">•</span> {video.views} views <span className="px-1 text-[#40566a]">•</span> {video.age}</p></div>
        <div className="flex shrink-0 items-start gap-1"><button data-testid={`button-like-video-${video.id}`} onClick={onLike} aria-label={`Like ${video.title}`} className={`rounded p-1.5 transition-colors ${isLiked ? 'text-[#4bd6d7]' : 'text-[#64798d] hover:text-[#dbe6ea]'}`}><ThumbsUp size={14} fill={isLiked ? 'currentColor' : 'none'} /></button><button data-testid={`button-save-video-${video.id}`} onClick={onSave} aria-label={`Save ${video.title}`} className={`rounded p-1.5 transition-colors ${isSaved ? 'text-[#eabd64]' : 'text-[#64798d] hover:text-[#dbe6ea]'}`}>{isSaved ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}</button></div>
      </div>
      <div className="mt-2 flex items-center gap-2 pl-11 font-mono-app text-[8px] tracking-[.08em] text-[#566c7e]"><span className="h-1 w-1 rounded-full bg-[#b6d95b]" />FIELD VERIFIED <span className="ml-auto">{String(index + 1).padStart(2, '0')}</span></div>
    </article>
  );
}

function PlaybackModal({ video, isSaved, isLiked, onClose, onSave, onLike }: { video: Video; isSaved: boolean; isLiked: boolean; onClose: () => void; onSave: () => void; onLike: () => void }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(18);
  return (
    <div data-testid="modal-video-playback" className="fixed inset-0 z-50 overflow-y-auto bg-[#03070c]/95 px-3 py-6 backdrop-blur-sm sm:px-8 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mb-4 flex items-center justify-between"><div className="flex items-center gap-2 font-mono-app text-[9px] tracking-[.2em] text-[#5ca9aa]"><span className="h-1.5 w-1.5 rounded-full bg-[#eabd64]" />PLAYBACK / {video.id.toUpperCase()}</div><button data-testid="button-close-playback" onClick={onClose} className="flex items-center gap-2 rounded-sm border border-[#294052] px-3 py-2 font-mono-app text-[10px] tracking-[.12em] text-[#91a5b5] hover:border-[#4bd6d7] hover:text-[#5fe0dc]"><X size={15} /> CLOSE</button></div>
        <div className="relative aspect-video overflow-hidden rounded-sm border border-[#294052] bg-[#0b1521] shadow-[0_24px_100px_rgba(0,0,0,.45)]">
          <img src={video.image} alt="" className="h-full w-full object-cover opacity-65" />
          <div className="scanline absolute inset-0" />
          {!playing && <button data-testid="button-start-playback" onClick={() => setPlaying(true)} className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-[#9ae7e1] bg-[#133842]/90 text-[#a4efea] transition-transform hover:scale-105"><Play size={27} fill="currentColor" /></button>}
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#050a0f] to-transparent px-4 pb-4 pt-12 sm:px-7"><div className="mb-3 h-1 cursor-pointer rounded bg-[#385260]" onClick={() => setProgress(progress === 18 ? 53 : 18)}><div className="h-full rounded bg-[#4bd6d7] transition-all" style={{ width: `${progress}%` }} /></div><div className="flex items-center justify-between font-mono-app text-[9px] text-[#bfd1d8]"><button data-testid="button-toggle-playback" onClick={() => setPlaying(!playing)} className="flex items-center gap-2 hover:text-[#65e5df]">{playing ? <span className="text-base leading-none">Ⅱ</span> : <Play size={13} fill="currentColor" />} {playing ? 'PAUSE' : 'PLAY'}</button><span>{progress === 18 ? '03:19' : '09:27'} / {video.duration}</span><button data-testid="button-playback-options" className="text-[#8ea4b1] hover:text-slate-100"><MoreHorizontal size={18} /></button></div></div>
        </div>
        <div className="grid gap-8 py-7 lg:grid-cols-[minmax(0,1fr)_290px]">
          <div><div className="mb-3 flex flex-wrap gap-2 font-mono-app text-[9px] tracking-[.14em] text-[#b6d95b]"><span className="rounded-sm border border-[#526f32] bg-[#25351a] px-2 py-1">{video.category.toUpperCase()}</span><span className="rounded-sm border border-[#2a3d4f] px-2 py-1 text-[#7890a3]">FIELD RECORDING</span></div><h2 className="font-condensed text-4xl font-bold leading-none tracking-wide text-slate-100 sm:text-5xl">{video.title}</h2><p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#9aadb9]">{video.description}</p><div className="mt-6 flex flex-wrap gap-2"><button data-testid="button-modal-like" onClick={onLike} className={`flex items-center gap-2 rounded-sm border px-4 py-2.5 text-[11px] font-bold tracking-wide ${isLiked ? 'border-[#b6d95b] bg-[#33451f] text-[#c9eb70]' : 'border-[#2a4053] text-[#a8bac4] hover:border-[#b6d95b]'}`}><ThumbsUp size={15} fill={isLiked ? 'currentColor' : 'none'} /> {isLiked ? 'LIKED' : 'LIKE'}</button><button data-testid="button-modal-save" onClick={onSave} className={`flex items-center gap-2 rounded-sm border px-4 py-2.5 text-[11px] font-bold tracking-wide ${isSaved ? 'border-[#d4a950] bg-[#332a17] text-[#eac067]' : 'border-[#2a4053] text-[#a8bac4] hover:border-[#eabd64]'}`}>{isSaved ? <BookmarkCheck size={15} /> : <Bookmark size={15} />} {isSaved ? 'IN LIBRARY' : 'SAVE TO LIBRARY'}</button></div></div>
          <aside className="border-l border-[#1d3042] pl-0 lg:pl-7"><p className="mb-4 font-mono-app text-[9px] tracking-[.18em] text-[#61798b]">TRANSMISSION DATA</p><dl className="space-y-3 text-[12px]"><div className="flex justify-between border-b border-[#17283a] pb-2"><dt className="text-[#62798b]">SOURCE</dt><dd className="text-[#c1d0d7]">{video.creator}</dd></div><div className="flex justify-between border-b border-[#17283a] pb-2"><dt className="text-[#62798b]">REACH</dt><dd className="text-[#c1d0d7]">{video.views} views</dd></div><div className="flex justify-between border-b border-[#17283a] pb-2"><dt className="text-[#62798b]">RELEASED</dt><dd className="text-[#c1d0d7]">{video.age}</dd></div><div className="flex justify-between"><dt className="text-[#62798b]">STATUS</dt><dd className="flex items-center gap-1.5 text-[#5fdfd9]"><Check size={13} /> VERIFIED</dd></div></dl><div className="mt-8 rounded-sm border border-[#20384a] bg-[#0a1723] p-4"><div className="flex items-center gap-2 text-[#d4e0e3]"><Zap size={14} className="text-[#eabd64]" /><span className="font-condensed text-lg font-bold tracking-wide">NO DISTRACTIONS</span></div><p className="mt-2 text-[11px] leading-relaxed text-[#71899a]">Flying Eagle is supported by the people who use it. There are no sponsored interruptions here.</p></div></aside>
        </div>
      </div>
    </div>
  );
}

export default App;