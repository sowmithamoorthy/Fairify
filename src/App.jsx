import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import AdminLogin from './components/AdminLogin';
import UserSelection from './components/UserSelection';
import AdminDashboard from './components/AdminDashboard';
import SellerAuth from './components/SellerAuth';
import BuyerAuth from './components/BuyerAuth';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/user-selection" element={<UserSelection />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/seller/auth" element={<SellerAuth />} />
        <Route path="/buyer/auth" element={<BuyerAuth />} />
      </Routes>
    </Router>
  );
}

export default App;