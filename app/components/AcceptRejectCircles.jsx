import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const AcceptRejectCircles = () => {
    const acceptanceProgress = useRef(new Animated.Value(0)).current;
    const rejectProgress = useRef(new Animated.Value(0)).current;
    const [stats, setStats] = useState({
        acceptancePercentage: 0,
        rejectionPercentage: 0,
        totalNotes: 0
    });

    useEffect(() => {
        loadNotesData();
    }, []);

    // Reload data when screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            loadNotesData();
        }, [])
    );

    useEffect(() => {
    // Animate acceptance circle to actual percentage
        Animated.timing(acceptanceProgress, {
            toValue: stats.acceptancePercentage,
            duration: 2000,
            useNativeDriver: false,
        }).start();

        // Animate reject circle to actual percentage
        Animated.timing(rejectProgress, {
            toValue: stats.rejectionPercentage,
            duration: 2000,
            useNativeDriver: false,
        }).start();
    }, [stats]);

    const loadNotesData = async () => {
        try {
            const storedNotes = await AsyncStorage.getItem('encounter_notes');
            if (storedNotes !== null) {
                const notes = JSON.parse(storedNotes);
                const totalNotes = notes.length;

                if (totalNotes > 0) {
                    const acceptedCount = notes.filter(note => note.status === 'accepted').length;
                    const rejectedCount = notes.filter(note => note.status === 'rejected').length;

                    const acceptancePercentage = Math.round((acceptedCount / totalNotes) * 100);
                    const rejectionPercentage = Math.round((rejectedCount / totalNotes) * 100);

                    setStats({
                        acceptancePercentage,
                        rejectionPercentage,
                        totalNotes
                    });
                } else {
                    setStats({
                        acceptancePercentage: 0,
                        rejectionPercentage: 0,
                        totalNotes: 0
                    });
                }
            }
        } catch (error) {
            console.error('Error loading notes data:', error);
        }
    };

    const size = 100;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const CircleCard = ({ title, icon, percentage, animatedValue, color, gradientId }) => (
        <View style={styles.card}>
            <View style={styles.header}>
                <Text style={styles.titleText}>{title}</Text>
                <Ionicons name={icon} size={24} color={color} />
            </View>

            <View style={styles.circleContainer}>
                <Svg width={size} height={size}>
                    <Defs>
                        <LinearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                            <Stop offset="0%" stopColor={color} stopOpacity="0.8" />
                            <Stop offset="100%" stopColor={color} stopOpacity="1" />
                        </LinearGradient>
                    </Defs>

                    {/* Background circle */}
                    <Circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke="#E0E0E0"
                        strokeWidth={strokeWidth}
                        fill="none"
                    />

                    {/* Progress circle */}
                    <AnimatedCircle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        stroke={`url(#${gradientId})`}
                        strokeWidth={strokeWidth}
                        fill="none"
                        strokeDasharray={circumference}
                        strokeDashoffset={animatedValue.interpolate({
                            inputRange: [0, 100],
                            outputRange: [circumference, 0]
                        })}
                        strokeLinecap="round"
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                    />
                </Svg>

                <View style={styles.centerText}>
                    <Text style={[styles.percentageText, { color }]}>{percentage}%</Text>
                </View>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {/* Rejects Circle - Left */}
            <CircleCard
                title="Rejects"
                icon="close-circle"
                percentage={stats.rejectionPercentage}
                animatedValue={rejectProgress}
                color="#F75270"
                gradientId="redGrad"
            />

            {/* Acceptance Circle - Right */}
            <CircleCard
                title="Acceptance"
                icon="checkmark-circle"
                percentage={stats.acceptancePercentage}
                animatedValue={acceptanceProgress}
                color="#27AE60"
                gradientId="greenGrad"
            />
        </View>
    );
};

export default AcceptRejectCircles;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 2,
        gap: 15,
    },
    card: {
        flex: 1,
        backgroundColor: '#323230ff',
        borderRadius: 8,
        height: 170,
        padding: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15,
    },
    titleText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#fff',
    },
    circleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    centerText: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    percentageText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
