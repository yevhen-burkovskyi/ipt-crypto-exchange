import { MigrationInterface, QueryRunner } from 'typeorm';
import { readFileSync } from 'fs';
import { genSalt, hash } from 'bcrypt';

import { EncryptResponse } from 'src/modules/bcrypt/dtos/responses/encrypt.response';
import { RolesEnum } from 'src/core/enums/roles.enum';
import { UserStatusesEnum } from 'src/core/enums/user-statuses.enum';

type AdminConfig = { email: string; password: string };

export class AdminSeed1666158925858 implements MigrationInterface {
  private config: any;
  private admin: AdminConfig;

  constructor() {
    const pathToConfig = process.env.NODE_CONFIG_DIR;
    const fileName = process.env.NODE_ENV + '.json';
    this.config = JSON.parse(
      readFileSync(pathToConfig + '/' + fileName).toString(),
    );
    this.admin = this.config.admin;
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    const adminRole = (
      await queryRunner.query(
        `SELECT * FROM roles WHERE name='${RolesEnum.ADMIN}';`,
      )
    )[0];
    const encryptData = await this.encrypt(
      this.admin.password,
      this.config.security,
    );
    await queryRunner.query(`
        INSERT INTO users (email, password, "userSalt", status, "roleId")
        VALUES ('${this.admin.email}', '${encryptData.encryptedPassword}', '${encryptData.salt}', '${UserStatusesEnum.ACTIVE}', '${adminRole.id}');
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM users WHERE email='${this.admin.email}';`,
    );
  }

  private async encrypt(
    password: string,
    config: any,
  ): Promise<EncryptResponse> {
    const salt: string = await genSalt(config.saltRounds);
    const passwordWithGlobalSalt: string = password + config.globalSalt;
    const encryptedPassword: string = await hash(passwordWithGlobalSalt, salt);
    return { encryptedPassword, salt };
  }
}
