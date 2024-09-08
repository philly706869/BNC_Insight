import { ISession } from "connect-typeorm";
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity()
export class Session implements ISession {
  @Index()
  @Column("bigint")
  public expiredAt = Date.now();

  @PrimaryColumn("varchar", { length: 255 })
  public id = "";

  @Column("text")
  public json = "";

  @CreateDateColumn()
  declare createdAt: Date;

  @UpdateDateColumn()
  declare updatedAt: Date;

  @DeleteDateColumn()
  public destroyedAt?: Date;
}
