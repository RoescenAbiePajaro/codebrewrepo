'use client';
import { useEffect, useState } from "react";
import { useParams, redirect } from "next/navigation";
import toast from "react-hot-toast";
import MenuItemForm from "@/components/layout/MenuItemForm";
import UserTabs from "@/components/layout/UserTabs";
import Link from "next/link";

export default function EditMenuItemPage() {
  const { id } = useParams();
  const [menuItem, setMenuItem] = useState(null);
  const [redirectToItems, setRedirectToItems] = useState(false);

  useEffect(() => {
    fetch(`/api/menu-items?id=${id}`)
      .then(res => res.json())
      .then(item => setMenuItem(item))
      .catch(err => toast.error("Failed to fetch menu item"));
  }, [id]);

  async function handleFormSubmit(ev, data) {
    ev.preventDefault();
    try {
      const response = await fetch(`/api/menu-items`, {
        method: "PUT",
        body: JSON.stringify({ ...data, _id: id }),
        headers: { "Content-Type": "application/json" },
      });
      if (response.ok) {
        toast.success("Saved");
        setRedirectToItems(true);
      } else {
        toast.error("Failed to save");
      }
    } catch {
      toast.error("Network error");
    }
  }

  if (redirectToItems) {
    return redirect("/menu-items");
  }

  return (
    <section className="mt-8">
      <UserTabs isAdmin={true} />
      <Link href="/menu-items" className="button">
        Show all menu items
      </Link>
      <MenuItemForm menuItem={menuItem} onSubmit={handleFormSubmit} />
    </section>
  );
}
