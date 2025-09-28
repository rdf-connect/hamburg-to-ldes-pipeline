import { Processor, type Reader, type Writer } from "@rdfc/js-runner";

import type { DataStream, ExtractedData, FeatureOfInterest, Location, Observation, ObservedProperty, Sensor, Thing } from "./types";

const dataStreamPageLimit = 1;
const dataStreamLimit = 1;
const pageLimit = 1;

type TemplateArgs = {
    url: string;
    writer: Writer;
};

/**
 * Big todo still: keep the stream up to date with the remote source!
 */

/**
 * The TemplateProcessor class is a very simple processor which simply logs the
 * incoming stream to the RDF-Connect logging system and pipes it directly into
 * the outgoing stream.
 *
 * @param url The URL of the SensorThings API service
 * @param outgoing The data stream into which the incoming stream is written.
 * 
 */
export class SensorThingsFetcher extends Processor<TemplateArgs> {
    /**
     * This is the first function that is called (and awaited) when creating a processor.
     * This is the perfect location to start things like database connections.
     */

    datastreams: string[];
    datastream: DataStream;

    
    async init(this: TemplateArgs & this): Promise<void> {
        // Initialization code here e.g., setting up connections or loading resources
        log(`Sensorthings Fetcher initialized for URL: ${this.url}`);
        
        const datastreams = await extractDatastreams(this.url);
        this.datastreams = datastreams;
        
    }

    /**
     * Function to start reading channels.
     * This function is called for each processor before `produce` is called.
     * Listen to the incoming stream, log them, and push them to the outgoing stream.
     */
    async transform(this: TemplateArgs & this): Promise<void> {
        
    }

    /**
     * Function to start the production of data, starting the pipeline.
     * This function is called after all processors are completely set up.
     */
    async produce(this: TemplateArgs & this): Promise<void> {

        try {
            for (let datastreamURI of this.datastreams.slice(0, dataStreamLimit)) {

                log(`URI ${datastreamURI}`)
                const { datastream, thing, locations, sensor, observedProperty } = await extractMetadata(datastreamURI)

                const observationsLink = datastream["Observations@iot.navigationLink"];

                let nextLink: string | undefined = observationsLink;
                let extracted: {observation: Observation, featureOfInterest: FeatureOfInterest}[] = []

                let pageCount = 0
                while (nextLink && pageCount++ < pageLimit) {
                    let info = await extractObservations(nextLink)
                    extracted = info.extracted
                    nextLink = info.nextLink
                    for (let {observation, featureOfInterest} of extracted) {
                        
                        // Setting links
                        observation.datastream = datastream["@iot.selfLink"]
                        observation.featureOfInterest = featureOfInterest["@iot.selfLink"]
                        // datastream.observation = observation["@iot.selfLink"]
                        datastream.thing = thing["@iot.selfLink"]
                        datastream.observedProperty = observedProperty["@iot.selfLink"]
                        datastream.sensor = sensor["@iot.selfLink"]
                        thing.locations = []
                        for (const location of locations) thing.locations.push(location["@iot.selfLink"])

                        const extractedData: ExtractedData = {observation, featureOfInterest, datastream, thing, locations, sensor, observedProperty}

                        await this.writer.string(JSON.stringify(extractedData, null, 2))
                    }               
                }
            }
            this.writer.close()
        } catch (e) {
            console.error("Error while extracting from SensorThings API: ", e)
            this.writer.close()
        }

        // Function to start the production of data, starting the pipeline.
    }
}

var count = 0

async function extractDatastreams(url: string) {
    log(`Extracting datastreams from page ${url}`)
    let datastreams: string[] = [];

    const page = await fetch(url);
    const body = await page.json() as { value: DataStream[], ["@iot.nextLink"]?: string }

    for (let datastream of body.value) {
        datastreams.push(datastream["@iot.selfLink"]);
    }

    const nextLink = body["@iot.nextLink"];
    if (nextLink) { 

        // make sure it does not go crazy 
        if (count++ > dataStreamPageLimit) return datastreams;

        datastreams = datastreams.concat(
            await extractDatastreams(nextLink)
        )
    }
    return datastreams;
}



async function extractMetadata(dataStreamURL: string) {
    log(`Extracting metadata from page ${dataStreamURL}`)
    
    const dataStreamRes = await fetch(dataStreamURL)
    const dataStreamInfo = await dataStreamRes.json() as DataStream

    const thingRes = await fetch(dataStreamInfo["Thing@iot.navigationLink"])
    const thingInfo = await thingRes.json() as Thing

    const sensorRes = await fetch(dataStreamInfo["Sensor@iot.navigationLink"])
    const sensorInfo = await sensorRes.json() as Sensor

    const observedPropertyRes = await fetch(dataStreamInfo["ObservedProperty@iot.navigationLink"])
    const observedPropertyInfo = await observedPropertyRes.json() as ObservedProperty

    const locationsRes = await fetch(thingInfo["Locations@iot.navigationLink"])
    const locationsInfo = (await locationsRes.json() as { value: Location[] }).value as Location[]

    const metadata = {
        datastream: dataStreamInfo,
        thing: thingInfo,
        sensor: sensorInfo,
        observedProperty: observedPropertyInfo,
        locations: locationsInfo
    }
    return (metadata)
}

async function extractObservations(url: string): Promise<{ extracted: {observation: Observation, featureOfInterest: FeatureOfInterest}[], nextLink: string | undefined }> {

    log(`Extracting observations page ${url}`)
    const page = await fetch(url);
    const body = await page.json() as { value: Observation[], ["@iot.nextLink"]?: string }
    const extracted : { observation: Observation, featureOfInterest: FeatureOfInterest}[] = []
    for (let observation of body.value) {
        const featureOfInterest = await (await fetch(observation["FeatureOfInterest@iot.navigationLink"])).json() as FeatureOfInterest
        extracted.push({ observation, featureOfInterest})
    }
    const nextLink = body["@iot.nextLink"];
    return { extracted, nextLink }
}

function log(message: string) {
    console.log(`[SensorThings Fetcher]: ${message}`);
}