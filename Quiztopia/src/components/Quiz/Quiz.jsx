import DeleteQuiz from '../DeleteQuiz/DeleteQuiz';
import AddQuestion from '../AddQuestion/AddQuestion'; 
import './Quiz.css';

function Quiz(props) {
    const { quiz } = props; 

    return (
        <article>
            <h2>{quiz.question}</h2>
            <p>{quiz.answer}</p>
            <p>Longitude: {quiz.location.longitude}</p>
            <p>Latitude: {quiz.location.latitude}</p>
            
            {/* Render the DeleteQuiz component and pass quizId as a prop if needed */}
            <DeleteQuiz quizId={quiz.quizId} />  

            {/* Add a new question */}
            <AddQuestion />
        </article>
    );
}

export default Quiz;
