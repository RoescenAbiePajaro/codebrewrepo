'use client';
import SectionHeaders from "@/components/layout/SectionHeaders";
import MenuItem from "@/components/menu/MenuItem";
import { useEffect, useState } from "react";
import UserTabs from "@/components/layout/UserTabs";
import { useSession } from "next-auth/react"; 

export default function MenuPage() {
  const { data: session } = useSession(); // Get session data
  const [categories, setCategories] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('/api/categories').then(res => {
      res.json().then(categories => setCategories(categories));
    });
    fetch('/api/menu-items').then(res => {
      res.json().then(menuItems => setMenuItems(menuItems));
    });
  }, []);

  // Determine if user is admin
  const isAdmin = session?.user?.isAdmin || false;

  // Filter items based on search query
  const filteredMenuItems = menuItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="mt-8 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <UserTabs isAdmin={isAdmin} />
      <div className="flex justify-between items-center mt-8">
        <h2 className="text-xl font-bold">Menu Here</h2>
      </div>

      {/* Search Bar */}
      <div className="text-center mb-8">
        <input
          type="text"
          placeholder="Search products..."
          className="mt-4 px-4 py-2 border rounded"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          onClick={() => setSearchQuery('')}
          className="ml-2 px-4 py-2 bg-green-500 text-white rounded"
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
