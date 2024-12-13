// src\app\menu-notadmin\page.js
'use client';
import SectionHeaders from "@/components/layout/SectionHeaders";
import {useProfile} from "@/components/UseProfile";
import MenuItem from "@/components/menu/MenuItem";
import UserTabs from "../../components/layout/UserTabs";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react"; 

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState([]); // State to store user data
  const {loading, data} = useProfile();
  const { data: session } = useSession();
  
  const isAdmin = session?.user?.isAdmin || false;
  const isPermissions = session?.user?.permissions || true; // Check permissions

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

  if (loading) {
    return 'Loading user info...';
  }
  
  if (!session?.user) {
    return 'Not an User.'; // Check if session and session.user are available
  }
  
  return (
    <section className="mt-8 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
     <UserTabs
        isPermission={user?.permissions}
      />

      {/* Search Bar */}
      <div className="text-center mb-8">
        <input
          type="text"
          placeholder="Search products..."
          className="px-4 py-2 border rounded"
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

      {categories?.length > 0 && categories.map(c => (
        <div key={c._id}>
          <div className="text-center">
            <SectionHeaders mainHeader={c.name} />
          </div>
          <div className="grid sm:grid-cols-3 gap-4 mt-6 mb-12">
            {/* Filtered items */}
            {filteredMenuItems
              .filter(item => item.category === c._id)
              .map(item => (
                <MenuItem key={item._id} {...item} />
              ))}
          </div>
        </div>
      ))}
    </section>
  );
}
