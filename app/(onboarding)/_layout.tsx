import { Stack } from 'expo-router';

export default function OnboardingLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            {/* Auto-routing will handle the sub-folders and individual files */}
        </Stack>
    );
}
