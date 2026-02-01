import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import tw from 'twrnc';
import { sendEmailOtp, verifyEmailChange, clearError } from '../store/slices/authSlice';
import { SafeAreaView } from 'react-native-safe-area-context';

const ChangeEmailScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const [step, setStep] = useState(1); // 1: Input Email, 2: Verify OTP
    const [newEmail, setNewEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [otpToken, setOtpToken] = useState(''); // Store OTP token

    useEffect(() => {
        if (error) {
            Alert.alert('Error', error);
            dispatch(clearError());
        }
    }, [error, dispatch]);

    const handleSendOtp = () => {
        if (!newEmail.trim() || !newEmail.includes('@')) {
            Alert.alert('Lỗi', 'Vui lòng nhập email hợp lệ');
            return;
        }

        dispatch(sendEmailOtp(newEmail.trim()))
            .unwrap()
            .then((response) => {
                // Capture otpToken from response
                const token = response?.data?.data?.otpToken || response?.data?.otpToken || response?.otpToken;
                console.log('Email OTP Token received:', token);
                setOtpToken(token);

                const msg = 'Mã OTP đã được gửi đến email mới của bạn';
                if (Platform.OS === 'web') alert(msg);
                else Alert.alert('Thành công', msg);
                setStep(2);
            })
            .catch(() => { });
    };

    const handleVerify = () => {
        if (!otpCode.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập mã OTP');
            return;
        }

        dispatch(verifyEmailChange({ newEmail: newEmail.trim(), otpCode: otpCode.trim(), otpToken }))
            .unwrap()
            .then(() => {
                const msg = 'Cập nhật email thành công. Vui lòng đăng nhập lại.';
                if (Platform.OS === 'web') {
                    alert(msg);
                    navigation.popToTop();
                } else {
                    Alert.alert('Thành công', msg, [
                        { text: 'OK', onPress: () => navigation.popToTop() }
                    ]);
                }
            })
            .catch(() => { });
    };

    return (
        <SafeAreaView style={tw`flex-1 bg-white`}>
            <View style={tw`p-6`}>
                <View style={tw`flex-row items-center mb-6`}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2 -ml-2`}>
                        <Text style={tw`text-2xl text-gray-800`}>←</Text>
                    </TouchableOpacity>
                    <Text style={tw`text-2xl font-bold text-gray-800 ml-2`}>Đổi Email</Text>
                </View>

                {step === 1 ? (
                    <View>
                        <Text style={tw`text-gray-600 mb-6`}>
                            Nhập địa chỉ email mới. Chúng tôi sẽ gửi mã xác thực cho bạn.
                        </Text>

                        <View style={tw`mb-6`}>
                            <Text style={tw`text-gray-600 mb-2 font-medium`}>Email mới</Text>
                            <TextInput
                                style={tw`w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800`}
                                value={newEmail}
                                onChangeText={setNewEmail}
                                placeholder="example@email.com"
                                placeholderTextColor="#9CA3AF"
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>

                        <TouchableOpacity
                            style={tw`w-full bg-blue-600 rounded-xl py-4 items-center shadow-md ${loading ? 'opacity-70' : ''}`}
                            onPress={handleSendOtp}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={tw`text-white font-bold text-lg`}>Gửi mã OTP</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View>
                        <Text style={tw`text-gray-600 mb-6`}>
                            Nhập mã OTP đã được gửi đến <Text style={tw`font-bold`}>{newEmail}</Text>
                        </Text>

                        <View style={tw`mb-6`}>
                            <Text style={tw`text-gray-600 mb-2 font-medium`}>Mã OTP</Text>
                            <TextInput
                                style={tw`w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 text-center text-xl tracking-widest`}
                                value={otpCode}
                                onChangeText={setOtpCode}
                                placeholder="Nhập mã OTP"
                                placeholderTextColor="#9CA3AF"
                                keyboardType="number-pad"
                            />
                        </View>

                        <TouchableOpacity
                            style={tw`w-full bg-blue-600 rounded-xl py-4 items-center shadow-md ${loading ? 'opacity-70' : ''}`}
                            onPress={handleVerify}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={tw`text-white font-bold text-lg`}>Xác thực & Cập nhật</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={tw`mt-4 items-center`}
                            onPress={() => setStep(1)}
                            disabled={loading}
                        >
                            <Text style={tw`text-gray-500`}>Đổi địa chỉ Email khác</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
};

export default ChangeEmailScreen;
