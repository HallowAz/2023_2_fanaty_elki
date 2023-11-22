enum ROUTES {
    signup = "/signup",
    restaurants = "/restaurants",
    login = "/login",
    main = "/main",
    default = "/",
    cart = "/cart",
    profile = "/me",
}
export { ROUTES };

export const enum UIEventType {
    RESTAURANT_CLICK = "RESTAURANT_CLICK",

    NAVBAR_LOGO_CLICK = "NAVBAR_LOGO_CLICK",
    NAVBAR_ADDRESS_CLICK = "NAVBAR_ADDRESS_CLICK",
    NAVBAR_SIGNIN_CLICK = "NAVBAR_SIGNIN_CLICK",
    NAVBAR_EXIT_CLICK = "NAVBAR_EXIT_CLICK",
    NAVBAR_NAME_CLICK = "NAVBAR_NAME_CLICK",
    NAVBAR_CART_CLICK = "NAVBAR_CART_CLICK",

    LMODAL_SIGNUP_CLICK = "LMODAL_SIGNUP_CLICK",
    LMODAL_CLOSE_CLICK = "LMODAL_CLOSE_CLICK",
    LMODAL_AUTH_CLICK = "LMODAL_AUTH_CLICK",
    LMODAL_BACK_CLICK = "LMODAL_BACK_CLICK",
    LMODAL_NEXT_CLICK = "LMODAL_NEXT_CLICK",
    LMODAL_REG_CLICK = "LMODAL_REG_CLICK",

    ORDER_CLICK = "ORDER_CLICK",
}

export type UIEvent = {
    type: UIEventType;
    data?: unknown;
};
