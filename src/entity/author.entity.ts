import {
  Entity,
  Column,
  CreateDateColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Book } from "./book.entity";
import { Field, ObjectType } from "type-graphql";
//los decoradores field y objetType especificamos que los campos van a sar los campos que nos devuelva graphql

@ObjectType()
//cuando no queremos retornar algo que no es un numero o string. queremos retornar un objeto lo especificamos con el decorador objettype y luego a cada campo con field
@Entity()
//esta clase tiene que ser interpretada como una entity por typeorm
export class Author {
  @Field()
  @PrimaryGeneratedColumn()
  //toda tabla tiene que tener una primarycolumn, nosotros queremos que sea autoincrementable
  id!: number;

  @Field(() => String)
  @Column()
  fullName!: string;
  //CUIDADO CON el String y string la mayuscula cambia, hubo un bug y me costo bastante solucionarlo

  @Field(() => [Book], { nullable: true })
  //nos devuelve un array
  @OneToMany(() => Book, (Book) => Book.author, {
    nullable: true,
    onDelete: "CASCADE",
  })
  books!: Book[];
  //es un array de libros
  //ver cambiar number por autor

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp" })
  createdAt!: string;
}

//tenemos que hacer la relacion de que cada libre tiene un author y cada autor tiene muchos libros. Relacin one to many o many to one
