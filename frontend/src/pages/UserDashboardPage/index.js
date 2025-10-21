import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { LogOut, MapPinHouse } from 'lucide-react';
import fastXLogo from '../../assets/fastX-logo.png';
import { Button, Popover } from '@mui/material';
import UserProfile from '../../components/userProfile';
import orderStore from '../../store/order.store';
import { useEffect } from 'react';
import authStore from '../../store/auth.store';


const NAVIGATION = [
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'orders',
    title: 'My Orders',
    icon: <ShoppingCartIcon />,
  },
  {
    segment: 'address',
    title: 'Saved Address',
    icon: <MapPinHouse />,
  },
  {
    segment: 'account',
    title: 'Account Details',
    icon: <AccountBoxIcon />,
  },
];

// Simplified theme with one background color
const customTheme = createTheme({
  palette: {
    background: {
      default: '#F9F9FE', // Light background
      paper: '#A40C0C',   // Paper color for light theme
    },
    text: {
      primary: '#000000',  // Primary text color for light mode
      secondary: '#555555', // Secondary text color for light mode
    },
    action: {
      active: '#ffffff',   // Default icon color (black for light mode)
      hover: '#a72828',    // Icon color on hover (lighter gray)
      selected: '#FF6347', // Icon color when selected (e.g., a red-orange like Tomato color)
      disabled: '#BDBDBD', // Disabled icon color (gray)
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});



function DemoPageContent({ pathname }) {

  const { userData } = authStore();
  const token = userData?.tokens?.access?.token || null;

  const { myOrders, getMyOrders } = orderStore();


  console.log("my -------orders", myOrders);

  useEffect(() => {
    getMyOrders(token);
  }, [getMyOrders, token]);

  const [selectedOrder, setSelectedOrder] = React.useState(null)
  console.log("selected order", selectedOrder)


  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event, order) => {
    console.log('ooooooooooooorder', order)
    setAnchorEl(event.currentTarget);
    setSelectedOrder(order)
  };

  const logoutHandler = () => {
    console.log("logging out")
    authStore.getState().clearUserData();
  };



  const handleClose = () => {
    setAnchorEl(null);
    setSelectedOrder(null)

  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const formatDateToReadable = (isoDateString) => {
    const date = new Date(isoDateString);

    // Define the options for formatting the date
    const options = { year: 'numeric', month: 'short', day: 'numeric' };

    // Format the date to something like "Sep 8, 2024"
    return date.toLocaleDateString('en-US', options);
  };


  return (
    <Box sx={{ py: 4, px: 3 }}>
      {pathname === '/dashboard' ? (
        <Typography>
          <div>Dashboard content for dashboard</div>
          <div class="mt-8">
            <button class="py-2 primary text-white rounded-lg focus:outline-none" onClick={logoutHandler}>
              Logout
            </button>
          </div>
        </Typography>
      ) : pathname === '/orders' ? (
        <Typography>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold">My Orders</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {myOrders?.map((order, index) => (
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
          </div>
        </Typography>
      ) : pathname === '/account' ? (
        <Typography>
          <div className='pt-10 pb-7'>
            <div className="max-w-3xl mx-auto p-6 py-10 bg-white shadow-md rounded-lg">
              <h1 className="text-2xl text-[#A40C0C] tes font-bold mb-4">Account Details</h1>
              <UserProfile />
            </div>
          </div>
        </Typography>
      ) : (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">Saved Addresses</h2>
          <div className="mt-4">
            {/* {user?.savedAddresses.map((address, index) => (
              <div key={index} className="p-4 border border-gray-300 rounded-lg shadow-sm mb-4">
                <h3 className="text-lg font-semibold">{address.label}</h3>
                <p className="text-gray-600">{address.address}</p>
                <button className="bg-gray-500 text-white py-1 px-4 rounded-lg hover:bg-gray-600 mt-2">
                  Edit Address
                </button>
              </div>
            ))} */}
            <button className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600">
              Add New Address
            </button>
          </div>
        </div>
      )}
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function DashboardLayoutBranding(props) {
  const { window } = props;

  const [pathname, setPathname] = React.useState('/dashboard');

  const router = React.useMemo(() => {
    return {
      pathname,
      searchParams: new URLSearchParams(),
      navigate: (path) => setPathname(String(path)),
    };
  }, [pathname]);

  const demoWindow = window !== undefined ? window() : undefined;

  return (
    <AppProvider
      navigation={NAVIGATION}
      branding={{
        // Make the logo a clickable link to the landing page
        logo: (
          <a href="/" aria-label="Home">
            <img src={fastXLogo} alt="MUI logo" />
          </a>
        ),
        // Change the color of the title
        title: <span className="text-white font-bold">fastX</span>,
      }}
      router={router}
      theme={customTheme} // Single color background theme
      window={demoWindow}
    >
      <DashboardLayout slotProps={{
        toolbarAccount: {
          localeText: {
            signOutLabel: 'Logout'
          },
          slotProps: {
            signInButton: <LogOut />
          }
        }
      }}>
        <div>
          <DemoPageContent pathname={pathname} />
        </div>
      </DashboardLayout>
    </AppProvider>
  );
}

DashboardLayoutBranding.propTypes = {
  window: PropTypes.func,
};

export default DashboardLayoutBranding;
