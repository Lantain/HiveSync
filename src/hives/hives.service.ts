import { Injectable } from "@nestjs/common";
import { FirebaseAdmin, InjectFirebaseAdmin } from "nestjs-firebase";
import { Hive, Record } from '../model';
import { RecordsService } from '../records/records.service';
import { firebaseDateToMilliseconds } from "src/util";

@Injectable()
export class HivesService {
    constructor(
        @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
        private readonly recordsService: RecordsService
    ) {}

    async get(hiveId: string): Promise<Hive> {
        const hive = await this.firebase.firestore.collection('hives').doc(hiveId).get()
        if (!hive.exists) return null
        const hiveData = hive.data()
        return {
            id: hiveId,
            ...(hiveData as Hive),
            lastSeenAt: firebaseDateToMilliseconds(hiveData.lastSeenAt)
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

    async addRecord(hiveId: string, rec: Record) {
        await this.recordsService.addRecord(hiveId, rec)
        const hive = await this.firebase.firestore.collection('hives').doc(hiveId).get()
        const hiveData = hive.data()
        if (!hiveData.rec) {
            hiveData.rec = {}
        }
        const existingRecord = hiveData.rec;
        if (rec?.temperature) existingRecord.temperature = rec.temperature;
        if (rec?.humidity) existingRecord.humidity = rec.humidity;
        if (rec?.weight) existingRecord.weight = rec.weight;

        await this.firebase.firestore.doc(`hives/${hiveId}`).set({
            rec: existingRecord,
            lastSeenAt: new Date()
        }, { merge: true })
    }
}