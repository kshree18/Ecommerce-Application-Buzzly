import { createContext, useState, useEffect } from "react";

export const ProductContext = createContext();

const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("http://localhost:5000/api/products");
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.status === 'success') {
          setProducts(data.data.products);
        } else {
          throw new Error(data.message || 'Failed to fetch products');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError(error.message);
        // Fallback to Fake Store API if backend is not available
        try {
          const fallbackResponse = await fetch("https://fakestoreapi.com/products");
          const fallbackData = await fallbackResponse.json();
          setProducts(fallbackData);
        } catch (fallbackError) {
          console.error('Fallback API also failed:', fallbackError);
          setError('Unable to load products');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, error }}>
      {children}
    </ProductContext.Provider>
  );
};

export default ProductProvider;
