import React, { useEffect, useState } from 'react';
import { View, ScrollView, TouchableOpacity, Image, Dimensions, FlatList, TextInput } from 'react-native';
import { Text, Avatar, ActivityIndicator, Badge, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, logoutUser } from '../store/slices/authSlice';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { user, loading, isAuthenticated } = useSelector((state) => state.auth);
    const [searchQuery, setSearchQuery] = useState('');

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

    if (loading || !user) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-white`}>
                <ActivityIndicator size="large" color="#F59E0B" />
            </View>
        );
    }

    const categories = [
        { id: 1, name: 'Lạp xưởng', icon: 'https://images.unsplash.com/photo-1593504049359-74330189a345?w=200&h=200&fit=crop' },
        { id: 2, name: 'Giò chả', icon: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=200&h=200&fit=crop' },
        { id: 3, name: 'Khô gà', icon: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=200&h=200&fit=crop' },
        { id: 4, name: 'Quà Tết', icon: 'https://images.unsplash.com/photo-1612151855475-877969f4a6cc?w=200&h=200&fit=crop' },
        { id: 5, name: 'Bánh Tét', icon: 'https://images.unsplash.com/photo-1644314264292-1dc3e561a06e?w=200&h=200&fit=crop' },
    ];

    const products = [
        { id: 1, name: 'Lạp xưởng Mai Quế Lộ', price: '250.000đ', rating: 4.8, image: 'https://images.unsplash.com/photo-1593504049359-74330189a345?w=500' },
        { id: 2, name: 'Giò lụa thượng hạng', price: '180.000đ', rating: 4.5, image: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=500' },
        { id: 3, name: 'Set quà Tết An Khang', price: '850.000đ', rating: 5.0, image: 'https://images.unsplash.com/photo-1612151855475-877969f4a6cc?w=500' },
        { id: 4, name: 'Khô bò 1 nắng', price: '550.000đ', rating: 4.7, image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?w=500' },
    ];

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
                    />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-24`}>
                {/* Hero Banner */}
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
                <View style={tw`mt-6`}>
                    <Text style={tw`px-4 text-lg font-bold text-gray-900 mb-3`}>Danh mục</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`px-4`}>
                        {categories.map((cat) => (
                            <TouchableOpacity key={cat.id} style={tw`mr-4 items-center`}>
                                <View style={tw`w-16 h-16 rounded-full bg-white p-1 border border-gray-100 shadow-sm mb-2`}>
                                    <Image source={{ uri: cat.icon }} style={tw`w-full h-full rounded-full`} />
                                </View>
                                <Text style={tw`text-xs font-medium text-gray-700`}>{cat.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>

                {/* Popular Products */}
                <View style={tw`mt-6 px-4`}>
                    <View style={tw`flex-row justify-between items-center mb-4`}>
                        <Text style={tw`text-lg font-bold text-gray-900`}>Bán chạy nhất</Text>
                        <TouchableOpacity>
                            <Text style={tw`text-orange-600 font-semibold text-sm`}>Xem tất cả</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={tw`flex-row flex-wrap justify-between`}>
                        {products.map((product) => (
                            <TouchableOpacity key={product.id} style={tw`w-[48%] bg-white rounded-xl mb-4 shadow-sm border border-gray-100 overflow-hidden`}>
                                <View style={tw`h-36 relative`}>
                                    <Image source={{ uri: product.image }} style={tw`w-full h-full`} resizeMode="cover" />
                                    <View style={tw`absolute top-2 right-2 bg-white/90 px-1.5 py-0.5 rounded-md flex-row items-center`}>
                                        <Ionicons name="star" size={10} color="#F59E0B" />
                                        <Text style={tw`text-[10px] font-bold ml-1`}>{product.rating}</Text>
                                    </View>
                                </View>
                                <View style={tw`p-3`}>
                                    <Text style={tw`font-semibold text-gray-800 text-sm mb-1 h-10`} numberOfLines={2}>{product.name}</Text>
                                    <View style={tw`flex-row justify-between items-center mt-1`}>
                                        <Text style={tw`font-bold text-orange-600`}>{product.price}</Text>
                                        <TouchableOpacity style={tw`bg-orange-100 p-1.5 rounded-full`}>
                                            <Ionicons name="add" size={16} color="#D97706" />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

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
