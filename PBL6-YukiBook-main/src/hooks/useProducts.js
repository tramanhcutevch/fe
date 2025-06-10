import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../hooks/useAuth";

const API_URL = import.meta.env.VITE_API_URL;

export default function useProducts() {
  const { user, isAuthLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback(async () => {
    if (!user?.token || isAuthLoading) return;

    console.log("User ID:", user.user_id);
    console.log("User Token:", user.token);

    setLoading(true);
    try {
      const shopRes = await axios.get(
        `${API_URL}/shops/user/${user.user_id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      const prodRes = await axios.get(
        `${API_URL}/products/shop/${shopRes.data.id}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setProducts(prodRes.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user, isAuthLoading]);

  const deleteProduct = useCallback(
    async (id) => {
      console.log("User ID:", user.user_id);
      console.log("User Token:", user.token);

      await axios.delete(`${API_URL}/products/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProducts((prev) => prev.filter((p) => p.id !== id));
    },
    [user]
  );

  const updateProduct = useCallback(
    async (id, updates) => {
      console.log("User ID:", user.user_id);
      console.log("User Token:", user.token);

      await axios.put(`${API_URL}/products/${id}`, updates, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
      );
    },
    [user]
  );

  const createProduct = useCallback(
    async (newProd) => {
      console.log("User ID:", user.user_id);
      console.log("User Token:", user.token);

      const { data } = await axios.post(`${API_URL}/products`, newProd, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setProducts((prev) => [...prev, data]);
      return data;
    },
    [user]
  );

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    fetchProducts,
    deleteProduct,
    updateProduct,
    createProduct,
  };
}
