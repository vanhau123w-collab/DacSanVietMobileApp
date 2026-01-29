import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
import { changeUserPassword, clearError } from '../store/slices/authSlice';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChangePasswordScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(() => {
        if (error) {
            Alert.alert('Error', error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleChangePassword = () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (newPassword !== confirmPassword) {
            Alert.alert('Lỗi', 'Mật khẩu mới không khớp');
            return;
        }

        if (newPassword.length < 6) {
            Alert.alert('Lỗi', 'Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }

        dispatch(changeUserPassword({ currentPassword, newPassword }))
            .unwrap()
            .then(() => {
                const msg = 'Đổi mật khẩu thành công';
                if (Platform.OS === 'web') {
                    alert(msg);
                    navigation.goBack();
                } else {
                    Alert.alert('Thành công', msg, [
                        { text: 'OK', onPress: () => navigation.goBack() }
                    ]);
                }
            })
            .catch((err) => {
                // Error is handled in useEffect
            });
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <View style={tw`p-6`}>
                <View style={tw`flex-row items-center mb-6`}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2 -ml-2`}>
                        <Text style={tw`text-2xl text-gray-800`}>←</Text>
                    </TouchableOpacity>
                    <Text style={tw`text-2xl font-bold text-gray-800 ml-2`}>Đổi mật khẩu</Text>
                </View>

                <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-600 mb-2 font-medium`}>Mật khẩu hiện tại</Text>
                    <TextInput
                        style={tw`w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800`}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        placeholder="Nhập mật khẩu hiện tại"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                    />
                </View>

                <View style={tw`mb-4`}>
                    <Text style={tw`text-gray-600 mb-2 font-medium`}>Mật khẩu mới</Text>
                    <TextInput
                        style={tw`w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800`}
                        value={newPassword}
                        onChangeText={setNewPassword}
                        placeholder="Nhập mật khẩu mới"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                    />
                </View>

                <View style={tw`mb-6`}>
                    <Text style={tw`text-gray-600 mb-2 font-medium`}>Xác nhận mật khẩu mới</Text>
                    <TextInput
                        style={tw`w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800`}
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        placeholder="Nhập lại mật khẩu mới"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity
                    style={tw`w-full bg-blue-600 rounded-xl py-4 items-center shadow-md ${loading ? 'opacity-70' : ''}`}
                    onPress={handleChangePassword}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={tw`text-white font-bold text-lg`}>Đổi mật khẩu</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ChangePasswordScreen;
