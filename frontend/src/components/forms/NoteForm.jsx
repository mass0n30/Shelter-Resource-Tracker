
import { useState } from "react";
import { z } from "zod";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import CalendarPopover from "@/components/partials/Calender";

const schema = z.object({
  content: z.string().min(1, "Note content is required").max(2000),
  setReminder: z.boolean().optional(),
  reminderAt: z.date().optional(),
});

export default function NoteForm({ authRouter, clientId }) {
  const [error, setError] = useState(null);

  const [date, setDate] = useState(null);

  const [formData, setFormData] = useState({
    clientId,
    content: "",
    setReminder: false,
    reminderAt: null,
  });

  const updateField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

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
      const response = await authRouter.post("/dashboard/notes", payload);
      console.log("Note created:", response.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <DialogContent className="bg-background rounded-lg shadow-lg w-full max-w-md">
      <DialogHeader>
        <DialogTitle>Create Note</DialogTitle>
        <DialogDescription>
          Add a note {clientId ? "for this client" : "to the dashboard"}.
        </DialogDescription>
      </DialogHeader>

      {error && <span className="text-red-500 text-sm">{error}</span>}

      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        
        {/* Note Content */}
        <Field>
          <textarea
            placeholder="Write your note..."
            value={formData.content}
            onChange={(e) => updateField("content", e.target.value)}
            className="w-full border px-3 py-2 rounded-md bg-white text-black min-h-[120px]"
          />
        </Field>

        {/* Reminder Toggle */}
        <Field>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.setReminder}
              onChange={(e) => updateField("setReminder", e.target.checked)}
            />
            <span>Set Reminder</span>
          </div>
        </Field>

        {/* Date Picker (only if reminder enabled) */}
        {formData.setReminder && (
          <CalendarPopover date={date} setDate={setDate} single={true} />
        )}

        {/* Actions */}
        <Field orientation="horizontal" className="justify-around">
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

          <button type="submit">Create Note</button>
        </Field>
      </form>
    </DialogContent>
  );
}