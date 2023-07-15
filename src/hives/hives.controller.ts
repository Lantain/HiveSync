import { BadRequestException, Body, Controller, Get, Param, Post } from "@nestjs/common";
import { HivesService } from './hives.service';
import { RecordsService } from "src/records/records.service";
import { isRecordInput } from "src/records/model";

@Controller("hives")
export class HivesController {
    constructor(
        private readonly hivesService: HivesService,
        private readonly recordsService: RecordsService
    ) {}

    @Post()
    async createHive(@Body() body) {
        await this.hivesService.create(body)
    }

    @Post('/:hive/records')
    async addRecord(@Body() body, @Param('hive') hiveId) {
        await this.hivesService.notifyAlive(hiveId)
        console.log('New record!', body)
        if (isRecordInput(body)) {
            await this.recordsService.add({ ...body, hiveId })
        } else {
            throw new BadRequestException()
        }
        return {
            success: true
        }
    }

    @Get('/:hive')
    async getHive(@Param('hive') hiveId) {
        await this.hivesService.get(hiveId)
    }
}