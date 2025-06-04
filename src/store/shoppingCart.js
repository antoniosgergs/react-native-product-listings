import { create } from 'zustand';

const useShoppingCart = create((set, get) => ({
  shoppingCart: [],
  addItemToShoppingCart: ({ item }) => {
    const cart = get().shoppingCart;
    const itemFound = cart.find(val => val._id === item?._id);

    // If item found --> increase the count else add it with count 1
    const newShoppingCart = itemFound
      ? cart.map(val =>  val._id === item?._id ? {...val, count: val.count + 1} : val)
      : [...cart, {...item, count:1}];

    set({shoppingCart: newShoppingCart});
  },
  removeItemFromShoppingCart: ({ item }) => {
    const cart = get().shoppingCart;
    const itemFound = cart.find(val => val._id === item?._id);

    // If item found --> decrease the count if > 1 else remove it from shoppingCart
    const newShoppingCart = itemFound?.count > 1
      ? cart.map(val => val._id === item?._id ? { ...val, count: val.count - 1 } : val)
      : cart.filter(val => val._id !== item?._id);

    set({ shoppingCart: newShoppingCart });
  },
  deleteItemFromShoppingCart: ({item})=>{
    const cart = get().shoppingCart;

    const newShoppingCart = cart.filter(val => val._id !== item?._id);

    set({ shoppingCart: newShoppingCart });
  },
}));

export default useShoppingCart;
