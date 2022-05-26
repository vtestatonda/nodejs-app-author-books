import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
//typeorm maneja lo que va a hacer la estructura de nuestras tablas mediante una class
import { Author } from "./author.entity";
import { Field, ObjectType } from "type-graphql";
//cuando no queremos retornar algo que no es un numero o string. queremos retornar un objeto lo especificamos con field

@ObjectType()
@Entity()
//entity es para poder extender de la clase entity
//esta clase tiene que ser interpretada como una entity por typeorm
export class Book {
  @Field()
  @PrimaryGeneratedColumn()
  //toda tabla tiene que tener una primarycolumn
  //nosotros queremos que sea autoincrementable, colocamos un numero y se va sumando a medida que agregamos un registro
  id!: number;
  //con el ! le decimos que siempre lo vamos a inicializar.
  @Field()
  @Column()
  title!: string;

  @Field(() => Author)
  @ManyToOne(() => Author, (author) => author.books, { onDelete: "CASCADE" })
  author!: Author;
  //Author lo queremos tener en otra tabla y relacionarlos.
  //ver cambiar number por autor

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  //createDateColum es un decorado.
  createAt!: string;
}

//tenemos que hacer la relacion de que cada libre tiene un author y cada autor tiene muchos libros. Relacin one to many o many to one
