<script lang="ts">
  import { onMount } from "svelte";
  import Model from "./Model.svelte";
  import BceRestApi from "$lib/bce_rest_api.js";

  let bce_rest_api = new BceRestApi();
  let bce_rest_api_message = "";
  
  // 61.7 average female.  64 average male. https://en.wikipedia.org/wiki/Pupillary_distance
  let ipd = 0;

  let sbc = null;
  let display = null;
  let lens = null;
  let front_camera = null;
  let eye_camera = null;
  
  let current_model_url = "";
  var model_reload_count = 0;

  let options = null;

  let model_cost = 50;
  let sbc_cost = 0;
  let display_cost = 0;
  let lens_cost = 0;
  let front_camera_cost = 0;
  let eye_camera_cost = 0;
  let total_cost = 0;

  async function load_default_options() {
    options = await bce_rest_api.options();
    ipd = options.ipd.default;
    sbc = options.sbc.default;
    display = options.display.default;
    lens = options.lens.default;
    front_camera = options.front_camera.default;
    eye_camera = options.eye_camera.default;
    bce_rest_api_message = bce_rest_api.message;
  }

  async function generate_unique() {
    let model_url = await bce_rest_api.generate(ipd);
    current_model_url = model_url + "?v=" + model_reload_count;
    model_reload_count += 1;
    bce_rest_api_message = bce_rest_api.message;
  }
  
  onMount(async function() {
    await load_default_options()    
    await generate_unique();
  });

  async function onclickGenerate() {
    await generate_unique();
  }

  function check_ipd_limits() {
    console.log("Check IPD limits.")
    if (ipd) {
      if (ipd < options.ipd.minimum) {
        ipd = options.ipd.minimum;
      }
      if (ipd > options.ipd.maximum) {
        ipd = options.ipd.maximum;
      }
    }
  }
  
  async function on_input_change() {
    check_ipd_limits();
    await generate_unique();
  }
  
  function display_cost_difference(cost_diff) {
    if (cost_diff < 0) {
      return "-$" + (-cost_diff).toFixed(2);
    } else {
      return "+$" + cost_diff.toFixed(2);
    }
  }

  // recalculate price
  $: (function () {
       console.log("Recalculating price.")
       sbc_cost = 0;
       display_cost = 0;
       lens_cost = 0;
       front_camera_cost = 0;
       eye_camera_cost = 0;
       if (options != null) {
         for (var oi in options.sbc.options) {
           let o = options.sbc.options[oi]
           if (o.name == sbc) {
             sbc_cost = o.price;
           }
         }
         for (var oi in options.display.options) {
           let o = options.display.options[oi]
           if (o.name == display) {
             display_cost = o.price;
           }
         }
         for (var oi in options.lens.options) {
           let o = options.lens.options[oi]
           if (o.name == lens) {
             lens_cost = o.price;
           }
         }
         for (var oi in options.front_camera.options) {
           let o = options.front_camera.options[oi]
           if (o.name == front_camera) {
             front_camera_cost = o.price;
           }
         }
         for (var oi in options.eye_camera.options) {
           let o = options.eye_camera.options[oi]
           if (o.name == eye_camera) {
             eye_camera_cost = o.price;
           }
         }
       }
       total_cost = model_cost + sbc_cost + display_cost + lens_cost + front_camera_cost + eye_camera_cost;
     })()
  
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
      BCE REST API message: {bce_rest_api_message}
    </td>
  </tr>
  <tr>
    <td align="right">
      <h3>${total_cost.toFixed(2)}</h3>
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
		  <input type="radio" id="sbc_{sbc_option.name}" bind:group={sbc} name="sbc" value="{sbc_option.name}" />
		  <label for="sbc_{sbc_option.name}">{sbc_option.display_name}</label>
		</td>
		<td align="right">
		  {display_cost_difference(sbc_cost != null ? sbc_option.price - sbc_cost : 0)}
		</td>
	      </tr>
	      {/each}
	    </table>
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
	    <h2>Displays</h2>
	  </td>
	</tr>
	<tr>
	  <td>
	    <table>
	      {#each (options ? options.display.options : []) as display_option}
	      <tr>
		<td>
		  <input type="radio" id="display_{display_option.name}" bind:group={display} name="display" value="{display_option.name}" />
		  <label for="display_{display_option.name}">{display_option.display_name}</label>
		</td>
		<td align="right">
		  {display_cost_difference(display_cost != null ? display_option.price - display_cost : 0)}
		</td>
	      </tr>
	      {/each}
	    </table>
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
	    <h2>Lenses</h2>
	  </td>
	</tr>
	<tr>
	  <td>
	    <table>
	      {#each (options ? options.lens.options : []) as lens_option}
	      <tr>
		<td>
		  <input type="radio" id="lens_{lens_option.name}" bind:group={lens} name="lens" value="{lens_option.name}" /><label for="lens_{lens_option.name}">{lens_option.display_name}</label>
		</td>
		<td align="right">
		  {display_cost_difference(lens_cost != null ? lens_option.price - lens_cost : 0)}
		</td>
	      </tr>
	      {/each}
	    </table>
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
	    <h2>Front Camera(s)</h2>
	  </td>
	</tr>
	<tr>
	  <td>
	    <table>
	      {#each (options ? options.front_camera.options : []) as front_camera_option}
	      <tr>
		<td>
		  <input type="radio" id="front_camera_{front_camera_option.name}" bind:group={front_camera} name="front_camera" value="{front_camera_option.name}" />
		  <label for="front_camera_{front_camera_option.name}">{front_camera_option.display_name}</label>
		</td>
		<td align="right">
		  {display_cost_difference(front_camera_cost != null ? front_camera_option.price - front_camera_cost : 0)}
		</td>
	      </tr>
	      {/each}
	    </table>
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
	    <h2>Eye Cameras</h2>
	  </td>
	</tr>
	<tr>
	  <td>
	    <table>
	      {#each (options ? options.eye_camera.options : []) as eye_camera_option}
	      <tr>
		<td>
		  <input type="radio" id="eye_camera_{eye_camera_option.name}" bind:group={eye_camera} name="eye_camera" value="{eye_camera_option.name}" />
		  <label for="eye_camera_{eye_camera_option.name}">{eye_camera_option.display_name}</label>
		</td>
		<td align="right">
		  {display_cost_difference(eye_camera_cost != null ? eye_camera_option.price - eye_camera_cost : 0)}
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

