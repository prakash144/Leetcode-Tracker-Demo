"use client";

import Footer from "@/app/components/Footer";
import AppShell from "@/components/layout/AppShell";
import PageHeader from "@/components/layout/PageHeader";
import FavoriteProblemsView from "@/features/favorites/components/FavoriteProblemsView";
import { useProblemWorkspaceData } from "@/features/problems/hooks/useProblemWorkspaceData";

const FavoritesPage = () => {
  const workspace = useProblemWorkspaceData();

  return (
    <AppShell footer={<Footer />}>
      <PageHeader
        eyebrow="Favorites"
        title="Bookmarked Problems"
        description="Review starred problems from the currently loaded dataset."
      />
      <FavoriteProblemsView workspace={workspace} />
    </AppShell>
  );
};

export default FavoritesPage;
