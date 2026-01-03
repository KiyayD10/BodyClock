import { Pressable, Animated, StyleSheet } from 'react-native';
import { useEffect, useRef } from 'react';
import { useThemeStore } from '@/store/themeStore';
import { useTheme } from '@/hooks/useTheme';
import { RADIUS } from '@/constants/theme';

export function ThemeToggle() {
    const toggleTheme = useThemeStore((state) => state.toggleTheme);
    const { colors, isDark } = useTheme();

    // Simpan value animasi di memori (ref) biar gak reset tiap render.
    const animatedValue = useRef(new Animated.Value(isDark ? 1 : 0)).current;

    // Trigger animasi 'spring' setiap kali status isDark berubah
    useEffect(() => {
        Animated.spring(animatedValue, {
            toValue: isDark ? 1 : 0,
            useNativeDriver: true, 
            friction: 7, 
        }).start();
    }, [isDark, animatedValue]);

    // Konversi nilai 0-1 menjadi posisi pixel 
    const translateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 30],
    });

    return (
        <Pressable
            onPress={toggleTheme}
            style={[
                styles.toggle,
                {
                    backgroundColor: isDark ? colors.neon.purple : colors.neon.cyan,
                },
            ]}
        >
            <Animated.View
                style={[
                    styles.thumb,
                    {
                        backgroundColor: colors.bg,
                        transform: [{ translateX }],
                    },
                ]}
            />
        </Pressable>
    );
}

const styles = StyleSheet.create({
    toggle: {
        width: 60,
        height: 32,
        borderRadius: RADIUS.full,
        padding: 2,
        justifyContent: 'center',
    },
    thumb: {
        width: 28,
        height: 28,
        borderRadius: RADIUS.full,
    },
});