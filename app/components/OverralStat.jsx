import { View, Text, Animated, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const OverralStat = () => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const rippleAnim = useRef(new Animated.Value(0)).current;
    const [modalVisible, setModalVisible] = useState(false);
    const [currentMetric, setCurrentMetric] = useState('approaches');
    const [weeklyStats, setWeeklyStats] = useState({
        approaches: 0,
        rejects: 0,
        accepts: 0
    });

    const WEEKLY_TARGET = 10;

    useEffect(() => {
        loadWeeklyStats();
    }, []);

    // Reload data when screen comes into focus
    useFocusEffect(
        React.useCallback(() => {
            loadWeeklyStats();
        }, [])
    );

    const loadWeeklyStats = async () => {
        try {
            const storedNotes = await AsyncStorage.getItem('encounter_notes');
            if (storedNotes !== null) {
                const notes = JSON.parse(storedNotes);

                // Get current week's data (last 7 days)
                const oneWeekAgo = new Date();
                oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

                const thisWeekNotes = notes.filter(note =>
                    new Date(note.timestamp) >= oneWeekAgo
                );

                const approaches = thisWeekNotes.length;
                const rejects = thisWeekNotes.filter(note => note.status === 'rejected').length;
                const accepts = thisWeekNotes.filter(note => note.status === 'accepted').length;

                setWeeklyStats({ approaches, rejects, accepts });
            } else {
                setWeeklyStats({ approaches: 0, rejects: 0, accepts: 0 });
            }
        } catch (error) {
            console.error('Error loading weekly stats:', error);
            setWeeklyStats({ approaches: 0, rejects: 0, accepts: 0 });
        }
    };

    const getCurrentValue = () => {
        return weeklyStats[currentMetric];
    };

    const getCurrentPercentage = () => {
        const value = getCurrentValue();
        return Math.min((value / WEEKLY_TARGET) * 100, 100);
    };

    const getMetricColor = () => {
        switch (currentMetric) {
            case 'rejects':
                return '#E74C3C';
            case 'accepts':
                return '#27AE60';
            default:
                return '#4FC3F7';
        }
    };

    const getMetricIcon = () => {
        switch (currentMetric) {
            case 'rejects':
                return 'close-circle';
            case 'accepts':
                return 'check-circle';
            default:
                return 'target';
        }
    };

    const getMetricLabel = () => {
        switch (currentMetric) {
            case 'rejects':
                return 'Rejects';
            case 'accepts':
                return 'Accepts';
            default:
                return 'Approaches';
        }
    };

    useEffect(() => {
        // Progress animation
        Animated.timing(animatedValue, {
            toValue: getCurrentPercentage(),
            duration: 2000,
            useNativeDriver: false,
        }).start();

        // Ripple animation loop
        const rippleAnimation = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(rippleAnim, {
                        toValue: 1,
                        duration: 2000,
                        useNativeDriver: false,
                    }),
                    Animated.timing(rippleAnim, {
                        toValue: 0,
                        duration: 2000,
                        useNativeDriver: false,
                    }),
                ])
            ).start();
        };

        rippleAnimation();
    }, [weeklyStats, currentMetric]);

    const size = 150;
    const strokeWidth = 15;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    const MetricOption = ({ metric, label, icon, color, count }) => (
        <TouchableOpacity
            style={[styles.metricOption, currentMetric === metric && { backgroundColor: color + '20' }]}
            onPress={() => {
                setCurrentMetric(metric);
                setModalVisible(false);
            }}
        >
            <View style={styles.metricLeft}>
                <MaterialCommunityIcons name={icon} size={24} color={color} />
                <Text style={styles.metricLabel}>{label}</Text>
            </View>
            <View style={styles.metricRight}>
                <Text style={[styles.metricCount, { color }]}>{count}</Text>
                <Text style={styles.metricTarget}>/ {WEEKLY_TARGET}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Weekly {getMetricLabel()}</Text>
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <MaterialCommunityIcons name='dots-horizontal' size={24} color='white' />
                </TouchableOpacity>
            </View>

            <View style={styles.container}>
                <View style={styles.circleContainer}>
                    <Animated.View style={[
                        styles.ripple,
                        {
                            backgroundColor: getMetricColor(),
                            transform: [{
                                scale: rippleAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.8, 1.2]
                                })
                            }],
                            opacity: rippleAnim.interpolate({
                                inputRange: [0, 0.5, 1],
                                outputRange: [0.3, 0.1, 0]
                            })
                        }
                    ]} />

                    <Animated.View style={[
                        styles.ripple2,
                        {
                            backgroundColor: getMetricColor(),
                            transform: [{
                                scale: rippleAnim.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [1, 1.4]
                                })
                            }],
                            opacity: rippleAnim.interpolate({
                                inputRange: [0, 0.3, 0.7, 1],
                                outputRange: [0, 0.2, 0.1, 0]
                            })
                        }
                    ]} />

                    <Svg width={size} height={size} style={styles.svg}>
                        <Defs>
                            <LinearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                                <Stop offset="0%" stopColor={getMetricColor()} stopOpacity="1" />
                                <Stop offset="50%" stopColor={getMetricColor()} stopOpacity="1" />
                                <Stop offset="100%" stopColor={getMetricColor()} stopOpacity="1" />
                            </LinearGradient>
                        </Defs>

                        {/* Background circle - light gray */}
                        <Circle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke="#7A7A73"
                            strokeWidth={strokeWidth}
                            fill="none"
                        />

                        {/* Progress circle - animated gradient */}
                        <AnimatedCircle
                            cx={size / 2}
                            cy={size / 2}
                            r={radius}
                            stroke="url(#grad)"
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
                        <Text style={[styles.percentageText, { color: getMetricColor() }]}>
                            {getCurrentValue()}/{WEEKLY_TARGET}
                        </Text>
                        <Text style={styles.labelText}>{getMetricLabel()}</Text>
                        <Text style={styles.progressText}>
                            {Math.round(getCurrentPercentage())}% of target
                        </Text>
                    </View>
                </View>
            </View>

            {/* Metric Selection Modal */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Select Metric</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <MaterialCommunityIcons name="close" size={24} color="#333" />
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.modalSubtitle}>Weekly Progress (Last 7 Days)</Text>

                        <MetricOption
                            metric="approaches"
                            label="Total Approaches"
                            icon="target"
                            color="#4FC3F7"
                            count={weeklyStats.approaches}
                        />

                        <MetricOption
                            metric="rejects"
                            label="Rejections"
                            icon="close-circle"
                            color="#E74C3C"
                            count={weeklyStats.rejects}
                        />

                        <MetricOption
                            metric="accepts"
                            label="Acceptances"
                            icon="check-circle"
                            color="#27AE60"
                            count={weeklyStats.accepts}
                        />
                    </View>
                </View>
            </Modal>
        </View>
    )
}

export default OverralStat

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#323230ff',
        height: '100%',
        borderRadius: 8
    },
    circleContainer: {
        position: 'relative',
        justifyContent: 'center',
        alignItems: 'center',
    },
    ripple: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        zIndex: 2,
    },
    ripple2: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        zIndex: 2,
    },
    svg: {
        position: 'absolute',
    },
    centerText: {
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
    },
    percentageText: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    labelText: {
        fontSize: 14,
        color: '#fff',
        textAlign: 'center',
        marginTop: 2,
    },
    progressText: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        marginTop: 2,
    },
    headerContainer: {
        flexDirection: 'row',
        paddingBottom: 10,
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#fff',
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 15,
        width: '85%',
        padding: 20,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        textAlign: 'center',
    },
    metricOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        backgroundColor: '#f8f9fa',
    },
    metricLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    metricLabel: {
        fontSize: 16,
        fontWeight: '500',
        color: '#333',
        marginLeft: 12,
    },
    metricRight: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    metricCount: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    metricTarget: {
        fontSize: 14,
        color: '#666',
    },
});