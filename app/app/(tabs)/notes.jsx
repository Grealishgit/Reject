import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView, Modal, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentNote, setCurrentNote] = useState({
    id: null,
    name: '',
    status: '', // 'accepted' or 'rejected'
    location: '',
    approach: '',
    reason: '',
    confidence: '',
    notes: '',
    timestamp: null
  });

  // Load notes when component mounts
  useEffect(() => {
    retrieveNotes();
  }, []);

  const storeNotes = async (notesArray) => {
    try {
      await AsyncStorage.setItem('encounter_notes', JSON.stringify(notesArray));
      console.log('Notes saved successfully');
    } catch (error) {
      console.error('Error storing notes:', error);
    }
  }

  const retrieveNotes = async () => {
    try {
      const storedNotes = await AsyncStorage.getItem('encounter_notes');
      if (storedNotes !== null) {
        setNotes(JSON.parse(storedNotes));
        console.log('Retrieved notes:', JSON.parse(storedNotes));
      } else {
        setNotes([]);
        console.log('No notes found in storage');
      }
    } catch (error) {
      console.error('Error retrieving notes:', error);
    }
  }

  const saveNote = async () => {
    if (!currentNote.name || !currentNote.status) {
      Alert.alert('Error', 'Please fill in name and status at minimum');
      return;
    }

    const newNote = {
      ...currentNote,
      id: currentNote.id || Date.now().toString(),
      timestamp: new Date().toISOString()
    };

    let updatedNotes;
    if (currentNote.id && notes.find(note => note.id === currentNote.id)) {
      // Update existing note
      updatedNotes = notes.map(note => note.id === currentNote.id ? newNote : note);
    } else {
      // Add new note
      updatedNotes = [newNote, ...notes];
    }

    setNotes(updatedNotes);
    await storeNotes(updatedNotes);
    resetForm();
    setModalVisible(false);
  }

  const deleteNote = async (noteId) => {
    Alert.alert(
      'Delete Note',
      'Are you sure you want to delete this note?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedNotes = notes.filter(note => note.id !== noteId);
            setNotes(updatedNotes);
            await storeNotes(updatedNotes);
          }
        }
      ]
    );
  }

  const editNote = (note) => {
    setCurrentNote(note);
    setModalVisible(true);
  }

  const resetForm = () => {
    setCurrentNote({
      id: null,
      name: '',
      status: '',
      location: '',
      approach: '',
      reason: '',
      confidence: '',
      notes: '',
      timestamp: null
    });
  }

  const openModal = () => {
    resetForm();
    setModalVisible(true);
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Encounter Notes</Text>
        <TouchableOpacity onPress={openModal} style={styles.addButton}>
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.notesContainer}>
        {notes.length === 0 ? (
          <Text style={styles.emptyText}>No encounters recorded yet. Tap + to add your first note!</Text>
        ) : (
            <>
              {/* Cards for stats */}

              <View style={styles.statsContainer}>
                <View style={[styles.statCard, { borderWidth: 1, borderColor: '#4FC3F7' }]}>
                  <Text style={styles.statLabel}>Total Notes</Text>
                  <Text style={styles.statValue}>{notes.length}</Text>
                </View>
                <View style={[styles.statCard, { borderWidth: 1, borderColor: '#4CAF50' }]}>
                  <Text style={styles.statLabel}>Accepted</Text>
                  <Text style={styles.statValue}>{notes.filter(note => note.status === 'accepted').length}</Text>
                </View>
                <View style={[styles.statCard, { borderWidth: 1, borderColor: '#ed311cff' }]}>
                  <Text style={styles.statLabel}>Rejected</Text>
                  <Text style={styles.statValue}>{notes.filter(note => note.status === 'rejected').length}</Text>
                </View>
              </View>

              {notes.map((note) => (
                <View key={note.id} style={[styles.noteCard, note.status === 'accepted' ? styles.acceptedCard : styles.rejectedCard]}>
                  <View style={styles.noteHeader}>
                    <Text style={styles.noteName}>{note.name}</Text>
                    <View style={styles.noteActions}>
                      <TouchableOpacity onPress={() => editNote(note)} style={styles.actionButton}>
                        <Ionicons name="pencil" size={18} color="#fff" />
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => deleteNote(note.id)} style={styles.actionButton}>
                        <Ionicons name="trash" size={18} color="#E74C3C" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={styles.statusContainer}>
                    <Text style={[styles.status, note.status === 'accepted' ? styles.acceptedStatus : styles.rejectedStatus]}>
                      {note.status.charAt(0).toUpperCase() + note.status.slice(1)}
                    </Text>
                    <Text style={styles.timestamp}>
                      {new Date(note.timestamp).toLocaleDateString()} {new Date(note.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>

                  {/* Notes in button like display */}
                  <View style={styles.noteComponent}>
                    {note.location &&
                      <View style={styles.noteDisplay}>
                        <Text style={styles.detailLabel}>Location:</Text>
                        <Text style={styles.detailLabel}>{note.location}</Text>
                      </View>}
                    {note.approach &&
                      <View style={styles.noteDisplay}>
                        <Text style={styles.detailLabel}>Approach:</Text>
                        <Text style={styles.detailLabel}>{note.approach}</Text>
                      </View>}
                    {note.confidence &&
                      <View style={styles.noteDisplay}>
                        <Text style={styles.detailLabel}>Confidence:</Text>
                        <Text style={styles.detailLabel}>{note.confidence}/10</Text>
                      </View>}
                  </View>

                  {note.reason && <Text style={styles.detail}><Text style={styles.detailLabel}>Reason:</Text> {note.reason}</Text>}
                  {note.notes && <Text style={styles.detail}><Text style={styles.detailLabel}>Notes:</Text> {note.notes}</Text>}
                </View>
              ))}

            </>
        )}
      </ScrollView>

      {/* Add/Edit Note Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{currentNote.id ? 'Edit' : 'Add'} Encounter</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.formContainer}>
              <TextInput
                placeholder="Name *"
                placeholderTextColor="#999"
                value={currentNote.name}
                onChangeText={(text) => setCurrentNote({ ...currentNote, name: text })}
                style={styles.input}
              />

              {/* Status Selection */}
              <Text style={styles.label}>Status *</Text>
              <View style={styles.statusButtons}>
                <TouchableOpacity
                  style={[styles.statusButton, currentNote.status === 'accepted' && styles.acceptedButton]}
                  onPress={() => setCurrentNote({ ...currentNote, status: 'accepted' })}
                >
                  <Text style={[styles.statusButtonText, currentNote.status === 'accepted' && styles.activeButtonText]}>Accepted</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.statusButton, currentNote.status === 'rejected' && styles.rejectedButton]}
                  onPress={() => setCurrentNote({ ...currentNote, status: 'rejected' })}
                >
                  <Text style={[styles.statusButtonText, currentNote.status === 'rejected' && styles.activeButtonText]}>Rejected</Text>
                </TouchableOpacity>
              </View>

              <TextInput
                placeholder="Location (e.g., Coffee shop, Mall, Park)"
                placeholderTextColor="#999"
                value={currentNote.location}
                onChangeText={(text) => setCurrentNote({ ...currentNote, location: text })}
                style={styles.input}
              />

              <TextInput
                placeholder="Approach (e.g., Direct, Indirect, Compliment)"
                placeholderTextColor="#999"
                value={currentNote.approach}
                onChangeText={(text) => setCurrentNote({ ...currentNote, approach: text })}
                style={styles.input}
              />

              <TextInput
                placeholder="Confidence Level (1-10)"
                placeholderTextColor="#999"
                value={currentNote.confidence}
                onChangeText={(text) => setCurrentNote({ ...currentNote, confidence: text })}
                style={styles.input}
                keyboardType="numeric"
                maxLength={2}
              />

              <TextInput
                placeholder="Reason (Why accepted/rejected?)"
                placeholderTextColor="#999"
                value={currentNote.reason}
                onChangeText={(text) => setCurrentNote({ ...currentNote, reason: text })}
                style={styles.input}
                multiline
              />

              <TextInput
                placeholder="Additional notes..."
                placeholderTextColor="#999"
                value={currentNote.notes}
                onChangeText={(text) => setCurrentNote({ ...currentNote, notes: text })}
                style={[styles.input, styles.notesInput]}
                multiline
                numberOfLines={4}
              />

              <TouchableOpacity onPress={saveNote} style={styles.saveButton}>
                <Text style={styles.saveButtonText}>{currentNote.id ? 'Update' : 'Save'} Note</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

    </View>
  )
}

export default Notes

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  headerText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4FC3F7',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 50,
    fontStyle: 'italic',
  },
  noteCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    borderLeftWidth: 2,
    borderRightWidth: 2,

  },
  acceptedCard: {
    borderRightColor: '#27AE60',
  },
  rejectedCard: {
    borderLeftColor: '#ed311cff',
  },
  noteHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  noteName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  noteActions: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 5,
    marginLeft: 10,
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  status: {
    fontSize: 14,
    fontWeight: 'bold',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  acceptedStatus: {
    backgroundColor: '#27AE60',
    color: '#fff',
  },
  rejectedStatus: {
    backgroundColor: '#E74C3C',
    color: '#fff',
  },
  timestamp: {
    color: '#999',
    fontSize: 12,
  },
  detail: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 5,
    lineHeight: 18,
  },
  detailLabel: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
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
    borderRadius: 8,
    width: '90%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    marginTop: 10,
  },
  input: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  statusButtons: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  statusButton: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginRight: 10,
    alignItems: 'center',
  },
  acceptedButton: {
    backgroundColor: '#d4edda',
    borderColor: '#27AE60',
  },
  rejectedButton: {
    backgroundColor: '#f8d7da',
    borderColor: '#E74C3C',
  },
  statusButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#666',
  },
  activeButtonText: {
    color: '#fff',
  },
  saveButton: {
    backgroundColor: '#4FC3F7',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 30,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  noteComponent: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  noteDisplay: {
    flexDirection: 'row',
    gap: 2,
    backgroundColor: '#1a1a1a',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#4FC3F7',
    padding: 5,
    marginBottom: 15,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  statCard: {
    backgroundColor: '#2c2c2c',
    borderRadius: 8,
    padding: 12,
    flex: 1,
    marginHorizontal: 5,
  },
  statLabel: {
    color: '#e0d5d5ff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statValue: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
})