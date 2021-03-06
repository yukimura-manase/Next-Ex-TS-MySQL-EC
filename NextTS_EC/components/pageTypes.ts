export type State = {
    StoreState:{
        user: null |
            { 
                user_id: number,
                name: string,
                user_image: string,
                password: string,
                mail :string,
                phoneNumber: string,
                addressNumber: string,
                address: string,
                point: number,
                likeItemList: [ { product_id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string } ]
            },
        ramen: [ { product_id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string } ] | [],
        cart: [
            {
                cart_id : string,
                status: number,
                orderDate: string,
                userName: string,
                mail: string,
                addressNumber: string,
                address: string,
                phoneNumber: string,
                deliveryDate: string,
                deliveryTime: string,
                cartItemList: [ { product_id:number, size:string, topping:string[], number:number, total:number } ],
            }
        ] | []
    }
};

export type ramenArray = [ { product_id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string } ] | [];

export type ramenObject = { product_id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string };

export type select = { product_id:number, size:string, topping:string[], number:number, total:number | undefined };

export type initialCart = [
    {
      cart_id: number,
      status: number,
      orderDate: string,
      userName: string,
      mail: string,
      addressNumber: string,
      address: string,
      phoneNumber: string,
      deliveryDate: string,
      deliveryTime: string,
      cartItemList: [],
    }
  ];

export type cartType = [
    {
        cart_id : number,
        status: number,
        orderDate: string,
        userName: string,
        mail: string,
        addressNumber: string,
        address: string,
        phoneNumber: string,
        deliveryDate: string,
        deliveryTime: string,
        cartItemList: [ { product_id:number, size:string, topping:string[], number:number, total:number } ]
    }
] | [];

export type cartObject = {
    cart_id : number,
    status: number,
    orderDate: string,
    userName: string,
    mail: string,
    addressNumber: string,
    address: string,
    phoneNumber: string,
    deliveryDate: string,
    deliveryTime: string,
    cartItemList: [ { product_id:number, size:string, topping:string[], number:number, total:number } ];
};

export type cartItemList = [ { product_id:number, size:string, topping:string[], number:number, total:number } ];

export type cartItemObject = { product_id:number, size:string, topping:string[], number:number, total:number };

export type likeItemListType = [ { product_id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string } ];

export type likeItemListOneType = { product_id: number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string };

export type mergeRamen = [ { product_id:number, size:string, topping:string[], number:number, total:number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string } ];

export type mergeRamenOne = { product_id:number, size:string, topping:string[], number:number, total:number, name: string, detail: string, Msizeprice: number, Lsizeprice: number, pic: string };

export type newCartType = [
    {
        cart_id : number,
        status: number,
        orderDate: string,
        userName: string,
        mail: string,
        addressNumber: string,
        address: string,
        phoneNumber: string,
        deliveryDate: string,
        deliveryTime: string,
        cartItemList: [ { product_id:number, size:string, topping:string[], number:number, total:number } ]
    }
];

// ??? Products???????????? => 6?????????

// { 
//     Products : [
//         {
//             product_id: number;
//             name: string;
//             detail: string;
//             Msizeprice: number;
//             Lsizeprice: number;
//             pic: string
//         }
//     ]
// }

// ??? Users???????????? => 10?????????

// {
//     user_id: number; // user???ID (??????????????????????????????)
//     name: string; // ???????????????(????????????)
//     user_image: string; // ???????????????????????????
//     password: string; // ???????????????
//     mail :string; // ?????????????????????
//     phoneNumber: string; // ????????????
//     addressNumber: string; // 
//     address: string; // 
//     point: number; // ????????????
//     likeItemList: string; // ?????????????????????(JSON?????????)
// }

// ??? Carts???????????? => 11?????????

// {
//     cart_id: number; // ????????????id(user_id????????????)
//     status: number; // ???????????????????????? => ??????????????????(status0)???1??????????????????history?????????
//     orderDate: string; // ?????????
//     userName // ????????????
//     mail // ?????????????????????
//     addressNumber: string; //???????????????
//     address: string;???// ??????
//     phoneNumber: string; // ????????????
//     deliveryDate: string; // ?????????
//     deliveryTime: string; // ????????????
//     cartItemList: string; // ???????????????(JSON?????????)
// }
