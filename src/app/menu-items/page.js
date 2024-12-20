'use client';
import Right from "@/components/icons/Right";
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";

export default function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query
  const { loading, data } = useProfile();

  useEffect(() => {
    fetch('/api/menu-items').then(res => {
      res.json().then(menuItems => {
        setMenuItems(menuItems);
      });
    });
  }, []);

  if (loading) {
     return (
                  <div className="flex justify-center items-center min-h-screen">
                    <CircularProgress size={60} />
                  </div>
                );
  }

  if (!data.admin) {
    return 'Not an admin.';
  }

  // Filter the menu items based on the search query
  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="mt-8 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <UserTabs isAdmin={true} />
      <div className="mt-8">
        <Link
          className="font-semibold flex items-center justify-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg shadow hover:bg-green-600"
          href={'/menu-items/new'}>
          <span>Create new menu item</span>
          <Right />
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mt-8">
        <input
          type="text"
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 w-full rounded-lg border focus:outline-black"
        />
      </div>

      <div>
        <h2 className="text-sm text-gray-500 mt-8">Edit menu item:</h2>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {filteredMenuItems?.length > 0 && filteredMenuItems.map(item => (
            <Link
              key={item._id}
              href={'/menu-items/edit/' + item._id}
              className="bg-gray-100 hover:bg-gray-200 transition p-4 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="relative mb-4">
                <Image
                  className="rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                  src={item.image} alt={item.name} width={200} height={200} />
              </div>
              <div className="text-lg font-medium text-gray-700">
                {item.name}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
