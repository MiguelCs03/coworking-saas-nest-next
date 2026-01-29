import { IsString, IsNumber, IsOptional, IsArray, ValidateNested, IsEnum, Min } from 'class-validator';
import { Type } from 'class-transformer';

export enum MediaType {
    IMAGE = 'image',
    VIDEO = 'video',
}

export class CreateMediaDto {
    @IsString()
    url: string;

    @IsEnum(MediaType)
    type: MediaType;
}

export class CreateRoomDto {
    @IsString()
    name: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    @Min(1)
    capacity: number;

    @IsNumber()
    @Min(0)
    price_per_hour: number;

    @IsOptional()
    @IsString()
    image_url?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateMediaDto)
    media?: CreateMediaDto[];
}
