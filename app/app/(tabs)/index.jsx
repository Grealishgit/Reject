import { Image } from 'expo-image';
import { Platform, StyleSheet } from 'react-native';
import { View } from 'react-native';
import CircleProgress from '../../components/CircleProgress';
import TopBar from '../../components/TopBar';
import OverralStat from '../../components/OverralStat'
import AcceptRejectCircles from '../../components/AcceptRejectCircles';


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
        <AcceptRejectCircles />
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
    height: '22%',
  },
  circleContainer: {
    padding: 4,
    paddingTop: 90,
    height: '22%',
  }
});
