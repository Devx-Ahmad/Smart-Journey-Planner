import React, {useState} from 'react';
import {
  View,
  TextInput,
  Image,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import backgroundImage from '../images/2.jpg'; // Import the background image

const InputField = ({
  placeholder,
  iconPath,
  value,
  border,
  onLocationSelection,
  iconSize = [20, 20],
}) => {
  const navigation = useNavigation();
  const [isPressed, setIsPressed] = useState(false);

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
      imageStyle={styles.backgroundImageStyle}>
      <View style={styles.overlay} />
      <View
        style={[
          styles.searchContainer,
          {borderWidth: border},
          // eslint-disable-next-line react-native/no-inline-styles
          isPressed && {backgroundColor: 'rgba(255, 255, 255, 0.3)'},
        ]}>
        <Image
          source={iconPath} // Pass the icon image path as a prop
          // Width and Height set with prop
          style={[styles.searchIcon, {height: iconSize[1], width: iconSize[0]}]}
        />
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="black"
          // To apply style when pressed
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => {
            setIsPressed(false);
            navigation.navigate('SearchPlaces', {
              //Keep the state of input fields when locaiton selected
              callback: onLocationSelection,
            });
          }}
          value={value} // Pass the value from state as a prop
        />
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // Ensures the image covers the background without repeating
  },
  backgroundImageStyle: {
    resizeMode: 'cover', // Make sure the image does not repeat and covers the full area
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark overlay to match the effect of BlurView
  },
  searchContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'rgba(255, 255, 255, 0.3)', // Match border color with SearchPlaces
    borderRadius: 20, // Adjusted border radius for a square container
    padding: 7, // Center the content with padding
    margin: 10,
    width: 335, // Ensure the container is square
    height: 60, // Ensure the container is square
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: 'rgba(0, 0, 0, 0.4)', // Match shadow color with SearchPlaces
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 10,
    marginTop: -1,
  },

  input: {
    flex: 1,
    paddingVertical: 5, // Adjusted padding to fit within the square
    color: 'black',
    fontSize: 16, // Match fontSize with SearchPlaces
    fontWeight: 'bold',
  },
});

export default InputField;
