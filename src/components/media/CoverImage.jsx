import { Music } from "lucide-react";

const CoverImage = ({ src, alt = "Cover", size = "md" }) => {
  const sizes = {
    sm: "h-10 w-10",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-24 w-24",
  };

  return (
    <div
      className={`${sizes[size]} flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-zinc-900`}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
        />
      ) : (
        <Music size={18} className="text-zinc-600" />
      )}
    </div>
  );
};

export default CoverImage;
