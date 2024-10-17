import { useState, useEffect } from 'react';
import { useNavigate, useParams } from"react-router-dom";
import "leaflet/dist/leaflet.css"; 
import AddQuestion from '../components/AddQuestion/AddQuestion';
import './Quiz.css';

function Quiz() {
    const navigate = useNavigate();
    const { userId, quizId } = useParams(); 
    const [quizzes, setQuizzes] = useState([]);
    const [amount, setAmount] = useState(0);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function getQuizzes() {
            try {
                const response = await fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz');
                const data = await response.json();
                console.log(data);
                setQuizzes(data.quizzes);
                setAmount(data.quizzes.length);
            } catch (error) {
                setError('Failed to load quizzes');
            }
        }
        getQuizzes();
        console.log(error); 
    }, [userId, quizId]);

    // Filter quizzes based on params
    useEffect(() => {
        function filteredQuizzes() {
            const filteredQuizzes = quizzes.filter((quiz) => quiz.title === quiz.name);
            console.log(filteredQuizzes);
            return filteredQuizzes;
        }

        const result = filteredQuizzes();
        console.log(result);

    }, [quizzes]); 

    if (error) {
        return <div>{error}</div>;
    }

    function handleNavigate(quiz) {
        navigate(`/quiz/${quiz.userId}/${quiz.quizId}`);
    }

    return (
        <article>
          <button className="goback-button" onClick={() => navigate("/create-quiz")}>Skapa quiz</button>
  <h2 className="all-quizzes">All Quizzes</h2>
  <div className="quiz-container">
    {quizzes.length > 0 ? (
      quizzes.map((quiz, index) => (
        <div className="quiz-card" key={`${quiz.quizId}-${index}`}>
          <p>Created by: {quiz.username}</p>
          <p>Quiz name: {quiz.quizId}</p>
          <button id="show-btn" onClick={() => handleNavigate(quiz)}>Show</button>
        </div>
      ))
    ) : (
      <p>No quizzes available.</p>
    )}
  </div>
</article>

        
    );
}

export default Quiz;
