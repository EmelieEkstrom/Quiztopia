import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();


    try {
      const response = fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = response.json();

      if (data.success) {
        localStorage.setItem('token', data.token); 
        console.log(`User: ${username}, Token: ${data.token}`); 
        navigate('/quiz'); 
      } else {
        console.error('Login was not successful');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
}

  return (

          <div className="Login">
           <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="form-input"
              required
            />
          
            <label className="form-label">Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
              required
            />
          
            <button
              type="submit"
              className="login-button"
            >
              Login
            </button>
            </form>
          </div>
    

  );


export default LoginForm;