import { IsEmail, Length } from "class-validator";
import {
  Arg,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Resolver,
} from "type-graphql";
import { Repository } from "typeorm";
import { myDataSource } from "../config/typeorm";
import { User } from "../entity/user.entity";
import { hash, compareSync } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { environment } from "../config/environment";

@InputType()
class UserInput {
  @Field()
  @Length(3, 64)
  fullName!: string;

  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @Length(8, 254)
  password!: string;
}

@InputType()
class LoginInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  password!: string;
}

@ObjectType()
//esto es para el login que ya no esperamos un input como en @InputType() si no que esperamos una respuesta.
class LoginResponse {
  @Field()
  userId!: number;

  @Field()
  jwt!: string;
}

@Resolver()
export class AuthResolver {
  userRepository: Repository<User>;

  constructor() {
    this.userRepository = myDataSource.getRepository(User);
  }

  @Mutation(() => User)
  async register(
    @Arg("input", () => UserInput) input: UserInput
  ): Promise<User | undefined | null> {
    try {
      const { fullName, email, password } = input;

      const userExists = await this.userRepository.findOne({
        where: { email },
      });

      if (userExists) {
        const error = new Error();
        error.message = "Email is not available";
        throw error;
      }

      const hashedPassword = await hash(password, 10);

      const newUser = await this.userRepository.insert({
        fullName,
        email,
        password: hashedPassword,
      });

      return this.userRepository.findOne({
        where: { id: newUser.identifiers[0].id },
      });
    } catch (error: any) {
      throw new Error(error.message);
    }
  }

  @Mutation(() => LoginResponse)
  //en este caso nos va a devolver un objeto que vamos a crear nosotros
  async login(@Arg("input", () => LoginInput) input: LoginInput) {
    try {
      const { email, password } = input;

      const userFound = await this.userRepository.findOne({ where: { email } });

      //si el usuario no existe continua con el
      if (!userFound) {
        const error = new Error();
        error.message = "Invalid credentials";
        throw error;
      }

      //una vez que el mail existe, chequeamos las contraseñas
      //no podemos chequearla de la misma manera que el usuario entonces usamos el siguiente metodo
      //creamos una variable isValidPasswd, cuando la variable comienza con "is" marcamos que es del tipo boolean
      //compareSync(password, userFound.password); compara la contraseña que paso como impit contra la contraseña del usuario.
      const isValidPasswd: boolean = compareSync(password, userFound.password);

      if (!isValidPasswd) {
        const error = new Error();
        error.message = "Invalid credentials";
        throw error;
      }

      const jwt: string = sign({ id: userFound.id }, environment.JWT_SECRET);

      return {
        userId: userFound.id,
        jwt: jwt,
      };
    } catch (error: any) {
      throw new Error(error.message);
    }
  }
}
