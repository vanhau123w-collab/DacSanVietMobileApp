import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import { getProducts } from '../services/productService';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const DiscountProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        fetchDiscountProducts();
    }, []);

    const fetchDiscountProducts = async () => {
        try {
            setLoading(true);
            // Assuming API supports sort='discount_desc' and limit
            const response = await getProducts({ limit: 20, sort: 'discount_desc' });
            if (response.success) {
                setProducts(response.data);
            }
        } catch (error) {
            console.error('Error fetching discount products:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    if (loading) {
        return (
            <View style={tw`h-40 justify-center items-center`}>
                <ActivityIndicator color="#F59E0B" />
            </View>
        );
    }

    if (products.length === 0) return null;

    return (
        <View style={tw`mt-6 px-4`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
                <Text style={tw`text-lg font-bold text-gray-900`}>Siêu giảm giá 🏷️</Text>
                <TouchableOpacity>
                    <Text style={tw`text-orange-600 font-semibold text-sm`}>Xem tất cả</Text>
                </TouchableOpacity>
            </View>

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
                            {/* Assuming product has discount info, mocked if not present in basic product object */}
                            <View style={tw`absolute top-2 left-2 bg-orange-500 px-2 py-0.5 rounded-md`}>
                                <Text style={tw`text-[10px] text-white font-bold`}>-{product.discount || '10'}%</Text>
                            </View>
                            <View style={tw`absolute top-2 right-2 bg-white/90 px-1.5 py-0.5 rounded-md flex-row items-center`}>
                                <Ionicons name="star" size={10} color="#F59E0B" />
                                <Text style={tw`text-[10px] font-bold ml-1`}>{product.rating || '5.0'}</Text>
                            </View>
                        </View>
                        <View style={tw`p-3`}>
                            <Text style={tw`font-semibold text-gray-800 text-sm mb-1 h-10`} numberOfLines={2}>{product.name}</Text>
                            <View style={tw`flex-row justify-between items-center mt-1`}>
                                <View>
                                    <Text style={tw`font-bold text-orange-600 text-xs`}>{formatCurrency(product.price)}</Text>
                                    <Text style={tw`text-[10px] text-gray-400 line-through`}>{formatCurrency(product.price * 1.1)}</Text>
                                </View>
                                <TouchableOpacity style={tw`bg-orange-100 p-1.5 rounded-full`}>
                                    <Ionicons name="add" size={16} color="#D97706" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

export default DiscountProductList;
