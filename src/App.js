import React, { useEffect, useState } from 'react';
import './App.css';
import Navigation from './navigation/Navigation';
import { createNewToken } from './lib/TokenTools';
import { dodoFlight, timeouts } from './lib/dodoAirlines';
import { ds } from './stored/ds';



export const auth = async (onAuth = () => { }) => {

  ds.token = await createNewToken(1);
  const res = await dodoFlight({ timeout: timeouts.medium });

  if (res.data) {
    onAuth();
  }
}

function App() {

  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    auth(() => {
      setIsAuth(true)
    });
  }, []);

  return (
    <div className="app">
      {(isAuth) ? <Navigation /> : <span>Please wait</span>}
    </div>

  );
}

export default App;
