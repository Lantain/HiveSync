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
                name: fuser.name,
                hives: []
            });
        }
    }

    async connectHive(email: string, hiveId: string) {
        await this.firebase.firestore.doc(`users/${email}`).update({
            hives: firestore.FieldValue.arrayUnion(
                this.firebase.firestore.doc(`hives/${hiveId}`)
            )
        })
    }

    async getUser(email) {
        const userSnapshot = await this.firebase.firestore.collection('users').doc(email).get()
        return userSnapshot.exists ? {
            id: email,
            email,
            ...userSnapshot.data()
        } : null
    }
}