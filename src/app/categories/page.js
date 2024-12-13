'use client';
import DeleteButton from "@/components/DeleteButton";
import UserTabs from "@/components/layout/UserTabs";
import { useEffect, useState } from "react";
import { useProfile } from "@/components/UseProfile";
import toast from "react-hot-toast";
import TablePagination from '@mui/material/TablePagination'; // Make sure to import this

export default function CategoriesPage() {
  const [categoryName, setCategoryName] = useState('');
  const [categories, setCategories] = useState([]);
  const { loading: profileLoading, data: profileData } = useProfile();
  const [editedCategory, setEditedCategory] = useState(null);
  
  // Pagination state
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchCategories();
  }, []);

  function fetchCategories() {
    fetch('/api/categories')
      .then(res => res.json())
      .then(categories => {
        setCategories(categories);
      })
      .catch(err => {
        toast.error('Failed to fetch categories');
        console.error(err);
      });
  }

  async function handleCategorySubmit(ev) {
    ev.preventDefault();
    const data = { name: categoryName };
    if (editedCategory) {
      data._id = editedCategory._id;
    }
    
    const method = editedCategory ? 'PUT' : 'POST';
    const response = await fetch('/api/categories', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      setCategoryName('');
      fetchCategories();
      setEditedCategory(null);
      toast.success(editedCategory ? 'Category updated' : 'Category created');
    } else {
      toast.error('Error, sorry...');
    }
  }

  async function handleDeleteClick(_id) {
    const response = await fetch(`/api/categories?_id=${_id}`, {
      method: 'DELETE',
    });

    if (response.ok) {
      toast.success('Deleted');
      fetchCategories();
    } else {
      toast.error('Error deleting category');
    }
  }

  if (profileLoading) {
    return 'Loading user info...';
  }

  if (!profileData?.admin) {
    return 'Not an admin';
  }

  return (
    <section className="mt-8 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <UserTabs isAdmin={true} />
      <form className="mt-8" onSubmit={handleCategorySubmit}>
        <div className="flex gap-2 items-end">
          <div className="grow">
            <label>
              {editedCategory ? 'Update category' : 'New category name'}
              {editedCategory && (
                <>: <b>{editedCategory.name}</b></>
              )}
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={ev => setCategoryName(ev.target.value)}
            />
          </div>
          <div className="pb-2 flex gap-2">
            <button className="border border-green-500" type="submit">
              {editedCategory ? 'Update' : 'Create'}
            </button>
            <button
              type="button"
              onClick={() => {
                setEditedCategory(null);
                setCategoryName('');
              }}>
              Cancel
            </button>
          </div>
        </div>
      </form>
      <div>
        <h2 className="mt-8 text-sm text-gray-500">Existing categories</h2>
        {categories?.length > 0 && categories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(c => (
          <div
            key={c._id}
            className="bg-gray-100 rounded-xl p- 2 px-4 flex gap-1 mb-1 items-center">
            <div className="grow">
              {c.name}
            </div>
            <div className="flex gap-1">
              <button className="button bg-green-500 text-white rounded px-4 py-1"
                      onClick={() => {
                        setEditedCategory(c);
                        setCategoryName(c.name);
                      }}
              >
                Edit
              </button>
              <DeleteButton 
                className="bg-red-500 text-white rounded px-4 py-1 hover:bg-red-600"
                label="Delete"
                onDelete={() => handleDeleteClick(c._id)} 
              />
            </div>
          </div>
        ))}
      </div>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={categories.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={(event, newPage) => setPage(newPage)}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
      />
    </section>
  );
}