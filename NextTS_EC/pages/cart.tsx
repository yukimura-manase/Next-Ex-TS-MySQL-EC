import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeCart } from "../redux/ActionCreator";
import { loginUserSelector, ramenSelector, cartSelector } from "../redux/Selector";

import { createStyles,makeStyles } from '@material-ui/styles';
import { ramenArray, cartItemList, mergeRamen, mergeRamenOne } from "../components/pageTypes";
import router from "next/router";
import axios from "axios";

const useStyle = makeStyles(() =>
    createStyles({
        "text":{
            textAlign:"center",
            fontWeight:600
        },
        "button": {
            borderColor: "#FF6633",
            color: "#FF6633",
            fontWeight: 600,
            marginBottom: "8px",
            backgroundColor: "#fff",
            padding: "10px",
            "&:hover": {
                backgroundColor: "#FF6633",
                color: "#fff"
            }
        },
        "pic":{
            width: "350px",
            height: "200px"
        },
        "tableWidth":{
            width:"80%",
            margin:"3px auto",
            paddingTop:"30px",
            paddingBottom:"30px"
        },
        "cartTitle":{
            background:"#FF6633",
            fontSize:"10px",
            color:"#fff"

        },
        "tableBody":{
            background:"#ffead6"
        },
        "u":{
            textDecoration:"none",
            borderBottom:"double 5px #faa61a",
        },
        "price":{
            fontSize:"18px",
            paddingBottom:"15px"
        }

    }),
);

const Cart = ()=> {

    const classes = useStyle();

    const user = useSelector(loginUserSelector);

    const userId = user.user_id;

    const ramenData = useSelector(ramenSelector);

    const cartData = useSelector(cartSelector);

    const dispatch = useDispatch();

    const [ ramens, setRamen ] = useState<ramenArray | []>([]);
    const [ carts, setCart ] = useState<cartItemList | []>([]);
    const [ carts2 , setCart2 ] = useState<mergeRamen | []>([]);

    useEffect(
        ()=>{
    
            if( ramenData.length !== 0 && cartData.cartItemList !== 0){

                setRamen(ramenData);

                let copyCartItemList = cartData.cartItemList.slice();

                setCart(cartData.cartItemList);

                const cartIdList =  copyCartItemList.map( cart => cart.product_id); //????????????????????????ID??????????????????

                // ???????????????????????????????????????????????????
                let macthRamenData:any = cartIdList.map( cartid => {
                    return ramenData.find( (ramen: any) => cartid === ramen.product_id) // id?????????????????????????????????
                });

                // ???????????????detail?????????puroduct_id??????????????????????????????????????????????????????????????????????????? => detail????????????????????????????????????????????????
                const mergeArray: any = []; // ???????????????

                copyCartItemList.forEach( (cart: any) => {

                    let idMatchRamen = macthRamenData.find( (ramendata: any) => ramendata.product_id === cart.product_id); // id???????????????????????????????????????

                    const merged = { ...cart, ...idMatchRamen };

                    mergeArray.push(merged);
                });

                cartData.length !== 0 && setCart2(mergeArray);

            };
            
        },[cartData,ramenData,carts,ramens])
    
    
    const totalTax = ()=>{ // ???????????????????????????
        let tax:number[] = [];
        carts.forEach( (cart: any) => {
            tax.push(cart.total * 0.1);
        });
    
        let totalTax = tax.reduce( (sum: number, currentVal: number ) => {
            return sum + currentVal;
        },0) // ?????????????????????????????????
        return totalTax;
    };

    const sumTotalPlice = ()=>{ // ????????????(total)?????????????????????????????????
        let taxInclude:Array<number> = [];

        carts.forEach((cart: any) => {
            taxInclude.push(cart.total * 1.1);
        });

        let totalTaxIncludes = taxInclude.reduce( (sum: number,currentVal: number) => {
            return sum + currentVal;
        },0);

        return Math.floor(totalTaxIncludes);
    };

    const sumPoint = ()=> {
        const sumTotal = sumTotalPlice();

        return Math.floor(sumTotal / 10);
    };
    
    const remove = (index: number)=>{
        
        const copyCart2:any = carts2.concat();
        copyCart2.splice(index, 1);
    
        setCart2(copyCart2);

        if(user.user_id){

            const user_id = user.user_id;

            const server = `http://localhost:8000/api/cartremove/${user_id}`;

            axios.post(server, {index: index})
            .then( (res)=> {
                console.log(res);

                dispatch(removeCart(index));
            }).catch(console.error);

        } else {

            const cartItemList = sessionStorage.getItem('cartItemList');
            const parseCartItemLIst = JSON.parse(cartItemList);

            parseCartItemLIst.splice(index, 1);

            sessionStorage.setItem( 'cartItemList', JSON.stringify(parseCartItemLIst) );

            dispatch(removeCart(index));
        };
    
    };

    const [ randomramen, setRandom ] = useState<string>('');

const happy = ['??????','??????','??????',] // ??????????????????

const randomRamen = ()=>{
    let random: any = carts2[Math.floor(Math.random() * carts2.length )];
    let random2 = happy[Math.floor(Math.random() * happy.length )];

    setRandom(`?????????????????????????????????????????????????????????${random.name}???!! ????????????????????????????????????${random2}???`);
};

    

    return (
        <React.Fragment>
            {
                userId ? 
                <div className={classes.text}>
                    <h2><u className={classes.u}>{user.name}????????????????????????????????????</u></h2>
                </div> :
                <h2 className={classes.text}><u className={classes.u}>???????????????????????????</u></h2>
            }
           
            { cartData && cartData.cartItemList.length !== 0 ?
            <div className={classes.text}>
               

                <table className={classes.tableWidth}>
                    <thead>
                        <tr className={classes.cartTitle}>
                            <th>
                                <h2>?????????</h2>
                            </th>
                            <th>
                                <h2>??????????????????</h2>
                            </th>
                            <th>
                                <h2>?????????</h2>
                            </th>
                            <th>
                                <h2>??????</h2>
                            </th>
                            <th>
                                <h2>???????????????</h2>
                            </th>
                            <th>
                                <h2>??????(??????)</h2>
                            </th>
                            <th>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        carts2.map( (ailias: mergeRamenOne,index: number)=>{
                            return (
                            <tr key={index} className={classes.tableBody} >
                                <td>{ailias.name}</td>
                                <td><img src={ailias.pic} className={classes.pic} alt='' ></img></td>
                                <td>{ailias.size}</td>
                                <td>{ailias.number}</td>
                                <td>{ `${ailias.topping}` }</td>
                                <td>{ `${ailias.total}???` }</td>
                                <td><button onClick={ ()=>{remove(index)} } className={classes.button}>??????</button></td>
                            </tr>
                            )
                        })
                    }
                    </tbody>
                </table>


                <div>????????????{ totalTax() }???</div>
                <div className={classes.price}><u className={classes.u}>????????????????????????{ sumTotalPlice() }???(??????)</u></div>
                <div className={ classes.price } >?????????????????????{ sumPoint() }????????????</div>

                <div>
                    <button onClick={ ()=>{randomRamen()} }???className={classes.button}>??????????????????????????????????????????????????????</button>
                    <h3>{randomramen}</h3>
                </div>
                
                <div>
                    <button onClick={ ()=>{ router.push('/order')} } className={classes.button}>??????????????????</button>
                </div>
            
            </div> : <h2>???????????????????????????????????????</h2>
            }
        </React.Fragment>
    );
};

export default Cart;