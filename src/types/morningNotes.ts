export interface MorningNote {
    id: number;
    date: string;
    mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
    sleep_quality: number;
    energy_level: number;
    notes?: string;
    completed_at: string;
}

export interface CreateMorningNoteDTO {
    mood: 'great' | 'good' | 'okay' | 'bad' | 'terrible';
    sleep_quality: number;
    energy_level: number;
    notes?: string;
}

export const MOOD_EMOJI: Record<MorningNote['mood'], string> = {
    great: '😄',
    good: '🙂',
    okay: '😐',
    bad: '😕',
    terrible: '😞',
};