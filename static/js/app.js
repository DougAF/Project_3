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
var taxScore = [];  
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
     taxScore.push(element.tax_score)
     population.push(element.population_2016)
     cityName.push(element.city)
     stateName.push(element.state) 
     educationalAttainment.push(element.bach_or_higher_percent)
     commuteTime.push(element.agg_commute_mins/element.population_2016)
     cityState.push(element.city_state)
 });
 var trace1 = {
  
        x : population,
        y : buisnessGrowth,

        mode: 'markers',
        type : "scatter",
        name: 'City Name',
        text: cityState,
        marker : {
            size: 6,
            color: 'rgb(204, 85, 0)'}
        };

 var sData = [trace1];

 var layout = {
    height: 600,
    width: 800,
    title: 'X vs Business Growth',
    xaxis: {
        title: {
            text:"Total Population"
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

function updatePlotly(newdata, newlayout) {
    const chart = document.getElementById("scatter");
    Plotly.restyle(chart, 'x', [newdata]);
    Plotly.relayout(chart, 'xaxis.title.text',newlayout);
}

function getData(dataset) {
    let data = [];
    let layout = '';
    switch (dataset) {
        case "Population":
        data =  population;
        layout = 'Total Population';
        break;
        case "EducationalAttainment":
        data = educationalAttainment;
        layout = 'Percent Populatio with Bachelors degree or Higher'
        break;
        case "Household Income":
        data =  income;
        layout = 'Average Household Income (USD)';
        break;
        case "Commute Time":
        data =  commuteTime;
        layout = 'Average Commute Time (minutes)';
        break;
     //    case "Crime Rate":
     //    data =  crimeRate
        break;
        case "State Tax":
        data =  taxScore
        layout = "'Tax Score'";
        break;
        default:
        data =  population ;
        layout = 'Total Population'; 
  }
  updatePlotly(data, layout);
}

init();


