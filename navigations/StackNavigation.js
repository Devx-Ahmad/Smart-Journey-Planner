import React, {useState, useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SearchPlaces from '../components/SearchPlace';
import BusTrackingMap from '../components/maps';
import LoginPage from '../components/login';
import LoadingScreen from '../components/loadingScreen';
import RegistrationPage from '../components/Register';
import WelcomePage from '../components/Welcome';
import StartScreen from '../components/Start';
import ProfilePage from '../components/profile';
import ReportScreen from '../components/ReportProblem';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AboutUsScreen from '../components/About';

const Stack = createStackNavigator();

const AppNavigators = () => {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check for user details in AsyncStorage
        const userDetails = await AsyncStorage.getItem('userDetails');
        setIsUserLoggedIn(!!userDetails); // Update login state based on presence of userDetails
        setTimeout(() => {
          setIsLoading(false); // Set loading to false after checking user session
        }, 2000); // Example delay for loading screen
      } catch (error) {
        console.error('Error initializing app: ', error);
        setIsLoading(false); // Ensure loading state is set to false on error
      }
    };

    initializeApp();
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Stack.Navigator>
      {/* {isUserLoggedIn ? (
        <>
          <Stack.Screen
            name="Start"
            component={StartScreen}
            options={{
              headerShown: true,
              title: 'Home',
              headerLeft: null,
            }}
          />
          <Stack.Screen
            name="profile"
            component={ProfilePage}
            options={{
              headerShown: true,
              title: 'Profile',
            }}
          />
          <Stack.Screen
            name="Welcome"
            component={WelcomePage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Register"
            component={RegistrationPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="login"
            component={LoginPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="ReportProblem"
            component={ReportScreen}
            options={{
              headerShown: true,
              title: 'Report Problem',
            }}
          />
          <Stack.Screen
            name="maps"
            component={BusTrackingMap}
            options={{
              headerShown: true,
              title: 'Maps',
            }}
          />
          <Stack.Screen
            name="SearchPlaces"
            component={SearchPlaces}
            options={{
              headerShown: true,
              title: 'Search Map',
            }}
          />
          <Stack.Screen
            name="About"
            component={AboutUsScreen}
            options={{
              headerShown: true,
              title: 'About Us',
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Welcome"
            component={WelcomePage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Register"
            component={RegistrationPage}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="login"
            component={LoginPage}
            options={{headerShown: false}}
          /> 
          <Stack.Screen
            name="Start"
            component={StartScreen}
            options={{
              headerShown: true,
              title: 'Home',
              headerLeft: null, // Disables the back button
            }}
          />
          <Stack.Screen
            name="profile"
            component={ProfilePage}
            options={{
              headerShown: true,
              title: 'Profile',
            }}
          />

          <Stack.Screen
            name="ReportProblem"
            component={ReportScreen}
            options={{
              headerShown: true,
              title: 'Report Problem',
            }}
          />*/}
      <Stack.Screen
        name="maps"
        component={BusTrackingMap}
        options={{
          headerShown: true,
          title: 'Maps',
        }}
      />
      <Stack.Screen
        name="SearchPlaces"
        component={SearchPlaces}
        options={{
          headerShown: true,
          title: 'Search Map',
        }}
      />
      {/* <Stack.Screen
            name="About"
            component={AboutUsScreen}
            options={{
              headerShown: true,
              title: 'About Us',
            }}
          />
        </> */}
      {/* )} */}
    </Stack.Navigator>
  );
};

export default AppNavigators;

// import React, {useState, useEffect} from 'react';
// import {createStackNavigator} from '@react-navigation/stack';
// import SearchPlaces from '../components/SearchPlace';
// import BusTrackingMap from '../components/maps';
// import LoginPage from '../components/login';
// import LoadingScreen from '../components/loadingScreen';
// import RegistrationPage from '../components/Register';
// import WelcomePage from '../components/Welcome';
// import StartScreen from '../components/Start';
// import ProfilePage from '../components/profile';
// import ReportScreen from '../components/ReportProblem';

// import AboutUsScreen from '../components/About';
// const Stack = createStackNavigator();

// const AppNavigators = () => {
//   const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Set the loading screen to display for 5 seconds
//     const timer = setTimeout(() => {
//       setIsLoading(false);
//     }, 1000); // 7000 milliseconds = 7 seconds

//     // Clear the timer when the component unmounts
//     return () => clearTimeout(timer);
//   }, []);

//   return (
//     <Stack.Navigator>
//       {/* {isLoading ? (
//         <Stack.Screen
//           name="load"
//           component={LoadingScreen}
//           options={{headerShown: false}} // Hide the header for the loading screen
//         />
//       ) : (
//         <> */}
//       <Stack.Screen
//         name="Welcome"
//         component={WelcomePage}
//         options={{headerShown: false}} // Optionally hide the header
//       />
//       <Stack.Screen
//         name="Register"
//         component={RegistrationPage}
//         options={{headerShown: false}} // Optionally hide the header
//       />
//       <Stack.Screen
//         name="login"
//         component={LoginPage}
//         options={{headerShown: false}} // Optionally hide the header
//       />
//       <Stack.Screen
//         name="Start"
//         component={StartScreen}
//         options={{
//           headerShown: true,
//           title: 'Home',
//           headerLeft: () => null, // This disables the back button
//         }}
//       />
//       <Stack.Screen
//         name="About"
//         component={AboutUsScreen}
//         options={{
//           headerShown: true,
//           title: 'About',
//         }}
//       />
//       <Stack.Screen
//         name="profile"
//         component={ProfilePage}
//         options={{
//           headerShown: true,
//           title: 'Profile',
//         }}
//       />
//       <Stack.Screen
//         name="ReportProblem"
//         component={ReportScreen}
//         options={{
//           headerShown: true,
//           title: 'Report Problem',
//         }}
//       />

//       <Stack.Screen
//         name="maps"
//         component={BusTrackingMap}
//         options={{
//           headerShown: true,
//           title: 'Maps',
//         }}
//       />

//       <Stack.Screen
//         name="SearchPlaces"
//         component={SearchPlaces}
//         options={{
//           headerShown: true,
//           title: 'Search Map',
//         }}
//       />
//       {/* Add other screens here */}
//       {/* </>
//       )} */}
//     </Stack.Navigator>
//   );
// };

// export default AppNavigators;
