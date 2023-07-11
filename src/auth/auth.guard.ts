import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { FirebaseAdmin, InjectFirebaseAdmin } from "nestjs-firebase";
import { Observable } from "rxjs";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        @InjectFirebaseAdmin() private readonly firebase: FirebaseAdmin,
    ) {}
    
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)
        if (!token) {
            throw new UnauthorizedException()
        }

        try {
            const payload = await this.firebase.auth.verifyIdToken(token)
            request['user'] = payload
        } catch {
            throw new UnauthorizedException();
        }

        return true
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.get("authorization")?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
      }
}