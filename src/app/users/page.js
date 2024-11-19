'use client';
import UserTabs from "@/components/layout/UserTabs";
import {useProfile} from "@/components/UseProfile";
import Link from "next/link";
import {useEffect, useState} from "react";

export default function UsersPage() {

  const [users, setUsers] = useState([]);
  const {loading, data} = useProfile();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const response = await fetch('/api/users');
    const usersData = await response.json();
    setUsers(usersData);
  };

  const handleDelete = async (userId) => {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });
  
      // Check if the response is ok
      if (response.ok) {
        setUsers(users.filter(user => user._id !== userId));
        alert("User  deleted successfully.");
      } else {
        const responseText = await response.text(); // Get the response as text
        console.error("Failed to delete user:", responseText);
        
        // Attempt to parse the response as JSON
        let errorMessage;
        try {
          const jsonResponse = JSON.parse(responseText);
          errorMessage = jsonResponse.error || "Failed to delete user.";
        } catch (e) {
          errorMessage = "Failed to delete user. Please try again.";
        }
        alert(errorMessage); // Notify user of the error
      }
    }
  };

  if (loading) {
    return 'Loading user info...';
  }

  if (!data.admin) {
    return 'Not an admin';
  }

  return (
    <section className="max-w-2xl mx-auto mt-8">
      <UserTabs isAdmin={true} />
      <div className="mt-8">
        {users?.length > 0 && users.map(user => (
          <div
            key={user._id}
            className="bg-gray-100 rounded-lg mb-2 p-1 px-4 flex items-center gap-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 grow">
              <div className="text-gray-900">
                {!!user.name && (<span>{user.name}</span>)}
                {!user.name && (<span className="italic">No name</span>)}
              </div>
              <span className="text-gray-500">{user.email}</span>
            </div>
            <div className="flex gap-2">
              <Link className="button" href={'/users/' + user._id}>
                Edit
              </Link>
              <button
                onClick={() => handleDelete(user._id)}
                className="button bg-red-500 text-white rounded px-4 py-1">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
