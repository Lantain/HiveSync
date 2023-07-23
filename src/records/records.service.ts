import { Injectable } from "@nestjs/common";
import { FirebaseAdmin, InjectFirebaseAdmin } from "nestjs-firebase";
import * as moment from 'moment'
import { Record } from '../model';
import { firebaseDateToMilliseconds } from "src/util";

@Injectable()
export class RecordsService {
    constructor(
        @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
    ) { }

    async getRecords(hiveId: string, limit: number = 10, offset: number = 0): Promise<Record[]> {
        const snapshot = await this.firebase.firestore.collection(`hives/${hiveId}/records`)
            .orderBy('createdAt', 'desc')
            .limit(limit)
            .offset(offset)
            .get();

        return snapshot.docs.map(doc => doc.data()).map(
            doc => ({ ...doc, createdAt: firebaseDateToMilliseconds(doc.createdAt) })
        )
    }
    
    async addRecord(hiveId: string, rec: Record) {
        const id = `${rec.sensorId}-${moment().format('YYMMDD-HHmmss')}`
        await this.firebase.firestore.collection(`hives/${hiveId}/records`).doc(id).set({
            ...rec,
            createdAt: new Date()
        })
    }
}