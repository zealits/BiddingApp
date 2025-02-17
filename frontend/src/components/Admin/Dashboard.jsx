// src/components/Admin/Dashboard.jsx
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Navbar from '../Shared/Navbar';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex flex-col md:flex-row">
        <aside className="md:w-64 bg-white shadow-md p-6">
          <nav>
            <ul>
              <li className="mb-4">
                <Link
                  to="register-product"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  Register Product
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="view-bids"
                  className="text-blue-600 font-semibold hover:underline"
                >
                  View Bids
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
