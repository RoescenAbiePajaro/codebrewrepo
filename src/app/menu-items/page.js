'use client';
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Link from "next/link";
import Image from "next/image";
import Right from "@/components/icons/Right";
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import MenuItemForm from "@/components/layout/MenuItemForm"; // Import the MenuItemForm component

export default function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    try {
      const response = await fetch("/api/menu-items", {
        method: "POST",
        body: JSON.stringify(formData),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        toast.success("Saved successfully!");
        setIsModalOpen(false);
        fetchMenuItems();
      } else {
        throw new Error("Failed to save");
      }
    } catch (error) {
      toast.error("Failed to save the item.");
    }
  };

  if (loading) return "Loading user info...";
  if (!data?.admin) return "Not an admin.";

  return (
    <section className="mt-8 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <UserTabs isAdmin={true} />
      <div className="mt-8">
        <button
          className="button flex items-center"
          onClick={() => setIsModalOpen(true)}
        >
          <span>Create new menu item</span>
          <Right />
        </button>
      </div>
      <div>
        <h2 className="text-sm text-gray-500 mt-8">Edit menu item:</h2>
        <div className="grid grid-cols-3 gap-2">
          {menuItems?.map((item) => (
            <Link
              key={item._id}
              href={`/menu-items/edit/${item._id}`}
              className="bg-gray-200 rounded-lg p-4"
            >
              <div className="relative">
                <Image
                  className="rounded-md"
                  src={item.image}
                  alt={item.name}
                  width={200}
                  height={200}
                />
              </div>
              <div className="text-center">{item.name}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Modal for Creating New Menu Item */}
      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl"> {/* Increased width */}
            <h3 className="text-lg font-semibold">Create New Menu Item</h3>
            <MenuItemForm onSubmit={handleFormSubmit} />
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-600" // Adjusted position
            >
              &times;
            </button>
          </div>
        </div>
      )}
    </section>
  );
}