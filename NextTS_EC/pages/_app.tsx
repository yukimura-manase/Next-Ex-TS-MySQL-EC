import '../styles/globals.css';
import React,{ useEffect } from 'react';
import { createStore } from 'redux';
import { Provider, useDispatch } from 'react-redux';
import reducer from '../redux';
import Header from '../components/Header';
import Nav from '../components/Nav';
import axios from 'axios';

const store = createStore(reducer);

function MyApp({ Component, pageProps }) {

  // Material-UIを導入するための設定
  React.useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentElement?.removeChild(jssStyles);
    };
  }, []);

  return (
      <Provider store={store} >

        <Header />
        <Nav />
        <Component {...pageProps} />
      </Provider>
    );
}

export default MyApp;
