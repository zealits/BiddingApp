import React from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, Gavel, LogOut, User } from "lucide-react";

const Dashboard = () => {
  const location = useLocation();

  const navItems = [
    { path: "/admin/register-product", icon: Package, label: "Register Product" },
    { path: "/admin/view-bids", icon: Gavel, label: "View Bids" },
    { path: "/admin/profile", icon: User, label: "Profile" },
    { path: "/admin/logout", icon: LogOut, label: "Logout" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 shadow-sm transform transition-transform duration-200 ease-in-out">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <LayoutDashboard className="w-6 h-6 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
            </div>

            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group
                      ${isActive ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50 hover:text-blue-600"}`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors duration-200 
                      ${isActive ? "text-blue-600" : "text-gray-400 group-hover:text-blue-600"}`}
                    />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </aside>

        <main className="ml-64 flex-1">
          <div className="p-8">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <Outlet />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
