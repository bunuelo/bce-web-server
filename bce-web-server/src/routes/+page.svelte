<script lang="ts">
  import { onMount } from "svelte";
  import Model from "./Model.svelte"
  
  // 61.7 average female.  64 average male. https://en.wikipedia.org/wiki/Pupillary_distance
  let ipd = 62;
  
  let bce_rest_api_message = "";
  let current_model_url = "";
  let model_reload_count = 0
  
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
    const response = await fetch(apiURL + "/generate?" + new URLSearchParams({
      ipd: ipd
    }));
    const response_json = await response.json();
    bce_rest_api_message = response_json.message + "  (sent ipd=" + ipd + ")"
    current_model_url = response_json.model_url + "?v=" + model_reload_count
    model_reload_count += 1
    return response_json;
  }
  
  onMount(async function() {
    await rest_api__root();
    await rest_api__generate();
  });

  async function onclickGenerate() {
    await rest_api__generate()
  }

  async function on_input_change() {
    await rest_api__generate()
  }
  
</script>

<h1>Design</h1>

<table>
  <tr>
    <td>
      <table>
	<tr>
	  <td>
	    Interpupilary Distance:
	  </td>
	</tr>
	<tr>
	  <td>
	    <input type="range" bind:value="{ipd}" min="50" max="80" style="width: 150px;" on:change={on_input_change} />
	    <input type="number" bind:value="{ipd}" min="50" max="80" style="width: 50px;" on:change={on_input_change} />
	    <input type="text" value="{ipd} mm" style="width: 50px;" disabled />
	  </td>
	</tr>
      </table>
    </td>
  </tr>
  <tr>
    <td>
      <table>
	<tr>
	  <td>
	    Single Board Computer:
	  </td>
	</tr>
	<tr>
	  <td>
	    <table>
	      <tr>
		<td>
		  <input type="radio" name="sbc" value="raspberry_pi" /> Raspberry Pi
		</td>
	      </tr>
	      <tr>
		<td>
		  <input type="radio" name="sbc" value="nvidia_jetson_nano" /> Nvidia Jetson Nano
		</td>
	      </tr>
	    </table>
	  </td>
	</tr>
      </table>
    </td>
  </tr>
  <tr>
    <td>
      {#key current_model_url}
        <Model model_url={current_model_url} />
      {/key}
    </td>
  </tr>
  <tr>
    <td>
      {bce_rest_api_message}
    </td>
  </tr>
</table>

