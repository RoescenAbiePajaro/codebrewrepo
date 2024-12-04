import { useEffect, useState } from "react";
import EditableImage from "@/components/layout/EditableImage";
import MenuItemPriceProps from "@/components/layout/MenuItemPriceProps";

export default function MenuItemForm({ onSubmit, menuItem = {} }) {
  const [image, setImage] = useState(menuItem?.image || '');
  const [name, setName] = useState(menuItem?.name || '');
  const [description, setDescription] = useState(menuItem?.description || '');
  const [basePrice, setBasePrice] = useState(menuItem?.basePrice || '');
  const [sizes, setSizes] = useState(menuItem?.sizes || []);
  const [category, setCategory] = useState(menuItem?.category || '');
  const [categories, setCategories] = useState([]);
  const [extraIngredientPrices, setExtraIngredientPrices] = useState(menuItem?.extraIngredientPrices || []);

  useEffect(() => {
    fetch('/api/categories').then(res => {
      res.json().then(categories => {
        setCategories(categories);
      });
    });
  }, []);

  const handleSubmit = (ev) => {
    ev.preventDefault();
    
    if (!name || !basePrice) {
      alert("Name and base price are required.");
      return;
    }
  
    // Ensure category is either a valid ObjectId or null
    const categoryValue = category || null;
  
    const formData = {
      image,
      name,
      description,
      basePrice,
      sizes,
      extraIngredientPrices,
      category: categoryValue,  // Ensure category is either a valid ID or null
    };
  
    onSubmit(ev, formData);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-8 max-w-full mx-auto">
      <div className="md:grid items-start gap-4" style={{ gridTemplateColumns: '.3fr .7fr' }}>
        <div>
          <EditableImage link={image} setLink={setImage} />
        </div>
        <div className="grow">
          <label>Item name</label>
          <input type="text" value={name} onChange={(ev) => setName(ev.target.value)} />
          
          <label>Description</label>
          <input type="text" value={description} onChange={(ev) => setDescription(ev.target.value)} />
          
          <label>Category</label>
          <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
            {categories?.length > 0 && categories.map(c => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
          
          <label>Base price</label>
          <input type="text" value={basePrice} onChange={(ev) => setBasePrice(ev.target.value)} />
          
          <MenuItemPriceProps name={'Sizes'} addLabel={'Add item size'} props={sizes} setProps={setSizes} />
          <MenuItemPriceProps name={'Pieces and Product'} addLabel={'Add prices'} props={extraIngredientPrices} setProps={setExtraIngredientPrices} />
          
          <button type="submit">Save</button>
        </div>
      </div>
    </form>
  );
}
