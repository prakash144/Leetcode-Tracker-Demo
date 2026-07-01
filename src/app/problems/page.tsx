"use client";

import Footer from "@/app/components/Footer";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import ProblemWorkspace from "@/features/problems/components/ProblemWorkspace";
import { useProblemWorkspaceData } from "@/features/problems/hooks/useProblemWorkspaceData";

const ProblemsPage = () => {
  const workspace = useProblemWorkspaceData();

  return (
    <AppShell footer={<Footer />}>
      <PageHeader
        eyebrow="Problems"
        title="Problem Workspace"
        description="Master coding interviews one problem at a time. Browse, filter, and track your progress."
      />
      <ProblemWorkspace workspace={workspace} />
    </AppShell>
  );
};

export default ProblemsPage;
