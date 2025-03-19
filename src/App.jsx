import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Recipes from './pages/Recipes';
import Profile from './pages/Profile';

const App = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />
      <Route path="recipes" element={<Recipes />} />
      <Route path="profile" element={<Profile />} />
    </Route>
  </Routes>
);

export default App;
