// Adding tile layers
const lightLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "mapbox.light",
accessToken: API_KEY
});

const satLayer = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
maxZoom: 18,
id: "mapbox.satellite",
accessToken: API_KEY
});
  
  
// Grabbing our GeoJSON data
const queryUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';
d3.json(queryUrl, function(data) {
    console.log(data.features);
    // Using the features array sent back in the API data, create a GeoJSON layer and add it to the map
    const geoJSONlayer = L.geoJSON(data.features, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, {
                radius: (Math.floor(parseInt(feature.properties.mag)) + 1) * 3,
                fillOpacity: 1,
                color: getColor(feature.properties.mag),
                fillColor: getColor(feature.properties.mag)
            })}
    }).bindPopup(function (layer) {return `<html><center><b>Magnitude: </b>${layer.feature.properties.mag}</center><hr>
                                            <b>Location: </b>${layer.feature.properties.place}`});

    mapGeneration(geoJSONlayer);
});

//return color based on magnitude
function getColor(mag){
    switch(Math.floor(parseInt(mag))){
        case 0:
          return '#DAF7A6';
        case 1:
          return '#FFC300';
        case 2:
          return '#FF5733';
        case 3:
          return '#C70039';
        case 4:
          return '#900C3F';
        case 5:
          return '#581845';
        default:
          return '#DAF7A6';
      };
};



//build the map
function mapGeneration(overlay) {
    const myMap = L.map("map", {
      center: [
        32.5149,-117.0382
      ],
      zoom: 2.5,
      layers: [satLayer, overlay]
    });

    //layer control
    L.control.layers({'Satellite' : satLayer, 'Light' : lightLayer}, {'Earthquakes' : overlay}).addTo(myMap);

    //legend
    const legend = L.control({ position: 'bottomright' });
    legend.onAdd = function (myMap) {
      const div = L.DomUtil.create('div', 'info legend');
      const grades = [0,1,2,3,4,5];
      const labels = [];
  
      for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i]) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
    };
    legend.addTo(myMap);
};