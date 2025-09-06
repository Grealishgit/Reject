import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';
import { View } from 'react-native';
import CircleProgress from '../../components/CircleProgress';
import TopBar from '../../components/TopBar';


export default function HomeScreen() {
  return (
    <View>
      <TopBar />
      <CircleProgress percentage={100} />
    </View>
  );
}

const styles = StyleSheet.create({

});
