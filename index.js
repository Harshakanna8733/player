//  gloabal variables
let expenses = [];

// html elements
const playerName = document.querySelector("#playerName");
const playerAge = document.querySelector("#playerAge");
const iplTeam = document.querySelector("#iplTeam");
const playerCountry = document.querySelector("#playerCountry");
const playerSkill = document.querySelector("#playerSkill");
const addButton = document.querySelector("#addButton");

// getting expenses
const getExpenses = async (category, month) => {
  try {
    let url;
    if (category === undefined || month === undefined) {
      url = `http://localhost:3000/players`;
    } else {
      if (category === "all") {
        url = `http://localhost:3000/expenses?month=${month}`;
      } else {
        url = `http://localhost:3000/expenses?category=${category}&month=${month}`;
      }
    }
    const res = await fetch(url);
    const data = await res.json();
    expenses = data;
    displayExpenses();
    totalAmount.innerHTML = calculateTotal(expenses);
    return data;
  } catch (error) {
    alert(error.message);
    return error;
  }
};

// display the expenses in html
const displayExpenses = () => {
  const table_body = document.querySelector("tbody");
  let innerHtml = "";
  expenses.map((item, index) => {
    innerHtml += `<tr>
                  // <td>${index}</td>
                  <td>${item.name}</td>
                  <td>${item.age}</td>
                  <td>${item.team}</td>
                  <td>${item.skill}</td>
                  <td>${item.country}</td>
                  </tr>`;
  });
  table_body.innerHTML = innerHtml;
};

// adding a new expense to db.json
const addExpense = async () => {
  try {
    const new_expense = populate_expense();
    if (new_expense === false) {
      return false;
    }
    const added_expense = await fetch(`http://localhost:3000/players`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(new_expense),
    });
    const data = await added_expense.json();
    expenses.push(data);
    displayExpenses();
    clearInputs();
    return data;
  } catch (error) {
    alert(error.message);
    return error;
  }
};

// populating the object from document
const populate_expense = () => {
  if (validateForm()) {
    const new_expense = {
      name: playerName.value,
      age: playerAge.value,
      team: iplTeam.value,
      skill: playerSkill.value,
      country: playerCountry.value,
    };
    return new_expense;
  }
  return false;
};

// form validation
const validateForm = () => {
  if (playerName.value === null) {
    alert("Name could not be empty");
    return false;
  }
  if (playerAge.value <= 0) {
    alert("Age should not be 0 or less.");
    return false;
  }
  return true;
};

// listening to add button
addButton.addEventListener("click", (e) => {
  e.preventDefault();
  addExpense();
});



// clearing the form
const clearInputs = () => {
  playerName.value = "";
 playerAge.value = "";
  iplTeam.value = "";
  playerCountry.value = "";
  playerSkill.value = "";
};

module.exports = {
  getExpenses,
};
