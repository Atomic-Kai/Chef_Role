import React, { createContext, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "chefPanelStore.v1";
const OrdersContext = createContext(null);

function loadStore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { done: [], finished: [] };
    const parsed = JSON.parse(raw);
    return { done: parsed.done || [], finished: parsed.finished || [] };
  } catch {
    return { done: [], finished: [] };
  }
}

export function OrdersProvider({ children }) {
  const [doneOrders, setDoneOrders] = useState(() => loadStore().done);
  const [finishedOrders, setFinishedOrders] = useState(
    () => loadStore().finished
  );

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ done: doneOrders, finished: finishedOrders })
    );
  }, [doneOrders, finishedOrders]);

  const addOrder = (order, remark = "") => {
    setDoneOrders((prev) => [
      {
        ...order,
        remark,
        status: "done",
        confirmedAt: new Date().toISOString(),
      },
      ...prev,
    ]);
  };

  const finishOrder = (orderId) => {
    setDoneOrders((prev) => {
      const idx = prev.findIndex((o) => o.orderId === orderId);
      if (idx === -1) return prev;
      const cloned = [...prev];
      const [ord] = cloned.splice(idx, 1);
      setFinishedOrders((fin) => [
        { ...ord, status: "finished", finishedAt: new Date().toISOString() },
        ...fin,
      ]);
      return cloned;
    });
  };

  const clearDone = () => setDoneOrders([]);
  const clearFinished = () => setFinishedOrders([]);

  return (
    <OrdersContext.Provider
      value={{
        doneOrders,
        finishedOrders,
        addOrder,
        finishOrder,
        clearDone,
        clearFinished,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const ctx = useContext(OrdersContext);
  if (!ctx) throw new Error("useOrders must be used within OrdersProvider");
  return ctx;
}
