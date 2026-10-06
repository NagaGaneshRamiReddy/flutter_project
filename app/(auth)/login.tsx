import { useTheme } from '@/src/context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Link, useNavigation, useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { KeyboardAwareScrollView } from '../../src/components/KeyboardAwareScrollView';
import { PrimaryButton } from '../../src/components/PrimaryButton';
import { PrimaryInput } from '../../src/components/PrimaryInput';
import { useToast } from '../../src/context/ToastContext';
import { useOnboardingRedirect } from '../../src/hooks/useOnboardingRedirect';
import { AppDispatch, RootState } from '../../src/store';
import { checkOnboardingStatus, clearError, loginUser } from '../../src/store/slices/authSlice';
import { OnboardingStatus } from '../../src/types/auth';

export default function LoginScreen() {
    const router = useRouter();
    const { colors } = useTheme();
    const navigation = useNavigation();
    const dispatch = useDispatch<AppDispatch>();
    const { loading, error, isAuthenticated, user } = useSelector((state: RootState) => state.auth);

    const pulseValue = useSharedValue(0);
    const rotation = useSharedValue(0);

    useEffect(() => {
        pulseValue.value = withRepeat(
            withTiming(1, { duration: 4000 }),
            -1,
            false
        );
        rotation.value = withRepeat(
            withTiming(360, { duration: 20000 }),
            -1,
            false
        );
    }, []);

    const rotationStyle = useAnimatedStyle(() => ({
        transform: [{ rotate: `${rotation.value}deg` }]
    }));

    const ring1Style = useAnimatedStyle(() => ({
        transform: [
            { translateX: -80 },
            { translateY: -80 },
            { scale: interpolate(pulseValue.value, [0, 1], [1, 1.5]) }
        ],
        opacity: interpolate(pulseValue.value, [0, 0.5, 1], [0, 0.3, 0])
    }));

    const ring2Style = useAnimatedStyle(() => {
        const progress = (pulseValue.value + 0.33) % 1;
        return {
            transform: [
                { translateX: -80 },
                { translateY: -80 },
                { scale: interpolate(progress, [0, 1], [1, 1.5]) }
            ],
            opacity: interpolate(progress, [0, 0.5, 1], [0, 0.2, 0])
        };
    });

    const ring3Style = useAnimatedStyle(() => {
        const progress = (pulseValue.value + 0.66) % 1;
        return {
            transform: [
                { translateX: -80 },
                { translateY: -80 },
                { scale: interpolate(progress, [0, 1], [1, 1.5]) }
            ],
            opacity: interpolate(progress, [0, 0.5, 1], [0, 0.1, 0])
        };
    });

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    // Toast State
    const { showToast } = useToast();
    const hasHandledRedirect = useRef(false);
    const { performRedirect } = useOnboardingRedirect();

    useEffect(() => {
        if (isAuthenticated && user && !hasHandledRedirect.current) {
            hasHandledRedirect.current = true;

            // If we already have user details including age, we can potentially redirect immediately
            if (user.age && user.isOnboarded && user.preferences) {
                performRedirect({
                    user: user,
                    preferences: user.preferences,
                    isOnboarded: user.isOnboarded,
                    age: user.age,
                    group: user.group as any
                });
                return;
            }

            dispatch(checkOnboardingStatus())
                .unwrap()
                .then((status: OnboardingStatus) => {
                    performRedirect(status);
                })
                .catch((err: any) => {
                    // Check if error is related to missing age
                    const errorMessage = typeof err === 'string' ? err : err?.message || '';
                    if (errorMessage.includes('Age is required')) {
                        console.log('👉 [LOGIN] Age missing, redirecting to age selection');
                        router.replace({
                            pathname: '/(onboarding)/age' as any,
                            params: { toastMessage: 'Please set your age to continue' }
                        });
                    } else {
                        // For other errors, we might want to show a toast or stay on login
                        console.error('❌ [LOGIN] Profile check failed:', err);
                        showToast(errorMessage, { status: 'error' });
                    }
                });
        }
    }, [isAuthenticated, user, dispatch, showToast, performRedirect, router]);

    useEffect(() => {
        if (error) {
            showToast(error, { status: 'error' });
            dispatch(clearError());
        }
    }, [error, dispatch, showToast]);

    const validate = () => {
        let valid = true;
        let newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = 'Email is required';
            valid = false;
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
            valid = false;
        }

        if (!password) {
            newErrors.password = 'Password is required';
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleLogin = () => {
        if (validate()) {
            dispatch(loginUser({ email, password }));
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-background-neutral relative">
            <KeyboardAwareScrollView
                className="flex-1"
                contentContainerStyle={{ flexGrow: 1 }}
            >
                <View className="flex-1 px-8 pt-4 pb-8">
                    {/* Header */}
                    <View className="flex-row items-center justify-between mb-8">
                        {navigation.canGoBack() && (navigation.getState()?.index ?? 0) > 0 ? (
                            <TouchableOpacity
                                onPress={() => router.back()}
                                className="w-12 h-12 rounded-full bg-white items-center justify-center shadow-sm border border-slate-100 active:scale-95"
                            >
                                <MaterialIcons name="arrow-back-ios" size={20} color="#475569" style={{ marginLeft: 6 }} />
                            </TouchableOpacity>
                        ) : (
                            <View className="w-12" />
                        )}
                        <View className="flex-row gap-1.5">
                            <View className="h-1.5 w-6 rounded-full" style={{ backgroundColor: colors["--primary"] }} />
                            <View className="h-1.5 w-2 rounded-full bg-slate-200" />
                            <View className="h-1.5 w-2 rounded-full bg-slate-200" />
                        </View>
                        <View className="w-12" />
                    </View>

                    {/* Illustration/Compass */}
                    <View className="items-center justify-center mb-10 mt-8 relative">
                        {/* Animated Pulse Rings */}
                        <Animated.View
                            style={[{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: 160,
                                height: 160,
                                borderRadius: 80,
                                backgroundColor: colors["--primary"] + '20',
                            }, ring1Style]}
                        />
                        <Animated.View
                            style={[{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: 160,
                                height: 160,
                                borderRadius: 80,
                                backgroundColor: colors["--primary"] + '15',
                            }, ring2Style]}
                        />
                        <Animated.View
                            style={[{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                width: 160,
                                height: 160,
                                borderRadius: 80,
                                backgroundColor: colors["--primary"] + '10',
                            }, ring3Style]}
                        />

                        {/* Glass Card Container */}
                        <BlurView
                            intensity={20}
                            tint="light"
                            className="w-40 h-40 rounded-full items-center justify-center overflow-hidden border border-white/50"
                            style={{ backgroundColor: colors["--primary"] + '10' }}
                        >
                            <Animated.View style={[{ alignItems: 'center', justifyContent: 'center', position: 'relative', width: '100%', height: '100%' }, rotationStyle]}>
                                {/* Layer 1: Glow / Back */}
                                <View className="absolute items-center justify-center opacity-20 scale-110">
                                    <MaterialIcons name="explore" size={96} color="#2563eb" />
                                </View>

                                {/* Layer 2: Main Icon */}
                                <View className="absolute items-center justify-center">
                                    <MaterialIcons name="explore" size={90} color="rgba(59, 130, 246, 0.8)" />
                                </View>
                            </Animated.View>
                        </BlurView>
                    </View>

                    {/* Content */}
                    <View className="items-center m-10">
                        <Text className="text-3xl font-extrabold text-slate-900 mb-3 text-center">
                            Welcome Back
                        </Text>
                        <Text className="text-slate-500 font-medium text-center text-base">
                            Ready to continue your personalized learning journey?
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="w-full space-y-4 gap-5">
                        <PrimaryInput
                            placeholder="Email Address"
                            value={email}
                            onChangeText={(text) => { setEmail(text); setErrors({ ...errors, email: '' }); }}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            iconName="alternate-email"
                            errorMessage={errors.email}
                        />

                        <PrimaryInput
                            placeholder="Password"
                            value={password}
                            onChangeText={(text) => { setPassword(text); setErrors({ ...errors, password: '' }); }}
                            isPassword
                            iconName="lock"
                            errorMessage={errors.password}
                        />

                        <View className="flex-row justify-end mt-2">
                            <Link href="/(auth)/login" asChild>
                                <TouchableOpacity>
                                    <Text className="text-sm font-bold text-primary">Forgot password?</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>

                    {/* Footer */}
                    <View className="mt-auto pt-12">
                        <PrimaryButton
                            title={loading ? "Signing In..." : "Sign In"}
                            onPress={handleLogin}
                            disabled={loading}
                            iconName="login"
                        />

                        <View className="flex-row justify-center mt-8">
                            <Text className="text-slate-500 font-medium text-sm">
                                Don&apos;t have an account?{' '}
                            </Text>
                            <Link href="/(auth)/register" asChild>
                                <TouchableOpacity>
                                    <Text className="text-primary font-bold ml-1 text-sm">Create Account</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    );
}
