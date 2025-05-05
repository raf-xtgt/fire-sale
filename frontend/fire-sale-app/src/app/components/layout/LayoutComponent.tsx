"use client";

import { useState } from "react";
import { FaSearch, FaComments, FaBars, FaAngleLeft, FaUsersCog, FaBriefcase } from "react-icons/fa";
import Link from "next/link";
import { useUser } from "@/app/state-controller/context/userContext";

export default function LayoutComponent({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user } = useUser();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const isAdmin = user?.labels?.includes("admin");

  return (
    <div className="flex h-screen">
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-16'} bg-gray-800 text-white transition-width duration-300 ease-in-out`}>
        <div className="p-4">
          <div className="flex items-center p-2">
            <button onClick={toggleSidebar} className="p-2 bg-gray-700 rounded">
              {isSidebarOpen ? <FaAngleLeft /> : <FaBars />}
            </button>
            {isSidebarOpen && <h1 className="text-2xl font-bold ml-4">FireSale</h1>}
          </div>
        </div>
        <div>
          <nav className="mt-6">
            <ul>
            <li className="mb-2">          
                <Link href="/components/service-suite" className="flex items-center justify-center p-2 hover:bg-gray-700 rounded">
                  <FaBriefcase className="mr-2" />
                  {isSidebarOpen && "Service Suite"} 
                </Link>
              </li>
              <li className="mb-2">
                <Link href="/" className="flex items-center justify-center p-2 hover:bg-gray-700 rounded">
                  <FaSearch className="mr-2" />
                  {isSidebarOpen && "Lead Search"} 
                </Link>
              </li>
              <li className="mb-2">          
                <Link href="/components/leadManagement" className="flex items-center justify-center p-2 hover:bg-gray-700 rounded">
                  <FaComments className="mr-2" />
                  {isSidebarOpen && "Leads"} 
                </Link>
              </li>
              {isAdmin && (
                <li className="mb-2">          
                  <Link href="/admin/users" className="flex items-center justify-center p-2 hover:bg-gray-700 rounded">
                    <FaUsersCog className="mr-2" />
                    {isSidebarOpen && "Manage Users"} 
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </aside>
      <main className="flex-1 p-4 overflow-auto">
        {children}
      </main>
    </div>
  );
}