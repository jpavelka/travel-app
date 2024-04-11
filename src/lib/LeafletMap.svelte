<script>
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import { tripData, diversionData, getDateData } from "$lib/getTripData.js";
  import { whichToShow, placesInd, mapShown } from "$lib/stores.js";

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

      map = L.map(mapElement).setView([55, 0], 13);
      const currentPoints = [];

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      const blueIcon = new L.Icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      const goldIcon = new L.Icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      const grayIcon = new L.Icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });
      const greenIcon = new L.Icon({
        iconUrl:
          "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
        shadowUrl:
          "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      });

      for (let i in $tripData) {
        i = parseInt(i);
        const d = $tripData[i];
        let opts = { icon: blueIcon };
        if (currentInd === i || d.date - today === 0) {
          opts = { icon: goldIcon };
        } else if (d.date < today) {
          opts = { icon: grayIcon };
        }
        const txtMrk = L.marker([d.lat, d.lng], { opacity: 0 });
        txtMrk.bindTooltip(
          d.date.toLocaleDateString().split("/").slice(0, 2).join("/"),
          { permanent: true, className: "date-label", offset: [1, 0] },
        );
        txtMrk.addTo(map);
        const mrk = L.marker([d.lat, d.lng], opts);
        mrk.bindPopup(
          [
            `<b>${d.campground}</b>`,
            `${quickDateFormat(d.date)} (${d.nights} night${d.nights === 1 ? "" : "s"})`,
            `${d.city} (${d.elevation} ft)`,
            `Time zone: ${d.timezone}`,
            `Site: ${d.site}`,
            `Electric: ${d.electric}`,
            `Sewer: ${d.sewer}`,
            `Laundry: ${d.laundry}`,
            `Showers: ${d.showers}`,
            `<a style="cursor:pointer" id="linkToPlaces${d.dataInd}" onClick="document.getElementById('moreInfoHiddenDiv${d.dataInd}').click()">More info</a>`,
          ].join("<br>"),
        );
        mrk.addTo(map);
        if (Math.abs(d.date - today) < 10 * 24 * 60 * 60 * 1000) {
          currentPoints.push(L.marker([d.lat - 3.6, d.lng]));
          currentPoints.push(L.marker([d.lat + 1.5, d.lng]));
        }
        if (i !== 0) {
          const lastD = $tripData[i - 1];
          const color = d.date < today ? "#bbb" : "#4986E7";
          const line = L.polyline(
            [
              [lastD.lat, lastD.lng],
              [d.lat, d.lng],
            ],
            { color: color, weight: 8 },
          );
          line.addTo(map);
          const clickLine = L.polyline(
            [
              [lastD.lat, lastD.lng],
              [d.lat, d.lng],
            ],
            { opacity: 0, weight: 30 },
          );
          clickLine.bindPopup(
            [
              "<b>Driving</b>",
              quickDateFormat(d.date),
              `From: ${lastD.campground} (${lastD.city})`,
              `To: ${d.campground} (${d.city})`,
              `Distance: ${d.miles} miles`,
              `Map: <a href='https://www.google.com/maps/dir/${lastD.lat},${lastD.lng}/${d.lat},${d.lng}/@${d.lat},${d.lng}' target='_blank'>link</a>`,
            ].join("<br>"),
          );
          clickLine.addTo(map);
        }
      }
      for (let i in $diversionData) {
        i = parseInt(i);
        const d = $diversionData[i];
        let opts = { icon: greenIcon };
        if (new Date(d.date) <= new Date() && (new Date() <= d.leaveDate || new Date().toDateString() === d.leaveDate.toDateString())) {
          opts = { icon: goldIcon };
        }
        if (d.leaveDate < today) {
          opts = { icon: grayIcon };
        }
        const txtMrk = L.marker([d.lat, d.lng], { opacity: 0 });
        txtMrk.bindTooltip(
          d.date.toLocaleDateString().split("/").slice(0, 2).join("/"),
          { permanent: true, className: "date-label", offset: [1, 0] },
        );
        txtMrk.addTo(map);
        const mrk = L.marker([d.lat, d.lng], opts);
        mrk.bindPopup(
          [
            `<b>${d.campground}</b>`,
            `${quickDateFormat(d.date)} (${d.nights} night${d.nights === 1 ? "" : "s"})`,
            `${d.city} (${d.elevation} ft)`,
            `Time zone: ${d.timezone}`,
            // `<a style="cursor:pointer" id="linkToPlaces${d.dataInd}" onClick="document.getElementById('moreInfoHiddenDiv${d.dataInd}').click()">More info</a>`,
          ].join("<br>"),
        );
        mrk.addTo(map);
        if (Math.abs(d.date - today) < 10 * 24 * 60 * 60 * 1000) {
          currentPoints.push(L.marker([d.lat - 3.6, d.lng]));
          currentPoints.push(L.marker([d.lat + 1.5, d.lng]));
        }

        const fromD = $tripData[d.fromCampgroundInd];
        const fromColor = d.date < today ? "#bbb" : "#2d6";
        const fromLine = L.polyline(
          [
            [fromD.lat, fromD.lng],
            [d.lat, d.lng],
          ],
          { color: fromColor, weight: 8, dashArray: "10,30" },
        );
        fromLine.addTo(map);
        const fromClickLine = L.polyline(
          [
            [fromD.lat, fromD.lng],
            [d.lat, d.lng],
          ],
          { opacity: 0, weight: 30 },
        );
        fromClickLine.bindPopup(
          [
            "<b>Driving</b>",
            quickDateFormat(d.date),
            `From: ${fromD.campground} (${fromD.city})`,
            `To: ${d.campground} (${d.city})`,
            `Distance: ${d.miles} miles`,
            `Map: <a href='https://www.google.com/maps/dir/${fromD.lat},${fromD.lng}/${d.lat},${d.lng}/@${d.lat},${d.lng}' target='_blank'>link</a>`,
          ].join("<br>"),
        );
        fromClickLine.addTo(map);

        const toD = $tripData[d.toCampgroundInd];
        const color = d.leaveDate < today ? "#bbb" : "#2d6";
        const line = L.polyline(
          [
            [toD.lat, toD.lng],
            [d.lat, d.lng],
          ],
          { color: color, weight: 8, dashArray: "10,30" },
        );
        line.addTo(map);
        const toClickLine = L.polyline(
          [
            [toD.lat, toD.lng],
            [d.lat, d.lng],
          ],
          { opacity: 0, weight: 30 },
        );
        toClickLine.bindPopup(
          [
            "<b>Driving</b>",
            quickDateFormat(d.date),
            `From: ${toD.campground} (${toD.city})`,
            `To: ${d.campground} (${d.city})`,
            `Distance: ${d.miles} miles`,
            `Map: <a href='https://www.google.com/maps/dir/${toD.lat},${toD.lng}/${d.lat},${d.lng}/@${d.lat},${d.lng}' target='_blank'>link</a>`,
          ].join("<br>"),
        );
        toClickLine.addTo(map);
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
      id={`moreInfoHiddenDiv${d.dataInd}`}
      style="display:none"
      on:click={() => moreInfoFunc(d.dataInd)}
    ></div>
  {/each}
</main>

<style>
  @import "leaflet/dist/leaflet.css";
  main div {
    height: 80vh;
  }
</style>
