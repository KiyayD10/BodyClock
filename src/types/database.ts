export interface ScheduleTemplate {
    id: number;
    name: string;
    time: string;
    description?: string;
    icon?: string;
    color?: string;
    is_active?: number;
    create_at?: string;
    update_at?: string;
}

export interface DailyState {
    id: number;
    schedule_id: number;
    completed: number;
    completed_at?: string;
    notes?: string;
    date: string;
}

export interface Settings {
    key: string;
    value: string;
    updated_at: string;
}

// DTOs untuk buat baru
export interface CreateScheduleTemplateDTO {
    name: string;
    time: string;
    description?: string;
    icon?: string;
    color?: string;
}

export interface CreateDailyStateDTO {
    schedule_id: number;
    date: string;
}

export interface UpdateDailyStateDTO {
    completed: number;
    completed_at?: string;
    notes?: string;
}