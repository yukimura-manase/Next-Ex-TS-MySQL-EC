import Head from 'next/head';
import Image from 'next/image';
//import styles from '../styles/Home.module.css';
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { cartSelector, loginUserSelector, ramenSelector } from '../redux/Selector';
import axios from 'axios';
import { fetchRamen, addLike, fetchCartItem, setNoLoginUser } from '../redux/ActionCreator';
import { useRouter } from 'next/router';
import { createStyles, makeStyles } from '@material-ui/styles';
import { ramenObject,  } from '../components/pageTypes';

const useStyle = makeStyles(() =>
    createStyles({
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
        "search": {
            textAlign: "center"
        },
        "card": {
            width: "350px",
            background: "#FFF",
            borderRadius: "5px",
            boxShadow: "0 2px 5px #ccc",
            marginBottom: "40px",
        },
        "card-list": {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            height: "auto",
            width: "auto",
            padding: "5%",

        },
        "card-content": {
            padding: "20px",
            textAlign: "center",
            fontWeight: 700,

        },
        "card-title": {
            fontSize: "20px",
            fontWeight: 700,
            marginTop: "20px",
            marginBottom: "20px",
            textAlign: "center"
        },
        "card-picutre": {
            width: "350px",
            height: "200px"

        },
        "text":{
            width:"250px",
            height:"35px",
            marginRight:"15px"            
        },
        "clearButton": {
            borderColor: "#FF6633",
            color: "#FF6633",
            fontWeight: 600,
            // marginBottom: "8px",
            backgroundColor: "#fff",
            padding: "10px",
            marginLeft:"15px",
            "&:hover": {
                backgroundColor: "#FF6633",
                color: "#fff"
            }
        },
        "randombutton": {
            borderColor: "#FF6633",
            color: "#FF6633",
            fontWeight: 600,
            backgroundColor: "#fff",
            padding: "10px",
            "&:hover": {
                backgroundColor: "#FF6633",
                color: "#fff"
            }
        },
        "lucky":{
            backgroundColor:"#ffead6",
            width:"60%",
            paddingTop:"15px",
            paddingBottom:"15px",
            marginLeft:"auto",
            marginRight:"auto",
            marginTop:"50px"
        },
        "likebutton":{
            borderColor: "#FF6633",
            color: "#FF6633",
            fontWeight: 600,
            marginBottom: "8px",
            backgroundColor: "#fff",
            padding: "10px",
            marginLeft:"15px",

            "&:hover": {
                backgroundColor: "#FF6633",
                color: "#fff"
            }
        },

    }),
);

const Home = ()=> {

  const classes = useStyle();

  const user = useSelector(loginUserSelector);

  const ramenData = useSelector(ramenSelector);

  const cartData = useSelector(cartSelector);


  const dispatch = useDispatch();

  const router = useRouter();

  const [ramenlist, setRamen] = useState([]); // State?????????????????????????????????????????????????????????

  useEffect(
    ()=>{
        setRamen(ramenData)
    },[ramenData]);


    const likeAdd = (likeRamen: ramenObject)=> {

        let addLikeId = likeRamen.product_id;

        let likeCheck = user.likeItemList.find( (likeItem)=> { return likeItem.product_id === addLikeId });

        if(likeCheck){ // find??????????????????true????????????
            return alert('??????????????????????????????????????????????????????'); // return??????????????????
        };

        if(user.user_id){

            const user_id = user.user_id;

            const server2 = `http://localhost:8000/api/likeadd/${user_id}`;

            axios.post(server2, { likeadd: likeRamen })
            .then(res =>{
                
                alert(res.data);
                dispatch(addLike(likeRamen));
            });


        } else {

            let copyLikeItemList = user.likeItemList.slice();

            copyLikeItemList.push(likeRamen);

            window.sessionStorage.setItem( 'likeItemList', JSON.stringify(copyLikeItemList) );

            alert('??????????????????????????????????????????');
            dispatch(addLike(likeRamen));
        };
        
    };

    const [word,setWord] = useState<string>(''); // ?????????????????????????????????

    const inputText = (e: any)=>{
        setWord(e.target.value);
    };

  const clear = ()=> { // ?????????????????? => ???????????????
      setWord('');
  };

  const [findRamenlist, setNewRamen] = useState([]); // default????????????????????????????????????????????????????????????????????????

  // ????????????
  const searchRamen = ()=>{

    let findRamen: any = ramenData.filter(ramen => { // fileter?????????????????????????????????????????????????????????????????????
        console.log(ramen);
        return ramen.name.match(word); //String.prototype.match() => ?????????????????????????????????????????????
        }
    );

      if(findRamen.length === 0){
          alert('???????????????????????????????????????');
      } else {
          setNewRamen(findRamen);
      };
  };

  // ?????????????????????????????????
  const[ randomname, setRandom ] = useState('');
  const[ randompic,setRandom2 ]=useState('');

  const randomRamen=()=>{
      let random = ramenlist[Math.floor(Math.random() * ramenlist.length )];
      setRandom(`?????????????????????  ${random.name}`);
      setRandom2(random.pic);
  };

  // ??????????????????(??????)????????????????????????
  const High = () => {
      const high = ramenlist.sort((a, b) => { // ?????????????????????
          return b.Msizeprice - a.Msizeprice
      })
      const high2 = findRamenlist.sort((a, b) => {
          return b.Msizeprice - a.Msizeprice
      })
      // console.log(high)
      // console.log(high2)
      // console.log([...ramenlist,high])
      
      //if('id' in ramenlist){
      setRamen([...ramenlist,high])
      
      setNewRamen(high2)
      
      //}
  }

  // // ??????????????????(??????)????????????????????????
  const Low = () => {
      const low = ramenlist.sort((a, b) => {
          return a.Msizeprice - b.Msizeprice
      })
      const low2 = findRamenlist.sort((a, b) => {
          return a.Msizeprice - b.Msizeprice
      })
      // console.log(low)
      // console.log(low2)
      
      
      setRamen([...ramenlist,low])
      setNewRamen(low2)
  };

  // ??????????????????????????????????????????(ChangeRamen)
  const ChangeRamen = ()=> { // ???????????????????????????????????????????????????????????????
    if(findRamenlist.length === 0){
        return ( // if??????return
            ramenlist.map( 
                (ramen,index)=>{
                    return (
                        <div key={ramen.product_id} className={classes.card} >
                            <div className={classes['card-title']} >{ramen.name}</div>
                            <div><img src={ramen.pic} className={classes['card-picutre']} alt='' /></div>
                            <div className={classes['card-content']}>
                                <div>M????????????{ramen.Msizeprice}???</div>
                                <div>L????????????{ramen.Lsizeprice}???</div>
                                <div>
                                    <button onClick={ ()=>{ router.push(`/products/${ramen.product_id}`) } } className={classes.button} >???????????????</button>
                                    <button onClick={ ()=>{ likeAdd(ramen) } } className={classes.likebutton} >?????????????????????</button>
                                </div>
                            </div>
                        </div>
                    );
                }
            )
        );
    } else {
        return ( // else???return
            findRamenlist.map(
                (ramen,index)=> {
                    return (
                        <div key={ramen.product_id} className={classes.card}>
                            <div className={classes['card-title']}>{ramen.name}</div>
                            <div><img src={ramen.pic} className={classes['card-picutre']} alt='' /></div>
                            <div className={classes['card-content']}>
                                <div>M????????????{ramen.Msizeprice}???</div>
                                <div>L????????????{ramen.Lsizeprice}???</div>
                                <div>
                                    <button onClick={ ()=>{ router.push(`/products/${ramen.product_id}`)} } className={classes.button} >???????????????</button>
                                    <button onClick={ ()=>{ likeAdd(ramen) } } className={classes.likebutton} >?????????????????????</button>
                                </div>
                            </div>
                        </div>
                    )
                }
            )
        );
    };
  };



  

  return (
    <React.Fragment>

            <div className={classes.search}>
                <h1>??????????????????</h1>

                <div className={classes.lucky}>
                <button???className={classes.randombutton}??? onClick={ ()=>{randomRamen()}}???>???????????????????????????</button>
                <h2>{randomname}</h2>
                <h2><img src={randompic} alt='' className="pic"???/></h2>
                </div>


                <input type='text' placeholder='??????????????????' value={word} onChange={ (event)=>{ inputText(event) } } className={classes.text} />
                <button onClick={ ()=> { searchRamen() } } className={classes.button} >??????</button>
                <button onClick={ ()=> { clear() } } className={classes.clearButton} >?????????</button>
                <h2>????????????</h2>
                <button className={classes.button} onClick={() => { High() }} >?????????</button>  <button className={classes.button} onClick={() => { Low() }}>?????????</button>
                <div className={classes['card-list']} >{ ChangeRamen() }</div>
            </div>
        </React.Fragment>
  );
};

export default Home;