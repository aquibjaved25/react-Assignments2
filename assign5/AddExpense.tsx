import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { addExpense } from "../db/expenses";

const categories = ["Food", "Transport", "Bills", "Shopping", "Other"];

export default function AddExpense({ navigation }: any) {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(categories[0]);
  const [note, setNote] = useState("");

  const handleSave = () => {
    const parsed = parseFloat(amount);
    if (!parsed || parsed <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid amount greater than 0");
      return;
    }
    addExpense({
      amount: parsed,
      category,
      note,
      date: new Date(),
    });
    // reset or go back
    setAmount("");
    setNote("");
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Amount</Text>
      <TextInput
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        placeholder="100.00"
        style={styles.input}
      />

      <Text style={styles.label}>Category</Text>
      {categories.map((c) => (
        <Button
          title={c}
          key={c}
          onPress={() => setCategory(c)}
          color={c === category ? undefined : undefined}
        />
      ))}

      <Text style={styles.label}>Note</Text>
      <TextInput value={note} onChangeText={setNote} style={styles.input} />

      <Button title="Save Expense" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  label: { marginTop: 12 },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 8,
    borderRadius: 6,
    marginBottom: 8,
  },
});
