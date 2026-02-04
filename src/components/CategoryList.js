import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import tw from 'twrnc';
import { getProductCategories } from '../services/productService';
import { Ionicons } from '@expo/vector-icons';

const CategoryList = ({ selectedCategory, onSelectCategory }) => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const cats = await getProductCategories();
                // Map to objects if they are strings
                const formattedCats = cats.map((name, index) => ({
                    id: index,
                    name: name,
                    // Placeholder icon for now
                    icon: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop'
                }));
                setCategories(formattedCats);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <View style={tw`mt-6`}>
            <View style={tw`flex-row justify-between items-center px-4 mb-3`}>
                <Text style={tw`text-lg font-bold text-gray-900`}>Danh mục</Text>
                {selectedCategory && (
                    <TouchableOpacity onPress={() => onSelectCategory(null)}>
                        <Text style={tw`text-orange-600 font-semibold text-xs`}>Xóa lọc</Text>
                    </TouchableOpacity>
                )}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={tw`px-4`}>
                <TouchableOpacity
                    style={tw`mr-4 items-center`}
                    onPress={() => onSelectCategory(null)}
                >
                    <View style={tw`w-16 h-16 rounded-full ${selectedCategory === null ? 'bg-orange-100 border-orange-500 border-2' : 'bg-white border-gray-100 border'} p-1 justify-center items-center shadow-sm mb-2`}>
                        <Ionicons name="grid-outline" size={24} color={selectedCategory === null ? '#EA580C' : '#6B7280'} />
                    </View>
                    <Text style={tw`text-xs font-medium ${selectedCategory === null ? 'text-orange-600 font-bold' : 'text-gray-700'}`}>Tất cả</Text>
                </TouchableOpacity>

                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat.id || cat.name}
                        style={tw`mr-4 items-center`}
                        onPress={() => onSelectCategory(cat.name === selectedCategory ? null : cat.name)}
                    >
                        <View style={tw`w-16 h-16 rounded-full ${selectedCategory === cat.name ? 'border-orange-500 border-2' : 'border-gray-100 border'} bg-white p-1 shadow-sm mb-2`}>
                            <Image source={{ uri: cat.icon }} style={tw`w-full h-full rounded-full`} />
                        </View>
                        <Text style={tw`text-xs font-medium ${selectedCategory === cat.name ? 'text-orange-600 font-bold' : 'text-gray-700'}`}>{cat.name}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export default CategoryList;
