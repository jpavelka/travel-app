<script>
  import { tripData, getDateData } from "$lib/getTripData.js";
  import { placesInd, placesMapType } from "$lib/stores.js";
  import { wikiCityState } from "$lib/index.js";
  import { getSrc } from "$lib/gmap.js";
  import dayjs from "dayjs";

  $: placeData = $tripData[$placesInd];
  const getDataMapStr = (d, latLngOnly) => {
    let s;
    if (latLngOnly) {
      s = d.lat + "," + d.lng;
    } else {
      s = d.mapSearchReplace != "" ? d.mapSearchReplace : (d.campground + " " + d.mapSearchExtra + " " + d.lat + "," + d.lng);
    }
    return encodeURIComponent(s);
  };
  $: mapQueryStr =
    $placesMapType === "loc"
      ? getDataMapStr(placeData, false)
      : $placesMapType === "fromLast"
        ? `&origin=${getDataMapStr($tripData[$placesInd - 1], true)}&destination=${getDataMapStr(placeData, true)}`
        : `&origin=${getDataMapStr(placeData, true)}&destination=${getDataMapStr($tripData[$placesInd + 1], true)}`;
  $: dt = dayjs(placeData.date);
  const dtFrmt = "ddd MMM D";
  $: utilsStr = {};
  const noStrs = ["no", "???", "??", "?"];
  let arrDepStr = "";
  $: if (placeData) {
    arrDepStr = "";
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
    const arrival = dayjs(placeData.date);
    const departure = arrival.add(placeData.nights, "days");
    if (new Date(arrival).toDateString() === new Date().toDateString()) {
      arrDepStr = "arriving today";
    }
    if (new Date(departure).toDateString() === new Date().toDateString()) {
      arrDepStr = "leaving today";
    }
  }
  $: wikiUrl = `https://en.m.wikipedia.org/wiki/${wikiCityState(placeData.city)}`;
  let showWiki = false;
  const allCampgrounds = $tripData.map(x => {return {cg: x.campground, ind: x.dataInd, city: x.city}});
</script>

<div style="font-weight:bold;font-size:2rem;margin-top:10pt">
  {placeData.campground}
</div>
<select id="placesSelect" value={$placesInd} on:change={(e) => {
  placesInd.update(() => parseInt(e.target.value));
}} style='padding:4pt'>
  <option style='font-style:italic' selected disabled>Select location</option>
  {#each allCampgrounds as cg}
    <option value={cg.ind}>{cg.cg} ({cg.city})</option>
  {/each}
</select>
<div style="font-size:1.4rem">
  {dt.format(dtFrmt)}
  -
  {dt.add(placeData.nights, "days").format(dtFrmt)}
  {` (${placeData.nights} night${placeData.nights === 1 ? "" : "s"}${arrDepStr === "" ? "" : ", " + arrDepStr})`}
</div>
<div style="font-size:1.2rem">
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
      placesInd.update((x) => getDateData(new Date())[0].dataInd);
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
<div style="font-size:1.5rem;font-weight:bold;margin-top:12pt">
  Map
  <span>
    <select
      bind:value={$placesMapType}
      style="height:2rem;margin-bottom:5pt;font-size:1.1rem"
    >
      <option class="mapOption" value="loc">Location</option>
      {#if $placesInd > 0}
        <option class="mapOption" value="fromLast">Directions From Last</option>
      {/if}
      {#if $placesInd < $tripData.length - 1}
        <option class="mapOption" value="toNext">Directions To Next</option>
      {/if}
    </select>
  </span>
</div>
<div style="font-size:1.2rem;"></div>
<div style="height:40vh;min-height:200px">
  <iframe
    height="100%"
    width="100%"
    style="border:0"
    loading="lazy"
    allowfullscreen
    referrerpolicy="no-referrer-when-downgrade"
    src={getSrc(
      $placesMapType === "loc" ? "place" : "directions",
      mapQueryStr,
    )}
  >
  </iframe>
  <div style="font-size:1.3rem;padding-left:10pt">
    <div>City: {placeData.city} <span style='color:blue;font-size:1rem;cursor:pointer' on:click={() => {
      showWiki = !showWiki
    }}>({showWiki ? "hide" : "show"} wiki)</span></div>
    {#if showWiki}
      <iframe style="width:90%;max-width:800px;height:500px" src={wikiUrl}
      ></iframe>
    {/if}
    <div>Time zone: {placeData.timezone}</div>
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
  .mapOption {
    font-size: 1.2rem;
  }
</style>
