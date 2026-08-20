import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, Music4, Save, Tags } from "lucide-react";
import toast from "react-hot-toast";

import PageHeader from "../components/common/PageHeader";
import SectionCard from "../components/common/SectionCard";
import SearchBar from "../components/common/SearchBar";
import Button from "../components/ui/Button";

import songService from "../services/songService";
import { songCredit } from "../utils/artists";

/**
 * Bulk tagging screen.
 *
 * The catalogue arrived from a bulk import that had to default every genre to
 * "Pop", so almost nothing is really tagged and no shelf can be built from
 * the field. Tagging is therefore a few hundred small decisions, and the only
 * thing that matters here is how fast one song can be dealt with: pick a
 * genre, optionally a mood or two, move on.
 *
 * Edits are held locally and saved in one request, so a run of tagging is not
 * hundreds of round trips.
 */
const TagSongs = () => {
  const [songs, setSongs] = useState([]);
  const [genres, setGenres] = useState([]);
  const [moods, setMoods] = useState([]);
  const [progress, setProgress] = useState({ total: 0, reviewed: 0, remaining: 0 });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [onlyUntagged, setOnlyUntagged] = useState(true);

  // songId -> { genre, moods } for rows touched but not yet saved.
  const [edits, setEdits] = useState({});

  const load = async () => {
    try {
      setLoading(true);

      const [songsRes, optionsRes] = await Promise.all([
        songService.getAllSongs(),
        songService.getTagOptions(),
      ]);

      const list =
        songsRes?.data?.songs || songsRes?.songs || songsRes?.data || [];

      setSongs(Array.isArray(list) ? list : []);
      setGenres(optionsRes?.genres || []);
      setMoods(optionsRes?.moods || []);
      setProgress(optionsRes?.progress || { total: 0, reviewed: 0, remaining: 0 });
    } catch (error) {
      toast.error("Failed to load songs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  /** Current value for a row: the unsaved edit if there is one, else stored. */
  const valueFor = (song) => ({
    genre: edits[song._id]?.genre ?? song.genre ?? "",
    moods: edits[song._id]?.moods ?? song.moods ?? [],
  });

  const setGenre = (song, genre) => {
    const current = valueFor(song);
    setEdits((prev) => ({
      ...prev,
      [song._id]: { ...current, genre },
    }));
  };

  const toggleMood = (song, mood) => {
    const current = valueFor(song);
    const next = current.moods.includes(mood)
      ? current.moods.filter((m) => m !== mood)
      : [...current.moods, mood];

    setEdits((prev) => ({
      ...prev,
      [song._id]: { ...current, moods: next },
    }));
  };

  const visible = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return songs.filter((song) => {
      // A row being edited stays visible even once it counts as tagged,
      // otherwise it would vanish from under the cursor mid-decision.
      if (onlyUntagged && song.tagsReviewed && !edits[song._id]) return false;

      if (!keyword) return true;

      return (
        song?.title?.toLowerCase().includes(keyword) ||
        songCredit(song).toLowerCase().includes(keyword)
      );
    });
  }, [songs, search, onlyUntagged, edits]);

  const pending = Object.entries(edits).filter(([, v]) => v.genre);

  const save = async () => {
    if (!pending.length) return;

    try {
      setSaving(true);

      const res = await songService.bulkTagSongs(
        pending.map(([songId, v]) => ({
          songId,
          genre: v.genre,
          moods: v.moods,
        })),
      );

      const updated = res?.updated ?? pending.length;
      toast.success(`Tagged ${updated} song${updated === 1 ? "" : "s"}`);

      if (res?.rejected?.length) {
        toast.error(`${res.rejected.length} rejected — check the vocabulary`);
      }

      setEdits({});
      await load();
    } catch (error) {
      toast.error("Failed to save tags");
    } finally {
      setSaving(false);
    }
  };

  const donePct = progress.total
    ? Math.round((progress.reviewed / progress.total) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Tag Songs"
        description="Set a genre and mood for each song. These drive the recommendation shelves."
      />

      <SectionCard
        title="Progress"
        description={`${progress.reviewed} of ${progress.total} songs tagged`}
      >
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-pink-500 transition-all"
            style={{ width: `${donePct}%` }}
          />
        </div>
        <p className="mt-2 text-sm text-white/50">
          {progress.remaining} still untagged · {donePct}% done
        </p>
      </SectionCard>

      <SectionCard
        title="Songs"
        description="Pick one genre. Moods are optional and you can pick several."
      >
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchBar
            value={search}
            onChange={setSearch}
            onClear={() => setSearch("")}
            placeholder="Search songs or artists..."
          />

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOnlyUntagged((v) => !v)}
              className={`rounded-xl border px-4 py-2 text-sm transition ${
                onlyUntagged
                  ? "border-pink-500 text-white"
                  : "border-white/10 text-white/60 hover:text-white"
              }`}
            >
              {onlyUntagged ? "Untagged only" : "All songs"}
            </button>

            <span className="text-xs text-white/40">{visible.length} shown</span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black p-6 text-sm text-white/50">
            <Loader2 className="animate-spin" size={16} /> Loading songs...
          </div>
        ) : visible.length === 0 ? (
          <div className="rounded-xl border border-white/10 bg-black p-8 text-center">
            <Tags className="mx-auto mb-3 text-white/30" size={36} />
            <p className="text-sm text-white/50">
              {onlyUntagged
                ? "Everything is tagged. Nice."
                : `No songs match "${search.trim()}".`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {visible.map((song) => {
              const value = valueFor(song);
              const dirty = Boolean(edits[song._id]);

              return (
                <div
                  key={song._id}
                  className={`rounded-2xl border p-4 transition ${
                    dirty
                      ? "border-pink-500/50 bg-pink-500/[0.04]"
                      : "border-white/10 bg-black/40"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {song?.coverImage ? (
                      <img
                        src={song.coverImage}
                        alt={song?.title || "cover"}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/5">
                        <Music4 size={18} className="text-white/30" />
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-white">
                        {song?.title || "Untitled"}
                      </p>
                      <p className="truncate text-xs text-white/40">
                        {songCredit(song)}
                      </p>
                    </div>

                    {song.tagsReviewed && !dirty ? (
                      <span className="flex items-center gap-1 text-xs text-emerald-400">
                        <Check size={14} /> tagged
                      </span>
                    ) : null}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {genres.map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGenre(song, g)}
                        className={`rounded-lg border px-3 py-1.5 text-xs transition ${
                          value.genre === g
                            ? "border-pink-500 bg-pink-500/10 text-white"
                            : "border-white/10 text-white/50 hover:border-white/30 hover:text-white"
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2 border-t border-white/5 pt-3">
                    {moods.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => toggleMood(song, m)}
                        className={`rounded-full border px-3 py-1 text-xs transition ${
                          value.moods.includes(m)
                            ? "border-sky-400 bg-sky-400/10 text-white"
                            : "border-white/10 text-white/40 hover:border-white/30 hover:text-white"
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* Kept in view while scrolling a long list, so a run of edits is never
          more than one click from being saved. */}
      {pending.length > 0 && (
        <div className="sticky bottom-4 flex items-center justify-between rounded-2xl border border-pink-500/40 bg-black/90 p-4 backdrop-blur">
          <p className="text-sm text-white/70">
            {pending.length} song{pending.length === 1 ? "" : "s"} ready to save
          </p>

          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={() => setEdits({})}>
              Discard
            </Button>
            <Button type="button" onClick={save} disabled={saving}>
              {saving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={16} /> Saving...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <Save size={16} /> Save tags
                </span>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TagSongs;
