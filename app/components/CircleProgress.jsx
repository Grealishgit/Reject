import React from 'react';
import { StyleSheet } from 'react-native';
import Svg, { Circle, Text } from 'react-native-svg';

const CircleProgress = ({ size = 120, strokeWidth = 10, percentage = 100 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const progress = circumference * (percentage / 100);

    return (
        <Svg width={size} height={size}>
            <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#e6e6e6"
                strokeWidth={strokeWidth}
                fill="none"
            />
            <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#3498db"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={circumference - progress}
                strokeLinecap="round"
            />
            <Text style={styles.percentageText}
                x={size / 2}
                y={size / 2}
                textAnchor="middle"
                dy=".3em"
                fontSize={size / 4}
                fill="#3498db"
            >
                {percentage}%
            </Text>
        </Svg>
    );
};

export default CircleProgress;

const styles = StyleSheet.create({
    percentageText: {
        fontWeight: 'bold',
        fontSize: 10,
        color: 'red'
    },
});
