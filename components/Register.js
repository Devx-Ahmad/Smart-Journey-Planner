import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Animated,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import validator from 'validator';

const RegistrationPage = () => {
  const navigation = useNavigation();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const slideAnim = useRef(new Animated.Value(-100)).current;

  // Alert
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

  const handleRegister = async () => {
    // Simple validation
    if (!name || !email || !password) {
      showAlert('Please fill out all fields'); // Show alert if fields are empty
      return;
    }
    //Valid Email
    if (!validator.isEmail(email)) {
      showAlert('Please enter a valid email address');
      return;
    }

    try {
      // Send a POST request to the backend API
      const response = await fetch(
        // 'http://192.168.1.31:5000/api/users/register', OFFICE
        // 'http://192.168.0.110:5000/api/users/register', //MM KHAN
        'http://10.141.184.248:5000/api/users/register', //MM KHAN
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // Inform the server we're sending JSON data
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        },
      );

      const data = await response.json();

      // Check if the response is successful
      if (response.ok) {
        // If registration is successful, navigate to login screen with success message
        navigation.navigate('login', {alertMessage: 'Registration Successful'});
      } else {
        // Show error message if registration fails
        showAlert(data.error || 'Registration failed');
      }
    } catch (error) {
      // Handle any errors that occur during fetch
      // console.error(error);
      showAlert('An error occurred. Please try again.');
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
          {/* Wrapping text message in <Text> component */}
          <Text style={styles.alertText}>{alertMessage}</Text>
        </Animated.View>
      )}

      <View style={styles.container}>
        <Text style={styles.title}>Register</Text>

        <TextInput
          style={styles.input}
          placeholder="Name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#888"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#888"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleRegister}>
          <Text style={styles.buttonText}>Register</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.link}
          onPress={() => navigation.navigate('login')}>
          <Text style={styles.linkText}>Already have an account? Log In</Text>
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
    backgroundColor: 'red', // Soft green color for the button
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
export default RegistrationPage;
