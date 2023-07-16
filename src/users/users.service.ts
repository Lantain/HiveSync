import { Injectable } from "@nestjs/common";
import { InjectFirebaseAdmin, FirebaseAdmin } from "nestjs-firebase";
import { firestore } from 'firebase-admin'
import { DecodedIdToken } from "firebase-admin/lib/auth/token-verifier";
@Injectable()
export class UsersService {
    constructor(
        @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
    ) {}

    async authorizeUser(fuser: DecodedIdToken) {
        const usersSnapshot = await this.firebase.firestore.collection('users').doc(fuser.email).get()
        if (usersSnapshot.exists) {
            return usersSnapshot
        } else {
            await this.firebase.firestore.collection('users').doc(fuser.email).set({
                hives: []
            });
        }
    }

    async connectHive(userId: string, hiveId: string) {
        await this.firebase.firestore.doc(`users/${userId}`).update({
            hives: firestore.FieldValue.arrayUnion(
                this.firebase.firestore.doc(`hives/${hiveId}`)
            )
        })
    }

    async getUser(email) {
        const userSnapshot = await this.firebase.firestore.collection('users').doc(email).get()
        return userSnapshot.exists ? userSnapshot.data() : null
    }
}