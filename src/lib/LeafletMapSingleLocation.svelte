<script>
  import { browser } from "$app/environment";
  import { pointOfInterestData } from "$lib/getTripData.js";
  import { addMarkerToMap, addLineToMap } from '$lib/mapUtils.js';

  export let d;

  let mapElement;
  let map;

  const createMap = async () => {
    if (browser) {
      const L = await import("leaflet");

      if (map) {
        map.remove();
      }
      
      map = L.map(mapElement);
      const currentPoints = [];
      
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const popupText = [
        `<b>${d.campground}</b>`,
      ].join("<br>")
      addMarkerToMap({L: L, map: map, d: d, color: 'blue', popupText: popupText, dateLabel: false});
      currentPoints.push(L.marker([d.lat, d.lng]));
      currentPoints.push(L.marker([d.lat, d.lng]));

      for (const poiInd of d.pointsOfInterest) {
        const poiD = $pointOfInterestData[poiInd];
        const popupText = [
          `${poiD.activity}`,
          `${poiD.campground}`,
          `${poiD.city}`,
          `<a href='https://www.google.com/maps/dir/${d.lat},${d.lng}/${poiD.lat},${poiD.lng}/@${poiD.lat},${poiD.lng}' target='_blank'>Directions from site</a>`,
          `<a href='https://www.google.com/maps/dir/Current+Location/${poiD.lat},${poiD.lng}/@${poiD.lat},${poiD.lng}' target='_blank'>Directions from current location</a>`,
        ].filter(x => x.length > 0).map((val, ind) => {
          return ind === 0 ? '<b>' + val + '</b>' : val
        }).join("<br>");
        addMarkerToMap({L: L, map: map, d: poiD, color: 'redSmall', popupText: popupText, dateLabel: false});
        currentPoints.push(L.marker([poiD.lat + 0.2, poiD.lng + 0.2]));
        currentPoints.push(L.marker([poiD.lat - 0.2, poiD.lng - 0.2]));
      }

      const group = L.featureGroup(currentPoints);
      map.fitBounds(group.getBounds(), {maxZoom: 12});
    }
  }

  $: {
    d = d;
    createMap();
  }
  </script>

<main>
  <div bind:this={mapElement}></div>
</main>

<style>
  @import "leaflet/dist/leaflet.css";
  main div {
    height: 50vh;
    max-width: 80vh;
  }
</style>
