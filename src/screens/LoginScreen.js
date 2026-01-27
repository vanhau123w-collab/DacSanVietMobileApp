import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, clearError } from '../store/slices/authSlice';
import tw from 'twrnc';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = ({ navigation }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // Internal simple validation state
    const [localErrors, setLocalErrors] = useState({});

    const dispatch = useDispatch();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            navigation.replace('Home');
        }
    }, [isAuthenticated, navigation]);

    useEffect(() => {
        if (error) {
            const errorMsg = typeof error === 'string' ? error : (error.message || 'Đăng nhập thất bại');
            alert(errorMsg);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleLogin = () => {
        let isValid = true;
        let newErrors = {};

        if (!username.trim()) {
            newErrors.username = 'Vui lòng nhập tên đăng nhập hoặc email';
            isValid = false;
        }
        if (!password) {
            newErrors.password = 'Vui lòng nhập mật khẩu';
            isValid = false;
        }

        if (!isValid) {
            setLocalErrors(newErrors);
            return;
        }

        setLocalErrors({});
        dispatch(loginUser({ username: username.trim(), password }));
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <StatusBar style="dark" />
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={tw`flex-1`}
            >
                <ScrollView contentContainerStyle={tw`flex-grow justify-center px-6`}>

                    {/* Header Section */}
                    <View style={tw`items-center mb-10`}>
                        <View style={tw`bg-blue-50 p-4 rounded-full mb-4`}>
                            <Ionicons name="lock-closed" size={32} color="#2563EB" />
                        </View>
                        <Text style={tw`text-3xl font-bold text-gray-900`}>Chào mừng trở lại</Text>
                        <Text style={tw`text-gray-500 mt-2 text-center`}>
                            Đăng nhập để tiếp tục
                        </Text>
                    </View>

                    {/* Form Section */}
                    <View style={tw`w-full`}>
                        <View style={tw`mb-2`}>
                            <TextInput
                                label="Tên đăng nhập / Email"
                                value={username}
                                onChangeText={(text) => {
                                    setUsername(text);
                                    if (localErrors.username) setLocalErrors({ ...localErrors, username: null });
                                }}
                                mode="outlined"
                                style={tw`bg-white`}
                                activeOutlineColor="#2563EB"
                                left={<TextInput.Icon icon="account" color="#6B7280" />}
                                autoCapitalize="none"
                                error={!!localErrors.username}
                            />
                            {localErrors.username && <HelperText type="error" visible={true}>{localErrors.username}</HelperText>}
                        </View>

                        <View style={tw`mb-2`}>
                            <TextInput
                                label="Mật khẩu"
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    if (localErrors.password) setLocalErrors({ ...localErrors, password: null });
                                }}
                                mode="outlined"
                                style={tw`bg-white`}
                                activeOutlineColor="#2563EB"
                                secureTextEntry={!showPassword}
                                left={<TextInput.Icon icon="lock" color="#6B7280" />}
                                error={!!localErrors.password}
                                right={
                                    <TextInput.Icon
                                        icon={showPassword ? "eye-off" : "eye"}
                                        onPress={() => setShowPassword(!showPassword)}
                                        color="#6B7280"
                                    />
                                }
                            />
                            {localErrors.password && <HelperText type="error" visible={true}>{localErrors.password}</HelperText>}
                        </View>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('ForgotPassword')}
                            style={tw`self-end mb-6`}
                        >
                            <Text style={tw`text-blue-600 font-medium`}>Quên mật khẩu?</Text>
                        </TouchableOpacity>

                        <Button
                            mode="contained"
                            onPress={handleLogin}
                            loading={loading}
                            disabled={loading}
                            buttonColor="#2563EB"
                            contentStyle={tw`h-12`}
                            labelStyle={tw`text-lg font-bold`}
                            style={tw`rounded-xl shadow-lg`}
                        >
                            {loading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
                        </Button>
                    </View>

                    {/* Footer Section */}
                    <View style={tw`flex-row justify-center mt-8`}>
                        <Text style={tw`text-gray-500`}>Chưa có tài khoản? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text style={tw`text-blue-600 font-bold`}>Đăng ký ngay</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default LoginScreen;
