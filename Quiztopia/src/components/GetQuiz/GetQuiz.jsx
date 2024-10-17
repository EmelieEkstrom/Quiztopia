import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // För att fånga upp parametrar från URL

// Hämtar ett specifikt quiz från en specifik användare
function GetQuiz() {
    const [quiz, setQuiz] = useState(null); // null istället för tom sträng
    const [answer, setAnswer] = useState(''); 
    const [userId, setUserId] = useState(''); 
    const [quizId, setQuizId] = useState('');
    const [quizLongitude, setQuizLongitude] = useState('');
    const [quizLatitude, setQuizLatitude] = useState('');

    const params = useParams(); 
    const userId = params.userId; 
    const quizId = params.quizId; 
  
    useEffect(() => {
        async function getQuizQuestion() {
            try {
                const response = await fetch(`https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/${userId}/${quizId}`);
                const data = await response.json();
                console.log(data);
                setQuiz(data); // Sätter quiz-data
            } catch (error) {
                console.error('Error fetching quiz data:', error);
            }
        }

        if (userId && quizId) {
            getQuizQuestion();
        }
    }, [userId, quizId]); // Kör bara useEffect när userId och quizId är tillgängliga

    if (!quiz) { // Visa laddningsmeddelande om quiz-data inte har hämtats än
        return <p>Laddar quiz...</p>;
    }

    return (
        <article>
            <h2>{quiz.question}</h2>
            <p>{quiz.answer}</p>
            <p>{quiz.location?.longitude}</p>
            <p>{quiz.location?.latitude}</p>
            <p>{quiz.quizId}</p>
        </article>
    
    );
}

export default GetQuiz;
