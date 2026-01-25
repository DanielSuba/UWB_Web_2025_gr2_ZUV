const { updateRecords, getRecords } = require('./db');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();
const port = 5000;

app.use(bodyParser.json());
app.use(cors());

// GET /products - Filtrowanie, Sortowanie, Pagynacja
app.get('/products', async (req, res) => {
    const { name, price_sort, page = 1, limit = 8 } = req.query;
    let products = await getRecords('products');

    if (name) {
        products = products.filter(p => p.Name.toLowerCase().includes(name.toLowerCase()));
    }

    if (price_sort === 'asc') products.sort((a, b) => a.Price - b.Price);
    else if (price_sort === 'desc') products.sort((a, b) => b.Price - a.Price);

    const startIndex = (page - 1) * limit;
    const paginatedProducts = products.slice(startIndex, startIndex + parseInt(limit));

    res.json({
        data: paginatedProducts,
        total: products.length,
        pages: Math.ceil(products.length / limit)
    });
});

// GET /products/:id - Detale produktu
app.get('/products/:id', async (req, res) => {
    const products = await getRecords('products');
    const product = products.find(p => p.Id === req.params.id);
    res.json(product || { error: 'Not found' });
});

// GET /orders - Sortowanie po dacie i mapowanie produktów
app.get('/orders', async (req, res) => {
    const { date_sort } = req.query;
    const orders = await getRecords('orders');
    const products = await getRecords('products');

    let mappedOrders = orders.map((order) => {
        let orderProducts = order.products.map(opr => ({
            ...products.find(pr => opr.id === pr.Id),
            Qty: opr.qty
        }));

        return {
            id: order.id,
            date: order.date,
            products: orderProducts,
            totalSum: orderProducts.reduce((sum, opr) => sum + (Number(opr.Qty) * (opr.Price || 0)), 0).toFixed(2)
        };
    });

    if (date_sort === 'asc') mappedOrders.sort((a, b) => new Date(a.date) - new Date(b.date));
    else mappedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(mappedOrders);
});

// POST /orders - Tworzenie zamówienia + Redukcja Qty
app.post('/orders', async (req, res) => {
    const cartProducts = req.body;
    const orders = await getRecords('orders');
    const dbProducts = await getRecords('products');
    const id = crypto.randomUUID();

    for (let item of cartProducts) {
        const i = dbProducts.findIndex((pr) => pr.Id === item.Id);
        if (i !== -1) {
            dbProducts[i].Qty -= Number(item.Qty); // Redukcja stanu magazynowego
        }
    }

    orders.push({
        id: id,
        date: new Date().toISOString(),
        products: cartProducts.map(p => ({ id: p.Id, qty: p.Qty }))
    });

    await updateRecords(orders, 'orders');
    await updateRecords(dbProducts, 'products');
    res.json({ status: 'OK', orderId: id });
});

app.listen(port, () => console.log(`Server running on port ${port}`));