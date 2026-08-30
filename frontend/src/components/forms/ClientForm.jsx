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
import { RotateCcw, Check, Save, Trash2, Upload, UserRound, SmilePlus, ChevronDown } from "lucide-react";
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
  const isEdit = !!clientData;

  const recentEnrollmentDate =
    clientData?.EnrollmentDates?.filter(
      (enrollmentDate) => enrollmentDate.type === "INTAKE"
    )?.[0]?.date;

  const baseDate =
    isEdit && recentEnrollmentDate
      ? new Date(recentEnrollmentDate)
      : new Date();

  const next90 = new Date(
    baseDate.getTime() + 90 * 24 * 60 * 60 * 1000
  );

  const today = new Date();

  const [error, setError] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const navigate = useNavigate();

  const [date, setDate] = useState({
    from: isEdit ? baseDate : today,
    to: next90,
  });

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    clientId: "",
    priorityNeed: "",
    bedLabel: "",
    gender: "",
    status: "",
    extensionStatus: false,
  });

  const updateField = (key, value) => {
    setFormData((previousFormData) => ({
      ...previousFormData,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (clientData) {
      setFormData({
        firstName: clientData.firstName || "",
        lastName: clientData.lastName || "",
        clientId: clientData.clientId
          ? String(clientData.clientId)
          : "",
        priorityNeed: clientData.priorityNeed || "",
        bedLabel: clientData.bedLabel || "",
        gender: clientData.gender || "",
        status: clientData.status || "",
        extensionStatus: Boolean(clientData.extensionStatus),
      });

      setDate({
        from: clientData.intakeDate
          ? new Date(clientData.intakeDate)
          : null,
        to: clientData.outtakeDate
          ? new Date(clientData.outtakeDate)
          : null,
      });

      setAvatarPreview(clientData.avatarUrl || null);
      return;
    }

    setFormData((previousFormData) => ({
      ...previousFormData,
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
        clientId: clientData.clientId
          ? String(clientData.clientId)
          : "",
        priorityNeed: clientData.priorityNeed || "",
        bedLabel: clientData.bedLabel || "",
        gender: clientData.gender || "",
        status: clientData.status || "",
        extensionStatus: Boolean(clientData.extensionStatus),
      });

      setDate({
        from: clientData.intakeDate
          ? new Date(clientData.intakeDate)
          : null,
        to: clientData.outtakeDate
          ? new Date(clientData.outtakeDate)
          : null,
      });

      setAvatarPreview(clientData.avatarUrl || null);
      return;
    }

    setDate({
      from: today,
      to: next90,
    });

    setFormData({
      firstName: firstName || "",
      lastName: lastName || "",
      clientId: "",
      priorityNeed: "",
      bedLabel: "",
      gender: "",
      status: "",
      extensionStatus: false,
    });

    setAvatarPreview(null);
  };

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];

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

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = buildPayload();
    const result = schema.safeParse(payload);

    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    try {
      const router =
        avatarFile && authRouterForm
          ? authRouterForm
          : authRouter;

      if (avatarFile) {
        const formPayload = buildFormPayload(payload);

        if (isEdit) {
          await router.patch(
            `/dashboard/clients/${clientData.id}`,
            formPayload
          );
        } else {
          await router.post("/dashboard/clients", formPayload);
        }
      } else if (isEdit) {
        await authRouter.patch(
          `/dashboard/clients/${clientData.id}`,
          payload
        );
      } else {
        await authRouter.post("/dashboard/clients", payload);
      }

      if (setOpenForm) {
        setOpenForm(null);
      }

      if (setSuccess) {
        setSuccess(
          isEdit
            ? "Client updated successfully!"
            : "Client created successfully!"
        );
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
        `Something went wrong while ${
          isEdit ? "updating" : "creating"
        } the client.`
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
      await authRouter.delete(
        `/dashboard/clients/${clientData.id}`
      );

      if (fetchUpdatedData) {
        await fetchUpdatedData();
      }

      if (setOpenForm) {
        setOpenForm(null);
      }
    } catch (error) {
      console.error(
        "Error deleting client:",
        error.response?.data || error.message
      );

      setError(
        "Something went wrong while deleting the client."
      );
    } finally {
      navigate("/dashboard");
    }
  };

  return (
    <DialogContent className="w-[calc(100vw-2rem)] max-w-lg max-h-[90vh] overflow-y-auto w-full rounded-lg bg-white shadow-lg">
      <DialogHeader>
        <DialogTitle>
          {isEdit ? "Edit Client" : "Create Client"}
        </DialogTitle>

        <DialogDescription className="mt-2 flex w-full items-center justify-center gap-2 text-sm text-muted">
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

      <form
        onSubmit={handleSubmit}
        className="grid w-full gap-4 py-4"
      >
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

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white transition hover:shadow-primaryGlow">
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
              onChange={(event) =>
                updateField("firstName", event.target.value)
              }
              placeholder="First Name"
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </Field>

          <Field>
            <Input
              value={formData.lastName}
              onChange={(event) =>
                updateField("lastName", event.target.value)
              }
              placeholder="Last Name"
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </Field>

          <Field>
            <Input
              value={formData.clientId}
              onChange={(event) =>
                updateField("clientId", event.target.value)
              }
              placeholder="Client ID"
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field>
              <div className="relative">
                <select
                  value={formData.gender}
                  onChange={(event) =>
                    updateField("gender", event.target.value)
                  }
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
                  onChange={(event) =>
                    updateField("status", event.target.value)
                  }
                  className="w-full appearance-none rounded-md border border-border bg-white px-3 py-2 pr-10 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">Select Status</option>
                  <option value="ENROLLED">Enrolled</option>
                  <option value="WC">
                    Winter Contingency
                  </option>
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
              onChange={(event) =>
                updateField("priorityNeed", event.target.value)
              }
              placeholder="Priority Need"
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </Field>

          <Field>
            <Input
              value={formData.bedLabel}
              onChange={(event) =>
                updateField("bedLabel", event.target.value)
              }
              placeholder="Bed Label"
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </Field>

        <div className="rounded-lg border border-border bg-white p-3">
          <span className="mb-3 block text-center text-sm font-medium text-muted">
            Intake & Outtake Dates
          </span>

          <div className="flex items-center gap-3">
            <div className="min-w-0 flex-1">
              <CalendarPopover
                date={date}
                setDate={setDate}
              />
            </div>

            <label
              className={`flex h-10 shrink-0 cursor-pointer items-center gap-2 rounded-md border px-3 transition-colors ${
                formData.extensionStatus
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border bg-white text-foreground hover:bg-muted/50"
              }`}
            >
              <input
                type="checkbox"
                checked={formData.extensionStatus}
                onChange={(event) =>
                  updateField("extensionStatus", event.target.checked)
                }
                className="sr-only"
              />

              <span
                className={`flex h-5 w-5 items-center justify-center rounded border-2 transition-colors ${
                  formData.extensionStatus
                    ? "border-primary bg-primary"
                    : "border-border bg-white"
                }`}
              >
                {formData.extensionStatus && (
                  <Check className="h-3.5 w-3.5 text-white" />
                )}
              </span>

              <span className="whitespace-nowrap text-sm font-medium">
                Extension
              </span>
            </label>
          </div>
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

          <div className="flex w-full items-center justify-between gap-2">
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


function ClientFormAdditional({
  authRouter,
  clientData,
  fetchUpdatedData,
  setOpenForm,
  setSuccess,
}) {

  const [formData, setFormData] = useState({
    dob: clientData.dob || "",
    age: clientData.age || "",
    phone: clientData.phone || "",
    email: clientData.email || "",
  });

  const updateField = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  const handleEdit = (e) => {
    e.preventDefault();


    authRouter
      .patch(`/dashboard/clients/${clientData.id}/additional`, formData)
      .then(() => {
        if (setOpenForm) {
          setOpenForm(null);
        }

        if (setSuccess) {
          setSuccess("Client updated successfully!");
        }

        if (fetchUpdatedData) {
          fetchUpdatedData();
        }
      })
      .catch((error) => {
        console.error("Error updating client:", error.response?.data || error.message);
        alert("Something went wrong while updating the client.");
      });
  };

  return (
    <DialogContent className="bg-background rounded-lg shadow-lg w-full max-w-md">
      <DialogHeader>
        <DialogTitle>Edit Additional Client Info</DialogTitle>

        <DialogDescription className="mt-2 flex w-full justify-center items-center gap-2 text-sm text-muted">
          <UserRound className="h-4 w-4" />
          Update this client&apos;s additional profile information.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={handleEdit} className="grid w-full gap-4 py-4">
        <FieldGroup>
          <Field>
            <Input
              value={formData?.dob || ""}
              onChange={(e) => updateField("dob", e.target.value)}
              placeholder="DOB (MM/DD/YYYY)"
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </Field>

          <Field>
            <Input
              value={formData?.dob ? Math.floor((new Date() - new Date(formData.dob)) / (365.25 * 24 * 60 * 60 * 1000)) : ""}
              onChange={(e) => updateField("age", e.target.value)}
              placeholder="Age"
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </Field>

          <Field>
            <Input
              value={formData?.phone || ""}
              onChange={(e) => updateField("phone", e.target.value)}
              placeholder="Phone Number"
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </Field>

          <Field>
            <Input
              value={formData?.email || ""}
              onChange={(e) => updateField("email", e.target.value)}
              placeholder="Email Address"
              className="w-full rounded-md border border-border bg-white px-3 py-2 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </Field>
        </FieldGroup>                             

        <div className="mt-4 flex w-full justify-end items-center gap-2">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition hover:shadow-primaryGlow"
          >
            <Save className="h-4 w-4" />
            Update Client
          </button>
        </div>
      </form>
    </DialogContent>
  );
}

export { ClientForm, ClientFormAdditional };