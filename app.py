import datetime as dt
import numpy as np
import pandas as pd

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, jsonify, render_template

#################################################
# Database Setup
#################################################

# Create Engine
engine = create_engine("sqlite:///cities_db_3.sqlite")
engine2 = create_engine("sqlite:///industries_db.sqlite")

# reflect an existing database into a new model
Base = automap_base() # AUTO MAP OR DECLARATIVE?
Base2 = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)
Base2.prepare(engine2, reflect=True)

# Save references to table 'cities'
Cities = Base.classes.cities
# Industry = Base2.classes.industry
# Create our session (link) from Python to the DB
session = Session(engine)
session2 = Session(engine2)

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route("/home")
def home():
    cities = Cities
    return render_template("home.html", cities = cities)

# create Map 
@app.route("/map")
def map():
    engine = create_engine("sqlite:///cities_db_3.sqlite")
# reflect an existing database into a new model
    Base = automap_base() # AUTO MAP OR DECLARATIVE?
# reflect the tables
    Base.prepare(engine, reflect=True)
# Save references to table
    Cities = Base.classes.cities
# Create our session (link) from Python to the DB
    session = Session(engine)
    cities = Cities
    return render_template("map.html", cities = cities)

# Scatter Plot
@app.route("/scatter")
def population():
    engine = create_engine("sqlite:///cities_db_3.sqlite")
# reflect an existing database into a new model
    Base = automap_base() # AUTO MAP OR DECLARATIVE?
# reflect the tables
    Base.prepare(engine, reflect=True)
# Save references to table
    Cities = Base.classes.cities
# Create our session (link) from Python to the DB
    session = Session(engine)
    cities = Cities

    return render_template("scatter.html", cities = cities)


#create metadata route to pull data clientside RESTful API
@app.route("/metadata")
def city_metadata():
    engine = create_engine("sqlite:///cities_db_3.sqlite")
# reflect an existing database into a new model
    Base = automap_base() # AUTO MAP OR DECLARATIVE?
# reflect the tables
    Base.prepare(engine, reflect=True)
# Save references to table
    Cities = Base.classes.cities
# Create our session (link) from Python to the DB
    session = Session(engine)

    """Return all data for a city."""
    sel = [
        Cities.city,
        Cities.state,
        Cities.lat,
        Cities.lng,
        Cities.pop_2016,
        Cities.estab_2016,
        Cities.median_household_inc,
        Cities.bach_or_higher_percent,
        Cities.agg_commute_mins,
        Cities.biz_growth_Y,
        Cities.city_state,
        Cities.tax_score
    ]

    # results = session.query(*sel).order_by(Cities.population.desc()).limit(100).all()
    results = session.query(*sel).all()

    # Create a dictionary entry for each city's information
    meta_dict = {}
    meta_list = []

    # Formatting data to mirror GeoJSON
    for result in results:
        city_metadata_dict = {}
        city_metadata_dict["city"] = result[0]
        city_metadata_dict["state"] = result[1]
        city_metadata_dict["coordinates"] = [result[2], result[3]]
        city_metadata_dict["population_2016"] = result[4]
        city_metadata_dict["estab_2016"] = result[5]
        city_metadata_dict["median_household_inc"] = result[6]
        city_metadata_dict["bach_or_higher_percent"] = result[7]
        city_metadata_dict["agg_commute_mins"] = result[8]
        city_metadata_dict["biz_growth_Y"] = result[9]
        city_metadata_dict["city_state"] = result[10]
        city_metadata_dict["tax_score"] = result[11]
        
    #INSERT ADDITIONAL VARS HERE 
        meta_list.append(city_metadata_dict)
        #ALLOWS ACCES TO ALL DATA BY DICT.KEY FOR MAPPING LEAFLET
    meta_dict = {"keys": meta_list}
    return jsonify(meta_dict)

@app.route("/mldata")
def ml_metadata():
    engine = create_engine("sqlite:///industries_db.sqlite")
# reflect an existing database into a new model
    Base = automap_base() # AUTO MAP OR DECLARATIVE?
# reflect the tables
    Base.prepare(engine, reflect=True)
# Save references to table
    Industry = Base.classes.cities
# Create our session (link) from Python to the DB
    session = Session(engine)

    """Return all data for a city."""
    sel = [
        Industry.city_state,
        Industry.houses_total,
        Industry.pop_18_to_24_total,
        Industry.renters_total,
        Industry.house_units,
        Industry.population,
        Industry.establishments_total,
        Industry.year,
        Industry.agriculture_forest_fish_hunt_ratio,
        Industry.mine_quarry_oil_gas_extraction_ratio,
        Industry.utilities_ratio,
        Industry.construction_ratio,
        Industry.manufacturing_ratio,
        Industry.wholesale_trade_ratio,
        Industry.retail_ratio,
        Industry.transport_warehousing_ratio,
        Industry.information_ratio,
        Industry.finance_insurance_ratio,
        Industry.realestate_rent_lease_ratio,
        Industry.professional_scientific_tech_services_ratio,
        Industry.mgmt_companies_enterprises_ratio,
        Industry.admin_support_waste_management_services_ratio,
        Industry.educational_services_ratio,
        Industry.health_social_assistance_ratio,
        Industry.arts_entertainment_and_recreation_ratio,
        Industry.accommodation_food_services_ratio,
        Industry.other_ratio,
        Industry.industries_not_classified_ratio,
        Industry.commute_time_per_person
    ]

  # results = session.query(*sel).order_by(Cities.population.desc()).limit(100).all()
    results2 = session.query(*sel).all()

    # Create a dictionary entry for each city's information
    ml_dict = {}
    ml_list = []

    # Formatting data to mirror GeoJSON
    for result in results2:
        ml_metadata_dict = {}
        ml_metadata_dict["city_state"] = result[0]
        ml_metadata_dict["houses_total"] = result[1]
        ml_metadata_dict["pop_18_to_24_total"] = [result[2], result[3]]
        ml_metadata_dict["renters_total"] = result[4]
        ml_metadata_dict["house_units"] = result[5]
        ml_metadata_dict["population"] = result[6]
        ml_metadata_dict["establishments_total"] = result[7]
        ml_metadata_dict["year"] = result[8]
        ml_metadata_dict["biz_gagriculture_forest_fish_hunt_ratiorowth_Y"] = result[9]
        ml_metadata_dict["mine_quarry_oil_gas_extraction_ratio"] = result[10]
        ml_metadata_dict["utilities_ratio"] = result[11]
        ml_metadata_dict["construction_ratio"] = result[12]
        ml_metadata_dict["manufacturing_ratio"] = result[13]
        ml_metadata_dict["wholesale_trade_ratio"] = result[14]
        ml_metadata_dict["retail_ratio"] = result[15]
        ml_metadata_dict["transport_warehousing_ratio"] = result[16]
        ml_metadata_dict["information_ratio"] = result[17]
        ml_metadata_dict["finance_insurance_ratio"] = result[18]
        ml_metadata_dict["realestate_rent_lease_ratio"] = result[19]
        ml_metadata_dict["professional_scientific_tech_services_ratio"] = result[20]
        ml_metadata_dict["mgmt_companies_enterprises_ratio"] = result[21]
        ml_metadata_dict["admin_support_waste_management_services_ratio"] = result[22]
        ml_metadata_dict["educational_services_ratio"] = result[23]
        ml_metadata_dict["health_social_assistance_ratio"] = result[24]
        ml_metadata_dict["arts_entertainment_and_recreation_ratio"] = result[25]
        ml_metadata_dict["accommodation_food_services_ratio"] = result[26]
        ml_metadata_dict["other_ratio"] = result[27]
        ml_metadata_dict["industries_not_classified_ratio"] = result[28]
        ml_metadata_dict["commute_time_per_person"] = result[29]
        
    #INSERT ADDITIONAL VARS HERE 
        ml_list.append(ml_metadata_dict)
        #ALLOWS ACCES TO ALL DATA BY DICT.KEY FOR MAPPING LEAFLET
    meta_dict = {"keys": ml_list}
    return jsonify(ml_dict)

if __name__ == "__main__":
    app.run(debug=True)