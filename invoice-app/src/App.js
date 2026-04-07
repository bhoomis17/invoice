import React, { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

function App() {
  const [client, setClient] = useState("");
  const [items, setItems] = useState([]);
  const [dark, setDark] = useState(false);
  const [saved, setSaved] = useState([]);

  const invoiceNumber = Math.floor(Math.random() * 10000);
  const date = new Date().toLocaleDateString();

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("invoices")) || [];
    setSaved(data);
  }, []);

  const addItem = () => setItems([...items, { service: "", amount: "" }]);

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  const removeItem = (index) => setItems(items.filter((_, i) => i !== index));

  const total = items.reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const generatePDF = () => {
  if (!client) return alert("Enter client name!");

  const doc = new jsPDF();
  const pw = doc.internal.pageSize.getWidth();

  // ── PINK HEADER BAR ──
  doc.setFillColor(233, 30, 140);
  doc.rect(0, 0, pw, 38, "F");

  // ── HEADER TEXT ──
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text("My Company", 14, 16);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.text("Professional Invoice", 14, 24);

  doc.setFontSize(9);
  doc.text("support@mycompany.com", pw - 14, 16, { align: "right" });
  doc.text("www.mycompany.com", pw - 14, 24, { align: "right" });

  // ── LIGHT PINK STRIP ──
  doc.setFillColor(252, 228, 236);
  doc.rect(0, 38, pw, 22, "F");

  doc.setTextColor(156, 39, 176);
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Invoice No: #" + invoiceNumber, 14, 50);
  doc.text("Date: " + date, pw - 14, 50, { align: "right" });

  // ── BILL TO ──
  doc.setTextColor(80, 80, 80);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("BILL TO", 14, 75);

  doc.setDrawColor(233, 30, 140);
  doc.setLineWidth(0.5);
  doc.line(14, 78, 80, 78);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(30, 30, 30);
  doc.text(client, 14, 87);

  // ── TABLE HEADER ──
  doc.setFillColor(233, 30, 140);
  doc.rect(14, 100, pw - 28, 10, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.text("SERVICE", 18, 107);
  doc.text("AMOUNT", pw - 18, 107, { align: "right" });

  // ── TABLE ROWS ──
  let y = 118;
  items.forEach((item, i) => {
    if (!item.service || !item.amount) return;

    if (i % 2 === 0) {
      doc.setFillColor(253, 244, 249);
      doc.rect(14, y - 6, pw - 28, 10, "F");
    }

    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(item.service, 18, y);
    doc.text("Rs. " + item.amount, pw - 18, y, { align: "right" });

    y += 12;
  });

  // ── DIVIDER LINE ──
  doc.setDrawColor(233, 30, 140);
  doc.setLineWidth(0.4);
  doc.line(14, y + 2, pw - 14, y + 2);

  // ── TOTAL BOX ──
  doc.setFillColor(233, 30, 140);
  doc.roundedRect(pw - 80, y + 8, 66, 16, 3, 3, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.text("TOTAL: Rs. " + total, pw - 47, y + 19, { align: "center" });

  // ── FOOTER ──
  const footerY = doc.internal.pageSize.getHeight() - 18;
  doc.setFillColor(252, 228, 236);
  doc.rect(0, footerY - 6, pw, 24, "F");

  doc.setTextColor(156, 39, 176);
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.text("Thank you for your business!", pw / 2, footerY + 4, { align: "center" });
  doc.text("Payment due within 30 days.", pw / 2, footerY + 10, { align: "center" });

  doc.save("invoice.pdf");
};

  const saveInvoice = () => {
    if (!client) return alert("Enter client name!");
    const invoice = `${client} - ₹${total}`;
    const updated = [...saved, invoice];
    localStorage.setItem("invoices", JSON.stringify(updated));
    setSaved(updated);
  };

  const bg = dark ? "#1a1a2e" : "rgba(255,255,255,0.75)";
  const text = dark ? "#f8f8f8" : "#2d2d2d";
  const subText = dark ? "#ccaacc" : "#9c27b0";
  const inputBg = dark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.9)";
  const inputBorder = dark ? "1px solid #cc77cc" : "1px solid #e91e8c55";

  const cardStyle = {
    background: bg,
    color: text,
    backdropFilter: "blur(16px)",
    borderRadius: "24px",
    padding: "40px",
    width: "100%",
    maxWidth: "620px",
    boxShadow: dark
      ? "0 8px 40px rgba(200,50,200,0.2)"
      : "0 8px 40px rgba(233,30,140,0.15)",
    border: dark ? "1px solid #cc77cc33" : "1px solid rgba(233,30,140,0.15)"
  };

  const inputStyle = {
    width: "100%",
    padding: "12px 16px",
    borderRadius: "12px",
    border: inputBorder,
    background: inputBg,
    color: text,
    fontSize: "14px",
    outline: "none",
    marginBottom: "14px"
  };

  const btnPrimary = {
    background: "linear-gradient(135deg, #e91e8c, #9c27b0)",
    color: "white",
    border: "none",
    borderRadius: "50px",
    padding: "11px 26px",
    fontWeight: "700",
    fontSize: "14px",
    cursor: "pointer",
    transition: "all 0.2s"
  };

  const btnOutline = {
    background: "transparent",
    color: subText,
    border: `2px solid ${subText}`,
    borderRadius: "50px",
    padding: "9px 22px",
    fontWeight: "600",
    fontSize: "14px",
    cursor: "pointer"
  };

  const btnDanger = {
    background: "#fce4ec",
    color: "#c2185b",
    border: "none",
    borderRadius: "8px",
    padding: "8px 14px",
    fontWeight: "700",
    cursor: "pointer",
    fontSize: "13px"
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
      <div style={cardStyle}>

        {/* HEADER */}
        <div style={{ textAlign: "center", marginBottom: "28px" }}>
          <div style={{
            width: "64px", height: "64px", borderRadius: "18px",
            background: "linear-gradient(135deg, #e91e8c, #9c27b0)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "28px", margin: "0 auto 14px"
          }}>🧾</div>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: subText, marginBottom: "4px" }}>
            Invoice Generator
          </h1>
          <p style={{ fontSize: "13px", color: dark ? "#aaa" : "#888" }}>
            Create and download professional invoices
          </p>
        </div>

        {/* DARK MODE */}
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
          <button style={btnOutline} onClick={() => setDark(!dark)}>
            {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
          </button>
        </div>

        {/* INVOICE META */}
        <div style={{
          background: dark ? "rgba(255,255,255,0.06)" : "#fce4ec55",
          borderRadius: "14px", padding: "14px 18px",
          marginBottom: "22px", display: "flex",
          justifyContent: "space-between", alignItems: "center",
          border: "1px solid rgba(233,30,140,0.1)"
        }}>
          <span style={{ fontSize: "13px", color: dark ? "#dda0dd" : "#9c27b0", fontWeight: "600" }}>
            Invoice #{invoiceNumber}
          </span>
          <span style={{ fontSize: "13px", color: dark ? "#ccc" : "#888" }}>{date}</span>
        </div>

        {/* CLIENT NAME */}
        <label style={{ fontSize: "12px", fontWeight: "700", color: subText, letterSpacing: "1px" }}>
          CLIENT NAME
        </label>
        <input
          style={{ ...inputStyle, marginTop: "8px" }}
          placeholder="e.g. Priya Sharma"
          value={client}
          onChange={(e) => setClient(e.target.value)}
        />

        {/* ITEMS */}
        <div style={{ margin: "8px 0 16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <label style={{ fontSize: "12px", fontWeight: "700", color: subText, letterSpacing: "1px" }}>
              ITEMS
            </label>
            <button style={btnPrimary} onClick={addItem}>+ Add Item</button>
          </div>

          {items.length === 0 && (
            <div style={{
              textAlign: "center", padding: "24px",
              border: `2px dashed ${dark ? "#cc77cc44" : "#e91e8c33"}`,
              borderRadius: "14px", color: dark ? "#aaa" : "#bbb", fontSize: "14px"
            }}>
              No items yet — click "+ Add Item"
            </div>
          )}

          {items.map((item, i) => (
            <div key={i} style={{
              display: "flex", gap: "10px", alignItems: "center",
              background: dark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.7)",
              borderRadius: "14px", padding: "12px",
              marginBottom: "10px", border: inputBorder
            }}>
              <input
                style={{ ...inputStyle, marginBottom: 0, flex: 2 }}
                placeholder="Service description"
                value={item.service}
                onChange={(e) => updateItem(i, "service", e.target.value)}
              />
              <input
                style={{ ...inputStyle, marginBottom: 0, flex: 1 }}
                type="number"
                placeholder="₹ Amount"
                value={item.amount}
                onChange={(e) => updateItem(i, "amount", e.target.value)}
              />
              <button style={btnDanger} onClick={() => removeItem(i)}>✕</button>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div style={{
          background: "linear-gradient(135deg, #e91e8c22, #9c27b022)",
          borderRadius: "14px", padding: "16px 20px",
          display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: "24px",
          border: "1px solid rgba(233,30,140,0.2)"
        }}>
          <span style={{ fontWeight: "700", color: subText, fontSize: "15px" }}>Total Amount</span>
          <span style={{ fontWeight: "900", fontSize: "22px", color: subText }}>₹{total}</span>
        </div>

        {/* BUTTONS */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "32px" }}>
          <button style={{ ...btnPrimary, flex: 1, padding: "13px" }} onClick={generatePDF}>
            ⬇️ Download PDF
          </button>
          <button style={{ ...btnOutline, flex: 1, padding: "13px" }} onClick={saveInvoice}>
            💾 Save Invoice
          </button>
        </div>

        {/* SAVED INVOICES */}
        <div>
          <h3 style={{ fontSize: "13px", fontWeight: "700", color: subText, letterSpacing: "1px", marginBottom: "12px" }}>
            SAVED INVOICES
          </h3>
          {saved.length === 0 ? (
            <p style={{ color: dark ? "#888" : "#bbb", fontSize: "13px", textAlign: "center", padding: "12px" }}>
              No saved invoices yet
            </p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {saved.map((inv, i) => (
                <li key={i} style={{
                  background: dark ? "rgba(255,255,255,0.05)" : "rgba(233,30,140,0.06)",
                  borderRadius: "10px", padding: "12px 16px",
                  marginBottom: "8px", fontSize: "14px",
                  border: "1px solid rgba(233,30,140,0.1)",
                  display: "flex", justifyContent: "space-between"
                }}>
                  <span>🧾 {inv}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;