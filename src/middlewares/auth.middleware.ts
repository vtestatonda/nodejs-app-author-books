import { MiddlewareFn } from "type-graphql";
import { verify } from "jsonwebtoken";
import { Response, Request } from "express";
import { environment } from "../config/environment";

//el nombre IContext empieza con "I" para marcar una interface
export interface IContext {
  req: Request;
  res: Response;
  payload: { userId: string };
}

export const isAuth: MiddlewareFn<IContext> = ({ context }, next) => {
  try {
    const bearerToken = context.req.headers["authorization"];

    if (!bearerToken) {
      throw new Error("Unauthorized");
    }

    //lo siguiente me devuelve un array asi [bearer, asdasdsa] nosotrs al poner [1] queremos que nos devuelva el segundo
    const jwt = bearerToken.split(" ")[1];
    //para poder verificar el token necesitamos la palabra secreta
    const payload = verify(jwt, environment.JWT_SECRET);
    //ahora agregamos al payload a nuestro contexto para que tengamos disponibles en los resolvers.
    context.payload = payload as any;
  } catch (e: any) {
    throw new Error(e);
  }
  //next es de express para diciendo que continue con el programa
  return next();
};
