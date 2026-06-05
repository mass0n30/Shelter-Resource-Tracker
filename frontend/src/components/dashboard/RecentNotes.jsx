import { Globe, X } from "lucide-react";
import { getDisplayTime } from "@/lib/utils";

export default function RecentPostedNotes({ notes, className, setRecentNotesOpen }) {
  const recentPostedNotes = notes
    ?.filter((note) => note.visibility !== "private")
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    ?.slice(0, 4);

  if (!recentPostedNotes?.length) return null;

  return (
    <section
      className={`relative w-full rounded-lg border border-yellow-200 bg-yellow-50 px-4 pb-4 pt-10 shadow-lg ${
        className || ""
      }`}
    >
      <button
        type="button"
        onClick={() => setRecentNotesOpen(false)}
        aria-label="Close recent notes"
        className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-yellow-200 bg-white/70 text-black shadow-sm transition hover:bg-yellow-100 hover:text-yellow-900"
      >
        <X className="h-4 w-4 text-black" />
      </button>

      <h3 className="text-left text-sm font-semibold text-foreground">
        <Globe className="mr-1 inline h-4 w-4 text-primary" />
        Recent Posted Notes
      </h3>
      <ul className="mt-3 flex flex-col">
        {recentPostedNotes.map((note) => (
          <li
            key={note.id}
            className="border-b border-gray-200 py-3 last:border-b-0"
          >
            <div className="flex flex-col gap-1">

              <div className="flex justify-between">
                <p className="text-sm text-foreground leading-relaxed">
                  {note.content}
                </p>
                <span className="text-xs text-muted-foreground italic">
                  {getDisplayTime(note.createdAt, "note")}
                </span>
              </div>
              {note.author && (
                <span className="text-xs text-muted-foreground">
                  Posted by {note.author.firstName}{" "}
                  {note.author.lastName}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}