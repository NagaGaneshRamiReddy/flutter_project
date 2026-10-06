import { MaterialIcons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import React from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

interface LogoutModalProps {
    visible: boolean;
    onClose: () => void;
    onLogout: () => void;
    onViewProfile: () => void;
}

export const LogoutModal = ({ visible, onClose, onLogout, onViewProfile }: LogoutModalProps) => {
    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <Pressable
                className="flex-1 bg-black/50 items-center justify-center px-6"
                onPress={onClose}
            >
                <MotiView
                    from={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white w-full rounded-[32px] overflow-hidden shadow-2xl"
                >
                    <View className="p-8 items-center">
                        <View className="w-20 h-20 bg-slate-100 rounded-full items-center justify-center mb-6">
                            <MaterialIcons name="person" size={40} color="#64748b" />
                        </View>

                        <Text className="text-2xl font-black text-slate-900 mb-2">Hey there!</Text>
                        <Text className="text-slate-500 text-center font-medium mb-8">What would you like to do today?</Text>

                        <View className="w-full gap-4">
                            {/* <TouchableOpacity
                                onPress={onViewProfile}
                                className="bg-slate-900 h-16 rounded-2xl items-center justify-center flex-row gap-3"
                            >
                                <MaterialIcons name="account-circle" size={24} color="white" />
                                <Text className="text-white font-black text-lg">View Profile</Text>
                            </TouchableOpacity> */}

                            <TouchableOpacity
                                onPress={onLogout}
                                className="bg-red-50 h-16 rounded-2xl items-center justify-center flex-row gap-3 border border-red-100"
                            >
                                <MaterialIcons name="logout" size={24} color="#ef4444" />
                                <Text className="text-red-500 font-black text-lg">Log Out</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={onClose}
                                className="h-14 items-center justify-center"
                            >
                                <Text className="text-slate-400 font-bold">Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </MotiView>
            </Pressable>
        </Modal>
    );
};
