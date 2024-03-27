import { useEffect, useState } from "react";
import "./App.css";

function App() {
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

  function addTransaction() {
    const url = process.env.REACT_APP_API_URL + "/transaction";
    const price = name.split(" ")[0];
    fetch(url, {
      method: "POST",
      headers: { "Content-type": "application/json" },
      body: JSON.stringify({
        name: name.substring(price.length + 1),
        price,
        description,
        datetime,
      }),
    }).then((response) => {
      response.json().then((json) => {
        setName("");
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
        <h1>₹{balance}</h1>
        <form onSubmit={addTransaction}>
          <div className="basics">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={"+200 Food"}
            />
            <input
              type="datetime-local"
              value={datetime}
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
            transactions.map((transaction) => (
              <div className="transaction">
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
                  <div className="datetime">{transaction.name}</div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </main>
  );
}

export default App;
