$('.hamburger').on('click', function() {
    // If menu is already showing, slide it up. Otherwise, slide it down.
    $('.menu').toggleClass('click');
});


var Error = function(){
    error("connection error");

};

var map;
var largeInfowindow;
var markers = [];
// Locations list
var locations = [{
        title: 'Vaikom mahadeva temple',
        location: {
            lat: 9.7216446,
            lng: 76.3926668
        },
        img: 'img/Vaikom Temple.jpg',
    },
    {
        title: 'Ettumanoorappan Temple',
        location: {
            lat: 9.67036,
            lng: 76.560875
        },
        img: 'img/Ettumanoor Siva.jpg'
    },

    {
        title: 'Kaduthuruthy thali mahadeva Temple',
        location: {
            lat: 9.76638,
            lng: 76.49173
        },
        img: 'img/thali edited.jpg'
    },

     {
        title: 'Adityapuram sun temple',
        location: {
            lat: 9.748457,
            lng: 76.485638
        },
        img: 'img/surya temple.jpg'
    },
     {
        title: 'Malliyoor temple',
        location: {
            lat: 9.7368,
            lng: 76.511066
        },
        img: 'img/Malliyur.jpg'
    },
     {
        title: 'Chottanikara temple',
        location: {
            lat: 9.932954,
            lng: 76.390368
        },
        img: 'img/Chottanikkara_Temple.jpg'
    },
     
   
   
];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
           
           lat:9.701954,
           lng:76.453456

        },
        zoom: 13
    });
    //initialise infowindow
    largeInfowindow = new google.maps.InfoWindow();
    currentmarkers();
}

// Set marker for locations and open infowindow on marker when clicked
function currentmarkers() {
    
     //applying bounds
    var bounds = new google.maps.LatLngBounds();
    var defaultIcon = makeMarkerIcon('ff0000');
    var highlightedIcon = makeMarkerIcon('0000FF');
  
    // Array of markers created based on locations
    for (var i = 0; i < locations.length; i++) {
        var position = locations[i].location;
        var title = locations[i].title;
        var img = locations[i].img;
        // Creates a marker for each location and set respective datas
        marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            img: img,
            animation: google.maps.Animation.DROP,
            icon: defaultIcon
            
        });
        // Pushes marker into markers array
        markers.push(marker);
        // Event listener for opening of infowindow on click
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
           // bounce(this);
        });
        marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
        });
        marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
        });

        // Extend map bounds to the marker
       bounds.extend(markers[i].position);
        locations[i].marker = marker;
    }
    // Fit map bounds to the markers
    map.fitBounds(bounds);
}

// To create marker of particular colour
function makeMarkerIcon(markerColor) {
    var markerImage = new google.maps.MarkerImage(
        'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor +
        '|40|_|%E2%80%A2',
        new google.maps.Size(21, 34),
        new google.maps.Point(0, 0),
        new google.maps.Point(10, 34),
        new google.maps.Size(21, 34));
    return markerImage;
}
// To bounce marker when user clicks on it and stop bounce 
function bounce(marker) {
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
        marker.setAnimation(google.maps.Animation.null);
    }, 1500);
};




// Infowindow of particular location is opened when mouse is clicked
function populateInfoWindow(marker, infowindow) {
    //Wikipedia url for location
    var wikiUrl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.title + '&format=json&callback=wikiCallback';
    //Error handling when wikipedia fails to load
    var wikiTimeout = setTimeout(function() {
        alert("Failed to load wikipedia");
    }, 8000);


    //ajax request for wikipedia article links
    $.ajax({
       url: wikiUrl,
        dataType: "jsonp",
        success: function(response) {
            var wikiList = response[1];
            var url = 'http://en.wikipedia.org/wiki/' + wikiList;
            //Check whether infowindow is open or not
            if (infowindow.marker != marker) {
                 infowindow.setContent('<div>' + marker.title + '</div><br>' + '<div><img src="' + marker.img + '" alt="Image of ' + marker.title + '"></div><br><div>for more info</div><br>' + '<div><a href="' + url + '">' + url + '</a></div>');
                infowindow.marker = marker;
               infowindow.open(map, marker);
                marker.addListener('click', bounce(marker));
                infowindow.addListener('closeclick', function() {
                    infowindow.marker = null;
                });
            }
           clearTimeout(wikiTimeout);
        }
    });
}

// viewmodel
var viewModel = function() {
    var self = this;
    self.locations = ko.observableArray(locations);
    self.title = ko.observable('');
    
    self.query = ko.observable('');
    this.onClick = function() {
        populateInfoWindow(this.marker, largeInfowindow);
    };
    // Filter data when user enters a query in search box
    self.search = ko.computed(function() {
        return ko.utils.arrayFilter(self.locations(), function(item) {
          
            if (item.title.toLowerCase().indexOf(self.query().toLowerCase()) >= 0) {
                if (item.marker) {
                    item.marker.setVisible(true);
                }
                return true;
            } else {
                item.marker.setVisible(false);
            
        }
        });
    });
};



ko.applyBindings(new viewModel());

