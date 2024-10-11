import axios from "axios";
import React, { useEffect, useState } from "react";

const ProductCard = ({ product, onAddtoCart }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md flex flex-col justify-between">
      <img
        src={product.image}
        alt={product.title}
        className="w-full h-48 object-contain mb-4"
      />
      <div>
        <h2 className="font-semibold text-lg mb-2">{product.title}</h2>
        <p className="text-gray-600 mb-2">${product.price}</p>
        <button className="bg-blue-950 hover:bg-blue-900 rounded-lg text-white font-bold py-1 px-2"
        onClick={()=>{onAddtoCart(product.id)}}>
          Add to cart
        </button>
      </div>
    </div>
  );
};

export default function Homepage() {
  const [products, setProducts] = useState([]);


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async(productId) => {
    try {
      await axios.post('/api/cart/add',{productId,quantity:1});
      alert('Product added to cart!')
    } catch (error) {
      console.error('Error adding product to cart:',error)
    }
  };

  return (
    <div className="p-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ">
        {products.map((product) => {
          return <ProductCard product={product} key={product.id} onAddtoCart={handleAddToCart}/>;
        })}
      </div>
    </div>
  );
}
