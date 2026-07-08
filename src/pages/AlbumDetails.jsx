import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Calendar,
  Disc3,
  Music4,
  Headphones,
  Heart,
  ArrowLeft,
  Pencil,
} from "lucide-react";
import { toast } from "react-hot-toast";

import SectionCard from "../components/common/SectionCard";
import LoadingState from "../components/common/LoadingState";
import StatusBadge from "../components/common/StatusBadge";
import Button from "../components/ui/Button";

import albumService from "../services/albumService";

function AlbumDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [album, setAlbum] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAlbum();
  }, [id]);

  const loadAlbum = async () => {
    try {
      setLoading(true);

      const [albumRes, analyticsRes] = await Promise.all([
        albumService.getAlbumById(id),
        albumService.getAlbumAnalytics(id),
      ]);

      setAlbum(albumRes.album);
      setAnalytics(analyticsRes.analytics);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load album.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate("/albums");
  };

  if (loading) {
    return <LoadingState />;
  }

  if (!album) {
    return (
      <div className="space-y-6">
        <Button variant="secondary" onClick={handleBack}>
          <ArrowLeft size={18} />
          Back to Albums
        </Button>

        <div className="rounded-xl border border-white/10 bg-zinc-950 p-12 text-center text-zinc-400">
          Album not found.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-sm text-zinc-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Albums
          </button>

          <div>
            <h1 className="text-3xl font-bold text-white">{album.title}</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Album overview and analytics.
            </p>
          </div>
        </div>

        <Button onClick={() => navigate(`/albums/${id}/edit`)}>
          <Pencil size={18} />
          Edit Album
        </Button>
      </div>

      <SectionCard>
        <div className="grid gap-8 lg:grid-cols-3">
          <div>
            <img
              src={
                album.coverImage || "https://placehold.co/500x500?text=Album"
              }
              alt={album.title}
              className="w-full rounded-xl border border-white/10 object-cover"
            />
          </div>

          <div className="space-y-5 lg:col-span-2">
            <div>
              <h2 className="text-3xl font-bold text-white">{album.title}</h2>

              <p className="mt-2 text-zinc-400">
                {album.description || "No description available."}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <StatusBadge variant={album.isPublished ? "success" : "warning"}>
                {album.isPublished ? "Published" : "Draft"}
              </StatusBadge>

              {album.isPremiumOnly && (
                <StatusBadge variant="danger">Premium</StatusBadge>
              )}

              {album.isFeatured && (
                <StatusBadge variant="info">Featured</StatusBadge>
              )}

              {album.isFanClubExclusive && (
                <StatusBadge variant="warning">Fan Club</StatusBadge>
              )}
            </div>

            <div className="grid gap-6 text-sm text-zinc-300 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Disc3 size={18} />
                  <span>
                    Artist:
                    <strong className="ml-2 text-white">
                      {album.artistId?.stageName || "-"}
                    </strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Music4 size={18} />
                  <span>
                    Genre:
                    <strong className="ml-2 text-white">
                      {album.genre || "-"}
                    </strong>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar size={18} />
                  <span>
                    Release:
                    <strong className="ml-2 text-white">
                      {album.releaseDate
                        ? new Date(album.releaseDate).toLocaleDateString()
                        : "-"}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  Language:
                  <strong className="ml-2 text-white">
                    {album.language || "-"}
                  </strong>
                </div>

                <div>
                  Label:
                  <strong className="ml-2 text-white">
                    {album.labelName || "Tantha Music"}
                  </strong>
                </div>

                <div>
                  Copyright:
                  <strong className="ml-2 text-white">
                    {album.copyrightLine || "-"}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>

      <div className="grid gap-6 lg:grid-cols-3">
        <SectionCard
          title="Album Statistics"
          description="Performance overview"
        >
          <div className="space-y-4 text-sm text-zinc-300">
            <div className="flex justify-between">
              <span>Total Songs</span>
              <strong className="text-white">
                {analytics?.totalSongs || 0}
              </strong>
            </div>

            <div className="flex justify-between">
              <span>Total Streams</span>
              <strong className="text-white">
                {analytics?.totalStreams?.toLocaleString() || 0}
              </strong>
            </div>

            <div className="flex justify-between">
              <span>Total Likes</span>
              <strong className="text-white">
                {analytics?.totalLikes?.toLocaleString() || 0}
              </strong>
            </div>

            <div className="flex justify-between">
              <span>Total Saves</span>
              <strong className="text-white">
                {analytics?.saveCount || 0}
              </strong>
            </div>

            <div className="flex justify-between">
              <span>Revenue</span>
              <strong className="text-white">
                ₹{analytics?.revenue?.toLocaleString() || 0}
              </strong>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Songs"
          description="Tracks in this album"
          className="lg:col-span-2"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-zinc-400">
                  <th className="py-3">Title</th>
                  <th>Genre</th>
                  <th>Language</th>
                  <th>Streams</th>
                  <th>Likes</th>
                </tr>
              </thead>

              <tbody>
                {album.songs?.length ? (
                  album.songs.map((song) => (
                    <tr key={song._id} className="border-b border-white/5">
                      <td className="py-4 text-white">{song.title}</td>
                      <td>{song.genre || "-"}</td>
                      <td>{song.language || "-"}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Headphones size={16} />
                          {song.playCount || 0}
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-2">
                          <Heart size={16} />
                          {song.likeCount || 0}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-10 text-center text-zinc-500">
                      No songs in this album.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

export default AlbumDetails;
