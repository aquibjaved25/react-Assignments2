import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Button,
  StyleSheet,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { stackScreens, Category } from '../App';

type Props = NativeStackScreenProps<stackScreens, 'Category'>;

const CategoryScreen: React.FC<Props> = ({ route, navigation }) => {
  const [categories, setCategories] = useState<Category[]>(route.params.categories);
  const { onReturn } = route.params;

  const toggleCategory = (name: string) => {
    setCategories(prev => {
      // If user clicked "all"
      if (name === 'all') {
        const isAllSelected = prev.find(c => c.name === 'all')?.isSelected;
        return prev.map(cat =>
          cat.name === 'all'
            ? { ...cat, isSelected: !isAllSelected }
            : { ...cat, isSelected: false }
        );
      } else {
        // If user clicked a non-"all" category
        return prev.map(cat => {
          if (cat.name === 'all') {
            return { ...cat, isSelected: false }; // deselect "all"
          }
          if (cat.name === name) {
            return { ...cat, isSelected: !cat.isSelected };
          }
          return cat;
        });
      }
    });
  };

  const isAllSelected = categories.find(c => c.name === 'all')?.isSelected;

  const renderItem = ({ item }: { item: Category }) => (
    <TouchableOpacity
      onPress={() => toggleCategory(item.name)}
      style={[
        styles.item,
        isAllSelected && item.name !== 'all' && styles.disabledItem,
      ]}
      disabled={isAllSelected && item.name !== 'all'} // disable all others if "all" is selected
    >
      <Text style={{ flex: 1, color: isAllSelected && item.name !== 'all' ? '#aaa' : '#000' }}>
        {item.name}
      </Text>
      <Text>{item.isSelected ? '☑️' : '⬜'}</Text>
    </TouchableOpacity>
  );

  const handleConfirm = () => {
    onReturn(categories);
    navigation.goBack();
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.name}
        renderItem={renderItem}
      />
      <Button title="Confirm Selection" onPress={handleConfirm} />
    </View>
  );
};

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    alignItems: 'center',
  },
  disabledItem: {
    opacity: 0.5,
  },
});

export default CategoryScreen;
