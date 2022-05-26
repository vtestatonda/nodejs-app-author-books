import path from "path";
import { DataSource } from "typeorm";
import { Author } from "../entity/author.entity";
//el tutor usa createConnection que esta en desuso, por esa razon usamos Datasource
//nos permite crear una aplicacion a partir de unos parametros que le vamos a pasar, le indicamos a que DB nos coenctamos, usuarios y contraseña
import { environment } from "./environment";

console.log(environment);

export const myDataSource = new DataSource({
  type: "postgres",
  //como usamos postgres vamos a tener que instalar un paquete
  port: Number(environment.DB_PORT),
  //el puerto por default de postgress es 5432
  username: environment.DB_USERNAME,
  password: environment.DB_PASSWORD,
  database: environment.DB_DATABASE,
  entities: [path.join(__dirname, "../entity/**/**.ts")],
  //usamos __dirname que nos lleva a la carpeta que nos encontramos ahora y con el paquete path nos permite subir un nivel para que llegue a la carpeta entity
  //listado de las rutas locales donde van a estar las entidades que vamos a crear. Carpeta entity
  //ingresa a entity y busca todos los archivos .ts
  synchronize: true,
});
myDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization", err);
  });

/*export async function connect() {
  //como es async le colocamos el await
  await myDataSource();
  console.log("Database running");
}*/
//las variables las guardamos en lo que se llama variables de entorno (seguridad, no exponer info sensible, poder reutilizarla), Creamos .env y lo ignoramos en el github
