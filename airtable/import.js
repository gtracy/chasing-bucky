var bucky = require('./bucky-data.json');
var config = require('../config');
var Airtable = require('airtable');
var base = new Airtable({apiKey: config.airtable.api_key}).base(config.airtable.base_key);

bucky.buckies.forEach(function(b) {
    var props = b.properties;
    base('New').create({
        "id": props.id,
        "name": props.name,
        "sponsor": props.sponsor,
        "artistName": props.artistName,
        "locationName": props.locationName,
        "address": props.address,
        "imgFile": [{"url":"http://bucky-on-parade.herokuapp.com/assets/images/buckies/"+props.imgFileName}],
        "coordinates": b.geometry.coordinates[1] + "," + b.geometry.coordinates[0]
      }, function(err, record) {
          if (err) { console.error(err); return; }
          console.log(record.getId());
      });
});



