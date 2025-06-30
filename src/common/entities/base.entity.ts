export interface IBaseEntity {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
  archivedAt?: Date | null;
}
