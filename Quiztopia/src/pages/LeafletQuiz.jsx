import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import leaflet from "leaflet";
import "leaflet/dist/leaflet.css";
import LeafletMap from '../components/LeafletMap/LeafletMap';

function LeafletQuiz() {
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [position, setPosition] = useState(null);
  const [map, setMap] = useState(null);
  const { userId, quizId } = useParams();

  const baseUrl = "https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com";

  // Fetch quiz data
  useEffect(() => {
    const getQuiz = async () => {
      try {
        const response = await fetch(`${baseUrl}/quiz/${userId}/${quizId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch quiz data.");
        }

        const data = await response.json();
        setQuiz(data.quiz);
        setLoading(false);
      } catch (error) {
        setErrorMessage("Something went wrong, please try again later.");
        setLoading(false); 
      }
    };

    getQuiz();
  }, [userId, quizId]); 
   

  // Get user position
  useEffect(() => {
    if (!position) {
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setPosition({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
            });
          },
        );
      }  else {
          setErrorMessage("Failed to retrieve position.");
      }
    }  
  }, [position]);

  useEffect(() => {
    if (position && !map && document.getElementById("map")) {
      const myMap = leaflet.map("map").setView([position.latitude, position.longitude], 15);

      leaflet
        .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 20,
          attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        })
        .addTo(myMap);

      setMap(myMap); 
    }
  }, [position, map]);

  // Add markers for quiz questions
  useEffect(() => {
    if (map && quiz?.questions) {
      quiz.questions.forEach((question) => {
        const { latitude, longitude } = question.location;

        const lat = parseFloat(latitude);
        const lng = parseFloat(longitude);

        if (!isNaN(lat) && !isNaN(lng)) {
          const marker = leaflet.marker([lat, lng]).addTo(map);
          marker.bindPopup(
            `<b>${question.question ? question.question : "No question available."}</b>`
          );
        }
      });
    }
  }, [map, quiz]);

  if (errorMessage) {
    return <p className="error-message">{errorMessage}</p>;
  }

  function handleNavigate() {
    navigate(`/quiz`);
}

  return (
    <div>
      <h1>Quiz</h1>
     <LeafletMap />
     <button className="goback-button" onClick={() => navigate("/quiz")}>
        Go back
      </button>
    </div>
  );
}

export default LeafletQuiz;
