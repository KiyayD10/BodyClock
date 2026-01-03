export const COLORS = {
    // dark mode
    dark: {
        bg: '#0A0E1A',
        card: '#121828',
        border: '#1E2536',
        text: {
            primary: '#FFFFFF',
            secondary: '#A0AEC0',
            tertiary: '#6B7280',
        },
    },

    //light mode
    light: {
        bg: '#FFFFFF',
        card: '#F8F9FA',
        border: '#E5E7EB',
        text: {
            primary: '#1A202C',
            secondary: '#4A5568',
            tertiary: '#A0AEC0',
        },
    },

    // Neon Accents (sama di light & dark)
    neon: {
        cyan: '#00F0FF',
        purple: '#B794F6',
        pink: '#FF00FF',
        blue: '#4D9FFF',
    },
    // Status
    status: {
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444',
    },
} as const;
