import React from 'react'
import ReactDOM from 'react-dom/client'
import './styles/global.css'
import { PriceUpdate } from './pages/PriceUpdate'
import { ToastContainer } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PriceUpdate />
    <ToastContainer />
  </React.StrictMode>,
)
