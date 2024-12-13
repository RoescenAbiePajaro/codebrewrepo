'use client';

import React, { useEffect, useState } from 'react';
import UserTabs from '@/components/layout/UserTabs';
import TablePagination from '@mui/material/TablePagination';
import { useProfile } from "@/components/UseProfile";
import Modal from '@/components/layout/Modal';
import CircularProgress from '@mui/material/CircularProgress'; // Import CircularProgress for loading spinner

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { loading: profileLoading, data: profileData } = useProfile();
  const [loading, setLoading] = useState(true); // Track loading state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true); // Set loading to true when starting to fetch data
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const usersData = await response.json();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Failed to load users. Please try again later.');
    } finally {
      setLoading(false); // Set loading to false when fetching is done
    }
  };

  const handleDelete = async (userId) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const response = await fetch(`/api/users?id=${userId}`, { method: 'DELETE' });
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to delete user');
        }
        setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
        alert('User deleted successfully.');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('An error occurred while deleting the user.');
      }
    }
  };

  const handleUserUpdate = async (updatedUserData) => {
    try {
      if (!updatedUserData._id) {
        throw new Error('User ID is required for update');
      }

      const response = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedUserData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user');
      }

      const { user: updatedUser } = await response.json();
      setUsers((prevUsers) =>
        prevUsers.map((user) => (user._id === updatedUser._id ? updatedUser : user))
      );

      alert('User updated successfully.');
    } catch (error) {
      console.error('Error updating user:', error);
      alert(`An error occurred while updating the user: ${error.message}`);
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (profileLoading) {
    return 'Loading user info...';
  }

  if (!profileData?.admin) {
    return 'Not an admin';
  }


  return (
    <section className="mt-8 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <UserTabs isAdmin={true} />
      <div className="mt-8">
        {loading ? ( // Show loading spinner while fetching data
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : (
          users.length > 0 ? (
            users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <div key={user._id} className="bg-gray-100 rounded-lg mb-2 p-1 px-4 flex items-center gap-4">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 grow">
                  <div className="text-gray-900">{user.name || <span className="italic">No name</span>}</div>
                  <span className="text-gray-500">{user.email}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(user)}
                    className="button bg-green-500 text-white rounded px-4 py-1"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="button bg-red-500 text-white rounded px-4 py-1"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No users found.</p>
          )
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
      {selectedUser && (
        <Modal
          user={selectedUser}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onUpdate={handleUserUpdate}
        />
      )}
    </section>
  );
}
