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

export default function DropdownEditDelete({ resource, authRouter, fetchClientData, handleDelete }) {

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >      
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
          className="z-[9999] min-w-32 bg-white text-black border rounded-md shadow-lg"
        >

          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Edit
              </DropdownMenuItem>
            </DialogTrigger>

            <DialogContent className="bg-background text-foreground border rounded-lg shadow-lg p-6 w-full max-w-md">
              <VisuallyHidden>
                <DialogTitle></DialogTitle>
              </VisuallyHidden>
              <ResourceForm
                authRouter={authRouter}
                clientId={resource.clientId}
                resourceData={resource}
                fetchClientData={fetchClientData}
              />
            </DialogContent>
          </Dialog>

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
    </div>
  );
}

export function DropdownNoteEditDelete({ note, authRouter, fetchClientData, handleDelete }) {
  const id = note.id;

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
          className="z-[9999] min-w-32 bg-white text-black border rounded-md shadow-lg"
        >
          {/* EDIT */}
          <Dialog>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Edit
              </DropdownMenuItem>
            </DialogTrigger>

            <DialogContent>
              <DialogTitle>Edit Note</DialogTitle>

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
          variant="outline"
          className="flex w-full items-center gap-2"
        >
          <Funnel className="h-4 w-4" />
          <span className="text-muted-foreground">Filter</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="z-[9999] w-[var(--radix-dropdown-menu-trigger-width)] bg-white text-black border rounded-md shadow-lg"
      >
        <DropdownMenuItem onSelect={() => setViewedNotes({notes: globalNotes, filterMsg: "Posted Notes"})}>
          Posted Notes
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => setViewedNotes({notes: userNotes, filterMsg: "Personal Notes"})}>
          Personal Notes
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

import { Button } from "@/components/ui/button";
import {  Funnel } from 'lucide-react';


export function ClientDropDownFilter({ filter, setFilter }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="flex items-center gap-2"
        >
          <Funnel className="h-4 w-4" />
          Filter
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        sideOffset={6}
        className="min-w-[180px]"
      >
        <DropdownMenuItem
          onSelect={() => setFilter("ALL")}
          className={filter === "ALL" ? "bg-muted" : ""}
        >
          All Clients
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => setFilter("ENROLLED")}
          className={filter === "ENROLLED" ? "bg-muted" : ""}
        >
          Enrolled
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => setFilter("STAYED_OVERNIGHT")}
          className={filter === "STAYED_OVERNIGHT" ? "bg-muted" : ""}
        >
          Stayed Overnight
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => setFilter("WC")}
          className={filter === "WC" ? "bg-muted" : ""}
        >
          W.C.
        </DropdownMenuItem>

        <DropdownMenuItem
          onSelect={() => setFilter("INACTIVE")}
          className={filter === "INACTIVE" ? "bg-muted" : ""}
        >
          Inactive
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}