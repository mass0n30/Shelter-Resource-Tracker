import { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Button } from "@base-ui/react";
import NoteForm from "../components/forms/NoteForm";
import ResourceForm from "../components/forms/ResourceForm";
import  DropdownEditDelete from "../components/partials/Dropdown";
import  { DropdownNoteEditDelete } from "../components/partials/Dropdown";

import { setLoadDelay } from "../lib/utils";
import { Dialog, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Ellipsis, TriangleAlert, ArrowLeft, LucideBedDouble, Plus, FilePlus, HashIcon, EditIcon, Calendar, Calendar1Icon } from "lucide-react";
import { RESOURCE_CONFIG } from "../lib/utils";

export default function ClientProfile() {
  const { clientId } = useParams();
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);

  
  const {
    authRouter,
  } = useOutletContext();

  const fetchClientData = async () => {
    try {
      await setLoadDelay(setLoading);
      const response = await authRouter.get(`/dashboard/clients/${clientId}`);
      setClientData(response.data);
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

  if (!clientData || loading) {
    return <p>Loading client data...</p>;
  }

  return (
    <div className="flex flex-1 flex-col w-full min-h-screen bg-gray-200">
      <Banner
        clientData={clientData}
        authRouter={authRouter}
        fetchClientData={fetchClientData}
        className="w-full bg-gray-100 min-h-[200px]"
      />

      <div className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        <ClientInfoSectionToggle
          clientData={clientData}
          authRouter={authRouter}
          fetchClientData={fetchClientData}
          className="md:col-span-3"
        />
        <Information
          clientData={clientData}
          fetchClientData={fetchClientData}
          className="md:col-span-1"
        />
      </div>
    </div>
  );
}

function ClientInfoSectionToggle({ clientData, authRouter, fetchClientData, className }) {
  const [activeSection, setActiveSection] = useState("resources");

  return (
    <div className={`flex flex-col max-w-7xl bg-white p-4 rounded-md ${className}`}>
      <div className="flex gap-2 mb-4 md:gap-4">
        <Button
          className={`flex-1 text-xs md:text-sm ${
            activeSection !== "resources"
              && "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveSection("resources")}
        >
          Resources
        </Button>

        <Button
          className={`flex-1 text-xs md:text-sm ${
            activeSection !== "notes"
              && "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveSection("notes")}
        >
          Notes
        </Button>

        <Button
          className={`flex-1 text-xs md:text-sm ${
            activeSection !== "timeline"
              && "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveSection("timeline")}
        >
          Timeline
        </Button>
      </div>

      <div className="flex-1 h-full">
        {activeSection === "resources" && <Resources fetchClientData={fetchClientData} referrals={clientData.referrals} authRouter={authRouter} />}
        {activeSection === "notes" && <Notes fetchClientData={fetchClientData} notes={clientData.notes} authRouter={authRouter} />}
        {activeSection === "timeline" && <Timeline fetchClientData={fetchClientData} clientId={clientData.id} authRouter={authRouter} />}
      </div>
    </div>
  );
}


function Banner({ clientData, className, authRouter, fetchClientData }) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="max-w-7xl flex-1 flex items-center justify-between gap-4 px-4">

        <div className="items-start">

          <div className="flex flex-1 mb-2">
            <Button
              variant="ghost"
              className="flex flex-1 justify-start gap-4 bg-transparent p-sm h-auto rounded-md text-gray-600 hover:bg-gray-200"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-1 mt-0.5" />
              <div className="text-xs sm:text-sm md:text-md">
                Back to Dashboard
              </div>
            </Button>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
              {clientData?.avatar ? (
                <img
                  src={clientData.avatar}
                  alt={`${clientData.firstName} ${clientData.lastName}`}
                />
              ) : (
                <span>
                  {clientData?.firstName?.charAt(0)}
                  {clientData?.lastName?.charAt(0)}
                </span>
              )}
            </div>

            <div className="flex flex-col flex-1">

              <div className="flex flex-col sm:flex-row gap-0 sm:gap-2 flex-1 items-start sm:items-center justify-between">
                <div className="font-semibold text-sm sm:text-md md:text-xl">
                  {clientData.firstName} {clientData.lastName}
                </div>
                <div className="text-muted-foreground text-xs md:text-sm">
                  {clientData.status}
                </div>
              </div>

              <div className="flex justify-start text-xs text-muted-foreground sm:gap-4 gap-2 mt-1">
                <p>
                  <LucideBedDouble className="inline mr-1" />
                  {clientData.bedLabel}
                </p>
                <p>
                  <HashIcon className="inline sm:mr-1" />
                  {clientData.clientId}
                </p>
              </div>

            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-2 md:min-w-[350px]">

          {/* RESOURCE */}
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="flex-1 flex w-full items-center justify-start gap-1"
              >
                <Plus className="inline mr-1 mb-1 h-4" />
                <div className="text-xs md:text-sm">Resource</div>
              </Button>
            </DialogTrigger>

            <DialogContent className="bg-background text-foreground border rounded-lg shadow-lg p-6 w-full max-w-md">
              <VisuallyHidden>
                <DialogTitle>{`Create Resource for ${clientData.firstName} ${clientData.lastName}`}</DialogTitle>
              </VisuallyHidden>
                <h2>{`Create Resource for ${clientData.firstName} ${clientData.lastName}`}</h2>
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
              <Button
                variant="outline"
                className="flex-1 flex w-full items-center justify-start gap-1"
              >
                <FilePlus className="inline mr-1 mb-1 h-4" />
                <div className="text-xs md:text-sm">Note</div>
              </Button>
            </DialogTrigger>

            <DialogContent>
              <VisuallyHidden>
                <DialogTitle>{`Create Note for ${clientData.firstName} ${clientData.lastName}`}</DialogTitle>
              </VisuallyHidden>
            
              <NoteForm
                authRouter={authRouter}
                clientId={clientData.id}
                fetchClientData={fetchClientData}
              />
            </DialogContent>
          </Dialog>

        </div>

      </div>
    </div>
  );
}

function Information({clientData, fetchClientData, className}) {
  return (
    <div className={`bg-white p-4 rounded-md ${className}`}>
      <div className=" p-4 rounded-md">
        <h2>Client Information</h2>
      </div>
    </div>
  );
}

function Notes({notes, fetchClientData, authRouter}) {


  const handleDelete = async (e, noteId) => {
    e.stopPropagation();
    try {
      await authRouter.delete(`/dashboard/notes/${noteId}`);
      await fetchClientData();
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <div className="bg-gray-100 p-4 rounded-xl space-y-3">

      {notes?.map((note) => (
        <div
          key={note.id}
          className="flex justify-between bg-white border rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition"
        >
          <div className="flex flex-col items-start gap-1">
            <span className="w-full font-medium mb-sm flex justify-start text-xs text-muted-foreground">
              {note.author?.firstName} {note.author?.lastName}
            </span>

            <div className="flex flex-col items-start gap-1">
      
              <p className="text-xs sm:text-sm text-gray-900">
                {note.content}
              </p>
              <span className="text-xs text-muted">
                {new Date(note.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* META ROW */}
            <div className="mt-2 flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2">
    
            </div>

            {/* REMINDER */}
            {note.setReminder && note.reminderDate && (
              <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-2 py-1">
                <Calendar className="w-3 h-3" />
                <span>
                  Reminder: {new Date(note.reminderDate).toLocaleDateString()}
                </span>
              </div>
            )}
            </div>
            <div>
              <DropdownNoteEditDelete
                note={note}
                authRouter={authRouter}
                fetchClientData={fetchClientData}
                handleDelete={handleDelete}
              />
            </div>
          </div>
      ))}

    </div>
  );
}

function Timeline({clientId, authRouter}) {
  return (
    <div className="bg-grey-100 p-4 rounded-md">
      <p>Timeline for client ID: {clientId}</p>
    </div>
  );
}


function Resources({referrals, fetchClientData, authRouter}) {
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
          </div>


          {/* STATUS */}
          <div className="flex  items-center gap-sm">
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
                <span className="flex border  items-center gap-1">
                <Calendar1Icon className="w-3 h-3" />
                  Next Follow-up:{" "} 
                  <span className="font-medium text-gray-700">
                    {new Date(resource.followUpDate).toLocaleDateString()}
                  </span>
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

