import { Body, Controller, Param, Post, BadRequestException, UseGuards } from '@nestjs/common';
import { SensorsService } from "./sensors.service";
import { isRecordInput } from "src/model";
import { AuthGuard } from 'src/auth/auth.guard';

@Controller("sensors")
export class SensorsController {
    constructor(
        private readonly sensorsService: SensorsService
    ) { }

    @Post()
    async createSensor(@Body() body) {
        await this.sensorsService.create(body)
    }

    @Post('/:sensor/records')
    async records(@Body() body, @Param('sensor') sensorId) {
        if (isRecordInput(body)) {
            await this.sensorsService.addRecord(sensorId, body)
        } else {
            throw new BadRequestException()
        }
        return {
            success: true
        }
    }
}