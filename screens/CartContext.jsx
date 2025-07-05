import React, { createContext, useContext, useState } from "react";


const CartContext = createContext();

export const useCart = () => useContext(CartContext);


const isSameProduct = (item1, item2) => {
  return (
    item1.id === item2.id &&
    item1.size === item2.size &&
    item1.variant?.id === item2.variant?.id
  );
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    console.log("🚀 addToCart called with:", product);
    if (!product?.id) return;

    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => isSameProduct(item, product));
      if (existing) {
        return prevItems.map((item) =>
          isSameProduct(item, product)
            ? { ...item, quantity: (item.quantity || 0) + 1 }
            : item
        );
      }
      
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (product) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => !isSameProduct(item, product))
    );
  };

  const updateQuantity = (product, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(product);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        isSameProduct(item, product) ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const getTotalItems = () =>
    cartItems.reduce((total, item) => total + (item.quantity || 0), 0);

  const getTotalPrice = () =>
    cartItems.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 0),
      0
    );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        getTotalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
