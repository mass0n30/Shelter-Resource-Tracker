{/* import { useState, useEffect } from 'react' */}
import { useParams, Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Shell from "../primitives/Shell";
import axios from 'axios';

function Home() {

  const [user, SetUser] = useState(null);
  const [guestMode, SetGuestMode] = useState(false);
  const [data, SetData] = useState(null);
  // loading state settings
  const [loading, SetLoading] = useState(true);
  const [success, SetSuccess] = useState(false);
  const [error, SetError] = useState(null);

  // useful for navigation 
  const [mount, SetMount] = useState(false);

  const [toggle, SetToggle] = useState(true);

  const token = localStorage.getItem('usertoken');
  const navigate = useNavigate();
  
  // for protected routes with axios instance
  const authRouter = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', 
    }
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

  // USE AXIOS FOR CLEANER FETCH BLOCKS
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:5000/dashboard', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json', 
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        
        SetUser(result.user); // (only non sensitive user data from backend)
        // SetData(result.posts);
        // reset boolean fetch after updated posts fetch
      } catch (error) {
        SetError(error);
      } 
    };

    const fetchGuestMode = async () => {
      try {
                                        //using env variable for base URL ???                                          
        const response = await fetch(`${import.meta.env.VITE_API_URL}/home/guest`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json', 
          },
        });
        if (!response.ok) {
          navigate('/');

          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        SetGuestMode(true);
        // SetData(result.data);

        // reset boolean fetch after updated posts fetch
      } catch (error) {
        SetError(error);
      } 
    };

    // initiate GET home fetch if there's a token else continue guest mode
     if (token) {
      fetchUser();
     } else {
      fetchGuestMode();
     }

  }, [token, mount]);  // token dependency?

  if (error) {
    return <div>Error: {error.message}</div>;
  }
  
  // skeleton loader Navbar/sidebar, ect. 
  if (loading) {
    return (
      <>
      <Navbar/>
        <main style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
          <Shell>
             <div style={{ width: "100%", height: "200px", backgroundColor: "#f0f0f0", borderRadius: "8px" }}></div>
          </Shell>
        </main>
      <Footer/>
      </>
    );
  }

  return (
    <>
    <Navbar/>
      <Shell>
        <Outlet context={{user, data, loading, success, SetLoading, SetSuccess, SetMount, mount }} />
      </Shell>
    <Footer/>
    </>


  )
}

export default Home;