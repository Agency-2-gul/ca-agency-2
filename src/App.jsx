import { Routes, Route } from 'react-router-dom';
import Layout from './Layout';
import Home from './pages/Home';
import Recipes from './pages/Recipes';

const App = () => (
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Home />} />

      <Route path="recipes" element={<Recipes />} />
    </Route>
  </Routes>
);

export default App;
