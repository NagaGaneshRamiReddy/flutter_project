import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { FlashList } from '@shopify/flash-list';
import * as Haptics from 'expo-haptics';
import { useNavigation, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Dimensions,
    Image,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Animated, {
    Extrapolation,
    interpolate,
    useAnimatedScrollHandler,
    useAnimatedStyle,
    useDerivedValue,
    useSharedValue,
    type SharedValue
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch } from 'react-redux';
import { useRedirectToast } from '../../src/hooks/useRedirectToast';
import { updateUserProfile } from '../../src/store/slices/authSlice';

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.7;
const SPACING = (width - ITEM_WIDTH) / 2;
const AnimatedFlashList = Animated.createAnimatedComponent(FlashList) as any;

const HEROES = [
    {
        id: 'sparky',
        name: 'Sparky',
        color: '#22c55e',
        description: 'Full of energy and curiosity!',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAglS_3OIY95IyMrkrqv7mCh-CGcrLZIkqVsCVYWf7MxzW5SI4-pklGURPIrAQ8EEp2rjIS5LjoJ_MnRMZNXZba7IDVVuwL0xRA5xUWWt5Utrn-z6LXa1mh31PKVdO9Ory4_DeDtgDRKEFuOyLHLzstsPgy74X8qk1-9bgrsw8-Yf-N63ENLVfibGd2g9MK9AC17F0mFqtb5lG9VooJd2Cbw3VKL6sExzlzy0n9SqdNIbGHSn3FAQ-o50PNc1G1Hf3f-zPZznZdcIo',
    },
    {
        id: 'maya',
        name: 'Maya',
        color: '#f472b6',
        description: 'Creative and imaginative!',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzVq8w5EU7E8N2X3bNEjuxOOLh5G4AvzJw11fPaPjP0MzZBsyKI3yg0Hjo_0qQxLJCJSDVifHccXVQJyS4l-aoG-flJPcxqEqRua_IkKyo03lXJ6YzA_NQnbBPXRrO5o5BH_Y_YLIgbDB-2nd_MQOOA09IZbq9LPZGt5S8DWoNhIIkxj_10RckG3Fml7eBZYsdJJIntkjJv_ZDJcHth7gsRMOT2RQtZsWRK0RB_NrVPC_sLNoFwxYw_gG8lD2y77fCpWpHtoUCGQI',
    },
    {
        id: 'zog',
        name: 'Zog',
        color: '#a855f7',
        description: 'Brave and adventurous!',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDF9Aq9gftcWeTuppB0E60CPS4THm1VJTZp2Qst0AFFfdN6LNuo5sZoLvhU9sBXuZMUSLy2C6EToTA1V-dIQJFbBK_hPzF4dJv47-RYypI0suQ7-pxEK-XM5qMCwU-VJ9CWs5clMlujzaFjBtBN3rW8nooMx4biRZ4EUW4dSK9xKEXvohy3r1EcZMdKypgwWrLkgvEvOqxK48ZrDfmuOz5Hrr-Nmjl2918FPWIsGetCyKMd_khl4iY1ZtX9A8CoRoPafmEYvW9LfC8',
    },
    {
        id: 'leo',
        name: 'Leo',
        color: '#3b82f6',
        description: 'Smart and thoughtful!',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA3TV1oFuLnNEwgYnM2wlMAEAoVMVsDm3RwUqaWt5dfzYtBXg3GU6Rsxj0fCwGSnG-OrhENipYtaUdfGxDrBJ-c9himwTeXIaH2nvksqCQz_GsPnNH-j6v4Of2P0_I29i7l3u6RUnkTD3QrDjx45adgdbWQgTreeNhT-crlW0PDbV_C12nHlfBptnNJOXaGTH_gQxVopH2hnzQ3A3lQLhoAe_Uq6Ahuh89FGAzjjStRZijdK5ziMBSlTRddR1n2_byM8O9i81pBvGg',
    },
    {
        id: 'astra',
        name: 'Astra',
        color: '#f97316',
        description: 'Warm and friendly!',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAE8tJbtrSOaWg87agTs8ebiijDNapmZw_XcgSOc5xDGSOZwdyKqJQvvNH_nnimpEQdizB-bkR1RtbKP89BLHmbXHQRlTvg9zbgSsnSslRnnI5uUY0bcj4CquDlDGsmFSBExCrqZxAtaAxEynb0IBoczN3pcg6XFQE3ZwSXY_OTY87KKYSMi_rV88XN3DuHAb3_7nCYsfP8obK1RV5pgEI1B6KRcBHV-mUWamrOZH0_vNoq3oKd36MOc0RaCmczYK0vllYc72LXEmg',
    },
    {
        id: 'bubbles',
        name: 'Bubbles',
        color: '#06b6d4',
        description: 'Fun and bubbly!',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBBHV67hOceSwjzAQipkTe0xAXyIqwcDSEC99CBoMhG5eJ-2giw1fqwKllsM-LNaRLtPIuaagh2Rw82QkllgmRMcdg1CamY1feIy6hfXDPCRKmWdumxVxtA4hyOHs5tox6uNNEN6fRyMwaO1KNbT-MF2gQ6a7bKXWO_wkCBe6CT3WSO9xGxpsF4JZp9R7n8od5qoA1nwchdoXySZs6bwAmMTsPOq6SFf4rkrjkymOMmuggYyahBT8jwkO1oMARVZbNNCyD1sdUqAjU',
    },
];

const HeroItemComponent = ({
    hero,
    index,
    scrollX,
}: {
    hero: typeof HEROES[0];
    index: number;
    scrollX: SharedValue<number>;
}) => {
    const animatedStyle = useAnimatedStyle(() => {
        const position = scrollX.value / ITEM_WIDTH;
        const distance = Math.abs(position - index);

        const scale = interpolate(
            distance,
            [0, 1],
            [1, 0.8],
            Extrapolation.CLAMP
        );

        const opacity = interpolate(
            distance,
            [0, 0.5, 1],
            [1, 0.6, 0.3],
            Extrapolation.CLAMP
        );

        const translateY = interpolate(
            distance,
            [0, 1],
            [0, 20],
            Extrapolation.CLAMP
        );

        return {
            transform: [{ scale }, { translateY }],
            opacity,
        };
    });

    const glowStyle = useAnimatedStyle(() => {
        const position = scrollX.value / ITEM_WIDTH;
        const distance = Math.abs(position - index);

        const glowOpacity = interpolate(
            distance,
            [0, 0.5, 1],
            [1, 0.2, 0],
            Extrapolation.CLAMP
        );

        return {
            opacity: glowOpacity,
        };
    });

    return (
        <Animated.View style={[{ width: ITEM_WIDTH }, animatedStyle]} className="items-center justify-center px-4">
            <View className="w-full items-center">
                {/* Glow layers */}
                <View className="absolute w-full aspect-square items-center justify-center">
                    <Animated.View
                        style={[
                            {
                                width: '95%',
                                height: '95%',
                                borderRadius: 9999,
                                backgroundColor: hero.color + '15',
                            },
                            glowStyle,
                        ]}
                    />
                    <Animated.View
                        style={[
                            {
                                position: 'absolute',
                                width: '85%',
                                height: '85%',
                                borderRadius: 9999,
                                backgroundColor: hero.color + '20',
                            },
                            glowStyle,
                        ]}
                    />
                    <Animated.View
                        style={[
                            {
                                position: 'absolute',
                                width: '75%',
                                height: '75%',
                                borderRadius: 9999,
                                backgroundColor: hero.color + '30',
                            },
                            glowStyle,
                        ]}
                    />
                </View>

                {/* Hero Image */}
                <View className="w-full aspect-square rounded-full overflow-hidden bg-white shadow-2xl border-4 border-white">
                    <Image
                        source={{ uri: hero.image }}
                        className="w-full h-full"
                        resizeMode="cover"
                    />
                </View>

                {/* Hero Info */}
                <View className="mt-8 items-center">
                    <Text className="text-4xl font-extrabold text-slate-900 mb-2">
                        {hero.name}
                    </Text>
                    <Text className="text-lg font-medium text-slate-500 text-center">
                        {hero.description}
                    </Text>
                </View>
            </View>
        </Animated.View>
    );
};

const HeroItem = React.memo(HeroItemComponent);
HeroItem.displayName = 'HeroItem';

const HeroDot = React.memo(({
    index,
    scrollX,
    color
}: {
    index: number;
    scrollX: SharedValue<number>;
    color: string;
}) => {
    const animatedStyle = useAnimatedStyle(() => {
        const position = scrollX.value / ITEM_WIDTH;
        const distance = Math.abs(position - index);

        const opacity = interpolate(
            distance,
            [0, 1],
            [1, 0.3],
            Extrapolation.CLAMP
        );

        const scale = interpolate(
            distance,
            [0, 1],
            [1.2, 1],
            Extrapolation.CLAMP
        );

        return {
            opacity,
            transform: [{ scale }],
            backgroundColor: color,
        };
    });

    return (
        <Animated.View
            style={[animatedStyle]}
            className="w-3 h-3 rounded-full mx-1"
        />
    );
});
HeroDot.displayName = 'HeroDot';


export default function HeroSelectionScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const listRef = useRef<any>(null);

    const scrollX = useSharedValue(0);
    const [selectedIndex, setSelectedIndex] = useState(0);

    useRedirectToast();

    const activeIndex = useDerivedValue(() => {
        return Math.round(scrollX.value / ITEM_WIDTH);
    });

    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (e) => {
            scrollX.value = e.contentOffset.x;
        },
        onMomentumEnd: () => {
            const index = Math.round(scrollX.value / ITEM_WIDTH);
            if (index !== selectedIndex) {
                Haptics.selectionAsync();
            }
        },
    });

    const handleNext = () => {
        const selectedHero = HEROES[selectedIndex].id;
        dispatch(updateUserProfile({ hero: selectedHero }));
        console.log('Use Hero:', selectedHero);
        router.replace('/(tabs)/kid' as any);
    };

    // Track scroll position to update selected index
    React.useEffect(() => {
        const interval = setInterval(() => {
            const index = Math.round(scrollX.value / ITEM_WIDTH);
            if (index !== selectedIndex && index >= 0 && index < HEROES.length) {
                setSelectedIndex(index);
            }
        }, 100);
        return () => clearInterval(interval);
    }, [selectedIndex, scrollX]);

    const buttonStyle = useAnimatedStyle(() => {
        const hero = HEROES[Math.min(activeIndex.value, HEROES.length - 1)];
        return {
            backgroundColor: hero?.color || '#22c55e',
        };
    });

    return (
        <SafeAreaView className="flex-1 bg-white relative">
            <View className="flex-1">
                {/* Navigation Header */}
                <View className="flex-row items-center justify-between px-6 pt-2 pb-2">
                    {navigation.canGoBack() && (navigation.getState()?.index ?? 0) > 0 ? (
                        <TouchableOpacity
                            onPress={() => router.back()}
                            className="w-10 h-10 rounded-full border border-slate-100 items-center justify-center bg-white shadow-sm"
                        >
                            <MaterialIcons name="arrow-back-ios-new" size={20} color="#475569" />
                        </TouchableOpacity>
                    ) : (
                        <View className="w-10" />
                    )}
                    <View className="flex-col items-end gap-1 flex-1 px-4">
                        <View className="flex-row items-center gap-2">
                            <MaterialCommunityIcons name="seed" size={16} color="#22c55e" />
                            <Text className="text-xs font-bold uppercase tracking-widest text-green-500">
                                Step 3 of 5
                            </Text>
                        </View>
                        <View className="flex-row gap-1">
                            <View className="h-1.5 w-2 rounded-full bg-green-200" />
                            <View className="h-1.5 w-2 rounded-full bg-green-200" />
                            <View className="h-1.5 w-8 rounded-full bg-green-500" />
                            <View className="h-1.5 w-2 rounded-full bg-green-200" />
                            <View className="h-1.5 w-2 rounded-full bg-green-200" />
                        </View>
                    </View>
                </View>

                {/* Hero Content */}
                <View className="px-6 pt-4 pb-8 text-center items-center">
                    <Text className="text-[32px] font-extrabold leading-tight tracking-tight text-slate-900 mb-3 text-center">
                        Pick your hero!
                    </Text>
                    <Text className="text-lg font-medium text-slate-500 text-center">
                        Swipe to choose your learning buddy
                    </Text>
                </View>

                {/* Hero Slider */}
                <View className="flex-1 justify-center">
                    <AnimatedFlashList
                        ref={listRef}
                        data={HEROES}
                        horizontal
                        keyExtractor={(item: any) => item.id}
                        renderItem={({ item, index }: any) => (
                            <HeroItem
                                hero={item}
                                index={index}
                                scrollX={scrollX}
                            />
                        )}
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={ITEM_WIDTH}
                        decelerationRate="fast"
                        contentContainerStyle={{ paddingHorizontal: SPACING }}
                        onScroll={scrollHandler}
                        scrollEventThrottle={16}
                        estimatedItemSize={ITEM_WIDTH}
                        onMomentumScrollEnd={(e: any) => {
                            const index = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
                            setSelectedIndex(index);
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                        }}
                    />

                    {/* Pagination Dots */}
                    <View className="flex-row justify-center gap-2 mt-8">
                        {HEROES.map((hero, index) => (
                            <HeroDot
                                key={hero.id}
                                index={index}
                                scrollX={scrollX}
                                color={hero.color}
                            />
                        ))}
                    </View>
                </View>

                {/* Sticky Bottom Action Button */}
                <View className="bg-white px-6 py-2 border-t border-slate-100">
                    <Animated.View>
                        <TouchableOpacity
                            onPress={handleNext}
                            activeOpacity={0.9}
                        >
                            <Animated.View
                                style={[
                                    {
                                        shadowColor: '#000',
                                        shadowOffset: { width: 0, height: 4 },
                                        shadowOpacity: 0.3,
                                        shadowRadius: 8,
                                        elevation: 4,
                                    },
                                    buttonStyle,
                                ]}
                                className="flex-row w-full items-center justify-center gap-3 rounded-full h-16 px-5"
                            >
                                <Text className="text-white text-xl font-black leading-normal tracking-wide uppercase">
                                    LET&apos;S GO!
                                </Text>
                                <MaterialIcons name="rocket-launch" size={24} color="white" />
                            </Animated.View>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </View>
        </SafeAreaView>
    );
}