
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectContent, SelectGroup, SelectValue, SelectItem } from "@/components/ui/select";
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
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  clientId: z.string().min(1).max(10),
  priorityNeed: z.string().min(1).max(255),
  bedLabel: z.string().min(1).max(5),
});

export default function ClientForm({ authRouter, authRouterForm }) {

  const [date, setDate] = useState(new Date());

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    clientId: "",
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

    try {
      const response = await authRouter.post("/clients", formData);

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
              <Select value={formData.gender} onValueChange={(value) => updateField("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup label="Choose a gender">
                    <SelectItem value="male" onClick={() => updateField("gender", "male")}>Male</SelectItem>
                    <SelectItem value="female" onClick={() => updateField("gender", "female")}>Female</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          <Field>
            <Input value={formData.priorityNeed} onChange={(e) => updateField("priorityNeed", e.target.value)} placeholder="Priority Need" />
          </Field>

          <Field>
            <Input value={formData.bedLabel} onChange={(e) => updateField("bedLabel", e.target.value)} placeholder="Bed Label" />
          </Field>

          <CalendarPopover date={date} setDate={setDate} />

          <Field>
            <Select value={formData.status} onValueChange={(value) => updateField("status", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="ENROLLED">Enrolled</SelectItem>
                  <SelectItem value="WC">Winter Contingency (WC)</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="ARCHIVED">Archived</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
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