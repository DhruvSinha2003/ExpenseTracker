import React, { useState, useEffect } from "react";

const Edit = ({ transaction, onClose }) => {
  const [editedTransaction, setEditedTransaction] = useState({
    name: "",
    description: "",
    price: 0,
    datetime: "",
  });

  useEffect(() => {
    if (transaction) {
      setEditedTransaction(transaction);
    }
  }, [transaction]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTransaction((prevTransaction) => ({
      ...prevTransaction,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/transaction/${transaction.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(editedTransaction),
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      const data = await response.json();
      console.log("Transaction updated:", data);
      onClose(); // Close the popup after successful update
      window.location.reload(); // Refresh the page
    } catch (error) {
      console.error("Error updating transaction:", error);
    }
  };
  

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h2>Edit Transaction</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              value={editedTransaction.name}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="description">Description:</label>
            <input
              type="text"
              id="description"
              name="description"
              value={editedTransaction.description}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="price">Price:</label>
            <input
              type="number"
              id="price"
              name="price"
              value={editedTransaction.price}
              onChange={handleChange}
            />
          </div>
          <div>
            <label htmlFor="datetime">Date and Time:</label>
            <input
              type="datetime-local"
              id="datetime"
              name="datetime"
              value={editedTransaction.datetime}
              onChange={handleChange}
            />
          </div>
          <button type="submit">Save</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default Edit;
