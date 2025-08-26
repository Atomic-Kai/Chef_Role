import React from "react";

export default function TableCard({
  table,
  onConfirm,
  disabled,
  label = "Confirm",
}) {
  const total = table.orders.reduce((s, o) => s + o.quantity, 0);
  return (
    <div className="card order-card">
      <div className="card-header d-flex justify-content-between align-items-center">
        <span className="fw-bold">Table: {table.tableNumber}</span>
        <div className="badge-bubble">{total}</div>
      </div>
      <div className="card-body">
        {table.orders.map((o, i) => (
          <div
            key={i}
            className="d-flex justify-content-between text-secondary"
          >
            <span>{o.item}</span>
            <span>x{o.quantity}</span>
          </div>
        ))}
        <div className="divider"></div>
        <div className="fw-bold text-end">Total ({total})</div>
      </div>
      <div className="card-footer-strip d-flex justify-content-end px-3">
        <button
          className="confirm-pill"
          disabled={disabled}
          onClick={() => onConfirm?.(table)}
        >
          {disabled ? "Confirmed" : label}
        </button>
      </div>
    </div>
  );
}
