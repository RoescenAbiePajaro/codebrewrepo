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
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [loadingMenuItems, setLoadingMenuItems] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryResponse = await fetch('/api/categories');
        const menuResponse = await fetch('/api/menu-items');

        if (!categoryResponse.ok || !menuResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const categoriesData = await categoryResponse.json();
        const menuItemsData = await menuResponse.json();

        setCategories(categoriesData);
        setMenuItems(menuItemsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingCategories(false);
        setLoadingMenuItems(false);
      }
    };

    fetchData();
  }, []);

  const isAdmin = session?.user?.isAdmin || false;

  // Filter menu items based on search query
  const filteredMenuItems = menuItems.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter items based on selected category
  const displayedItems = selectedCategory 
    ? filteredMenuItems.filter(item => item.category === selectedCategory) 
    : filteredMenuItems;

  if (loadingCategories || loadingMenuItems) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

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

      {/* Category Filters */}
      {categories?.length > 0 && (
        <div className="mb-8 bg-gray-50 p-4 rounded-lg shadow-md">
          <div className="flex justify-start flex-wrap gap-4">
            <button
              className={`px-6 py-3 border rounded-lg m-2 transition-all duration-300 w-32 ${
                selectedCategory === null ? 'bg-green-500 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-green-100'
              }`}
              onClick={() => setSelectedCategory(null)}
            >
              All Categories
            </button>
            {categories.map(c => (
              <button
                key={c._id}
                className={`px-6 py-3 border rounded-lg m-2 transition-all duration-300 w-32 ${
                  selectedCategory === c._id ? 'bg-green-500 text-white' : 'bg-white text-gray-700 border-gray-300 hover:bg-green-100'
                }`}
                onClick={() => setSelectedCategory(c._id)}
              >
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Menu Items */}
      {categories?.length > 0 && categories.map(c => (
        <div key={c._id}>
          {displayedItems.filter(item => item.category === c._id).length > 0 && (
            <div className="text-center">
              <SectionHeaders mainHeader={c.name} />
            </div>
          )}

          <div className="grid sm:grid-cols-3 gap-4 mt-6 mb-12">
            {displayedItems
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
