// import { View, Text } from 'react-native'
// import React from 'react'

// const Assignment4 = () => {
//   return (
//     <View>
//       <Text>Assignment4</Text>
//     </View>
//   )
// }

// export default Assignment4

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from 'react-native';

interface Product {
  id: number;
  title: string;
  category: string;
  image: string;
  price: number;
}

const ITEM_HEIGHT = 250;
const NUM_COLUMNS = 2;
const ITEM_WIDTH = Dimensions.get('window').width / NUM_COLUMNS - 20;
const PRODUCTS_PER_PAGE = 10;

const categories = ['', 'electronics', 'jewelery', "men's clothing", "women's clothing"];

const Assignment4 = () => {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('https://fakestoreapi.com/products');
      const data: Product[] = await res.json();
      setAllProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filtering logic
  useEffect(() => {
    const filtered = allProducts.filter(item => {
      const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory
        ? item.category === selectedCategory
        : true;
      return matchesSearch && matchesCategory;
    });
    setFilteredProducts(filtered);
    setVisibleCount(PRODUCTS_PER_PAGE); // Reset visible count when filters change
  }, [searchTerm, selectedCategory, allProducts]);

  const handleLoadMore = () => {
    if (visibleCount < filteredProducts.length) {
      setVisibleCount(prev => prev + PRODUCTS_PER_PAGE);
    }
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={styles.item}>
      <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
      <Text numberOfLines={2} style={styles.title}>{item.title}</Text>
    </View>
  );

  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  });

  return (
    <View style={styles.container}>
      {/* Search Input */}
      <TextInput
        placeholder="Search products..."
        value={searchTerm}
        onChangeText={setSearchTerm}
        style={styles.search}
      />

      {/* Category Filter */}
      <View style={styles.categories}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            onPress={() => setSelectedCategory(cat)}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.activeCategory,
            ]}
          >
            <Text>{cat || 'All'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Product Grid */}
      {loading ? (
        <ActivityIndicator size="large" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={filteredProducts.slice(0, visibleCount)}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          numColumns={NUM_COLUMNS}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          initialNumToRender={10}
          removeClippedSubviews
          getItemLayout={getItemLayout}
          ListFooterComponent={
            visibleCount < filteredProducts.length ? (
              <ActivityIndicator size="small" style={{ marginVertical: 16 }} />
            ) : null
          }
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#fff' },
  search: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  categories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
    marginRight: 8,
    marginBottom: 8,
  },
  activeCategory: {
    backgroundColor: '#ddd',
  },
  item: {
    width: ITEM_WIDTH,
    height: ITEM_HEIGHT,
    margin: 5,
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    alignItems: 'center',
  },
  image: { width: 100, height: 100 },
  title: {
    marginTop: 10,
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Assignment4;