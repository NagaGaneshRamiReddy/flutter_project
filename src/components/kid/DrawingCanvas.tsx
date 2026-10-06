import { useToast } from '@/src/context/ToastContext';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useRef, useState } from 'react';
import {
    Image,
    PanResponder,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import ViewShot from 'react-native-view-shot';
import { DrawingChallenge, drawingService } from '../../services/drawingService';
import { pointsStorage } from '../../utils/pointsStorage';
// Star reference paths are removed from client as we fetch from server now

interface Point {
    x: number;
    y: number;
}

interface DrawingPath {
    points: Point[];
    color: string;
    width: number;
}

interface DrawingCanvasProps {
    onDone: (base64Image: string) => void;
    onClose: () => void;
}

const COLORS = ['#FF5F5F', '#3B82F6', '#10B981', '#F59E0B', '#A855F7'];

const DrawingCanvas: React.FC<DrawingCanvasProps> = ({ onDone, onClose }) => {
    const [paths, setPaths] = useState<DrawingPath[]>([]);
    const [currentPath, setCurrentPath] = useState<Point[]>([]);
    const [selectedColor, setSelectedColor] = useState(COLORS[0]);
    const [isEraser, setIsEraser] = useState(false);
    const [challenge, setChallenge] = useState<DrawingChallenge | null>(null);
    const [loading, setLoading] = useState(true);
    const { showToast } = useToast();
    const viewShotRef = useRef<ViewShot>(null);

    React.useEffect(() => {
        loadRandomChallenge();
    }, []);

    const loadRandomChallenge = async () => {
        setLoading(true);
        const newChallenge = await drawingService.fetchRandomDrawing();
        setChallenge(newChallenge);
        setLoading(false);
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: evt => {
                const { locationX, locationY } = evt.nativeEvent;
                setCurrentPath([{ x: locationX, y: locationY }]);
            },
            onPanResponderMove: evt => {
                const { locationX, locationY } = evt.nativeEvent;
                setCurrentPath(prev => [...prev, { x: locationX, y: locationY }]);
            },
            onPanResponderRelease: () => {
                if (currentPath.length > 0) {
                    setPaths(prev => [
                        ...prev,
                        {
                            points: currentPath,
                            color: isEraser ? '#FFFFFF' : selectedColor,
                            width: isEraser ? 30 : 5,
                        },
                    ]);
                    setCurrentPath([]);
                }
            },
        })
    ).current;

    const renderPaths = useMemo(
        () =>
            paths.map((path, index) => (
                <Path
                    key={index}
                    d={path.points
                        .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
                        .join(' ')}
                    stroke={path.color}
                    strokeWidth={path.width}
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            )),
        [paths]
    );

    const renderCurrentPath = useMemo(() => {
        if (!currentPath.length) return null;
        return (
            <Path
                d={currentPath
                    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`)
                    .join(' ')}
                stroke={isEraser ? '#FFFFFF' : selectedColor}
                strokeWidth={isEraser ? 30 : 5}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        );
    }, [currentPath, selectedColor, isEraser]);

    const handleDone = async () => {
        if (paths.length === 0) {
            showToast('Please draw something first!', { status: 'error', title: 'Empty Drawing' });
            return;
        }

        if (!challenge) return;

        try {
            // 1. Capture drawing as PNG for server validation
            const base64Image = await viewShotRef.current?.capture?.();

            if (!base64Image) {
                showToast('Failed to capture drawing. Please try again.', { status: 'error' });
                return;
            }

            // 2. Validate on server
            const result = await drawingService.validateDrawingOnServer(
                `data:image/png;base64,${base64Image}`,
                challenge.id
            );

            showToast(
                result.message,
                {
                    status: result.success ? 'success' : 'error',
                    title: result.success ? "GREAT JOB! 🌟" : "KEEP TRYING! 💪"
                }
            );

            // 3. If accepted (score > some threshold or success flag)
            if (result.success) {
                // Increment local points
                const pointsEarned = result.pointsEarned || 10;
                await pointsStorage.incrementPoints(pointsEarned);

                setTimeout(() => {
                    onDone(`data:image/png;base64,score=${result.score}`);
                }, 3000);
            }
        } catch (error) {
            console.error('Error during validation:', error);
            onDone('data:image/png;base64,...');
        }
    };

    const clearCanvas = () => {
        setPaths([]);
        setCurrentPath([]);
    };

    return (
        <View className="flex-1 bg-slate-50">
            {/* Header */}
            <View className="flex-row items-center justify-between pt-12 px-5 pb-4 bg-white">
                <TouchableOpacity
                    onPress={onClose}
                    className="w-11 h-11 rounded-full bg-slate-100 items-center justify-center"
                >
                    <Ionicons name="close" size={28} color="#64748B" />
                </TouchableOpacity>

                <View className="px-5 py-2 rounded-full bg-slate-100 border border-slate-200">
                    <Text className="text-blue-500 font-black text-sm">
                        🎨 DRAWING MODE
                    </Text>
                </View>

                <View className="w-11 h-11 rounded-full bg-slate-100 items-center justify-center">
                    <Ionicons
                        name="help-circle-outline"
                        size={28}
                        color="#FACC15"
                    />
                </View>
            </View>

            {/* Instruction */}
            <View className="items-center py-5">
                {challenge ? (
                    <View className="bg-white p-5 rounded-3xl items-center shadow-sm">
                        <View className="absolute -top-2 -right-5 bg-red-400 px-3 py-1 rounded-xl rotate-12">
                            <Text className="text-white text-[10px] font-black">
                                DRAW THIS!
                            </Text>
                        </View>

                        <Image
                            source={{ uri: challenge.imageUrl }}
                            className="w-24 h-24 mb-2"
                        />

                        <Text className="text-slate-700 font-black text-base tracking-wider">
                            {challenge.label}
                        </Text>
                    </View>
                ) : (
                    <View className="h-40 items-center justify-center">
                        <Text className="text-slate-400">Loading challenge...</Text>
                    </View>
                )}
            </View>

            {/* Canvas */}
            <View className="flex-1 mx-5 bg-white rounded-[40px] overflow-hidden border border-slate-200">
                <View className="absolute inset-0 items-center justify-center">
                    <Text className="text-slate-300 text-xs font-extrabold tracking-wider">
                        TOUCH TO START DRAWING
                    </Text>
                </View>

                <ViewShot
                    ref={viewShotRef}
                    options={{ format: 'png', result: 'base64', quality: 0.7 }}
                    style={StyleSheet.absoluteFill}
                    {...panResponder.panHandlers}
                >
                    <Svg width="100%" height="100%">
                        <G>
                            {renderPaths}
                            {renderCurrentPath}
                        </G>
                    </Svg>
                </ViewShot>
            </View>

            {/* Toolbar */}
            <View className="py-5 px-5">
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ alignItems: 'center', gap: 15 }}
                >
                    {COLORS.map(color => (
                        <TouchableOpacity
                            key={color}
                            onPress={() => {
                                setSelectedColor(color);
                                setIsEraser(false);
                            }}
                            style={{ backgroundColor: color }}
                            className={`w-9 h-20 rounded-xl border-4 ${selectedColor === color && !isEraser
                                ? 'border-white scale-110 shadow-md'
                                : 'border-transparent'
                                }`}
                        />
                    ))}

                    <TouchableOpacity
                        onPress={() => setIsEraser(true)}
                        className={`w-12 h-12 rounded-xl items-center justify-center border ${isEraser
                            ? 'border-pink-500 bg-pink-100'
                            : 'border-pink-100 bg-pink-50'
                            }`}
                    >
                        <MaterialIcons
                            name="auto-fix-high"
                            size={24}
                            color={isEraser ? '#EC4899' : '#94A3B8'}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={clearCanvas}
                        className="w-12 h-12 rounded-xl bg-slate-100 items-center justify-center"
                    >
                        <MaterialIcons
                            name="delete-outline"
                            size={24}
                            color="#64748B"
                        />
                    </TouchableOpacity>
                </ScrollView>
            </View>

            {/* Done */}
            <View className="px-5 pb-10">
                <TouchableOpacity
                    onPress={handleDone}
                    activeOpacity={0.85}
                    className="h-[70px] rounded-3xl overflow-hidden"
                >
                    <LinearGradient
                        colors={['#4ADE80', '#22C55E']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        className="flex-1 flex-row items-center justify-center gap-2"
                    >
                        <MaterialIcons
                            name="emoji-events"
                            size={24}
                            color="white"
                        />
                        <Text className="text-white text-2xl font-black tracking-wider">
                            DONE!
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default DrawingCanvas;
