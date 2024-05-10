import React from 'react';
import { Navigate } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthMe, selectIsAuth } from './redux/slices/auth';
import { CssBaseline, Box } from '@mui/material';
import './App.css';

import Header from './components/header';
import RegistrationPage from './components/register';
import LoginPage from './components/login';
import ProductsPage from './components/products';
import ProductProfilePage from './components/product';
import CartPage from './components/cartPage';
import AboutPage from './components/aboutPage';
import OrdersPage from './components/OrdersPage'; 
import CategoriesPage from './components/CategoriesPage';
import Footer from './components/footer';
import PromotionsPage from './components/promotions';
import FavoritesPage from './components/FavoritesPage';
import OrderHistory from './components/OrderHistoryPage';

function App() {
  const dispatch = useDispatch();
  const isAuth = useSelector(selectIsAuth);

  React.useEffect(() => {
    if (window.localStorage.getItem('token')) {
      dispatch(fetchAuthMe());
    }
  }, [dispatch]);

  return (
    <div className="App" style={{ overflowX: 'hidden' }}>
      <CssBaseline />
      <Box display="flex" flexDirection="column" minHeight="100vh">
        <Header />
        <Box component="main" flexGrow={1} sx={{ width: '100%' }}>
          <Routes>
              <Route path='/' element={<ProductsPage></ProductsPage>}></Route>
              <Route path="/products/:id" element={<ProductProfilePage />} />
              <Route path='/cart' element={<CartPage></CartPage>} />
              <Route path='/about' element={<AboutPage></AboutPage>} />
              <Route path='/orders' element={<OrdersPage></OrdersPage>} />
              <Route path='/categories' element={<CategoriesPage></CategoriesPage>} />
              <Route path='/promotions' element={<PromotionsPage></PromotionsPage>} />
              <Route path='/favorites' element={<FavoritesPage></FavoritesPage>} />
              <Route path='/history' element={<OrderHistory></OrderHistory>} />
              {!isAuth && <Route path='/registration' element={<RegistrationPage/>} />}
              {!isAuth && <Route path='/login' element={<LoginPage/>} />}
              {isAuth && <Route path="*" element={<Navigate to="/" />} />}
              {!isAuth && <Route path="*" element={<Navigate to="/login" />} />}
          </Routes>
        </Box>
        <Footer></Footer>
      </Box>
    </div>
  );
}

export default App;