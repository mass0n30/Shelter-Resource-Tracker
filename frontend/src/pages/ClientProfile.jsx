import { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Button } from "@base-ui/react";
import NoteForm from "../components/forms/NoteForm";
import ResourceForm from "../components/forms/ResourceForm";
import { ClientForm, ClientFormAdditional } from "@/components/forms/ClientForm";
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
  CircleAlert,
  Loader2
} from "lucide-react";
import { RESOURCE_CONFIG , getClientReferralStats} from "../lib/utils";

export default function ClientProfile() {
  const { clientId } = useParams();
  const [clientData, setClientData] = useState(null);
  const [openForm, setOpenForm] = useState(null);
  const [clientStats, setClientStats] = useState(null);
  const [activeSection, setActiveSection] = useState("resources");

  const { authRouter, user } = useOutletContext();

  const { error, setError, success, setSuccess, loading, setLoadingDuration, setLoading } = useAsyncStatus();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []); 

  const fetchClientData = async (success) => {
    setLoading(true);

    try {
      const response = await authRouter.get(`/dashboard/clients/${clientId}`);

      const getClientStats = getClientReferralStats(response.data);

      setClientData(response.data);
      setClientStats(getClientStats);

      if (success) {
        setSuccess(true);
      }
    } catch (error) {
      console.error("Error fetching client data:", error);
    } finally {
      setLoading(false);
    }
  };

  // fetching upon mount
  useEffect(() => {
    fetchClientData();
  }, [clientId]);

  if (!clientData) {
    return <ClientProfileSkeleton />;
  }

  return (
    <div className="flex-1 flex w-full flex-col overflow-hidden bg-background">
      <Banner
        clientData={clientData.client}
        authRouter={authRouter}
        fetchClientData={fetchClientData}
        openForm={openForm}
        setOpenForm={setOpenForm}
        className="shrink-0 w-full bg-backgroundAlt min-h-[120px] border-b"
      />

      <div className="mx-auto grid min-h-0 w-full max-w-7xl flex-1 grid-cols-1 gap-4 overflow-hidden p-4 md:grid-cols-4">
        <ClientInfoSectionToggle
          user={user}
          clientData={clientData}
          authRouter={authRouter}
          fetchClientData={fetchClientData}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
          className="md:col-span-3"
        />

        <Information
          clientData={clientData.client}
          fetchUpdatedData={fetchClientData}
          authRouter={authRouter}
          setOpenForm={setOpenForm}
          openForm={openForm}
          setSuccess={setSuccess}
          className="min-h-0 max-h-[calc(140vh-200px)] overflow-y-auto md:col-span-1"
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
  user
}) {

  const filteredResources = clientData.client.referrals?.filter((referral) => referral.status !== "COMPLETED" && referral.status !== "CLOSED") || [];

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

      <div className="min-h-0 max-h-[calc(140vh-200px)] bg-background flex-1 overflow-y-hidden pr-1">
        {activeSection === "resources" && (
          <Resources
            fetchClientData={fetchClientData}
            referrals={filteredResources}
            authRouter={authRouter}
          />
        )}

        {activeSection === "notes" && (
          <Notes
            fetchClientData={fetchClientData}
            notes={clientData.notes}
            authRouter={authRouter}
            currentUser={user}
          />
        )}

        {activeSection === "timeline" && (
          <TimelineHistory
            fetchClientData={fetchClientData}
            clientId={clientData.id}
            authRouter={authRouter}
            clientData={clientData.client}
          />
        )}
      </div>
    </div>
  );
}

function Banner({
  clientData,
  className,
  authRouter,
  fetchClientData,
  openForm,
  setOpenForm,
}) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex w-full max-w-7xl flex-col gap-4 px-4 py-4 md:flex-row md:items-center md:justify-between">
        {/* LEFT SIDE */}
        <div className="flex min-w-0 flex-col gap-3 md:flex-row md:items-center md:gap-4">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex w-fit items-center gap-2 rounded-md bg-transparent px-2 py-1 text-xs font-medium text-muted transition hover:bg-primaryLight hover:text-primary"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span className="hidden xs:inline sm:inline">Back to Dashboard</span>
            <span className="sm:hidden">Back</span>
          </button>

          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-primaryLight text-sm font-semibold text-primary sm:h-14 sm:w-14">
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

            <div className="min-w-0 flex-1">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <h1 className="max-w-[180px] truncate text-base font-semibold text-foreground/90 sm:max-w-none sm:text-lg">
                  {clientData.firstName} {clientData.lastName}
                </h1>

                <span className="shrink-0 rounded-full border border-border bg-backgroundAlt px-2 py-0.5 text-[11px] font-medium text-muted">
                  {clientData.status}
                </span>
              </div>

              <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
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

        {/* RIGHT SIDE ACTIONS */}
        <div className="grid w-full grid-cols-2 gap-2 md:flex md:w-auto md:min-w-[300px] md:items-center">
          {/* RESOURCE */}
          <Dialog
            open={openForm === "resource"}
            onOpenChange={(open) => setOpenForm(open ? "resource" : null)}
          >
            <DialogTrigger asChild>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-medium text-muted transition hover:bg-primaryLight hover:text-primary md:justify-start"
              >
                <Plus className="h-4 w-4" />
                Resource
              </button>
            </DialogTrigger>

            <DialogContent className="w-[calc(100vw-2rem)] max-w-md rounded-lg border bg-background p-6 text-foreground shadow-lg">
              <VisuallyHidden>
                <DialogTitle>{`Create Resource for ${clientData.firstName} ${clientData.lastName}`}</DialogTitle>
              </VisuallyHidden>

              <ResourceForm
                authRouter={authRouter}
                clientId={clientData.id}
                fetchClientData={fetchClientData}
                setOpenForm={setOpenForm}
              />
            </DialogContent>
          </Dialog>

          {/* NOTE */}
          <Dialog
            open={openForm === "note"}
            onOpenChange={(open) => setOpenForm(open ? "note" : null)}
          >
            <DialogTrigger asChild>
              <button
                type="button"
                className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-white px-4 py-3 text-sm font-medium text-muted transition hover:bg-primaryLight hover:text-primary md:justify-start"
              >
                <FilePlus className="h-4 w-4" />
                Note
              </button>
            </DialogTrigger>

            <DialogContent className="!w-[calc(100vw-2rem)] !max-w-[500px] rounded-lg border bg-background p-6 text-foreground shadow-lg">
              <VisuallyHidden>
                <DialogTitle>{`Create Note for ${clientData.firstName} ${clientData.lastName}`}</DialogTitle>
              </VisuallyHidden>

              <NoteForm
                authRouter={authRouter}
                clientId={clientData.id}
                fetchUpdatedData={fetchClientData}
                setOpenForm={setOpenForm}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}


import TimelineHistory from "@/components/partials/Timeline";



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

  function Information({
    clientData,
    className,
    authRouter,
    fetchUpdatedData,
    setOpenForm,
    openForm,
    setSuccess
  }) {  
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
    { label: "DOB", value: new Date(clientData?.dob).toLocaleDateString() || "Not added", icon: CalendarDays },
    { label: "Age", value: clientData?.age || "Not added", icon: UserRound },
    { label: "Phone", value: clientData?.phone || "Not added", icon: Phone },
    {
      label: "Email #",
      value: clientData?.email || "Not added",
      icon: Info,
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

        <Dialog open={openForm === "client"} onOpenChange={(open) => setOpenForm(open ? "client" : null)}>
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
              clientData={clientData}
              fetchUpdatedData={fetchUpdatedData}
              setOpenForm={setOpenForm}
              setSuccess={setSuccess}
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
            <Dialog open={openForm === "additional"} onOpenChange={(open) => setOpenForm(open ? "additional" : null)}>
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

                <ClientFormAdditional
                  authRouter={authRouter}
                  clientData={clientData}
                  fetchUpdatedData={fetchUpdatedData}
                  setOpenForm={setOpenForm}
                  setSuccess={setSuccess}
                />
              </DialogContent>
            </Dialog>
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

        <div className="min-w-0 ">
          <p className="text-[11px] font-medium uppercase tracking-wide text-muted">
            {label}
          </p>
          <p className={`mt-1 ${value == 'HOUSED' ? 'text-orange-600 font-bold' : ''} truncate text-sm font-medium text-foreground/85`}>
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

export function Notes({
  notes,
  fetchClientData,
  authRouter,
  showName,
  currentUser,
}) {
  const [showCompleted, setShowCompleted] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const [updateMessage, setUpdateMessage] = useState("");
  const [openForm, setOpenForm] = useState(null);

  const { success, setSuccess, loading, setLoading, error, setError } =
    useAsyncStatus({
      loadingDuration: 2000,
      successDuration: 3000,
    });

  const handleDelete = async (e, noteId, authorId) => {
    e.stopPropagation();

    if (authorId !== currentUser?.id) return;

    try {
      setLoadingId(noteId);
      setLoading(true);

      await authRouter.post(`/dashboard/notes/${noteId}/delete`);
      await fetchClientData();

      setUpdateMessage("delete");
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleCompleted = async (e, noteId, authorId) => {
    e.stopPropagation();

    if (authorId !== currentUser?.id) return;

    try {
      setLoadingId(noteId);
      setLoading(true);

      await authRouter.post(`/dashboard/notes/${noteId}/complete`);
      await fetchClientData();

      setUpdateMessage("complete");
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoadingId(null);
    }
  };

  const handleToggleVisibility = async (
    e,
    noteId,
    currentVisibility,
    authorId
  ) => {
    e.stopPropagation();

    if (authorId !== currentUser?.id) return;

    const newVisibility = currentVisibility === "public" ? "private" : "public";

    try {
      setLoadingId(noteId);
      setLoading(true);

      await authRouter.post(`/dashboard/notes/${noteId}/visibility`, {
        visibility: newVisibility,
      });

      await fetchClientData();

      setUpdateMessage(newVisibility === "private" ? "private" : "public");
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoadingId(null);
    }
  };

  const filteredNotes = showCompleted
    ? notes
    : notes?.filter((note) => !note.completed);

  return (
    <div className="relative bg-background h-full p-2 xs:p-3 sm:p-4 rounded-xl space-y-2 sm:space-y-3">
      <div
        className={`pointer-events-none absolute right-3 top-3 z-20 flex items-center gap-1 rounded-md border border-primary/20 bg-white/95 px-3 py-1.5 text-[10px] xs:text-xs font-medium text-primary shadow-sm transition-all duration-300 ease-out ${
          success
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-2 opacity-0 scale-95"
        }`}
      >
        <CircleAlert className="h-3 w-3 xs:h-4 xs:w-4" />

        <span className="hidden xs:inline">
          {updateMessage === "delete"
            ? "Deleted"
            : updateMessage === "private"
            ? "Marked Private"
            : updateMessage === "public"
            ? "Marked Public"
            : updateMessage === "complete"
            ? "Marked Completed"
            : updateMessage === "edit"
            ? "Updated"
            : "Updated"}
        </span>
      </div>

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
        const isPublic = note.visibility !== "private";
        const isOwnNote = note.authorId === currentUser?.id;
        const isCurrentNoteLoading = loadingId === note.id;

        return (
          <div
            key={note.id}
            className={`relative bg-white border border-border rounded-xl p-3 sm:p-4 pb-12 sm:pb-14 pr-12 sm:pr-14 shadow-sm hover:shadow-md transition ${
              isCompleted ? "opacity-70" : ""
            } ${isCurrentNoteLoading ? "opacity-60 pointer-events-none" : ""}`}
          >
            {isCurrentNoteLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/50">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            )}

            <div className="min-w-0 w-full flex flex-col items-start gap-2 sm:gap-3">
              <div className="w-full flex flex-wrap items-center gap-1 xs:gap-2 text-[10px] xs:text-xs sm:text-sm text-muted-foreground">
                <span className="font-medium text-gray-700">
                  {note.author?.firstName} {note.author?.lastName}
                </span>

                <span className="text-gray-300">•</span>

                <span>{new Date(note.createdAt).toLocaleDateString()}</span>

                {isOwnNote ? (
                  <button
                    type="button"
                    disabled={isCurrentNoteLoading}
                    onClick={(e) =>
                      handleToggleVisibility(
                        e,
                        note.id,
                        note.visibility,
                        note.authorId
                      )
                    }
                    className={`inline-flex items-center gap-1 rounded-full border px-1.5 sm:px-2 py-0.5 text-[10px] xs:text-xs font-medium disabled:cursor-not-allowed ${
                      isPublic
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-slate-50 text-slate-700 border-slate-200"
                    }`}
                  >
                    {isCurrentNoteLoading ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : isPublic ? (
                      <Globe2 className="w-3 h-3" />
                    ) : (
                      <Lock className="w-3 h-3" />
                    )}

                    {isCurrentNoteLoading
                      ? "Saving"
                      : isPublic
                      ? "Public"
                      : "Private"}
                  </button>
                ) : (
                  <span
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
                  </span>
                )}
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
                  {note.content === "" || note.content == null ? (
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

            {isOwnNote && (
              <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-20">
                <DropdownNoteEditDelete
                  note={note}
                  authRouter={authRouter}
                  fetchClientData={fetchClientData}
                  handleDelete={(e, noteId) =>
                    handleDelete(e, noteId, note.authorId)
                  }
                  loadingId={loadingId}
                  setLoadingId={setLoadingId}
                  setSuccess={setSuccess}
                  setError={setError}
                  setUpdateMessage={setUpdateMessage}
                  openForm={openForm}
                  setOpenForm={setOpenForm}
                />
              </div>
            )}

            {isOwnNote && (
              <button
                type="button"
                disabled={isCurrentNoteLoading}
                onClick={(e) =>
                  handleToggleCompleted(e, note.id, note.authorId)
                }
                className={`absolute bottom-3 right-3 inline-flex items-center gap-1 text-[10px] xs:text-xs sm:text-sm px-2 sm:px-2.5 py-1 rounded-md border font-medium disabled:cursor-not-allowed ${
                  isCompleted
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                    : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200"
                }`}
              >
                {isCurrentNoteLoading ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Updating
                  </>
                ) : isCompleted ? (
                  <>
                    <CheckCircle2 className="w-3 h-3" />
                    Completed
                  </>
                ) : (
                  "Mark Completed"
                )}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function Resources({ referrals, fetchClientData, authRouter, showName }) {
  const [toggleKey, setToggleKey] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [updateMessage, setUpdateMessage] = useState("");
  const [openForm, setOpenForm] = useState(null);

  const { success, setSuccess, loading, setLoading, error, setError } =
    useAsyncStatus({
      loadingDuration: 2000,
      successDuration: 3000,
    });

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    setToggleKey(null);

    try {
      setLoadingId(id);
      setLoading(true);

      await authRouter.delete(`/dashboard/referrals/${id}`);
      await fetchClientData();

      setUpdateMessage("delete");
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError(true);
    } finally {
      setLoadingId(null);
    }
  };

  const updateStatus = async (e, referralId, newStatus) => {
    e.stopPropagation();

    try {
      setLoadingId(referralId);
      setLoading(true);

      await authRouter.patch(`/dashboard/referrals/${referralId}/status`, {
        status: newStatus,
      });

      await fetchClientData();

      setUpdateMessage(newStatus.toLowerCase());
      setSuccess(true);
    } catch (error) {
      console.error("Error updating status:", error);
      setError(true);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="relative flex flex-col bg-background p-3 sm:p-4 rounded-xl space-y-3 overflow-y-auto">
      <div
        className={`pointer-events-none absolute right-3 top-3 z-20 flex items-center gap-1 rounded-md border border-primary/20 bg-white/95 px-3 py-1.5 text-[10px] xs:text-xs font-medium text-primary shadow-sm transition-all duration-300 ease-out ${
          success
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-2 opacity-0 scale-95"
        }`}
      >
        <CircleAlert className="h-3 w-3 xs:h-4 xs:w-4" />

        <span className="hidden xs:inline">
          {updateMessage === "delete"
            ? "Deleted"
            : updateMessage === "closed"
            ? "Referral Closed"
            : updateMessage === "completed"
            ? "Referral Completed"
            : updateMessage === "edit"
            ? "Referral Updated"
            : "Updated"}
        </span>
      </div>

      <div className="flex items-center gap-1 xs:gap-2">
        <NotebookText className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
        <h2 className="text-xs sm:text-sm font-semibold text-gray-800">
          Active Referrals
        </h2>
      </div>

      {referrals?.map((resource) => {
        const config = RESOURCE_CONFIG[resource.resourceType] || {};
        const Icon = config.icon;
        const now = new Date();
        const exp = resource?.followUpDate
          ? new Date(resource.followUpDate) < now
          : null;

        const isCurrentResourceLoading = loadingId === resource.id;

        return (
          <div
            key={resource.id}
            onClick={() => {
              if (isCurrentResourceLoading) return;

              setToggleKey(resource.id === toggleKey ? null : resource.id);
            }}
            className={`relative bg-white text-foreground border rounded-lg p-4 shadow-sm hover:shadow-md transition ${
              isCurrentResourceLoading ? "opacity-60 pointer-events-none" : ""
            }`}
          >
            {isCurrentResourceLoading && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-white/50">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            )}

            {/* TOP ROW */}
            <div className="pb-sm flex items-start justify-between gap-2">
              <div className="flex flex-col items-start gap-xs">
                <div className="flex items-center gap-sm">
                  <h3 className="font-semibold text-left text-sm sm:text-base">
                    {resource.organizationName}
                  </h3>

                  {resource.isPriority && (
                    <span className="flex gap-xs items-center text-red-600 font-medium text-xs sm:text-md">
                      <TriangleAlert className="w-md" />
                      <div className="hidden sm:block">Priority</div>
                    </span>
                  )}
                </div>

                <p className="color text-xs sm:text-sm text-muted flex items-center gap-1">
                  {Icon && <Icon className="w-3 h-3" />}
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

                <div className="relative z-20">
                  <DropdownEditDelete
                    resource={resource}
                    authRouter={authRouter}
                    fetchClientData={fetchClientData}
                    handleDelete={handleDelete}
                    loadingId={loadingId}
                    setLoadingId={setLoadingId}
                    setSuccess={setSuccess}
                    setError={setError}
                    setUpdateMessage={setUpdateMessage}
                    openForm={openForm}
                    setOpenForm={setOpenForm}
                  />
                </div>
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
                        <span className="font-medium text-gray-700">
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
                          {resource.createdBy.firstName}{" "}
                          {resource.createdBy?.lastName}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1 w-full flex justify-between items-center border-2 border-primary bg-blue-100 p-xs rounded-xs gap-1 text-xs text-muted-foreground">
                  {resource.followUpDate && (
                    <span className="flex border w-full justify-between items-center gap-1">
                      <div
                        className={`flex items-center gap-1 ${
                          exp ? "text-red-600" : "text-gray-700"
                        }`}
                      >
                        <Calendar1Icon className="w-3 h-3" />
                        <span className="hidden sm:block">
                          Next Follow-up
                        </span>

                        <span className="font-medium text-gray-700">
                          {new Date(resource.followUpDate).toLocaleDateString(
                            "en-US",
                            {
                              timeZone: "UTC",
                            }
                          )}
                        </span>
                      </div>

                      {exp && (
                        <span className="flex ml-1 items-center text-red-600 font-medium text-xs sm:text-md">
                          <i>Expired</i>
                        </span>
                      )}
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
                      <span className="font-medium text-gray-700">Note</span>
                      <p className="mt-1 flex flex-wrap text-xs text-muted-foreground italic">
                        {resource.summary}
                      </p>
                    </div>
                  )}

                  {/* FOOTER */}
                  <div className="w-full mt-3 flex flex-col gap-sm flex-wrap items-start justify-start sm:text-xs text-muted-foreground">
                    <span className="text-md font-medium text-gray-700 flex items-center gap-2">
                      Update Status
                      {isCurrentResourceLoading && (
                        <Loader2 className="w-3 h-3 animate-spin text-primary" />
                      )}
                    </span>

                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      <Button
                        size="sm"
                        disabled={isCurrentResourceLoading}
                        className={`text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-medium disabled:opacity-60 disabled:cursor-not-allowed ${
                          resource.status === "INQUIRED"
                            ? "bg-gray-100 text-gray-700 ring-1 ring-gray-300"
                            : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                        }`}
                        onClick={(e) =>
                          updateStatus(e, resource.id, "INQUIRED")
                        }
                      >
                        Inquired
                      </Button>

                      <Button
                        size="sm"
                        disabled={isCurrentResourceLoading}
                        className={`text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-medium disabled:opacity-60 disabled:cursor-not-allowed ${
                          resource.status === "REFERRED"
                            ? "bg-blue-100 text-blue-700 ring-1 ring-blue-300"
                            : "bg-blue-50 text-blue-600 hover:bg-blue-100"
                        }`}
                        onClick={(e) =>
                          updateStatus(e, resource.id, "REFERRED")
                        }
                      >
                        Referred
                      </Button>

                      <Button
                        size="sm"
                        disabled={isCurrentResourceLoading}
                        className={`text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-medium disabled:opacity-60 disabled:cursor-not-allowed ${
                          resource.status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700 ring-1 ring-yellow-300"
                            : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                        }`}
                        onClick={(e) =>
                          updateStatus(e, resource.id, "PENDING")
                        }
                      >
                        Pending
                      </Button>

                      <Button
                        size="sm"
                        disabled={isCurrentResourceLoading}
                        className={`text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-medium disabled:opacity-60 disabled:cursor-not-allowed ${
                          resource.status === "ENROLLED"
                            ? "bg-green-100 text-green-700 ring-1 ring-green-300"
                            : "bg-green-50 text-green-700 hover:bg-green-100"
                        }`}
                        onClick={(e) =>
                          updateStatus(e, resource.id, "ENROLLED")
                        }
                      >
                        Enrolled
                      </Button>

                      <Button
                        size="sm"
                        disabled={isCurrentResourceLoading}
                        className={`text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-medium disabled:opacity-60 disabled:cursor-not-allowed ${
                          resource.status === "COMPLETED"
                            ? "bg-purple-100 text-purple-700 ring-1 ring-purple-300"
                            : "bg-purple-50 text-purple-700 hover:bg-purple-100"
                        }`}
                        onClick={(e) =>
                          updateStatus(e, resource.id, "COMPLETED")
                        }
                      >
                        Completed
                      </Button>

                      <Button
                        size="sm"
                        disabled={isCurrentResourceLoading}
                        className={`text-[10px] sm:text-xs px-2 py-1 sm:px-3 sm:py-1.5 rounded-full font-medium disabled:opacity-60 disabled:cursor-not-allowed ${
                          resource.status === "CLOSED"
                            ? "bg-red-100 text-red-700 ring-1 ring-red-300"
                            : "bg-red-50 text-red-700 hover:bg-red-100"
                        }`}
                        onClick={(e) =>
                          updateStatus(e, resource.id, "CLOSED")
                        }
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

