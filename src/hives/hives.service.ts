import { Injectable } from "@nestjs/common";
import { FirebaseAdmin, InjectFirebaseAdmin } from "nestjs-firebase";
import { Hive } from "./model";

@Injectable()
export class HivesService {
    constructor(
        @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
    ) {}

    async get(hiveId: string): Promise<Hive> {
        const hive = await this.firebase.firestore.collection('hives').doc(hiveId).get()
        const recordsSnapshot = await this.firebase.firestore.collection('records').where('hiveId', '==', hiveId).get();
        const records = recordsSnapshot.docs as any[]
        return {
            ...(hive.data() as Hive),
            records
        }

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
            lastSeenAt: Date.now()
        }, { merge: true })
    }
}