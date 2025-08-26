import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar.jsx'
import ChefPanel from './pages/ChefPanel.jsx'
import OrdersPage from './pages/OrdersPage.jsx'
import FinishedPage from './pages/FinishedPage.jsx'

export default function App(){
  return (
    <div className="d-flex">
      <Sidebar />
      <div className="page-wrap flex-grow-1">
        <Routes>
          <Route path="/" element={<ChefPanel />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/finished" element={<FinishedPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}
