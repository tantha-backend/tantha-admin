import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

import PageHeader from "../components/common/PageHeader";
import SectionCard from "../components/common/SectionCard";
import LoadingState from "../components/common/LoadingState";
import EmptyState from "../components/common/EmptyState";
import Pagination from "../components/common/Pagination";

import Button from "../components/ui/Button";

import AlbumStats from "../components/albums/AlbumStats";
import AlbumFilters from "../components/albums/AlbumFilters";
import AlbumTable from "../components/albums/AlbumTable";
import DeleteAlbumModal from "../components/albums/DeleteAlbumModal";

import albumService from "../services/albumService";
import artistService from "../services/artistService";

function Albums() {
  const navigate = useNavigate();

  const [albums, setAlbums] = useState([]);
  const [artists, setArtists] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [artistFilter, setArtistFilter] = useState("all");

  const [selectedAlbum, setSelectedAlbum] = useState(null);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [page, setPage] = useState(1);

  const pageSize = 10;

  const loadData = async () => {
    try {
      setLoading(true);

      const albumRes = await albumService.getAllAlbums();

      const artistRes = await artistService.getArtists();

      setAlbums(albumRes.albums || []);

      setArtists(artistRes.artists || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredAlbums = useMemo(() => {
    return albums.filter((album) => {
      const searchMatch =
        album.title?.toLowerCase().includes(search.toLowerCase()) ||
        album.artistId?.stageName?.toLowerCase().includes(search.toLowerCase());

      const statusMatch =
        statusFilter === "all"
          ? true
          : statusFilter === "published"
            ? album.isPublished
            : !album.isPublished;

      const artistMatch =
        artistFilter === "all" ? true : album.artistId?._id === artistFilter;

      return searchMatch && statusMatch && artistMatch;
    });
  }, [albums, search, statusFilter, artistFilter]);

  const paginatedAlbums = useMemo(() => {
    const start = (page - 1) * pageSize;

    return filteredAlbums.slice(start, start + pageSize);
  }, [filteredAlbums, page]);

  const totalPages = Math.ceil(filteredAlbums.length / pageSize);

  const handleDelete = async () => {
    if (!selectedAlbum) return;

    try {
      setDeleteLoading(true);

      await albumService.deleteAlbum(selectedAlbum._id);

      await loadData();

      setDeleteOpen(false);

      setSelectedAlbum(null);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handlePublish = async (album) => {
    await albumService.publishAlbum(album._id);

    loadData();
  };

  const handleUnpublish = async (album) => {
    await albumService.unpublishAlbum(album._id);

    loadData();
  };
  return (
    <div className="space-y-6">
      <PageHeader
        title="Albums"
        description="Manage album releases, tracks, and publishing."
        action={
          <Button onClick={() => navigate("/albums/create")}>
            <Plus size={18} />
            Create Album
          </Button>
        }
      />

      <AlbumStats albums={albums} />

      <SectionCard>
        <AlbumFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          artistFilter={artistFilter}
          onArtistChange={setArtistFilter}
          artists={artists}
          onRefresh={loadData}
        />

        {loading ? (
          <LoadingState />
        ) : filteredAlbums.length === 0 ? (
          <EmptyState
            title="No albums found"
            description="Create your first album to start organizing songs."
            action={
              <Button onClick={() => navigate("/albums/create")}>
                <Plus size={18} />
                Create Album
              </Button>
            }
          />
        ) : (
          <>
            <AlbumTable
              albums={paginatedAlbums}
              onView={(album) => navigate(`/albums/${album._id}`)}
              onEdit={(album) => navigate(`/albums/${album._id}/edit`)}
              onPublish={handlePublish}
              onUnpublish={handleUnpublish}
              onDelete={(album) => {
                setSelectedAlbum(album);
                setDeleteOpen(true);
              }}
            />

            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </SectionCard>

      <DeleteAlbumModal
        open={deleteOpen}
        album={selectedAlbum}
        loading={deleteLoading}
        onClose={() => {
          setDeleteOpen(false);
          setSelectedAlbum(null);
        }}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default Albums;
