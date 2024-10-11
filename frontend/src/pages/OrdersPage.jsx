import axios from "axios";
import React, { useEffect, useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get("/api/order");
        setOrders(response.data);
      } catch (error) {
        console.error("Error fetching orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-2xl font-semibold">Loading...</h1>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);

    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleDateString("deafult", { month: "long" });
    const year = date.getFullYear();

    return `${day} ${month} ${year}`;
  };

  return (
    <div className="p-8">
      <div>
        <h1 className="text-3xl font-bold mb-6">Your Orders</h1>
        {orders.length === 0 ? (
          <p>No orders found</p>
        ) : (
          <ul className=" space-y-6">
            {orders.map((order) => (
              <li key={order._id} className="border p-4 roudned-lg shadow-md">
                <h2 className="text-xl font-semibold mb-2">
                  Order ID: {order._id}
                </h2>
                <p>Total Amout: ${order.totalAmount}</p>
                <p>Status: {order.status}</p>
                <h3 className="font-semibold mt-4 mb-2">Order Items</h3>
                <ul className="list-disc pl-6">
                  {order.items.map((item, index) => (
                    <li>
                      Product ID: {item.productId}, Quantity: {item.quantity},
                      Price: ${item.price}{" "}
                    </li>
                  ))}
                </ul>

                <p className="mt-4">
                  Order placed at: {formatDate(order.createdAt)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
