<<<<<<< Updated upstream
const dbAdapter = require('lowdb/node')
const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const port = 5000
=======
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import crypto from "crypto";
import { updateRecords, getRecords } from "./db.js";

const app = express();
const port = 5000;
>>>>>>> Stashed changes

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('Default Endpoint')
})

app.get('/products', async (req, res) => {
    const db = await dbAdapter.JSONFilePreset('db.json', {
        products: [], orders: []
    });
    
    const databaseTables = db.data;
    const products = databaseTables.products

    res.send(products)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
