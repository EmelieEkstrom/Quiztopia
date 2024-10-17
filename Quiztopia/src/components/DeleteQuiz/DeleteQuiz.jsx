import { useEffect } from 'react';

 // Tar bort ett specifikt quiz från en specifik användare
function DeleteQuiz() {   
     useEffect(() => {
        async function deleteQuiz() {
            const response = await fetch('https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz/{quizId}');
            const data = await response.json();
            console.log(data);
            setQuizzes(data.quizId);
    }

        deleteQuiz();
}, []);

return (
    <article>
        <button>{DeleteQuiz}</button>
    </article>
)};

export default DeleteQuiz;