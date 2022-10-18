import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { UserStatusesEnum } from 'src/core/enums/user-statuses.enum';

@Entity({
  name: 'users',
})
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserStatusesEnum,
    default: UserStatusesEnum.I_AM_NEW_HERE,
  })
  status: UserStatusesEnum;

  @Column({
    type: 'simple-json',
    default: null,
  })
  profile: {
    firstName: string;
    lastName: string;
    DOB: Date; //Date of birth
    COR: string; //Country of residence
    COB: string; //Country of birth
    phoneNumber: string;
  };

  @Column()
  userSalt: string;
}
