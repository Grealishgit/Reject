import { View, Text, StyleSheet, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Ionicons } from '@expo/vector-icons'
import AsyncStorage from '@react-native-async-storage/async-storage'

const Settings = () => {
    const [settings, setSettings] = useState({
        notifications: true,
        darkMode: true,
        autoBackup: false,
        showConfidenceInList: true,
        defaultConfidenceLevel: 5,
        reminderEnabled: false,
        privacyMode: false
    })

    useEffect(() => {
        loadSettings()
    }, [])

    const loadSettings = async () => {
        try {
            const savedSettings = await AsyncStorage.getItem('app_settings')
            if (savedSettings) {
                setSettings(JSON.parse(savedSettings))
            }
        } catch (error) {
            console.error('Error loading settings:', error)
        }
    }

    const saveSettings = async (newSettings) => {
        try {
            await AsyncStorage.setItem('app_settings', JSON.stringify(newSettings))
            setSettings(newSettings)
        } catch (error) {
            console.error('Error saving settings:', error)
        }
    }

    const toggleSetting = (key) => {
        const newSettings = { ...settings, [key]: !settings[key] }
        saveSettings(newSettings)
    }

    const clearAllData = () => {
        Alert.alert(
            'Clear All Data',
            'This will permanently delete all your encounter notes. This action cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete All',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await AsyncStorage.removeItem('encounter_notes')
                            Alert.alert('Success', 'All data has been cleared.')
                        } catch (error) {
                            Alert.alert('Error', 'Failed to clear data.')
                        }
                    }
                }
            ]
        )
    }

    const exportData = async () => {
        try {
            const notes = await AsyncStorage.getItem('encounter_notes')
            if (notes) {
                // In a real app, you'd implement actual export functionality
                Alert.alert('Export Data', 'Data export feature coming soon!')
            } else {
                Alert.alert('No Data', 'No encounter notes to export.')
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to export data.')
        }
    }

    const SettingItem = ({ title, subtitle, value, onToggle, icon, color = '#4FC3F7' }) => (
        <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: color }]}>
                    <Ionicons name={icon} size={20} color="#fff" />
                </View>
                <View style={styles.settingText}>
                    <Text style={styles.settingTitle}>{title}</Text>
                    {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
                </View>
            </View>
            <Switch
                value={value}
                onValueChange={onToggle}
                trackColor={{ false: '#555', true: color }}
                thumbColor={value ? '#fff' : '#ccc'}
            />
        </View>
    )

    const ActionItem = ({ title, subtitle, onPress, icon, color = '#4FC3F7', textColor = '#fff' }) => (
        <TouchableOpacity style={styles.settingItem} onPress={onPress}>
            <View style={styles.settingLeft}>
                <View style={[styles.iconContainer, { backgroundColor: color }]}>
                    <Ionicons name={icon} size={20} color="#fff" />
                </View>
                <View style={styles.settingText}>
                    <Text style={[styles.settingTitle, { color: textColor }]}>{title}</Text>
                    {subtitle && <Text style={styles.settingSubtitle}>{subtitle}</Text>}
                </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>
    )

    return (
        <ScrollView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Settings</Text>
            </View>

            {/* App Preferences */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>App Preferences</Text>

                <SettingItem
                    title="Dark Mode"
                    subtitle="Use dark theme throughout the app"
                    value={settings.darkMode}
                    onToggle={() => toggleSetting('darkMode')}
                    icon="moon"
                    color="#6C5CE7"
                />

                <SettingItem
                    title="Show Confidence in List"
                    subtitle="Display confidence levels in notes list"
                    value={settings.showConfidenceInList}
                    onToggle={() => toggleSetting('showConfidenceInList')}
                    icon="eye"
                    color="#00B894"
                />

                <SettingItem
                    title="Privacy Mode"
                    subtitle="Hide sensitive information in app preview"
                    value={settings.privacyMode}
                    onToggle={() => toggleSetting('privacyMode')}
                    icon="shield"
                    color="#FDCB6E"
                />
            </View>

            {/* Notifications */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Notifications</Text>

                <SettingItem
                    title="Enable Notifications"
                    subtitle="Get reminders and updates"
                    value={settings.notifications}
                    onToggle={() => toggleSetting('notifications')}
                    icon="notifications"
                    color="#FF7675"
                />

                <SettingItem
                    title="Daily Reminder"
                    subtitle="Remind me to add new encounters"
                    value={settings.reminderEnabled}
                    onToggle={() => toggleSetting('reminderEnabled')}
                    icon="time"
                    color="#A29BFE"
                />
            </View>

            {/* Data Management */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Data Management</Text>

                <SettingItem
                    title="Auto Backup"
                    subtitle="Automatically backup your data"
                    value={settings.autoBackup}
                    onToggle={() => toggleSetting('autoBackup')}
                    icon="cloud-upload"
                    color="#74B9FF"
                />

                <ActionItem
                    title="Export Data"
                    subtitle="Save your encounters to file"
                    onPress={exportData}
                    icon="download"
                    color="#00CEC9"
                />

                <ActionItem
                    title="Clear All Data"
                    subtitle="Permanently delete all encounters"
                    onPress={clearAllData}
                    icon="trash"
                    color="#E17055"
                    textColor="#E17055"
                />
            </View>

            {/* Statistics */}
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>About</Text>

                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>App Version</Text>
                    <Text style={styles.infoValue}>1.0.0</Text>
                </View>

                <View style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Developer</Text>
                    <Text style={styles.infoValue}>HunterInc</Text>
                </View>

                <TouchableOpacity style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Privacy Policy</Text>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                </TouchableOpacity>

                <TouchableOpacity style={styles.infoItem}>
                    <Text style={styles.infoLabel}>Terms of Service</Text>
                    <Ionicons name="chevron-forward" size={20} color="#666" />
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Text style={styles.footerText}>
                    Track your progress, learn from experiences, and improve your confidence.
                </Text>
            </View>
        </ScrollView>
    )
}

export default Settings

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000000',
    },
    header: {
        paddingTop: 50,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    headerText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
    },
    section: {
        marginBottom: 30,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        color: '#4FC3F7',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 15,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1a1a1a',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    settingText: {
        flex: 1,
    },
    settingTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    settingSubtitle: {
        color: '#999',
        fontSize: 14,
        marginTop: 2,
    },
    infoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#1a1a1a',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10,
    },
    infoLabel: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    infoValue: {
        color: '#999',
        fontSize: 16,
    },
    footer: {
        padding: 20,
        alignItems: 'center',
    },
    footerText: {
        color: '#666',
        fontSize: 14,
        textAlign: 'center',
        fontStyle: 'italic',
        lineHeight: 20,
    },
})