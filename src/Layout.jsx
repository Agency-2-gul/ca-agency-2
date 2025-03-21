import { Outlet } from 'react-router-dom';
import Header from './components/Header';
import FirebaseAuth from './auth/FirebaseAuth';
import Footer from './components/footer/Footer';

const Layout = () => (
  <div className="flex flex-col min-h-screen">
    <FirebaseAuth />
    <FirebaseAuth />
    <Header />
    <main className="flex-grow pt-2">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default Layout;
