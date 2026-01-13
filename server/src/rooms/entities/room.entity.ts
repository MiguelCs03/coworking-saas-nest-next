import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity('rooms')
export class Room {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'int', nullable: false })
    capacity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    price_per_hour: number;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @Column({ type: 'varchar', nullable: true })
    image_url: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    // Relación: Una sala puede tener muchas reservas
    @OneToMany(() => Reservation, (reservation) => reservation.room)
    reservations: Reservation[];
}
