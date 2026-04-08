
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
import styles from '../../styles/components/form.module.css';
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

export default function ClientForm() {

  const [date, setDate] = useState(new Date());

  const form = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      priorityNeed: "",
      bedLabel: "",
      gender: "",
      status: "",
    },
    resolver: zodResolver(schema),
  });

  // handle form submission, creating client 
  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <DialogContent className={'bg-white, rounded-lg, shadow-lg, w-full, max-w-md, ' + styles.dialogContent}>
      <DialogHeader>
        <DialogTitle>Create Client</DialogTitle>
        <DialogDescription>
          Fill out the form below to create a new client.
        </DialogDescription>
      </DialogHeader>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <Field>
            <Input onChange={(e) => form.setValue("firstName", e.target.value)} placeholder="First Name" />
          </Field>
          <Field>
            <Input onChange={(e) => form.setValue("lastName", e.target.value)} placeholder="Last Name" />
          </Field>
          <Field>
            <Input onChange={(e) => form.setValue("clientId", e.target.value)} placeholder="Client ID" />
          </Field>

          <Field>
            <Select onValueChange={(value) => form.setValue("gender", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup label="Choose a gender">
                  <SelectItem value="male" onClick={() => form.setValue("gender", "male")}>Male</SelectItem>
                  <SelectItem value="female" onClick={() => form.setValue("gender", "female")}>Female</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Field>
            <Input onChange={(e) => form.setValue("priorityNeed", e.target.value)} placeholder="Priority Need" />
          </Field>

          <Field>
            <Input onChange={(e) => form.setValue("bedLabel", e.target.value)} placeholder="Bed Label" />
          </Field>

          <CalendarPopover date={date} setDate={setDate} />

          <Field>
            <Select onValueChange={(value) => form.setValue("status", value)}>
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
        <Field orientation="horizontal">
          <button type="button" onClick={() => form.reset()}>Reset</button>
          <button type="submit">Save</button>
        </Field>
      </form>
    </DialogContent>
  );
}