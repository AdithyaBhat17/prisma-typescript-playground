import { Application } from "express";

import bodyParser from "body-parser";

import { PrismaClient } from "@prisma/client";

import express from "express";

const app: Application = express();
const prisma = new PrismaClient();

app.use(bodyParser.json());

app.get("/", (_req, res) => {
  res.send("Hello");
});

app.get("/users", async (_req, res) => {
  console.time("fetching users");
  let users = await prisma.users.findMany({ include: { bookings: true } });
  console.timeEnd("fetching users");
  res.send(users);
});

app.post("/users", async (req, res) => {
  try {
    let user = await prisma.users.create({
      data: {
        uid: Math.random().toString(36).substring(2, 10),
        name: req.body.name,
        password: req.body.password,
        email: req.body.email,
        address: req.body.address || "",
        phone_number: req.body.phone_number,
      },
    });
    res.json(user);
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      error,
    });
  }
});

app.get("/bookings", async (_, res) => {
  let bookings = await prisma.bookings.findMany();
  res.json(bookings);
});

app.post("/bookings", async (req, res) => {
  try {
    let booking = await prisma.bookings.create({
      data: {
        id: Math.random().toString(36),
        bathrooms: req.body.bathrooms,
        bedrooms: req.body.bedrooms,
        cleaning_type: req.body.cleaning_type,
        address: req.body.address,
        phone_number: req.body.phone_number,
        add_ons: req.body.add_ons,
        appartment: req.body.appartment,
        date: new Date(req.body.date),
        time: req.body.time,
        users: {
          connect: {
            uid: req.body.uid,
          },
        },
      },
    });
    res.json(booking);
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      error: error.toString(),
    });
  }
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Server is up and running at localhost:", PORT);
});
