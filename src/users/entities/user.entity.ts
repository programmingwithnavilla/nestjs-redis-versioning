import { BaseEntity } from 'src/common/entities/base.entity';

export class UserEntity extends BaseEntity {
  id: number;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  archivedAt?: Date | null;

  constructor(partial: Partial<UserEntity>) {
    super();
    Object.assign(this, partial);
  }
}
