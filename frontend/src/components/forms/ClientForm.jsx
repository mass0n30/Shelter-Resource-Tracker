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
import { RotateCcw, Save, Trash2, Upload, UserRound, SmilePlus, ChevronDown } from "lucide-react";
import { redirect, useNavigate } from "react-router-dom";

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
    .max(20, { message: "Bed label is too long" })
    .optional()
    .or(z.literal("")),

  status: z.string().optional().or(z.literal("")),

  intakeDate: z.date().nullable().optional(),
  outtakeDate: z.date().nullable().optional(),
});

export default function ClientForm({
  authRouter,
  authRouterForm,
  clientData,
  firstName,
  lastName,
  fetchUpdatedData,
  setOpenForm,
  setSuccess,
}) {
  const today = new Date();
  const next60 = new Date(today.getTime() + 60 * 24 * 60 * 60 * 1000);

  const isEdit = !!clientData;

  const [error, setError] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const navigate = useNavigate();

  const [date, setDate] = useState({
    from: today,
    to: next60,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    clientId: "",
    priorityNeed: "",
    bedLabel: "",
    gender: "",
    status: "",
  });

  const updateField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (clientData) {
      setFormData({
        firstName: clientData.firstName || "",
        lastName: clientData.lastName || "",
        clientId: clientData.clientId ? String(clientData.clientId) : "",
        priorityNeed: clientData.priorityNeed || "",
        bedLabel: clientData.bedLabel || "",
        gender: clientData.gender || "",
        status: clientData.status || "",
      });

      setDate({
        from: clientData.intakeDate ? new Date(clientData.intakeDate) : null,
        to: clientData.outtakeDate ? new Date(clientData.outtakeDate) : null,
      });

      setAvatarPreview(clientData.avatarUrl || null);
      return;
    }

    setFormData((prev) => ({
      ...prev,
      firstName: firstName || "",
      lastName: lastName || "",
    }));
  }, [clientData, firstName, lastName]);

  const resetForm = () => {
    setError(null);
    setAvatarFile(null);

    if (isEdit && clientData) {
      setFormData({
        firstName: clientData.firstName || "",
        lastName: clientData.lastName || "",
        clientId: clientData.clientId ? String(clientData.clientId) : "",
        priorityNeed: clientData.priorityNeed || "",
        bedLabel: clientData.bedLabel || "",
        gender: clientData.gender || "",
        status: clientData.status || "",
      });

      setDate({
        from: clientData.intakeDate ? new Date(clientData.intakeDate) : null,
        to: clientData.outtakeDate ? new Date(clientData.outtakeDate) : null,
      });

      setAvatarPreview(clientData.avatarUrl || null);
      return;
    }

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

    setAvatarPreview(null);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const buildPayload = () => {
    return {
      ...formData,
      intakeDate: date?.from || null,
      outtakeDate: date?.to || null,
    };
  };

  const buildFormPayload = (payload) => {
    const data = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      if (value instanceof Date) {
        data.append(key, value.toISOString());
        return;
      }

      data.append(key, value);
    });

    if (avatarFile) {
      data.append("avatar", avatarFile);
    }

    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = buildPayload();

    const result = schema.safeParse(payload);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      const router = avatarFile && authRouterForm ? authRouterForm : authRouter;

      if (avatarFile) {
        const formPayload = buildFormPayload(payload);

        if (isEdit) {
          await router.patch(`/dashboard/clients/${clientData.id}`, formPayload);
        } else {
          await router.post("/dashboard/clients", formPayload);
        }
      } else {
        if (isEdit) {
          await authRouter.patch(`/dashboard/clients/${clientData.id}`, payload);
        } else {
          await authRouter.post("/dashboard/clients", payload);
        }
      }

      if (setOpenForm) {
        setOpenForm(null);
      }

      if (setSuccess) {
        setSuccess(isEdit ? "Client updated successfully!" : "Client created successfully!");
      }

      if (fetchUpdatedData) {
        await fetchUpdatedData();
      }
    } catch (error) {
      console.error(
        `Error ${isEdit ? "updating" : "creating"} client:`,
        error.response?.data || error.message
      );

      setError(
        `Something went wrong while ${isEdit ? "updating" : "creating"} the client.`
      );
    }
  };

  const handleDelete = async () => {
    if (!isEdit || !clientData?.id) return;

    const confirmed = window.confirm(
      `Delete ${clientData.firstName} ${clientData.lastName}? This cannot be undone.`
    );

    if (!confirmed) return;

    try {
      await authRouter.delete(`/dashboard/clients/${clientData.id}`);

      if (fetchUpdatedData) {
        await fetchUpdatedData();
      }

      if (setOpenForm) {
        setOpenForm(null);
      }
    } catch (error) {
      console.error("Error deleting client:", error.response?.data || error.message);
      setError("Something went wrong while deleting the client.");
    } finally {
      navigate("/dashboard");
    }
  };

  return (
    <DialogContent className="bg-background rounded-lg shadow-lg w-full max-w-md">
      <DialogHeader>
        <DialogTitle>{isEdit ? "Edit Client" : "Create Client"}</DialogTitle>

        <DialogDescription className="mt-2 flex items-center gap-2 text-sm text-muted">
          <UserRound className="h-4 w-4" />
          {isEdit
            ? "Update this client's profile information."
            : "Fill out the form below to create a new client."}
        </DialogDescription>
      </DialogHeader>

      {error && (
        <span className="mt-3 block text-sm text-red-500">
          {error}
        </span>
      )}

      <form onSubmit={handleSubmit} className="grid w-full gap-4 py-4">
        <FieldGroup>
          <Field>
            <div className="flex items-center justify-center gap-4 rounded-md border border-border bg-white px-3 py-3">
              <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-full border bg-background">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Client avatar preview"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <SmilePlus className="h-6 w-6 text-muted" />
                )}
              </div>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary hover:shadow-primaryGlow px-3 py-2 text-sm font-medium text-white transition">
                <Upload className="h-4 w-4" />
                Upload Image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarChange}
                  className="hidden"
                />
              </label>
            </div>
          </Field>

          <Field>
            <Input
              value={formData.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              placeholder="First Name"
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </Field>

          <Field>
            <Input
              value={formData.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              placeholder="Last Name"
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </Field>

          <Field>
            <Input
              value={formData.clientId}
              onChange={(e) => updateField("clientId", e.target.value)}
              placeholder="Client ID"
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field>
            <div className="relative">
              <select
                value={formData.gender}
                onChange={(e) => updateField("gender", e.target.value)}
                className="w-full appearance-none rounded-md border border-border bg-white px-3 py-2 pr-10 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            </div>
          </Field>
            <Field>
              <div className="relative">
                <select
                  value={formData.status}
                  onChange={(e) => updateField("status", e.target.value)}
                  className="w-full appearance-none rounded-md border border-border bg-white px-3 py-2 pr-10 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select Status</option>
                  <option value="ENROLLED">Enrolled</option>
                  <option value="WC">Winter Contingency</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="HOUSED">Housed</option>
                </select>

                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
              </div>
            </Field>
          </div>

          <Field>
            <Input
              value={formData.priorityNeed}
              onChange={(e) => updateField("priorityNeed", e.target.value)}
              placeholder="Priority Need"
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </Field>

          <Field>
            <Input
              value={formData.bedLabel}
              onChange={(e) => updateField("bedLabel", e.target.value)}
              placeholder="Bed Label"
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </Field>

          <div className="rounded-md border border-border bg-white px-3 py-2">
            <span className="mb-2 block text-sm text-muted text-center">Intake & Outtake Dates</span>
            <CalendarPopover date={date} setDate={setDate} />
          </div>
        </FieldGroup>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div>
            {isEdit && (
              <button
                type="button"
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            )}
          </div>

          <div className="flex w-full justify-between items-center gap-2">
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition hover:bg-primaryLight hover:text-primary"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:shadow-primaryGlow"
            >
              <Save className="h-4 w-4" />
              {isEdit ? "Update Client" : "Create Client"}
            </button>
          </div>
        </div>
      </form>
    </DialogContent>
  );
}