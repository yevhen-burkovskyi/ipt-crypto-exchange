import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from 'src/core/entities/user.entity';

@Entity({ name: 'fileUploads' })
export class FileUploadsEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  image: string;

  @ManyToOne(() => UserEntity, (user) => user.fileUploads)
  user: UserEntity;
}
