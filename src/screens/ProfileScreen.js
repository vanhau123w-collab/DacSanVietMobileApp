import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
import { loadUser, logoutUser, clearError } from '../store/slices/authSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../services/apiClient';

const ProfileScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { user, error } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            Alert.alert('Error', error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleLogout = () => {
        if (Platform.OS === 'web') {
            const confirmLogout = window.confirm('Bạn có chắc chắn muốn đăng xuất không?');
            if (confirmLogout) {
                dispatch(logoutUser()).then(() => {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    });
                });
            }
        } else {
            Alert.alert(
                'Đăng xuất',
                'Bạn có chắc chắn muốn đăng xuất không?',
                [
                    { text: 'Hủy', style: 'cancel' },
                    {
                        text: 'Đăng xuất',
                        style: 'destructive',
                        onPress: () => {
                            dispatch(logoutUser()).then(() => {
                                navigation.reset({
                                    index: 0,
                                    routes: [{ name: 'Login' }],
                                });
                            });
                        },
                    },
                ]
            );
        }
    };

    if (!user) {
        return (
            <SafeAreaView style={tw`flex-1 bg-white justify-center items-center`}>
                <Text style={tw`text-gray-500`}>Đang tải thông tin...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={tw`flex-1 bg-gray-50`}>
            <ScrollView contentContainerStyle={tw`p-6`}>
                <Text style={tw`text-3xl font-bold text-gray-800 mb-8`}>Hồ Sơ</Text>

                <View style={tw`bg-white p-6 rounded-2xl shadow-sm mb-6`}>
                    <View style={tw`items-center mb-6`}>
                        <View style={tw`w-24 h-24 bg-blue-100 rounded-full justify-center items-center mb-3 overflow-hidden border-2 border-white shadow-sm`}>
                            {user.avatarUrl ? (
                                <Image
                                    source={{
                                        uri: user.avatarUrl.startsWith('http')
                                            ? user.avatarUrl
                                            : `${BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL}${user.avatarUrl.startsWith('/') ? '' : '/'}${user.avatarUrl}`
                                    }}
                                    style={tw`w-full h-full`}
                                />
                            ) : (
                                <Text style={tw`text-3xl font-bold text-blue-600`}>
                                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                                </Text>
                            )}
                        </View>
                        <Text style={tw`text-xl font-bold text-gray-800`}>{user.fullName || 'No Name'}</Text>
                        <Text style={tw`text-gray-500`}>@{user.username}</Text>
                        <Text style={tw`text-gray-500 mt-1`}>{user.email}</Text>
                    </View>

                    <View style={tw`border-t border-gray-100 pt-4`}>
                        <View style={tw`flex-row justify-between py-2`}>
                            <Text style={tw`text-gray-600`}>Vai trò</Text>
                            <Text style={tw`font-semibold text-gray-800`}>{user.role || 'Người dùng'}</Text>
                        </View>
                        <View style={tw`flex-row justify-between py-2`}>
                            <Text style={tw`text-gray-600`}>Số điện thoại</Text>
                            <Text style={tw`font-semibold text-gray-800`}>{user.phoneNumber || 'Chưa cập nhật'}</Text>
                        </View>
                    </View>
                </View>

                <View style={tw`bg-white rounded-2xl shadow-sm overflow-hidden mb-6`}>
                    <TouchableOpacity
                        style={tw`p-4 border-b border-gray-100 flex-row justify-between items-center`}
                        onPress={() => navigation.navigate('EditProfile')}
                    >
                        <Text style={tw`text-gray-700 font-medium`}>Chỉnh sửa hồ sơ</Text>
                        <Text style={tw`text-gray-400`}>→</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={tw`p-4 flex-row justify-between items-center`}
                        onPress={() => navigation.navigate('ChangePassword')}
                    >
                        <Text style={tw`text-gray-700 font-medium`}>Đổi mật khẩu</Text>
                        <Text style={tw`text-gray-400`}>→</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={tw`p-4 flex-row justify-between items-center border-t border-gray-100`}
                        onPress={() => navigation.navigate('ChangeEmail')}
                    >
                        <Text style={tw`text-gray-700 font-medium`}>Đổi Email</Text>
                        <Text style={tw`text-gray-400`}>→</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity
                    style={tw`bg-red-50 p-4 rounded-xl items-center`}
                    onPress={handleLogout}
                >
                    <Text style={tw`text-red-600 font-bold`}>Đăng xuất</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

export default ProfileScreen;
