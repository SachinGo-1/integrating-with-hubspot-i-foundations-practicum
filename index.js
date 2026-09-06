const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo.
const PRIVATE_APP_ACCESS = process.env.HUBSPOT_ACCESS_TOKEN;
const CUSTOM_OBJECT_ID = process.env.HUBSPOT_CUSTOM_OBJECT_ID;


// ROUTE 1 - Homepage
app.get('/', async (req, res) => {
    const customObject = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}?properties=name,species,watering_frequency`;

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const resp = await axios.get(customObject, { headers });
        const data = resp.data.results;

        res.render('homepage', {
            title: 'Plants | HubSpot APIs',
            data
        });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Unable to retrieve custom object data.');
    }
});


// ROUTE 2 - Form
app.get('/update-cobj', (req, res) => {
    res.render('updates', {
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum'
    });
});


// ROUTE 3 - Create custom object record
app.post('/update-cobj', async (req, res) => {
    const newRecord = {
        properties: {
            name: req.body.name,
            species: req.body.species,
            watering_frequency: req.body.watering_frequency
        }
    };

    const customObject = `https://api.hubapi.com/crm/v3/objects/${CUSTOM_OBJECT_ID}`;

    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        await axios.post(customObject, newRecord, { headers });

        res.redirect('/');
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).send('Unable to create custom object record.');
    }
});


// Localhost
app.listen(3000, () => console.log('Listening on http://localhost:3000'));