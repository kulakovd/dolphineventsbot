import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
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

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'timestamp' })
  startDate: Date;

  @Column({ type: 'timestamp' })
  endDate: Date;

  @Column({ nullable: true })
  image?: string;

  @Column({ nullable: true })
  link?: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  maxParticipants?: number;

  @ManyToMany(() => UserEntity)
  @JoinTable()
  participants: User[];
}
