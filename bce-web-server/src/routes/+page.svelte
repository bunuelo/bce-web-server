<script lang="ts">
  import { onMount } from "svelte";
  import Model from "./Model.svelte"
  
  // 61.7 average female.  64 average male. https://en.wikipedia.org/wiki/Pupillary_distance
  let ipd = 0;

  let sbc = null;
  
  let bce_rest_api_message = "";
  let current_model_url = "";
  let model_reload_count = 0;

  let options = null;
  
  const apiURL = "http://64.23.144.229:8000";
  
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
  
  async function rest_api__options() {
    const response = await fetch(apiURL + "/options");
    const response_json = await response.json();
    bce_rest_api_message = response_json.message;
    raw_options = response_json.options;
    //for (sbc_option in raw_options.sbc.options) {
    //  sbc_option["component"] = null;
    //}
    ipd = raw_options.ipd.default;
    // triggers options update
    options = raw_options;
    return response_json;
  }

  let interval = null;

  function update_default_radio_buttons() {
    console.log("[bce] update_default_radio_buttons: here.");
    console.log("[bce] sbc=" + sbc);
  
  }
  
  onMount(async function() {
    await rest_api__root();
    await rest_api__options();
    await rest_api__generate();
    
    interval = setInterval(update_default_radio_buttons, 1000);
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
  <tr>
    <td>
      <table>
	<tr>
	  <td>
	    <h2>Interpupilary Distance</h2>
	  </td>
	</tr>
	<tr>
	  <td>
	    {#key options}
  	      <input type="range" bind:value="{ipd}" min="{options ? options.ipd.minimum : 0}" max="{options ? options.ipd.maximum : 0}" style="width: 150px;" on:change={on_input_change} />
	      <input type="number" bind:value="{ipd}" min="{options ? options.ipd.minimum : 0}" max="{options ? options.ipd.maximum : 0}" style="width: 50px;" on:change={on_input_change} />
	      <input type="text" value="{ipd} mm" style="width: 50px;" disabled />
	    {/key}
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
	    <h2>Single Board Computer</h2>
	  </td>
	</tr>
	<tr>
	  <td>
	    <table>
	      {#each (options ? options.sbc.options : []) as sbc_option}
	      <tr>
		<td>
		  <input type="radio" id="sbc_{sbc_option.name}" bind:group={sbc} name="sbc" value="{sbc_option.name}" /><label for="sbc_{sbc_option.name}">{sbc_option.display_name}</label>
		</td>
		<td align="right">
		  ${sbc_option.price.toFixed(2)}
		</td>
	      </tr>
	      {/each}
	    </table>
	  </td>
	</tr>
      </table>
    </td>
  </tr>
</table>

