import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', nullable: false })
    name: string;

    @Column({ type: 'varchar', unique: true, nullable: false })
    email: string;

    @Column({
        type: 'varchar',
        nullable: false,
        select: false, // No incluir password en queries por defecto
    })
    password: string;

    @Column({
        type: 'varchar',
        default: 'client',
    })
    role: 'admin' | 'client';

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    // Relación: Un usuario puede tener muchas reservas
    @OneToMany(() => Reservation, (reservation) => reservation.user)
    reservations: Reservation[];
}
