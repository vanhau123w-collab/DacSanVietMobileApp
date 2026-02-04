import React, { useEffect, useState, useCallback } from 'react';
import { View, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, TextInput, RefreshControl } from 'react-native';
import { Text, Avatar, ActivityIndicator, Badge, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, logoutUser } from '../store/slices/authSlice';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { getProducts } from '../services/productService';
import CategoryList from '../components/CategoryList';
import BestSellerList from '../components/BestSellerList';
import DiscountProductList from '../components/DiscountProductList';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { user, loading: authLoading, isAuthenticated } = useSelector((state) => state.auth);

    // Data State
    const [products, setProducts] = useState([]);
    // const [categories, setCategories] = useState([]); // Moved to CategoryList
    const [loadingProducts, setLoadingProducts] = useState(false); // Changed default to false, controlled by search/filter logic
    const [refreshing, setRefreshing] = useState(false);

    // Filter State
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null); // null means 'All'

    useEffect(() => {
        const initAuth = async () => {
            if (!isAuthenticated) {
                try {
                    await dispatch(loadUser()).unwrap();
                } catch (error) {
                    navigation.replace('Login');
                }
            } else if (!user) {
                dispatch(loadUser());
            }
        };
        initAuth();
    }, [isAuthenticated, user, dispatch, navigation]);

    const fetchData = useCallback(async () => {
        try {
            // Fetch Products only if searching or filtering
            if (searchQuery || selectedCategory) {
                await fetchProductsList();
            }

        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoadingProducts(false);
            setRefreshing(false);
        }
    }, []);

    const fetchProductsList = async () => {
        try {
            const params = {
                q: searchQuery,
                category: selectedCategory,
                limit: 20
            };
            const result = await getProducts(params);
            if (result.success) {
                setProducts(result.data);
            }
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Refetch when search or category changes, with debounce for search
    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (searchQuery || selectedCategory) {
                fetchProductsList();
            } else {
                setProducts([]); // Clear products if returning to home view
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchQuery, selectedCategory]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchData();
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    if (authLoading || !user) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-white`}>
                <ActivityIndicator size="large" color="#F59E0B" />
            </View>
        );
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`} edges={['right', 'top', 'left']}>
            <StatusBar style="dark" />

            {/* Top Bar */}
            <View style={tw`flex-row justify-between items-center px-4 py-3 bg-white`}>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                    <Text style={tw`text-gray-500 text-xs`}>Xin chào,</Text>
                    <Text style={tw`text-gray-900 font-bold text-lg`}>{user.fullName || user.username}</Text>
                </TouchableOpacity>
                <View style={tw`flex-row gap-3`}>
                    <TouchableOpacity style={tw`relative bg-gray-100 p-2 rounded-full`}>
                        <Ionicons name="notifications-outline" size={22} color="#374151" />
                        <View style={tw`absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white`} />
                    </TouchableOpacity>
                    <TouchableOpacity style={tw`relative bg-gray-100 p-2 rounded-full`}>
                        <Ionicons name="cart-outline" size={22} color="#374151" />
                        <Badge size={16} style={tw`absolute -top-1 -right-1 bg-red-500 text-white font-bold`}>3</Badge>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Bar */}
            <View style={tw`px-4 pb-4 bg-white shadow-sm z-10`}>
                <View style={tw`flex-row items-center bg-gray-100 rounded-xl px-3 h-11 border border-gray-200`}>
                    <Ionicons name="search" size={20} color="#9CA3AF" />
                    <TextInput
                        placeholder="Bạn đang tìm món ngon gì?"
                        style={tw`flex-1 ml-2 text-gray-700 h-full`}
                        placeholderTextColor="#9CA3AF"
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        returnKeyType="search"
                    />
                    {searchQuery.length > 0 && (
                        <TouchableOpacity onPress={() => setSearchQuery('')}>
                            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={tw`pb-24`}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Hero Banner - Only show if no search/filter active to reduce clutter? Or keep it? Keeping it for now. */}
                <View style={tw`px-4 mt-4`}>
                    <View style={tw`rounded-2xl overflow-hidden h-48 relative shadow-md`}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2000&auto=format&fit=crop' }}
                            style={tw`w-full h-full`}
                            resizeMode="cover"
                        />
                        <View style={tw`absolute inset-0 bg-black/30`} />
                        <View style={tw`absolute bottom-4 left-4 right-4`}>
                            <Text style={tw`text-white text-xs font-bold uppercase tracking-wider mb-1 bg-orange-500 self-start px-2 py-0.5 rounded-md`}>Khuyến mãi</Text>
                            <Text style={tw`text-white text-2xl font-bold mb-2`}>Mâm Cỗ Tết Việt</Text>
                            <TouchableOpacity style={tw`bg-white self-start px-4 py-2 rounded-full`}>
                                <Text style={tw`text-gray-900 font-bold text-xs`}>Mua ngay</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>


                {/* Categories */}
                <CategoryList
                    selectedCategory={selectedCategory}
                    onSelectCategory={setSelectedCategory}
                />

                {/* Conditional Rendering: If Search or Filter, show Results. Else show structured Home sections */}
                {(searchQuery || selectedCategory) ? (
                    <View style={tw`mt-6 px-4`}>
                        <View style={tw`flex-row justify-between items-center mb-4`}>
                            <Text style={tw`text-lg font-bold text-gray-900`}>
                                {searchQuery ? `Kết quả tìm kiếm: "${searchQuery}"` : `Danh mục: ${selectedCategory}`}
                            </Text>
                        </View>

                        {loadingProducts ? (
                            <View style={tw`h-40 justify-center items-center`}>
                                <ActivityIndicator color="#F59E0B" />
                            </View>
                        ) : products.length === 0 ? (
                            <View style={tw`h-40 justify-center items-center`}>
                                <Ionicons name="search-outline" size={48} color="#D1D5DB" />
                                <Text style={tw`text-gray-400 mt-2`}>Không tìm thấy sản phẩm nào</Text>
                            </View>
                        ) : (
                            <View style={tw`flex-row flex-wrap justify-between`}>
                                {products.map((product) => (
                                    <TouchableOpacity
                                        key={product.id}
                                        style={tw`w-[48%] bg-white rounded-xl mb-4 shadow-sm border border-gray-100 overflow-hidden`}
                                        onPress={() => navigation.navigate('ProductDetail', { productId: product.id })}
                                    >
                                        <View style={tw`h-36 relative`}>
                                            <Image
                                                source={{ uri: product.imageUrl || 'https://via.placeholder.com/150' }}
                                                style={tw`w-full h-full`}
                                                resizeMode="cover"
                                            />
                                            <View style={tw`absolute top-2 right-2 bg-white/90 px-1.5 py-0.5 rounded-md flex-row items-center`}>
                                                <Ionicons name="star" size={10} color="#F59E0B" />
                                                <Text style={tw`text-[10px] font-bold ml-1`}>{product.rating || '5.0'}</Text>
                                            </View>
                                        </View>
                                        <View style={tw`p-3`}>
                                            <Text style={tw`font-semibold text-gray-800 text-sm mb-1 h-10`} numberOfLines={2}>{product.name}</Text>
                                            <View style={tw`flex-row justify-between items-center mt-1`}>
                                                <Text style={tw`font-bold text-orange-600 text-xs`}>{formatCurrency(product.price)}</Text>
                                                <TouchableOpacity style={tw`bg-orange-100 p-1.5 rounded-full`}>
                                                    <Ionicons name="add" size={16} color="#D97706" />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}
                    </View>
                ) : (
                    <>
                        <BestSellerList />
                        <DiscountProductList />
                    </>
                )}

            </ScrollView>

            {/* Floating Logout for debugging/demo */}
            <TouchableOpacity
                onPress={() => dispatch(logoutUser()) && navigation.replace('Login')}
                style={tw`absolute bottom-6 right-6 bg-gray-900/80 p-3 rounded-full shadow-lg`}
            >
                <Ionicons name="log-out-outline" size={24} color="white" />
            </TouchableOpacity>

        </SafeAreaView>
    );
};

export default HomeScreen;
