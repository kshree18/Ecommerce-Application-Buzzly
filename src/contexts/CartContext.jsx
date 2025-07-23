import { createContext, useState, useEffect, useContext } from "react";
import { useAuth } from "./AuthContext.jsx";

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [itemAmount, setItemAmount] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const { user, token, isAuthenticated } = useAuth();

  // Calculate totals whenever cart changes
  useEffect(() => {
    const total = cart.reduce((accumulator, currentItem) => {
      return accumulator + currentItem.price * currentItem.amount;
    }, 0);
    setTotal(parseFloat(total).toFixed(2));
  }, [cart]);

  useEffect(() => {
    if (cart) {
      const amount = cart.reduce((accumulator, currentItem) => {
        return accumulator + currentItem.amount;
      }, 0);
      setItemAmount(amount);
    }
  }, [cart]);

  // Load user's cart when they log in
  useEffect(() => {
    if (isAuthenticated && token) {
      loadUserCart();
    } else {
      // Clear cart when user logs out
      setCart([]);
      setItemAmount(0);
      setTotal(0);
    }
  }, [isAuthenticated, token]);

  const loadUserCart = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.data.cart.items || []);
      } else {
        console.error('Failed to load cart');
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (product, id) => {
    if (!isAuthenticated) {
      // For non-authenticated users, use local storage
      const newItem = { ...product, amount: 1 };
      const cartItem = cart.find((item) => item.id === id);
      
      if (cartItem) {
        const newCart = [...cart].map((item) => {
          if (item.id === id) {
            return { ...item, amount: cartItem.amount + 1 };
          } else {
            return item;
          }
        });
        setCart(newCart);
      } else {
        setCart([...cart, newItem]);
      }
      return;
    }

    // For authenticated users, sync with backend
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/cart/add', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId: id,
          amount: 1
        })
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.data.cart.items || []);
      } else {
        console.error('Failed to add item to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (id) => {
    if (!isAuthenticated) {
      // For non-authenticated users, use local storage
      const newCart = cart.filter((item) => item.id !== id);
      setCart(newCart);
      return;
    }

    // For authenticated users, sync with backend
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/cart/remove/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.data.cart.items || []);
      } else {
        console.error('Failed to remove item from cart');
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      setCart([]);
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/cart/clear', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setCart([]);
      } else {
        console.error('Failed to clear cart');
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const increaseAmount = async (id) => {
    if (!isAuthenticated) {
      const cartItem = cart.find((item) => item.id === id);
      addToCart(cartItem, id);
      return;
    }

    try {
      setLoading(true);
      const cartItem = cart.find((item) => item.product === id || item.id === id);
      if (!cartItem) return;

      const newAmount = cartItem.amount + 1;
      const response = await fetch(`http://localhost:5000/api/cart/update/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: newAmount })
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.data.cart.items || []);
      } else {
        console.error('Failed to update cart item');
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
    } finally {
      setLoading(false);
    }
  };

  const decreaseAmount = async (id) => {
    if (!isAuthenticated) {
      const cartItem = cart.find((item) => item.id === id);
      if (cartItem) {
        const newCart = cart.map((item) => {
          if (item.id === id) {
            return { ...item, amount: cartItem.amount - 1 };
          } else {
            return item;
          }
        });
        setCart(newCart);
      }
      if (cartItem.amount <= 1) {
        removeFromCart(id);
      }
      return;
    }

    try {
      setLoading(true);
      const cartItem = cart.find((item) => item.product === id || item.id === id);
      if (!cartItem) return;

      const newAmount = cartItem.amount - 1;
      
      if (newAmount <= 0) {
        await removeFromCart(id);
        return;
      }

      const response = await fetch(`http://localhost:5000/api/cart/update/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ amount: newAmount })
      });

      if (response.ok) {
        const data = await response.json();
        setCart(data.data.cart.items || []);
      } else {
        console.error('Failed to update cart item');
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        increaseAmount,
        decreaseAmount,
        itemAmount,
        total,
        loading,
        loadUserCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartProvider;
