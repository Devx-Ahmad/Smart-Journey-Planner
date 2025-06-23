import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useLogout = () => {
  const navigation = useNavigation();

  const logout = async () => {
    try {
      // Clear UserDetails
      await AsyncStorage.removeItem('userDetails');
      // await AsyncStorage.removeItem('userToken');

      // Navigate back
      navigation.navigate('Welcome');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  return logout;
};

export default useLogout;
