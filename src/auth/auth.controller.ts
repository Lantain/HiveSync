import { Body, Controller, Post } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { InjectFirebaseAdmin, FirebaseAdmin } from "nestjs-firebase";
import { UsersService } from "src/users/users.service";

@Controller("auth")
export class AuthController {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
    ) {}

    @Post()
    async auth(@Body() body) {
        if (body?.idToken) {
            const firebaseUser = await this.firebase.auth.verifyIdToken(body.idToken)
            await this.usersService.authorizeUser(firebaseUser);
            const payload = { email: firebaseUser.email };

            return {
                token: await this.jwtService.signAsync(payload),
            }
        } else {
            return null
        }
    }
}