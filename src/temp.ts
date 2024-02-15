import express, { Request, Response } from "express";
import { main, tem } from "./index.js";
import { send } from "process";
import { ZATCAInvoiceLineItem } from "./zatca/templates/tax_invoice_template.js";

const app = express();
const port = 3000;
app.use(express.json());

//deprecated
app.use(express.urlencoded());

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
