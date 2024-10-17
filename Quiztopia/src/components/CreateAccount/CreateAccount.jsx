import { useState } from "react";
import SecretTunnel from "../SecretTunnel/SecretTunnel";
import { useNavigate } from "react-router-dom"; 

export default function CreateAccount() {
    // Deklarera alla tillstånd inklusive showSecret
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [showSecret, setShowSecret] = useState(false); // Lägg till detta

    const navigate = useNavigate(); 

    const handleSubmit = async (event) => {
        event.preventDefault(); // Förhindra att formuläret laddar om sidan

        // Skapa användarobjektet
        const userData = { username , password, firstname, lastname };
        try {
            const response = await fetch(`https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/signup`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Något gick galet');
            }

            const data = await response.json(); // Remove passing userData here; it's unnecessary.

            console.log(data.success);

            if (data.success) {
                navigate("/"); // Redirect if the signup is successful
            } else {
                console.log('Konto skapandet misslyckades'); // Handle signup failure
            }
        } catch (error) {
            console.log('Fel vid skapandet av konto:', error);
        }
    };

    const toggleSecret = () => {
        setShowSecret(prevShowSecret => !prevShowSecret);
    };

    return (
        <article>   
            <form onSubmit={handleSubmit}>
                <label>
                    Användarnamn:
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required // Mark fields as required
                    />
                </label>
                <label>
                    Lösenord:
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required // Mark fields as required
                    />
                </label>
                <label>
                    Förnamn:
                    <input
                        type="text"
                        value={firstname}
                        onChange={(e) => setFirstname(e.target.value)}
                        required // Mark fields as required
                    />
                </label>
                <label>
                    Efternamn:
                    <input
                        type="text"
                        value={lastname}
                        onChange={(e) => setLastname(e.target.value)}
                        required // Mark fields as required
                />
                </label>
                <button type="submit">Skapa konto</button>
            </form>
            <button onClick={toggleSecret}>
                {showSecret ? 'Dölj SecretTunnel' : 'Visa SecretTunnel'}
            </button>
            {showSecret && <SecretTunnel />}
        </article> 
    );
}

