'use strict';

function ClientApp() {

    var that = this;
    this.map;
    this.infoWindow;

    function loadBucky() {
        fetch('/bucky').then(function(response) {
            if(response.ok) {
                response.json().then(function(json) {
                    json.bucky.forEach((b) => {
                        that.addBucky(b);
                    });
                });
            } else {
                console.log('Network request for products.json failed with response ' + response.status + ': ' + response.statusText);
            }
        });
    }

    this.hello = function() {
        console.log('hi greg');
    };

    this.initMap = function() {
        that.map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 43.0731, lng: -89.4011}, // madison,wi
            zoom: 13,
            styles: that.style
        });
        loadBucky();

        // there's only one popup bubble so we can limit what's open
        that.infoWindow = new google.maps.InfoWindow({  });
    };

    this.addBucky = function(bucky) {
        var coords = bucky.coordinates.split(',');
        var lat = parseFloat(coords[0])
        var lng = parseFloat(coords[1]);

        // create the map marker for this Bucky
        var marker = new google.maps.Marker({
            position: {lat:lat,lng:lng},
            //icon: icon,
            map: that.map
        });

        that.updateInfoWindow(marker,bucky);
    }

    this.updateInfoWindow = function(marker,bucky) {

        marker.addListener('click', function() {
            // setup the info window bubble when clicked
            var contentString = '<div id="bucky">'
                + '<div id="info-pic">'
                + '  <img style="max-width:100%" src="'+bucky.charlie[0].thumbnails.large.url+'">'
                + '</div>'
                + '<div id="info-desc">'
                + '  <div id="info-title"><h2>'+bucky.name+'</h2></div>'
                + '  <hr>'
                + '  <div id="info-text">'
                + '    <p>Artist: '+bucky.artistName+'</p>'
                + '  </div>'
                + '</div>'
                + '</div>'
            that.infoWindow.setContent(contentString);
            that.infoWindow.open(that.map, marker);
        });
    }

    this.style = [
        {
            "stylers": [
            {
                "color": "#c3ffb1"
            }
            ]
        },
        {
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#f5f5f5"
            }
            ]
        },
        {
            "elementType": "labels.icon",
            "stylers": [
            {
                "visibility": "off"
            }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
            {
                "color": "#616161"
            }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
            {
                "color": "#f5f5f5"
            }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "labels",
            "stylers": [
            {
                "visibility": "off"
            }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
            {
                "color": "#bdbdbd"
            }
            ]
        },
        {
            "featureType": "administrative.neighborhood",
            "elementType": "labels",
            "stylers": [
            {
                "visibility": "off"
            }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#eeeeee"
            }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text",
            "stylers": [
            {
                "visibility": "off"
            }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
            {
                "color": "#757575"
            }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#e5e5e5"
            }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
            {
                "color": "#c3ffb1"
            }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
            {
                "color": "#9e9e9e"
            }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#ffffff"
            }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [
            {
                "visibility": "off"
            }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels",
            "stylers": [
            {
                "visibility": "off"
            }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.text.fill",
            "stylers": [
            {
                "color": "#757575"
            }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#dadada"
            }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels",
            "stylers": [
            {
                "visibility": "off"
            }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
            {
                "color": "#616161"
            }
            ]
        },
        {
            "featureType": "road.local",
            "stylers": [
            {
                "visibility": "off"
            }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels",
            "stylers": [
            {
                "visibility": "off"
            }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.text.fill",
            "stylers": [
            {
                "color": "#9e9e9e"
            }
            ]
        },
        {
            "featureType": "transit",
            "stylers": [
            {
                "visibility": "off"
            }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#e5e5e5"
            }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#eeeeee"
            }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
            {
                "color": "#c9c9c9"
            }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
            {
                "color": "#9abcff"
            }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
            {
                "color": "#9e9e9e"
            }
            ]
        }
    ];

}
var clientApp = new ClientApp();