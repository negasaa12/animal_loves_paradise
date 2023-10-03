import {  createContext, useContext, useState } from "react";



const UserContext = createContext();

function UserProvider({ children }) {
  const [userData, setUserData] = useState([]);

  return (
    <UserContext.Provider value={{ userData, setUserData }}>
      {children}
    </UserContext.Provider>
  );
}

 function useUser() {
  return useContext(UserContext);
};

export {UserProvider as default, useUser};