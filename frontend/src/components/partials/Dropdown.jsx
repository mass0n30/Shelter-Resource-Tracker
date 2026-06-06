import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import ResourceForm from "../forms/ResourceForm";
import NoteForm from "../forms/NoteForm";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription} from "@/components/ui/dialog";

import { Ellipsis } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, Settings, LogOut } from "lucide-react";

export function UserDropdown({ user }) {
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("usertoken");
    navigate("/login");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full sm:w-auto items-center border-b  rounded-none border-primary justify-between gap-3 bg-white px-4 py-3 text-xs font-semibold text-foreground transition hover:bg-primaryLight hover:text-primary"
        >
          <div className="flex items-center gap-3">
            {user?.avatar ? (
              <img
                className="h-9 w-9 object-cover"
                src={user.avatar}
                alt={`${user.firstName} ${user.lastName}`}
              />
            ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primaryLight text-xs font-bold text-primary">
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </div>
            )}
            <span className="whitespace-nowrap">
              {user ? `Welcome, ${user.firstName}` : "Guest"}
            </span>
          </div>

          <ChevronDown className="h-4 w-4 text-muted" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="z-[9999] w-[var(--radix-dropdown-menu-trigger-width)] rounded-md border border-border bg-white p-1 text-foreground shadow-lg"
      >
        <DropdownMenuItem
          onSelect={() => navigate("/dashboard/settings")}
          className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm text-muted transition focus:bg-primaryLight focus:text-primary"
        >
          <Settings className="h-4 w-4" />
          Settings
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={handleSignOut}
          className="flex w-full cursor-pointer items-center gap-2 rounded-sm px-3 py-2 text-sm text-red-500 transition focus:bg-red-50 focus:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default function DropdownEditDelete({
  resource,
  authRouter,
  fetchClientData,
  handleDelete,
}) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="bg-white text-foreground border rounded-lg px-3 py-1 shadow-sm hover:shadow-md transition"
            onClick={(e) => e.stopPropagation()}
          >
            <Ellipsis className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={6}
          className="min-w-32 bg-white text-black border rounded-md shadow-lg"
        >
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setEditOpen(true);
            }}
          >
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(e) => {
              e.stopPropagation();
              handleDelete(e, resource.id);
            }}
            className="text-red-500 focus:text-red-500"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="z-[200] bg-background text-foreground border rounded-lg shadow-lg p-6 w-full max-w-md">
          <VisuallyHidden>
            <DialogTitle>Edit Resource</DialogTitle>
          </VisuallyHidden>

          <ResourceForm
            authRouter={authRouter}
            clientId={resource.clientId}
            resourceData={resource}
            fetchClientData={fetchClientData}
            setOpenForm={setEditOpen}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function DropdownNoteEditDelete({ note, authRouter, fetchClientData, handleDelete }) {
  const id = note.id;
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="bg-white text-foreground border rounded-lg px-3 py-1 shadow-sm hover:shadow-md transition"
            onClick={(e) => e.stopPropagation()}
          >
            <Ellipsis className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={6}
          className="min-w-32 bg-white text-black border rounded-md shadow-lg"
        >
          {/* EDIT */}
          <Dialog open={editOpen} onOpenChange={setEditOpen}>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Edit
              </DropdownMenuItem>
            </DialogTrigger>

            <DialogContent>
              <DialogTitle></DialogTitle>

              <NoteForm
                authRouter={authRouter}
                clientId={note.clientId}
                noteData={note}
                fetchClientData={fetchClientData}
              />
            </DialogContent>
          </Dialog>

          {/* DELETE */}
          <DropdownMenuItem
            onSelect={(e) => handleDelete(e, id)}
            className="text-red-500 focus:text-red-500"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function DropdownNoteFilter({ setViewedNotes, noteMsg, userNotes, globalNotes }) {
  return (
    <DropdownMenu className="z-[9999] w-full">
      <DropdownMenuTrigger asChild>
        <Button
          className="flex w-full items-center gap-2 rounded-xl bg-white text-foreground border px-3 py-1 shadow-sm hover:shadow-md transition"
        >
          <Funnel className="h-4 w-4" />
          <span className="text-muted-foreground">Filter</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="z-[9999] w-[var(--radix-dropdown-menu-trigger-width)] text-black border rounded-md shadow-lg"
      >
        <DropdownMenuItem 
        className={noteMsg === "Posted Notes" ? "bg-primary text-white" : ""}
        onSelect={() => setViewedNotes({notes: globalNotes, filterMsg: "Posted Notes"})}>
          Posted Notes
        </DropdownMenuItem>
        <DropdownMenuItem 
        className={noteMsg === "Personal Notes" ? "bg-primary text-white" : ""}
        onSelect={() => setViewedNotes({notes: userNotes.filter(note => !note.completed), filterMsg: "Personal Notes"})}>
          Personal Notes
        </DropdownMenuItem>
        <DropdownMenuItem
          className={noteMsg === "Completed Notes" ? "bg-primary text-white" : ""}
          onSelect={() => setViewedNotes({notes: userNotes.filter(note => note.completed === true), filterMsg: "Completed Notes"})}>
          Completed Notes
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { Button } from "../partials/Button";
import {  Funnel } from 'lucide-react';


export function ClientDropDownFilter({ filter, fetchClients }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          className="flex rounded-xl items-center gap-2"
        >
          <Funnel className="h-4 w-4" />
          Filter
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="min-w-[200px] bg-white text-black border rounded-md shadow-lg"
      >
        <DropdownMenuItem
          onSelect={() => fetchClients("ALL")}
          className={filter === "ALL" ? "bg-primary text-white" : ""}
        >
          All Clients
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => fetchClients("ENROLLED")}
          className={filter === "ENROLLED" ? "bg-primary text-white" : ""}
        >
          Enrolled
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => fetchClients("STAYED_OVERNIGHT")}
          className={filter === "STAYED_OVERNIGHT" ? "bg-primary text-white" : ""}
        >
          Stayed Overnight
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => fetchClients("WC")}
          className={filter === "WC" ? "bg-primary text-white" : ""}
        >
          Winter Contingency
        </DropdownMenuItem>
        <DropdownMenuItem
          onSelect={() => fetchClients("HOUSED")}
          className={filter === "HOUSED" ? "bg-primary text-white" : ""}
        >
          Housed
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => fetchClients("INACTIVE")}
          className={filter === "INACTIVE" ? "bg-primary text-white" : ""}
        >
          Inactive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}