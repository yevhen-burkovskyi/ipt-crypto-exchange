import { UserEntity } from 'src/core/entities/user.entity';
import { SaveImageDto } from 'src/domains/file-uploads/dtos/dto/save-image.dto';

export type ImageWithUser = Omit<SaveImageDto, 'userId'> & { user: UserEntity };
