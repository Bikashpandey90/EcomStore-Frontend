// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.tsx'

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import './assets/main.css';
import Routing from "./config/router.config";
import { Provider } from "react-redux";
import store from "./config/store.config";
import { CartProvider } from "./context/cart-context";


// createRoot(document.getElementById('root')!).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

// let rootElement=document.getElementById('root')!;
// let reactDom=createRoot(rootElement)

// reactDom.render("Hello world")


//component


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    
    <Provider store={store}>
      
      <CartProvider>
        <Routing />
      </CartProvider>
    </Provider>
  </StrictMode>
)
