import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { User } from '../domain/user';

@Entity()
export class UserEntity implements User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  telegramId: string;

  @Column({ nullable: true })
  firstName?: string;

  @Column({ nullable: true })
  lastName?: string;

  @Column({ nullable: true })
  telegramUsername?: string;

  @Column({ nullable: true })
  photoUrl?: string;
}
