import { useNavigate } from 'react-router-dom';
import '../styles/UserSelection.css';

function UserSelection() {
  const navigate = useNavigate();

  return (
    <div className="user-selection-container">
      <h1>Select User Type</h1>
      
      <div className="user-boxes">
        <div className="user-box seller" onClick={() => navigate('/seller/auth')}>
          <h2>Seller</h2>
          <p>Sign up or login as a seller</p>
        </div>
        
        <div className="user-box buyer" onClick={() => navigate('/buyer/auth')}>
          <h2>Buyer</h2>
          <p>Sign up or login as a buyer</p>
        </div>
      </div>
    </div>
  );
}

export default UserSelection;