import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';
import { View } from 'react-native';
import CircleProgress from '../../components/CircleProgress';
import TopBar from '../../components/TopBar';
import OverralStat from '../../components/OverralStat'


export default function HomeScreen() {
  return (
    <View style={styles.mainContainer}>

      <View>
        <TopBar />  
      </View>


      <View style={styles.overralContainer}>
        <OverralStat />
      </View>


      <View style={styles.circleContainer}>
        <CircleProgress percentage={100} />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 4
  },
  overralContainer: {
    padding: 4,
    marginTop: 10,
    height: '25%',


  },
  circleContainer: {
    marginTop: 30,
  }
});
