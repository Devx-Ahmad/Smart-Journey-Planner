import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';

const AboutPage = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>About Us</Text>

      <Image source={require('../images/1.jpeg')} style={styles.headerImage} />

      <Text style={styles.subHeader}>Introduction</Text>
      <Text style={styles.text}>
        In the dynamic environment of technological development, especially in
        context of public transportation, this project aims to address
        challenges encountered by users through the creation of a mobile
        application. The system strives to furnish users with comprehensive
        route information based on their specified origin and destination.
        Prioritizing routes based on specific criteria, the system is designed
        to improve the overall accessibility and efficiency of public
        transportation for users. This surely ensure marvelous travel experience
        and is completely user-friendly.
      </Text>
      <Text style={styles.subHeader}>Our Mission</Text>
      <Text style={styles.text}>
        Our mission is to make traveling and route planning as effortless and
        enjoyable as possible. We provide accurate, real-time navigation,
        comprehensive route options, and user-focused design to empower our
        users to explore the world with confidence and ease.
      </Text>

      <Text style={styles.subHeader}>What We Do</Text>
      <Text style={styles.text}>
        We integrate cutting edge technology with user-friendly interfaces to
        deliver top-tier navigation services. Whether you're commuting daily or
        exploring new terrains, our app supports every journey with robust
        mapping and detailed route previews.
      </Text>

      <Text style={styles.subHeader}>Meet the Team</Text>
      <View style={styles.teamContainer}>
        <View style={styles.teamMember}>
          <Image
            source={require('../images/pic.png')}
            style={styles.teamImage}
          />
          <Text style={styles.name}>Muhammad Ahmad</Text>
          <Text style={styles.role}>Mobile App Developer</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const {width} = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  headerImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#555',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
    textAlign: 'justify',
  },
  teamContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  teamMember: {
    alignItems: 'center',
  },
  teamImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
    resizeMode: 'contain',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  role: {
    fontSize: 16,
    color: '#666',
  },
});

export default AboutPage;
