'use client';

import React, { useEffect, useState } from 'react';
import UserTabs from '@/components/layout/UserTabs';
import TablePagination from '@mui/material/TablePagination';
import { useProfile } from "@/components/UseProfile";
import Modal from '@/components/layout/Modal';
import CircularProgress from '@mui/material/CircularProgress';
import toast from 'react-hot-toast';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { loading: profileLoading, data: profileData } = useProfile();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const usersData = await response.json();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
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
        toast.success('User deleted successfully.');
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('An error occurred while deleting the user.');
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

      const result = await response.json();
      toast.success("User updated successfully");
      onClose(); // Close the modal on success

    } catch (error) {
      console.error('Error updating user:', error);
      toast.error(`An error occurred while updating the user: ${error.message}`);
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
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress size={60} />
      </div>
    );
  }

  if (!profileData?.admin) {
    return <p className="text-center text-red-500 mt-10">Access Denied. You are not an admin.</p>;
  }

  return (
    <section className="mt-8 max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <UserTabs isAdmin={true} />
      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center items-center">
            <CircularProgress size={60} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.length > 0 ? (
              users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                <div
                  key={user._id}
                  className="bg-gray-100 shadow-sm rounded-lg p-4 flex flex-col justify-between gap-4"
                >
                  <div className="flex flex-col">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {user.name || <span className="italic text-gray-500">No Name</span>}
                    </h3>
                    <p className="text-sm text-gray-600 break-words">{user.email}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user._id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 col-span-full text-center">No users found.</p>
            )}
          </div>
        )}
      </div>
      <div className="mt-6">
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </div>
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
