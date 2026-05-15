import { useState, useEffect } from "react";
import { DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Notebook } from "lucide-react";
import CalendarPopover from "../partials/Calender"; 
import { z } from "zod";


const schema = z.object({
  content: z.string().min(1, "Note content is required"),
  title: z.string().max(20, "Title too long").optional(),
  setReminder: z.boolean().optional(),
  reminderAt: z.date().nullable().optional(),
});

export default function NoteForm({ authRouter, clientId, noteData, fetchUpdatedData, setOpenForm }) {
  const [error, setError] = useState(null);
  const [date, setDate] = useState(null);

  const isEdit = !!noteData;

  const [formData, setFormData] = useState({
    clientId,
    content: "",
    title: "",
    setReminder: false,
    reminderAt: date,
    visibility: "private",
  });

  const updateField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (noteData) {
      setFormData({
        clientId,
        title: noteData.title || "",
        content: noteData.content || "",
        setReminder: noteData.setReminder || false,
        reminderAt: noteData.reminderAt || null,
        visibility: noteData.visibility || "private",
      });

      setDate(noteData.reminderAt ? new Date(noteData.reminderAt) : null);
    }
  }, [noteData, clientId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      reminderAt: formData.setReminder ? date : null,
    };

    const result = schema.safeParse(payload);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      if (isEdit) {
        await authRouter.patch(`/dashboard/notes/${noteData.id}`, payload);
      } else {
        await authRouter.post("/dashboard/notes", payload);
      }

      if (fetchUpdatedData) {
        await fetchUpdatedData();
      }
      setOpenForm(null);

    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="z-[9999] bg-background rounded-lg w-full max-w-md">

      <DialogHeader>
        <DialogTitle>
          {isEdit ? "Edit Note" : "Create Note"}
        </DialogTitle>

        <DialogDescription className="mt-2 flex items-center gap-2 text-sm text-muted">
          <Notebook className="w-4 h-4" />
          {isEdit
            ? "Update this note."
            : `Add a note ${clientId ? "for this client" : "to the dashboard"}.`}
        </DialogDescription>
      </DialogHeader>

      {error && <span className="text-red-500 text-sm">{error}</span>}

      <form onSubmit={handleSubmit} className="grid gap-4 py-4">

        {/* Note Content */}
        <input type="text" placeholder="Note Title(optional)" value={formData.title} onChange={(e) => updateField("title", e.target.value)} className="w-full border px-3 py-2 rounded-md bg-white text-black" />
        <textarea
          placeholder="Write your note..."
          value={formData.content}
          onChange={(e) => updateField("content", e.target.value)}
          className="w-full border px-3 py-2 rounded-md bg-white text-black min-h-[120px]"
        />

        {/* Reminder Toggle */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <input
              type="checkbox"
              checked={formData.setReminder}
              onChange={(e) => updateField("setReminder", e.target.checked)}
            />
            <span className="ml-1">Set Reminder</span>
          </div>
          <div>
            <input type="checkbox" checked={formData.visibility === "public"} onChange={(e) => updateField("visibility", e.target.checked ? "public" : "private")} />
            <span className="ml-1">Publish Note (Public)</span>
          </div>
        </div>

        {/* Date Picker */}
        {formData.setReminder && (
          <CalendarPopover date={date} setDate={setDate} single={true} />
        )}

        {/* Actions */}
        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() =>
              setFormData({
                clientId,
                content: "",
                setReminder: false,
                reminderAt: null,
              })
            }
          >
            Reset
          </button>

          <button type="submit">
            {isEdit ? "Update Note" : "Create Note"}
          </button>
        </div>

      </form>
    </div>
  );
}