export interface Record {
    hiveId?: string
    temperature?: number
    humidity?: number
    co2?: number
    weight?: number
    payload?: string
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