"use client";

import Footer from "@/app/components/Footer";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import AnalyticsOverview from "@/features/analytics/components/AnalyticsOverview";
import { useProblemWorkspaceData } from "@/features/problems/hooks/useProblemWorkspaceData";

const AnalyticsPage = () => {
  const { auth, progress, questionsState } = useProblemWorkspaceData();

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
        eyebrow="Analytics"
        title="Progress Analytics"
        description="Inspect completion, topic, difficulty, and activity trends for the current dataset."
      />
      <AnalyticsOverview
        questions={questionsState.questions}
        progressMap={progress.progressMap}
        uid={auth.user?.uid}
        loading={questionsState.loading || progress.loading}
        error={questionsState.error || auth.error || progress.error}
      />
    </AppShell>
  );
};

export default AnalyticsPage;
