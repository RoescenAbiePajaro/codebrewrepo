// src/app/users/page.js
'use client';
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import Link from "next/link";
import { useEffect, useState } from "react";
import TablePagination from '@mui/material/TablePagination'; 

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const { loading, data } = useProfile();
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const usersData = await response.json();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to load users. Please try again later.');
    }
  };

  const handleDelete = async (userId) => {
    const confirmDelete = confirm("Are you sure you want to delete this user?");
    if (confirmDelete) {
      try {
        const response = await fetch(`/api/users/${userId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setUsers(users.filter(user => user._id !== userId));
          alert("User  deleted successfully.");
        } else {
          const responseText = await response.text();
          console.error("Failed to delete user:", responseText);
          let errorMessage;
          try {
            const jsonResponse = JSON.parse(responseText);
            errorMessage = jsonResponse.error || "Failed to delete user.";
          } catch (e) {
            errorMessage = "Failed to delete user. Please try again.";
          }
          alert(errorMessage);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('An error occurred while deleting the user.');
      }
    }
  };

  if (loading) {
    return 'Loading user info...';
  }

  if (!data.admin) {
    return 'Not an admin';
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to first page on rows per page change
  };

  return (
    <section className="mt-8 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <UserTabs isAdmin={true} />
      <div className="mt-8">
        {users.length > 0 ? (
          users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(user => (
            <div
              key={user._id}
              className="bg-gray-100 rounded-lg mb-2 p-1 px-4 flex items-center gap-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 grow">
                <div className="text-gray-900">
                  {!!user.name ? (<span>{user.name}</span>) : (<span className="italic">No name</span>)}
                </div>
                <span className="text-gray-500">{user.email}</span>
              </div>
              <div className="flex gap-2 ">
                <Link className="button bg-green-500 text-white rounded px-4 py-1" href={'/users/' + user._id}>
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="button bg-red-500 text-white rounded px-4 py-1">
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500">No users found.</p>
        )}
      </div>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={users.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </section>
  );
}