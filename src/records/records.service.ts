import { Injectable } from "@nestjs/common";
import { FirebaseAdmin, InjectFirebaseAdmin } from "nestjs-firebase";
import { Record } from "./model";

@Injectable()
export class RecordsService {
    constructor(
        @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
    ) {}

    async add(rec: Record) {
        await this.firebase.firestore.collection("records").add({
            ...rec,
            createdAt: Date.now()
        })
    }
}