import { IsNotEmpty, IsUUID, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CheckAvailabilityDto {
    @IsNotEmpty()
    @IsUUID()
    room_id: string;

    @IsNotEmpty()
    @IsDateString()
    @Type(() => Date)
    start_time: Date;

    @IsNotEmpty()
    @IsDateString()
    @Type(() => Date)
    end_time: Date;
}
