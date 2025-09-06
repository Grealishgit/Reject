import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'

const Recent = () => {
    const buttons =
        [
            { id: 1, title: 'Recent' },
            { id: 2, title: 'Rejects' },
            { id: 3, title: 'Accepts' },
        ]
    return (
        <View style={styles.container}>
            <View>
                <Text style={styles.title}>
                    Recents
                </Text>
                <View style={styles.buttonContainer}>
                    {buttons.map((button) => (
                        <TouchableOpacity key={button.id} style={styles.button}>
                            <Text style={styles.buttonText}>{button.title}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </View>
    )
}

export default Recent
const styles = StyleSheet.create({
    container: {
        padding: 10,
        borderRadius: 8,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    button: {
        height: 40,
        width: '30%',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#323230ff',
        borderRadius: 4
    },
    buttonText: {
        fontSize: 16,
        color: '#fff',
        textAlign: 'center',
        lineHeight: 40,
        fontWeight: 'bold'
    },
    title: {
        fontSize: 20,
        marginTop: 5,
        fontWeight: 'bold',
        color: '#fff'
    }

})