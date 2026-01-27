import React, { useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Text, Avatar, ActivityIndicator, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser, logoutUser } from '../store/slices/authSlice';
import tw from 'twrnc';

const HomeScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { user, loading, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        const initAuth = async () => {
            // Handle initial auth load if needed (though LoginScreen usually handles this)
            // This is a safety check in case we land here unexpectedly
            if (!isAuthenticated) {
                try {
                    await dispatch(loadUser()).unwrap();
                } catch (error) {
                    navigation.replace('Login');
                }
            }
        };
        initAuth();
    }, [isAuthenticated, dispatch, navigation]);

    const handleLogout = async () => {
        await dispatch(logoutUser());
        navigation.replace('Login');
    };

    if (loading || !user) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-white`}>
                <ActivityIndicator size="large" color="#2563EB" />
            </View>
        );
    }

    return (
        <View style={tw`flex-1 bg-gray-50 h-full`}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={tw`pb-10`}>
                {/* Header Gradient Block */}
                <View style={tw`bg-blue-600 px-6 pt-12 pb-16 rounded-b-[40px] shadow-lg`}>
                    <View style={tw`flex-row justify-between items-center`}>
                        <View>
                            <Text style={tw`text-blue-100 text-lg mb-1`}>Welcome back,</Text>
                            <Text style={tw`text-white text-3xl font-bold`}>{user.fullName || user.username || 'User'}</Text>
                        </View>
                        <View style={tw`bg-white/20 p-1 rounded-full border-2 border-white/30`}>
                            <Avatar.Text size={50} label={(user.username?.[0] || 'U').toUpperCase()} style={{ backgroundColor: '#DBEAFE' }} color="#1E40AF" />
                        </View>
                    </View>

                    <View style={tw`mt-4 flex-row items-center bg-blue-500/50 self-start px-3 py-1 rounded-full`}>
                        <Text style={tw`text-white font-medium text-xs tracking-wider uppercase`}>
                            {user.role || 'USER'} Account
                        </Text>
                    </View>
                </View>

                {/* Statistics Cards - Overlapping Header */}
                <View style={tw`flex-row justify-between px-6 -mt-10`}>
                    <View style={tw`bg-white p-4 rounded-2xl shadow-sm w-[30%] items-center border border-gray-100`}>
                        <Text style={tw`text-blue-600 text-2xl font-bold`}>12</Text>
                        <Text style={tw`text-gray-500 text-xs mt-1`}>To Do</Text>
                    </View>
                    <View style={tw`bg-white p-4 rounded-2xl shadow-sm w-[30%] items-center border border-gray-100`}>
                        <Text style={tw`text-green-600 text-2xl font-bold`}>5</Text>
                        <Text style={tw`text-gray-500 text-xs mt-1`}>Done</Text>
                    </View>
                    <View style={tw`bg-white p-4 rounded-2xl shadow-sm w-[30%] items-center border border-gray-100`}>
                        <Text style={tw`text-orange-500 text-2xl font-bold`}>3</Text>
                        <Text style={tw`text-gray-500 text-xs mt-1`}>Pending</Text>
                    </View>
                </View>

                {/* Quick Actions Grid */}
                <View style={tw`px-6 mt-8`}>
                    <Text style={tw`text-xl font-bold text-gray-800 mb-4`}>Quick Actions</Text>

                    <View style={tw`flex-row flex-wrap justify-between`}>
                        {/* Card 1 */}
                        <TouchableOpacity style={tw`w-[48%] bg-white p-4 rounded-2xl shadow-sm mb-4 border border-gray-100 items-center justify-center py-8`}>
                            <View style={tw`bg-purple-100 p-3 rounded-full mb-3`}>
                                <IconButton icon="folder" iconColor="#9333ea" size={24} style={{ margin: 0 }} />
                            </View>
                            <Text style={tw`font-semibold text-gray-700`}>Projects</Text>
                        </TouchableOpacity>

                        {/* Card 2 */}
                        <TouchableOpacity style={tw`w-[48%] bg-white p-4 rounded-2xl shadow-sm mb-4 border border-gray-100 items-center justify-center py-8`}>
                            <View style={tw`bg-teal-100 p-3 rounded-full mb-3`}>
                                <IconButton icon="account-group" iconColor="#0d9488" size={24} style={{ margin: 0 }} />
                            </View>
                            <Text style={tw`font-semibold text-gray-700`}>Team</Text>
                        </TouchableOpacity>

                        {/* Card 3 */}
                        <TouchableOpacity style={tw`w-[48%] bg-white p-4 rounded-2xl shadow-sm mb-4 border border-gray-100 items-center justify-center py-8`}>
                            <View style={tw`bg-orange-100 p-3 rounded-full mb-3`}>
                                <IconButton icon="chart-bar" iconColor="#f97316" size={24} style={{ margin: 0 }} />
                            </View>
                            <Text style={tw`font-semibold text-gray-700`}>Reports</Text>
                        </TouchableOpacity>

                        {/* Card 4 */}
                        <TouchableOpacity style={tw`w-[48%] bg-white p-4 rounded-2xl shadow-sm mb-4 border border-gray-100 items-center justify-center py-8`}>
                            <View style={tw`bg-pink-100 p-3 rounded-full mb-3`}>
                                <IconButton icon="cog" iconColor="#db2777" size={24} style={{ margin: 0 }} />
                            </View>
                            <Text style={tw`font-semibold text-gray-700`}>Settings</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <TouchableOpacity
                    onPress={handleLogout}
                    style={tw`mx-6 mt-4 bg-red-50 p-4 rounded-xl flex-row justify-center items-center border border-red-100`}
                >
                    <Text style={tw`text-red-500 font-semibold tracking-wide`}>LOG OUT</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
};

export default HomeScreen;
