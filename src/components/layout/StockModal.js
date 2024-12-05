import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

const StockModal = ({ isOpen, onClose, onUpdate, stockItem }) => {
  const [newStock, setNewStock] = useState(0);

  useEffect(() => {
    if (stockItem) {
      setNewStock(stockItem.stock || 0); // Initialize stock value
    }
  }, [stockItem]);

  const handleSave = () => {
    if (newStock >= 0) {
      onUpdate(stockItem._id, newStock);
      onClose();
    } else {
      alert('Stock value must be 0 or higher');
    }
  };

  const handleStockChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setNewStock(value === '' ? 0 : parseInt(value, 10));
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
              value={newStock.toString()}
              onChange={handleStockChange}
              fullWidth
              margin="normal"
            />
            <div className="flex justify-end mt-4">
              <Button onClick={onClose} variant="outlined" className="mr-2">
                Cancel
              </Button>
              <Button onClick={handleSave} variant="contained" color="success">
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