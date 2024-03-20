<script>
  import dayjs from "dayjs";
  import { tripWeatherData } from "$lib/getTripData";

  const lowTemp = 34;
  let problems = {};
  const fmt = "ddd M/D";

  for (const wd of $tripWeatherData) {
    if (wd.temperature <= lowTemp) {
      const dt = dayjs(wd.startTime).format(fmt);
      if (Object.keys(problems).includes(dt)) {
        problems[dt] = Math.min(problems[dt], wd.temperature);
      } else {
        problems[dt] = wd.temperature;
      }
    }
  }
  let problemList = [];
  let dtUsed = [];
  for (const wd of $tripWeatherData) {
    const dt = dayjs(wd.startTime).format(fmt);
    if (Object.keys(problems).includes(dt) && !dtUsed.includes(dt)) {
      dtUsed.push(dt);
      problemList.push({ dt: dt, temp: problems[dt] });
    }
  }
  $: showDetails = false;
  const detailsClick = () => {
    showDetails = !showDetails;
  };
</script>

{#if problemList.length > 0}
  <div style="color: red; font-size: 1.1rem">
    !! Potential Freeze Warning !!<span style="color: blue; font-size: 1rem">
      <a style="cursor: pointer" on:click={detailsClick}>{" details"}</a>
    </span>
  </div>
  {#if showDetails}
    {#each problemList as problem}
      <div style="margin-left: 5pt">
        Low temp of {problem.temp} on {problem.dt}
      </div>
    {/each}
  {/if}
{/if}
