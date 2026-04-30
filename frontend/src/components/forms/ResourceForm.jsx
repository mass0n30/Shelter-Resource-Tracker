
import { useState, useEffect } from "react";
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
  followUpDate: z.date().nullable().optional(),
  isPriority: z.boolean().optional(),
  summary: z.string().optional(),
});

export default function ResourceForm({ authRouter, resourceData, fetchClientData }) {
  const [error, setError] = useState(null);
  const [date, setDate] = useState(null);

  const isEdit = !!resourceData;

  const [formData, setFormData] = useState({
    clientId: resourceData ? resourceData.clientId : null,
    organizationName: "",
    resourceType: "",
    purpose: "",
    status: "",
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

  useEffect(() => {
    if (resourceData) {
      setFormData({
        clientId: resourceData.clientId,
        organizationName: resourceData.organizationName || "",
        resourceType: resourceData.resourceType || "",
        purpose: resourceData.purpose || "",
        status: resourceData.status || "",
        roiSigned: resourceData.roiSigned || false,
        followUpDate: resourceData.followUpDate || null,
        isPriority: resourceData.isPriority || false,
        summary: resourceData.summary || "",
      });

      setDate(resourceData.followUpDate ? new Date(resourceData.followUpDate) : null);
    }
  }, [resourceData]);

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
        followUpDate: date || null,
      };

      if (isEdit) {
        await authRouter.patch(`/dashboard/referrals/${resourceData.id}`, payload);
      } else {
        await authRouter.post(`/dashboard/referrals/client/${clientId}`, payload);
      }

      await fetchClientData();

    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <div className="bg-background rounded-lg w-full max-w-md">
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          {isEdit ? "Edit Resource" : "Create Resource"}
        </h2>
      </div>

      {error && <span className="text-red-500 text-sm">{error}</span>}

      <form onSubmit={handleSubmit} className="grid gap-4">

        <input
          placeholder="Organization Name"
          value={formData.organizationName}
          onChange={(e) => updateField("organizationName", e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={formData.resourceType}
          onChange={(e) => updateField("resourceType", e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Resource Type</option>
          <option value="HOUSING">Housing</option>
          <option value="EMPLOYMENT">Employment</option>
          <option value="MEDICAL">Medical</option>
          <option value="SUBSTANCE_USE">Substance Use</option>
          <option value="FINANCIAL_ASSISTANCE">Financial Assistance</option>
          <option value="OTHER">Other</option>
        </select>

        <input
          placeholder="Purpose"
          value={formData.purpose}
          onChange={(e) => updateField("purpose", e.target.value)}
          className="border p-2 rounded"
        />

        <select
          value={formData.status}
          onChange={(e) => updateField("status", e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Select Status</option>
          <option value="INQUIRED">Inquired</option>
          <option value="REFERRED">Referred</option>
          <option value="PENDING">Pending</option>
          <option value="ENROLLED">Enrolled</option>
          <option value="COMPLETED">Completed</option>
          <option value="CLOSED">Closed</option>
        </select>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.roiSigned}
            onChange={(e) => updateField("roiSigned", e.target.checked)}
          />
          ROI Signed
        </label>

        <input
          type="date"
          value={date ? date.toISOString().split("T")[0] : ""}
          onChange={(e) => setDate(new Date(e.target.value))}
          className="border p-2 rounded"
        />

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={formData.isPriority}
            onChange={(e) => updateField("isPriority", e.target.checked)}
          />
          Priority
        </label>

        <input
          placeholder="Summary / Notes"
          value={formData.summary}
          onChange={(e) => updateField("summary", e.target.value)}
          className="border p-2 rounded"
        />

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={() =>
              setFormData({
                clientId,
                organizationName: "",
                resourceType: "",
                purpose: "",
                status: "",
                roiSigned: false,
                followUpDate: null,
                isPriority: false,
                summary: "",
              })
            }
          >
            Reset
          </button>

          <button type="submit">
            {isEdit ? "Update Resource" : "Create Resource"}
          </button>
        </div>

      </form>
    </div>
  );
}