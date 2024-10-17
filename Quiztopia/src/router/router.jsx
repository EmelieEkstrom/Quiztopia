import { createBrowserRouter } from 'react-router-dom';
import Login from '../pages/Login'; 
import DisplayQuiz from '../pages/DisplayQuiz';
import LeafletQuiz from '../pages/LeafletQuiz';
import AddQuestion from '../components/AddQuestion/AddQuestion';
import CreateQuiz from '../pages/CreateQuiz';

const router = createBrowserRouter([
    {
        path: '/',
        element: <Login />,
    },
    {
        path: '/quiz',  
        element: <DisplayQuiz />,   
    },
    {
        path: '/quiz/:userId/:quizId',
        element: <LeafletQuiz />
    },
    {
        path: '/create-quiz',
        element: <CreateQuiz />
    },
    {
        path: '/add-question/:quizName',
        element: <AddQuestion />
    },

]);

export default router;
