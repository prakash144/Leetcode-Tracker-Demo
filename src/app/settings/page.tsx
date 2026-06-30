"use client";

import { useState } from "react";
import { ExternalLink, Github, Moon, Sun, Trash2 } from "lucide-react";
import Footer from "@/app/components/Footer";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { useProblemWorkspaceData } from "@/features/problems/hooks/useProblemWorkspaceData";

const SettingsPage = () => {
  const { auth, progress } = useProblemWorkspaceData();
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    document.documentElement.classList.toggle("dark", next === "dark");
  };

  const totalSolved = Object.values(progress.progressMap).filter((p) => p.solved).length;

  return (
    <AppShell
      user={auth.user}
      authLoading={auth.loading}
      isAuthConfigured={auth.isConfigured}
      onLogin={auth.login}
      onLogout={auth.logout}
      footer={<Footer />}
    >
      <PageHeader
        eyebrow="Settings"
        title="Account & Preferences"
        description="Manage your account, preferences, and application settings."
      />

      <div className="mx-auto max-w-3xl space-y-8 p-4 sm:px-6 lg:px-8 pb-12">
        {/* Appearance */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5">
          <h2 className="text-base font-semibold text-white mb-4">Appearance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-zinc-200">Theme</div>
                <div className="text-xs text-zinc-500">Switch between dark and light mode</div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
              >
                {theme === "dark" ? (
                  <span className="flex items-center gap-2">
                    <Sun className="size-4" />
                    Light Mode
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Moon className="size-4" />
                    Dark Mode
                  </span>
                )}
              </Button>
            </div>
            <div className="flex items-center justify-between opacity-60">
              <div>
                <div className="text-sm font-medium text-zinc-200">Accent Color</div>
                <div className="text-xs text-zinc-500">Customize the primary accent color</div>
              </div>
              <div className="flex gap-1.5">
                <span className="size-6 rounded-full bg-green-500 ring-2 ring-green-300 ring-offset-2 ring-offset-zinc-900" />
                <span className="size-6 rounded-full bg-blue-500" />
                <span className="size-6 rounded-full bg-purple-500" />
                <span className="size-6 rounded-full bg-orange-500" />
              </div>
            </div>
          </div>
        </section>

        {/* Coding Preferences */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5">
          <h2 className="text-base font-semibold text-white mb-4">Coding Preferences</h2>
          <div className="space-y-4 text-sm text-zinc-500">
            <p>Preferences will sync across devices once signed in. Configure your defaults below.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-3">
                <div className="text-xs text-zinc-500">Default Company</div>
                <div className="text-sm text-zinc-200 font-medium mt-0.5">Google</div>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-3">
                <div className="text-xs text-zinc-500">Default Sheet</div>
                <div className="text-sm text-zinc-200 font-medium mt-0.5">5. All.csv</div>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-3">
                <div className="text-xs text-zinc-500">Default Sorting</div>
                <div className="text-sm text-zinc-200 font-medium mt-0.5">Frequency</div>
              </div>
              <div className="rounded-lg border border-zinc-800 bg-zinc-900/80 p-3">
                <div className="text-xs text-zinc-500">Page Size</div>
                <div className="text-sm text-zinc-200 font-medium mt-0.5">25</div>
              </div>
            </div>
          </div>
        </section>

        {/* Dashboard */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5">
          <h2 className="text-base font-semibold text-white mb-4">Dashboard</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-zinc-200">Weekly Goal</div>
                <div className="text-xs text-zinc-500">Target problems to solve per week</div>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" className="border-zinc-700 bg-zinc-800 text-zinc-200 h-8 w-8 p-0" aria-label="Decrease weekly goal">-</Button>
                <span className="w-8 text-center text-sm font-medium text-zinc-200">5</span>
                <Button type="button" variant="outline" size="sm" className="border-zinc-700 bg-zinc-800 text-zinc-200 h-8 w-8 p-0" aria-label="Increase weekly goal">+</Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-zinc-200">Daily Goal</div>
                <div className="text-xs text-zinc-500">Target problems to solve per day</div>
              </div>
              <div className="flex items-center gap-2">
                <Button type="button" variant="outline" size="sm" className="border-zinc-700 bg-zinc-800 text-zinc-200 h-8 w-8 p-0" aria-label="Decrease daily goal">-</Button>
                <span className="w-8 text-center text-sm font-medium text-zinc-200">1</span>
                <Button type="button" variant="outline" size="sm" className="border-zinc-700 bg-zinc-800 text-zinc-200 h-8 w-8 p-0" aria-label="Increase daily goal">+</Button>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-zinc-200">Heatmap Visibility</div>
                <div className="text-xs text-zinc-500">Show activity heatmap on dashboard</div>
              </div>
              <div className="h-5 w-10 rounded-full bg-green-500 cursor-pointer relative">
                <div className="absolute top-0.5 right-0.5 size-4 rounded-full bg-white shadow" />
              </div>
            </div>
          </div>
        </section>

        {/* Account */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5">
          <h2 className="text-base font-semibold text-white mb-4">Account</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-zinc-200">Connected Account</div>
                <div className="text-xs text-zinc-500">Signed in with Google</div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-400">{auth.user?.email || "—"}</span>
                {auth.user?.photoURL && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={auth.user.photoURL} alt="" className="size-7 rounded-full border border-zinc-700" />
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-zinc-200">Export Progress</div>
                <div className="text-xs text-zinc-500">Download your progress data as JSON</div>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!auth.user}
                onClick={() => {
                  const data = JSON.stringify(progress.progressMap, null, 2);
                  const blob = new Blob([data], { type: "application/json" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "interview-tracly-progress.json";
                  a.click();
                  URL.revokeObjectURL(url);
                }}
                className="border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
              >
                Export JSON
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-zinc-200">Total Solved</div>
                <div className="text-xs text-zinc-500">Problems solved across all datasets</div>
              </div>
              <span className="text-sm font-semibold text-green-400">{totalSolved}</span>
            </div>
            <div className="border-t border-zinc-800 pt-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled
                className="border-red-500/30 bg-red-500/10 text-red-300 hover:bg-red-500/20"
              >
                <Trash2 className="size-4" />
                Delete Account
              </Button>
              <p className="mt-1.5 text-xs text-zinc-600">Account deletion is not yet available.</p>
            </div>
          </div>
        </section>

        {/* About */}
        <section className="rounded-xl border border-zinc-800 bg-zinc-900/80 p-5">
          <h2 className="text-base font-semibold text-white mb-4">About</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400">Version</span>
              <span className="text-zinc-200">0.1.0</span>
            </div>
            <div className="border-t border-zinc-800" />
            <a
              href="https://github.com/prakash144/leetcode-company-wise-problems"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Github className="size-4" />
                GitHub
              </span>
              <ExternalLink className="size-3" />
            </a>
            <div className="border-t border-zinc-800" />
            <div className="flex items-center justify-between text-zinc-500">
              <span>Privacy Policy</span>
              <span className="text-xs text-zinc-600">Coming soon</span>
            </div>
            <div className="flex items-center justify-between text-zinc-500">
              <span>Terms of Service</span>
              <span className="text-xs text-zinc-600">Coming soon</span>
            </div>
            <div className="border-t border-zinc-800" />
            <div className="text-zinc-500 text-xs leading-relaxed">
              Interview Tracly helps you track your coding journey and crack your dream company.
              Built with Next.js, Firebase, and Tailwind CSS.
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
};

export default SettingsPage;