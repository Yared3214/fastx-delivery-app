import { useEffect, useState } from "react";
import { LayoutDashboard, ShoppingCart, MapPin, User, LogOut, Menu } from "lucide-react";
import { motion } from "framer-motion";
import fastX_logo from '../../assets/fastX-logo.png';
import orderStore from "../../store/order.store";
import { Button, Popover } from "@mui/material";
import { PackageOpen, ShoppingBag } from "lucide-react";
import authStore from '../../store/auth.store';
import { useNavigate } from "react-router-dom";
import UserProfile from '../../components/userProfile';

function LogoutButton() {
  const navigate = useNavigate();

  const logoutHandler = () => {
    authStore.getState().clearUserData();
    navigate("/");
  };

  return (
    <div className="p-4 border-t border-red-800">
          <button className="flex items-center gap-3 w-full px-4 py-2 bg-red-900 hover:bg-red-800 rounded-lg"
          onClick={logoutHandler}>
            <LogOut size={18} /> Logout
          </button>
        </div>
  );
}

export default function Dashboard() {
  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { myOrders, getMyOrders } = orderStore();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null)

  const { userData } = authStore();
  const token = userData?.tokens?.access?.token || null;


  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  useEffect(() => {
    getMyOrders(token);
  }, [getMyOrders, token]);

  const formatDateToReadable = (isoDateString) => {
    const date = new Date(isoDateString);

    // Define the options for formatting the date
    const options = { year: 'numeric', month: 'short', day: 'numeric' };

    // Format the date to something like "Sep 8, 2024"
    return date.toLocaleDateString('en-US', options);
  };

  const handleClick = (event, order) => {
    console.log('ooooooooooooorder', order)
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order)
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null)

  };

  const menuItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "My Orders", icon: ShoppingCart },
    { name: "Account Details", icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#330000] to-[#550000] text-white font-sans">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } fixed md:static z-20 w-64 bg-[#a10000] transition-transform duration-300 flex flex-col`}
      >
        <div className="flex items-center justify-between p-4 border-b border-red-800">
          <div className="flex items-center gap-2">
            <a href="/">
              <img
               src={fastX_logo}
               alt="fastX logoX"
               className="w-32 h-auto md:w-40"
               />
            </a>
          </div>
          <button className="md:hidden" onClick={() => setSidebarOpen(false)}>
            ✕
          </button>
        </div>

        <nav className="flex-1 mt-4 space-y-1">
          {menuItems.map(({ name, icon: Icon }) => (
            <motion.button
              key={name}
              whileHover={{ scale: 1.05 }}
              className={`flex items-center gap-3 w-full px-5 py-3 text-left transition-all ${
                active === name ? "bg-red-700 font-semibold" : "hover:bg-red-800"
              }`}
              onClick={() => setActive(name)}
            >
              <Icon size={20} />
              {name}
            </motion.button>
          ))}
        </nav>

        <LogoutButton />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 relative">
        <button
          className="md:hidden absolute top-4 left-4"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>

        {active === "Dashboard" && 
          <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-10"
        >
          <h2 className="text-3xl font-bold mb-3">{active}</h2>
          <p className="text-gray-300 mb-6">
            Here is your <span className="text-red-400">{active}</span> summary and recent activity.
          </p>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((card) => (
              <div
                key={card}
                className="p-6 bg-[#220000] rounded-2xl shadow-lg border border-red-800 hover:shadow-red-900/40 transition-shadow"
              >
                <h3 className="text-lg font-semibold mb-2">Card Title {card}</h3>
                <p className="text-sm text-gray-400">
                  This section shows insights or data related to your food deliveries, orders, and more.
                </p>
              </div>
            ))}
          </div>
        </motion.div>
        }

        {active === "My Orders" && 
          <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-10"
        >
          <h2 className="text-3xl font-bold mb-3">{active}</h2>
          <p className="text-gray-300 mb-6">
            Here is your <span className="text-red-400">{active}</span> summary and recent activity.
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {myOrders.length !== 0 ? myOrders?.map((order, index) => (
                <div key={index} className="p-4 border border-gray-300 rounded-lg shadow-sm">
                  <h3 className="text-lg font-semibold">{order.restaurantName}</h3>
                  <p className="text-gray-600">Date: {formatDateToReadable(order.createdAt)}</p>
                  <p
                    className={`mt-1 ${order.status === 'Delivered'
                      ? 'text-green-500'
                      : order.status === 'Canceled'
                        ? 'text-red-500'
                        : 'text-yellow-500'
                      }`}
                  >
                    Status: {order.order_status}
                  </p>
                  <div className="mt-4 flex space-x-4">
                    <Button
                      aria-describedby={id}
                      variant="contained"
                      onClick={(event) => handleClick(event, order)} // Pass the order to handleClick
                    >
                      View Details
                    </Button>
                    <Popover
                      id={id}
                      open={open}
                      anchorEl={anchorEl}
                      onClose={handleClose}
                      anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'left',
                      }}
                    >
                      {selectedOrder && ( // Display details of selected order
                        <div className="p-4 min-w-[250px] flex flex-col">
                          <h3 className="text-lg font-bold mb-4">Order Details</h3>
                          <div className="mb-4">
                            {selectedOrder.OrderItems.map((item, index) => (
                              <div key={index} className="flex justify-between py-2 text-white">
                                <span>{item.ItemName} X{item.quantity}</span>
                                <span>{item.price} Birr</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex justify-between py-2 font-semibold text-white">
                            <span>Delivery Fee:</span>
                            <span>{selectedOrder.delivery_fee} Birr</span>
                          </div>
                          <div className="flex justify-between py-2 font-semibold text-white">
                            <span>Total Price:</span>
                            <span>{selectedOrder.total_amount} Birr</span>
                          </div>
                        </div>
                      )}
                    </Popover>
                    <button className="bg-green-500 text-white py-1 px-4 rounded-lg hover:bg-green-600">
                      Reorder
                    </button>
                  </div>
                </div>
              )) : 
              <div className="flex flex-col items-center justify-center text-center bg-[#220000] text-white rounded-2xl border border-red-800 shadow-lg p-10 max-w-md mx-auto mt-20">
      <div className="bg-red-900/30 p-6 rounded-full mb-6">
        <PackageOpen size={60} className="text-red-400" />
      </div>

      <h2 className="text-2xl font-semibold mb-2">No Orders Yet</h2>
      <p className="text-gray-400 mb-6">
        Looks like you haven’t placed any orders yet.  
        Explore delicious meals and order your first dish today!
      </p>

      <button
        onClick={() => (window.location.href = "/menu")}
        className="flex items-center gap-2 bg-red-700 hover:bg-red-600 px-6 py-3 rounded-full text-white font-medium transition-all"
      >
        <ShoppingBag size={18} />
        Order Now
      </button>
    </div>
              }
            </div>
        </motion.div>
        }



        {active === "Account Details" && 
          <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-10"
        >
          <h2 className="text-3xl font-bold mb-3">{active}</h2>
          <p className="text-gray-300 mb-6">
            Here is your <span className="text-red-400">{active}</span> summary and recent activity.
          </p>

          <div className='pt-10 pb-7'>
            <div className="max-w-3xl mx-auto p-6 py-10 bg-white shadow-md rounded-lg">
              <h1 className="text-2xl text-[#A40C0C] tes font-bold mb-4">Account Details</h1>
              <UserProfile />
            </div>
          </div>
        </motion.div>
        }
        
      </div>
    </div>
  );
}