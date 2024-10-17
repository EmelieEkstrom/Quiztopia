import { useState, useEffect } from 'react';  
import { useNavigate, useParams } from "react-router-dom";
import leaflet from 'leaflet';
import './AddQuestion.css'; 

// Lägger till en fråga på ett skapat quiz
export default function AddQuestion() {
    const navigate = useNavigate();
    const [question, setQuestion] = useState('');
    const [answer, setAnswer] = useState(''); 
    const [username, setUsername] = useState(''); 
    const { quizName } = useParams(); 
    const [map, setMap] = useState(null);
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [token, setToken] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [hasError, setHasError] = useState(false);
    console.log("Quiz Name:", quizName);

    // Get user position for map initialization
    function getPosition() {
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition((position) => {
                const lat = position.coords.latitude;
                const long = position.coords.longitude;
                setLatitude(lat);
                setLongitude(long);
            }, (error) => {
              setErrorMessage('Failed to retrieve location: ' + error.message);
              setHasError(true); 
            });
        } else {
          setErrorMessage('Geolocation is not supported by this browser.'); 
          setHasError(true); 
        }
    }

    // Trigger geolocation on mount
    useEffect(() => {
        getPosition();
    }, []);

    // Initialize map when latitude and longitude are available
    useEffect(() => {
        if (latitude !== null && longitude !== null && !map) {
            const initMap = leaflet
                .map('map')
                .setView([latitude, longitude], 15);

            setMap(initMap);

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
            console.log("token", storedToken);
            if (storedToken.length > 0) {
                setToken(storedToken);
            }
        };
        checkToken();
    }, []);

    // Function to post the question when the button is clicked
    async function postQuestion() {
      setHasError(false);  // Reset error state before trying to post
      setErrorMessage(" ");  // Clear previous error messages 

        const questionData = {
            username: username, 
            title: question,
            answer: answer,
            location: {
                longitude: longitude?.toString(),
                latitude: latitude?.toString(),
            }
        };

        try {
            const response = await fetch(`https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/question`, {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(questionData) // Send question data as JSON
            });

            if (!response.ok) {
                throw new Error("Failed to post the question");
            }

            const data = await response.json();
            console.log(data);
            sessionStorage.setItem("token", data.token);
          
            // Save quiz locally to sessionStorage
            saveQuiz();
            navigate("/quiz");
            
        } catch (error) {
            console.error("Error:", error);
            setErrorMessage(`Failed to post question: ${error.message}`);
            setHasError(true);
        }
    }         

    // Save the quiz data locally
    const saveQuiz = () => {
        const quizData = {
            username: username,
            question: question,
            answer: answer,
        };

        const savedQuizzes = JSON.parse(sessionStorage.getItem("quizzes") || "[]");
        savedQuizzes.push(quizData);
        sessionStorage.setItem("quizzes", JSON.stringify(savedQuizzes));
    };

    return (
       <main>
        <section>
            <input 
                type="text" 
                placeholder="Username" 
                onChange={(event) => setUsername(event.target.value)} 
            />
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
        </section>

        {/* Display error message if there's an error */}
        {hasError && (
            <div className="error-message">
                <p>{errorMessage}</p>
            </div>
        )}

          {/* Display error message if there's an error */}
          {hasError && (
            <div className="error-message">
                <p>{errorMessage}</p>
            </div>
        )}

        <div id="map" style={{ height: '400px' }}></div>
    </main>
); 
}