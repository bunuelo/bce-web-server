<script lang="ts">
  import { onMount } from "svelte";
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
  import {
    BoxGeometry,
    DirectionalLight,
    HemisphereLight,
    //Mesh,
    //MeshStandardMaterial,
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
  
  const directionalLight = new DirectionalLight(0x9090aa);
  directionalLight.position.set(1, 1, 1).normalize();
  scene.add(directionalLight);

  let renderer:WebGLRenderer;

  var model = null;
  var camera_angle = 0;
  
  const animate = () => {
    requestAnimationFrame(animate);
    if (model != null) {
      model.rotation.y = camera_angle;
    }
    camera_angle += 0.01;
    renderer.render(scene, camera);
  };

  const resize = () => {
    renderer.setSize(get_model_width(), get_model_height());
    camera.aspect = get_model_width() / get_model_height();
    camera.updateProjectionMatrix();
  };
  
  const createScene = (el:HTMLCanvasElement) => {
    renderer = new WebGLRenderer({ antialias: true, canvas: el });
    resize();
    animate();
  };

  const gltf_loader = new GLTFLoader();

  let three_canvas_element;

  function get_model_width() {
    return Math.round(innerWidth / 3);
  }

  function get_model_height() {
    return Math.round(get_model_width() * 9 / 16);
  }

  async function load_3d_model(model_url) {
    gltf_loader.load(model_url, function(gltf) {
      model = gltf.scene
      scene.add(model);
    });
  }
  
  onMount(async function() {
    createScene(three_canvas_element);
    await load_3d_model("http://64.23.144.229:8000/static/Box.glb");
  });

</script>

<svelte:window bind:innerWidth bind:outerWidth bind:innerHeight bind:outerHeight />

<canvas bind:this={three_canvas_element} style="width: {get_model_width()}px; height: {get_model_height()}px;" />

