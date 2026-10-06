import { Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../src/store';
import { fetchModules } from '../../src/store/slices/learningSlice';

export default function TabLayout() {
    const dispatch = useDispatch<AppDispatch>();
    const { currentModules } = useSelector((state: RootState) => state.learning);

    useEffect(() => {
        if (!currentModules || currentModules.length === 0) {
            dispatch(fetchModules());
        }
    }, [dispatch]);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="kid" />
            <Stack.Screen name="explore" />
            <Stack.Screen name="achievements" />
            <Stack.Screen name="settings" />
        </Stack>
    );
}
