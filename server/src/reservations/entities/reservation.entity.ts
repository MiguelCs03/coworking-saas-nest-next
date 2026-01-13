import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Room } from '../../rooms/entities/room.entity';

@Entity('reservations')
export class Reservation {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid', nullable: false })
    user_id: string;

    @Column({ type: 'uuid', nullable: false })
    room_id: string;

    @Column({ type: 'timestamp', nullable: false })
    start_time: Date;

    @Column({ type: 'timestamp', nullable: false })
    end_time: Date;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: false })
    total_price: number;

    @Column({
        type: 'varchar',
        default: 'confirmed',
    })
    status: 'confirmed' | 'cancelled' | 'completed';

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    // Relación: Muchas reservas pertenecen a un usuario
    @ManyToOne(() => User, (user) => user.reservations, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'user_id' })
    user: User;

    // Relación: Muchas reservas pertenecen a una sala
    @ManyToOne(() => Room, (room) => room.reservations, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'room_id' })
    room: Room;
}
