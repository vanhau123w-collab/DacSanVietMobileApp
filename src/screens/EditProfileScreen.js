import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
import { updateUserProfile, uploadUserAvatar, clearError, sendPhoneOtp } from '../store/slices/authSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BASE_URL } from '../services/apiClient';

const EditProfileScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { user, loading, error } = useSelector((state) => state.auth);

    const [fullName, setFullName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    useEffect(() => {
        if (user) {
            setFullName(user.fullName || '');
            setPhoneNumber(user.phoneNumber || '');
        }
    }, [user]);

    useEffect(() => {
        if (error) {
            Alert.alert('Error', error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleAvatarPick = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Cần quyền truy cập thư viện ảnh!");
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            // Upload immediately
            dispatch(uploadUserAvatar(result.assets[0].uri))
                .unwrap()
                .then(() => {
                    if (Platform.OS === 'web') alert('Cập nhật avatar thành công');
                    else Alert.alert('Thành công', 'Cập nhật avatar thành công');
                })
                .catch((err) => {
                    // Error handled in useEffect
                });
        }
    };

    const handleUpdate = () => {
        if (!fullName.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập họ tên');
            return;
        }

        const isPhoneChanged = phoneNumber !== (user.phoneNumber || '');
        const isNameChanged = fullName !== (user.fullName || '');

        if (!isPhoneChanged && !isNameChanged) {
            navigation.goBack();
            return;
        }

        // If phone changed, prioritize Phone OTP flow
        if (isPhoneChanged) {
            dispatch(sendPhoneOtp(phoneNumber))
                .unwrap()
                .then((response) => {
                    // Capture otpToken from response
                    console.log('Phone OTP Full Response:', JSON.stringify(response, null, 2));
                    const otpToken = response?.data?.data?.otpToken || response?.data?.otpToken || response?.otpToken;
                    console.log('Phone OTP Token received:', otpToken);

                    if (!otpToken) {
                        Alert.alert('Error', 'Server did not return OTP token. Please try again.');
                        return;
                    }

                    // Navigate to OTP Screen
                    if (isNameChanged) {
                        dispatch(updateUserProfile({ fullName }))
                            .unwrap()
                            .then(() => {
                                navigation.navigate('OtpVerify', {
                                    type: 'UPDATE_PHONE',
                                    email: user.email,
                                    phoneNumber: phoneNumber,
                                    username: user.username,
                                    otpToken: otpToken
                                });
                            })
                            .catch((err) => {
                                // Name update failed
                            });
                    } else {
                        navigation.navigate('OtpVerify', {
                            type: 'UPDATE_PHONE',
                            email: user.email,
                            phoneNumber: phoneNumber,
                            username: user.username,
                            otpToken: otpToken
                        });
                    }
                })
                .catch((err) => {
                    // Send OTP error handled in useEffect/slice
                    Alert.alert('Error', err || 'Failed to send OTP');
                });
            return;
        }

        // Only name changed
        if (isNameChanged) {
            dispatch(updateUserProfile({ fullName }))
                .unwrap()
                .then(() => {
                    if (Platform.OS === 'web') {
                        alert('Cập nhật hồ sơ thành công');
                        navigation.goBack();
                    } else {
                        Alert.alert('Thành công', 'Cập nhật hồ sơ thành công', [
                            { text: 'OK', onPress: () => navigation.goBack() }
                        ]);
                    }
                })
                .catch((err) => {
                    // Error is handled in useEffect
                });
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <View style={tw`p-6`}>
                <View style={tw`flex-row items-center mb-6`}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2 -ml-2`}>
                        <Text style={tw`text-2xl text-gray-800`}>←</Text>
                    </TouchableOpacity>
                    <Text style={tw`text-2xl font-bold text-gray-800 ml-2`}>Chỉnh sửa hồ sơ</Text>
                </View>

                <View style={tw`items-center mb-6`}>
                    <TouchableOpacity onPress={handleAvatarPick} style={tw`relative`}>
                        <View style={tw`w-24 h-24 bg-gray-100 rounded-full justify-center items-center overflow-hidden border border-gray-200`}>
                            {user?.avatarUrl ? (
                                <Image
                                    source={{
                                        uri: user.avatarUrl.startsWith('http')
                                            ? user.avatarUrl
                                            : `${BASE_URL.endsWith('/') ? BASE_URL.slice(0, -1) : BASE_URL}${user.avatarUrl.startsWith('/') ? '' : '/'}${user.avatarUrl}`
                                    }}
                                    style={tw`w-full h-full`}
                                />
                            ) : (
                                <Text style={tw`text-3xl font-bold text-gray-400`}>
                                    {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
                                </Text>
                            )}
                        </View>
                        <View style={tw`absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full border-2 border-white`}>
                            <Text style={tw`text-white text-xs font-bold`}>📷</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={tw`text-blue-600 mt-2 font-medium`}>Đổi ảnh đại diện</Text>
                </View>

                <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-600 mb-2 font-medium`}>Họ và tên</Text>
                    <TextInput
                        style={tw`w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800`}
                        value={fullName}
                        onChangeText={setFullName}
                        placeholder="Nhập họ tên của bạn"
                        placeholderTextColor="#9CA3AF"
                    />
                </View>

                <View style={tw`mb-6`}>
                    <Text style={tw`text-gray-600 mb-2 font-medium`}>Số điện thoại</Text>
                    <TextInput
                        style={tw`w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800`}
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholder="Nhập số điện thoại"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="phone-pad"
                    />
                </View>

                <TouchableOpacity
                    style={tw`w-full bg-blue-600 rounded-xl py-4 items-center shadow-md ${loading ? 'opacity-70' : ''}`}
                    onPress={handleUpdate}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={tw`text-white font-bold text-lg`}>Lưu thay đổi</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default EditProfileScreen;
