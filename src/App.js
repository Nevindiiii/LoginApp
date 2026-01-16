import React from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LoginForm from './LoginForm';

function App() {
  return (
    <GoogleOAuthProvider clientId="107480945935-vr86rp4k5ei2rplcddummhqqmk2sjtqs.apps.googleusercontent.com">
      <div className="App">
        <LoginForm />
      </div>
    </GoogleOAuthProvider>
  );
}

export default App;
