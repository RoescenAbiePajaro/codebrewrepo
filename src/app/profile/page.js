// src\app\profile\page.js
'use client';

import UserForm from "@/components/layout/UserForm";
import UserTabs from "@/components/layout/UserTabs";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress for loading spinner

export default function ProfilePage() {
  const session = useSession();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileFetched, setProfileFetched] = useState(false);
  const [loading, setLoading] = useState(false); // Add loading state
  const { status } = session;

  useEffect(() => {
    // Redirect to login page if the user is unauthenticated
    if (status === 'unauthenticated') {
      redirect('/login');
      return;
    }

    if (status === 'authenticated') {
      setLoading(true); // Set loading to true while fetching
      fetch('/api/profile')
        .then(response => response.json())
        .then(data => {
          if (data) {
            setUser(data);
            setIsAdmin(data.admin || false);
          }
          setProfileFetched(true);
          setLoading(false); // Set loading to false after fetching
        })
        .catch(error => {
          console.error("Error fetching profile:", error);
          setProfileFetched(true);
          setLoading(false); // Set loading to false in case of error
        });
    }
  }, [session, status]);

  async function handleProfileInfoUpdate(ev, data) {
    ev.preventDefault();

    const savingPromise = new Promise(async (resolve, reject) => {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const updatedData = await response.json();
        setUser(updatedData.user); // Update state with the latest data
        resolve();
      } else {
        const errorData = await response.json();
        reject(errorData.error || 'Failed to update profile');
      }
    });

    await toast.promise(savingPromise, {
      loading: 'Saving...',
      success: 'Profile Saved!',
      error: (err) => err,
    });
  }

  if (status === 'loading' || !profileFetched || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress /> {/* Show spinner while loading */}
      </div>
    );
  }

  return (
    <section className="mt-8 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <UserTabs isAdmin={isAdmin} />
      <div className="max-w-2xl mx-auto mt-8">
        <UserForm user={user || {}} onSave={handleProfileInfoUpdate} />
      </div>
    </section>
  );
}
