import { useState } from 'react';
import '../styles/Auth.css';
import axios from 'axios';

function SellerAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    documents: []
  });

  // Add this missing function
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData({
      ...formData,
      documents: files
    });
    console.log('Selected files:', files); // Debug log
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      console.log('Base URL:', baseUrl);
      if (!baseUrl) {
        throw new Error("API base URL is not defined. Please check your .env file.");
      }

      if (!isLogin) {
        // Validate documents if in signup mode
        if (formData.documents.length === 0) {
          throw new Error("Please upload at least one document");
        }

        const formDataToSend = new FormData();
        formDataToSend.append('name', formData.name);
        formDataToSend.append('email', formData.email);
        formDataToSend.append('password', formData.password);
        
        formData.documents.forEach((doc) => {
          formDataToSend.append('documents', doc);
        });

        console.log('FormData contents:'); // Debug log
        for (let [key, value] of formDataToSend.entries()) {
          console.log(key, value);
        }

        const response = await axios.post(
          `${baseUrl}/api/seller/signup`,
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );

        alert('Signup request sent! Please wait for admin approval via email.');
        console.log('Response:', response.data);
      } else {
        // Login logic remains the same
        const response = await axios.post(
          `${baseUrl}/api/seller/login`,
          {
            email: formData.email,
            password: formData.password,
          }
        );

        alert('Login successful!');
        console.log('Response:', response.data);
      }
    } catch (err) {
      console.error('Error:', {
        message: err.message,
        response: err.response?.data
      });
      alert(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>{isLogin ? 'Seller Login' : 'Seller Sign Up'}</h2>
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <input
                type="text"
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
          )}

          <div className="input-group">
            <input
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          {!isLogin && (
            <div className="input-group">
              <label className="file-input-label">
                Upload Documents
                <input
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="file-input"
                  required
                />
              </label>
            </div>
          )}

          <button type="submit">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-switch">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            className="switch-btn"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}

export default SellerAuth;