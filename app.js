import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [students, setStudents] = useState([]);
  const [name, setName] = useState('');
  const [roll, setRoll] = useState('');
  const [branch, setBranch] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const storedStudents = await AsyncStorage.getItem('students');
      if (storedStudents) setStudents(JSON.parse(storedStudents));
    } catch (error) {
      Alert.alert('Error', 'Failed to load students');
    }
  };

  const saveStudents = async (updatedStudents) => {
    try {
      await AsyncStorage.setItem('students', JSON.stringify(updatedStudents));
      setStudents(updatedStudents);
    } catch (error) {
      Alert.alert('Error', 'Failed to save students');
    }
  };

  const addStudent = () => {
    if (!name || !roll || !branch || !contact || !email) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const newStudent = {
      roll,
      name,
      branch,
      present: 0,
      medical: 0,
      percentage: '0%'
    };

    const updatedStudents = [...students, newStudent];
    saveStudents(updatedStudents);
    clearInputs();
  };

  const markPresent = (rollNumber) => {
    const updatedStudents = students.map(student => {
      if (student.roll === rollNumber) {
        const present = student.present + 1;
        const total = present + student.medical;
        return {
          ...student,
          present,
          percentage: `${((present / total) * 100).toFixed(2)}%`
        };
      }
      return student;
    });
    saveStudents(updatedStudents);
  };

  const markAbsent = (rollNumber) => {
    const updatedStudents = students.map(student => {
      if (student.roll === rollNumber) {
        const medical = student.medical + 1;
        const total = student.present + medical;
        return {
          ...student,
          medical,
          percentage: `${((student.present / total) * 100).toFixed(2)}%`
        };
      }
      return student;
    });
    saveStudents(updatedStudents);
  };

  const resetAttendance = async () => {
    try {
      await AsyncStorage.removeItem('students');
      setStudents([]);
    } catch (error) {
      Alert.alert('Error', 'Failed to reset attendance');
    }
  };

  const clearInputs = () => {
    setName('');
    setRoll('');
    setBranch('');
    setContact('');
    setEmail('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>College Attendance Tracker</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Student Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Roll Number"
        value={roll}
        onChangeText={setRoll}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Branch"
        value={branch}
        onChangeText={setBranch}
      />
      <TextInput
        style={styles.input}
        placeholder="Contact Number"
        value={contact}
        onChangeText={setContact}
        keyboardType="phone-pad"
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <TouchableOpacity style={styles.addButton} onPress={addStudent}>
        <Text style={styles.buttonText}>Add Student</Text>
      </TouchableOpacity>

      <ScrollView style={styles.listContainer}>
        <View style={styles.tableHeader}>
          <Text style={styles.headerCell}>Roll No</Text>
          <Text style={styles.headerCell}>Name</Text>
          <Text style={styles.headerCell}>Branch</Text>
          <Text style={styles.headerCell}>Present</Text>
          <Text style={styles.headerCell}>Medical</Text>
          <Text style={styles.headerCell}>%</Text>
          <Text style={styles.headerCell}>Actions</Text>
        </View>

        {students.map((student, index) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.cell}>{student.roll}</Text>
            <Text style={styles.cell}>{student.name}</Text>
            <Text style={styles.cell}>{student.branch}</Text>
            <Text style={styles.cell}>{student.present}</Text>
            <Text style={styles.cell}>{student.medical}</Text>
            <Text style={styles.cell}>{student.percentage}</Text>
            <View style={styles.actionCell}>
              <TouchableOpacity 
                style={[styles.actionButton, styles.presentButton]}
                onPress={() => markPresent(student.roll)}
              >
                <Text>P</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.actionButton, styles.absentButton]}
                onPress={() => markAbsent(student.roll)}
              >
                <Text>A</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.resetButton} onPress={resetAttendance}>
        <Text style={styles.buttonText}>Reset Attendance</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  resetButton: {
    backgroundColor: '#dc3545',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
  },
  listContainer: {
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#007BFF',
    padding: 10,
  },
  headerCell: {
    flex: 1,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    backgroundColor: 'white',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  actionCell: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    padding: 5,
    borderRadius: 3,
    width: 30,
    alignItems: 'center',
  },
  presentButton: {
    backgroundColor: '#28a745',
  },
  absentButton: {
    backgroundColor: '#ffc107',
  },
});
