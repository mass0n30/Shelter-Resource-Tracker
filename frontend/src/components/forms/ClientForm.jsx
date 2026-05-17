import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import CalendarPopover from "../partials/Calender";
import { z } from "zod";

const schema = z.object({
  firstName: z
    .string({ required_error: "First name is required" })
    .trim()
    .min(2, { message: "First name must be at least 2 characters" })
    .max(100, { message: "First name is too long" }),

  lastName: z
    .string({ required_error: "Last name is required" })
    .trim()
    .min(2, { message: "Last name must be at least 2 characters" })
    .max(100, { message: "Last name is too long" }),

  clientId: z
    .string()
    .regex(/^\d+$/, "Client ID must be a number")
    .max(10, { message: "Client ID too long" })
    .optional()
    .or(z.literal("")),

  gender: z.string().optional().or(z.literal("")),

  priorityNeed: z
    .string()
    .max(255, { message: "Priority need is too long" })
    .optional()
    .or(z.literal("")),

  bedLabel: z
    .string()
    .trim()
    .max(5, { message: "Bed label is too long" })
    .optional()
    .or(z.literal("")),

  status: z.string().optional().or(z.literal("")),

  intakeDate: z.date().nullable().optional(),
  outtakeDate: z.date().nullable().optional(),
});

export default function ClientForm({
  authRouter,
  firstName,
  lastName,
  fetchUpdatedData,
  setOpenForm,
}) {
  const today = new Date();
  const next60 = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);

  const [date, setDate] = useState({
    from: today,
    to: next60,
  });

  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    clientId: "",
    priorityNeed: "",
    bedLabel: "",
    gender: "",
    status: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      firstName: firstName || "",
      lastName: lastName || "",
    }));
  }, [firstName, lastName]);

  const updateField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const resetForm = () => {
    setError(null);

    setDate({
      from: today,
      to: next60,
    });

    setFormData({
      firstName: firstName || "",
      lastName: lastName || "",
      clientId: "",
      priorityNeed: "",
      bedLabel: "",
      gender: "",
      status: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      intakeDate: date?.from || null,
      outtakeDate: date?.to || null,
    };

    const result = schema.safeParse(payload);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      await authRouter.post("/dashboard/clients", payload);

      if (fetchUpdatedData) {
        await fetchUpdatedData();
      }

      if (setOpenForm) {
        setOpenForm(null);
      }
    } catch (error) {
      console.error(
        "Error creating client:",
        error.response?.data || error.message
      );

      setError("Something went wrong while creating the client.");
    }
  };

  return (
    <DialogContent className="bg-background rounded-lg shadow-lg w-full max-w-md">
      <DialogHeader>
        <DialogTitle>Create Client</DialogTitle>

        <DialogDescription>
          Fill out the form below to create a new client.
        </DialogDescription>
      </DialogHeader>

      {error && (
        <span className="text-red-500 text-sm">
          Error was encountered: {error}
        </span>
      )}

      <form onSubmit={handleSubmit} className="grid w-full gap-4 py-4">
        <FieldGroup>
          <Field>
            <Input
              value={formData.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              placeholder="First Name"
            />
          </Field>

          <Field>
            <Input
              value={formData.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              placeholder="Last Name"
            />
          </Field>

          <Field>
            <Input
              value={formData.clientId}
              onChange={(e) => updateField("clientId", e.target.value)}
              placeholder="Client ID"
            />
          </Field>

          <Field>
            <select
              value={formData.gender}
              onChange={(e) => updateField("gender", e.target.value)}
              className="border px-3 py-2 rounded-lg bg-background text-muted w-full"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </Field>

          <Field>
            <Input
              value={formData.priorityNeed}
              onChange={(e) => updateField("priorityNeed", e.target.value)}
              placeholder="Priority Need"
            />
          </Field>

          <Field>
            <Input
              value={formData.bedLabel}
              onChange={(e) => updateField("bedLabel", e.target.value)}
              placeholder="Bed Label"
            />
          </Field>

          <CalendarPopover date={date} setDate={setDate} />

          <Field>
            <select
              value={formData.status}
              onChange={(e) => updateField("status", e.target.value)}
              className="w-full border px-3 py-2 rounded-lg bg-background text-muted"
              name="Select Status"
            >
              <option value="">Select Status</option>
              <option value="ENROLLED">Enrolled</option>
              <option value="WC">Winter Contingency (WC)</option>
            </select>
          </Field>
        </FieldGroup>

        <Field orientation="horizontal" className="justify-between space-x-2">
          <button
            type="button"
            onClick={resetForm}
            className="rounded-md px-3 py-2 text-sm text-muted hover:bg-primaryLight hover:text-primary"
          >
            Reset
          </button>

          <button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primaryDark"
          >
            Create Client
          </button>
        </Field>
      </form>
    </DialogContent>
  );
}