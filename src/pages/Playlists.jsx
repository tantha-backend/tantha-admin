import { ListMusic, Plus, Music4, Heart, Globe } from "lucide-react";

import PageHeader from "../components/common/PageHeader";
import StatCard from "../components/common/StatCard";
import SectionCard from "../components/common/SectionCard";
import EmptyState from "../components/common/EmptyState";
import Button from "../components/ui/Button";

function Playlists() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Playlists"
        description="Manage editorial, featured, and community playlists."
        action={
          <Button>
            <Plus size={18} />
            Create Playlist
          </Button>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total Playlists"
          value="0"
          subtitle="All playlists"
          icon={ListMusic}
          variant="info"
        />

        <StatCard
          title="Public"
          value="0"
          subtitle="Visible playlists"
          icon={Globe}
          variant="success"
        />

        <StatCard
          title="Tracks"
          value="0"
          subtitle="Songs included"
          icon={Music4}
          variant="warning"
        />

        <StatCard
          title="Followers"
          value="0"
          subtitle="Playlist followers"
          icon={Heart}
          variant="danger"
        />
      </div>

      <SectionCard
        title="Playlist Management"
        description="Create, organize, and manage playlists across the Tantha Music platform."
      >
        <EmptyState
          icon={ListMusic}
          title="No playlists yet"
          description="Playlist management is ready for backend integration. You'll be able to create editorial playlists, manage songs, and feature collections here."
          actionLabel="Create Playlist"
        />
      </SectionCard>
    </div>
  );
}

export default Playlists;
