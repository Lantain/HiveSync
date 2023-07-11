import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "src/auth/auth.guard";
import { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
    ) {}

    @Get('me')
    @UseGuards(AuthGuard)
    async me(@Req() req) {
        const u = await this.usersService.getUser(req.user.email)
        return u
    }
}