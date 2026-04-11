{/* import { useState, useEffect } from 'react' */}
import { useParams, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ClientForm from "../components/forms/ClientForm";
import axios from 'axios';

function DashBoard() {

  const [user, SetUser] = useState(null);
  const [allData, SetAllData] = useState(null);
  const [data, SetData] = useState(null);
  // loading state settings
  const [loading, SetLoading] = useState(true);
  const [success, SetSuccess] = useState(false);
  const [error, SetError] = useState(null);

  // useful for navigation 
  const [mount, SetMount] = useState(false);

  const [toggle, SetToggle] = useState(true);
  const [toggleForm, SetToggleForm] = useState(false);

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


  //spinner upon mount with delay, post creation message with delay
  useEffect(() => {
    const timer = setTimeout(() => {
      SetLoading(false);
    }, 2000);

    const successTimer = setTimeout(() => {
      SetSuccess(false);
    }, 5000);
    return () => clearTimeout(timer, successTimer); 
  } ,[loading, SetSuccess, SetLoading]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/dashboard');

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        
        SetUser(result.user); // (only non sensitive user data from backend)
        SetAllData(result.globalData); 
        // reset boolean fetch after updated posts fetch
      } catch (error) {
        SetError(error);
      } 
    };
    // initiate GET home fetch if there's a token else continue guest mode
     if (token) {
      fetchUser();
     } 

  }, [token, mount]);  // token dependency?
  // skeleton loader Navbar/sidebar, ect. 
  if (loading) {
    return (
      <>
        <Navbar authRouter={authRouter} authRouterForm={authRouterForm} />

        <main className="flex justify-center mt-8 px-4">
          <div className="w-full max-w-7xl">
            <div className="w-full h-48 bg-gray-100 rounded-lg" />
          </div>
        </main>

        <Footer />
      </>
    );
  }

  // show Sonner badge upon creating new client, note, referral, ect.
return (
  <>
    <Navbar className="bg-white shadow" authRouter={authRouter} authRouterForm={authRouterForm} />

    <main className="flex justify-center px-4 py-6">
      <div className="w-full max-w-7xl flex">

        {toggleForm && (
          <ClientForm
            SetToggleForm={SetToggleForm}
            authRouter={authRouter}
            authRouterForm={authRouterForm}
          />
        )}

        <Outlet
          context={{
            user,
            data,
            loading,
            success,
            SetLoading,
            SetSuccess,
            SetMount,
            mount,
            authRouter,
            authRouterForm,
          }}
        />

      </div>
    </main>

    <Footer />
  </>
);
}

export default DashBoard;