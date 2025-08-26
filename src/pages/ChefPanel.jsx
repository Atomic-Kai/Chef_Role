import React, { useState } from "react";
import TableCard from "../components/TableCard.jsx";
import { useOrders } from "../context/OrdersContext.jsx";

const LOGO_SRC = "/logo.jpg";

function makeSeedTables() {
  // Create eight tables with simple demo data; generate unique IDs & current date/time
  const now = new Date();
  const dateStr = now.toLocaleDateString();
  return Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    tableNumber: `T${i + 1}`,
    orders: [
      { item: "Chicken Soup", quantity: 1 },
      { item: "Fried Rice", quantity: 2 },
      { item: "Iced Tea", quantity: 3 },
    ],
    status: "pending",
    orderTime: now.toLocaleTimeString(),
    date: dateStr,
    orderId:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `#${Date.now()}_${Math.random().toString(16).slice(2)}`,
  }));
}

export default function ChefPanel() {
  const { addOrder } = useOrders();
  const [tables, setTables] = useState(makeSeedTables());
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState(null);
  const [remark, setRemark] = useState("");

  const openPreview = (order) => {
    setSelected(order);
    setRemark("");
    setShowModal(true);
  };
  const closePreview = () => {
    setShowModal(false);
    setSelected(null);
  };

  const confirmAndPrint = () => {
    if (!selected) return;
    const itemsHTML = selected.orders
      .map(
        (it) =>
          `<tr><td style="padding:6px 0;">${it.item}</td><td style="text-align:right; padding:6px 0;">${it.quantity}</td></tr>`
      )
      .join("");
    const logoUrl = new URL(LOGO_SRC, window.location.origin).toString();

    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <title>Print Order</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; margin:0; }
            .head { background:#b22128; color:#fff; padding:16px; text-align:center; font-size:26px; font-weight:800;
                    text-shadow:0 2px 2px rgba(0,0,0,.2); }
            .wrap { padding:16px; }
            .brand { display:flex; justify-content:space-between; align-items:center; gap:12px; }
            .brand-name { text-align:center; width:100%; }
            .brand-name .title { font-size:28px; font-weight:800; line-height:1.1; }
            .brand-name .sub { color:#333; font-size:18px; font-weight:600; }
            .logo-box { width:96px; height:96px; border:1px solid #bdbdbd; border-radius:4px; overflow:hidden; background:#fff; }
            .logo-box img { width:100%; height:100%; object-fit:cover; }
            .dash { border-top:2px dashed #bbb; margin:12px 0; }
            .row { display:flex; justify-content:space-between; }
            table { width:100%; border-collapse:collapse; font-size:16px; }
            th { text-align:left; }
            .right { text-align:right; }
            .remark { min-height:100px; border:1px solid #c9c9c9; box-shadow:0 2px 6px rgba(0,0,0,.15); padding:10px; }
            @page { margin: 10mm; }
          </style>
        </head>
        <body>
          <div class="head">Print Order</div>
          <div class="wrap">
            <div class="brand">
              <div class="brand-name">
                <div class="title">Lotus Panda</div>
                <div class="sub">Cooking</div>
              </div>
              <div class="logo-box"><img src="${logoUrl}" alt="logo" /></div>
            </div>

            <div class="dash"></div>

            <div class="row" style="font-weight:600;">
              <div>
                <div>Date: ${selected.date}</div>
                <div>Order ID: ${selected.orderId}</div>
              </div>
              <div style="text-align:right;">
                <div>${selected.orderTime}</div>
                <div>Table: ${selected.tableNumber}</div>
              </div>
            </div>

            <div class="dash"></div>

            <table>
              <thead>
                <tr>
                  <th style="font-size:18px;">Item</th>
                  <th class="right" style="font-size:18px;">quantity</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHTML}
              </tbody>
            </table>

            <div class="dash"></div>

            <div style="font-size:18px; font-weight:700; margin-bottom:6px;">Remark :</div>
            <div class="remark">${(remark || "")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/\n/g, "<br/>")}</div>
          </div>

          <script> setTimeout(function(){ window.print(); }, 150); </script>
        </body>
      </html>`;

    // Desired size
    const popupWidth = 420;
    const popupHeight = 700;

    // Center on screen
    const left = window.screen.width / 2 - popupWidth / 2;
    const top = window.screen.height / 2 - popupHeight / 2;

    const features = `width=${popupWidth},height=${popupHeight},top=${top},left=${left}`;
    const w = window.open("", "_blank", features);
    if (w) {
      w.document.write(html);
      w.document.close();
    }
    addOrder(selected, remark);
    setTables((prev) =>
      prev.map((t) =>
        t.id === selected.id ? { ...t, status: "confirmed" } : t
      )
    );
    closePreview();
  };

  return (
    <div>
      <h1 className="page-title">Welcome to Chef Panel</h1>
      <div className="container">
        <div className="row gy-4 gx-4">
          {tables.map((table) => (
            <div
              className="col-12 col-md-6 col-lg-3 d-flex justify-content-center"
              key={table.id}
            >
              <TableCard
                table={table}
                disabled={table.status === "confirmed"}
                onConfirm={openPreview}
              />
            </div>
          ))}
        </div>
      </div>

      {showModal && selected && (
        <div className="modal-backdrop-custom">
          <div className="modal-card">
            <div className="modal-head">Print Order</div>
            <div className="modal-body">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="w-100 text-center">
                  <div
                    style={{ fontSize: 28, fontWeight: 800, lineHeight: 1.1 }}
                  >
                    Lotus Panda
                  </div>
                  <div
                    className="text-muted"
                    style={{ fontSize: 18, fontWeight: 600 }}
                  >
                    Cooking
                  </div>
                </div>
                <div
                  style={{
                    width: 84,
                    height: 84,
                    border: "1px solid #bdbdbd",
                    borderRadius: 4,
                    overflow: "hidden",
                    marginLeft: 12,
                    flex: "0 0 auto",
                    background: "#fff",
                  }}
                >
                  <img
                    src={LOGO_SRC}
                    alt="Logo"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
              </div>

              <hr style={{ borderTop: "2px dashed #bbb", margin: "10px 0" }} />

              <div
                className="d-flex justify-content-between"
                style={{ fontWeight: 600 }}
              >
                <div>
                  <div>Date: {selected.date}</div>
                  <div>Order ID: {selected.orderId}</div>
                </div>
                <div className="text-end">
                  <div>{selected.orderTime}</div>
                  <div>Table: {selected.tableNumber}</div>
                </div>
              </div>

              <hr style={{ borderTop: "2px dashed #bbb", margin: "10px 0" }} />

              <div className="row fw-semibold">
                <div className="col" style={{ fontSize: 18 }}>
                  Item
                </div>
                <div className="col text-end" style={{ fontSize: 18 }}>
                  quantity
                </div>
              </div>
              <div style={{ fontSize: 16 }}>
                {selected.orders.map((it, idx) => (
                  <div key={idx} className="row py-1">
                    <div className="col">{it.item}</div>
                    <div className="col text-end">{it.quantity}</div>
                  </div>
                ))}
              </div>

              <hr
                style={{
                  borderTop: "2px dashed #bbb",
                  margin: "10px 10px 12px",
                }}
              />
              <div className="mb-2" style={{ fontSize: 18, fontWeight: 700 }}>
                Remark :
              </div>
              <textarea
                className="form-control"
                rows={4}
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Enter special notes..."
                style={{ boxShadow: "0 2px 6px rgba(0,0,0,.15)" }}
              />
            </div>

            <div className="modal-footer">
              <button className="btn btn-danger-soft" onClick={closePreview}>
                Back
              </button>
              <button className="btn btn-danger-soft" onClick={confirmAndPrint}>
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
