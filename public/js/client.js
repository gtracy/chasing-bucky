'use strict';

function ClientApp() {

    var that = this;
    this.map;
    this.infoWindow;
    this.userMarker;
    this.intervalID = -1;
    this.quitRefresh = false;

    function loadBucky() {
        fetch('bucky').then(function(response) {
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

    this.initMap = function() {
        that.map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 43.0731, lng: -89.4011}, // madison,wi
            zoom: 13,
            styles: that.style
        });
        loadBucky();

        // there's only one popup bubble on Bucky so we can limit what's open
        that.infoWindow = new google.maps.InfoWindow({
            maxWidth : 200
        });

        // refresh the user's location regularly
        that.intervalID = window.setInterval(function() {
            that.getUserLocation();
        }, 1500);

    };

    this.addBucky = function(bucky) {
        var coords = bucky.coordinates.split(',');
        var lat = parseFloat(coords[0])
        var lng = parseFloat(coords[1]);

        // initialize the marker icon based on what's at that location
        var icon_img = "img/marker-black.png";
        var golden = false;
        if( bucky.charlie && bucky.charlie.length > 0 ) {
            if( bucky.name === 'Golden Bucky' ) {
                icon_img = "img/marker-gold.png";
                golden = true;
            } else {
                icon_img = "img/marker-red.png";
            }
        }
        var icon = {
            url: icon_img,
            scaledSize: new google.maps.Size(30,30)
        }

        // create the map marker for this Bucky
        var marker = new google.maps.Marker({
            position: {lat:lat,lng:lng},
            icon: icon,
            map: that.map
        });

        that.updateInfoWindow(marker,bucky,golden);
    };

    this.updateInfoWindow = function(marker,bucky,golden) {

        marker.addListener('click', function() {
            var thumbnail_url = "img/badger-bw.jpg";
            if( bucky.charlie && bucky.charlie.length > 0 ) {
                thumbnail_url = bucky.charlie[0].thumbnails.large.url;
            }
            var sponsor = (bucky.sponsor) ? bucky.sponsor : "Unknown";
            var location = (bucky.locationName) ? bucky.locationName : "Unknown";
            var hr_class = (golden) ? "gold" : "red";

            // setup the info window bubble when clicked
            var contentString = '<div id="bucky">'
                + '<div id="info-desc">'
                + '  <div id="info-title"><h2>'+bucky.name+'</h2></div>'
                + '  <p style="margin:0px;text-align:right;">'+location+'</p>'
                + '  <hr class="'+hr_class+'">'
                + '  <div id="info-desc">'
                + '    <p> </p>'
                + '    <p style="padding:2px;"><b>Artist:</b> '+bucky.artistName+'</p>'
                + '    <p style="padding:2px;"><b>Sponsor:</b> '+sponsor+'</p>'
                + '  </div>'
                + '</div>'
                + '<div id="info-pic">'
                + '  <img style="max-width:100%" src="'+thumbnail_url+'">'
                + '</div>'
                + '</div>'
            that.infoWindow.setContent(contentString);
            //that.infoWindow.setPosition(that.map.getCenter());
            that.infoWindow.open(that.map, marker);
        });
    };

    this.getUserLocation = function() {
        if( that.intervalID && that.quitRefresh ) {
            window.clearInterval(that.intervalID);
            return;
        }

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                // clear any existing marker
                if( that.userMarker ) {
                    that.userMarker.setMap(null);
                }

                var icon = {
                    url: "img/marker-blue.png",
                    scaledSize: new google.maps.Size(30,30)
                }
                that.userMarker = new google.maps.Marker({
                    position: pos,
                    icon: icon,
                    map: that.map
                });
                var locationInfo = new google.maps.InfoWindow({
                    maxWidth : 200
                });
                that.userMarker.addListener('click',function() {
                    var msgs = [
                        "you look great today",
                        "how did you get here?",
                        "does your mom know you're here?",
                        "love your outfit",
                        "love your hair today",
                        "you're awesome",
                        "look around, do you see Bucky yet?",
                        "chances are, Charlie is nearby",
                        "smile. you'll make someone's day"
                    ]
                    locationInfo.setContent(msgs[Math.floor(Math.random() * msgs.length)]);
                    locationInfo.open(that.map, that.userMarker);
                });
        
                that.quitRefresh = false;
        
            }, function() {
                // fail
                console.log('failed to acquire location');
                that.quitRefresh = true;
            });
        } else {
            // Browser doesn't support Geolocation
            // ... do nothing
            console.log('browser does not support location service');
            that.quitRefresh = true;
        }
    };

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
          "featureType": "administrative.locality",
          "elementType": "labels",
          "stylers": [
            {
              "visibility": "off"
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
          "featureType": "poi.attraction",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.business",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.government",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.medical",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "off"
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
          "elementType": "labels",
          "stylers": [
            {
              "color": "#c3ffb1"
            },
            {
              "visibility": "simplified"
            }
          ]
        },
        {
          "featureType": "poi.park",
          "elementType": "labels.text.fill",
          "stylers": [
            {
              "color": "#9dcf90"
            }
          ]
        },
        {
          "featureType": "poi.place_of_worship",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.school",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "poi.sports_complex",
          "elementType": "geometry",
          "stylers": [
            {
              "visibility": "off"
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
              "visibility": "off"
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
              "visibility": "off"
            }
          ]
        },
        {
          "featureType": "road.local",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#ffffff"
            },
            {
              "weight": 0.5
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