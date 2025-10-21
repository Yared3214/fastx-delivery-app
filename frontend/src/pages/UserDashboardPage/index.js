"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import fastXLogo from "../../assets/fastX-logo.png";
import { LogOut, MapPinHouse } from "lucide-react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import UserProfile from "../../components/userProfile";
import orderStore from "../../store/order.store";
import authStore from "../../store/auth.store";
import { Popover, Button } from "@mui/material";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const NAVIGATION = [
  { title: "Dashboard", segment: "dashboard", icon: DashboardIcon },
  { title: "Orders", segment: "orders", icon: ShoppingCartIcon },
  { title: "Saved Address", segment: "address", icon: MapPinHouse },
  { title: "Account", segment: "account", icon: AccountBoxIcon },
];

export default function ShadCNDashboard() {
  const [activePage, setActivePage] = useState("dashboard");

  const { userData } = authStore();
  const token = userData?.tokens?.access?.token || null;
  const { myOrders, getMyOrders } = orderStore();

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  useEffect(() => {
    getMyOrders(token);
  }, [getMyOrders, token]);

  const handleOrderClick = (event, order) => {
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order);
  };

  const handleOrderClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null);
  };

  const logoutHandler = () => {
    authStore.getState().clearUserData();
  };

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
            <Button onClick={logoutHandler} variant="contained" color="error">
              Logout
            </Button>
          </div>
        );
      case "orders":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">My Orders</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myOrders?.map((order, idx) => (
                <div key={idx} className="border rounded p-4 shadow-sm">
                  <h3 className="font-semibold">{order.restaurantName}</h3>
                  <p>Date: {formatDate(order.createdAt)}</p>
                  <p>
                    Status:{" "}
                    <span
                      className={
                        order.status === "Delivered"
                          ? "text-green-500"
                          : order.status === "Canceled"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }
                    >
                      {order.order_status}
                    </span>
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button variant="contained" onClick={(e) => handleOrderClick(e, order)}>
                      View Details
                    </Button>
                    <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600">
                      Reorder
                    </button>
                  </div>
                  <Popover
                    id={id}
                    open={open && selectedOrder === order}
                    anchorEl={anchorEl}
                    onClose={handleOrderClose}
                    anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                  >
                    {selectedOrder && (
                      <div className="p-4 min-w-[250px] flex flex-col">
                        <h3 className="font-bold mb-2">Order Details</h3>
                        {selectedOrder.OrderItems.map((item, i) => (
                          <div key={i} className="flex justify-between py-1">
                            <span>
                              {item.ItemName} x{item.quantity}
                            </span>
                            <span>{item.price} Birr</span>
                          </div>
                        ))}
                        <div className="flex justify-between font-semibold mt-2">
                          <span>Delivery Fee:</span>
                          <span>{selectedOrder.delivery_fee} Birr</span>
                        </div>
                        <div className="flex justify-between font-semibold mt-1">
                          <span>Total:</span>
                          <span>{selectedOrder.total_amount} Birr</span>
                        </div>
                      </div>
                    )}
                  </Popover>
                </div>
              ))}
            </div>
          </div>
        );
      case "account":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Account Details</h2>
            <UserProfile />
          </div>
        );
      case "address":
        return (
          <div className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Saved Addresses</h2>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Add New Address</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen w-screen">
      <Sidebar className="w-64">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>
              <img
                src={fastXLogo}
                alt="Logo"
                className="h-12 cursor-pointer mb-2"
                onClick={() => (window.location.href = "/")}
              />
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button className="w-full text-left mb-2" onClick={() => (window.location.href = "/")}>
                      Back Home
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                {NAVIGATION.map((item) => (
                  <SidebarMenuItem key={item.segment}>
                    <SidebarMenuButton asChild>
                      <button className="w-full text-left flex items-center gap-2" onClick={() => setActivePage(item.segment)}>
                        <item.icon /> <span>{item.title}</span>
                      </button>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <button className="w-full text-left mt-2 flex items-center gap-2" onClick={logoutHandler}>
                      <LogOut /> Logout
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <div className="flex-1 bg-gray-100 overflow-auto">{renderContent()}</div>
    </div>
  );
}
