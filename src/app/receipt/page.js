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
      receipts.map((receipt) => ({
        "Staff Name": receipt.customer?.staffname || "N/A",
        Subtotal: `₱${receipt.subtotal.toFixed(2)}`,
        "Created At": new Date(receipt.createdAt).toLocaleString("en-PH"),
      }))
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
    return 'Loading user info...';
  }

  if (!profileData?.admin) {
    return 'Not an admin';
  }

  return (
    <section className="mt-8 max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <UserTabs isAdmin={true} />
      <div className="flex justify-between items-center mt-8">
        <h2 className="text-xl font-bold">Receipts</h2>
        
      </div>
      <button
          onClick={handleDownloadExcel}
          className=" bg-green-500 text-white rounded-md hover:bg-green-600"
        >
          <DownloadIcon /> Download Excel
        </button>
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
                    {receipt.customer ? (
                      <span>{receipt.customer.staffname}</span>
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
                    {deleteLoading ? "Deleting..." : "Delete"}
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
      />
    </section>
  );
};

export default ReceiptPage;
