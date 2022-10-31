import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { RolesEnum } from 'src/core/enums/roles.enum';
import { UserEntity } from 'src/core/entities/user.entity';

@Entity({
  name: 'roles',
})
export class RolesEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'enum',
    enum: RolesEnum,
    default: RolesEnum.USER,
  })
  name: RolesEnum;

  @OneToMany(() => UserEntity, (user) => user.role)
  users: UserEntity[];
}
