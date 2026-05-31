// types/wedding.ts
export interface RSVPFormData {
    name: string;
    status: 'yes' | 'no';
    count: number;
    timestamp: string;
}

export interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}