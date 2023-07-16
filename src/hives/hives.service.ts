import { Injectable } from "@nestjs/common";
import { FirebaseAdmin, InjectFirebaseAdmin } from "nestjs-firebase";
import { Hive, Record } from '../model';
import * as moment from 'moment'

@Injectable()
export class HivesService {
    constructor(
        @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
    ) {}

    async get(hiveId: string): Promise<Hive> {
        const hive = await this.firebase.firestore.collection('hives').doc(hiveId).get()
        if (!hive.exists) return null
        const hiveData = hive.data()
        const recordsSnapshot = await this.firebase.firestore.collection(`hives/${hiveId}/records`).orderBy('createdAt', 'desc').limit(10).get();
        const records = recordsSnapshot.docs.map(d => d.data()) as any[]
        return {
            ...(hiveData as Hive),
            records
        }
    }

    async getHives() {
        const snapshot = await this.firebase.firestore.collection('hives').get();
        return snapshot.docs
    }

    async create(hive: Hive) {
        const id = hive.name.replace(/\-/gi, '').replace(/ /gi, '').toLowerCase().slice(0, 8)
        await this.firebase.firestore.collection('hives').doc(id).set({
            ...hive,
            lastSeenAt: null
        })
    }

    async notifyAlive(hiveId: string) {
        await this.firebase.firestore.collection('hives').doc(hiveId).set({
            lastSeenAt: new Date()
        }, { merge: true })
    }

    async addRecord(hiveId: string, rec: Record) {
        const id = `${rec.sensorId}-${moment().format('YYMMDD-HHmmss')}`
        await this.firebase.firestore.collection(`hives/${hiveId}/records`).doc(id).set({
            ...rec,
            createdAt: new Date()
        })
    }
}