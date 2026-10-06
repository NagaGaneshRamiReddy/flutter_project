import React from 'react';
import { KeyboardAwareScrollView as RNKeyboardAwareScrollView } from 'react-native-keyboard-controller';
import type { ScrollViewProps } from 'react-native';

interface KeyboardAwareScrollViewProps extends ScrollViewProps {
    /** Extra space between keyboard and focused input. Default 20 */
    bottomOffset?: number;
}

/**
 * A ScrollView that automatically scrolls to keep focused inputs visible above the keyboard.
 * Use this wherever PrimaryInput or other TextInputs are used for consistent keyboard handling.
 */
export const KeyboardAwareScrollView = ({
    bottomOffset = 20,
    keyboardShouldPersistTaps = 'handled',
    showsVerticalScrollIndicator = false,
    ...props
}: KeyboardAwareScrollViewProps) => {
    return (
        <RNKeyboardAwareScrollView
            bottomOffset={bottomOffset}
            keyboardShouldPersistTaps={keyboardShouldPersistTaps}
            showsVerticalScrollIndicator={showsVerticalScrollIndicator}
            {...props}
        />
    );
};
