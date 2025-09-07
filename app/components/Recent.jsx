import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFocusEffect } from '@react-navigation/native'

const Recent = () => {
    const [activeFilter, setActiveFilter] = useState('Recent');
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        loadNotes();
    }, []);

    // Reload data when screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            loadNotes();
        }, [])
    );

    const loadNotes = async () => {
        try {
            const storedNotes = await AsyncStorage.getItem('encounter_notes');
            if (storedNotes !== null) {
                const parsedNotes = JSON.parse(storedNotes);
                // Sort by timestamp (newest first)
                const sortedNotes = parsedNotes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
                setNotes(sortedNotes);
            } else {
                setNotes([]);
            }
        } catch (error) {
            console.error('Error loading notes:', error);
            setNotes([]);
        }
    };

    const getTimeAgo = (timestamp) => {
        const now = new Date();
        const noteTime = new Date(timestamp);
        const diffInMinutes = Math.floor((now - noteTime) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;

        return noteTime.toLocaleDateString();
    };

    const formatNoteForDisplay = (note) => {
        return {
            name: note.name,
            time: getTimeAgo(note.timestamp),
            status: note.status === 'accepted' ? 'Accepted' : 'Rejected',
            note: note.reason || note.notes || 'No additional notes',
            location: note.location,
            approach: note.approach,
            confidence: note.confidence
        };
    };

    const buttons = [
        { id: 1, title: 'Recent' },
        { id: 2, title: 'Rejects' },
        { id: 3, title: 'Accepts' },
    ];

    const getFilteredData = () => {
        const formattedNotes = notes.map(formatNoteForDisplay);

        switch (activeFilter) {
            case 'Rejects':
                return formattedNotes.filter(item => item.status === 'Rejected');
            case 'Accepts':
                return formattedNotes.filter(item => item.status === 'Accepted');
            default:
                return formattedNotes;
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

            {/* Additional info row */}
            {(item.location || item.approach || item.confidence) && (
                <View style={styles.infoRow}>
                    {item.location && <Text style={styles.infoText}>📍 {item.location}</Text>}
                    {item.approach && <Text style={styles.infoText}>💬 {item.approach}</Text>}
                    {item.confidence && <Text style={styles.infoText}>⭐ {item.confidence}/10</Text>}
                </View>
            )}

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


            <ScrollView
                style={styles.scrollContainer}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.dataContainer}
            >
                {getFilteredData().length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>
                            {notes.length === 0
                                ? 'No encounters recorded yet.'
                                : `No ${activeFilter.toLowerCase()} found.`
                            }
                        </Text>
                        <Text style={styles.emptySubtext}>
                            {notes.length === 0
                                ? 'Start adding encounters in the Notes tab!'
                                : 'Try a different filter or add more encounters.'
                            }
                        </Text>
                    </View>
                ) : (
                    getFilteredData().map((item, index) => (
                        <DataBar key={index} item={item} />
                    ))
                )}
            </ScrollView>

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
    },

    dataContainer: {
        gap: 8,
        paddingBottom: 50,
        marginBottom: 10,
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
    infoRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 8,
        gap: 10,
    },
    infoText: {
        fontSize: 12,
        color: '#9CA3AF',
        backgroundColor: '#374151',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 40,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
        textAlign: 'center',
        marginBottom: 8,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});