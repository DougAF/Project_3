// navbar auto hide 
$(document).ready(function () {
    
    'use strict';
    
        var c, currentScrollTop = 0,
            navbar = $('nav');
    
        $(window).scroll(function () {
        var a = $(window).scrollTop();
        var b = navbar.height();
        
        currentScrollTop = a;
        
        if (c < currentScrollTop && a > b + b) {
            navbar.addClass("scrollUp");
        } else if (c > currentScrollTop && !(a <= b)) {
            navbar.removeClass("scrollUp");
        }
        c = currentScrollTop;
    });
    
    });

// Chris js code for Scatter  Plot

var buisnessGrowth = [];
var cityState = [];
var population = [];  
var income = [];
var taxRank = [];  
var educationalAttainment = [];
var commuteTime = [];
var crimeRate = [];
var cityName =[];
var stateName =[];

function init(){
 d3.json(("/metadata")).then((data) => {

 data.keys.forEach(element => {
     buisnessGrowth.push(element.biz_growth_Y) 
     income.push(element.median_household_inc)
     taxRank.push(element.tax_rank)
     population.push(element.population_2016)
     cityName.push(element.city)
     stateName.push(element.state) 
     educationalAttainment.push(element.bach_or_higher_percent)
     commuteTime.push(element.agg_commute_mins)
     cityState.push(element.city_state)
 });
 var trace1 = {
  
        x : population,
        y : buisnessGrowth,

        mode: 'markers',
        type : "scatter",
        name: 'City Name',
        text: cityState,
        marker : {size: 6}
        };

 var sData = [trace1];

 var layout = {
    height: 600,
    width: 800,
    title: 'X vs Business Growth',
    xaxis: {
        title: {
            text:'Selected X Variable'
        }
    },
    yaxis: {
        title: {
            text: 'Business Growth %'
        }
    }
  };

  Plotly.plot('scatter', sData, layout);
 }) 
}

function updatePlotly(newdata) {
    const chart = document.getElementById("scatter");
    Plotly.restyle(chart, 'x', [newdata]);
    Plotly.relayout(chart, 'xaxis.title.text', [newtitle])
}
function getData(dataset) {
    let data = [];
    switch (dataset) {
        case "Population":
        data =  population ;
        break;
        case "EducationalAttainment":
        data = educationalAttainment;
        break;
        case "Household Income":
        data =  income;
        break;
        case "Commute Time":
        data =  commuteTime;
        break;
     //    case "Crime Rate":
     //    data =  crimeRate
        break;
        case "State Tax":
        data =  taxRank
        break;
        default:
        data =  population ;  
  }
  updatePlotly(data);
}

init();

// Doug Map code leaflet
function createMap(citiesPlot) {

    // Create the tile layer that will be the background of our map
    const streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 17,
        id: "mapbox.streets",
        accessToken: API_KEY
      });

    // Create Darkmap background
    const darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    // Create satellite Background
    const satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });
    
    // Create a baseMaps object to hold the lightmap layer
    const baseMaps = {
        "Satellite Image" : satellite,
        "Street Map": streetmap,
        "Dark Map" : darkmap
    };

    // Create an overlayMaps object to hold the quakePlot layer
    let overlayMaps = {
        "<b>US Cities</b><hr>Click a Circle for more info! <br> Note all data shown is from 2016<br>": citiesPlot
    };

    // Create the map object with options
    let map = L.map("map-id", {
        center: [32.73, -90],
        zoom: 5,
        layers: [streetmap, darkmap, satellite, citiesPlot]
    });

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(map);

    // Create and add Legend
};

function createCircleMarkers(response) {

    cities = response.keys
    // Pull the features from response
    const citiesMarkers = cities.map(city => {

        // For each city, create a marker and bind a popup with the city's name
        // coords from response contain a depth field, slice removes this
        // Reverse swaps lat and lng to map locations correctly

        const coords = city.coordinates

        // Change the values of these options to change the symbol's appearance    
        let options = {
            radius: Math.abs(city.biz_growth_Y)*3000,
            fillColor: colorCity(city.biz_growth_Y),
            color: colorCityRim(city.biz_growth_Y),
            weight: 1,
            opacity: 1,
            fillOpacity: 0.5
          }
          
        // new Date parses Epoch time from JSON into human readable date&time
        const popupMsg = "<h4>" + city.city + ", " + city.state + "<hr></h4>" +"<h5><b> Business Growth: " + (city.biz_growth_Y).toFixed(2)+ "%</b>" + "<hr><li>Population: "+ numberWithCommas(city.population_2016) + "</li> " + "<li>Establishments: " + numberWithCommas(city.estab_2016) + "</li> " + "<li>Tax Law Rank: " + city.tax_rank + "</li> " +  "<li>Education: " + (city.bach_or_higher_percent).toFixed(2) + "%     completed undergrad" + "</li> </h5> ";
        const citiesMarkers = L.circle(coords, options).bindPopup(popupMsg); 

        // Add the marker to the quakeMarkers array
        return citiesMarkers;
    })

    // Create a layer group made from the quakeMarkers array, pass it into the createMap function
    createMap(L.layerGroup(citiesMarkers));
}

// Perform an API call to the USGS earthquake API to get quake info. Call createCircleMarkers when complete
(async function(){
    const metadataUrl = "/metadata"
    let response = await d3.json(metadataUrl)
    // console.log(response) For analysis in terminal
    console.log(response)
    createCircleMarkers(response)
})()
 
// this function will add commmas to numbers for human reading 
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
 };

 function colorCity(y) {
    if (y<= 0) {
        color = "red"
    } else {
        color = "green"
     }
     return color
};

function colorCityRim(y) {
    if (y<= 0) {
        color = "darkorange"
    } else {
        color = "lightgreen"
     }
     return color
};