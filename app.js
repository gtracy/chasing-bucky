'use strict';

var path = require('path');
var config = require('./config');
const express = require('express');


const app = express();
app.use(express.static('public'));
app.set('view engine', 'pug');

app.get('/', (req, res) => {
    res.render('index', { ga_key: config.ga_key, maps_key: config.maps_key });
});

app.get('/bucky', (req,res) => {
    // fetch from Airtable
    var buckies = [];
    var Airtable = require('airtable');
    var base = new Airtable({apiKey: config.airtable.api_key}).base(config.airtable.base_key);
    
    base('Bucky').select({
        maxRecords: 100,
        view: "All Pieces"
    }).eachPage(function page(records, fetchNextPage) {
        // This function (`page`) will get called for each page of records.
    
        records.forEach(function(record) {
            buckies.push({
                "id" : record.get('id'),
                "name" : record.get('name'),
                "sponsor" : record.get('sponsor'),
                "artistName" : record.get('artistName'),
                "locationName" : record.get('locationName'),
                "address" : record.get('address'),
                "imgFile" : record.get('imgFile'),
                "charlie" : record.get('charlie'),
                "coordinates" : record.get('coordinates')
            });
        });
    
        // To fetch the next page of records, call `fetchNextPage`.
        // If there are more records, `page` will get called again.
        // If there are no more records, `done` will get called.
        fetchNextPage();
    
    }, function done(err) {
        if (err) { console.error(err); }
        console.log('successfully fetched ' + buckies.length + ' buckies');
        res.send({bucky:buckies});
    });
})

module.exports = app;