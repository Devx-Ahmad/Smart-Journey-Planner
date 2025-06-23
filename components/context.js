import React, {createContext, useContext, useState, useEffect} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserContext = createContext();

//Pass Child for wrapping content in index
export const UserProvider = ({children}) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userDataString = await AsyncStorage.getItem('userDetails');
        if (userDataString) {
          //converting to object for prop passing
          const userData = JSON.parse(userDataString);
          setUser(userData); // Set user data in context
        }
      } catch (error) {
        console.error('Failed to load user data from storage:', error);
      }
    };

    loadUserData();
  }, []);

  return (
    // Allows Provider to Wrap Components in Index
    <UserContext.Provider value={{user, setUser}}>
      {children}
    </UserContext.Provider>
  );
};

//Custo,m Hook for easy context usage
export const useUser = () => useContext(UserContext);
