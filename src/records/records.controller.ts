import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { RecordsService } from "./records.service";
import { AuthGuard } from "src/auth/auth.guard";

@Controller("hives/:hive/records")
export class RecordsController {
    constructor(
        private readonly recordsService: RecordsService,
    ) { }

    @Get('/')
    @UseGuards(AuthGuard)
    async getRecords(@Param('hive') hiveId, @Query('limit') limit: string, @Query('offset') offset: string) {
        const records = await this.recordsService.getRecords(hiveId, +limit || 10, +offset || 0)
        return records
    }
}