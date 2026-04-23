
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  organizationName: z.string().min(1, "Organization required").max(255),
  resourceType: z.string().min(1, "Resource type required"),
  purpose: z.string().optional(),

  status: z.string().optional(),

  roiSigned: z.boolean().optional(),
  followUpDate: z.date().optional(),

  isPriority: z.boolean().optional(),
  summary: z.string().optional(),
});

export default function ResourceForm({ authRouter, clientId }) {
  const [error, setError] = useState(null);

  const [date, setDate] = useState(null);

  const [formData, setFormData] = useState({
    clientId,
    organizationName: "",
    resourceType: "",
    purpose: "",
    status: "INQUIRED",

    roiSigned: false,
    followUpDate: null,

    isPriority: false,
    summary: "",
  });

  const updateField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = schema.safeParse({
      ...formData,
      followUpDate: date || null,
    });

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      const payload = {
        ...formData,
        followUpDate: date?.from || null,
      };

      const response = await authRouter.post(`/dashboard/referrals/client/${clientId}`, payload);

      console.log("Resource created:", response.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <DialogContent className="bg-background rounded-lg shadow-lg w-full max-w-md">
      <DialogHeader>
        <DialogTitle>Create Resource</DialogTitle>
        <DialogDescription>
          Add a referral/resource for this client.
        </DialogDescription>
      </DialogHeader>

      {error && <span className="text-red-500 text-sm">{error}</span>}

      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <FieldGroup>

          <Field>
            <Input
              placeholder="Organization Name"
              value={formData.organizationName}
              onChange={(e) => updateField("organizationName", e.target.value)}
            />
          </Field>

          <Field>
            <Input
              placeholder="Resource Type (Housing, Job, Medical...)"
              value={formData.resourceType}
              onChange={(e) => updateField("resourceType", e.target.value)}
            />
          </Field>

          <Field>
            <Input
              placeholder="Purpose"
              value={formData.purpose}
              onChange={(e) => updateField("purpose", e.target.value)}
            />
          </Field>

          {/* Status */}
          <Field>
            <select
              value={formData.status}
              onChange={(e) => updateField("status", e.target.value)}
              className="w-full border px-3 py-2 rounded-lg bg-background"
            >
              <option value="INQUIRED">Inquired</option>
              <option value="REFERRED">Referred</option>
              <option value="PENDING">Pending</option>
              <option value="ENROLLED">Enrolled</option>
              <option value="COMPLETED">Completed</option>
              <option value="CLOSED">Closed</option>
            </select>
          </Field>

          {/* ROI */}
          <Field>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.roiSigned}
                onChange={(e) => updateField("roiSigned", e.target.checked)}
              />
              ROI Signed
            </label>
          </Field>

          {/* Follow-up Date */}
          <CalendarPopover date={date} setDate={setDate} single={true} />

          {/* Priority */}
          <Field>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isPriority}
                onChange={(e) => updateField("isPriority", e.target.checked)}
              />
              Priority
            </label>
          </Field>

          <Field>
            <Input
              placeholder="Summary / Notes"
              value={formData.summary}
              onChange={(e) => updateField("summary", e.target.value)}
            />
          </Field>

        </FieldGroup>

        <Field orientation="horizontal" className="justify-around">
          <button
            type="button"
            onClick={() =>
              setFormData({
                organizationName: "",
                resourceType: "",
                purpose: "",
                status: "INQUIRED",
                roiSigned: false,
                followUpDate: null,
                isPriority: false,
                summary: "",
                clientId,
              })
            }
          >
            Reset
          </button>

          <button type="submit">Create Resource</button>
        </Field>
      </form>
    </DialogContent>
  );
}