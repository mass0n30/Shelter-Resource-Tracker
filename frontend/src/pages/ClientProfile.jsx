
import Banner from "../components/profile/Banner";
import Information from "../components/profile/Information";
import Notes from "../components/profile/MainInformation";
import Timeline from "../components/profile/Timeline";
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { useParams } from "react-router-dom";
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
    <div className="flex-1 w-full h-screen p-4 gap-4 grid grid-cols-1 grid-rows-10 md:grid-cols-4
      grid-rows-auto gap-4 p-4">
      {clientData || !loading ? (
        <>
          <Banner clientData={clientData} className="col-span-1 md:col-span-4" />
          <Information clientData={clientData} className="col-span-1 md:col-span-4" />
          <Notes clientId={clientId} className="col-span-1 md:col-span-4" />
          <Timeline clientId={clientId} className="col-span-1 md:col-span-4" />
        </>
      ) : (
        <p>Loading client data...</p>
      )}
    </div>
  );
};