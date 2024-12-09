// src\components\layout\MenuItemForm.js
import Plus from "@/components/icons/Plus";
import Trash from "@/components/icons/Trash";
import EditableImage from "@/components/layout/EditableImage";
import MenuItemPriceProps from "@/components/layout/MenuItemPriceProps";
import { useEffect, useState } from "react";

export default function MenuItemForm({ onSubmit, menuItem }) {
  const [image, setImage] = useState(menuItem?.image || "");
  const [name, setName] = useState(menuItem?.name || "");
  const [description, setDescription] = useState(menuItem?.description || "");
  const [basePrice, setBasePrice] = useState(Number(menuItem?.basePrice) || 0);
  const [sizes, setSizes] = useState(menuItem?.sizes || []);
  const [category, setCategory] = useState(menuItem?.category || "");
  const [categories, setCategories] = useState([]);
  const [extraIngredientPrices, setExtraIngredientPrices] = useState(
    menuItem?.extraIngredientPrices || []
  );

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((categories) => setCategories(categories))
      .catch((err) => console.error("Failed to fetch categories:", err));
  }, []);

  const handleSubmit = (ev) => {
    ev.preventDefault();

    if (!category) {
      alert("Please select a category.");
      return;
    }

    if (!image) {
      alert("Please upload an image.");
      return;
    }

    

    if (basePrice < 0) {
      alert("Base price cannot be negative.");
      return;
    }

    const formData = {
      image,
      name,
      description,
      basePrice: parseFloat(basePrice), // Ensure the price is a valid number
      sizes,
      extraIngredientPrices,
      category,
    };

    onSubmit(ev, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-2xl mx-auto">
      <div
        className="md:grid items-start gap-4"
        style={{ gridTemplateColumns: ".3fr .7fr" }}
      >
        <div>
          <EditableImage link={image} setLink={setImage} />
        </div>
        
        <div className="grow">
          <label>Item name</label>
          <input
            type="text"
            value={name}
            onChange={(ev) => setName(ev.target.value)}
            required
          />
          <label>Description</label>
          <input
            type="text"
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
          />
          <label>Category</label>
          <select
            value={category}
            onChange={(ev) => setCategory(ev.target.value)}
            required
          >
            <option value="" disabled>
              Select a category
            </option>
            {categories?.length > 0 &&
              categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
          </select>
          <label>Base price</label>
<input
  type="number"
  value={basePrice}
  onChange={(ev) => setBasePrice(ev.target.value)}
  min="0"
  step="0.01" // Allow decimal values
  style={{
    appearance: "textfield", // Disables arrows
    padding: "8px 12px", // Adds padding inside the input
    fontSize: "16px", // Sets font size
    borderRadius: "4px", // Rounds the corners
    border: "1px solid #ddd", // Adds a border
    width: "100%", // Makes it full width
    boxSizing: "border-box", // Ensures padding doesn't affect width
  }}
/>

          <MenuItemPriceProps
            name={"Sizes"}
            addLabel={"Add item size"}
            props={sizes}
            setProps={setSizes}
          />
          <MenuItemPriceProps
            name={"Pieces and Product"}
            addLabel={"Add prices"}
            props={extraIngredientPrices}
            setProps={setExtraIngredientPrices}
          />
          <button type="submit">Save</button>
        </div>
      </div>
    </form>
  );
}
