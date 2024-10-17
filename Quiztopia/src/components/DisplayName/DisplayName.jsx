import { useContext } from 'react';
import { UserContext } from '../../App';

function DisplayName() {
  const name = useContext(UserContext);

  return (
    <section>
      <h2>Användarnamn: {name}</h2>
    </section>
  );
}

export default DisplayName;