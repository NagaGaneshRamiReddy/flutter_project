import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { AdultDashboard } from '../../src/components/adult/AdultDashboard';
import { LogoutModal } from '../../src/components/LogoutModal';
import { useTheme } from '../../src/context/ThemeContext';
import { AppDispatch, RootState } from '../../src/store';
import { logout } from '../../src/store/slices/authSlice';
import { fetchMyLearningPath, regeneratePath } from '../../src/store/slices/learningSlice';

export default function HomeScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const dispatch = useDispatch<AppDispatch>();
    const { colors } = useTheme();
    const user = useSelector((state: RootState) => state.auth.user);
    const { learningPath, loading } = useSelector((state: RootState) => state.learning);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    useEffect(() => {
        if (user?.role === 'kid' || user?.group === 'KIDS') {
            router.replace('/(tabs)/kid');
        } else if (!learningPath) {
            dispatch(fetchMyLearningPath());
        }
    }, [dispatch, learningPath, user, router]);

    const handleLogout = () => {
        setShowLogoutModal(false);
        dispatch(logout());
        router.replace('/(auth)/login');
    };

    const modules = learningPath?.modules || [];

    return (
        <View style={{ flex: 1 }}>
            <AdultDashboard
                insets={insets}
                router={router}
                dispatch={dispatch}
                colors={colors}
                user={user}
                learningPath={learningPath}
                loading={loading}
                modules={modules}
                onProfilePress={() => setShowLogoutModal(true)}
                onRegenerate={() => dispatch(regeneratePath())}
                onFetchPath={() => dispatch(fetchMyLearningPath())}
            />
            <LogoutModal
                visible={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onLogout={handleLogout}
                onViewProfile={() => {
                    setShowLogoutModal(false);
                    router.push('/profile');
                }}
            />
        </View>
    );
}
