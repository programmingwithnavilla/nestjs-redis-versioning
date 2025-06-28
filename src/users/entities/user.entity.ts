import { IBaseEntity } from 'src/common/entities/base.entity';

export class UserEntity implements IBaseEntity {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date | null;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
