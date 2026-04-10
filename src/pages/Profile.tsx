import { useUserStats } from '../hooks/useUserStats';
import { useAuth } from '../hooks/useAuth';
import { ShieldAlert, Bug, Flame, ArrowUpRight, Fingerprint, Mail, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

type RecentActivityItem = {
    id: string | number;
    slug: string;
    title: string;
};

export const Profile = () => {
    const { data: user } = useAuth();
    const { data, isLoading } = useUserStats();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background text-foreground px-4 md:px-8 py-12 flex items-center justify-center">
                <div className="animate-pulse font-black text-gray-400">DECRYPTING PROFILE...</div>
            </div>
        );
    }

    // Clean variables - No more manual casting!
    const recentActivity = (data?.recent_activity ?? []) as RecentActivityItem[];
    const displayName = user?.name ?? 'Researcher';
    const displayEmail = user?.email ?? 'Hidden';
    const reputation = Number(user?.reputation ?? 0);
    const level = Number(user?.level);;


    return (
        <div className="min-h-screen bg-background text-foreground px-4 md:px-8 py-10 md:py-14">
            <div className="max-w-6xl mx-auto space-y-8">
                
                {/* --- HEADER --- */}
                <header className="rounded-2xl border border-border bg-card p-6 md:p-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                        <div className="flex items-center gap-4 md:gap-5">
                            <div className="relative h-18 w-18 md:h-20 md:w-20 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-3xl font-black shadow-sm">
                                {displayName.charAt(0).toUpperCase()}
                                <span className="absolute -bottom-1 -right-1 rounded-full border border-border bg-card p-1.5 text-primary">
                                    <Sparkles size={14} />
                                </span>
                            </div>

                            <div>
                                <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-bold mb-2">Operator Profile</p>
                                <h1 className="text-3xl md:text-4xl font-black tracking-tight">{displayName}</h1>
                                
                                <div className="mt-4 flex items-center gap-3">
                                    <div className="bg-gray-600 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-tighter shadow-sm shadow-blue-200">
                                        Level {level}
                                    </div>
                                    <div className="text-foreground font-bold text-sm">
                                        {reputation.toLocaleString()} Reputation Points
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="grid gap-2 text-sm text-muted-foreground">
                            <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
                                <Mail size={15} className="text-primary" />
                                <span className="truncate max-w-72">{displayEmail}</span>
                            </div>
                            <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2">
                                <Fingerprint size={15} className="text-primary" />
                                <span>Identity verified</span>
                            </div>
                        </div>
                    </div>
                </header>

                {/* --- STAT CARDS --- */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard
                        title="Total Exploits"
                        hint="All submitted reports"
                        value={data?.stats.total_reports}
                        icon={<Bug size={20} />}
                    />
                    <StatCard
                        title="Critical Hits"
                        hint="High-severity findings"
                        value={data?.stats.critical_count}
                        icon={<Flame size={20} />}
                    />
                    <StatCard
                        title="Active Threats"
                        hint="Open vulnerabilities"
                        value={data?.stats.open_bugs}
                        icon={<ShieldAlert size={20} />}
                    />
                </section>

                {/* --- RECENT ACTIVITY --- */}
                <section className="rounded-2xl border border-border bg-card p-5 md:p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl md:text-2xl font-black tracking-tight text-foreground">Recent Submissions</h2>
                        <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-bold">
                            {recentActivity.length} entries
                        </span>
                    </div>

                    <div className="space-y-2">
                        {recentActivity.length === 0 ? (
                            <div className="rounded-xl border border-dashed border-border p-12 text-center text-muted-foreground font-bold">
                                No activity detected in local logs.
                            </div>
                        ) : (
                            recentActivity.map((report) => (
                                <Link
                                    key={report.id}
                                    to={`/dashboard/reports/${report.slug}`}
                                    className="group flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 md:px-5 md:py-4 transition-all hover:border-primary/60 hover:-translate-y-0.5"
                                >
                                    <div className="min-w-0">
                                        <p className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                                            {report.title}
                                        </p>
                                        <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mt-1">Open Terminal Data</p>
                                    </div>

                                    <span className="inline-flex items-center justify-center rounded-md bg-secondary text-secondary-foreground p-2 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                                        <ArrowUpRight size={16} />
                                    </span>
                                </Link>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};

const StatCard = ({ title, hint, value, icon }: { title: string; hint: string; value?: number; icon: React.ReactNode }) => (
    <div className="rounded-xl border border-border bg-card p-5 md:p-6">
        <div className="mb-4 inline-flex items-center justify-center rounded-lg bg-secondary text-secondary-foreground p-2.5">
            {icon}
        </div>
        <p className="text-xs font-black uppercase tracking-[0.14em] text-muted-foreground mb-2">{title}</p>
        <p className="text-3xl font-black tracking-tight text-foreground">{value ?? 0}</p>
        <p className="text-[10px] uppercase font-black text-muted-foreground mt-2 opacity-50">{hint}</p>
    </div>
);