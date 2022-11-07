import { RolesEntity } from 'src/core/entities/roles.entity';
import { RegistrationDto } from 'src/domains/users/dtos/dto/registration.dto';

export type RegistrationDtoWithRole = RegistrationDto & { role: RolesEntity };
