import React, { useEffect, useState } from 'react'
import { Keyboard, StyleSheet, Text, View, Modal, Alert } from 'react-native';
import { Button, Snackbar, TextInput } from 'react-native-paper';
import { addDoc, collection } from 'firebase/firestore';

const AddExpense = ({ db, fetchExpenses, modalVisible, setModalVisible }) => {

  const [textInput, setTextInput] = useState('');
  const [amtInput, setAmtInput] = useState(0);
  const [submitting, setSubmitting] = useState('');

  const [snackVisible, setSnackVisible] = useState(false);

  const addExpense = async () => {
    try {
      setSubmitting(true);
      const docRef = await addDoc(collection(db, "expenses"), {
        title: textInput,
        amount: amtInput,
        type: 'debit',
        isCompleted: false,
        createdAt: new Date()
      });
      setSubmitting(false);
      Keyboard.dismiss();
      console.log("Document written with ID: ", docRef.id);
      // setSnackVisible(true);
      setModalVisible(false);
      setTextInput('');
      setAmtInput(0);
      fetchExpenses();
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [])


  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(!modalVisible);
      }}>


      <View style={styles.container}>
        <View style={styles.inputGroup}>
          <Text style={styles.title}>Add New Expense</Text>
          <TextInput
            mode='outlined'
            keyboardType='numeric'
            style={styles.input}
            value={amtInput}
            onChangeText={setAmtInput}
            placeholder='amount...'
          />
          <TextInput
            mode='outlined'
            style={styles.input}
            value={textInput}
            onChangeText={setTextInput}
            placeholder='new expense...'
          />
        </View>
        <Button style={{ borderRadius: 5 }} mode='contained' onPress={addExpense}>Add Expense</Button>
        <Snackbar
          visible={snackVisible}
          onDismiss={() => setSnackVisible(false)}
          action={{
            label: 'Dismiss',
            onPress: () => {
              setSnackVisible(false)
            },
          }}>
          Expense Added!
        </Snackbar>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingVertical: 40,
    paddingHorizontal: 30
  },
  input: {
    width: '100%',
    marginBottom: 10
  },
  title: {
    marginBottom: 30,
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
  }
})

export default AddExpense;