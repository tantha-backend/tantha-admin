import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Image, Music2, Upload, X } from "lucide-react";

const formatFileSize = (bytes) => {
  if (!bytes) return "";

  const mb = bytes / (1024 * 1024);
  return `${mb.toFixed(2)} MB`;
};

const ErrorText = ({ message }) => {
  if (!message) return null;

  return <p className="mt-2 text-xs text-red-400">{message}</p>;
};

const UploadDropzone = ({
  icon,
  title,
  description,
  accept,
  hasError,
  onFileSelect,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (!acceptedFiles?.length) return;
      onFileSelect(acceptedFiles[0]);
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`flex h-56 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed bg-black transition-all duration-200 ${
        hasError
          ? "border-red-500"
          : isDragActive
            ? "border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/20"
            : "border-zinc-700 hover:border-pink-500"
      }`}
    >
      <input {...getInputProps()} />

      <div
        className={
          hasError
            ? "text-red-400"
            : isDragActive
              ? "text-pink-400"
              : "text-zinc-500"
        }
      >
        {icon}
      </div>

      <p className="mt-4 text-center text-white">
        {isDragActive ? "Release to upload" : title}
      </p>

      <p className="mt-1 text-center text-xs text-zinc-500">{description}</p>
    </div>
  );
};

const FileInfo = ({ file, duration, previewUrl, onRemove }) => {
  if (!file) return null;

  return (
    <div className="mt-3 rounded-xl bg-black p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-300">
            {file.name}
          </p>

          <p className="mt-1 text-xs text-zinc-500">
            {formatFileSize(file.size)}
            {duration ? ` • ${duration}` : ""}
          </p>
        </div>

        <button type="button" onClick={onRemove} className="shrink-0">
          <X size={18} className="text-red-500" />
        </button>
      </div>

      {previewUrl && (
        <audio controls src={previewUrl} className="mt-3 w-full" />
      )}
    </div>
  );
};

const CoverPreview = ({ file, previewUrl, onRemove }) => {
  if (!file || !previewUrl) return null;

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-zinc-800 bg-black">
      <div className="relative aspect-square w-full overflow-hidden bg-zinc-900">
        <img
          src={previewUrl}
          alt="Cover preview"
          className="h-full w-full object-cover"
        />

        <button
          type="button"
          onClick={onRemove}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-red-500 transition hover:bg-black"
        >
          <X size={18} />
        </button>
      </div>

      <div className="p-3">
        <p className="truncate text-sm font-medium text-zinc-300">
          {file.name}
        </p>

        <p className="mt-1 text-xs text-zinc-500">
          {formatFileSize(file.size)}
        </p>
      </div>
    </div>
  );
};

const MediaUploadForm = ({
  formData,
  setFormData,
  errors = {},
  clearError,
}) => {
  const [coverPreviewUrl, setCoverPreviewUrl] = useState("");
  const [audio128PreviewUrl, setAudio128PreviewUrl] = useState("");
  const [audio320PreviewUrl, setAudio320PreviewUrl] = useState("");

  useEffect(() => {
    if (!formData.coverImage) {
      setCoverPreviewUrl("");
      return;
    }

    const imageUrl = URL.createObjectURL(formData.coverImage);
    setCoverPreviewUrl(imageUrl);

    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, [formData.coverImage]);

  useEffect(() => {
    if (!formData.audio128) {
      setAudio128PreviewUrl("");
      return;
    }

    const audioUrl = URL.createObjectURL(formData.audio128);
    setAudio128PreviewUrl(audioUrl);

    return () => {
      URL.revokeObjectURL(audioUrl);
    };
  }, [formData.audio128]);

  useEffect(() => {
    if (!formData.audio320) {
      setAudio320PreviewUrl("");
      return;
    }

    const audioUrl = URL.createObjectURL(formData.audio320);
    setAudio320PreviewUrl(audioUrl);

    return () => {
      URL.revokeObjectURL(audioUrl);
    };
  }, [formData.audio320]);

  const handleFileChange = (field, file) => {
    if (!file) return;

    if (clearError) clearError(field);

    if (field === "audio128" && clearError) {
      clearError("duration");
    }

    setFormData((prev) => ({
      ...prev,
      [field]: file,
    }));
  };

  const removeFile = (field) => {
    setFormData((prev) => ({
      ...prev,
      [field]: null,
      ...(field === "audio128" ? { duration: "" } : {}),
    }));
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-white">Media Upload</h2>

        <p className="mt-1 text-sm text-zinc-400">
          Upload the cover artwork and audio files.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div>
          <label className="mb-3 block text-sm font-medium text-zinc-300">
            Cover Image
          </label>

          {!formData.coverImage ? (
            <UploadDropzone
              icon={<Image size={42} />}
              title="Drop image here or click to upload"
              description="JPG • PNG • WEBP"
              accept={{
                "image/*": [".jpg", ".jpeg", ".png", ".webp"],
              }}
              hasError={Boolean(errors.coverImage)}
              onFileSelect={(file) => handleFileChange("coverImage", file)}
            />
          ) : (
            <CoverPreview
              file={formData.coverImage}
              previewUrl={coverPreviewUrl}
              onRemove={() => removeFile("coverImage")}
            />
          )}

          <ErrorText message={errors.coverImage} />
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-zinc-300">
            Audio 128 kbps *
          </label>

          <UploadDropzone
            icon={<Music2 size={42} />}
            title="Drop MP3 here or click to upload"
            description="Required • MP3 audio"
            accept={{
              "audio/mpeg": [".mp3"],
              "audio/*": [],
            }}
            hasError={Boolean(errors.audio128)}
            onFileSelect={(file) => handleFileChange("audio128", file)}
          />

          <FileInfo
            file={formData.audio128}
            duration={formData.duration}
            previewUrl={audio128PreviewUrl}
            onRemove={() => removeFile("audio128")}
          />

          <ErrorText message={errors.audio128} />
        </div>

        <div>
          <label className="mb-3 block text-sm font-medium text-zinc-300">
            Audio 320 kbps
          </label>

          <UploadDropzone
            icon={<Upload size={42} />}
            title="Drop high quality MP3 here"
            description="Optional • MP3 audio"
            accept={{
              "audio/mpeg": [".mp3"],
              "audio/*": [],
            }}
            hasError={Boolean(errors.audio320)}
            onFileSelect={(file) => handleFileChange("audio320", file)}
          />

          <FileInfo
            file={formData.audio320}
            previewUrl={audio320PreviewUrl}
            onRemove={() => removeFile("audio320")}
          />

          <ErrorText message={errors.audio320} />
        </div>
      </div>
    </div>
  );
};

export default MediaUploadForm;
