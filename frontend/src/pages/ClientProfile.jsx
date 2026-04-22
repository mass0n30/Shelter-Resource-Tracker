
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useParams } from "react-router-dom";
import { Button } from "@base-ui/react";
import { ArrowLeft, LucideBedDouble, Plus, FilePlus } from "lucide-react";
import axios from "axios";

export default function ClientProfile() {
  const { clientId } = useParams();
  const [clientData, setClientData] = useState(null);

  const { user, data, success, SetSuccess, SetLoading, loading, SetNewFetch, authRouter, authRouterForm } = useOutletContext();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const response = await authRouter.get(`/dashboard/clients/${clientId}`);
        const result = response.data;
        console.log("Fetched client data:", result);
        setClientData(result);
      } catch (error) {
        console.error("Error fetching client data:", error);
      }
    };

    fetchClientData();
  }, [clientId]);

  useEffect(() => {
    console.log("UPDATED:", clientData);
  }, [clientData]);

  return (
    <div className="flex flex-1 flex-col w-full min-h-screen bg-gray-200">
      {clientData && !loading ? (
        <>
          <Banner
            clientData={clientData}
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
        </>
      ) : (
        <p>Loading client data...</p>
      )}
    </div>
  );
};

function ClientInfoSectionToggle({clientData, className}) {
  const [activeSection, setActiveSection] = useState("information");

  return (
    <div className={`flex flex-col max-w-7xl bg-white p-4 rounded-md ${className}`}>
      <div className="flex gap-2 mb-4 md:gap-4">
        <button
          className={`text-xs md:text-base flex-1 px-4 py-2 rounded md:px-4 md:py-2 ${activeSection === "information" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveSection("information")}
        >
          Information
        </button>
        <button
          className={`text-xs md:text-base flex-1 px-2 py-1 rounded md:px-4 md:py-2 ${activeSection === "notes" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveSection("notes")}
        >
          Notes
        </button>
        <button
          className={`text-xs md:text-base flex-1 px-2 py-1 rounded md:px-4 md:py-2 ${activeSection === "timeline" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setActiveSection("timeline")}
        >
          Timeline
        </button>
      </div>
      <div>
        {activeSection === "information" && <Resources clientData={clientData} />}
        {activeSection === "notes" && <Notes clientId={clientData.id} />}
        {activeSection === "timeline" && <Timeline clientId={clientData.id} />}
      </div>
    </div>
  );
}

function Banner({ clientData, className }) {

  // displays profile picture, name, and quick reference info 
  // can add resource and note
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="max-w-7xl flex-1 flex items-center justify-between gap-4 px-4">
        <div className="items-start">
          <div className="flex flex-1 mb-2">
            <Button
              variant="ghost"
              className="flex flex-1 justify-start gap-4 bg-transparent p-2 text-gray-600 p-0 h-auto rounded-md hover:bg-gray-200"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="mr-1 mt-0.5" />
              <div className="text-xs sm:text-sm md:text-md">Back to Dashboard</div>
            </Button>
          </div>
          <div className="flex gap-4">
            <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
              <p>{clientData?.avatar ? <img src={clientData.avatar} alt={`${clientData.firstName} ${clientData.lastName}`} /> : <span>{clientData?.firstName?.charAt(0)}{clientData?.lastName?.charAt(0)}</span>}</p>
            </div>
            <div className="flex flex-col flex-1">
              <div className="flex flex-1 items-center gap-2">
                <div className="font-semibold text-xs sm:text-sm md:text-xl">{clientData?.firstName} {clientData?.lastName}</div>
                <p className="text-muted-foreground text-xs md:text-sm">{clientData?.status}</p>
              </div>
              <div className="flex justify-start text-xs text-muted-foreground gap-4">
                <p><LucideBedDouble className="inline mr-1 " />{clientData?.bedLabel}</p>
                <p>Client ID: {clientData?.clientId}</p>
              </div>
            </div>
          </div>
        </div>
      <div className="flex flex-col md:flex-row gap-2 md:min-w-[350px]">       
        <Button variant="outline" className="flex-1 flex w-full items-center justify-start gap-1">
          <Plus className="inline mr-1 mb-1 h-4" />
         <div className="text-xs">Add Resource</div>
        </Button>
        <Button variant="outline" className="flex-1 flex w-full items-center justify-start gap-1">
          <FilePlus className="inline mr-1 mb-1 h-4" />
          <div className="text-xs">Add Note</div>
        </Button>
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

function Notes({clientId}) {
  return (
    <div className="bg-grey-100 p-4 rounded-md">
      
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

function Resources({clientData}) {
  return (
    <div className="bg-grey-100 p-4 rounded-md">
      <p>Resources for client: {clientData.firstName} {clientData.lastName}</p>
    </div>
  );
}

