// src\app\menu-list\page.js
'use client';

import CircularProgress from "@mui/material/CircularProgress";
import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItem from "@/components/menu/MenuItem";
import UserTabs from "../../components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";

import { useEffect, useState } from "react";

export default function MenuPage() {
  const { loading: profileLoading, data: profileData } = useProfile();
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Fetch categories and menu items
  useEffect(() => {
    fetch('/api/categories').then(res => {
      res.json().then(categories => setCategories(categories));
    });
    fetch('/api/menu-items').then(res => {
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
    return (
                 <div className="flex justify-center items-center min-h-screen">
                   <CircularProgress size={60} />
                 </div>
               );
  }

  if (!profileData?.admin) {
    return 'Not an admin';
  }

  
  return (
    <section className="mt-8 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      {/* User Tabs Section */}
      <UserTabs isAdmin={true} />

      {/* Search Bar */}
      <div className="text-center mb-8 p-2 rounded-lg">
        {/* Dropdown for Categories */}
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 w-full rounded-lg border focus:outline-black mb-2 mt-4"
        >
          <option value="">Select a category</option>
          {categories.map(category => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search products or categories..."
          className="p-2 w-full rounded-lg border focus:outline-black mb-2 mt-4"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={() => setSearchQuery('')}
          className="ml-27 px-4 py-2 bg-green-500 text-white rounded "
        >
          Clear
        </button>
      </div>

      {hasSearchQuery && (
        <div className="mb-8">
          {/* Show matched categories */}
          {filteredCategories.length > 0 && (
            <div className="mb-6">
              <ul className="list-none list-inside">
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
              <div className="grid grid-cols-2 gap-4 mt-4">
                {filteredMenuItems.map(item => (
                  <MenuItem key={item._id} {...item} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!hasSearchQuery && (
        categories.map(category => (
          selectedCategory === null || selectedCategory === category._id ? (
            <div key={category._id}>
              <div className="text-center">
                {/* Removed SectionHeaders for category title */}
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6 mb-12">
                {menuItems
                  .filter(item => item.category === category._id)
                  .map(item => (
                    <MenuItem key={item._id} {...item} />
                  ))}
              </div>
            </div>
          ) : null
        ))
      )}

      
    </section>
  );
}
