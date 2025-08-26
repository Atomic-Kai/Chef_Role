import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Utensils , CheckCircle } from "lucide-react";

export default function Sidebar() {
  const { pathname } = useLocation();
  const isActive = (p) => pathname === p || pathname.startsWith(p);
  return (
    <div className="app-sidebar d-flex flex-column align-items-center py-4 gap-4">
      <Link
        aria-label="Home"
        className={"sidebar-btn " + (isActive("/") ? "active" : "")}
        to="/"
      >
        <Home size={30} strokeWidth={2.2} />
      </Link>
      <Link 
        aria-label="Orders"
        className={"sidebar-btn " + (isActive("/orders") ? "active" : "")}
        to="/orders"
      >
        <Utensils  size={30} strokeWidth={2.2} />
      </Link>
      <Link
        aria-label="Finished"
        className={"sidebar-btn " + (isActive("/finished") ? "active" : "")}
        to="/finished"
      >
        <CheckCircle size={30} strokeWidth={2.2} />
      </Link>
    </div>
  );
}
