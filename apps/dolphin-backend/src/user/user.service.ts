import { Injectable } from '@nestjs/common';
import { User } from '../domain/user';
import { UserEntity } from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TelegramUser } from './telegramUser';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  private async findUserByTelegramId(telegramId: string): Promise<UserEntity | null> {
    return this.userRepository.findOneBy({
      telegramId,
    });
  }

  private async updateUser(user: UserEntity, tgUser: TelegramUser): Promise<void> {
    user.firstName = tgUser.firstName;
    user.lastName = tgUser.lastName;
    user.telegramUsername = tgUser.telegramUsername;
    user.photoUrl = tgUser.photoUrl;
    await this.userRepository.save(user);
  }

  private createUser(tgUser: TelegramUser): Promise<User> {
    return this.userRepository.save({
      telegramId: tgUser.telegramId,
      firstName: tgUser.firstName,
      lastName: tgUser.lastName,
      telegramUsername: tgUser.telegramUsername,
      photoUrl: tgUser.photoUrl,
    });
  }

  async syncUserWithTg(tgUser: TelegramUser): Promise<User> {
    const user = await this.findUserByTelegramId(tgUser.telegramId);
    if (user != null) {
      await this.updateUser(user, tgUser);
      return user;
    }

    return this.createUser(tgUser);
  }
}
