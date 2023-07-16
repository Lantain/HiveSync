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
        const recordsSnapshot = await this.firebase.firestore.collection('records').where('hiveId', '==', hiveId).orderBy('createdAt').limit(10).get();
        const records = recordsSnapshot.docs as any[]
        return {
            ...(hive.data() as Hive),
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
        await this.firebase.firestore.collection(`hives/${hiveId}/records`).doc(`${rec.sensorId}-${moment().format('YYMMDD-hhmmss')}`).set({
            ...rec,
            createdAt: new Date()
        })
    }
}