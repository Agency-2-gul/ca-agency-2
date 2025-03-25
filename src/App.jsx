import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import Profile from './pages/Profile';
import ProductPage from './components/product/ProductPage';

const App = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="recipes" element={<Recipes />} />
      <Route path="profile" element={<Profile />} />
      <Route path="product/:id" element={<ProductPage />} />
    </Route>
  </Routes>
);

export default App;
