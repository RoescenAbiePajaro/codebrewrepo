'use client';
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export default function ProfilePage() {
  const session = useSession();
  const [nname, setName] = useState(session?.data?.user?.name ||''); //const [userName, setUserName] = useState(session?.data?.user?.name ||'');
  const { status, data } = session;

  async function handleProfileInfoUpdate(ev) {
    ev.preventDefault();
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers:{'Content-Type': 'application/json'},
      body: JSON.stringify({name:nname}), //body: JSON.stringify({name:userName}),
    })

  }

  if (status === 'loading') {
    return 'Loading...';
  }

  if (status === 'unauthenticated') {
    return redirect('/login');
  }

  const userImage = data?.user?.image;

  return (
    <section className="mt-8">
      <h1 className="text-center text-green-500 text-4xl mb-4">
        Profile
      </h1>

      <div className="max-w-xs mx-auto flex flex-col gap-6 items-center">
        <div className="flex flex-col items-center">
          <div className="bg-gray-100 p-2 rounded-lg">
            <Image
              className="rounded-lg"
              src={userImage || '/user.webp'}
              width={96}
              height={96}
              alt="User Avatar"
            />
          </div>
          <button type="button" className="mt-2 text-gray-500">
            Edit
          </button>
        </div>


        <form className="grow" onSubmit={handleProfileInfoUpdate}>
          <input
            className="p-2 border rounded-md w-full" type="text"
            placeholder="Put firstname and lastname"
            value={nname} onChange={ev => setName(ev.target.value)}/>   
          <input 
            type="email" 
            disabled 
            value={data?.user?.email || ''} 
            className="p-2 border rounded-md w-full bg-gray-50"
          />
          <button type="submit" className="bg-green-500 text-white p-2 rounded-md w-full"> Save</button>
        </form>
      </div>
    </section>
  );
}
