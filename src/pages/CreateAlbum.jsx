import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import PageHeader from "../components/common/PageHeader";
import LoadingState from "../components/common/LoadingState";
import AlbumForm from "../components/albums/AlbumForm";

import albumService from "../services/albumService";
import artistService from "../services/artistService";

function CreateAlbum() {
  const navigate = useNavigate();

  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      setLoading(true);

      const res = await artistService.getArtists();

      setArtists(res.artists || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load artists.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      setSaving(true);

      const res = await albumService.createAlbum(formData);

      toast.success(res.message || "Album created successfully.");

      navigate("/albums");
    } catch (error) {
      console.error(error);

      toast.error(error?.response?.data?.message || "Failed to create album.");
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
        title="Create Album"
        description="Create a new album and prepare it for release."
      />

      <AlbumForm artists={artists} onSubmit={handleSubmit} loading={saving} />
    </div>
  );
}

export default CreateAlbum;
