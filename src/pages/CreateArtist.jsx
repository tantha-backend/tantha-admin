import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ArtistForm from "../components/artists/ArtistForm";
import artistService from "../services/artistService";

function CreateArtist() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [availableUsers, setAvailableUsers] = useState([]);

  const fetchAvailableUsers = async () => {
    try {
      setUsersLoading(true);

      const data = await artistService.getAvailableArtistUsers();
      setAvailableUsers(data.users || []);
    } catch (err) {
      alert(
        err?.response?.data?.message ||
          "Failed to load users available for artist creation.",
      );
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchAvailableUsers();
  }, []);

  const handleCreateArtist = async (formData) => {
    try {
      setLoading(true);

      await artistService.createArtist(formData);

      alert("Artist profile created successfully");
      navigate("/artists");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to create artist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Create Artist</h1>
        <p className="mt-2 text-sm text-white/50">
          Select an existing user and convert them into an artist profile.
        </p>
      </div>

      <ArtistForm
        mode="create"
        loading={loading}
        usersLoading={usersLoading}
        availableUsers={availableUsers}
        onRefreshUsers={fetchAvailableUsers}
        onSubmit={handleCreateArtist}
      />
    </div>
  );
}

export default CreateArtist;
