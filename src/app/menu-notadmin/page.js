'use client';

import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItem from "@/components/menu/MenuItem";
import UserTabs from "../../components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; 

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const { loading: profileLoading, data: profileData } = useProfile();
  const { data: session } = useSession();

  const isAdmin = session?.user?.isAdmin || false;

  // Fetch categories and menu items
  useEffect(() => {
    fetch('https://tealerinmilktea.onrender.com/api/categories').then(res => {
      res.json().then(categories => setCategories(categories));
    });
    fetch('https://tealerinmilktea.onrender.com/api/menu-items').then(res => {
      res.json().then(menuItems => setMenuItems(menuItems));
    });
  }, []);

  // Filter items based on search query
  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const hasSearchQuery = searchQuery.trim().length > 0;

  if (profileLoading) {
    return 'Loading user info...';
  }

  if (!session?.user) {
    return 'Not a User.'; // Ensure user is authenticated
  }

  return (
    <section className="mt-8 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* User Tabs Section */}
      <UserTabs isAdmin={isAdmin} />

      {/* Search Bar */}
      <div className="text-center mb-8 p-2 rounded-lg">
        <input
          type="text"
          placeholder="Search products or categories..."
          className="p-2 w-full rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={() => setSearchQuery('')}
          className="ml-27 px-4 py-2 bg-green-500 text-white rounded"
        >
          Clear
        </button>
      </div>

      {hasSearchQuery && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4">Search Results</h2>
          {/* Show matched categories */}
          {filteredCategories.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold">Categories</h3>
              <ul className="list-disc list-inside">
                {filteredCategories.map(category => (
                  <li key={category._id} className="mt-1">{category.name}</li>
                ))}
              </ul>
            </div>
          )}
          {/* Show matched products */}
          {filteredMenuItems.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold">Products</h3>
              <div className="grid sm:grid-cols-3 gap-4 mt-4">
                {filteredMenuItems.map(item => (
                  <MenuItem key={item._id} {...item} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!hasSearchQuery &&
        categories.map(category => (
          <div key={category._id}>
            <div className="text-center">
              <SectionHeaders mainHeader={category.name} />
            </div>
            <div className="grid sm:grid-cols-3 gap-4 mt-6 mb-12">
              {menuItems
                .filter(item => item.category === category._id)
                .map(item => (
                  <MenuItem key={item._id} {...item} />
                ))}
            </div>
          </div>
        ))}
    </section>
  );
}
