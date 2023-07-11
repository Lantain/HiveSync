import { Record } from "src/records/model"

export interface Hive {
    id?: string
    name: string
    lastSeenAt?: number
    records?: Record[]
}