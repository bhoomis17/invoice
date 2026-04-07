let invoiceNumber = Math.floor(Math.random() * 10000);

function setInvoiceInfo() {
  const date = new Date().toLocaleDateString();
  document.getElementById("invoiceInfo").innerText =
    "Invoice No: " + invoiceNumber + " | Date: " + date;
}

setInvoiceInfo();

function addItem() {
  const div = document.createElement("div");
  div.classList.add("item");

  div.innerHTML = `
    <input type="text" placeholder="Service" oninput="updateTotal()">
    <input type="number" placeholder="Amount" oninput="updateTotal()">
    <button class="remove" onclick="this.parentElement.remove(); updateTotal()">X</button>
  `;

  document.getElementById("items").appendChild(div);
}

function updateTotal() {
  const inputs = document.querySelectorAll("#items input[type='number']");
  let total = 0;

  inputs.forEach(input => {
    if (input.value) {
      total += parseFloat(input.value);
    }
  });

  document.getElementById("total").innerText = "Total: ₹" + total;
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
}

function saveInvoice() {
  const client = document.getElementById("client").value;
  const totalText = document.getElementById("total").innerText;

  if (!client) {
    alert("Enter client name!");
    return;
  }

  const invoice = client + " - " + totalText;

  let saved = JSON.parse(localStorage.getItem("invoices")) || [];
  saved.push(invoice);

  localStorage.setItem("invoices", JSON.stringify(saved));

  displaySaved();
}

function displaySaved() {
  const list = document.getElementById("savedList");
  list.innerHTML = "";

  let saved = JSON.parse(localStorage.getItem("invoices")) || [];

  saved.forEach(inv => {
    const li = document.createElement("li");
    li.innerText = inv;
    list.appendChild(li);
  });
}

displaySaved();

async function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const client = document.getElementById("client").value;

  if (!client) {
    alert("Enter client name!");
    return;
  }

  const items = document.querySelectorAll(".item");

  let y = 40;
  let total = 0;

  doc.text("My Company", 10, 10);
  doc.text("Invoice No: " + invoiceNumber, 10, 20);
  doc.text("Client: " + client, 10, 30);

  items.forEach(item => {
    const service = item.children[0].value;
    const amount = item.children[1].value;

    if (service && amount) {
      doc.text(service + " - ₹" + amount, 10, y);
      total += parseFloat(amount);
      y += 10;
    }
  });

  doc.text("Total: ₹" + total, 10, y + 10);

  doc.save("invoice.pdf");
}