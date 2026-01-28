import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Room } from './room.entity';

export enum MediaType {
    IMAGE = 'image',
    VIDEO = 'video',
}

@Entity('room_media')
export class RoomMedia {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    url: string;

    @Column({
        type: 'enum',
        enum: MediaType,
        default: MediaType.IMAGE
    })
    type: MediaType;

    @ManyToOne(() => Room, (room) => room.media, { onDelete: 'CASCADE' })
    room: Room;
}
