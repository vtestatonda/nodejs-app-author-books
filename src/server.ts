import Express from "express";
//express friendwork que nos ayuda a crear un servidor
import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
//traduce el javascript, typescript (traido de book.resolver) en graphql
import { BookResolver } from "./resolvers/book.resolver";

import { AuthorResolver } from "./resolvers/author.resolver";
import { AuthResolver } from "./resolvers/auth.resolver";
//import { AuthResolver } from "./resolvers/auth.resolver";

//a continuacion es la configuracion a nuestro server apollo
export async function startServer() {
  const app = Express();
  //inicializamos express, estamos inicializando http y manejar las rutas, nosotros vamos a crear una nueva ruta.
  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [BookResolver, AuthorResolver, AuthResolver],
    }),
    context: ({ req, res }) => ({ req, res }),
  });

  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: "/graphql" });
  return app;
}
// APIrest tiene puntos de entrada y diferentes entradas y un graphql una sola entrada
