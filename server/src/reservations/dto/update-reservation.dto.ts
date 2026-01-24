import { IsOptional, IsDateString, IsNumber, IsIn, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateReservationDto {
    @IsOptional()
    @IsUUID()
    room_id?: string;

    @IsOptional()
    @IsDateString()
    @Type(() => Date)
    start_time?: Date;

    @IsOptional()
    @IsDateString()
    @Type(() => Date)
    end_time?: Date;

    @IsOptional()
    @IsNumber()
    total_price?: number;

    @IsOptional()
    @IsIn(['confirmed', 'cancelled', 'completed'])
    status?: 'confirmed' | 'cancelled' | 'completed';
}
