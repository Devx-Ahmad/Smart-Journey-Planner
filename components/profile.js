import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import {useUser} from './context';
import {BlurView} from '@react-native-community/blur';
import useLogout from '../components/logout';

const ProfileScreen = () => {
  const {user} = useUser();
  const logout = useLogout();

  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../images/2.jpg')}
        style={styles.backgroundImage}
        blurRadius={10} //Blur
      >
        <BlurView style={styles.blurContainer} blurType="light" blurAmount={10}>
          <View style={styles.profileCard}>
            <Image
              source={require('../images/pic.png')}
              style={styles.avatar}
            />
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Name</Text>
              <TextInput
                value={user?.name}
                style={styles.input}
                editable={false}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                value={user?.email}
                style={styles.input}
                editable={false}
              />
            </View>
            <View style={styles.inputContainer}>
              <TouchableOpacity onPress={logout} style={styles.button}>
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BlurView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  button: {
    backgroundColor: '#007AFF', // A nice blue color
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    left: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignItems: 'center',
    left: 96,
  },
  blurContainer: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.0)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '90%', // Adjust the width of the card

    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
    marginLeft: 20,
    marginTop: 20,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
    marginLeft: 10,
  },
  label: {
    fontSize: 18,
    color: '#333',
    marginBottom: 5,
    marginLeft: 10,
  },
  input: {
    fontSize: 18,
    color: '#666',
    backgroundColor: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default ProfileScreen;
