import { Globe, X } from "lucide-react";
import { getDisplayTime } from "@/lib/utils";

export default function RecentPostedNotes({
  notes,
  className = "",
  setRecentNotesOpen,
}) {
  const recentPostedNotes = notes
    ?.filter((note) => note.visibility !== "private")
    ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    ?.slice(0, 4);

  if (!recentPostedNotes?.length) return null;

  return (
    <section
      className={`relative w-full rounded-lg border border-yellow-200 bg-yellow-50 p-4 shadow-lg ${className}`}
    >
      <div className="mb-3 flex items-center justify-between gap-3">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Globe size={16} className="text-primary" />
          <span>Recent Posted Notes</span>
        </h3>

      </div>

      <ul className="flex flex-col">
        {recentPostedNotes.map((note) => (
          <li
            key={note.id}
            className="border-b border-yellow-200/80 py-3 first:pt-0 last:border-b-0 last:pb-0"
          >
            <div className="flex flex-col gap-1">
              <div className="flex items-start justify-between gap-3">
                <p className="min-w-0 flex-1 text-sm leading-relaxed text-foreground">
                  {note.content}
                </p>

                <span className="shrink-0 whitespace-nowrap text-xs italic text-muted">
                  {getDisplayTime(note.createdAt, "note")}
                </span>
              </div>

              {note.author && (
                <span className="text-xs text-muted">
                  Posted by {note.author.firstName} {note.author.lastName}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}