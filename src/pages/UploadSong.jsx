import { useEffect, useState } from "react";
import { Upload, ArrowLeft } from "lucide-react";
import api from "../api/api";

function UploadSong() {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title: "",
    artistId: "",
    genre: "",
    language: "",
    duration: "",
    lyrics: "",
    isPremiumOnly: "false",
  });

  const [files, setFiles] = useState({
    coverImage: null,
    audio128: null,
    audio320: null,
  });

  useEffect(() => {
    loadArtists();
  }, []);

  const loadArtists = async () => {
    try {
      const res = await api.get("/artists");
      setArtists(res.data.artists || []);
    } catch (error) {
      console.log(error);
      alert("Failed to load artists");
    }
  };

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFiles({
      ...files,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.genre || !form.language || !form.duration) {
      alert("Title, genre, language and duration are required");
      return;
    }

    if (!files.audio128) {
      alert("Audio 128kbps file is required");
      return;
    }

    try {
      setLoading(true);

      const data = new FormData();

      data.append("title", form.title);
      data.append("artistId", form.artistId);
      data.append("genre", form.genre);
      data.append("language", form.language);
      data.append("duration", form.duration);
      data.append("lyrics", form.lyrics);
      data.append("isPremiumOnly", form.isPremiumOnly);

      if (files.coverImage) {
        data.append("coverImage", files.coverImage);
      }

      if (files.audio128) {
        data.append("audio128", files.audio128);
      }

      if (files.audio320) {
        data.append("audio320", files.audio320);
      }

      await api.post("/songs/create", data);

      alert("Song uploaded successfully");

      setForm({
        title: "",
        artistId: "",
        genre: "",
        language: "",
        duration: "",
        lyrics: "",
        isPremiumOnly: "false",
      });

      setFiles({
        coverImage: null,
        audio128: null,
        audio320: null,
      });
    } catch (error) {
      console.log("UPLOAD ERROR:", error.response?.data || error);

      alert(
        error.response?.data
          ? JSON.stringify(error.response.data, null, 2)
          : "Failed to upload song"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-8">
        <button className="w-10 h-10 rounded-xl bg-zinc-950 border border-white/10 flex items-center justify-center">
          <ArrowLeft size={18} />
        </button>

        <div>
          <h1 className="text-3xl font-bold">Upload Song</h1>
          <p className="text-white/50 mt-1">
            Upload a new song and submit it for approval.
          </p>
        </div>
      </div>

      <div className="card max-w-5xl">
        <div className="grid grid-cols-2 gap-5">
          <Field
            label="Song Title"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Enter song title"
          />

          <div>
            <label className="label">Artist</label>
            <select
              className="input"
              name="artistId"
              value={form.artistId}
              onChange={handleChange}
            >
              <option value="">Select Artist</option>
              {artists.map((artist) => (
                <option key={artist._id} value={artist._id}>
                  {artist.stageName || artist.name}
                </option>
              ))}
            </select>
          </div>

          <Field
            label="Genre"
            name="genre"
            value={form.genre}
            onChange={handleChange}
            placeholder="Pop, Rock, Folk..."
          />

          <Field
            label="Language"
            name="language"
            value={form.language}
            onChange={handleChange}
            placeholder="Manipuri, Hindi, English..."
          />

          <Field
            label="Duration"
            name="duration"
            value={form.duration}
            onChange={handleChange}
            placeholder="240"
          />

          <div>
            <label className="label">Premium Only</label>
            <select
              className="input"
              name="isPremiumOnly"
              value={form.isPremiumOnly}
              onChange={handleChange}
            >
              <option value="false">No</option>
              <option value="true">Yes</option>
            </select>
          </div>

          <div className="col-span-2">
            <label className="label">Lyrics</label>
            <textarea
              className="input min-h-32"
              name="lyrics"
              value={form.lyrics}
              onChange={handleChange}
              placeholder="Enter lyrics..."
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-5 mt-8">
          <UploadBox
            title="Cover Image"
            name="coverImage"
            file={files.coverImage}
            onChange={handleFileChange}
          />

          <UploadBox
            title="Audio 128kbps"
            name="audio128"
            file={files.audio128}
            onChange={handleFileChange}
          />

          <UploadBox
            title="Audio 320kbps"
            name="audio320"
            file={files.audio320}
            onChange={handleFileChange}
          />
        </div>

        <div className="flex justify-end gap-3 mt-8">
          <button className="btn" disabled={loading}>
            Save Draft
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-xl font-semibold disabled:opacity-50"
          >
            {loading ? "Uploading..." : "Submit Song"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, placeholder }) {
  return (
    <div>
      <label className="label">{label}</label>
      <input
        className="input"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

function UploadBox({ title, name, file, onChange }) {
  return (
    <label className="border border-dashed border-white/15 rounded-2xl p-6 h-40 flex flex-col items-center justify-center text-center hover:border-pink-500 transition cursor-pointer">
      <Upload className="text-pink-500 mb-3" size={28} />

      <p className="font-medium">{title}</p>

      <p className="text-xs text-white/40 mt-1">
        {file ? file.name : "Click to upload file"}
      </p>

      <input
        type="file"
        name={name}
        onChange={onChange}
        className="hidden"
      />
    </label>
  );
}

export default UploadSong;