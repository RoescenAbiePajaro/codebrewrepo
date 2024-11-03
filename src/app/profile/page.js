'use client';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [userName, setUserName] = useState('');
  const [saved,setSaved] = useState(false);
  const [isSaving, setisSaving] = useState(false);
  useEffect(() => {
    if (status === 'authenticated' && session) {
      setUserName(session.user.name);
    }
  }, [session, status]);

  async function handleProfileInfoUpdate(ev) {
    ev.preventDefault();

    setSaved(false);
    setisSaving(true);
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: userName }),
    });
    setisSaving(false);
    if (response.ok){
      setSaved(true);
    }

  }

async function handleFileChange(ev){
const files = ev?.target.files;
if(files?.length === 1 ){
  const data = new FormData;
  data.set('file', files[0]);
  await fetch('/api/upload'  ,{
    method:'POST',
    body:data,
    // headers:{'Content-Type': 'multipart/form-data'}
});
}
}


  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    redirect('/login');
  }

  // Ensure session.data is defined before accessing user properties
  if (!session) {
    return <div>No user data available.</div>;
  }

  const userImage = session.user.image;

  return (
    <section className="mt-8">
      <h1 className="text-center text-green-500 text-4xl mb-4">Profile</h1>

      <form className="max-w-md mx-auto" onSubmit={handleProfileInfoUpdate}>

        {saved && (
            <h2 className="text-center text-gray-500 bg-green-300 p-4 rounded-lg
            border-1 border-green-300">Profile Saved!</h2>
        )}

        {isSaving && (
          <h2 className="text-center text-gray-500 bg-blue-300 p-4 rounded-lg
          border-1 border-blue-300">Saving...</h2>
        )}
        <div className="flex gap-4 items-center">
          <div>
            <div className="p-2 rounded-lg relative">
              <Image
                className="rounded-lg w-full h-full mb-1"
                src={userImage}
                width={250}
                height={250}
                alt={'avatar'}
              />
              <label>
              <input type="file" className="hidden" onChange={handleFileChange}/>
              <span className="block border rounded-lg border-gray-300 p-2 text-center cursor-pointer">
                Edit 
              </span>
              </label>
            </div>
          </div>
        </div>

        <div className="grow">
          <input
            type="text"
            placeholder="First and last name"
            value={userName}
            onChange={ev => setUserName(ev.target.value)}
          />
          <input
            type="email"
            disabled={true}
            value={session.user.email}
          />
          <button type="submit">Save</button>
        </div>
      </form>
    </section>
  );
}
