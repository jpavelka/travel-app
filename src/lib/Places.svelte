<script>
  import { tripData, getDateData } from "$lib/getTripData.js";
  import { placesInd } from "$lib/stores.js";
  import { getSrc } from "$lib/gmap.js";
  import dayjs from "dayjs";

  $: placeData = $tripData[$placesInd];
  $: mapType = "loc";
  const getDataMapStr = (d, latLngOnly) => {
    let s;
    if (latLngOnly) {
      s = d.lat + "," + d.lng;
    } else {
      s = d.campground + " " + d.mapSearchExtra + " " + d.lat + "," + d.lng;
    }
    return encodeURIComponent(s);
  };
  $: mapQueryStr =
    mapType === "loc"
      ? getDataMapStr(placeData, false)
      : mapType === "fromLast"
        ? `&origin=${getDataMapStr($tripData[$placesInd - 1], true)}&destination=${getDataMapStr(placeData, true)}`
        : `&origin=${getDataMapStr(placeData, true)}&destination=${getDataMapStr($tripData[$placesInd + 1], true)}`;
  $: dt = dayjs(placeData.date);
  const dtFrmt = "ddd MMM D";
  $: utilsStr = {};
  const noStrs = ["no", "???", "??", "?"];
  $: if (placeData) {
    for (const util of ["electric", "sewer", "laundry", "showers"]) {
      let thisStr = "until end of trip";
      let checkInd = $placesInd + 1;
      if (noStrs.includes(placeData[util].toLowerCase())) {
        while (checkInd < $tripData.length - 1) {
          if (!noStrs.includes($tripData[checkInd][util].toLowerCase())) {
            thisStr = "until " + dayjs($tripData[checkInd].date).format(dtFrmt);
            break;
          }
          checkInd += 1;
        }
      } else {
        while (checkInd < $tripData.length - 1) {
          if (noStrs.includes($tripData[checkInd][util].toLowerCase())) {
            thisStr = "until " + dayjs($tripData[checkInd].date).format(dtFrmt);
            break;
          }
          checkInd += 1;
        }
      }
      utilsStr[util] = thisStr;
    }
  }
</script>

<div style="font-weight:bold;font-size:2rem;margin-top:10pt">
  {placeData.campground}
</div>
<div style="font-size:1.4rem">
  {dt.format(dtFrmt)}
  -
  {dt.add(placeData.nights, "days").format(dtFrmt)}
  {` (${placeData.nights} night${placeData.nights === 1 ? "" : "s"})`}
</div>
<div style="font-size:1.1rem">
  <span
    class={$placesInd > 0 ? "quickLink" : "quickLinkInactive"}
    on:click={() => {
      if ($placesInd > 0) {
        placesInd.update((x) => x - 1);
      }
    }}
  >
    Prev
  </span>
  -
  <span
    class="quickLink"
    on:click={() => {
      placesInd.update((x) => getDateData()[0].dataInd);
    }}
  >
    Today
  </span>
  -
  <span
    class={$placesInd < $tripData.length - 1
      ? "quickLink"
      : "quickLinkInactive"}
    on:click={() => {
      if ($placesInd < $tripData.length - 1) {
        placesInd.update((x) => x + 1);
      }
    }}
  >
    Next
  </span>
</div>
<div style="font-size:1.4rem;font-weight:bold;margin-top:8pt">Map</div>
<div style="font-size:1.1rem;">
  <span class="quickLink" on:click={() => (mapType = "loc")}>Location</span>
  {#if $placesInd > 0}
    - <span class="quickLink" on:click={() => (mapType = "fromLast")}>From Last</span>
  {/if}
  {#if $placesInd < $tripData.length - 1}
    - <span class="quickLink" on:click={() => (mapType = "toNext")}>To Next</span>
  {/if}
</div>
<div style="height:40vh;min-height:200px">
  <iframe
    height="100%"
    width="100%"
    style="border:0"
    loading="lazy"
    allowfullscreen
    referrerpolicy="no-referrer-when-downgrade"
    src={getSrc(mapType === "loc" ? "place" : "directions", mapQueryStr)}
  >
  </iframe>
  <div style="font-size:1.3rem;padding-left:10pt">
    <div>City: {placeData.city}</div>
    <div>Elevation: {placeData.elevation} ft</div>
    <div>Site: {placeData.site}</div>
    <div>Electric: {placeData.electric} ({utilsStr.electric})</div>
    <div>Sewer: {placeData.sewer} ({utilsStr.sewer})</div>
    <div>Laundry: {placeData.laundry} ({utilsStr.laundry})</div>
    <div>Showers: {placeData.showers} ({utilsStr.showers})</div>
  </div>
</div>

<style>
  .quickLink {
    color: blue;
    cursor: pointer;
  }
  .quickLinkInactive {
    color: gray;
  }
</style>