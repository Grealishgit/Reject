import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState } from 'react'

const Recent = () => {
    const [activeFilter, setActiveFilter] = useState('Recent');

    const allData = [
        { name: 'Eva', time: '2 min ago', status: 'Accepted', note: 'Am such a gentleman' },
        { name: 'Shan', time: '10 min ago', status: 'Rejected', note: 'Not her type' },
        { name: 'Amabell', time: '20 min ago', status: 'Accepted', note: 'I got the vibes' },
        { name: 'Rita', time: '40 min ago', status: 'Rejected', note: 'Past Trauma' },
    ];

    const buttons = [
        { id: 1, title: 'Recent' },
        { id: 2, title: 'Rejects' },
        { id: 3, title: 'Accepts' },
    ];

    const getFilteredData = () => {
        switch (activeFilter) {
            case 'Rejects':
                return allData.filter(item => item.status === 'Rejected');
            case 'Accepts':
                return allData.filter(item => item.status === 'Accepted');
            default:
                return allData;
        }
    };

    const DataBar = ({ item }) => (
        <View style={[
            styles.dataBar,
            item.status === 'Rejected' ? styles.rejectedBar : styles.acceptedBar
        ]}>
            <View style={styles.topRow}>
                <Text style={styles.nameText}>{item.name}</Text>
                <Text style={[
                    styles.statusText,
                    { color: item.status === 'Accepted' ? '#27AE60' : '#EB5757' }
                ]}>
                    {item.status}
                </Text>
            </View>
            <View style={styles.bottomRow}>
                <Text style={styles.reasonText}>{item.note}</Text>
                <Text style={styles.timeText}>{item.time}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Recents</Text>

            <View style={styles.buttonContainer}>
                {buttons.map((button) => (
                    <TouchableOpacity
                        key={button.id}
                        style={[
                            styles.button,
                            activeFilter === button.title && styles.activeButton
                        ]}
                        onPress={() => setActiveFilter(button.title)}
                    >
                        <Text style={[
                            styles.buttonText,
                            activeFilter === button.title && styles.activeButtonText
                        ]}>
                            {button.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.scrollView}>
                <ScrollView
                    style={styles.scrollContainer}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.dataContainer}
                >
                    {getFilteredData().map((item, index) => (
                        <DataBar key={index} item={item} />
                    ))}
                </ScrollView>
            </View>
        </View>
    )
}

export default Recent
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
        borderRadius: 8,
    },
    title: {
        fontSize: 20,
        marginTop: 5,
        fontWeight: 'bold',
        color: '#fff'
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
        marginBottom: 10,
    },
    button: {
        height: 40,
        width: '30%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#323230ff',
        borderRadius: 8,
    },
    activeButton: {
        backgroundColor: '#4FC3F7',
    },
    buttonText: {
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold'
    },
    activeButtonText: {
        color: '#fff',
    },
    scrollContainer: {
        flex: 1,
        marginBottom: 10,
        maxHeight: 700,
    },
    scrollView: {
        flex: 1,
        marginBottom: 10
    },
    dataContainer: {
        gap: 12,
        paddingBottom: 50, // Add bottom padding for better scroll experience
    },
    dataBar: {
        backgroundColor: '#2A2A2A',
        borderRadius: 8,
        padding: 15,
    },
    rejectedBar: {
        borderLeftWidth: 2,
        borderLeftColor: '#EB5757',
    },
    acceptedBar: {
        borderRightWidth: 2,
        borderRightColor: '#27AE60',
    },
    topRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    nameText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    statusText: {
        fontSize: 14,
        fontWeight: '600',
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    reasonText: {
        fontSize: 14,
        color: '#B0B0B0',
        flex: 1,
        marginRight: 10,
    },
    timeText: {
        fontSize: 12,
        color: '#8A8A8A',
        fontStyle: 'italic',
    },
});