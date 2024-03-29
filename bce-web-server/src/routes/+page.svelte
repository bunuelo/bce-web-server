<script lang="ts">
  import { onMount } from "svelte";
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
  import {
    BoxGeometry,
    DirectionalLight,
    HemisphereLight,
    Mesh,
    MeshStandardMaterial,
    PerspectiveCamera,
    Scene,
    WebGLRenderer
  } from 'three';

  let outerWidth = 1024
  let innerWidth = 1024
  let outerHeight = 768
  let innerHeight = 768

  const scene = new Scene();

  const camera = new PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000);
  camera.position.z = 5;

  const geometry = new BoxGeometry();

  const material = new MeshStandardMaterial({
	color: 0x00ff00,
	metalness: 0.13
  });

  const cube = new Mesh(geometry, material);
  scene.add(cube);

  const directionalLight = new DirectionalLight(0x9090aa);
  directionalLight.position.set(-10, 10, -10).normalize();
  scene.add(directionalLight);

  const hemisphereLight = new HemisphereLight(0xffffff, 0x444444);
  hemisphereLight.position.set(1, 1, 1);
  scene.add(hemisphereLight);

  let renderer:WebGLRenderer;

  const animate = () => {
	requestAnimationFrame(animate);
	cube.rotation.x += 0.01;
	cube.rotation.y += 0.01;
	renderer.render(scene, camera);
  };

  const resize = () => {
	renderer.setSize(innerWidth, innerHeight);
	camera.aspect = innerWidth / innerHeight;
	camera.updateProjectionMatrix();
  };

  const createScene = (el:HTMLCanvasElement) => {
	renderer = new WebGLRenderer({ antialias: true, canvas: el });
	resize();
	animate();
  };

  const gltf_loader = new GLTFLoader();

  //let three_canvas_element:HTMLCanvasElement;
  let three_canvas_element;

  // Optional: Provide a DRACOLoader instance to decode compressed mesh data
  //const dracoLoader = new DRACOLoader();
  //dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
  //gltf_loader.setDRACOLoader( dracoLoader );

  function get_image_width() {
    return Math.round(innerWidth / 3);
  }

  function get_image_height() {
    return Math.round(get_image_width() * 9 / 16);
  }
  
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
      width: get_image_width(),
      height: get_image_height(),
      ipd: ipd
    }));
    const response_json = await response.json();
    bce_rest_api_message = response_json.message + "  (sent ipd=" + ipd + ")"
    current_image_url = response_json.image_url + "?v=" + image_reload_count
    image_reload_count += 1
    return response_json;
  }
  
  async function load_3d_model() {
    gltf_loader.load("http://64.23.144.229:8000/static/Box.glb", function(gltf) {
      scene.add(gltf.scene);
    });
    //await gltf_loader.loadAsync("http://64.23.144.229:8000/static/Box.glb", function (gltf) {
    //  console.log("Supposedly we loaded Box.glb.  gltf=" + gltf)
    //  scene.add(gltf.scene);
    //}, undefined, function (error) {
    //  console.error(error);
    //});
  }
  
  onMount(async function() {
    await rest_api__root();
    await rest_api__generate();
    await load_3d_model();
    createScene(three_canvas_element);
  });

  async function onclickGenerate() {
    await rest_api__generate()
  }

  async function on_input_change() {
    await rest_api__generate()
  }

</script>

<svelte:window bind:innerWidth bind:outerWidth bind:innerHeight bind:outerHeight />

<h1>Design</h1>

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
        <img src="{current_image_url}" style="width: {get_image_width()}px; height: {get_image_height()}px;" alt="Generated"/>
      {/if}
    </td>
  </tr>
  <tr>
    <td>
      <canvas bind:this={three_canvas_element} />
    </td>
  </tr>
  <tr>
    <td>
      {bce_rest_api_message}
    </td>
  </tr>
</table>

