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
    renderer.setSize(get_image_width(), get_image_height());
    camera.aspect = get_image_width() / get_image_height();
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

  function get_model_width() {
    return Math.round(innerWidth / 3);
  }

  function get_model_height() {
    return Math.round(get_image_width() * 9 / 16);
  }

  async function load_3d_model() {
    gltf_loader.load("http://64.23.144.229:8000/static/Box.glb", function(gltf) {
      scene.add(gltf.scene);
    });
  }
  
  onMount(async function() {
    await load_3d_model();
    createScene(three_canvas_element);
  });

</script>

<svelte:window bind:innerWidth bind:outerWidth bind:innerHeight bind:outerHeight />

<canvas bind:this={three_canvas_element} style="width: {get_model_width()}px; height: {get_model_height()}px;" />

