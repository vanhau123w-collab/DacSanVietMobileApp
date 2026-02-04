import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import { getProducts } from '../services/productService';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const BestSellerList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        fetchBestSellers();
    }, []);

    const fetchBestSellers = async () => {
        try {
            setLoading(true);
            // Assuming API supports sort='best_selling' and limit
            const response = await getProducts({ limit: 10, sort: 'best_selling' });
            if (response.success) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error('Error fetching best sellers:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    if (loading) {
        return (
            <View style={tw`h-48 justify-center items-center`}>
                <ActivityIndicator color="#F59E0B" />
            </View>
        );
    }

    if (products.length === 0) return null;

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={tw`w-40 mr-4 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden`}
            onPress={() => navigation.navigate('ProductDetail', { productId: item.id })}
        >
            <View style={tw`h-32 relative`}>
                <Image
                    source={{ uri: item.imageUrl || 'https://via.placeholder.com/150' }}
                    style={tw`w-full h-full`}
                    resizeMode="cover"
                />
                <View style={tw`absolute top-2 left-2 bg-red-500 px-2 py-0.5 rounded-md`}>
                    <Text style={tw`text-[10px] text-white font-bold`}>HOT</Text>
                </View>
                <View style={tw`absolute top-2 right-2 bg-white/90 px-1.5 py-0.5 rounded-md flex-row items-center`}>
                    <Ionicons name="star" size={10} color="#F59E0B" />
                    <Text style={tw`text-[10px] font-bold ml-1`}>{item.rating || '5.0'}</Text>
                </View>
            </View>
            <View style={tw`p-2`}>
                <Text style={tw`font-semibold text-gray-800 text-xs mb-1 h-8`} numberOfLines={2}>{item.name}</Text>
                <Text style={tw`font-bold text-orange-600 text-sm`}>{formatCurrency(item.price)}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={tw`mt-6`}>
            <View style={tw`flex-row justify-between items-center px-4 mb-3`}>
                <Text style={tw`text-lg font-bold text-gray-900`}>Bán chạy nhất 🔥</Text>
            </View>
            <FlatList
                horizontal
                data={products}
                renderItem={renderItem}
                keyExtractor={(item) => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={tw`pl-4 pr-2`} // Padding right handles via item margin
            />
        </View>
    );
};

export default BestSellerList;
