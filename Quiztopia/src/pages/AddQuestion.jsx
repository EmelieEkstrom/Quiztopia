import { useState, useEffect } from 'react';  
import LeafletMap from '../LeafletMap/LeafletMap';
import { useParams, useNavigate } from "react-router-dom";
import leaflet from 'leaflet';
import './AddQuestion.css'; 

//Lägger till en fråga på ett skapat quiz
export default function AddQuestion() {
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState(''); 
    const [latitude, setLatitude] = useState(null); 
    const [longitude, setLongitude] = useState(null); 
    const [map, setMap] = useState(null); 
    const [loadingMap, setLoadingMap] = useState(true); 
    const [token, setToken] = useState(""); 
    const [errorMessage, setErrorMessage] = useState(""); 
    const [hasError, setHasError] = useState(false); 
    const navigate = useNavigate();
    const { quizName } = useParams();

    // Get user position for map initialization
    function getPosition() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const long = position.coords.longitude;
                setLatitude(lat);
                setLongitude(long);
            });
        }
    }

    // Trigger geolocation on mount
    useEffect(() => {
        getPosition();
    }, []);

    // Initialize map when latitude and longitude are available
    useEffect(() => {
        if (latitude && longitude && !map) {
            const initMap = leaflet
                .map('map')
                .setView([latitude, longitude], 15);

            setMap(initMap);
            setLoadingMap(false);

            leaflet
                .tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    maxZoom: 19,
                    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                })
                .addTo(initMap);

            initMap.on("click", (event) => {
                const { lat, lng } = event.latlng;
                setLatitude(lat);
                setLongitude(lng); 
                leaflet.marker([lat, lng]).addTo(initMap);
            });
        }
    }, [latitude, longitude, map]);

    // Fetch token from session storage
    useEffect(() => {
        const checkToken = async () => {
        const storedToken = sessionStorage.getItem("token") || "";
        if (storedToken.length > 0) {
            setToken(storedToken);
        }
    };
    checkToken();
    }, []);

    // Function to post the question when the button is clicked
    async function postQuestion() {
        const questionData = {
            title: question,
            answer: answer,
            longitude: longitude,
            latitude: latitude
        };

        if (!question || !answer) {
            setErrorMessage("All fields are required!");
            setHasError(true);
            return;
        }

        if (token) {
            try {
                const response = await fetch(`https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/question`, {
                    method: 'POST', 
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify(questionData)
                });

                if (!response.ok) {
                    throw new Error("Failed to post the question");
                }

                const data = await response.json();
                console.log(data);
                sessionStorage.setItem("token", data.token);
                
                // Save quiz locally to sessionStorage
                saveQuiz();
                navigate(`/quiz/${quizName}`);

            } catch (error) {
                console.error('Error posting question:', error);
                setErrorMessage("Failed to post question.");
                setHasError(true);
            }
        }
    }

    // Save the quiz data locally
    const saveQuiz = () => {
        const quizData = {
            question: question,
            answer: answer,
        };

        const savedQuizzes = JSON.parse(sessionStorage.getItem("quizzes") || "[]");
        savedQuizzes.push(quizData);
        sessionStorage.setItem("quizzes", JSON.stringify(savedQuizzes));
    };

    return (
        <main>
            <button onClick={() => navigate("/quiz")}>All Quizzes</button>
            <button onClick={() => navigate("/")}>Go back</button>
            <section>
                <input 
                    type="text" 
                    placeholder="Question"
                    onChange={(event) => setQuestion(event.target.value)} 
                />
                <input 
                    type="text" 
                    placeholder="Answer"
                    onChange={(event) => setAnswer(event.target.value)} 
                />
                <button onClick={postQuestion}>Spara</button>     
                {hasError && <p className="error">{errorMessage}</p>}
            </section>
            {loadingMap ? <p>Loading map...</p> : <LeafletMap />}
        </main>
    );
}
