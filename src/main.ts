//este es nuestro archivo principal, donde se ejecuta el servidor

import { startServer } from "./server";
import { myDataSource } from "./config/typeorm";

async function main() {
  myDataSource.initialize;
  const port: number = 4000;
  const app = await startServer();
  app.listen(port);
  console.log("App running on port", port);
}
main();
