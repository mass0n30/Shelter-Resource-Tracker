{/* import { useState, useEffect } from 'react' */}
import { useParams, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from 'axios';

function DashBoardLayout() {

  const [user, SetUser] = useState(null);
  const [data, SetData] = useState(null);
  const [notifications, setNotifications] = useState([]);
  // loading state settings
  const [loading, SetLoading] = useState(true);
  const [success, SetSuccess] = useState(false);
  const [error, SetError] = useState(null);

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

  useEffect(() => {
    const timer = setTimeout(() => {
      SetLoading(false);
    }, 2000);

    const successTimer = setTimeout(() => {
      SetSuccess(false);
    }, 5000);
    return () => {
      clearTimeout(timer);
      clearTimeout(successTimer);
    };
  } ,[loading, SetSuccess, SetLoading]);

  useEffect( () => {
    if (token) {
      fetchUser();
    }
  }, [token, loading]);

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

  const fetchUser = async () => {
    try {
      const response = await authRouter.get('/dashboard');
      // AXIOS Already Parses JSON, no need for response.json() like fetch !!!! Same on Backend Controllers !
      const result = response.data;
      
      SetUser(result.user); // (only non sensitive user data from backend)
      SetData(result.globalData); // all clients, notes, referrals for dashboard display, consider separate fetches for each in future if performance issues arise with large data sets
      fetchNotifications();
      // reset boolean fetch after updated posts fetch
    } catch (error) {
      SetError(error);
      return navigate('/login'); // redirect to login if token invalid or expired, consider separate error handling for different status codes in future (e.g. 401 vs 403) for better UX
    } 
  };

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
          fetchUser,
          fetchNotifications,
          loading,
          success,
          SetLoading,
          SetSuccess,
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