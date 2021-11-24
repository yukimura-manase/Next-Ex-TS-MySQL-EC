
export const loginUserSelector = (state)=> {
    return (
        state.StoreState.user
    );
  };

export const ramenSelector = (state)=> {
    return (
        state.StoreState.ramen
    );
};

export const cartSelector = (state)=> {
    return (
        state.StoreState.cart
    );
};

export const historyCartSelector = (state)=> {
    return (
        state.StoreState.historyCart
    );
};



