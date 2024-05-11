<script>
  import { allPlacesData, tripData, pointOfInterestData, getDateData } from "$lib/getTripData.js";
  import { placesInd, placesMapType, placesTab } from "$lib/stores.js";
  import { wikiCityState } from "$lib/index.js";
  import { getSrc } from "$lib/gmap.js";
  import { browser } from "$app/environment";
  import LeafletMapSingleLocation from "./LeafletMapSingleLocation.svelte";
  import dayjs from "dayjs";
  import PlaceImages from "./PlaceImages.svelte";

  const tabClick = (x) => {
    placesTab.update(() => x);
    if (browser) {
      localStorage.setItem("placesTab", x);
    }
  };
  $: placeData = $allPlacesData[$placesInd];
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
        ? `&origin=${getDataMapStr($tripData[placeData.fromCampgroundInd], true)}&destination=${getDataMapStr(placeData, true)}`
        : `&origin=${getDataMapStr(placeData, true)}&destination=${getDataMapStr($tripData[placeData.toCampgroundInd], true)}`;
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
        while (checkInd < $allPlacesData.length - 1) {
          if (!noStrs.includes($allPlacesData[checkInd][util].toLowerCase())) {
            thisStr = "until " + dayjs($allPlacesData[checkInd].date).format(dtFrmt);
            break;
          }
          checkInd += 1;
        }
      } else {
        while (checkInd < $allPlacesData.length - 1) {
          if (noStrs.includes($allPlacesData[checkInd][util].toLowerCase())) {
            thisStr = "until " + dayjs($allPlacesData[checkInd].date).format(dtFrmt);
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
  const allCampgrounds = $allPlacesData.map(x => {return {cg: x.campground, ind: x.allPlacesInd, city: x.city}});
  let images;
  $: {
    images = placeData.images.map(d => {
      return {...d, ...{locDesc: placeData.campground}}
    });
    for (const poiInd of placeData.pointsOfInterest) {
      images = images.concat($pointOfInterestData[parseInt(poiInd)].images.map(d => {
        return {...d, ...{locDesc: $pointOfInterestData[parseInt(poiInd)].desc}}
      }))
    }
  }
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
      placesInd.update((x) => getDateData(new Date())[0].allPlacesInd);
    }}
  >
    Today
  </span>
  -
  <span
    class={$placesInd < $allPlacesData.length - 1
      ? "quickLink"
      : "quickLinkInactive"}
    on:click={() => {
      if ($placesInd < $allPlacesData.length - 1) {
        placesInd.update((x) => x + 1);
      }
    }}
  >
    Next
  </span>
</div>


<div style="display: flex">
  <div
    class={"tab " +
      ($placesTab === "map" ? "tabSelected" : "tabNotSelected")}
    on:click={() => {
      tabClick("map");
    }}
  >
    Maps
  </div>
  <div
    class={"tab " +
      ($placesTab === "info" ? "tabSelected" : "tabNotSelected")}
    on:click={() => tabClick("info")}
  >
    Info
  </div>
  <div
    class={"tab " +
      ($placesTab === "images" ? "tabSelected" : "tabNotSelected")}
    on:click={() => tabClick("images")}
  >
    Images
  </div>
  <div style="border-bottom: 1pt solid black; width: 100%"></div>
</div>

{#if $placesTab === 'map'}
  <div style="font-size:1.5rem;font-weight:bold;margin-top:12pt">
    Map
    <span>
      <select
        bind:value={$placesMapType}
        style="height:2rem;margin-bottom:5pt;font-size:1.1rem"
      >
        <option class="mapOption" value="poi">Points of Interest</option>
        <option class="mapOption" value="loc">Location</option>
        {#if $placesInd > 0}
          <option class="mapOption" value="fromLast">Directions From Last</option>
        {/if}
        {#if $placesInd < $allPlacesData.length - 1}
          <option class="mapOption" value="toNext">Directions To Next</option>
        {/if}
      </select>
    </span>
  </div>
  {#if $placesMapType === 'poi'}
    <LeafletMapSingleLocation d={placeData} />
  {:else}
    <div style="height:50vh;min-height:200px;max-width:80vh">
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
    </div>
  {/if}
{:else if $placesTab === 'info'}
  <div style="font-size:1.3rem;padding-left:10pt;margin-top:1rem">
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
    {#if placeData.pointsOfInterest.length > 0}
      <div>Points of Interest:</div>
      <ul style='margin-top:0'>
        {#each placeData.pointsOfInterest as poi}
          <li>{$pointOfInterestData[poi].desc}</li>
        {/each}
      </ul>
    {/if}
  </div>
{:else}
  {#if images.length > 0}
    <div style='margin-top:1rem;overflow-y:scroll;height:450px;'>
      <PlaceImages images={images}/>
    </div>
  {:else}
    <div>No images</div>
  {/if}
{/if}


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
  .tab {
    font-size: 1.2rem;
    padding: 3pt 5pt;
    width: 100px;
    border: 1pt solid black;
    border-top-left-radius: 8px 8px;
    border-top-right-radius: 8px 8px;
    text-align: center;
    cursor: pointer;
    margin-top: 1rem;
  }
  .tabNotSelected {
    background-color: #ddd;
  }
  .tabSelected {
    border-bottom: none;
  }
</style>
