import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';
import { View } from 'react-native';
import CircleProgress from '../../components/CircleProgress';


export default function HomeScreen() {
  return (
    <View>
      <CircleProgress percentage={100} />
    </View>
  );
}

const styles = StyleSheet.create({

});
