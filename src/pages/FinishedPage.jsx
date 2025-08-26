import React from "react";
import { useOrders } from "../context/OrdersContext.jsx";

export default function FinishedPage() {
  const { finishedOrders, clearFinished } = useOrders();
  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h1 className="page-title m-0">Finished</h1>
        {finishedOrders.length > 0 && (
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={clearFinished}
          >
            Clear All
          </button>
        )}
      </div>
      <div className="container">
        {finishedOrders.length === 0 ? (
          <p className="text-center text-muted">No finished orders yet.</p>
        ) : (
          <div className="row gy-4 gx-4">
            {finishedOrders.map((order, idx) => (
              <div
                className="col-12 col-md-6 col-lg-3"
                key={order.orderId + idx}
              >
                <div
                  className="card border-success"
                  style={{ borderRadius: 14 }}
                >
                  <div className="card-header bg-success text-white">
                    Table: {order.tableNumber}
                  </div>
                  <div className="card-body">
                    <div className="small text-muted mb-1">
                      Finished at: {new Date(order.finishedAt).toLocaleString()}
                    </div>
                    <ul className="list-unstyled mb-2">
                      {order.orders.map((it, i) => (
                        <li key={i} className="d-flex justify-content-between">
                          <span>{it.item}</span>
                          <span>x{it.quantity}</span>
                        </li>
                      ))}
                    </ul>
                    {order.remark && (
                      <div className="small">
                        <strong>Remark:</strong> {order.remark}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
