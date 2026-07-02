{/* import { useState, useEffect } from 'react' */}
import { useParams, Outlet, useNavigate, useOutletContext, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardPageSkeleton from "@/components/partials/loaderSkeleton/DashboardLoader";
import axios from "axios";
import { useAsyncStatus, loaderTimer } from "@/components/partials/Loading";
import LandingPage from "@/pages/LandingPage";

function DashBoardLayout() {
  const [user, SetUser] = useState(null);
  const [data, SetData] = useState(null);
  const [dashStats, SetDashStats] = useState(null);
  const [openForm, setOpenForm] = useState(null);
  const [notifications, setNotifications] = useState([]);
  // useful for navigation 
  const [mount, SetMount] = useState(false);

  const { error, setError, success, setSuccess, loading, setLoading, loadingDuration, setLoadingDuration } = useAsyncStatus({
    successDuration: 3000, // show success for 3 seconds
  });

  const token = localStorage.getItem("usertoken");
  const navigate = useNavigate();

  // for protected routes with token
  const authRouter = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  // for multer form data (file (avatar img) uploads)
  const authRouterForm = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });

  useEffect(() => {
    if (token) {
      // gets all data 
      try {
        // fetching initial data
        fetchUpdatedData();
        setLoading(true);

      } catch (err) {
        console.error("Error fetching updated data:", err);
      } 
    } else {
      navigate("/login");
    }
  }, [token]);




  const fetchNotifications = async () => {
    try {
      const res = await authRouter.get("/dashboard/notifications");
      setNotifications(res.data);

      // marking notifcations read after loading them???
      // await authRouter.post('/dashboard/notifications/mark-read');
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUpdatedData = async (success) => {
    try {
      const response = await authRouter.get("/dashboard");

      // AXIOS Already Parses JSON, no need for response.json() like fetch !!!! Same on Backend Controllers !
      const result = response.data;

      SetUser(result.user); // (only non sensitive user data from backend)
      SetData(result.globalData); // all clients, notes, referrals for dashboard display, consider separate fetches for each in future if performance issues arise with large data sets
      SetDashStats(result.clientStats); // dashboard stats for summary cards, consider calculating on client side in future if performance issues arise with large data sets

      if (result.user?.mustChangePassword) {
      return navigate("/change-password");
}
      
      await fetchNotifications();

      if (success) {
        setSuccess(true);
      }
    } catch (error) {
      setError(error);
      return navigate("/login"); // redirect to login if token invalid or expired, consider separate error handling for different status codes in future (e.g. 401 vs 403) for better UX
    } 
  };

  if (error) {
    return (
      <div className="flex flex-col items-start justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">An error occurred</h1>
        <p className="text-gray-600 mb-8">{error.message}</p>
        <button
          onClick={() => navigate("/login")}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  if (loading || !data || !user) {
    return <DashboardPageSkeleton />;
  }


  // show Sonner badge upon creating new client, note, referral, ect.
  return (
    <Outlet
      context={{
        user,
        data,
        error,
        fetchUpdatedData,
        fetchNotifications,
        SetMount,
        mount,
        notifications,
        dashStats,
        authRouter,
        authRouterForm,
        openForm,
        setOpenForm,
      }}
    />
  );
}

export default DashBoardLayout;