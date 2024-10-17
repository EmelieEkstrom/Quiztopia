import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SecretTunnel from '../components/SecretTunnel/SecretTunnel';
import '../components/LoginForm/LoginForm.css'; 

export default function LoginForm() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showSecret, setShowSecret] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate(); 

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        const userData = { username, password };
        const API_URL = "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/login";
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
            
            if (!response.ok) {
                throw new Error('Något gick snett med POST-förfrågan.');
            }
            
            const data = await response.json();
            sessionStorage.setItem('token', data.token);
            console.log("Inloggad!", data);
            navigate('/quiz');
        } catch (error) {
            console.error(error);
            setError('Fel vid inloggning. Kontrollera dina uppgifter.');
        }
    }

    return (
        <div className="login-page">
            <article className="login-container">
                <h2>Välkommen! Logga in nedan:</h2>
                <form onSubmit={handleSubmit} className="login-form">
                    <label>
                        Användarnamn:
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        Lösenord:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </label>
                    <button id="login-button" onClick={() => handleNavigate(quiz)}>Logga in</button>
                    {error && <p className="error-message">{error}</p>}
                </form>

                <button onClick={() => setShowSecret(!showSecret)} className="secret-button">
                    {showSecret ? 'Dölj info' : 'Visa info'}
                </button>
                {showSecret && <SecretTunnel />}
            </article>
        </div>
    );
}
