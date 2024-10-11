import axios from "axios";
import React, { useEffect, useState } from "react";

export default function Cartpage() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState({});

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const response = await axios.get("/api/cart");
        setCart(response.data);
        await fetchProductDetails(response.data.items);
      } catch (error) {
        console.error("Error fetching cart:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, []);
  const fetchProductDetails = async (items) => {
    const productDetails = {};
    for (const item of items) {
      try {
        const response = await axios.get(`/api/products/${item.productId}`);
        productDetails[item.productId] = response.data;
      } catch (error) {
        console.error(`Error fetching product ${item.productId}:`, error);
      }
    }
    setProducts(productDetails);
  };

  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      const product = products[item.productId];
      return total + (product ? product.price * item.quantity : 0);
    }, 0);
  };
  const handlePlaceOrder = async () => {
    try {
      await axios.post("/api/order/place-order");
      alert("Order placed successfully");
      setCart({ ...cart, items: [] });
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <h1 className="text-2xl font-semibold">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">your cart</h1>
      {cart.items.length === 0 ? (
        <h2>Your cart is empty</h2>
      ) : (
        <>
          <ul className="space-y-4">
            <li className="grid grid-cols-5 gap-4 font-semibold border-b pb-2">
              <span className="col-span-2">Title</span>
              <span>Price</span>
              <span>Quantity</span>
              <span>Total</span>
            </li>
            {cart.items.map((item) => {
              const product = products[item.productId];
              return (
                <li
                  key={item.id}
                  className="grid grid-cols-5 gap-4  border-b pb-2"
                >
                  <span className="col-span-2">
                    {product ? product.title : "Loading..."}
                  </span>
                  <span>{product ? "$" + product.price : "Loading..."}</span>

                  <span>{item.quantity}</span>
                  <span>
                    {product
                      ? "$" + product.price * item.quantity
                      : "Loading..."}
                  </span>
                </li>
              );
            })}
          </ul>
          <div className="mt-8 flex flex-col items-center justify-center">
            <p className="text-2xl text-green-700 font-bold border-b w-full text-center mb-4 p-4">
              <span className="text-lg">Total:</span> $
              {calculateTotal().toFixed(2)}
            </p>

            <button
              className="bg-blue-950 hover:bg-blue-900 rounded-lg text-white font-bold py-1 px-2"
              onClick={handlePlaceOrder}
            >
              Order Now
            </button>
          </div>
        </>
      )}
    </div>
  );
}
