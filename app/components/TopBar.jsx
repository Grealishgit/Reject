import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

const TopBar = () => {

    //Function to get the current date
    const getCurrentDate = () => {
        const now = new Date();
        const options = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        };
        return now.toLocaleDateString('en-US', options);
    };

    return (
        <View style={styles.container} >
            <View style={styles.containerBox}>
                <View style={styles.timeCal}>
                    <Ionicons name='calendar-clear' size={20} color='white' />
                    <Text style={styles.timeText}>
                        {getCurrentDate()}
                    </Text>
                </View>
                <View style={styles.notificationContainer}>
                    <View style={styles.notText}>
                    </View>
                    <Ionicons name="notifications-outline" size={25} color="white" />
                </View>

            </View>

        </View>
    )
}

export default TopBar

const styles = StyleSheet.create({
    container: {
        padding: 5,


    },
    containerBox: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    timeText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: "white"
    },
    timeCal: {
        flexDirection: 'row',
        gap: 8,
        alignItems: 'center'
    },
    notificationContainer: {
        position: 'relative',
        paddingLeft: 3,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
    },
    notText: {
        backgroundColor: "red",
        width: 6,
        height: 6,
        borderRadius: '50%',
        fontSize: 15,
        fontWeight: 'bold',
        position: 'absolute',
        left: 2,
        top: 2
    }

});