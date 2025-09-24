import React, { useEffect, useState, useCallback, use } from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    Image,
    Button,
    TouchableOpacity,
    ActivityIndicator,
    StyleSheet,
    Dimensions,
    Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { stackScreens, Category } from '../App';

interface Product {
    id: number;
    title: string;
    category: string;
    image: string;
    price: number;
}



type Props = NativeStackScreenProps<stackScreens, 'Assignment6'>;

const ITEM_HEIGHT = 250;
const NUM_COLUMNS = 2;
const ITEM_WIDTH = Dimensions.get('window').width / NUM_COLUMNS - 20;
const PRODUCTS_PER_PAGE = 10;

const initialCategories = [
    { name: 'all', isSelected: true },
    { name: 'electronics', isSelected: false },
    { name: 'jewelery', isSelected: false },
    { name: "men's clothing", isSelected: false },
];

const Assignment6: React.FC<Props> = ({ navigation }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [page, setPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [searchItem, setSearchItem] = useState("");
    const [categories, setCategories] = useState(initialCategories);

    const fetchProducts = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const response = await fetch(
                `https://fakestoreapi.com/products?limit=${PRODUCTS_PER_PAGE}&page=${page}`
            );
            const data: Product[] = await response.json();

            if (data.length === 0) {
                setHasMore(false);
            } else {
                setProducts(prev => [...prev, ...data]);
                updateFilteredProductsByFetch(data)
                console.log('Filtered Products:', filteredProducts);
                setPage(prev => prev + 1);
            }
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore]);

    const updateFilteredProductsByFetch = (data: Product[]) => {
        const selectedCategoryNames = categories
            .filter(cat => cat.isSelected)
            .map(cat => cat.name);

        // Step 2: Filter products that belong to selected categories
        if (selectedCategoryNames.includes('all')) {

             if (searchItem.length > 0) {
                 setFilteredProducts(prev => [...prev, ...data.filter(product =>
                     product.title.toLowerCase().includes(searchItem.toLowerCase())
                 )]);
             } else {
                 setFilteredProducts(prev => [...prev, ...data]);
             }

           
        } else {

                if (searchItem.length > 0) {
                    const filteredData = data.filter(product =>
                        selectedCategoryNames.includes(product.category) &&
                        product.title.toLowerCase().includes(searchItem.toLowerCase())
                    );
                    setFilteredProducts([...filteredProducts, ...filteredData]);
                    
                }else{
            const filteredData = data.filter(product =>
                selectedCategoryNames.includes(product.category)
            );
            setFilteredProducts([...filteredProducts, ...filteredData]);
        }
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const updateFilteredProductsByCategories = () => {
        const selectedCategories = categories.filter(cat => cat.isSelected).map(cat => cat.name);
        if (selectedCategories.includes('all') || selectedCategories.length === 0) {
            if (searchItem.length > 0) {
                setFilteredProducts(products.filter(product =>
                    product.title.toLowerCase().includes(searchItem.toLowerCase())
                ));
            } else {
                setFilteredProducts(products);
            }
        } else {
            const productCategory = products.filter(product =>
                selectedCategories.includes(product.category)
            );
            if (searchItem.length > 0) {
                setFilteredProducts(productCategory.filter(product =>
                    product.title.toLowerCase().includes(searchItem.toLowerCase())
                ));
            } else {
                setFilteredProducts(productCategory);
            }
        }
    }
    useEffect(() => {
        updateFilteredProductsByCategories();
    }, [categories, products, searchItem]);

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




    const handleCategoryReturn = (selected: Category[]) => {
        setCategories(selected);
    };

    return (
        <View style={styles.container}>

            <TextInput
                value={searchItem}
                style={styles.textInputStyle}
                placeholder="Search for a product"
                keyboardType='default'
                onChangeText={text => setSearchItem(text)}
            />

            {/* Category Filter */}
            <View style={styles.categories}>
                {categories.filter(cat => cat.isSelected).map(cat => (
                    <TouchableOpacity
                        key={cat.name}

                        style={[
                            styles.categoryButton,

                        ]}                             
                    >
                        <Text >{cat.name || 'All'}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <Button
                title="Choose Categories"
                onPress={() =>
                    navigation.navigate('Category', {
                        categories,
                        onReturn: handleCategoryReturn,
                    })
                }
            />

            <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id + page.toString()}
                renderItem={renderItem}
                numColumns={NUM_COLUMNS}
                onEndReached={fetchProducts}
                onEndReachedThreshold={0.5}
                initialNumToRender={10}
                removeClippedSubviews
                getItemLayout={getItemLayout}
                ListFooterComponent={
                    loading ? <ActivityIndicator size="large" style={{ margin: 16 }} /> : null
                }
                contentContainerStyle={{ paddingBottom: 20 }}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#fff' },
    item: {
        backgroundColor: '#f2f2f2',
        margin: 5,
        padding: 10,
        width: ITEM_WIDTH,
        height: ITEM_HEIGHT,
        borderRadius: 8,
        alignItems: 'center',
    },
    categories: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginBottom: 10,
    },
    textInputStyle: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        width: '98%',
        marginBottom: 10,
        padding: 10,
        margin: 5,
        borderRadius: 5,
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
    image: { width: 100, height: 100 },
    title: { marginTop: 10, fontSize: 14, textAlign: 'center' },
});

export default Assignment6;