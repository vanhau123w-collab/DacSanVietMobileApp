import React, { useEffect, useState } from 'react';
import { View, Image, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';
import { getProductById } from '../services/productService';

const { width, height } = Dimensions.get('window');

const ProductDetailScreen = ({ route, navigation }) => {
    const { productId } = route.params;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const result = await getProductById(productId);
                if (result.success) {
                    setProduct(result.data);
                }
            } catch (error) {
                console.error('Error fetching product detail:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetail();
    }, [productId]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const handleQuantityChange = (type) => {
        if (type === 'increase') {
            setQuantity(prev => prev + 1);
        } else {
            if (quantity > 1) {
                setQuantity(prev => prev - 1);
            }
        }
    };

    if (loading) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-white`}>
                <ActivityIndicator size="large" color="#F59E0B" />
            </View>
        );
    }

    if (!product) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-white`}>
                <Text>Không tìm thấy sản phẩm</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mt-4 bg-orange-500 px-4 py-2 rounded-full`}>
                    <Text style={tw`text-white font-bold`}>Quay lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={tw`flex-1 bg-white`}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-32`}>
                {/* Product Image */}
                <View style={tw`relative w-full h-[${height * 0.45}px]`}>
                    <Image
                        source={{ uri: product.imageUrl || 'https://via.placeholder.com/400' }}
                        style={tw`w-full h-full`}
                        resizeMode="cover"
                    />

                    {/* Header Actions */}
                    <View style={tw`absolute top-0 left-0 right-0 flex-row justify-between items-center px-4 pt-12`}>
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            style={tw`w-10 h-10 bg-white/50 backdrop-blur-md rounded-full justify-center items-center`}
                        >
                            <Ionicons name="arrow-back" size={24} color="#000" />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={tw`w-10 h-10 bg-white/50 backdrop-blur-md rounded-full justify-center items-center`}
                        >
                            <Ionicons name="cart-outline" size={24} color="#000" />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Content */}
                <View style={tw`bg-white -mt-8 rounded-t-3xl px-6 pt-8 pb-4 border-b border-gray-100`}>
                    <View style={tw`flex-row justify-between items-start mb-2`}>
                        <View style={tw`flex-1 mr-4`}>
                            <Text style={tw`text-gray-500 text-xs font-bold uppercase tracking-wider mb-1`}>{product.category}</Text>
                            <Text style={tw`text-2xl font-bold text-gray-900 leading-8`}>{product.name}</Text>
                        </View>
                        <View style={tw`flex-row items-center bg-orange-50 px-2 py-1 rounded-lg`}>
                            <Ionicons name="star" size={16} color="#F59E0B" />
                            <Text style={tw`ml-1 text-orange-700 font-bold`}>{product.rating || 5.0}</Text>
                        </View>
                    </View>

                    <Text style={tw`text-3xl font-bold text-orange-600 mt-2`}>
                        {formatCurrency(product.price)}
                    </Text>

                    <View style={tw`flex-row items-center mt-6 mb-6 p-4 bg-gray-50 rounded-2xl`}>
                        <Image
                            source={{ uri: 'https://img.icons8.com/fluency/48/delivery.png' }}
                            style={tw`w-10 h-10 mr-4`}
                        />
                        <View>
                            <Text style={tw`font-bold text-gray-800`}>Giao hàng miễn phí</Text>
                            <Text style={tw`text-gray-500 text-xs`}>Cho đơn hàng trên 500k</Text>
                        </View>
                    </View>

                    <Text style={tw`text-lg font-bold text-gray-900 mb-2`}>Mô tả sản phẩm</Text>
                    <Text style={tw`text-gray-600 leading-6 text-sm`}>
                        {product.description || 'Chưa có mô tả cho sản phẩm này. Hãy thưởng thức hương vị đặc biệt của đặc sản ba miền Việt Nam.'}
                    </Text>
                </View>
            </ScrollView>

            {/* Bottom Action Bar */}
            <View style={tw`absolute bottom-0 left-0 right-0 bg-white px-6 pt-4 pb-8 border-t border-gray-100 flex-row items-center shadow-lg`}>
                <View style={tw`flex-row items-center bg-gray-100 rounded-full px-4 py-2 mr-4`}>
                    <TouchableOpacity onPress={() => handleQuantityChange('decrease')} style={tw`p-1`}>
                        <Ionicons name="remove" size={20} color="#374151" />
                    </TouchableOpacity>
                    <Text style={tw`mx-4 font-bold text-lg text-gray-900`}>{quantity}</Text>
                    <TouchableOpacity onPress={() => handleQuantityChange('increase')} style={tw`p-1`}>
                        <Ionicons name="add" size={20} color="#374151" />
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={tw`flex-1 bg-orange-600 rounded-full py-4 justify-center items-center shadow-md`}>
                    <Text style={tw`text-white font-bold text-lg`}>Thêm vào giỏ</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ProductDetailScreen;
