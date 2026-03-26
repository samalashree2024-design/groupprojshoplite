// Load cart from local storage if available
const savedCart = localStorage.getItem("cart");
const savedUser = localStorage.getItem("user");
let initialUser = null;

try {
    initialUser = savedUser ? JSON.parse(savedUser) : null;
} catch {
    initialUser = null;
}

export const initialState = {
    cart: savedCart ? JSON.parse(savedCart) : [],
    user: initialUser, // Frontend-only auth simulation
};

// Selector
export const getCartTotal = (cart) =>
    cart?.reduce((amount, item) => item.price * item.quantity + amount, 0);

export const getCartItemsCount = (cart) =>
    cart?.reduce((count, item) => count + item.quantity, 0);

const reducer = (state, action) => {
    let newCart;
    switch (action.type) {
        case "ADD_TO_CART":
            const itemIndex = state.cart.findIndex(
                (cartItem) => cartItem.id === action.item.id
            );

            if (itemIndex >= 0) {
                newCart = [...state.cart];
                newCart[itemIndex].quantity += 1;
            } else {
                newCart = [...state.cart, { ...action.item, quantity: 1 }];
            }

            localStorage.setItem("cart", JSON.stringify(newCart));

            return {
                ...state,
                cart: newCart,
            };

        case "REMOVE_FROM_CART":
            // Removes item entirely regardless of quantity
            newCart = state.cart.filter((item) => item.id !== action.id);
            localStorage.setItem("cart", JSON.stringify(newCart));

            return {
                ...state,
                cart: newCart
            };

        case "UPDATE_QUANTITY":
            newCart = [...state.cart];
            const updateIndex = newCart.findIndex(
                (cartItem) => cartItem.id === action.id
            );

            if (updateIndex >= 0) {
                if (action.quantity > 0) {
                    newCart[updateIndex].quantity = action.quantity;
                } else {
                    // If quantity is 0 or less, remove it
                    newCart = newCart.filter((item) => item.id !== action.id);
                }
            }

            localStorage.setItem("cart", JSON.stringify(newCart));

            return {
                ...state,
                cart: newCart
            };

        case "SET_USER":
            if (action.user) {
                localStorage.setItem("user", JSON.stringify(action.user));
            } else {
                localStorage.removeItem("user");
            }
            return {
                ...state,
                user: action.user
            }

        default:
            return state;
    }
};

export default reducer;
