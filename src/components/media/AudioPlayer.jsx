const getAudioUrl = (src) => {
  if (!src) return "";

  if (typeof src === "string") return src;

  return (
    src.url || src.location || src.Location || src.path || src.secure_url || ""
  );
};

const AudioPlayer = ({ src }) => {
  const audioUrl = getAudioUrl(src);

  if (!audioUrl) {
    return <span className="text-xs text-white/30">No audio</span>;
  }

  return (
    <div
      className="w-[260px] max-w-[260px]"
      onClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <audio src={audioUrl} controls preload="metadata" className="h-10 w-full">
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
