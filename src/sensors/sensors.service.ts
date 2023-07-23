import { Injectable } from "@nestjs/common";
import { FirebaseAdmin, InjectFirebaseAdmin } from "nestjs-firebase";
import { HivesService } from "src/hives/hives.service";
import { Sensor, Record } from "src/model";

@Injectable()
export class SensorsService {
    constructor(
        @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
        private readonly hivesService: HivesService
    ) {}

    async create(sensor: Sensor) {
        const id = sensor.name.replace(/\-/gi, '').replace(/ /gi, '').toLowerCase().slice(0, 8)
        await this.firebase.firestore.collection('sensors').doc(id).set({
            ...sensor,
            token: null,
            lastSeenAt: null
        })
    }

    async notifyAlive(sensorId: string) {
        await this.firebase.firestore.collection('sensors').doc(sensorId).set({
            lastSeenAt: new Date()
        }, { merge: true })
    }

    async addRecord(sensorId: string, data: Record) {
        const snapshot = await this.firebase.firestore.collection('hives').where('sensors', 'array-contains', this.firebase.firestore.doc(`/sensors/${sensorId}`)).get()
        const hive = snapshot.docs.length ? snapshot.docs[0] : null
        if (hive?.id) {
            await this.hivesService.addRecord(hive.id, { sensorId, ...data });
        }
    }
}