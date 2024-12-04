"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import Right from "@/components/icons/Right";
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import MenuItemForm from "@/components/layout/MenuItemForm";

const MenuItemsPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState(null);
  const { loading, data } = useProfile();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const res = await fetch("/api/menu-items");
      const menuItems = await res.json();
      setMenuItems(menuItems);
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
    }
  };

  const handleFormSubmit = async (ev, formData) => {
    ev.preventDefault();
    console.log("Form data being sent:", formData);

    try {
      const response = await fetch(`/api/menu-items/${selectedMenuItem?._id || ""}`, {
        method: selectedMenuItem ? "PUT" : "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        toast.success("Saved successfully!");
        setIsModalOpen(false);
        setSelectedMenuItem(null);
        fetchMenuItems();
      } else {
        const errorResponse = await response.json();
        console.error("Error saving item:", errorResponse);
        toast.error(`Failed to save the item. Error: ${errorResponse.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to save the item.");
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const response = await fetch(`/api/menu-items?_id=${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast.success("Item deleted successfully!");
        fetchMenuItems();
      } else {
        const errorResponse = await response.json();
        console.error("Error deleting item:", errorResponse);
        toast.error(`Failed to delete the item. Error: ${errorResponse.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting item:", error);
      toast.error("Failed to delete the item.");
    }
  };

  const openEditModal = (item) => {
    setSelectedMenuItem(item);
    setIsModalOpen(true);
  };

  if (loading) return "Loading user info...";
  if (!data?.admin) return "Not an admin.";

  return (
    <section className="mt-8 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <UserTabs isAdmin={true} />
      <div className="mt-8">
        <button
          className="button flex items-center"
          onClick={() => {
            setSelectedMenuItem(null);
            setIsModalOpen(true);
          }}
        >
          <span>Create new menu item</span>
          <Right />
        </button>
      </div>
      <div>
        <h2 className="text-sm text-gray-500 mt-8">Edit menu item:</h2>
        <div className="grid grid-cols-3 gap-4">
          {menuItems?.map((item) => (
            <div
              key={item._id}
              className="bg-gray-200 rounded-lg p-4 flex flex-col justify-between"
            >
              <div
                className="relative flex justify-center items-center cursor-pointer"
                onClick={() => openEditModal(item)}
              >
                <Image
                  className="rounded-md object-cover"
                  src={item.image}
                  alt={item.name}
                  width={200}
                  height={200}
                />
              </div>
              <div className="text-center mt-2">{item.name}</div>
              <button
                onClick={() => handleDelete(item._id)}
                className="mt-auto bg-red-500 text-white p-2 rounded-md"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
            <h3 className="text-lg font-semibold">
              {selectedMenuItem ? "Edit Menu Item" : "Create New Menu Item"}
            </h3>
            <MenuItemForm
              onSubmit={handleFormSubmit}
              initialData={selectedMenuItem}
            />
            <button
              onClick={() => {
                setIsModalOpen(false);
                setSelectedMenuItem(null);
              }}
              className="absolute top-4 right-4 text-gray-600"
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default MenuItemsPage;
