# SensorThings API Pipeline

The SensorThings API pipeline is an RDF-Connect pipeline that consumes a SensorThings API Source, and emits a corresponding LDES.

## Installation

## Running the pipeline

## Internal working

As the SensorThings API data model is not a linear stream, 
we convert the data model to a singular stream by: 

1. consuming the observations (keeping up to date is currently not implemented)
2. mapping the JSON data to the stapi ontology
3. emitting the JSON data as an LDES


## TODO

1. keeping the stream up to date with the source
2. publishing the stapi ontology on w3id.org
3. 