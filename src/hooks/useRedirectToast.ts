import { useLocalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { useToast } from '../context/ToastContext';

/**
 * Shows a toast when the screen is opened with toastMessage in route params.
 * Uses the global toast - no need to render CustomToast in the screen.
 */
export const useRedirectToast = () => {
    const params = useLocalSearchParams();
    const { showToast } = useToast();

    useEffect(() => {
        if (params.toastMessage) {
            showToast(params.toastMessage as string, { status: 'info', title: 'Action Required', duration: 4000 });
        }
    }, [params.toastMessage, showToast]);
};
