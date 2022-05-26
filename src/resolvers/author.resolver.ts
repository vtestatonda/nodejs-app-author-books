import {
  Mutation,
  Query,
  Resolver,
  Arg,
  Field,
  InputType,
  ID,
} from "type-graphql";
import { Author } from "../entity/author.entity";
import { Repository } from "typeorm";
import { myDataSource } from "../config/typeorm";
import { Length } from "class-validator";

//los inputType traen datos que se necesitan mas abajo para hacer las query y mutation
@InputType()
class AuthorInput {
  @Field(() => String)
  @Length(3, 64)
  fullName!: string;
}

@InputType()
class AuthorIdInput {
  @Field(() => Number)
  id!: number;
  //CUIDADO CON el Number y number la mayuscula cambia, hubo un bug y me costo bastante solucionarlo
}

@InputType()
class AuthorUpdateInput {
  @Field(() => Number)
  id!: number;
  //! significa obligatorio

  @Field()
  fullName?: string;
  //? significa opcional
}

@Resolver()
export class AuthorResolver {
  //createAuthor va a ser una mutation, se encarga de guardar y generar datos en nuesta Base de datos.
  //de la misma manera que haciamos con book que especificabamos que era una query hacemos lo mismo pero le decimos que es una mutation.

  authorRepository: Repository<Author>;
  //creamos el authorrepository de tipo repository y le pasamos el Author

  constructor() {
    //creamos el construtor de la clase. a este metodo que creamos va a ser igual a getrepository de la entidad Author
    //de esta manera tenemos habilitado todos los metodos para consunlta en la base de datos.
    this.authorRepository = myDataSource.getRepository(Author);
  }

  @Mutation(() => Author)
  //@Mutation es e typegraphql. es mutation porque altera la DB
  //una mutation se encarga de guardar o generar datos en nuestra base de datos
  //le decimos que nos devuelva un objeto del tipo author. Una vez que lo creemos vamos a querer que nos devuelva todos los datos de ese author que creamos.
  //una mutacion va a devolver un objeto del tipo author con las mismas propiedades que tiene nuestra propiedad.
  async createAuthor(
    //el arg=argumento nos va a retornar un objeto (AuthorInput) y vamos a resibir lo que es el input que es de tipo authorinput
    @Arg("input", () => AuthorInput) input: AuthorInput
  ): Promise<Author | undefined | null> {
    try {
      //create aurthor va a recivir los valores de authorentity
      const createdAuthor = await this.authorRepository.insert({
        fullName: input.fullName,
      });
      const result = await this.authorRepository.findOne({
        where: { id: createdAuthor.identifiers[0].id },
      });
      //findOne devuelve un solo valor, un bojeto

      return result;
    } catch {
      console.error;
    }
  }

  @Query(() => [Author])
  //@Query es de typegraphql
  //va a devolver un array [] de author
  async getAllAuthors(): Promise<Author[]> {
    //me va a devolver una promesa y author(array)
    return await this.authorRepository.find({ relations: ["books"] });
    //find devuelve un array
  }

  @Query(() => Author)
  //nos va a devolver un author
  async getOneAuthor(
    @Arg("input", () => AuthorIdInput) input: AuthorIdInput
    //vamos a tener un argumento que pide el id del author. para eso creamos un nuevo inputtype
    //el input nos va a retornar authoridinput. Nuestra variable se va a llamar input y va a ser del tipo authoridinput
  ): Promise<Author | undefined | null> {
    try {
      const author = await this.authorRepository.findOne({
        where: { id: input.id },
      });
      if (!author) {
        const error = new Error();
        error.message = "Author does not exist";
        throw error;
      }
      return author;
    } catch (e: any) {
      throw new Error(e);
    }
  }

  @Mutation(() => Author)
  //mutation porque altera la DB
  async updateOneAuthor(
    @Arg("input", () => AuthorUpdateInput) input: AuthorUpdateInput
  ): Promise<Author | undefined | null> {
    const authorExists = await this.authorRepository.findOne({
      where: { id: input.id },
    });

    if (!authorExists) {
      throw new Error("Auhtor does not exists");
    }

    const updatedAuthor = await this.authorRepository.save({
      id: input.id,
      fullName: input.fullName,
    });

    return await this.authorRepository.findOne({
      where: { id: updatedAuthor.id },
    });
  }

  @Mutation(() => Boolean)
  async deleteOneAuthor(
    @Arg("input", () => AuthorIdInput) input: AuthorIdInput
  ): Promise<Boolean> {
    try {
      const author = await this.authorRepository.findOne({
        where: { id: input.id },
      });
      if (!author) throw new Error("Author does not exist");
      await this.authorRepository.delete(input.id);
      return true;
    } catch (e: any) {
      throw new Error(e.message);
    }
  }
}
