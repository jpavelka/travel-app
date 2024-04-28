const getIcons = (L) => {
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
  const redIconSmall = new L.Icon({
    iconUrl:
      "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [18, 30],
    iconAnchor: [9, 30],
    popupAnchor: [1, -25],
    shadowSize: [30, 30]
  });
  const invisibleIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-grey.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    popupAnchor: [0, 0],
    shadowSize: [0, 0]
  });
  return {
    blue: blueIcon,
    gold: goldIcon,
    gray: grayIcon,
    green: greenIcon,
    redSmall: redIconSmall,
    invisible: invisibleIcon
}
}

const quickDateFormat = (d) => {
  return d.toDateString();
};

const addMarkerToMap = (L, map, d, i, color, currentPoints) => {
    const icons = getIcons(L);
    const today = new Date(new Date().toDateString());

    const opts = { icon: icons[color] };
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
}

export { addMarkerToMap }