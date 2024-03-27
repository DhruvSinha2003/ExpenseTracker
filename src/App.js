import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [price, setPrice] = useState("");
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);
  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);
  async function getTransactions() {
    const response = await fetch(
      process.env.REACT_APP_API_URL + "/transactions"
    );
    return await response.json();
  }

  function getCurrentDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, "0");
    const day = now.getDate().toString().padStart(2, "0");
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
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

  function addTransaction() {
    const url = process.env.REACT_APP_API_URL + "/transaction";
    const transactionDatetime = datetime || getCurrentDateTime();

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
      });
    });
  }

  let balance = 0;
  for (const transaction of transactions) {
    balance = balance + transaction.price;
  }
  return (
    <main>
      <div className="shell">
        <h1 className={balance < 0 ? "balance-negative" : "balance-positive"}>
          ₹{balance}
        </h1>
        <form onSubmit={addTransaction}>
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
              value={datetime || getCurrentDateTime()}
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
          <button typeof="submit">Add Transaction</button>
        </form>
        <div className="transactions">
          {transactions.length > 0 &&
            transactions
              .slice()
              .reverse()
              .map((transaction) => (
                <div className="transaction">
                  <div className="left">
                    <div className="name">{transaction.name}</div>
                    <div className="description">{transaction.description}</div>
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
                </div>
              ))}
        </div>
      </div>
    </main>
  );
}

export default App;
