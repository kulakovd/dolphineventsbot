import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from '../domain/event';
import { User } from '../domain/user';
import { UserEntity } from '../user/user.entity';

@Entity()
export class EventEntity implements Event {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity)
  organizer: User;

  @Column()
  organizerId: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ nullable: true })
  image?: string;

  @Column()
  isOnline: boolean;

  @Column({ nullable: true })
  link?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  maxParticipants?: number;

  @ManyToMany(() => UserEntity)
  participants: User[];
}
