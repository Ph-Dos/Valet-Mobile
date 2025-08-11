// This code sets a standard for the code base.

import { ReactElement } from "react";
import { ActivityIndicator, Pressable, Text } from "react-native";
import Animated, {
    interpolate,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from "react-native-reanimated";

export interface AnimatedBackgroundButtonProps {
    accessibilityHint?: string;
    accessibilityLabel?: string;
    Icon?: ReactElement;
    isDisabled?: boolean;
    isLoading?: boolean;
    onPress: () => void;
    title: string;
    width?: number;
    height?: number;
    testID?: string;
}

const DURATION = 175;

export function SimpleButton({
    accessibilityHint,
    accessibilityLabel,
    Icon,
    isDisabled = false,
    isLoading = false,
    onPress,
    title,
    width = 360,
    height = 45,
    testID,
}: AnimatedBackgroundButtonProps) {
    const transition = useSharedValue(0);
    const isActive = useSharedValue(false);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{
            scale: interpolate(transition.value, [0, 1], [1, 0.97]),
        }],
    }));

    return (
        <Pressable
            accessibilityHint={accessibilityHint}
            accessibilityLabel={accessibilityLabel}
            accessibilityRole="button"
            accessibilityState={{
                busy: isLoading,
                disabled: isDisabled || isLoading,
            }}
            disabled={isDisabled || isLoading}
            hitSlop={16}
            onPress={onPress}
            onPressIn={() => {
                isActive.value = true;
                transition.value = withTiming(1, { duration: DURATION }, () => {
                    if (!isActive.value) {
                        transition.value = withTiming(0, {
                            duration: DURATION,
                        });
                    }
                });
            }}
            onPressOut={() => {
                if (transition.value === 1) {
                    transition.value = withTiming(0, { duration: DURATION });
                }
                isActive.value = false;
            }}
            testID={testID}
        >
            <Animated.View
                style={[{ width: width }, { height: height }, animatedStyle, { opacity: isDisabled ? 0.5 : 1 }]}
                className={"button-simple"}
            >
                {isLoading ? (
                    <ActivityIndicator
                        color={"white"}
                        size={18}
                    />
                ) : (
                    <>
                        {Icon}
                        <Text
                            numberOfLines={1}
                            className={"text-button"}
                        >
                            {title}
                        </Text>
                    </>
                )}
            </Animated.View>
        </Pressable>
    );
};
