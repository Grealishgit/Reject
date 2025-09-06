import { View, Text, Animated, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef } from 'react'
import Svg, { Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const OverralStat = () => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const rippleAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Progress animation
        Animated.timing(animatedValue, {
            toValue: 75, // 75% fill
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
    }, []);

    const size = 150;
    const strokeWidth = 15;
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;

    return (
        <View>
            <View style={styles.headerContainer}>
                <Text style={styles.title}>Overall Rejects</Text>
                <TouchableOpacity>
                    <MaterialCommunityIcons name='dots-horizontal' size={24} color='white' />
                </TouchableOpacity>

            </View>

            <View style={styles.container}>

                <View style={styles.circleContainer}>
                    <Animated.View style={[
                        styles.ripple,
                        {
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
                                <Stop offset="0%" stopColor="#4FC3F7" stopOpacity="1" />
                                <Stop offset="50%" stopColor="#4FC3F7" stopOpacity="1" />
                                <Stop offset="100%" stopColor="#4FC3F7" stopOpacity="1" />
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

                        {/* Progress circle - animated blue gradient */}
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
                        <Text style={styles.percentageText}>75%</Text>
                        <Text style={styles.labelText}>Rejects</Text>
                    </View>
                </View>
            </View>
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
        backgroundColor: '#4FC3F7',
        zIndex: 2,
    },
    ripple2: {
        position: 'absolute',
        width: 150,
        height: 150,
        borderRadius: 75,
        backgroundColor: '#4FC3F7',
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
        fontSize: 28,
        fontWeight: 'bold',
        color: '#4FC3F7',
        textAlign: 'center',
    },
    labelText: {
        fontSize: 14,
        color: '#fff',
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
});