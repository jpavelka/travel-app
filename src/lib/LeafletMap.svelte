<script>
  import { onMount, onDestroy } from "svelte";
  import { browser } from "$app/environment";
  import { tripData, getDateData } from "$lib/getTripData.js";

  const dateData = getDateData();
  const currentInd = dateData[dateData.length - 1].dataInd;
  const today = new Date(new Date().toDateString());
  let mapElement;
  let map;
  const quickDateFormat = (d) => {
    return d.toDateString();
  };

  onMount(async () => {
    if (browser) {
      const L = await import("leaflet");

      map = L.map(mapElement).setView([55, 0], 13);
      const allPoints = [];

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
          { permanent: true, className: "date-label", offset: [1, 0] }
        );
        txtMrk.addTo(map);
        const mrk = L.marker([d.lat, d.lng], opts);
        mrk.bindPopup(
          [
            `<b>${d.campground}</b>`,
            `${quickDateFormat(d.date)} (${d.nights} night${d.nights === 1 ? "" : "s"})`,
            `${d.city} (${d.elevation} ft)`,
            `Site: ${d.site}`,
            `Electric: ${d.electric}`,
            `Sewer: ${d.sewer}`,
            `Laundry: ${d.laundry}`,
            `Showers: ${d.showers}`,
            `Map: <a href='https://www.google.com/maps/place/${d.lat},${d.lng}/@${d.lat},${d.lng},12z' target='_blank'>link</a>`,
          ].join("<br>")
        );
        mrk.addTo(map);
        if (Math.abs(d.date - today) < 10 * 24 * 60 * 60 * 1000) {
          allPoints.push(L.marker([d.lat - 3.6, d.lng]));
          allPoints.push(L.marker([d.lat + 1.5, d.lng]));
        }
        if (i !== 0) {
          const lastD = $tripData[i - 1];
          const color = d.date < today ? "#bbb" : "#4986E7";
          const line = L.polyline(
            [
              [lastD.lat, lastD.lng],
              [d.lat, d.lng],
            ],
            { color: color, weight: 8 }
          );
          line.addTo(map);
          const clickLine = L.polyline(
            [
              [lastD.lat, lastD.lng],
              [d.lat, d.lng],
            ],
            { opacity: 0, weight: 30 }
          );
          clickLine.bindPopup(
            [
              "<b>Driving</b>",
              quickDateFormat(d.date),
              `From: ${lastD.campground} (${lastD.city})`,
              `To: ${d.campground} (${d.city})`,
              `Distance: ${d.miles} miles`,
              `Map: <a href='https://www.google.com/maps/dir/${lastD.lat},${lastD.lng}/${d.lat},${d.lng}/@${d.lat},${d.lng}' target='_blank'>link</a>`,
            ].join("<br>")
          );
          clickLine.addTo(map);
        }
      }

      const group = L.featureGroup(allPoints);
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
</main>

<style>
  @import "leaflet/dist/leaflet.css";
  main div {
    height: 80vh;
  }
</style>
