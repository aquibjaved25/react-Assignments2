import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Alert
} from 'react-native';
import { deleteExpense } from '../db/expenses';
import { getRealm } from '../db/realm';

const Assignment5 = ({ navigation }: any) => {
const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    const realm = getRealm();
    const results = realm.objects('Expense').sorted('date', true);
    // set initial
    setItems(Array.from(results));

    // listener
    const listener = () => {
      setItems(Array.from(results));
    };
    // @ts-ignore
    results.addListener(listener);

    return () => {
      // @ts-ignore
      results.removeListener(listener);
    };
  }, []);

  const handleDeleteExpense = (id: string, title: string) => {
    Alert.alert(
      'Delete Expense',
      `Are you sure you want to delete "${title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => deleteExpense(id)
        }
      ]
    );
  };

  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0).toFixed(2);
  };

  const renderExpenseItem = ({ item }: any) => {
    return (
      <View style={styles.expenseItem}>
        <View style={styles.itemContent}>
          <View style={styles.itemHeader}>
            <Text style={styles.categoryText}>{item.category}</Text>
            <Text style={styles.amountText}>₹{item.amount.toFixed(2)}</Text>
          </View>
          <Text style={styles.noteText}>{item.note}</Text>
          <Text style={styles.dateText}>
            {new Date(item.date).toLocaleDateString()}
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteExpense(item._id, item.category)}
          activeOpacity={0.7}
        >
          <Text style={styles.deleteButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header with buttons and total */}
      <View style={styles.header}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.headerButton}
            onPress={() => navigation.navigate('PieChartScreen')}
            activeOpacity={0.7}
          >
            <Text style={styles.buttonText}>📊 Charts</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.headerButton, styles.primaryButton]}
            onPress={() => navigation.navigate('AddExpense')}
            activeOpacity={0.7}
          >
            <Text style={[styles.buttonText, styles.primaryButtonText]}>+ Add</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Expenses:</Text>
          <Text style={styles.totalAmount}>₹{calculateTotal()}</Text>
        </View>
      </View>

      {/* Expense List */}
      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        renderItem={renderExpenseItem}
        style={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No expenses yet</Text>
            <Text style={styles.emptySubtext}>Add a new expense to get started</Text>
          </View>
        }
      />
    </View>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#ffffff',
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerButton: {
    backgroundColor: '#e9ecef',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 0.48,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  primaryButtonText: {
    color: '#ffffff',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#495057',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#28a745',
  },
  list: {
    flex: 1,
  },
  expenseItem: {
    backgroundColor: '#ffffff',
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  itemContent: {
    flex: 1,
    padding: 16,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#dc3545',
  },
  noteText: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 6,
    fontStyle: 'italic',
  },
  dateText: {
    fontSize: 12,
    color: '#adb5bd',
  },
  deleteButton: {
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteButtonText: {
    fontSize: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6c757d',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#adb5bd',
  },
});

export default Assignment5;