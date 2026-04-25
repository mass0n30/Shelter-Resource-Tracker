import { useState, useEffect } from "react";
import { useOutletContext, useParams } from "react-router-dom";
import { Button } from "@base-ui/react";
import NoteForm from "../components/forms/NoteForm";
import ResourceForm from "../components/forms/ResourceForm";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { ArrowLeft, LucideBedDouble, Plus, FilePlus, HashIcon, EditIcon } from "lucide-react";

export default function ClientProfile() {
  const { clientId } = useParams();
  const [clientData, setClientData] = useState(null);

  

  const {
    authRouter,
    loading,
  } = useOutletContext();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await authRouter.get(`/dashboard/clients/${clientId}`);
        setClientData(response.data);
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };

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
        className="w-full bg-gray-100 min-h-[200px]"
      />

      <div className="flex-1 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-4 gap-4 p-4">
        <ClientInfoSectionToggle
          clientData={clientData}
          className="md:col-span-3"
        />
        <Information
          clientData={clientData}
          className="md:col-span-1"
        />
      </div>
    </div>
  );
}

function ClientInfoSectionToggle({ clientData, className }) {
  const [activeSection, setActiveSection] = useState("resources");

  return (
    <div className={`flex flex-col max-w-7xl bg-white p-4 rounded-md ${className}`}>
      <div className="flex gap-2 mb-4 md:gap-4">
        <Button
          className={`flex-1 text-xs md:text-sm ${
            activeSection === "resources"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveSection("resources")}
        >
          Resources
        </Button>

        <Button
          className={`flex-1 text-xs md:text-sm ${
            activeSection === "notes"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveSection("notes")}
        >
          Notes
        </Button>

        <Button
          className={`flex-1 text-xs md:text-sm ${
            activeSection === "timeline"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700"
          }`}
          onClick={() => setActiveSection("timeline")}
        >
          Timeline
        </Button>
      </div>

      <div className="flex-1 h-full">
        {activeSection === "resources" && <Resources referrals={clientData.referrals} />}
        {activeSection === "notes" && <Notes notes={clientData.notes} />}
        {activeSection === "timeline" && <Timeline clientId={clientData.id} />}
      </div>
    </div>
  );
}

function Banner({ clientData, className, authRouter }) {
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

            <DialogContent>
              <ResourceForm
                authRouter={authRouter}
                clientId={clientData.id}
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
              <NoteForm
                authRouter={authRouter}
                clientId={clientData.id}
              />
            </DialogContent>
          </Dialog>

        </div>

      </div>
    </div>
  );
}

function Information({clientData, className}) {
  return (
    <div className={`bg-white p-4 rounded-md ${className}`}>
      <div className=" p-4 rounded-md">
        <h2>Client Information</h2>
      </div>
    </div>
  );
}

function Notes({notes}) {
  return (
    <div className="bg-grey-100 p-4 rounded-md">
      {notes?.map(note => (
        <div key={note.id} className="border-b border-grey-200 py-2">
          <p className="font-semibold">{note.content}</p>
          <p className="text-sm text-grey-600">{note.content}</p>
        </div>
      ))}
    </div>
  );
}

function Timeline({clientId}) {
  return (
    <div className="bg-grey-100 p-4 rounded-md">
      <p>Timeline for client ID: {clientId}</p>
    </div>
  );
}

function Resources({referrals}) {
  const [toggleKey, setToggleKey] = useState(null);

  console.log("Referrals in Resources component:", referrals);
  return (
    <div className="bg-gray-100 p-3 sm:p-4 rounded-xl space-y-3 overflow-y-auto position-relative ">

      {referrals?.map((resource) => (
        <div
          key={resource.id}
          className="bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition"
        >
          
          {/* TOP ROW */}
          <div className="flex items-start justify-between gap-2">
            
            <div>
              <h3 className="font-semibold text-sm sm:text-base">
                {resource.organizationName}
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {resource.resourceType}
              </p>
            </div>

            {/* STATUS */}
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
          </div>

          {/* PURPOSE */}
          {resource.purpose && (
            <p className="mt-2 text-xs sm:text-sm text-gray-700">
              {resource.purpose}
            </p>
          )}

          {/* SUMMARY */}
          {resource.summary && (
            <p className="mt-1 text-xs text-muted-foreground italic">
              {resource.summary}
            </p>
          )}

          {/* META ROW */}
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px] sm:text-xs text-muted-foreground">
            
            {/* FOLLOW UP */}
            {resource.followUpDate && (
              <span>
                Follow-up:{" "}
                <span className="font-medium text-gray-700">
                  {new Date(resource.followUpDate).toLocaleDateString()}
                </span>
              </span>
            )}

            {/* PRIORITY */}
            {resource.isPriority && (
              <span className="text-red-600 font-medium">
                ⚠ Priority
              </span>
            )}

          </div>

          {/* FOOTER */}
          <div className="mt-3 flex flex-wrap justify-between text-[10px] text-muted-foreground">
            
            <span>
              By {resource.createdBy?.firstName} {resource.createdBy?.lastName}
            </span>

            <span>
              {new Date(resource.createdAt).toLocaleDateString()}
            </span>

          </div>

        </div>
      ))}
    </div>
  );
}

