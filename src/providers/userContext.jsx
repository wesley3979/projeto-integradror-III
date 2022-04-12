import React, { createContext, useState, useContext } from 'react'

export const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const [name, setName] = useState('');
  const [userId, setUserId] = useState(null);
  const [email, setEmail] = useState('');
  const [image, setImage] = useState('');
  const [token, setToken] = useState('');

  const getUserData = () => {
   return {
     userId,
     name,
     email,
     image,
   }
  }

  return(
    <UserContext.Provider value={{ 
      name, 
      userId, 
      email, 
      image,
      token,
      setName,
      setUserId,
      setEmail,
      setImage, 
      getUserData,
      setToken
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser(){
  return useContext(UserContext);
}