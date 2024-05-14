<script>
  export let images;
  let imagesByLoc
  
  $: {
    imagesByLoc = [];
    for (const img of images) {
      if (imagesByLoc.length === 0 || img.locDesc !== imagesByLoc[imagesByLoc.length - 1].loc) {
        imagesByLoc.push({
          loc: img.locDesc,
          images: []
        })
      }
      imagesByLoc[imagesByLoc.length - 1].images.push(img)
    }
  }
</script>

<div class=container id=placeImgsContainer>
  {#if images.length > 0}
    {#each imagesByLoc as loc}
      <div class=loc>{loc.loc}</div>
      {#each loc.images as img}
        <div class=locImgContainer>
          <a href={img.src} target="_blank" rel="noopener noreferrer">
            <img style='max-height:350px;max-width:100%' src={img.src} />
          </a>
          <div class=caption>{img.caption}</div>
        </div>
        {/each}
    {/each}
  {:else}
    <div>No images</div>
  {/if}
</div>

<style>
  .container {
    margin-top: 1rem;
    overflow-y: scroll;
    height: 450px;
  }
  .loc {
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }
  .locImgContainer {
    margin-left: 0.5rem;
    margin-bottom: 0.75rem;
    font-size: 1.2rem;
  }
  .caption {
    margin-left: 0.25rem;
  }
</style>