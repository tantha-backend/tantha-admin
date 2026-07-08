import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

import Button from "../components/ui/Button";
import ArtistForm from "../components/artists/ArtistForm";
import artistService from "../services/artistService";

function EditArtist() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [artist, setArtist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchArtist = async () => {
    try {
      setLoading(true);

      const res = await artistService.getArtistById(id);
      setArtist(res.artist);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to load artist.");
      navigate("/artists");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtist();
  }, [id]);

  const handleUpdateArtist = async (formData) => {
    try {
      setSaving(true);

      await artistService.updateArtist(id, formData);

      alert("Artist updated successfully.");

      navigate(`/artists/${id}`);
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update artist.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-white/50">Loading artist...</div>;
  }

  if (!artist) {
    return <div className="text-white/50">Artist not found.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button type="button" onClick={() => navigate(`/artists/${id}`)}>
          <ArrowLeft size={18} />
          Back
        </Button>

        <h1 className="text-3xl font-bold text-white">Edit Artist</h1>
      </div>

      <ArtistForm
        mode="edit"
        initialData={artist}
        loading={saving}
        onSubmit={handleUpdateArtist}
      />
    </div>
  );
}

export default EditArtist;
