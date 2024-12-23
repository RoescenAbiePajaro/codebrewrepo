'use client';
import UserTabs from "@/components/layout/UserTabs";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useProfile } from "@/components/UseProfile";
import ReceiptModal from "@/components/layout/ReceiptModal";
import * as XLSX from "xlsx";
import TablePagination from "@mui/material/TablePagination";
import DownloadIcon from "@mui/icons-material/Download";
import CircularProgress from "@mui/material/CircularProgress";

const ReceiptPage = () => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const { loading: profileLoading, data: profileData } = useProfile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userName, setUserName] = useState(user?.name || ''); 
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const router = useRouter();

  const fetchReceipts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/receipt", { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch receipts");
      const data = await response.json();
      setReceipts(data);
    } catch (error) {
      console.error("Error fetching receipts:", error);
      toast.error("Failed to load receipts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
    const interval = setInterval(fetchReceipts, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleView = (receipt) => {
    setSelectedReceipt(receipt);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    setDeleteLoading(true);
    try {
      const response = await fetch(`/api/receipt?id=${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete receipt");
      setReceipts((prevReceipts) =>
        prevReceipts.filter((receipt) => receipt._id !== id)
      );
      toast.success("Receipt deleted successfully");
    } catch (error) {
      console.error("Error deleting receipt:", error);
      toast.error(error.message);
    } finally {
      setDeleteLoading(false);
    }
  };
  const handleDownloadExcel = () => {
    if (receipts.length === 0) {
      toast.error("No data available for download.");
      return;
    }
  
    const worksheet = XLSX.utils.json_to_sheet(
      receipts.map((receipt) => {
        const basePrices = receipt.cartProducts?.map((product) => `₱${product.basePrice.toFixed(2)}`).join(", ");
        const sizes = receipt.cartProducts?.map((product) =>
          product.size?.map((size) => `${size.name} (₱${size.price.toFixed(2)})`).join(", ")
        ).join(", ") || "N/A";
        const extras = receipt.cartProducts?.map((product) =>
          product.extras?.map((extra) => `${extra.name} (₱${extra.price.toFixed(2)})`).join(", ")
        ).join(", ") || "N/A";
        const extraIngredients = receipt.cartProducts?.map((product) =>
          product.extras?.map((ingredient) => ingredient.name).join(", ")
        ).join(", ") || "N/A";
  
        const total = receipt.cartProducts.reduce((acc, product) => {
          let productTotal = product.basePrice;
          if (product.size) {
            productTotal += product.size.reduce((sum, size) => sum + size.price, 0);
          }
          if (product.extras) {
            productTotal += product.extras.reduce((sum, extra) => sum + extra.price, 0);
          }
          return acc + productTotal;
          
        }, 0);
  
        return {
          "User Name": receipt.name?.userName || "N/A", // receipt.name?.userName //receipt.customer.staffname
          Subtotal: `₱${total.toFixed(2)}`, // Use total instead of subtotal
          "Created At": new Date(receipt.createdAt).toLocaleString("en-PH"),
          Sizes: sizes,
          Extras: extras,
          ExtraIngredients: extraIngredients,
          // Separate BasePrices for each product dynamically
          ...receipt.cartProducts.reduce((acc, product, index) => {
            acc[`BasePrice ${index + 1}`] = `₱${product.basePrice.toFixed(2)}`;
            return acc;
          }, {}),
        };
      })
    );
  
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Receipts");
    XLSX.writeFile(workbook, "receipts.xlsx");
  };
  
  

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (profileLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress size={60} />
      </div>
    );
  }

  if (!profileData?.admin) {
    return "Not an admin";
  }

  return (
    <section className="mt-8 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <UserTabs isAdmin={true} />
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={handleDownloadExcel}
          className="bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <DownloadIcon /> Download Excel
        </button>
      </div>
      <div className="mt-8">
        {loading ? (
          <div className="flex justify-center items-center">
            <CircularProgress />
          </div>
        ) : receipts.length > 0 ? (
          receipts
            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            .map((receipt) => (
              <div
                key={receipt._id}
                className="bg-gray-100 rounded-lg mb-2 p-4 flex items-center gap-4"
              >
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 grow">
                  <div className="text-gray-900">
                    {receipt.name ? (
                      <span>{receipt.name.UserName}</span>
                    ) : (
                      <span className="italic">No Name</span>
                    )}
                  </div>
                  <span className="text-gray-500">
                    ₱{receipt.subtotal.toFixed(2)}
                  </span>
                  
                  <span className="text-gray-500 text-sm">
                    {new Date(receipt.createdAt).toLocaleString("en-PH")}
                  </span>
                  {receipt.sizes?.length > 0 && (
                    <span className="text-sm">
                      Sizes: {receipt.sizes.map((size) => size.name).join(", ")}
                    </span>
                  )}
                  {receipt.extras?.length > 0 && (
                    <span className="text-sm text-gray-500">
                      Extras: {receipt.extras.map((extra) => `${extra.name} (₱${extra.price})`).join(", ")}
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleView(receipt)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleDelete(receipt._id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                    disabled={deleteLoading}
                  >
                    {deleteLoading ? "" : "Delete"}
                  </button>
                </div>
              </div>
            ))
        ) : (
          <p className="text-gray-500">No receipts found.</p>
        )}
      </div>
      <ReceiptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        receipt={selectedReceipt}
      />
      <TablePagination
        component="div"
        count={receipts.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ backgroundColor: "white", overflow: "hidden" }}
      />
    </section>
  );
};

export default ReceiptPage;

