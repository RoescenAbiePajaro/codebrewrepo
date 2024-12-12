import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const StockModal = ({ isOpen, onClose, onUpdate, stockItem }) => {
  const [newStock, setNewStock] = useState(0);

  useEffect(() => {
    if (stockItem) {
      setNewStock(stockItem.stock); // Set the initial stock value when stockItem changes
    }
  }, [stockItem]);

  const handleSave = () => {
    // Ensure newStock is a valid number and greater than or equal to 0
    if (newStock >= 0) {
      onUpdate(stockItem._id, newStock);  // Update the stock value for the item
      onClose(); // Close the modal
    } else {
      // Handle invalid stock input if needed, like showing an alert
      alert("Stock cannot be negative");
    }
  };

  const handleStockChange = (e) => {
    const value = e.target.value;
    // Ensure the value is a number and is not negative
    if (!isNaN(value) && value !== '') {
      const parsedValue = parseInt(value, 10);
      setNewStock(parsedValue >= 0 ? parsedValue : 0); // Prevent negative stock
    } else {
      // Reset to 0 if the input is invalid
      setNewStock(0);
    }
  };
  

  return (
    <Modal open={isOpen} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
        }}
      >
        {stockItem && (
          <>
            <h2 className="text-center">Update Stock for {stockItem.name}</h2>
            <TextField
              label="Stock"
              type="number"
              value={newStock.toString()}  // Ensure the value is a string
              onChange={handleStockChange}
              fullWidth
              margin="normal"
            />
           <div className="flex justify-end mt-4">
  <Button
    onClick={onClose}
    variant="outlined"
    sx={{ color: 'red', borderColor: 'red', '&:hover': { backgroundColor: 'rgba(255, 0, 0, 0.1)' } }}
    className="mr-2"
  >
    Cancel
  </Button>
  <Button
    onClick={handleSave}
    variant="contained"
    sx={{ backgroundColor: 'green', '&:hover': { backgroundColor: 'darkgreen' } }}
  >
    Save
  </Button>
</div>

          </>
        )}
      </Box>
    </Modal>
  );
};

export default StockModal;