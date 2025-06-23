import React, {useState, useRef, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useUser} from './context';

const LoginPage = () => {
  const navigation = useNavigation();
  const route = useRoute(); // Access the passed parameters
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const {setUser} = useUser();

  useEffect(() => {
    if (route.params?.alertMessage) {
      showAlert(route.params.alertMessage);
    }
  }, [route.params?.alertMessage, showAlert]); // Use optional chaining here

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const showAlert = message => {
    setAlertMessage(message); // Set the dynamic message
    setAlertVisible(true); // Show the alert
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setAlertVisible(false));
    }, 2000); // Hide after 2 seconds
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showAlert('Please fill out all fields'); // Show alert if fields are empty
      return;
    }

    try {
      const response = await fetch(
        'http://10.141.184.248:5000/api/users/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // HTTP body to be string
          body: JSON.stringify({email, password}),
        },
      );

      const data = await response.json();

      if (response.ok) {
        showAlert('Login successful');

        // U data to be set in both context and AsyncStorage
        const userData = {
          name: data.name,
          email: data.email,
          userId: data.userId,
        };

        // Set user data in context
        setUser(userData);

        // Persist user data in AsyncStorage for session persistence
        await AsyncStorage.setItem('userDetails', JSON.stringify(userData));
        // await AsyncStorage.setItem('userID', data.userId);

        //OPtional
        // if (data.token) {
        //   await AsyncStorage.setItem('userToken', data.token);
        // }

        navigation.navigate('Start');
      } else {
        showAlert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Network error:', error);
      showAlert('Failed to log in. Please try again later.');
    }
  };

  return (
    <ImageBackground
      source={require('../images/2.jpg')}
      style={styles.background}>
      {/* Drop-Down Alert */}
      {alertVisible && (
        <Animated.View
          style={[styles.alertBox, {transform: [{translateY: slideAnim}]}]}>
          <Text style={styles.alertText}>{alertMessage}</Text>
        </Animated.View>
      )}

      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail} // This will update the email state
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword} // This will update the password state
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>

        {/* Forget Password */}
        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate('Register')} // Example navigation function
        >
          <Text style={styles.linkText}>Don't Have an account? Register</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 10,
    marginHorizontal: 30,
  },
  title: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderColor: '#fff',
    borderBottomWidth: 1,
    color: '#fff',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: '#ff6f61',
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  alertBox: {
    position: 'absolute',
    top: 0,
    left: 5,
    right: 7,
    backgroundColor: 'red',
    paddingVertical: 15,
    paddingHorizontal: 20,
    width: 350,
    zIndex: 1000,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    borderRadius: 20,
  },
  alertText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  link: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default LoginPage;
