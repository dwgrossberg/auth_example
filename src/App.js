import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {
  const [auth, setAuth] = useState(false);
  const [IP, setIP] = useState("")

  // fetch client IP address using third party api
  const fetchIP = async () => {
    const response = await fetch('https://api.ipify.org/?format=json');
    if (response.status === 200) {
      const responseData = await response.json();
      console.log(responseData.ip);
      setIP(responseData.ip);
    } else {
      const errMessage = await response.json();
      console.log(
        `Unable to post information: ${response.status}. ${errMessage.Error}`
      );
    }
 } 
 
 // post data to microservice to check for authentication
  const checkIfHuman = async () => {
    const response = await fetch(`https://auth-microservice-f2768dc2c490.herokuapp.com/authenticate`, {
      method: "POST",
      body: JSON.stringify({"IP": IP}),
      headers: { "Content-Type": "application/json" }
    });
    if (response.status === 200) {
      console.log(`Information posted.`);
      const responseData = await response.json()
      console.log(responseData);
      if (responseData.message === "Not authenticated") {
        setAuth(false);
      } else if (responseData.message === "Human authenticated") {
        setAuth(true);
      }
    } else {
      const errMessage = await response.json();
      console.log(
        `Unable to post information: ${response.status}. ${errMessage.Error}`
      );
    }
  }

  // authenticate user via 'Are You Human' button click
  const handleAuthentication = async () => {
    const response = await fetch(`https://auth-microservice-f2768dc2c490.herokuapp.com/whitelist`, {
      method: "POST",
      body: JSON.stringify({"IP": IP, "is_human": true}),
      headers: { "Content-Type": "application/json" }
    });
    if (response.status === 200) {
      console.log(`Information posted.`);
      const responseData = await response.json()
      console.log(responseData);
      if (responseData.message === "Not authenticated") {
        setAuth(false);
      } else if (responseData.message === "Human authenticated") {
        setAuth(true);
      }
    } else {
      const errMessage = await response.json();
      console.log(
        `Unable to post information: ${response.status}. ${errMessage.Error}`
      );
    }
  }

  // Check for authentication via IP on page load
  useEffect(() => {
    fetchIP();
  }, []);

  // Call to microservice after IP established
  useEffect(() => {
    checkIfHuman();
  }, [IP]);
  
  return (
    <div className="App">
      {!auth && <p>User has not been authenticated</p>}
      {!auth && <div><button onClick={handleAuthentication}>Authenticate Now: Are You Human?</button></div>}
      {auth && "User has been authenticated."}
    </div>
  );
}

export default App;
