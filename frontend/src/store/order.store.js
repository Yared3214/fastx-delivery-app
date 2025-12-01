import { create } from 'zustand';
import axios from 'axios';


const orderStore = create((set, get) => ({
    allOrders: [],
    myOrders: [],
    order: {},
    loading: false,
    error: null,
    getMyOrders: async (token) => {
        set({ loading: true });
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/order/user`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                set({ myOrders: response.data.data.orders });
            }
        } catch (error) {
            set({ error: error.response?.data?.message || error.message });
        } finally {
            set({ loading: false });
        }
    },
    //get order by id
    getOrderById: async (token, orderID) => {
        
        set({ loading: true });
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/order/get/${orderID}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.status === 200) {
                set({ order: response.data.data.order });
            }

        } catch (error) {
            set({ error: error.response?.data?.message || error.message });
        } finally {
            set({ loading: false });
        }
    },
    //get all orders 
    getAllOrders: async (token) => {
        set({ loading: true });
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/order/all`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                set({ allOrders: response.data.data.orders });
            }
        } catch (error) {
            set({ error: error.response?.data?.message || error.message });
        } finally {
            set({ loading: false });
        }
    },


}));

export default orderStore;

