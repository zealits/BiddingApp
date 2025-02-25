import React from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Package, Gavel, LogOut, User,Edit } from "lucide-react";

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { path: "/admin/register-product", icon: Package, label: "Register Commodity " },
    { path: "/admin/view-bids", icon: Gavel, label: "View Listing Bids" },
    { path: "/admin/edit-product", icon: Edit, label: "Edit Commodity" },
    { path: "/admin/profile", icon: User, label: "Profile" },

  ];

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin/login"); // Redirect to the login page
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 shadow-sm transform transition-transform duration-200 ease-in-out">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-8">
              <LayoutDashboard className="w-6 h-6 text-black" />
              <h1 className="text-xl font-bold text-gray-800">Yard Admin</h1>
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
                      ${isActive ? "bg-blue-50 text-black" : "text-gray-600 hover:bg-gray-50 hover:text-black"}`}
                  >
                    <Icon
                      className={`w-5 h-5 transition-colors duration-200 
                      ${isActive ? "text-black" : "text-gray-400 group-hover:text-gray-900"}`}
                    />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-50 hover:text-red-600 transition-all duration-200 group"
              >
                <LogOut className="w-5 h-5 text-gray-400 group-hover:text-red-600" />
                <span className="font-medium">Logout</span>
              </button>
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
