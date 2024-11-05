'use client';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import InfoBox from "../components/layout/InfoBox";
import SuccessBox from "../components/layout/SuccesBox";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Link from "next/link";
import UserTabs from "../components/layout/UserTabs";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  console.log(session);
  const [userName, setUserName] = useState('');
  const [image, setImage] = useState('');
  const [phone, setPhone] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileFetched, setProfileFetched] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      setUserName(session.user.name);
      setImage(session.user.image);
    fetch('/api/profile').then(response => {
      response.json().then(data => {
        setPhone(data.phone);
        setStreetAddress(data.streetAddress);
        setIsAdmin(data.admin);
        setProfileFetched(true);
      })
    });
  }
}, [session, status]);

  async function handleProfileInfoUpdate(ev) {
    ev.preventDefault();
    setSaved(false);
    setIsSaving(true);

    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: userName, 
        image,
        phone,
        streetAddress
       }),
    });
    setIsSaving(false);

    if (response.ok) {
      setSaved(true);
      const data = await response.json();
      setImage(data.image || image);
    }
  }

  async function handleFileChange(ev) {
    const files = ev?.target.files;
    if (files?.length === 1) {
      const data = new FormData();
      data.set('file', files[0]);

      toast.info('Uploading...');
      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: data,
        });
        if (response.ok) {
          const link = await response.json();
          setImage(link);
          toast.success('Upload complete!');
        } else {
          console.error('Image upload failed');
          toast.error('Image upload failed');
        }
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Error uploading image');
      }
    }
  }

  if (status === 'loading' || !profileFetched) {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    redirect('/login');
  }

  if (!session || !session.user) {
    return <div>No user data available.</div>;
  }

  return (
    <section className="mt-8">
      <ToastContainer position="top-center" autoClose={3000} />


      <UserTabs isAdmin={isAdmin} />
      <div className="max-w-md mx-auto mt-4"></div>
{/* *******************PROFILE PAGE***************************************************************** */}
<div className="flex gap-4"></div>

      <form className="max-w-md mx-auto" onSubmit={handleProfileInfoUpdate}>
        {saved && <SuccessBox>Profile saved!</SuccessBox>}
        {isSaving && <InfoBox>Saving...</InfoBox>}

        <div className="flex flex-col items-center gap-4">
          <div className="p-2 rounded-lg relative max-w-[120px]">
            {image && (
              <Image
                className="rounded-lg w-full h-full mb-1"
                src={image}
                width={250}
                height={250}
                alt="avatar"
              />
            )}
            <label className="flex flex-col items-center">
              <input type="file" className="hidden" onChange={handleFileChange} />

              <span className="block border rounded-lg border-gray-300 p-2 text-center cursor-pointer">
                Edit
              </span>
            </label>
          </div>
        </div>

        <div className="mt-4 ">

          <label className="font-semibold text-sm text-gray-600">First and Last Name</label>
          <input
            type="text"
            placeholder="First and last name:"
            value={userName}
            onChange={ev => setUserName(ev.target.value)}
            className="block w-full border p-2 rounded mb-4"
          />

          <label className="font-semibold text-sm text-gray-600">Email:</label>
          <input type="email" disabled={true} value={session.user.email} placeholder={'email'}/>


          <label className="font-semibold text-sm text-gray-600">Phone Number:</label>
          <input type="tel" placeholder="Phone Number"
          value={phone}
          onChange={ev => setPhone(ev.target.value)}/>


          <label className="font-semibold text-sm text-gray-600">Street Address:</label>
          <input type="text" placeholder="StreetAddress"
          value={streetAddress}
          onChange={ev => setStreetAddress(ev.target.value)}/>
          
          
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Save
          </button>
        </div>
      </form>
    </section>
  );
}
