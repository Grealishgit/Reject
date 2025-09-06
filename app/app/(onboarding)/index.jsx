import { Image, Text, TouchableOpacity, View, StyleSheet, Dimensions, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useRef, useState } from 'react'

const { width, height } = Dimensions.get('window');

const onboardingData = [
    {
        id: 1,
        title: "Track Your Rejections",
        description: "Keep track of all your rejections and acceptances in one place. Learn from every experience and grow stronger.",
        backgroundColor: '#E4004B', // Pure red
    },
    {
        id: 2,
        title: "Analyze Your Progress",
        description: "Get insights into your acceptance and rejection patterns. Understand what works and what doesn't.",
        backgroundColor: '#FF6B8A', // Lighter red
    },
    {
        id: 3,
        title: "Celebrate Success",
        description: "Every acceptance is a victory! Celebrate your successes and build confidence for future endeavors.",
        backgroundColor: '#27AE60', // Green
    }
];

const Onboarding = () => {
    const scrollViewRef = useRef(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const isLastSlide = activeIndex === onboardingData.length - 1;
    const isFirstSlide = activeIndex === 0;

    const handleNext = () => {
        if (isLastSlide) {
            router.replace("/(tabs)/");
        } else {
            const nextIndex = activeIndex + 1;
            scrollViewRef.current?.scrollTo({
                x: nextIndex * width,
                animated: true
            });
            setActiveIndex(nextIndex);
        }
    };

    const handlePrevious = () => {
        if (!isFirstSlide) {
            const prevIndex = activeIndex - 1;
            scrollViewRef.current?.scrollTo({
                x: prevIndex * width,
                animated: true
            });
            setActiveIndex(prevIndex);
        }
    };

    const handleSkip = () => {
        router.replace("/(tabs)/");
    };

    const handleScroll = (event) => {
        const contentOffsetX = event.nativeEvent.contentOffset.x;
        const currentIndex = Math.round(contentOffsetX / width);
        setActiveIndex(currentIndex);
    };

    return (
        <View style={styles.container}>
            {/* Skip Button */}
            <TouchableOpacity
                onPress={handleSkip}
                style={styles.skipButton}
            >
                <Text style={styles.skipText}>Skip</Text>
            </TouchableOpacity>

            {/* ScrollView instead of Swiper */}
            <ScrollView
                ref={scrollViewRef}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
                style={styles.scrollView}
            >
                {onboardingData.map((item) => (
                    <View
                        key={item.id}
                        style={[styles.slide, { backgroundColor: item.backgroundColor }]}
                    >
                        <View style={styles.content}>
                            <View style={styles.iconContainer}>
                                <Text style={styles.iconText}>📱</Text>
                            </View>
                            <View style={styles.textContainer}>
                                <Text style={styles.title}>{item.title}</Text>
                                <Text style={styles.description}>{item.description}</Text>
                            </View>
                        </View>
                    </View>
                ))}
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomContainer}>
                {/* Dots Indicator */}
                <View style={styles.dotsContainer}>
                    {onboardingData.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                index === activeIndex ? styles.activeDot : styles.inactiveDot
                            ]}
                        />
                    ))}
                </View>

                {/* Navigation Buttons */}
                <View style={styles.navigationContainer}>
                    <TouchableOpacity
                        onPress={handlePrevious}
                        style={[
                            styles.navButton,
                            styles.previousButton,
                            isFirstSlide && styles.disabledButton
                        ]}
                        disabled={isFirstSlide}
                    >
                        <Text style={[
                            styles.navButtonText,
                            isFirstSlide && styles.disabledText
                        ]}>
                            Previous
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={handleNext}
                        style={[styles.navButton, styles.nextButton]}
                    >
                        <Text style={styles.nextButtonText}>
                            {isLastSlide ? 'Get Started' : 'Next'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}

export default Onboarding

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    skipButton: {
        position: 'absolute',
        top: 50,
        right: 20,
        zIndex: 10,
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    skipText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    swiper: {
        flex: 1,
    },
    slide: {
        width: width,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
    },
    iconContainer: {
        width: width * 0.4,
        height: height * 0.25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 40,
    },
    iconText: {
        fontSize: 100,
    },
    textContainer: {
        alignItems: 'center',
    },
    title: {
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
    },
    description: {
        fontSize: 18,
        color: 'rgba(255, 255, 255, 0.9)',
        textAlign: 'center',
        lineHeight: 26,
        marginHorizontal: 10,
    },
    bottomContainer: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        backgroundColor: 'transparent',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    dot: {
        width: 32,
        height: 4,
        borderRadius: 2,
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#fff',
    },
    inactiveDot: {
        backgroundColor: 'rgba(255, 255, 255, 0.4)',
    },
    navigationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    navButton: {
        paddingHorizontal: 30,
        paddingVertical: 15,
        borderRadius: 25,
        minWidth: 120,
        alignItems: 'center',
    },
    previousButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    nextButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
    },
    disabledButton: {
        opacity: 0.3,
    },
    navButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
    },
    nextButtonText: {
        color: '#333',
        fontSize: 16,
        fontWeight: 'bold',
    },
    disabledText: {
        color: 'rgba(255, 255, 255, 0.5)',
    },
});