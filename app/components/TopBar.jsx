import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, BlurView } from 'react-native'
import React, { useState } from 'react'
import { FontAwesome6, Ionicons } from '@expo/vector-icons';

const TopBar = () => {

    const [isOpen, setIsOpen] = useState(false);
    const [name, setName] = useState('');
    const [status, setStatus] = useState(''); // 'accepted' or 'rejected'
    const [description, setDescription] = useState('');

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
                <View style={styles.notificationContainer} onPress={() => setIsOpen(true)}>
                    {/* <View style={styles.notText}>
                    </View> */}
                    <FontAwesome6 name="hat-cowboy-side" size={25} color="#4FC3F7" />
                    <Text style={styles.logoText}>ManSpan</Text>
                </View>
                <View style={styles.timeCal}>
                    <Ionicons name='calendar-clear' size={20} color='white' />
                    <Text style={styles.timeText}>
                        {getCurrentDate()}
                    </Text>
                </View>


            </View>


            {isOpen &&
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={isOpen}
                    onRequestClose={() => setIsOpen(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.glassModalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Add New Entry</Text>
                                <TouchableOpacity onPress={() => setIsOpen(false)} style={styles.closeButton}>
                                    <Ionicons name="close" size={24} color="#fff" />
                                </TouchableOpacity>
                            </View>

                            {/* Name Input */}
                            <View style={styles.inputSection}>
                                <Text style={styles.label}>Name</Text>
                                <TextInput
                                    placeholder="Enter name..."
                                    placeholderTextColor="rgba(255,255,255,0.7)"
                                    style={styles.textInput1}
                                    value={name}
                                    onChangeText={setName}
                                />
                            </View>

                            {/* Status Selection */}
                            <View style={styles.inputSection}>
                                <Text style={styles.label}>Status</Text>
                                <View style={styles.statusContainer}>
                                    <TouchableOpacity
                                        style={[styles.statusOption, status === 'accepted' && styles.selectedAccept]}
                                        onPress={() => setStatus('accepted')}
                                    >
                                        <Ionicons
                                            name={status === 'accepted' ? "checkmark-circle" : "checkmark-circle-outline"}
                                            size={24}
                                            color={status === 'accepted' ? "#27AE60" : "rgba(255,255,255,0.7)"}
                                        />
                                        <Text style={[styles.statusText, status === 'accepted' && styles.selectedText]}>
                                            Accepted
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.statusOption, status === 'rejected' && styles.selectedReject]}
                                        onPress={() => setStatus('rejected')}
                                    >
                                        <Ionicons
                                            name={status === 'rejected' ? "close-circle" : "close-circle-outline"}
                                            size={24}
                                            color={status === 'rejected' ? "#EB5757" : "rgba(255,255,255,0.7)"}
                                        />
                                        <Text style={[styles.statusText, status === 'rejected' && styles.selectedText]}>
                                            Rejected
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            {/* Description Input */}
                            <View style={styles.inputSection}>
                                <Text style={styles.label}>Description / Reason</Text>
                                <TextInput
                                    placeholder="Enter description or reason..."
                                    placeholderTextColor="rgba(255,255,255,0.7)"
                                    style={[styles.textInput, styles.descriptionInput]}
                                    multiline={true}
                                    numberOfLines={3}
                                    value={description}
                                    onChangeText={setDescription}
                                />
                            </View>

                            <TouchableOpacity style={styles.submitButton}>
                                <Text style={styles.submitButtonText}>Add Entry</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            }


        </View>
    )
}

export default TopBar

const styles = StyleSheet.create({
    container: {
        padding: 5,
        marginBottom: 8
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
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 2,
    },
    glassModalContent: {
        backgroundColor: '#323230ff',
        borderRadius: 8,
        padding: 18,
        width: '95%',
        maxHeight: '90%',
        backdropFilter: 'blur(5px)',
        borderWidth: 1,
        borderColor: 'rgba(220, 214, 214, 0.35)',
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    logoText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#4FC3F7',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#fff',
    },
    closeButton: {
        padding: 5,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    inputSection: {
        marginBottom: 8,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 8,
    },
    textInput1: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        color: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    textInput: {
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderRadius: 8,
        padding: 15,
        fontSize: 16,
        color: '#fff',
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    descriptionInput: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    statusContainer: {
        flexDirection: 'row',
        gap: 10,
    },
    statusOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 8,
        padding: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
        gap: 10,
    },
    selectedAccept: {
        backgroundColor: 'rgba(39, 174, 96, 0.2)',
        borderColor: '#27AE60',
    },
    selectedReject: {
        backgroundColor: 'rgba(235, 87, 87, 0.2)',
        borderColor: '#EB5757',
    },
    statusText: {
        fontSize: 16,
        color: 'rgba(255, 255, 255, 0.7)',
        fontWeight: '500',
    },
    selectedText: {
        color: '#fff',
        fontWeight: '600',
    },
    submitButton: {
        backgroundColor: 'rgba(79, 195, 247, 0.8)',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        marginTop: 10,
        borderWidth: 1,
        borderColor: 'rgba(79, 195, 247, 0.5)',
    },

    submitButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },


});