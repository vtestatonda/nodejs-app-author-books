import dotenv from "dotenv";
dotenv.config();
//lo anterior es para tomar los datos de .env
//cargamos la libreria = npm i dotenv --save = nos permite buscar en el archivo .env todas las variables y cargarlas en el archivo environment.
export const environment = {
  PORT: process.env.PORT,
  DB_HOST: process.env.DB_HOST,
  DB_PORT: process.env.DB_PORT,
  DB_USERNAME: process.env.DB_USERNAME,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_DATABASE: process.env.DB_DATABASE,
  JWT_SECRET: process.env.JWT_SECRET || "Default",
  //el || significa que no puede devolver undefined, eso es porque sign en resolvers no lo permite
};
