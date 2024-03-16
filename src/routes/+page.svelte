<script>
  import LeafletMap from "$lib/LeafletMap.svelte";
  import Weather from "../lib/Weather.svelte";
  import WeatherWarning from "../lib/WeatherWarning.svelte";
  import { tripWeatherData } from "$lib/getTripData";
</script>

<main>
    <WeatherWarning />
    <h1>Map</h1>
    <div style="padding: 5pt">
      <LeafletMap />
    </div>
    <h1>Weather</h1>
    <Weather />
</main>
