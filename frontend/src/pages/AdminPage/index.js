import { useEffect, useMemo, useState } from "react";
import { LogOut, Menu, Package, Plus} from "lucide-react";
import { motion } from "framer-motion";
import fastX_logo from '../../assets/fastX-logo.png';
import useAdminMenuStore from '../../admin/menu.store';
import useAdminRestaurantStore from '../../admin/restaurant.store';
import authStore from '../../store/auth.store';
import { useNavigate } from "react-router-dom";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import axios from "axios";
import { Link } from 'react-router-dom';

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
  const [active, setActive] = useState("Overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { restaurantData, fetchRestaurantData } = useAdminRestaurantStore((state) => ({
    restaurantData: state.restaurantData,
    fetchRestaurantData: state.fetchRestaurantData,
}));

  const { menuItems, fetchAllMenuItems, loading, error, notFound } = useAdminMenuStore((state) => ({
    menuItems: state.menuItems,
    loading: state.loading,
    error: state.error,
    notFound: state.notFound,
    fetchAllMenuItems: state.fetchAllMenuItems,
}));

const { userData } = authStore();
const token = userData?.tokens?.access?.token || null;

const [menuItemsState, setMenuItems] = useState(menuItems);

// Fetch the restaurant data on component mount
useEffect(() => {
    fetchRestaurantData(token);
}, [token, fetchRestaurantData]);

// Fetch menu items when navigating to the menu section
    useEffect(() => {
        if (active === 'Menu Items') {
            fetchAllMenuItems(token);
        }
    }, [active, token, fetchAllMenuItems]);

    useEffect(() => {
        setMenuItems(menuItems); // Sync local state with store state
    }, [menuItems]);

const deleteMenuItem = async (menuItemId) => {
    try {
        const response = await axios.delete(`${process.env.REACT_APP_API_URL}/menu/delete/${menuItemId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.status === 200) {
            const updatedMenuItems = menuItemsState.filter((menu) => menu._id !== menuItemId);
            setMenuItems(updatedMenuItems);
            console.log('Menu item deleted successfully');
        }
    } catch (error) {
        console.error('Error deleting menu item:', error);
    }
};

  const menuItems_ = [
    { name: "Overview", icon: Package },
    { name: "Menu Items", icon: Plus },
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
          {menuItems_.map(({ name, icon: Icon }) => (
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

        {active === "Overview" && 
          <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-10"
        >
          <div>
                        <h1 className="text-4xl font-bold mb-6">Overview</h1>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-[#3b1f1b] p-6 rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold">Earnings Today</h2>
                                <p className="mt-4 text-2xl">$320</p>
                            </div>
                            <div className="bg-[#3b1f1b] p-6 rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold">Orders Today</h2>
                                <p className="mt-4 text-2xl">12 Orders</p>
                            </div>
                            <div className="bg-[#3b1f1b] p-6 rounded-lg shadow-md">
                                <h2 className="text-xl font-semibold">Recent Reviews</h2>
                                <p className="mt-4">"Great service!" - John</p>
                                <p className="mt-2">"Loved the food!" - Emily</p>
                            </div>
                        </div>
                    </div>

        </motion.div>
        }

        {active === "Menu Items" && 
          <motion.div
          key={active}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-10"
        >
          <div>
                    <div className="border rounded-lg">
                        {loading ? (
                            <p>Loading menu items...</p>
                        ) : error ? (
                            <p>Error loading menu items</p>
                        ) : notFound ? (
                            <p>No menu items found</p>
                        ) : (
                            <TableContainer sx={{ backgroundColor: 'transparent' }} component={Paper}>
                                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ color: 'white' }}>Menu Items</TableCell>
                                            <TableCell sx={{ color: 'white' }} align="right"></TableCell>
                                            <TableCell sx={{ color: 'white' }} align="right"></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {menuItemsState.map((menu) => (
                                            <TableRow
                                                key={menu._id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell sx={{ color: 'white' }} component="th" scope="row">
                                                    {menu.name}
                                                </TableCell>
                                                <TableCell sx={{ color: 'white' }} align="right">
                                                    <Link className="text-white" to={`/update-menu/${menu._id}`}>
                                                        <button className="bg-green-500 py-0 round-md">Update</button>
                                                    </Link>
                                                </TableCell>
                                                <TableCell sx={{ color: 'white' }} align="right">
                                                    <button
                                                        className="primary py-0"
                                                        onClick={() => deleteMenuItem(menu._id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </div>
                    <div className='mt-10'>
                        <Link to={'/create-menu'}>
                            <button class="flex items-center px-4 py-2 primary text-white font-semibold rounded-md hover:bg-red-700 transition">
                                <span class="mr-2 text-lg">+</span> Add Menu
                            </button>
                        </Link>
                    </div>
                </div>
        </motion.div>
        }
        
      </div>
    </div>
  );
}