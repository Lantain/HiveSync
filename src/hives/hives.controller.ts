import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { HivesService } from './hives.service';
import { AuthGuard } from "src/auth/auth.guard";
import { UsersService } from "src/users/users.service";

@Controller("hives")
export class HivesController {
    constructor(
        private readonly hivesService: HivesService,
        private readonly usersService: UsersService
    ) {}

    @Post()
    @UseGuards(AuthGuard)
    async createHive(@Body() body) {
        await this.hivesService.create(body)
    }

    @Get('/:hive')
    @UseGuards(AuthGuard)
    async getHive(@Param('hive') hiveId) {
        return await this.hivesService.get(hiveId)
    }
    
    @Post('/:hive/connect')
    @UseGuards(AuthGuard)
    async connectHive(@Param('hive') hiveId, @Req() req) {
        if (req.user.hives?.find(h => h.path === `hives/${hiveId}`)) {
            return
        }
        const hive =  await this.hivesService.get(hiveId)
        if (hive) {
            await this.usersService.connectHive(req.user.email, hiveId)
        }
    }

    @Get()
    @UseGuards(AuthGuard)
    async myHives(@Req() req) {
        const hives = await Promise.all(
            (req.user.hives || []).map(
                h => this.getHive(h.id)
            )
        )
        return hives
    }
}