{/* import { useState, useEffect } from 'react' */}
import { useParams, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from 'axios';
import { useAsyncStatus } from "@/components/partials/Loading";
import { tr } from "date-fns/locale";

function DashBoardLayout() {

  const [user, SetUser] = useState(null);
  const [data, SetData] = useState(null);
  const [notifications, setNotifications] = useState([]);

  // useful for navigation 
  const [mount, SetMount] = useState(false);

  const token = localStorage.getItem('usertoken');
  const navigate = useNavigate();
  
  // for protected routes with token
  const authRouter = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', 
      },
  });

  // for multer form data (file (avatar img) uploads)
  const authRouterForm = axios.create({
    baseURL: `${import.meta.env.VITE_API_URL}`,
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data', 
      },
  });

  const { success, setSuccess, loading, setLoading, error, setError } = useAsyncStatus({loadingDuration: 2000, successDuration: 3000});

  useEffect( () => {
    if (token) {
      // gets all data 
      try {
        setLoading(true);
        fetchUpdatedData();
      } catch (error) {
        setError(error);
      } 
    } else {
      navigate('/login');
    }
  }, [token]);

  const fetchNotifications = async () => {
    try {
      const res = await authRouter.get('/dashboard/notifications');
      setNotifications(res.data);
      
      // marking notifcations read after loading them???
      // await authRouter.post('/dashboard/notifications/mark-read');
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUpdatedData = async () => {
    try {
      const response = await authRouter.get('/dashboard');
      // AXIOS Already Parses JSON, no need for response.json() like fetch !!!! Same on Backend Controllers !
      const result = response.data;
      
      SetUser(result.user); // (only non sensitive user data from backend)
      SetData(result.globalData); // all clients, notes, referrals for dashboard display, consider separate fetches for each in future if performance issues arise with large data sets
      fetchNotifications();
      // reset boolean fetch after updated posts fetch
    } catch (error) {
      setError(error);
      return navigate('/login'); // redirect to login if token invalid or expired, consider separate error handling for different status codes in future (e.g. 401 vs 403) for better UX
    } 
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">An error occurred</h1>
        <p className="text-gray-600 mb-8">{error.message}</p>
        <button
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Go to Login
        </button>
      </div>
    );
  }

  // skeleton loader Navbar/sidebar, ect. 
  if (loading || !data || !user) {
    return (
      <>
        <main className="flex justify-center mt-8 px-4">
          <div className="w-full max-w-7xl">
            <div className="w-full h-48 bg-gray-100 rounded-lg" />
          </div>
        </main>
      </>
    );
  }
  
  // show Sonner badge upon creating new client, note, referral, ect.
 if (data ) {
  return (
    <>
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
          authRouter,
          authRouterForm,
        }}
      />
  </>
);
 }
}

export default DashBoardLayout;