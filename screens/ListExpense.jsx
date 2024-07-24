import React, { useEffect, useState } from 'react'
import { collection, deleteDoc, doc, getDocs, getFirestore, updateDoc } from 'firebase/firestore'
import { FlatList, StyleSheet, View } from 'react-native'
import { ActivityIndicator, Button, Card, Checkbox, FAB, IconButton, SegmentedButtons, Text } from 'react-native-paper'
import { initializeApp } from 'firebase/app'
import AddExpense from './AddExpense'

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const formattedDateTime = (fbDate) => {
  const date = fbDate.toDate();
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getHours()}:${date.getMinutes()} ${date.getHours() > 12 ? 'PM' : 'AM'}`
}

const ExpenseCard = ({ id, title, isCompleted, amount, createdAt }) => {
  return <Card key={id}>
    <Card.Content>
      <Checkbox status={isCompleted ? 'checked' : 'unchecked'} onPress={() => completeExpense(id, isCompleted)} />
      <Text style={styles.itemText}>{title} (₹{amount}) - {formattedDateTime(createdAt)} </Text>
    </Card.Content>
    <Card.Actions>
      {/* <Button>Cancel</Button> */}
      <Button onPress={() => deleteExpense(id)} icon="delete">Delete</Button>
    </Card.Actions>
  </Card>
}

const ListExpense = () => {

  const [expenseList, setExpenseList] = useState([]);
  const [masterList, setMasterList] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState('all');

  const firebaseConfig = {
    apiKey: "AIzaSyCpjPJCT-bO49GkuQq982fVp3Ju0sm5prM",
    authDomain: "native-9ba01.firebaseapp.com",
    projectId: "native-9ba01",
    storageBucket: "native-9ba01.appspot.com",
    messagingSenderId: "140174126073",
    appId: "1:140174126073:web:f79e36a08b365da9572b28",
    measurementId: "G-6W3KPL713D",
  };
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  const fetchExpenses = () => {
    setLoading(true);
    const db = getFirestore(app);
    const ref = collection(db, "expenses");
    getDocs(ref).then((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      console.log(data);
      setExpenseList(data);
      setMasterList(data);
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchExpenses();
  }, [])


  const deleteExpense = async (id) => {
    console.log('Deleting expense:', id);
    await deleteDoc(doc(db, "expenses", id));
    fetchExpenses();
  }

  const completeExpense = async (id, status) => {
    const docRef = doc(db, "expenses", id);

    // Set the "capital" field of the city 'DC'
    await updateDoc(docRef, {
      isCompleted: !status
    });
    fetchExpenses();
  }



  const displayList = () => {
    if (loading) return (<ActivityIndicator animating={true} color={'#6200ee'} />)

    return <FlatList
      data={expenseList}
      renderItem={({ item, index }) => <ExpenseCard {...item} index={index} />}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={<Text style={{ textAlign: 'center', fontSize: 30, color: '#aaa' }}>No expenses found</Text>}
    />
  }

  const filterPending = () => {
    setExpenseList(masterList.filter((expense) => !expense.isCompleted));
  }

  const filterCompleted = () => {
    setExpenseList(masterList.filter((expense) => expense.isCompleted));
  }

  return (
    <View style={styles.container}>
      <AddExpense db={db} fetchExpenses={fetchExpenses} modalVisible={modalOpen} setModalVisible={setModalOpen} />
      <Text style={styles.title}>Expense List</Text>
      <SegmentedButtons
        style={{ marginBottom: 20 }}
        value={value}
        onValueChange={setValue}
        buttons={[
          {
            icon: 'format-list-bulleted',
            value: 'all',
            label: 'All Expense',
            onPress: () => setExpenseList(masterList)
          },
          {
            icon: 'arrow-up-bold-circle',
            value: 'pending',
            label: 'Debit',
            onPress: filterPending
          },
          {
            icon: 'arrow-down-bold-circle',
            value: 'completed',
            label: 'Credit',
            onPress: filterCompleted
          },
        ]}
      />
      {displayList()}
      <FAB
        icon="plus"
        style={styles.addAction}
        color='#fff'
        onPress={() => setModalOpen(true)}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    marginVertical: 30
  },
  listItem: {
    backgroundColor: '#eee',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5
  },
  itemText: {
    fontSize: 15
  },
  addAction: {
    position: 'absolute',
    margin: 16,
    right: 10,
    bottom: 10,
    borderRadius: 50,
    backgroundColor: '#6200ee'
  }
});

export default ListExpense;