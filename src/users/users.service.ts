import { Injectable } from "@nestjs/common";
import { InjectFirebaseAdmin, FirebaseAdmin } from "nestjs-firebase";

@Injectable()
export class UsersService {
    constructor(
        @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
    ) {}
    
    async getUser(email) {
        const userSnapshot = await this.firebase.firestore.collection('users').where('email', '==', email).get()
        return userSnapshot.docs.length ? userSnapshot.docs[0] : null
    }
}