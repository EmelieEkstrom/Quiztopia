import { RouterProvider } from 'react-router-dom';
import router from './router/router';

function App() {
  const title = 'Quiztopia';

  return (
    <main>
          <h1>{title}</h1>
    
          <RouterProvider router={router} />
       
    </main>
  );
}

export default App;
