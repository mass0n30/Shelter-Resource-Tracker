
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectValue, SelectItem , SelectLabel} from "@/components/ui/select";
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field"
import CalendarPopover from "../partials/Calender";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// zod schema for form validation before req sent to backend, where validation chain is also implemented for security and data integrity
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
    .string({ required_error: "Client ID is required" })
    .regex(/^\d+$/, "Client ID must be a number")
    .min(1, { message: "Client ID is required" })
    .max(10, { message: "Client ID too long" }),

  priorityNeed: z
    .string({ required_error: "Priority need is required" })
    .min(1, { message: "Priority need is required" })
    .max(255, { message: "Priority need is too long" }),

  bedLabel: z
    .string({ required_error: "Bed label is required" })
    .trim()
    .min(1, { message: "Bed label is required" })
    .max(5, { message: "Bed label is too long" }),
});

export default function ClientForm({ authRouter, authRouterForm }) {

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
    intakeDate: date.from || null,
    outtakeDate: date.to || null,
    priorityNeed: "",
    bedLabel: "",
    gender: "",
    status: "",
  });

  // helper function to update form data state on input change
  const updateField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // handle form submission, creating client 
  const handleSubmit = async (e) => {
    e.preventDefault();

    // catching any validation errors before sending req to backend, where validation chain is also implemented for security and data integrity on backend
  const result = schema.safeParse(formData);

  if (!result.success) {
    setError(result.error.issues[0].message);
    return;
  }

    try {
      const response = await authRouter.post("/dashboard/clients", formData);

      console.log("Client created:", response.data);

    } catch (error) {
      console.error(
        "Error creating client:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <DialogContent className={'bg-background rounded-lg shadow-lg w-full max-w-md '}>
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
              <Input value={formData.firstName} onChange={(e) => updateField("firstName", e.target.value)} placeholder="First Name" />
            </Field>
            <Field>
              <Input value={formData.lastName} onChange={(e) => updateField("lastName", e.target.value)} placeholder="Last Name" />
            </Field>
            <Field>
              <Input value={formData.clientId} onChange={(e) => updateField("clientId", e.target.value)} placeholder="Client ID" />
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
            <Input value={formData.priorityNeed} onChange={(e) => updateField("priorityNeed", e.target.value)} placeholder="Priority Need" />
          </Field>

          <Field>
            <Input value={formData.bedLabel} onChange={(e) => updateField("bedLabel", e.target.value)} placeholder="Bed Label" />
          </Field>

          <CalendarPopover date={date} setDate={setDate} />

          <Field>
            <select
              value={formData.status || ""}
              onChange={(e) => updateField("status", e.target.value)}
              className="w-full border px-3 py-2 rounded-lg bg-background text-muted "
              name="Select Status"
            >
              <option value="">Select Status</option>
              <option value="ENROLLED">Enrolled</option>
              <option value="WC">Winter Contingency (WC)</option>
            </select>
          </Field>
        </FieldGroup>
        <Field orientation="horizontal" className="justify-around space-x-2">
          <button type="button" onClick={() => setFormData({
            firstName: "",
            lastName: "",
            clientId: "",
            priorityNeed: "",
            bedLabel: "",
            gender: "",
            status: "",
          })}>Reset</button>
          <button type="submit">Create Client</button>
        </Field>
      </form>
    </DialogContent>
  );
}