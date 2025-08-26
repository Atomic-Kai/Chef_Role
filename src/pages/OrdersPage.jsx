import React from "react";
import { useOrders } from "../context/OrdersContext.jsx";
import TableCard from "../components/TableCard.jsx";

export default function OrdersPage() {
  const { doneOrders, finishOrder } = useOrders();
  return (
    <div>
      <h1 className="page-title">Orders</h1>
      <div className="container">
        {doneOrders.length === 0 ? (
          <p className="text-center text-muted">No orders in queue.</p>
        ) : (
          <div className="row gy-4 gx-4">
            {doneOrders.map((order, idx) => (
              <div
                className="col-12 col-md-6 col-lg-3 d-flex justify-content-center"
                key={order.orderId + idx}
              >
                <TableCard
                  table={{
                    tableNumber: order.tableNumber,
                    orders: order.orders,
                  }}
                  label="Done"
                  onConfirm={() => finishOrder(order.orderId)}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
