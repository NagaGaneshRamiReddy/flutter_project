import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { View } from 'react-native';
import { useDispatch } from 'react-redux';
import KidDashboard from '../../src/components/kid/KidDashboard';
import { LogoutModal } from '../../src/components/LogoutModal';
import { AppDispatch } from '../../src/store';
import { logout } from '../../src/store/slices/authSlice';

export default function KidDashboardScreen() {
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        setShowLogoutModal(false);
        dispatch(logout());
        router.replace('/(auth)/login');
    };

    return (
        <View style={{ flex: 1 }}>
            <KidDashboard onProfilePress={() => setShowLogoutModal(true)} />
            <LogoutModal
                visible={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onLogout={handleLogout}
                onViewProfile={() => {
                    setShowLogoutModal(false);
                    router.push('/(tabs)/settings');
                }}
            />
        </View>
    );
}
