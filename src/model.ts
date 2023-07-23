export interface User {
    name: string
    hives: string[]
}

export interface Hive {
    id?: string
    name: string
    lastSeenAt?: number
    records?: Record[]
}

export interface Record {
    hiveId?: string
    sensorId?: string
    temperature?: number
    humidity?: number
    co2?: number
    weight?: number
    payload?: string
    createdAt?: number
}

export interface Sensor {
    id?: string
    name: string
    lastSeenAt?: number
}

export const isRecordInput = (value): value is Record => 
    value 
    && typeof value === 'object' 
    && (
        typeof value.temperature === 'number'
        || typeof value.humidity === 'number'
        || typeof value.co2 === 'number'
        || typeof value.weight === 'number'
        || typeof value.payload === 'string'
    )