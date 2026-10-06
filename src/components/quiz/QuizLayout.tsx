import { MaterialIcons } from '@expo/vector-icons';
import { MotiView } from 'moti';
import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../../context/ThemeContext';
import { PrimaryButton } from '../PrimaryButton';

interface Question {
    id: string;
    text: string;
    options: { id: string; text: string; isCorrect: boolean }[];
    explanation?: string;
}

interface QuizLayoutProps {
    title: string;
    questions: Question[];
    mode?: 'adult' | 'kid'; // We can still keep this for layout structure differences if any
    onComplete: (score: number) => void;
    onExit: () => void;
}

export const QuizLayout = ({ title, questions, mode = 'adult', onComplete, onExit }: QuizLayoutProps) => {
    const insets = useSafeAreaInsets();
    const { colors } = useTheme(); // Use the theme context
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);

    const currentQuestion = questions[currentIndex];
    const progress = ((currentIndex + 1) / questions.length) * 100;

    const handleOptionPress = (optionId: string) => {
        if (isAnswered) return;
        setSelectedOption(optionId);
    };

    const handleSubmit = () => {
        if (!selectedOption) return;

        const isCorrect = currentQuestion.options.find(o => o.id === selectedOption)?.isCorrect;
        if (isCorrect) {
            setScore(prev => prev + 1);
        }

        setIsAnswered(true);
    };

    const handleNext = () => {
        if (currentIndex < questions.length - 1) {
            setCurrentIndex(prev => prev + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            onComplete(score + (currentQuestion.options.find(o => o.id === selectedOption)?.isCorrect ? 1 : 0));
        }
    };

    // Helper to determine styles based on theme colors
    const isKidTheme = mode === 'kid'; // We can also check activeTheme from context if strictly bound

    const containerStyle = { backgroundColor: colors['--background'] };
    const headerStyle = {
        paddingTop: insets.top + 10,
        backgroundColor: colors['--background'],
        borderBottomColor: colors['--secondary'],
        borderBottomWidth: 1
    };
    const titleStyle = { color: colors.text };
    const progressBarStyle = { backgroundColor: colors['--primary'] };
    const progressTrackStyle = { backgroundColor: colors['--secondary'] };

    return (
        <View style={[{ flex: 1 }, containerStyle]}>
            {/* Header */}
            <View
                className="flex-row items-center justify-between px-6 py-4"
                style={headerStyle}
            >
                <TouchableOpacity onPress={onExit} className="p-2">
                    <MaterialIcons name="close" size={24} color={colors['--muted-foreground']} />
                </TouchableOpacity>
                <Text className="text-lg font-black" style={titleStyle}>{title}</Text>
                <View className="w-10" />
            </View>

            {/* Progress Bar */}
            <View style={[{ height: 8, width: '100%' }, progressTrackStyle]}>
                <MotiView
                    animate={{ width: `${progress}%` }}
                    transition={{ type: 'timing', duration: 500 }}
                    style={[{ height: '100%' }, progressBarStyle]}
                />
            </View>

            <ScrollView contentContainerStyle={{ padding: 24 }}>
                <Text className="text-sm font-bold mb-2 uppercase" style={{ color: colors['--accent-foreground'] }}>
                    Question {currentIndex + 1} of {questions.length}
                </Text>

                <Text className="text-2xl font-black mb-8 leading-tight" style={{ color: colors.text }}>
                    {currentQuestion.text}
                </Text>

                <View className="gap-4">
                    {currentQuestion.options.map((option, index) => {
                        const isSelected = selectedOption === option.id;
                        const showCorrect = isAnswered && option.isCorrect;
                        const showWrong = isAnswered && isSelected && !option.isCorrect;

                        let borderColor = colors['--secondary'];
                        let bgColor = colors['--background']; // Default bg
                        let textColor = colors.text;

                        if (isSelected) {
                            borderColor = colors['--primary'];
                            bgColor = colors['--secondary'];
                            textColor = colors['--primary-foreground']; // Or primary text color depending on contrast
                            // Actually, let's keep text readable. 
                            textColor = colors['--primary'];
                        }

                        if (showCorrect) {
                            borderColor = '#22c55e'; // Green
                            bgColor = '#f0fdf4';
                            textColor = '#15803d';
                        } else if (showWrong) {
                            borderColor = '#ef4444'; // Red
                            bgColor = '#fef2f2';
                            textColor = '#b91c1c';
                        }

                        return (
                            <TouchableOpacity
                                key={option.id}
                                onPress={() => handleOptionPress(option.id)}
                                disabled={isAnswered}
                                activeOpacity={0.9}
                                className="p-5 rounded-2xl border-2 flex-row items-center gap-4"
                                style={{
                                    borderColor,
                                    backgroundColor: bgColor,
                                    shadowColor: colors['--primary'],
                                    shadowOpacity: isKidTheme ? 0.1 : 0,
                                    shadowRadius: 4,
                                    elevation: isKidTheme ? 2 : 0
                                }}
                            >
                                <View className="w-10 h-10 rounded-full items-center justify-center border-2"
                                    style={{
                                        borderColor: isSelected || showCorrect || showWrong
                                            ? (showCorrect ? '#22c55e' : showWrong ? '#ef4444' : colors['--primary'])
                                            : colors['--muted-foreground'],
                                        backgroundColor: isSelected || showCorrect || showWrong
                                            ? (showCorrect ? '#22c55e' : showWrong ? '#ef4444' : colors['--primary'])
                                            : 'transparent'
                                    }}
                                >
                                    <Text className="font-bold" style={{
                                        color: isSelected || showCorrect || showWrong ? 'white' : colors['--muted-foreground']
                                    }}>
                                        {String.fromCharCode(65 + index)}
                                    </Text>
                                </View>
                                <Text className="flex-1 text-lg font-semibold" style={{ color: showCorrect || showWrong ? textColor : colors.text }}>
                                    {option.text}
                                </Text>
                                {showCorrect && <MaterialIcons name="check-circle" size={24} color="#22c55e" />}
                                {showWrong && <MaterialIcons name="cancel" size={24} color="#ef4444" />}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                {isAnswered && currentQuestion.explanation && (
                    <MotiView
                        from={{ opacity: 0, translateY: 10 }}
                        animate={{ opacity: 1, translateY: 0 }}
                        className="mt-6 p-4 rounded-xl"
                        style={{ backgroundColor: colors['--muted'] }}
                    >
                        <View className="flex-row gap-2 mb-1">
                            <MaterialIcons name="lightbulb" size={20} color={colors['--primary']} />
                            <Text className="font-bold" style={{ color: colors['--primary'] }}>Explanation</Text>
                        </View>
                        <Text style={{ color: colors.text }}>{currentQuestion.explanation}</Text>
                    </MotiView>
                )}
            </ScrollView>

            <View
                className="p-6 border-t"
                style={{
                    paddingBottom: insets.bottom + 20,
                    borderTopColor: colors['--secondary'],
                    backgroundColor: colors['--background']
                }}
            >
                {isAnswered ? (
                    <PrimaryButton
                        title={currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                        onPress={handleNext}
                        style={{ backgroundColor: colors['--primary'] }}
                        textStyle={{ color: colors['--primary-foreground'] }}
                    />
                ) : (
                    <PrimaryButton
                        title="Submit Answer"
                        onPress={handleSubmit}
                        disabled={!selectedOption}
                        style={!selectedOption
                            ? { opacity: 0.5, backgroundColor: colors['--muted'] }
                            : { backgroundColor: colors['--primary'] }
                        }
                        textStyle={{ color: !selectedOption ? colors['--muted-foreground'] : colors['--primary-foreground'] }}
                    />
                )}
            </View>
        </View>
    );
};
