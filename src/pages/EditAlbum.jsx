import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import PageHeader from "../components/common/PageHeader";
import LoadingState from "../components/common/LoadingState";
import AlbumForm from "../components/albums/AlbumForm";

import albumService from "../services/albumService";
import artistService from "../services/artistService";

function EditAlbum() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [album, setAlbum] = useState(null);
  const [artists, setArtists] = useState([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [albumRes, artistRes] = await Promise.all([
        albumService.getAlbumById(id),
        artistService.getArtists(),
      ]);

      setAlbum(albumRes.album);
      setArtists(artistRes.artists || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load album.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);

      const res = await albumService.updateAlbum(id, formData);

      toast.success(res.message || "Album updated successfully.");

      navigate("/albums");
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Failed to update album.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Album"
        description="Update album information, artwork and publishing."
      />

      <AlbumForm
        initialValues={{
          ...album,
          artistId: album.artistId?._id,
          releaseDate: album.releaseDate ? album.releaseDate.slice(0, 10) : "",
        }}
        artists={artists}
        loading={saving}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

export default EditAlbum;
