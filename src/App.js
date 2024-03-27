import { useState } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [datetime, setDatetime] = useState("");
  const [description, setDescription] = useState("");

  function addTransaction(){
    const url = process.env.REACT_APP_API_URL+'/transaction';
    fetch(url , {
      method: 'POST',
      headers: {'Content-type':'application/json'},
      body:JSON.stringify({name,description,datetime})
    }).then(response => {
      response.json().then(json => {console.log('result' + json)})
    })
  }

  return (
    <main>
      <h1>₹100</h1>
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
        <div className="transaction">
          <div className="left">
            <div className="name">Expense</div>
            <div className="description">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            </div>
          </div>
          <div className="right">
            <div className="price-expense">-₹200</div>
            <div className="datetime">123456778</div>
          </div>
        </div>
        <div className="transaction">
          <div className="left">
            <div className="name">Income</div>
            <div className="description">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit.
            </div>
          </div>
          <div className="right">
            <div className="price-income">+₹200</div>
            <div className="datetime">123456778</div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
