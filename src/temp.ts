import express, { Request, Response } from "express";
import { main, tem } from "./index.js";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
// import swaggerConfig from "./swagger";
const swagger = require("./swagger");

const app = express();
const port = 3000;
app.use(express.json());
// Initialize Swagger-jsdoc
// const swaggerSpec = swaggerJsdoc(swaggerConfig);

// Serve Swagger documentation
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//deprecated
app.use(express.urlencoded());
swagger(app);
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.get("/home", (req: Request, res: Response) => {
  res.send("Hello World!");
});
app.post("/invoice", (req: Request, res: Response) => {
  const line_itemData = req.body;
  const line_item2 = tem(line_itemData);

  res.status(200).json(line_item2);
});
