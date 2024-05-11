<script>
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import { tripData, diversionData, pointOfInterestData, getDateData } from "$lib/getTripData.js";
  import { whichToShow, placesInd, mapShown } from "$lib/stores.js";
  import { addMarkerToMap, addLineToMap } from '$lib/mapUtils.js';

  const dateData = getDateData(new Date());
  const currentInd = dateData[0].dataInd;
  const today = new Date(new Date().toDateString());
  let mapElement;
  let map;
  const moreInfoFunc = (dataInd) => {
    placesInd.update(() => dataInd);
    whichToShow.update(() => "places");
  };

  const quickDateFormat = (d) => {
    return d.toDateString();
  };

  onMount(async () => {
    if (browser && $mapShown) {
      const L = await import("leaflet");
      
      const map = L.map(mapElement).setView([55, 0], 13);
      const currentPoints = [];

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // 
      // campgrounds
      // 
      for (let i in $tripData) {
        i = parseInt(i);
        const d = $tripData[i];
        const iconColor = (currentInd === i || d.date - today === 0) ? 'gold' : (
          d.date < today
        ) ? 'gray' : 'blue'
        const popupText = [
          `<b>${d.campground}</b>`,
          `${quickDateFormat(d.date)} (${d.nights} night${d.nights === 1 ? "" : "s"})`,
          `${d.city} (${d.elevation} ft)`,
          `Time zone: ${d.timezone}`,
          `<a style="cursor:pointer" id="linkToPlaces${d.allPlacesInd}" onClick="document.getElementById('moreInfoHiddenDiv${d.allPlacesInd}').click()">More info</a>`,
        ].join("<br>")
        addMarkerToMap({L: L, map: map, d: d, color: iconColor, popupText: popupText});
        if (Math.abs(d.date - today) < 10 * 24 * 60 * 60 * 1000) {
          currentPoints.push(L.marker([d.lat - 3.6, d.lng]));
          currentPoints.push(L.marker([d.lat + 1.5, d.lng]));
        }

        if (i !== 0) {
          const lastD = $tripData[i - 1];
          const color = d.date < today ? "#bbb" : "#4986E7";
          const popupText = [
            "<b>Driving</b>",
            quickDateFormat(d.date),
            `From: ${lastD.campground} (${lastD.city})`,
            `To: ${d.campground} (${d.city})`,
            `Distance: ${d.miles} miles`,
            `Map: <a href='https://www.google.com/maps/dir/${lastD.lat},${lastD.lng}/${d.lat},${d.lng}/@${d.lat},${d.lng}' target='_blank'>link</a>`,
          ].join("<br>");
          addLineToMap({L: L, map: map, fromD: lastD, toD: d, lineColor: color, popupText: popupText});
        }
      }
      
      // 
      // diversions
      // 
      for (let i in $diversionData) {
        i = parseInt(i);
        const d = $diversionData[i];
        let iconColor = 'green'
        if (new Date(d.date) <= new Date() && (new Date() <= d.leaveDate || new Date().toDateString() === d.leaveDate.toDateString())) {
          iconColor = 'gold'
        }
        if (d.leaveDate < today) {
          iconColor = 'gray'
        }
        const popupText = [
          `<b>${d.campground}</b>`,
          `${quickDateFormat(d.date)} (${d.nights} night${d.nights === 1 ? "" : "s"})`,
          `${d.city} (${d.elevation} ft)`,
          `Time zone: ${d.timezone}`,
          `<a style="cursor:pointer" id="linkToPlaces${d.allPlacesInd}" onClick="document.getElementById('moreInfoHiddenDiv${d.allPlacesInd}').click()">More info</a>`,
        ].join("<br>")
        addMarkerToMap({L: L, map: map, d: d, color: iconColor, popupText: popupText})
        if (Math.abs(d.date - today) < 10 * 24 * 60 * 60 * 1000) {
          currentPoints.push(L.marker([d.lat - 3.6, d.lng]));
          currentPoints.push(L.marker([d.lat + 1.5, d.lng]));
        }

        const fromD = $tripData[d.fromCampgroundInd];
        const fromColor = d.date < today ? "#bbb" : "#2d6";
        const fromPopupText = [
          "<b>Driving</b>",
          quickDateFormat(d.date),
          `From: ${fromD.campground} (${fromD.city})`,
          `To: ${d.campground} (${d.city})`,
          `Distance: ${d.miles} miles`,
          `Map: <a href='https://www.google.com/maps/dir/${fromD.lat},${fromD.lng}/${d.lat},${d.lng}/@${d.lat},${d.lng}' target='_blank'>link</a>`,
        ].join("<br>");
        addLineToMap({L: L, map: map, fromD: fromD, toD: d, lineColor: fromColor, popupText: fromPopupText});
        const toD = $tripData[d.toCampgroundInd];
        const toColor = d.leaveDate < today ? "#bbb" : "#2d6";
        const toPopupText = [
          "<b>Driving</b>",
          quickDateFormat(d.date),
          `From: ${toD.campground} (${toD.city})`,
          `To: ${d.campground} (${d.city})`,
          `Distance: ${d.miles} miles`,
          `Map: <a href='https://www.google.com/maps/dir/${toD.lat},${toD.lng}/${d.lat},${d.lng}/@${d.lat},${d.lng}' target='_blank'>link</a>`,
        ].join("<br>");
        addLineToMap({L: L, map: map, fromD: d, toD: toD, lineColor: toColor, popupText: toPopupText});
      }

      // 
      // points of interest
      //
      for (let i in $pointOfInterestData) {
        i = parseInt(i);
        const d = $pointOfInterestData[i];
        const parent = d.parentType === 'campground' ? $tripData[d.parentInd] : $diversionData[d.parentInd];
        const iconColor = 'redSmall'
        const popupText = [
          `${d.activity}`,
          `${d.campground}`,
          `${d.city}`,
          `<a href='https://www.google.com/maps/dir/${parent.lat},${parent.lng}/${d.lat},${d.lng}/@${d.lat},${d.lng}' target='_blank'>Directions from site</a>`,
          `<a href='https://www.google.com/maps/dir/Current+Location/${d.lat},${d.lng}/@${d.lat},${d.lng}' target='_blank'>Directions from current location</a>`,
        ].filter(x => x.length > 0).map((val, ind) => {
          return ind === 0 ? '<b>' + val + '</b>' : val
        }).join("<br>");
        addMarkerToMap({L: L, map: map, d: d, color: iconColor, popupText: popupText, maxZoom: 7})
      }

      const group = L.featureGroup(currentPoints);
      map.fitBounds(group.getBounds());
      buttonClick();
    }
  });


  onDestroy(async () => {
    if (map) {
      map.remove();
    }
  });

  const buttonClick = () => {
    for (const el of document.getElementsByClassName("date-label")) {
      el.style.display = el.style.display === "none" ? "block" : "none";
    }
  };
</script>

<main>
  <div bind:this={mapElement}></div>
  <button style="padding: 5pt; margin-top: 5pt" on:click={buttonClick}
    >Toggle Dates</button
  >
  {#each $tripData as d}
    <div
      id={`moreInfoHiddenDiv${d.allPlacesInd}`}
      style="display:none"
      on:click={() => moreInfoFunc(d.allPlacesInd)}
    ></div>
  {/each}
  {#each $diversionData as d}
    <div
      id={`moreInfoHiddenDiv${d.allPlacesInd}`}
      style="display:none"
      on:click={() => moreInfoFunc(d.allPlacesInd)}
    ></div>
  {/each}
</main>

<style>
  @import "leaflet/dist/leaflet.css";
  main div {
    height: 80vh;
  }
</style>
