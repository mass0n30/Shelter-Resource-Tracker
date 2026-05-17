import { useState, useEffect } from "react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Notebook, RotateCcw, Save } from "lucide-react";
import CalendarPopover from "../partials/Calender";
import { z } from "zod";

const schema = z.object({
  content: z.string().min(1, "Note content is required"),
  title: z.string().max(20, "Title too long").optional(),
  setReminder: z.boolean().optional(),
  reminderAt: z.date().nullable().optional(),
});

export default function NoteForm({
  authRouter,
  clientId,
  noteData,
  fetchUpdatedData,
  setOpenForm,
}) {
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

  const resetForm = () => {
    setError(null);
    setDate(null);

    setFormData({
      clientId,
      content: "",
      title: "",
      setReminder: false,
      reminderAt: null,
      visibility: "private",
    });
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

      if (setOpenForm) {
        setOpenForm(null);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Something went wrong while saving this note.");
    }
  };

  return (
    <div className="bg-background rounded-lg w-full max-w-md">
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit Note" : "Create Note"}</DialogTitle>

        <DialogDescription className="mt-2 flex items-center gap-2 text-sm text-muted">
          <Notebook className="h-4 w-4" />
          {isEdit
            ? "Update this note."
            : `Add a note ${clientId ? "for this client" : "to the dashboard"}.`}
        </DialogDescription>
      </DialogHeader>

      {error && (
        <span className="mt-3 block text-sm text-red-500">{error}</span>
      )}

      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <input
          type="text"
          placeholder="Note Title (optional)"
          value={formData.title}
          onChange={(e) => updateField("title", e.target.value)}
          className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />

        <textarea
          placeholder="Write your note..."
          value={formData.content}
          onChange={(e) => updateField("content", e.target.value)}
          className="min-h-[120px] w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex items-center justify-between rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground">
            <span>Set Reminder</span>
            <input
              type="checkbox"
              checked={formData.setReminder}
              onChange={(e) => updateField("setReminder", e.target.checked)}
            />
          </label>

          <label className="flex items-center justify-between rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground">
            <span>Publish Note</span>
            <input
              type="checkbox"
              checked={formData.visibility === "public"}
              onChange={(e) =>
                updateField("visibility", e.target.checked ? "public" : "private")
              }
            />
          </label>
        </div>

        {formData.setReminder && (
          <div className="rounded-md border border-border bg-white px-3 py-2">
            <CalendarPopover date={date} setDate={setDate} single={true} />
          </div>
        )}

        <div className="mt-4 flex justify-between">
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted transition hover:bg-primaryLight hover:text-primary"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primaryDark"
          >
            <Save className="h-4 w-4" />
            {isEdit ? "Update Note" : "Create Note"}
          </button>
        </div>
      </form>
    </div>
  );
}