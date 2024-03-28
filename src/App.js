import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import Edit from "./Edit";

function App() {
  const now = new Date();
  const currentDateTime =
    now.getFullYear() +
    "-" +
    (now.getMonth() + 1).toString().padStart(2, "0") +
    "-" +
    now.getDate().toString().padStart(2, "0") +
    "T" +
    now.getHours().toString().padStart(2, "0") +
    ":" +
    now.getMinutes().toString().padStart(2, "0");

  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState(""); // This can be left empty initially
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [hoveredTransaction, setHoveredTransaction] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // State for the form validation popup
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 5;

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  async function getTransactions() {
    const response = await fetch(
      process.env.REACT_APP_API_URL + "/transactions"
    );
    return await response.json();
  }

  function formatDateTime(dateTimeString) {
    const options = {
      month: "short",
      day: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };

    const dateTime = new Date(dateTimeString);
    return dateTime.toLocaleString("en-US", options);
  }

  function addTransaction(e) {
    e.preventDefault(); // Prevent default form submission behavior

    const url = process.env.REACT_APP_API_URL + "/transaction";
    const transactionDatetime = datetime || currentDateTime;

    // Check if all fields are filled before submitting the transaction
    if (!price || !name || !description) {
      setShowPopup(true); // Show the popup if any field is empty
      return;
    }

    fetch(url, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name,
        price,
        description,
        datetime: transactionDatetime,
      }),
    }).then((response) => {
      response.json().then((json) => {
        setName("");
        setPrice("");
        setDatetime("");
        setDescription("");
        console.log("result" + json);
        setTransactions([...transactions, json]); // Add the new transaction to the state
      });
    });
  }

  const handleHover = (index) => {
    setHoveredTransaction(index);
  };

  // New transaction handler for adding transactions
  const handleAddTransactionClick = (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    const url = process.env.REACT_APP_API_URL + "/transaction";
    const transactionDatetime = datetime || currentDateTime;

    // Check if all fields are filled before submitting the transaction
    if (!price || !name || !description) {
      setShowPopup(true); // Show the popup if any field is empty
      return;
    }

    fetch(url, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name,
        price,
        description,
        datetime: transactionDatetime,
      })
    }).then((response) => {
        response.json().then((json) => {
          setName("");
          setPrice("");
          setDatetime("");
          setDescription("");
          console.log("result" + json);
          setTransactions([...transactions, json]); // Add the new transaction to the state
        });
      });
    };
  
    // New handler for clicking on existing transactions
    const handleEditTransactionClick = (transaction) => {
      if (transaction) {
        setSelectedTransaction(transaction);
        setShowPopup(true); // Show the edit popup
      }
    };
  
    const handleClosePopup = () => {
      setShowPopup(false);
      setSelectedTransaction(null);
    };
    const handleOverlayClick = (e) => {
      if (e.target.classList.contains("popup-overlay")) {
        handleClosePopup();
      }
    };
  
    let balance = 0;
    for (const transaction of transactions) {
      balance = balance + transaction.price;
    }
  
    const displayedTransactions = transactions
      .slice()
      .reverse()
      .slice(
        (currentPage - 1) * transactionsPerPage,
        currentPage * transactionsPerPage
      );
  
    return (
      <Router>
        <main>
          <div className="shell">
            <h1 className={balance < 0 ? "balance-negative" : "balance-positive"}>
              ₹{balance}
            </h1>
            <form onSubmit={handleAddTransactionClick}>
              <div className="price">
                <input
                  className="price-input"
                  type="text"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder={"+/- Price"}
                />
              </div>
              <div className="basics">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={"Food"}
                />
                <input
                  type="datetime-local"
                  value={datetime || currentDateTime}
                  onChange={(e) => setDatetime(e.target.value)}
                />
              </div>
              <div className="description">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={"Description"}
                />
              </div>
              <button type="submit">Add Transaction</button>
            </form>
            {showPopup && (
              <> {/* Render based on the context */}
                {!selectedTransaction && (
                  // Render "fill all fields" popup for adding transactions
                  <div className="popup-overlay" onClick={handleOverlayClick}>
                    <div className="popup">
                      <h3>Please fill in all fields</h3>
                      <button onClick={handleClosePopup}>Close</button>
                    </div>
                  </div>
                )}
                {selectedTransaction && (
                  // Render edit popup for existing transactions
                  <div className="popup-overlay" onClick={handleOverlayClick}>
                    <Edit transaction={selectedTransaction} onClose={handleClosePopup} />
                  </div>
                )}
              </>
            )}
            <div className="transactions">
              {displayedTransactions.length > 0 &&
                displayedTransactions.map((transaction, index) => (
                  <div
                    key={index}
                    className={`transaction ${
                      hoveredTransaction === index ? "hovered" : ""
                    }`}
                    onClick={() => handleEditTransactionClick(transaction)}
                    // ... other props
                  >
                    {/* Transaction details */}
                    <div className="left">
                      <div className="name">{transaction.name}</div>
                      <div className="description">{transaction.description}</div>
                    </div>
                    <div className="right">
                      <div
                        className={
                          "price-" + (transaction.price < 0 ? "expense" : "income")
                        }
                      >
                        {transaction.price}
                      </div>
                      <div className="datetime">
                        {formatDateTime(transaction.datetime)}
                      </div>
                    </div>
                  </div>
                ))}
              {transactions.length > displayedTransactions.length && (
                <div className="show-more">
                  {/* Show "See Newer Transactions" button only when on older pages */}
                  {currentPage > 1 && (
  <button onClick={() => setCurrentPage(currentPage - 1)}>
    See Newer Transactions
  </button>
)}
<button
  onClick={() =>
    setCurrentPage(Math.ceil(transactions.length / transactionsPerPage))
  }
>
  See Older Transactions
</button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Routes>
        <Route
          path="/transactions"
          element={
            <div className="all-transactions">
              <h2>All Transactions</h2>
              {transactions.length > 0 && (
                <ul>
                  {transactions.map((transaction, index) => (
                    <li key={index}>
                      <div className="left">
                        <div className="name">{transaction.name}</div>
                        <div className="description">
                          {transaction.description}
                        </div>
                      </div>
                      <div className="right">
                        <div
                          className={
                            "price-" +
                            (transaction.price < 0 ? "expense" : "income")
                          }
                        >
                          {transaction.price}
                        </div>
                        <div className="datetime">
                          {formatDateTime(transaction.datetime)}
                        </div>
                      </div>
                      <Edit
                        transaction={transaction}
                        onClose={handleClosePopup}
                      />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

