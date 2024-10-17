import { useEffect, useState } from "react";
import CreateAccount from '../CreateAccount/CreateAccount'; 

export default function SecretTunnel() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState(''); 
    const [firstname, setFirstname] = useState(''); 
    const [lastname, setLastname] = useState(''); 

    // Vi hämtar token från sessionStorage
    useEffect(() => {
        const checkToken = async () => {
            let token = sessionStorage.getItem('token');
            console.log('Token:', token);

            // Kolla om token inte är tom
            if (token && token.trim() !== '') {
                try {
                    const response = await fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/auth/signup', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    const data = await response.json();
                    console.log('API Response:', data);

                    if (data.success) {
                        setLoggedIn(true);
                        setUsername(data.account.username);
                        setPassword(data.account.password);
                        setFirstname(data.account.firstname);
                        setLastname(data.account.lastname);
                    } else {
                        console.error('Login failed:', data.message);
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            }
        };

        checkToken();
    }, []); // Tom array betyder att effekten bara körs en gång vid render

    return (
        <>
    <CreateAccount />
            {loggedIn ? (
                <article>Hej {username} </article>
            ) : (
                <p>Du är inte inloggad</p>
            )}
        </>
    );
}


