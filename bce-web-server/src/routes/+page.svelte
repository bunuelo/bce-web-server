<script lang="ts">
  import { onMount } from "svelte";

  let image_width = Math.round(window.innerWidth / 3);
  let image_height = Math.round(image_width * 9 / 16);
  
  // 61.7 average female.  64 average male. https://en.wikipedia.org/wiki/Pupillary_distance
  let ipd = 62;

  let bce_rest_api_message = "";
  let current_image_url = "";
  let image_reload_count = 0
  
  const apiURL = "http://64.23.144.229:8000";
  const apiHeaders = {
    "Access-Control-Allow-Origin": "*"

  }
  
  async function rest_api__root() {
    const response = await fetch(apiURL + "/");
    const response_json = await response.json();
    bce_rest_api_message = response_json.message
    return response_json;
  }
  
  async function rest_api__generate() {
    const body = {
      width: 512,
      height: 512 * 9 / 16
    }
    const response = await fetch(apiURL + "/generate?" + new URLSearchParams({
      width: image_width,
      height: image_height,
      ipd: ipd
    }));
    const response_json = await response.json();
    bce_rest_api_message = response_json.message + "  (sent ipd=" + ipd + ")"
    current_image_url = response_json.image_url + "?v=" + image_reload_count
    image_reload_count += 1
    return response_json;
  }
  
  onMount(async function() {
    await rest_api__root()
    await rest_api__generate()
  });

  async function onclickGenerate() {
    await rest_api__generate()
  }

  async function on_input_change() {
    await rest_api__generate()
  }
</script>

<table>
  <tr>
    <td>
      Interpupilary Distance:
      <input type="range" bind:value="{ipd}" min="50" max="80" style="width: 150px;" on:change={on_input_change} />
      <input type="number" bind:value="{ipd}" min="50" max="80" style="width: 50px;" on:change={on_input_change} />
      <input type="text" value="{ipd} mm" style="width: 50px;" disabled />
    </td>
  </tr>
  <tr>
    <td>
      {#if current_image_url != ""}
        <img src="{current_image_url}" style="width: {image_width}px; height: {image_height}px;" alt="Generated"/>
      {/if}
    </td>
  </tr>
  <tr>
    <td>
      {bce_rest_api_message}
    </td>
  </tr>
</table>

