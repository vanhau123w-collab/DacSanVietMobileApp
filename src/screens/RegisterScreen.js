import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Button, HelperText } from 'react-native-paper';
import tw from 'twrnc';
import { register } from '../services/authService';
import { Ionicons } from '@expo/vector-icons';
import { validateEmail, validateUsername, validatePassword, validateFullName } from '../utils/validation';

const RegisterScreen = ({ navigation }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('USER');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Error state
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        let newErrors = {};
        let isValid = true;

        if (!validateFullName(fullName.trim())) {
            newErrors.fullName = 'Họ và tên phải có ít nhất 2 ký tự';
            isValid = false;
        }

        if (!validateEmail(email.trim())) {
            newErrors.email = 'Email không hợp lệ';
            isValid = false;
        }

        if (!validateUsername(username.trim())) {
            newErrors.username = 'Tên đăng nhập tối thiểu 3 ký tự, chỉ chứa chữ, số và _';
            isValid = false;
        }

        if (!validatePassword(password)) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleRegister = async () => {
        if (!validateForm()) {
            return;
        }

        setLoading(true);
        // Clear previous server errors
        setErrors({});

        try {
            const response = await register(email, username, password, fullName);

            // Assuming response structure checking as per previous conversation and Auth Service
            if (response && (response.success || response.isSuccess || response.status === 'success' || !response.error)) {
                alert('Đăng ký thành công! Vui lòng kiểm tra email để lấy OTP.');
                navigation.navigate('OtpVerify', {
                    email,
                    username,
                    password,
                    fullName,
                    role
                });
            } else {
                // Fallback if not caught by catch block but has error status
                alert(response.message || 'Đăng ký thất bại');
            }
        } catch (error) {
            console.log('Register Error:', error);
            if (error.errors && Array.isArray(error.errors)) {
                // Map backend errors to field errors
                const serverErrors = {};
                error.errors.forEach(err => {
                    // Backend returns field like "email", "username"
                    if (err.field) {
                        serverErrors[err.field] = err.message;
                    }
                });
                setErrors(serverErrors);
            } else {
                alert(error.message || 'Có lỗi xảy ra, vui lòng thử lại');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={tw`flex-1`}
            >
                <ScrollView contentContainerStyle={tw`flex-grow px-6 py-6`}>

                    <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mb-6`}>
                        <Ionicons name="arrow-back" size={24} color="#1F2937" />
                    </TouchableOpacity>

                    <View style={tw`mb-8`}>
                        <Text style={tw`text-3xl font-bold text-gray-900`}>Tạo tài khoản</Text>
                        <Text style={tw`text-gray-500 mt-2`}>Tham gia ngay hôm nay!</Text>
                    </View>

                    <View style={tw`mb-6`}>
                        <View style={tw`mb-2`}>
                            <TextInput
                                label="Họ và tên"
                                value={fullName}
                                onChangeText={(text) => {
                                    setFullName(text);
                                    if (errors.fullName) setErrors({ ...errors, fullName: null });
                                }}
                                mode="outlined"
                                style={tw`bg-white`}
                                activeOutlineColor="#2563EB"
                                error={!!errors.fullName}
                                left={<TextInput.Icon icon="account-outline" color="#6B7280" />}
                            />
                            {errors.fullName && <HelperText type="error" visible={true}>{errors.fullName}</HelperText>}
                        </View>

                        <View style={tw`mb-2`}>
                            <TextInput
                                label="Email"
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    if (errors.email) setErrors({ ...errors, email: null });
                                }}
                                mode="outlined"
                                style={tw`bg-white`}
                                activeOutlineColor="#2563EB"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                error={!!errors.email}
                                left={<TextInput.Icon icon="email-outline" color="#6B7280" />}
                            />
                            {errors.email && <HelperText type="error" visible={true}>{errors.email}</HelperText>}
                        </View>

                        <View style={tw`mb-2`}>
                            <TextInput
                                label="Tên đăng nhập"
                                value={username}
                                onChangeText={(text) => {
                                    setUsername(text);
                                    if (errors.username) setErrors({ ...errors, username: null });
                                }}
                                mode="outlined"
                                style={tw`bg-white`}
                                activeOutlineColor="#2563EB"
                                autoCapitalize="none"
                                error={!!errors.username}
                                left={<TextInput.Icon icon="account" color="#6B7280" />}
                            />
                            {errors.username && <HelperText type="error" visible={true}>{errors.username}</HelperText>}
                        </View>

                        <View style={tw`mb-4`}>
                            <TextInput
                                label="Mật khẩu"
                                value={password}
                                onChangeText={(text) => {
                                    setPassword(text);
                                    if (errors.password) setErrors({ ...errors, password: null });
                                }}
                                mode="outlined"
                                style={tw`bg-white`}
                                activeOutlineColor="#2563EB"
                                secureTextEntry={!showPassword}
                                error={!!errors.password}
                                left={<TextInput.Icon icon="lock-outline" color="#6B7280" />}
                                right={
                                    <TextInput.Icon
                                        icon={showPassword ? "eye-off" : "eye"}
                                        onPress={() => setShowPassword(!showPassword)}
                                        color="#6B7280"
                                    />
                                }
                            />
                            {errors.password && <HelperText type="error" visible={true}>{errors.password}</HelperText>}
                        </View>

                        <Text style={tw`text-gray-700 font-medium mb-3`}>Loại tài khoản:</Text>
                        <View style={tw`flex-row justify-between mb-8`}>
                            <TouchableOpacity
                                onPress={() => setRole('USER')}
                                style={tw`flex-1 p-4 rounded-xl border-2 mr-2 items-center ${role === 'USER' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}
                            >
                                <Ionicons name="person" size={24} color={role === 'USER' ? "#2563EB" : "#9CA3AF"} style={tw`mb-2`} />
                                <Text style={tw`font-bold ${role === 'USER' ? 'text-blue-600' : 'text-gray-500'}`}>User</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setRole('ADMIN')}
                                style={tw`flex-1 p-4 rounded-xl border-2 ml-2 items-center ${role === 'ADMIN' ? 'border-blue-600 bg-blue-50' : 'border-gray-200 bg-white'}`}
                            >
                                <Ionicons name="shield-checkmark" size={24} color={role === 'ADMIN' ? "#2563EB" : "#9CA3AF"} style={tw`mb-2`} />
                                <Text style={tw`font-bold ${role === 'ADMIN' ? 'text-blue-600' : 'text-gray-500'}`}>Admin</Text>
                            </TouchableOpacity>
                        </View>

                        <Button
                            mode="contained"
                            onPress={handleRegister}
                            loading={loading}
                            disabled={loading}
                            buttonColor="#2563EB"
                            contentStyle={tw`h-12`}
                            labelStyle={tw`text-lg font-bold`}
                            style={tw`rounded-xl shadow-lg`}
                        >
                            {loading ? 'Đang xử lý...' : 'ĐĂNG KÝ'}
                        </Button>
                    </View>

                    <View style={tw`flex-row justify-center pb-8`}>
                        <Text style={tw`text-gray-500`}>Đã có tài khoản? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={tw`text-blue-600 font-bold`}>Đăng nhập</Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default RegisterScreen;
