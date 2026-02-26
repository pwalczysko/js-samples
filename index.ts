/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { MarkerClusterer } from "@googlemaps/markerclusterer";
// These .js files are not published on the repository, instead, just example artificial coordinate files are used.
import { locations } from "./example-coordinates.js"

async function initMap() {
  // Request needed libraries.
  const { Map, InfoWindow } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
  const { AdvancedMarkerElement, PinElement } = await google.maps.importLibrary("marker") as google.maps.MarkerLibrary;

  const map = new google.maps.Map(
    document.getElementById("map") as HTMLElement,
    {
      zoom: 3,
      center: { lat: 28.024, lng: -40.887 },
      mapId: 'DEMO_MAP_ID',
    }
  );

  const infoWindow = new google.maps.InfoWindow({
    content: "",
    disableAutoPan: true,
  });

  // Create an array of alphabetical characters used to label the markers.
  const labels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // Add some markers to the map.
  console.log(locations.length, "new-logging")
  const markers = locations.map((position, i) => {
    const label = labels[i % labels.length];
    const pinGlyph = new google.maps.marker.PinElement({
      glyph: "B",
      glyphColor: "red",
      background: "white",
    })
    const marker = new google.maps.marker.AdvancedMarkerElement({
      position,
      content: pinGlyph.element,
    });

    // markers can only be keyboard focusable when they have click listeners
    // open info window when marker is clicked
    marker.addListener("click", () => {
      infoWindow.setContent(position.lat + ", " + position.lng);
      infoWindow.open(map, marker);
    });
    return marker;
  });

const renderer = {
  render: ({ count, position }, stats, map) => {
    const isAboveAverage = count >= stats.clusters.markers.mean;
    const color = isAboveAverage ? "#FF0000" : "#0000FF"; // Red if high, Blue if low
    const scale = isAboveAverage ? 1.1 : 1.05;

    const myPin = new PinElement({
      scale: scale,
      background: color,
      glyphColor: color,
    });
    
    
    const myMarker = new AdvancedMarkerElement({
        position,
        // opacity:
    });

    myMarker.append(myPin);
    return myMarker
  }
};

  // Add a marker clusterer to manage the markers.
  new MarkerClusterer({ markers, map, renderer });
}
// Here were the original coordinates from google example

initMap();
export { };
