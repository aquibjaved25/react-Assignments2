import { View, Text, FlatList,ActivityIndicator } from 'react-native'
import React, { useEffect, useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface Article {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const Assignment1 = () => {

const [articles, setArticles] = useState<Article[]>([]);
const [page, setPage] = useState(1);
const [loading, setLoading] = useState(false);
const [refreshing, setRefreshing] = useState(false);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  (async () => {
    const cached = await AsyncStorage.getItem("cachedArticles");
    if (cached) {
      setArticles(JSON.parse(cached));
    }
    fetchNews(1);
  })();
}, []);

const fetchNews = async (pageNumber = 1, refresh = false) => {
  try {
    setLoading(true);
    setError(null);

    const response = await fetch(
     // `https://fakestoreapi.com/products?_limit=${pageNumber}&_page=10`
      `https://jsonplaceholder.typicode.com/posts?_limit=20&_page=${pageNumber}`
    );

    const data: Article[] = await response.json();
    const newArticles = data;

    if (refresh) {
      setArticles(newArticles);
    } else {
      setArticles(prev => [...prev, ...newArticles]);
    }

    setPage(pageNumber);
    await AsyncStorage.setItem("cachedArticles", JSON.stringify(newArticles));
  } catch (err) {
    setError("Failed to fetch news. Please try again.");
    const cached = await AsyncStorage.getItem("cachedArticles");
    if (cached) {
      setArticles(JSON.parse(cached));
    }
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  return (
    <View>
      <FlatList
  data={articles}
  keyExtractor={(item, index) => index.toString()}
  renderItem={({ item }) => (
    <View style={{ padding: 10 }}>
      <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
      <Text>{item.body}</Text>
    </View>
  )}
  refreshing={refreshing}
  onRefresh={() => {
    setRefreshing(true);
    fetchNews(1, true);
  }}
  onEndReached={() => fetchNews(page + 1)}
  onEndReachedThreshold={0.5}
/>

{loading && <ActivityIndicator size="large" />}
{error && <Text style={{ color: 'red' }}>{error}</Text>}
    </View>
  )
}

export default Assignment1;