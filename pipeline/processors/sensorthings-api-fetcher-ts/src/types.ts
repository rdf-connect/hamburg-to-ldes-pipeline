export type ExtractedData = {
    observation: Observation,
    datastream: DataStream,
    thing: Thing,
    observedProperty: ObservedProperty,
    featureOfInterest: FeatureOfInterest,
    locations: Location[],
    sensor: Sensor,
}

export type Observation = {
    "@iot.selfLink": string,
    "@iot.id": number,
    "phenomenonTime": string,
    "resultTime": string,
    "FeatureOfInterest@iot.navigationLink": string,
    "Datastreamt@iot.navigationLink": string,
    "featureOfInterest": string,
    "datastream": string
}

export type DataStream = {
    "@iot.selfLink": string,
    "@iot.id": number,
    "name": string,
    "description": string,
    "observationType": string,
    "unitOfMeasurement": Object, // todo
    "observedArea": Object, // todo
    "phenomenonTime": string,
    "properties": Object,
    "resultTime": string,
    "Thing@iot.navigationLink": string,
    "Sensor@iot.navigationLink": string,
    "ObservedProperty@iot.navigationLink": string,
    "Observations@iot.navigationLink": string,
    "thing": string,
    "sensor": string,
    "observedProperty": string,
    "observation": string,
}

export type Thing = 
{
    "@iot.selfLink": string,
    "@iot.id": number,
    "name": string,
    "description": string,
    "properties": Object,
    "Locations@iot.navigationLink": string,
    "HistoricalLocations@iot.navigationLink": string,
    "locations": string[]
}

export type ObservedProperty = {
    "@iot.selfLink": string,
    "@iot.id": number,
    "name": string,
    "definition": string,
    "description": string,
}

export type Sensor = {
    "@iot.selfLink": string,
    "@iot.id": number,
    "name": string,
    "description": string,
    "encodingType": string,
    "metadata": string,
  }

export type Location = {
    "@iot.selfLink": string,
    "@iot.id": number,
    "name": string,
    "description": string,
    "encodingType": string,
    "location": {
        "type": string,
        "properties": Object,
        "geometry": Object,
    }
    "properties": Object,
}

export type FeatureOfInterest = {
    "@iot.selfLink": string,
    "name": string,
    "description": string,
    "encodingType": string,
    "feature": Object,
    "properties": Object,
}