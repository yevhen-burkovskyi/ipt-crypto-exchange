import { MigrationInterface, QueryRunner } from 'typeorm';

export class RolesSeed1666158925857 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query("INSERT INTO roles (name) VALUES ('USER');");
    await queryRunner.query("INSERT INTO roles (name) VALUES ('MANAGER');");
    await queryRunner.query("INSERT INTO roles (name)  VALUES ('ADMIN');");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DELETE FROM roles WHERE *;');
  }
}
