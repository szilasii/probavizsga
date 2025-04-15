import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send("szerver fut");
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400).send("Hiányzó felhasználónév vagy jelszó!");
    return;
  }
  try {
    const conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "jelszo",
      database: "parts",
    });
    const [rows]: any = await conn.execute("select login(?,?) as uid", [
      email,
      password,
    ]);
    if (rows[0].uid == 0) {
      res.status(401).send("Hibás felhasználónév vagy jelszó!");
      return;
    }
    const payload = { uid: rows[0].uid };
    const token = jwt.sign(payload, "valami", { expiresIn: "5d" });
    res.status(200).send({ success: "Sikeres Bejelentkezés", token: token });
  } catch (err) {
    console.log(err);
    res.status(400).send("Hiba");
    return;
  }
});

app.get("/api/products", async (req, res) => {
  try {
    const conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "jelszo",
      database: "parts",
    });
    const [rows]: any = await conn.execute("select * from products;");
    console.log(rows);

    if (rows.length == 0) {
      res.status(404).send("Nem található termék");
      return;
    }
    res.status(200).send(rows);
  } catch (err) {
    console.log(err);
    res.status(400).send("Hiba");
    return;
  }
});
app.get("/api/products/:id", async (req, res) => {
  try {
    const conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "jelszo",
      database: "parts",
    });
    const [rows]: any = await conn.execute(
      "select * from products where id =?;",
      [req.params.id]
    );
    console.log(rows);

    if (rows.length == 0) {
      res.status(404).send("Nem található termék");
      return;
    }
    res.status(200).send(rows);
  } catch (err) {
    console.log(err);
    res.status(400).send("Hiba");
    return;
  }
});

app.post("/api/products/", async (req, res) => {
  const { name, description, price, stock, pictureurl } = req.body;
  if (!name || !description || !price || !stock || !pictureurl) {
    res.status(400).send("Az adatok nem megfelelőek!");
    return;
  }

  try {
    const conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "jelszo",
      database: "parts",
    });
    const [rows]: any = await conn.execute(
      "insert into products values(null,?,?,?,?,?)",
      [name, description, price, stock, pictureurl]
    );
    console.log(rows);

    if (rows.affectedRows === 0) {
      res.status(404).send("Hiba a Termék rögzítése során");
      return;
    }
    res.status(200).send("A termék sikeresen rögzítve!");
  } catch (err) {
    console.log(err);
    res.status(400).send("Hiba");
    return;
  }
});

app.put("/api/products/:id", async (req, res) => {
  const { name, description, price, stock, pictureurl } = req.body;

  try {
    const conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "jelszo",
      database: "parts",
    });

    const [rows]: any = await conn.execute(
      "select * from products where id =?;",
      [req.params.id]
    );
    if (rows.length == 0) {
      res.status(404).send("Nem található termék");
      return;
    }

    let product = rows[0];

    product.name = !name ? product.name : name 
    product.description = description ? description : product.description
    product.price = price ? price : product.price
    product.stock = stock ? stock : product.stock
    product.pictureurl = pictureurl ? pictureurl : product.pictureurl    

    const [rowsUpdate]: any = await conn.execute(
      "update products set name = ?, description = ?, price=?, stock=?, pictureurl=? where id = ? ;",
      [
        product.name,
        product.description,
        product.price,
        product.stock,
        product.pictureurl,
        req.params.id
      ]
    );

    if (rowsUpdate.affectedRows === 0) {
      res.status(404).send("Hiba a Termék rögzítése során");
      return;
    }
    res.status(200).send("A termék sikeresen rögzítve!");
  } catch (err) {
    console.log(err);
    res.status(400).send("Hiba");
    return;
  }
});


app.delete("/api/products/:id", async (req, res) => {
  try {
    const conn = await mysql.createConnection({
      host: "localhost",
      user: "root",
      password: "jelszo",
      database: "parts",
    });
    const [rows]: any = await conn.execute(
      "delete from products where id =?;",
      [req.params.id]
    );
    

    if (rows.affectedRows === 0) {
      res.status(404).send("Nem volt ilyen termék");
      return;
    }
    res.status(200).send(`A ${req.params.id} id-val rendelkező termék törölve!`);
  } catch (err) {
    console.log(err);
    res.status(400).send("Hiba");
    return;
  }
});

app.listen(3000, () => {
  console.log("Fut a szerver");
});
