import { useNavigate } from 'react-router-dom';
import '../styles/LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="content">
        <h1 className="title">Revalor</h1>
        <p className="tagline">Trace. Tokenize. Transform Waste into Wealth</p>
        
        <div className="boxes-container">
          <div 
            className="box admin-box"
            onClick={() => navigate('/admin-login')}
          >
            <h2>Admin</h2>
            <p>Access admin dashboard</p>
          </div>
          
          <div 
            className="box user-box"
            onClick={() => navigate('/user-selection')}
          >
            <h2>Users</h2>
            <p>Login or Sign up as a user</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;