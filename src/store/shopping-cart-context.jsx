import { createContext, useReducer } from "react";
import { DUMMY_PRODUCTS } from "../dummy-products";

export const CartContext = createContext({
    items: [],
    addItemToCart: () => { }, // These values will actually not get used but it will be suggested by auto-completion
    updateItemQuantity: () => { }
});

function ShoppingCartReducer(state, action) { // here the state will be latest guaranteed snapshot of the curent state
    if(action.type === 'ADD_ITEM'){
        // const updatedItems = [...prevShoppingCart.items];
        const updatedItems = [...state.items];

            const existingCartItemIndex = updatedItems.findIndex(
                // (cartItem) => cartItem.id === id
                (cartItem) => cartItem.id === action.playload
            );
            const existingCartItem = updatedItems[existingCartItemIndex];

            if (existingCartItem) {
                const updatedItem = {
                    ...existingCartItem,
                    quantity: existingCartItem.quantity + 1,
                };
                updatedItems[existingCartItemIndex] = updatedItem;
            } else {
                const product = DUMMY_PRODUCTS.find((product) => product.id === action.playload);
                updatedItems.push({
                    id: action.playload,
                    name: product.title,
                    price: product.price,
                    quantity: 1,
                });
            }

            return {
                //...state, // Not needed here bcaz we have only one value
                items: updatedItems,
            };
    }

    if(action.type === 'UPDATE_ITEM'){
        const updatedItems = [...state.items];
            const updatedItemIndex = updatedItems.findIndex(
                (item) => item.id === action.playload.productId
            );

            const updatedItem = {
                ...updatedItems[updatedItemIndex],
            };

            updatedItem.quantity += action.playload.amount;

            if (updatedItem.quantity <= 0) {
                updatedItems.splice(updatedItemIndex, 1);
            } else {
                updatedItems[updatedItemIndex] = updatedItem;
            }

            return {
                //...state,
                items: updatedItems,
            };
    }
    return state;
}

export default function CartContextProvider({ children }) {
    const [shoppingCartState, shoppingCartDispatch] = useReducer( // The second param is initial state which will be ricived at created recuder function(CartContextProvider)
        ShoppingCartReducer,
        {
            items: [],
        });

    // const [shoppingCart, setShoppingCart] = useState({
    //     items: [],
    // });

    function handleAddItemToCart(id) {
        shoppingCartDispatch({
            type: 'ADD_ITEM', // We can name anything here to these properties 
            playload: id
        });

        // setShoppingCart((prevShoppingCart) => {
        //     const updatedItems = [...prevShoppingCart.items];

        //     const existingCartItemIndex = updatedItems.findIndex(
        //         (cartItem) => cartItem.id === id
        //     );
        //     const existingCartItem = updatedItems[existingCartItemIndex];

        //     if (existingCartItem) {
        //         const updatedItem = {
        //             ...existingCartItem,
        //             quantity: existingCartItem.quantity + 1,
        //         };
        //         updatedItems[existingCartItemIndex] = updatedItem;
        //     } else {
        //         const product = DUMMY_PRODUCTS.find((product) => product.id === id);
        //         updatedItems.push({
        //             id: id,
        //             name: product.title,
        //             price: product.price,
        //             quantity: 1,
        //         });
        //     }

        //     return {
        //         items: updatedItems,
        //     };
        // });
    }

    function handleUpdateCartItemQuantity(productId, amount) {
        shoppingCartDispatch({
            type: 'UPDATE_ITEM',
            playload: {
                productId, // If the property-name and varibale name is same then we dont need to do => productId: productId
                amount
            }
        });
    }

    const ctxValue = {
        // items: shoppingCart.items,
        items: shoppingCartState.items,
        addItemToCart: handleAddItemToCart,
        updateItemQuantity: handleUpdateCartItemQuantity
    }

    return <CartContext.Provider value={ctxValue} >
        {children}
    </CartContext.Provider>
}