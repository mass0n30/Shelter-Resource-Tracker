import { useState, useEffect } from "react";
import { z } from "zod";
import { Handshake, RotateCcw, Save } from "lucide-react";
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import CalendarPopover from "../partials/Calender";

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

export default function ResourceForm({
  authRouter,
  clientId,
  resourceData,
  fetchClientData,
  setOpenForm,
}) {
  const [error, setError] = useState(null);
  const [date, setDate] = useState(null);

  const isEdit = !!resourceData;

  const [formData, setFormData] = useState({
    clientId: resourceData ? resourceData.clientId : clientId,
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

  const resetForm = () => {
    setDate(null);
    setError(null);

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
    });
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

      setDate(
        resourceData.followUpDate ? new Date(resourceData.followUpDate) : null
      );
    }
  }, [resourceData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...formData,
      followUpDate: date || null,
    };

    const result = schema.safeParse(payload);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      if (isEdit) {
        await authRouter.patch(`/dashboard/referrals/${resourceData.id}`, payload);
      } else {
        await authRouter.post(`/dashboard/referrals/client/${clientId}`, payload);
      }

      await fetchClientData();

      if (setOpenForm) {
        setOpenForm(null);
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError("Something went wrong while saving this resource.");
    }
  };

  return (
    <div className="bg-background rounded-lg w-full max-w-md">
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit Resource" : "Create Resource"}</DialogTitle>

        <DialogDescription className="mt-2 flex items-center gap-2 text-sm text-muted">
          <Handshake className="h-4 w-4" />
          {isEdit
            ? "Update this client resource referral."
            : "Add a new resource referral for this client."}
        </DialogDescription>
      </DialogHeader>

      {error && (
        <span className="mt-3 block text-sm text-red-500">{error}</span>
      )}

      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <input
          placeholder="Organization Name"
          value={formData.organizationName}
          onChange={(e) => updateField("organizationName", e.target.value)}
          className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />

        <select
          value={formData.resourceType}
          onChange={(e) => updateField("resourceType", e.target.value)}
          className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-muted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
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
          className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />

        <select
          value={formData.status}
          onChange={(e) => updateField("status", e.target.value)}
          className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-muted outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="">Select Status</option>
          <option value="INQUIRED">Inquired</option>
          <option value="REFERRED">Referred</option>
          <option value="PENDING">Pending</option>
          <option value="ENROLLED">Enrolled</option>
          <option value="COMPLETED">Completed</option>
          <option value="CLOSED">Closed</option>
        </select>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="flex items-center justify-between rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground">
            <span>ROI Signed</span>
            <input
              type="checkbox"
              checked={formData.roiSigned}
              onChange={(e) => updateField("roiSigned", e.target.checked)}
            />
          </label>

          <label className="flex items-center justify-between rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground">
            <span>Priority</span>
            <input
              type="checkbox"
              checked={formData.isPriority}
              onChange={(e) => updateField("isPriority", e.target.checked)}
            />
          </label>
        </div>
        <CalendarPopover date={date} setDate={setDate} single={true} />
        <textarea
          placeholder="Summary / Notes"
          value={formData.summary}
          onChange={(e) => updateField("summary", e.target.value)}
          className="min-h-[90px] w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />

        <div className="mt-4 flex justify-between">
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-white transition hover:bg-primaryLight hover:text-primary"
          >
            <RotateCcw className="h-4 w-4" />
            Reset
          </button>

          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primaryDark"
          >
            <Save className="h-4 w-4" />
            {isEdit ? "Update Resource" : "Create Resource"}
          </button>
        </div>
      </form>
    </div>
  );
}