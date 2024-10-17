import { useEffect, useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 

//Skapar nytt quiz
function CreateQuiz() {
    const navigate = useNavigate(); 
    const [quizName, setQuizName] = useState(""); 
    const [ token, setToken] = useState(""); 
    
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
    
      async function saveQuiz() {
        console.log("token", token);

        if (token) {
            console.log("click");
        try {
            const response = await fetch("https://fk7zu3f4gj.execute-api.eu-north-1.amazonaws.com/quiz",
            {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
            body: JSON.stringify({ name: quizName }),
            }
        );
        const data = await response.json(); 
        console.log(data); 
        navigate(`/add-question/${quizName}`);
        } catch (error) {
            console.error(error); 
        }
    }
};


return (
    <article>
        <input
            type="text"
            value={quizName} 
            onChange={(e) => setQuizName(e.target.value)}
            placeholder="Create a quiz..."
            id="create-quiz-input"
        />
        <button onClick={saveQuiz}>Create Quiz</button>  
    </article>
);
}

export default CreateQuiz;