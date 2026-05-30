import { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Button } from "@base-ui/react";
import NoteForm from "../components/forms/NoteForm";
import ResourceForm from "../components/forms/ResourceForm";
import ClientForm from "@/components/forms/ClientForm";
import DropdownEditDelete from "../components/partials/Dropdown";
import { DropdownNoteEditDelete } from "../components/partials/Dropdown";
import ClientProfileSkeleton from "@/components/partials/loaderSkeleton/ClientProfileLoader";
import { useAsyncStatus, loaderTimer } from "@/components/partials/Loading";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import {
  Ellipsis,
  TriangleAlert,
  ArrowLeft,
  LucideBedDouble,
  Plus,
  FilePlus,
  HashIcon,
  UserRoundPen,
  Calendar,
  Calendar1Icon,
  History,
  FolderSearch,
} from "lucide-react";
import { RESOURCE_CONFIG , getClientReferralStats} from "../lib/utils";

export default function ClientProfile() {
  const { clientId } = useParams();
  const [clientData, setClientData] = useState(null);
  const [clientStats, setClientStats] = useState(null);
  const [activeSection, setActiveSection] = useState("resources");

  const { authRouter } = useOutletContext();

  const { error, setError, success, setSuccess, loading, setLoadingDuration, setLoading } = useAsyncStatus();

  const fetchClientData = async (success) => {
    try {
      const response = await authRouter.get(`/dashboard/clients/${clientId}`);
      console.log("Fetched client data:", response.data);
      const getClientStats = getClientReferralStats(response.data);
      setClientData(response.data);
      setClientStats(getClientStats);

      if (success) {
        setSuccess(true);
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
    } 
  };

  // fetching upon mount
  useEffect(() => {
    try {
      setLoading(true);
      fetchClientData();
    } catch (err) {
      console.error("Error fetching client data:", err);
    } 
  }, [clientId]);

  if (!clientData || loading) {
    return <ClientProfileSkeleton />;
  }

  return (
    <div className="flex-1 flex w-full flex-col overflow-hidden bg-background">
      <Banner
        clientData={clientData}
        authRouter={authRouter}
        fetchClientData={fetchClientData}
        className="shrink-0 w-full bg-backgroundAlt min-h-[120px] border-b"
      />

      <div className="mx-auto grid min-h-0 w-full max-w-7xl flex-1 grid-cols-1 gap-4 overflow-hidden p-4 md:grid-cols-4">
        <ClientInfoSectionToggle
          clientData={clientData}
          authRouter={authRouter}
          fetchClientData={fetchClientData}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          className="md:col-span-3"
        />

        <Information
          clientData={clientData}
          fetchUpdatedData={fetchClientData}
          authRouter={authRouter}
          className="min-h-0 overflow-y-auto md:col-span-1"
        />
      </div>
    </div>
  );
}

function ClientInfoSectionToggle({
  clientData,
  authRouter,
  fetchClientData,
  activeSection,
  setActiveSection,
  className,
}) {

  return (
    <div
      className={`flex min-h-0 flex-col overflow-hidden rounded-md bg-white p-4 ${className}`}
    >
      <div className="mb-4 flex shrink-0 flex-wrap gap-2 md:gap-4">
        <button
          onClick={() => setActiveSection("resources")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs md:text-sm font-semibold transition ${
            activeSection === "resources"
              ? "bg-primary text-white shadow-sm"
              : "bg-white text-muted border border-border hover:bg-primaryLight hover:text-primary"
          }`}
        >
          <FolderSearch className="h-4 w-4" />
          Resources
        </button>

        <button
          onClick={() => setActiveSection("notes")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs md:text-sm font-semibold transition ${
            activeSection === "notes"
              ? "bg-primary text-white shadow-sm"
              : "bg-white text-muted border border-border hover:bg-primaryLight hover:text-primary"
          }`}
        >
          <NotebookText className="h-4 w-4" />
          Notes
        </button>

        <button
          onClick={() => setActiveSection("timeline")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-xs md:text-sm font-semibold transition ${
            activeSection === "timeline"
              ? "bg-primary text-white shadow-sm"
              : "bg-white text-muted border border-border hover:bg-primaryLight hover:text-primary"
          }`}
        >
          <History className="h-4 w-4" />
          Timeline
        </button>
      </div>

      <div className="min-h-0 max-h-[calc(120vh-200px)] flex-1 overflow-y-auto pr-1">
        {activeSection === "resources" && (
          <Resources
            fetchClientData={fetchClientData}
            referrals={clientData.referrals}
            authRouter={authRouter}
          />
        )}

        {activeSection === "notes" && (
          <Notes
            fetchClientData={fetchClientData}
            notes={clientData.notes}
            authRouter={authRouter}
          />
        )}

        {activeSection === "timeline" && (
          <Timeline
            fetchClientData={fetchClientData}
            clientId={clientData.id}
            authRouter={authRouter}
            clientData={clientData}
          />
        )}
      </div>
    </div>
  );
}

function Banner({ clientData, className, authRouter, fetchClientData }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="max-w-7xl flex-1 flex items-center justify-between gap-4 px-4">
        <div className="min-w-0 flex items-center gap-4">
          
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-xs font-medium text-muted transition bg-transparent hover:bg-primaryLight hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primaryLight text-sm font-semibold text-primary sm:h-12 sm:w-12">
              {clientData?.avatarUrl ? (
                <img
                  src={clientData.avatarUrl}
                  alt={`${clientData.firstName} ${clientData.lastName}`}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span>
                  {clientData?.firstName?.charAt(0)}
                  {clientData?.lastName?.charAt(0)}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="truncate text-base font-semibold text-foreground/90 sm:text-lg">
                  {clientData.firstName} {clientData.lastName}
                </h1>

                <span className="rounded-full bg-backgroundAlt px-2 py-0.5 text-[11px] font-medium text-muted border border-border">
                  {clientData.status}
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted">
                <span className="inline-flex items-center gap-1">
                  <LucideBedDouble className="h-3.5 w-3.5" />
                  {clientData.bedLabel || "No bed"}
                </span>

                <span className="inline-flex items-center gap-1">
                  <HashIcon className="h-3.5 w-3.5" />
                  {clientData.clientId || "No ID"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:min-w-[350px]">
          {/* RESOURCE */}
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center md:justify-start gap-2 rounded-md bg-white px-4 py-3 text-sm font-medium text-muted transition hover:bg-primaryLight hover:text-primary"
              >
                <Plus className="h-4 w-4" />
                Resource
              </button>
            </DialogTrigger>

            <DialogContent className="bg-background text-foreground border rounded-lg shadow-lg p-6 w-full max-w-md">
              <VisuallyHidden>
                <DialogTitle>{`Create Resource for ${clientData.firstName} ${clientData.lastName}`}</DialogTitle>
              </VisuallyHidden>

              <ResourceForm
                authRouter={authRouter}
                clientId={clientData.id}
                fetchClientData={fetchClientData}
              />
            </DialogContent>
          </Dialog>

          {/* NOTE */}
          <Dialog>
            <DialogTrigger asChild>
              <button
                type="button"
                className="inline-flex flex-1 items-center justify-center md:justify-start gap-2 rounded-md bg-white px-4 py-3 text-sm font-medium text-muted transition hover:bg-primaryLight hover:text-primary"
              >
                <FilePlus className="h-4 w-4" />
                Note
              </button>
            </DialogTrigger>

            <DialogContent className="bg-background text-foreground border rounded-lg shadow-lg p-6 w-full max-w-md">
              <VisuallyHidden>
                <DialogTitle>{`Create Note for ${clientData.firstName} ${clientData.lastName}`}</DialogTitle>
              </VisuallyHidden>

              <NoteForm
                authRouter={authRouter}
                clientId={clientData.id}
                fetchUpdatedData={fetchClientData}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

import TimelineHistory from "@/components/partials/Timeline";


function Timeline({clientId, authRouter, fetchClientData, clientData}) {
  return (
    <div>
      <TimelineHistory clientData={clientData} />
    </div>
  );
}


import {
  BedDouble,
  CalendarDays,
  ClipboardList,
  Clock,
  FileText,
  HeartHandshake,
  Info,
  NotebookText,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

function Information({ clientData, className, authRouter, fetchClientData }) {
  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString() : "N/A";

  const items = [
    { label: "Status", value: clientData?.status || "N/A", icon: ShieldCheck },
    { label: "Bed Label", value: clientData?.bedLabel || "N/A", icon: BedDouble },
    {
      label: "Stayed Last Night",
      value: clientData?.hereLastNight ? "Yes" : "No",
      icon: CheckCircle2,
    },
    {
      label: "Extension",
      value: clientData?.extensionStatus ? "Active" : "None",
      icon: Clock,
    },
    { label: "Intake Date", value: formatDate(clientData?.intakeDate), icon: CalendarDays },
    { label: "Outtake Date", value: formatDate(clientData?.outtakeDate), icon: CalendarDays },
    { label: "Last Stay Update", value: formatDate(clientData?.lastStayDate), icon: Clock },
    { label: "Client Created", value: formatDate(clientData?.createdAt), icon: UserRound },
  ];

  const extraItems = [
    { label: "DOB", value: clientData?.dob || "Not added", icon: CalendarDays },
    { label: "Age", value: clientData?.age || "Not added", icon: UserRound },
    { label: "Phone", value: clientData?.phone || "Not added", icon: Phone },
    {
      label: "Emergency #",
      value: clientData?.emergencyContact || "Not added",
      icon: HeartHandshake,
    },
  ];

  return (
    <div className={`rounded-xl border border-border bg-white shadow-sm ${className}`}>
      <div className="border-b border-border px-4 py-4">
        <div className="flex w-full items-center justify-between rounded-full bg-primaryLight px-4 py-2">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-primary" />

            <h2 className="text-base font-semibold text-foreground/90">
              Client Information
            </h2>
          </div>

        <Dialog>
          <DialogTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-muted transition bg-transparent hover:bg-primaryLight hover:text-primary"
            >
              <UserRoundPen className="h-3.5 w-3.5" />
              Edit
            </button>
          </DialogTrigger>

          <DialogContent className="bg-background text-foreground border rounded-lg shadow-lg p-6 w-full max-w-md">
            <VisuallyHidden>
              <DialogTitle>{`Edit Client Information for ${clientData.firstName} ${clientData.lastName}`}</DialogTitle>
            </VisuallyHidden>

            <ClientForm
              authRouter={authRouter}
              clientId={clientData.id}
              fetchClientData={fetchClientData}
              clientData={clientData}
            />
          </DialogContent>
        </Dialog>
        </div>
        <p className="mt-1 text-sm text-muted">
          Basic details and shelter activity
        </p>
      </div>

      <div className="space-y-sm p-sm text-sm">
        <div className="grid grid-cols-1 gap-xs ">
          {items.map(({ label, value, icon: Icon }) => (
            <InfoCard key={label} label={label} value={value} icon={Icon} />
          ))}
        </div>

        {clientData?.priorityNeed && (
          <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3">
            <div className="flex items-start gap-2">
              <HeartHandshake className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
                  Priority Need
                </p>
                <p className="mt-1 text-sm font-medium text-foreground/90">
                  {clientData.priorityNeed}
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Referrals"
            value={clientData?.referrals?.length || 0}
            icon={ClipboardList}
          />
          <StatCard
            label="Notes"
            value={clientData?.notes?.length || 0}
            icon={NotebookText}
          />
        </div>

        <div className="rounded-lg border border-dashed border-border bg-backgroundAlt/50 p-3">
          <div className="mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4 text-primary" />
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              Additional Client Info
            </p>
          </div>

          <div className="grid grid-cols-1 gap-xs">
            {extraItems.map(({ label, value, icon: Icon }) => (
              <InfoCard key={label} label={label} value={value} icon={Icon} compact />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ label, value, icon: Icon, compact = false }) {
  return (
    <div
      className={`rounded-lg border-b-2 border-border bg-backgroundAlt ${
        compact ? "p-3" : "p-3.5"
      }`}
    >
      <div className="flex items-start gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primaryLight text-primary">
          <Icon className="h-4 w-4" />
        </div>

        <div className="min-w-0">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
            {label}
          </p>
          <p className="mt-1 truncate text-sm font-medium text-foreground/85">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon }) {
  return (
    <div className="rounded-lg border border-border bg-white p-3 shadow-sm transition">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
            {label}
          </p>
          <p className="mt-1 text-2xl font-semibold text-primaryDark">
            {value}
          </p>
        </div>

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primaryLight text-primary">
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}


import { Lock, Globe2, CheckCircle2, SquareUserRound } from "lucide-react";

export function Notes({ notes, fetchClientData, authRouter, showName }) {
  const [showCompleted, setShowCompleted] = useState(false);

  const handleDelete = async (e, noteId) => {
    e.stopPropagation();

    try {
      await authRouter.post(`/dashboard/notes/${noteId}/delete`);
      await fetchClientData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleCompleted = async (e, noteId) => {
    e.stopPropagation();

    try {
      await authRouter.post(`/dashboard/notes/${noteId}/completed`);
      await fetchClientData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleVisibility = async (e, noteId, currentVisibility) => {
    e.stopPropagation();

    const newVisibility = currentVisibility === "public" ? "private" : "public";

    try {
      await authRouter.post(`/dashboard/notes/${noteId}/visibility`, {
        visibility: newVisibility,
      });

      await fetchClientData();
    } catch (err) {
      console.error(err);
    }
  };

  const filteredNotes = showCompleted
    ? notes
    : notes?.filter((note) => !note.completed);

return (
  <div className="bg-background h-full p-2 xs:p-3 sm:p-4 rounded-xl space-y-2 sm:space-y-3">
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-1 xs:gap-2">
        <NotebookText className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
        <h2 className="text-xs sm:text-sm font-semibold text-gray-800">
          Case Notes
        </h2>
      </div>

      <button
        type="button"
        onClick={() => setShowCompleted(!showCompleted)}
        className="text-[10px] xs:text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-md border bg-white hover:bg-gray-50 text-gray-700"
      >
        {showCompleted ? "Hide Completed" : "Show Completed"}
      </button>
    </div>

    {notes?.length === 0 && (
      <p className="text-xs sm:text-sm text-muted-foreground">
        No notes available
      </p>
    )}

    {filteredNotes?.map((note) => {
      const isCompleted = note.completed;
      const isPublic = note.visibility === "private" ? false : true;

      return (
        <div
          key={note.id}
          className={`relative bg-white border border-border rounded-xl p-3 sm:p-4 pb-12 sm:pb-14 pr-12 sm:pr-14 shadow-sm hover:shadow-md transition ${
            isCompleted ? "opacity-70" : ""
          }`}
        >
          <div className="min-w-0 w-full flex flex-col items-start gap-2 sm:gap-3">
            <div className="w-full flex flex-wrap items-center gap-1 xs:gap-2 text-[10px] xs:text-xs sm:text-sm text-muted-foreground">
              <span className="font-medium text-gray-700">
                {note.author?.firstName} {note.author?.lastName}
              </span>

              <span className="text-gray-300">•</span>

              <span>{new Date(note.createdAt).toLocaleDateString()}</span>

              <button
                type="button"
                onClick={(e) =>
                  handleToggleVisibility(e, note.id, note.visibility)
                }
                className={`inline-flex items-center gap-1 rounded-full border px-1.5 sm:px-2 py-0.5 text-[10px] xs:text-xs font-medium ${
                  isPublic
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-slate-50 text-slate-700 border-slate-200"
                }`}
              >
                {isPublic ? (
                  <Globe2 className="w-3 h-3" />
                ) : (
                  <Lock className="w-3 h-3" />
                )}
                {isPublic ? "Public" : "Private"}
              </button>
            </div>

            <div className="w-full text-left space-y-1.5 sm:space-y-2">
              <h3
                className={`text-sm text-left sm:text-base md:text-lg font-semibold tracking-tight text-gray-950 ${
                  isCompleted ? "line-through text-gray-500" : ""
                }`}
              >
                {note?.title || ""}
              </h3>

              <div
                className={`rounded-lg border border-gray-200 bg-gray-50 px-2 sm:px-3 py-2 sm:py-2.5 ${
                  isCompleted ? "line-through text-gray-500" : ""
                }`}
              >
                {note.content == "" || note.content == null ? (
                  <p className="text-xs sm:text-sm italic text-gray-400">
                    <i>No Content</i>
                  </p>
                ) : (
                  <p className="text-xs sm:text-sm md:text-md leading-relaxed text-gray-700 whitespace-pre-wrap">
                    {note.content}
                  </p>
                )}
              </div>
            </div>

            {note.setReminder && note.reminderDate && (
              <div className="inline-flex items-center gap-1 sm:gap-2 text-[10px] xs:text-xs sm:text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-1.5 sm:px-2 py-1">
                <Calendar className="w-3 h-3" />
                <span>
                  Reminder:{" "}
                  {new Date(note.reminderDate).toLocaleDateString("en-US", {
                    timeZone: "UTC",
                  })}
                </span>
              </div>
            )}

            {showName && note.client && (
              <p className="absolute bottom-3 left-3 sm:left-4 text-[10px] xs:text-xs sm:text-sm text-muted flex items-center gap-1">
                <SquareUserRound className="w-3 h-3" />
                {note.client.firstName} {note.client.lastName}
              </p>
            )}
          </div>

          <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
            <DropdownNoteEditDelete
              note={note}
              authRouter={authRouter}
              fetchClientData={fetchClientData}
              handleDelete={handleDelete}
            />
          </div>

          <button
            type="button"
            onClick={(e) => handleToggleCompleted(e, note.id)}
            className={`absolute bottom-3 right-3 inline-flex items-center gap-1 text-[10px] xs:text-xs sm:text-sm px-2 sm:px-2.5 py-1 rounded-md border font-medium ${
              isCompleted
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
            }`}
          >
            {isCompleted && <CheckCircle2 className="w-3 h-3" />}
            {isCompleted ? "Completed" : "Mark Completed"}
          </button>
        </div>
      );
    })}
  </div>
);
}

export function Resources({referrals, fetchClientData, authRouter, showName}) {
  const [toggleKey, setToggleKey] = useState(null);


  const handleDelete = async (e, id) => {
    setToggleKey(null);
    e.stopPropagation();

    try {
      await authRouter.delete(`/dashboard/referrals/${id}`);
      await fetchClientData();
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (referralId, newStatus) => {
    try {
      await authRouter.patch(`/dashboard/referrals/${referralId}/status`, { status: newStatus });
      await fetchClientData(); 
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="flex flex-col bg-gray-100 p-3 sm:p-4 rounded-xl space-y-3 overflow-y-auto relative position-relative ">

    {referrals?.map((resource) => {
      const config = RESOURCE_CONFIG[resource.resourceType] || {};
      const Icon = config.icon;
      const now = new Date();
      const exp = resource?.followUpDate ? new Date(resource.followUpDate) < now : null;

    return (
      <div
        key={resource.id}
        onClick={() => setToggleKey(resource.id === toggleKey ? null : resource.id)}
        className="bg-white text-foreground border rounded-lg p-4 shadow-sm hover:shadow-md transition"
      >
        
        {/* TOP ROW */}
        <div className="pb-sm flex items-start justify-between gap-2">
          <div className="flex flex-col items-start gap-xs">
            <div className="flex items-center gap-sm">
            <h3 className="font-semibold text-sm sm:text-base">
              {resource.organizationName}
            </h3>
            {resource.isPriority && (
              <span className="flex gap-xs items-center text-red-600 font-medium text-xs sm:text-md">
                <TriangleAlert className="w-md" />
               <div className="hidden sm:block">
                Priority
               </div>
              </span>
            )}
            </div>
            <p className="color text-xs sm:text-sm text-muted flex items-center gap-1">
              {Icon && <Icon className=" w-3 h-3" />}
              {config.label || resource.resourceType}
            </p>
            {showName && (
              <p className="text-xs sm:text-sm text-muted flex items-center gap-1">
                <SquareUserRound className="w-3 h-3" />
                {resource.client.firstName} {resource.client.lastName}
              </p>
            )}
          </div>


          {/* STATUS */}
          <div className="flex flex-col-reverse sm:flex-row items-end gap-sm">
            <span
              className={`text-[10px] sm:text-xs px-2 py-1 rounded-full font-medium ${
                resource.status === "INQUIRED"
                  ? "bg-gray-100 text-gray-700"
                  : resource.status === "REFERRED"
                  ? "bg-blue-100 text-blue-700"
                  : resource.status === "PENDING"
                  ? "bg-yellow-100 text-yellow-700"
                  : resource.status === "ENROLLED"
                  ? "bg-green-100 text-green-700"
                  : resource.status === "COMPLETED"
                  ? "bg-purple-100 text-purple-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {resource.status}
            </span>
              <DropdownEditDelete
                resource={resource}
                authRouter={authRouter}
                fetchClientData={fetchClientData}
                handleDelete={handleDelete}
              />
          </div>
        </div>

        {resource.id === toggleKey && (
          <div className="flex flex-col pt-lg border-t-2 border-gray-300 items-center gap-2 mt-1">
            <div className="flex-1 w-full flex justify-between items-center gap-1 text-xs text-muted-foreground">
              <div className="flex flex-col sm:flex-row justify-start items-center gap-1">
                <span className="font-medium text-gray-700">
                  Assigned:{" "} 
                </span>
                {resource.createdAt && (
                  <span className="flex items-center gap-1">
                    <span className="font-medium text-gray-700 ">
                      {new Date(resource.createdAt).toLocaleDateString()}
                    </span>
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row justify-start items-center gap-1">
                <span className="font-medium text-gray-700">
                  Assigned By:{" "}
                </span>
                {resource?.createdBy?.firstName && (
                  <span className="flex items-center gap-1">
                    <span className="font-medium text-gray-700">
                      {resource.createdBy.firstName} {resource.createdBy?.lastName}
                    </span>
                  </span>
                )}
              </div>
            </div>
            <div className="flex-1 w-full flex justify-between items-center border-2 border-primary bg-blue-100 p-xs rounded-xs gap-1 text-xs text-muted-foreground">
              {resource.followUpDate && (
                <span className="flex border w-full justify-between items-center gap-1">
                  <div className={`flex items-center gap-1 ${exp ? "text-red-600" : "text-gray-700"}`}>
                    <Calendar1Icon className="w-3 h-3" />
                    <span className="hidden sm:block">Next Follow-up</span>
                    <span className="font-medium text-gray-700">
                    <span className="font-medium text-gray-700">
                      {new Date(resource.followUpDate).toLocaleDateString("en-US", {
                        timeZone: "UTC",
                      })}
                    </span>
                    </span>
                  </div>
                
                {exp && <span className="flex ml-1 items-center text-red-600 font-medium text-xs sm:text-md"><i>Expired</i></span>}
                </span>
              )}
            </div>
            <div className="flex-3 w-full flex flex-col justify-start items-center gap-md text-xs text-muted-foreground">
              {/* PURPOSE */}
              {resource.purpose && (
                <div className="flex-1 w-full flex flex-wrap flex-col justify-start items-start border-gray-300 pt-2">
                  <span className="font-medium text-gray-700">
                    Purpose
                  </span>
                  <p className="mt-1 flex flex-wrap text-xs text-muted-foreground italic">
                    {resource.purpose}
                  </p>
                </div>
              )}

              {/* SUMMARY */}
              {resource.summary && (
                <div className="flex-1 w-full flex flex-wrap flex-col justify-start items-start border p-sm rounded-xs bg-gray-100 border-gray-300 pt-2">
                  <span className="font-medium text-gray-700">
                    Note
                  </span>
                  <p className="mt-1 flex flex-wrap text-xs text-muted-foreground italic">
                    {resource.summary}
                  </p>
                </div>
              )}

              {/* FOOTER */}
              <div className="w-full mt-3 flex flex-col gap-sm flex-wrap items-start justify-start sm:text-xs text-muted-foreground">
                <span className="text-md font-medium text-gray-700">
                  Update Status
                </span>

                <div className="flex flex-wrap gap-1 sm:gap-2">

                  <Button
                    size="sm"
                    className={`text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-medium
                      ${resource.status === "INQUIRED"
                        ? "bg-gray-100 text-gray-700 ring-1 ring-gray-300"
                        : "bg-gray-50 text-gray-600 hover:bg-gray-100"}
                    `}
                    onClick={() => updateStatus(resource.id, "INQUIRED")}
                  >
                    Inquired
                  </Button>

                  <Button
                    size="sm"
                    className={`text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-medium
                      ${resource.status === "REFERRED"
                        ? "bg-blue-100 text-blue-700 ring-1 ring-blue-300"
                        : "bg-blue-50 text-blue-600 hover:bg-blue-100"}
                    `}
                    onClick={() => updateStatus(resource.id, "REFERRED")}
                  >
                    Referred
                  </Button>

                  <Button
                    size="sm"
                    className={`text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-medium
                      ${resource.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-300"
                        : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"}
                    `}
                    onClick={() => updateStatus(resource.id, "PENDING")}
                  >
                    Pending
                  </Button>

                  <Button
                    size="sm"
                    className={`text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-medium
                      ${resource.status === "ENROLLED"
                        ? "bg-green-100 text-green-700 ring-1 ring-green-300"
                        : "bg-green-50 text-green-700 hover:bg-green-100"}
                    `}
                    onClick={() => updateStatus(resource.id, "ENROLLED")}
                  >
                    Enrolled
                  </Button>

                  <Button
                    size="sm"
                    className={`text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-medium
                      ${resource.status === "COMPLETED"
                        ? "bg-purple-100 text-purple-700 ring-1 ring-purple-300"
                        : "bg-purple-50 text-purple-700 hover:bg-purple-100"}
                    `}
                    onClick={() => updateStatus(resource.id, "COMPLETED")}
                  >
                    Completed
                  </Button>

                  <Button
                    size="sm"
                    className={`text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-medium
                      ${resource.status === "CLOSED"
                        ? "bg-red-100 text-red-700 ring-1 ring-red-300"
                        : "bg-red-50 text-red-700 hover:bg-red-100"}
                    `}
                    onClick={() => updateStatus(resource.id, "CLOSED")}
                  >
                    Closed
                  </Button>

                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  })}
    </div>
  );
}

