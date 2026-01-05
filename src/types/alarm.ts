// Format waktu jam & menit
export interface AlarmTime {
    hours: number;
    minutes: number;
}

// Config utama untuk setting alarm
export interface AlarmConfig {
    id: string;
    type: 'sleep' | 'wake';
    time: AlarmTime;
    enabled: boolean;
    repeatDaily: boolean;
    title: string;
    body: string;
    sound?: string;
}   

// Output schedule alarm
export interface AlarmScheduleResult {
    success: boolean;
    notificationId?: string;
    error?: string;
}