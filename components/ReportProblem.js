import React, {useState, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Animated,
} from 'react-native';

const ReportScreen = () => {
  const [reportText, setReportText] = useState('');
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const slideAnim = useRef(new Animated.Value(-100)).current;

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
  const handleReportSubmit = async () => {
    if (reportText.trim().length === 0) {
      showAlert('Please enter a description of the issue.');
      return;
    }

    try {
      const response = await fetch(
        // 'http://192.168.0.110:5000/api/issues/submit',
        'http://10.141.184.248:5000/api/issues/submit', //UNI

        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({description: reportText}),
        },
      );

      const jsonResponse = await response.json();
      if (response.ok) {
        showAlert('Report submitted successfully!');
        setReportText(''); // Clear the text field after successful submission
      } else {
        throw new Error(
          jsonResponse.error ||
            'An error occurred while submitting the report.',
        );
      }
    } catch (error) {
      showAlert('Error', error.message);
    }
  };

  return (
    <ImageBackground
      source={require('../images/2.jpg')}
      style={styles.backgroundImage}
      blurRadius={5}>
      {alertVisible && (
        <Animated.View
          style={[styles.alertBox, {transform: [{translateY: slideAnim}]}]}>
          <Text style={styles.alertText}>{alertMessage}</Text>
        </Animated.View>
      )}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.reportCard}>
          <Text style={styles.header}>Report an Issue</Text>
          <TextInput
            style={styles.input}
            placeholder="Describe the issue..."
            placeholderTextColor="#666"
            multiline
            value={reportText}
            onChangeText={setReportText}
          />
          <TouchableOpacity style={styles.button} onPress={handleReportSubmit}>
            <Text style={styles.buttonText}>Submit Report</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
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
    resizeMode: 'cover',
  },
  reportCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    padding: 20,
    width: '90%',
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  header: {
    fontSize: 20,
    color: '#333',
    marginBottom: 15,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    minHeight: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.6)',
    paddingHorizontal: 15,
    color: 'black',
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'grey',
    textAlignVertical: 'top', // For Android multiline textAlign
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
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
});

export default ReportScreen;
