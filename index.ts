/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
import { MarkerClusterer } from "@googlemaps/markerclusterer";
// These .js files are not published on the repository, instead, just example artificial coordinate files are used.
// import { locations } from "./example-coordinates2.js"
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
      // glyph: label,
      glyph: "B",
      glyphColor: "red",
      background: "white",
      // glyphText: "some",
      // glyphSrc: "https://idr.openmicroscopy.org/about/img/logos/logo-idr.svg",
      // scale: 1.1,
      // glyphColor: "red",
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
    // 1. Calculate the average markers per cluster
    // 'stats' provides clusters information in newer versions, 
    // or we can calculate it from the clusterer instance.
    // const clusters = clusterer.getClusters();
    // const totalMarkers = clusters.reduce((sum, c) => sum + c.count, 0);
    // const mean = totalMarkers / clusters.length;

    // 2. Determine color based on the mean
    const isAboveAverage = count > stats.clusters.markers.mean;
    const color = isAboveAverage ? "#FF0000" : "#0000FF"; // Red if high, Blue if low
    const size = isAboveAverage ? 50 : 40;

    // 3. Create the SVG Icon
    const svg = window.btoa(`
      <svg fill="${color}" xmlns="http://www.w3.org" viewBox="0 0 24 24" width="50" height="50">
        <circle cx="12" cy="12" r="10" />
      </svg>`);

    return new google.maps.Marker({
      position,
      icon: {
        url: `data:image/svg+xml;base64,${svg}`,
        scaledSize: new google.maps.Size(size, size),
      },
      label: { text: String(count), color: "white", fontSize: "12px" },
      // Ensure high-count clusters sit on top visually
      zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
    });
  }
};

  // Add a marker clusterer to manage the markers.
  new MarkerClusterer({ markers, map, renderer });
}
// Here were the original coordinates from google example

initMap();
export { };
