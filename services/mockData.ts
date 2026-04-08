import { Category, Wallpaper } from '../types';

const AVIATOR_3D_CODE = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><style>body,html{margin:0;padding:0;width:100%;height:100%;background:#f7d9aa;overflow:hidden}#world{position:absolute;width:100%;height:100%;overflow:hidden;z-index:1}canvas{position:absolute;top:0;left:0;width:100vw!important;height:100vh!important;z-index:99!important;display:block}</style><script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r75/three.min.js"><\/script></head><body><div id="world"></div><script>var Colors={red:0xf25346,yellow:0xedeb27,white:0xd8d0d1,brown:0x59332e,pink:0xF5986E,brownDark:0x23190f,blue:0x68c3c0,green:0x458248,purple:0x551A8B,lightgreen:0x629265};var scene,camera,fieldOfView,aspectRatio,nearPlane,farPlane,HEIGHT,WIDTH,renderer,container;var isPlaying=true;function createScene(){HEIGHT=window.innerHeight||1000;WIDTH=window.innerWidth||500;scene=new THREE.Scene();scene.fog=new THREE.Fog(0xf7d9aa,100,950);aspectRatio=WIDTH/HEIGHT;fieldOfView=60;nearPlane=1;farPlane=10000;camera=new THREE.PerspectiveCamera(fieldOfView,aspectRatio,nearPlane,farPlane);camera.position.x=0;camera.position.y=150;camera.position.z=100;renderer=new THREE.WebGLRenderer({alpha:true,antialias:false,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.setSize(WIDTH,HEIGHT);renderer.shadowMap.enabled=true;container=document.getElementById("world");container.appendChild(renderer.domElement);window.addEventListener("resize",handleWindowResize,false)}function handleWindowResize(){HEIGHT=window.innerHeight;WIDTH=window.innerWidth;renderer.setSize(WIDTH,HEIGHT);camera.aspect=WIDTH/HEIGHT;camera.updateProjectionMatrix()}var hemisphereLight,shadowLight;function createLights(){hemisphereLight=new THREE.HemisphereLight(0xaaaaaa,0x000000,.9);shadowLight=new THREE.DirectionalLight(0xffffff,.9);shadowLight.position.set(0,350,350);shadowLight.castShadow=true;shadowLight.shadow.camera.left=-650;shadowLight.shadow.camera.right=650;shadowLight.shadow.camera.top=650;shadowLight.shadow.camera.bottom=-650;shadowLight.shadow.camera.near=1;shadowLight.shadow.camera.far=1000;shadowLight.shadow.mapSize.width=1024;shadowLight.shadow.mapSize.height=1024;scene.add(hemisphereLight);scene.add(shadowLight)}var Land=function(){var geom=new THREE.CylinderGeometry(600,600,1700,40,10);geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));var mat=new THREE.MeshPhongMaterial({color:Colors.lightgreen,shading:THREE.FlatShading});this.mesh=new THREE.Mesh(geom,mat);this.mesh.receiveShadow=true};var Orbit=function(){this.mesh=new THREE.Object3D()};var Sun=function(){this.mesh=new THREE.Object3D();var sunGeom=new THREE.SphereGeometry(400,20,10);var sunMat=new THREE.MeshPhongMaterial({color:Colors.yellow,shading:THREE.FlatShading});var sun=new THREE.Mesh(sunGeom,sunMat);sun.castShadow=false;sun.receiveShadow=false;this.mesh.add(sun)};var Cloud=function(){this.mesh=new THREE.Object3D();var geom=new THREE.DodecahedronGeometry(20,0);var mat=new THREE.MeshPhongMaterial({color:Colors.white});var nBlocs=3+Math.floor(Math.random()*3);for(var i=0;i<nBlocs;i++){var m=new THREE.Mesh(geom,mat);m.position.x=i*15;m.position.y=Math.random()*10;m.position.z=Math.random()*10;m.rotation.z=Math.random()*Math.PI*2;m.rotation.y=Math.random()*Math.PI*2;var s=.1+Math.random()*.9;m.scale.set(s,s,s);this.mesh.add(m)}};var Sky=function(){this.mesh=new THREE.Object3D();this.nClouds=25;var stepAngle=Math.PI*2/this.nClouds;for(var i=0;i<this.nClouds;i++){var c=new Cloud();var a=stepAngle*i;var h=800+Math.random()*200;c.mesh.position.y=Math.sin(a)*h;c.mesh.position.x=Math.cos(a)*h;c.mesh.rotation.z=a+Math.PI/2;c.mesh.position.z=-400-Math.random()*400;var s=1+Math.random()*2;c.mesh.scale.set(s,s,s);this.mesh.add(c.mesh)}};var Tree=function(){this.mesh=new THREE.Object3D();var matTreeLeaves=new THREE.MeshPhongMaterial({color:Colors.green,shading:THREE.FlatShading});var geonTreeBase=new THREE.BoxGeometry(10,20,10);var matTreeBase=new THREE.MeshBasicMaterial({color:Colors.brown});var treeBase=new THREE.Mesh(geonTreeBase,matTreeBase);treeBase.castShadow=true;treeBase.receiveShadow=true;this.mesh.add(treeBase);var geomTreeLeaves1=new THREE.CylinderGeometry(1,36,36,4);var treeLeaves1=new THREE.Mesh(geomTreeLeaves1,matTreeLeaves);treeLeaves1.castShadow=true;treeLeaves1.receiveShadow=true;treeLeaves1.position.y=20;this.mesh.add(treeLeaves1);var geomTreeLeaves2=new THREE.CylinderGeometry(1,27,27,4);var treeLeaves2=new THREE.Mesh(geomTreeLeaves2,matTreeLeaves);treeLeaves2.castShadow=true;treeLeaves2.receiveShadow=true;treeLeaves2.position.y=40;this.mesh.add(treeLeaves2);var geomTreeLeaves3=new THREE.CylinderGeometry(1,18,18,4);var treeLeaves3=new THREE.Mesh(geomTreeLeaves3,matTreeLeaves);treeLeaves3.castShadow=true;treeLeaves3.receiveShadow=true;treeLeaves3.position.y=55;this.mesh.add(treeLeaves3)};var petalColors=[Colors.red,Colors.yellow,Colors.blue];var Flower=function(){this.mesh=new THREE.Object3D();var geomStem=new THREE.BoxGeometry(5,50,5,1,1,1);var matStem=new THREE.MeshPhongMaterial({color:Colors.green,shading:THREE.FlatShading});var stem=new THREE.Mesh(geomStem,matStem);stem.castShadow=false;stem.receiveShadow=true;this.mesh.add(stem);var geomPetalCore=new THREE.BoxGeometry(10,10,10,1,1,1);var matPetalCore=new THREE.MeshPhongMaterial({color:Colors.yellow,shading:THREE.FlatShading});var petalCore=new THREE.Mesh(geomPetalCore,matPetalCore);petalCore.castShadow=false;petalCore.receiveShadow=true;var petalColor=petalColors[Math.floor(Math.random()*3)];var geomPetal=new THREE.BoxGeometry(15,20,5,1,1,1);var matPetal=new THREE.MeshBasicMaterial({color:petalColor});geomPetal.vertices[5].y-=4;geomPetal.vertices[4].y-=4;geomPetal.vertices[7].y+=4;geomPetal.vertices[6].y+=4;geomPetal.translate(12.5,0,3);var petals=[];for(var i=0;i<4;i++){petals[i]=new THREE.Mesh(geomPetal,matPetal);petals[i].rotation.z=i*Math.PI/2;petals[i].castShadow=true;petals[i].receiveShadow=true}petalCore.add(petals[0],petals[1],petals[2],petals[3]);petalCore.position.y=25;petalCore.position.z=3;this.mesh.add(petalCore)};var Forest=function(){this.mesh=new THREE.Object3D();this.nTrees=60;var stepAngle=Math.PI*2/this.nTrees;for(var i=0;i<this.nTrees;i++){var t=new Tree();var a=stepAngle*i;var h=605;t.mesh.position.y=Math.sin(a)*h;t.mesh.position.x=Math.cos(a)*h;t.mesh.rotation.z=a+(Math.PI/2)*3;t.mesh.position.z=0-Math.random()*600;var s=.3+Math.random()*.75;t.mesh.scale.set(s,s,s);this.mesh.add(t.mesh)}this.nFlowers=60;var stepAngle=Math.PI*2/this.nFlowers;for(var i=0;i<this.nFlowers;i++){var f=new Flower();var a=stepAngle*i;var h=605;f.mesh.position.y=Math.sin(a)*h;f.mesh.position.x=Math.cos(a)*h;f.mesh.rotation.z=a+(Math.PI/2)*3;f.mesh.position.z=0-Math.random()*600;var s=.1+Math.random()*.3;f.mesh.scale.set(s,s,s);this.mesh.add(f.mesh)}};var AirPlane=function(){this.mesh=new THREE.Object3D();var geomCockpit=new THREE.BoxGeometry(80,50,50,1,1,1);var matCockpit=new THREE.MeshPhongMaterial({color:Colors.red,shading:THREE.FlatShading});geomCockpit.vertices[4].y-=10;geomCockpit.vertices[4].z+=20;geomCockpit.vertices[5].y-=10;geomCockpit.vertices[5].z-=20;geomCockpit.vertices[6].y+=30;geomCockpit.vertices[6].z+=20;geomCockpit.vertices[7].y+=30;geomCockpit.vertices[7].z-=20;var cockpit=new THREE.Mesh(geomCockpit,matCockpit);cockpit.castShadow=true;cockpit.receiveShadow=true;this.mesh.add(cockpit);var geomEngine=new THREE.BoxGeometry(20,50,50,1,1,1);var matEngine=new THREE.MeshPhongMaterial({color:Colors.white,shading:THREE.FlatShading});var engine=new THREE.Mesh(geomEngine,matEngine);engine.position.x=40;engine.castShadow=true;engine.receiveShadow=true;this.mesh.add(engine);var geomTailPlane=new THREE.BoxGeometry(15,20,5,1,1,1);var matTailPlane=new THREE.MeshPhongMaterial({color:Colors.red,shading:THREE.FlatShading});var tailPlane=new THREE.Mesh(geomTailPlane,matTailPlane);tailPlane.position.set(-35,25,0);tailPlane.castShadow=true;tailPlane.receiveShadow=true;this.mesh.add(tailPlane);var geomSideWing=new THREE.BoxGeometry(40,4,150,1,1,1);var matSideWing=new THREE.MeshPhongMaterial({color:Colors.red,shading:THREE.FlatShading});var sideWingTop=new THREE.Mesh(geomSideWing,matSideWing);var sideWingBottom=new THREE.Mesh(geomSideWing,matSideWing);sideWingTop.castShadow=true;sideWingTop.receiveShadow=true;sideWingBottom.castShadow=true;sideWingBottom.receiveShadow=true;sideWingTop.position.set(20,12,0);sideWingBottom.position.set(20,-3,0);this.mesh.add(sideWingTop);this.mesh.add(sideWingBottom);var geomWindshield=new THREE.BoxGeometry(3,15,20,1,1,1);var matWindshield=new THREE.MeshPhongMaterial({color:Colors.white,transparent:true,opacity:.3,shading:THREE.FlatShading});var windshield=new THREE.Mesh(geomWindshield,matWindshield);windshield.position.set(5,27,0);windshield.castShadow=true;windshield.receiveShadow=true;this.mesh.add(windshield);var geomPropeller=new THREE.BoxGeometry(20,10,10,1,1,1);geomPropeller.vertices[4].y-=5;geomPropeller.vertices[4].z+=5;geomPropeller.vertices[5].y-=5;geomPropeller.vertices[5].z-=5;geomPropeller.vertices[6].y+=5;geomPropeller.vertices[6].z+=5;geomPropeller.vertices[7].y+=5;geomPropeller.vertices[7].z-=5;var matPropeller=new THREE.MeshPhongMaterial({color:Colors.brown,shading:THREE.FlatShading});this.propeller=new THREE.Mesh(geomPropeller,matPropeller);this.propeller.castShadow=true;this.propeller.receiveShadow=true;var geomBlade1=new THREE.BoxGeometry(1,100,10,1,1,1);var geomBlade2=new THREE.BoxGeometry(1,10,100,1,1,1);var matBlade=new THREE.MeshPhongMaterial({color:Colors.brownDark,shading:THREE.FlatShading});var blade1=new THREE.Mesh(geomBlade1,matBlade);blade1.position.set(8,0,0);blade1.castShadow=true;blade1.receiveShadow=true;var blade2=new THREE.Mesh(geomBlade2,matBlade);blade2.position.set(8,0,0);blade2.castShadow=true;blade2.receiveShadow=true;this.propeller.add(blade1,blade2);this.propeller.position.set(50,0,0);this.mesh.add(this.propeller);var wheelProtecGeom=new THREE.BoxGeometry(30,15,10,1,1,1);var wheelProtecMat=new THREE.MeshPhongMaterial({color:Colors.white,shading:THREE.FlatShading});var wheelProtecR=new THREE.Mesh(wheelProtecGeom,wheelProtecMat);wheelProtecR.position.set(25,-20,25);this.mesh.add(wheelProtecR);var wheelTireGeom=new THREE.BoxGeometry(24,24,4);var wheelTireMat=new THREE.MeshPhongMaterial({color:Colors.brownDark,shading:THREE.FlatShading});var wheelTireR=new THREE.Mesh(wheelTireGeom,wheelTireMat);wheelTireR.position.set(25,-28,25);var wheelAxisGeom=new THREE.BoxGeometry(10,10,6);var wheelAxisMat=new THREE.MeshPhongMaterial({color:Colors.brown,shading:THREE.FlatShading});var wheelAxis=new THREE.Mesh(wheelAxisGeom,wheelAxisMat);wheelTireR.add(wheelAxis);this.mesh.add(wheelTireR);var wheelProtecL=wheelProtecR.clone();wheelProtecL.position.z=-wheelProtecR.position.z;this.mesh.add(wheelProtecL);var wheelTireL=wheelTireR.clone();wheelTireL.position.z=-wheelTireR.position.z;this.mesh.add(wheelTireL);var wheelTireB=wheelTireR.clone();wheelTireB.scale.set(.5,.5,.5);wheelTireB.position.set(-35,-5,0);this.mesh.add(wheelTireB);var suspensionGeom=new THREE.BoxGeometry(4,20,4);suspensionGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,10,0));var suspensionMat=new THREE.MeshPhongMaterial({color:Colors.red,shading:THREE.FlatShading});var suspension=new THREE.Mesh(suspensionGeom,suspensionMat);suspension.position.set(-35,-5,0);suspension.rotation.z=-.3;this.mesh.add(suspension)};var sky,forest,land,orbit,airplane,sun;var mousePos={x:0,y:0};var offSet=-600;function createSky(){sky=new Sky();sky.mesh.position.y=offSet;scene.add(sky.mesh)}function createLand(){land=new Land();land.mesh.position.y=offSet;scene.add(land.mesh)}function createOrbit(){orbit=new Orbit();orbit.mesh.position.y=offSet;orbit.mesh.rotation.z=-Math.PI/6;scene.add(orbit.mesh)}function createForest(){forest=new Forest();forest.mesh.position.y=offSet;scene.add(forest.mesh)}function createSun(){sun=new Sun();sun.mesh.scale.set(1,1,.3);sun.mesh.position.set(0,-30,-850);scene.add(sun.mesh)}function createPlane(){airplane=new AirPlane();airplane.mesh.scale.set(.35,.35,.35);airplane.mesh.position.set(-40,110,-250);scene.add(airplane.mesh)}function updatePlane(){var targetY=normalize(mousePos.y,-.75,.75,50,190);var targetX=normalize(mousePos.x,-.75,.75,-100,-20);airplane.mesh.position.y+=(targetY-airplane.mesh.position.y)*0.01;airplane.mesh.position.x+=(targetX-airplane.mesh.position.x)*0.01;airplane.mesh.rotation.z=(targetY-airplane.mesh.position.y)*0.003;airplane.mesh.rotation.x=(airplane.mesh.position.y-targetY)*0.0015;airplane.mesh.rotation.y=(airplane.mesh.position.x-targetX)*0.0015;airplane.propeller.rotation.x+=0.03}function normalize(v,vmin,vmax,tmin,tmax){var nv=Math.max(Math.min(v,vmax),vmin);var dv=vmax-vmin;var pc=(nv-vmin)/dv;var dt=tmax-tmin;return tmin+(pc*dt)}function loop(){if(!isPlaying)return;land.mesh.rotation.z+=.0004;orbit.mesh.rotation.z+=.0001;sky.mesh.rotation.z+=.0002;forest.mesh.rotation.z+=.0004;updatePlane();renderer.render(scene,camera);requestAnimationFrame(loop)}function handlePointerMove(event){var clientX=event.touches?event.touches[0].clientX:event.clientX;var clientY=event.touches?event.touches[0].clientY:event.clientY;var tx=-1+(clientX/WIDTH)*2;var ty=1-(clientY/HEIGHT)*2;mousePos={x:tx,y:ty}}function init(){createScene();createLights();createPlane();createOrbit();createSun();createLand();createForest();createSky();document.addEventListener("mousemove",handlePointerMove,false);document.addEventListener("touchmove",handlePointerMove,{passive:true});document.addEventListener("touchstart",handlePointerMove,{passive:true});window.addEventListener("pauseWallpaper",()=>isPlaying=false);window.addEventListener("playWallpaper",()=>{if(!isPlaying){isPlaying=true;loop()}});loop()}window.addEventListener("load",()=>{setTimeout(init,500);},false);<\/script></body></html>`;

export const LION_3D_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <style>
    body, html {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background: #ebe5e7;
      overflow: hidden;
      touch-action: none; /* REQUIRED FOR MOBILE DRAGGING */
    }
    #world {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
      z-index: 1;
    }
    canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 99 !important;
      display: block;
    }
  </style>
  <script src="./three.min.js"><\/script>
</head>
<body>
  <div id="world"></div>
  <script>
    var scene, camera, controls, fieldOfView, aspectRatio, nearPlane, farPlane, shadowLight, backLight, light, renderer, container;
    var clock = new THREE.Clock();
    var time = 0;
    var deltaTime = 0;
    var floor, lion, fan, isBlowing = false;
    var HEIGHT, WIDTH, windowHalfX, windowHalfY, mousePos = {x:0,y:0}, dist = 0;
    var isPlaying = true;

    function init(){
      scene = new THREE.Scene();
      
      // FIXED: Fallbacks ensure it gets a dimension even in strict WebViews
      HEIGHT = window.innerHeight || document.documentElement.clientHeight || window.screen.height;
      WIDTH = window.innerWidth || document.documentElement.clientWidth || window.screen.width;
      aspectRatio = WIDTH / HEIGHT;
      fieldOfView = 60;
      nearPlane = 1;
      farPlane = 2000; 
      camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
      camera.position.z = 800;  
      camera.position.y = 0;
      camera.lookAt(new THREE.Vector3(0,0,0));    
      renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(WIDTH, HEIGHT);
      renderer.shadowMap.enabled = true;
      container = document.getElementById('world');
      container.appendChild(renderer.domElement);
      windowHalfX = WIDTH / 2;
      windowHalfY = HEIGHT / 2;
      
      window.addEventListener('resize', onWindowResize, false);
      document.addEventListener('mousemove', handleMouseMove, false);
      document.addEventListener('mousedown', handleMouseDown, false);
      document.addEventListener('mouseup', handleMouseUp, false);
      document.addEventListener('touchstart', handleTouchStart, {passive: false});
      document.addEventListener('touchend', handleTouchEnd, false);
      document.addEventListener('touchmove', handleTouchMove, {passive: false});

      window.addEventListener("pauseWallpaper", () => isPlaying = false);
      window.addEventListener("playWallpaper", () => {
        if(!isPlaying){ isPlaying = true; clock.getDelta(); loop(); }
      });
    }

    function onWindowResize() {
      HEIGHT = window.innerHeight;
      WIDTH = window.innerWidth;
      windowHalfX = WIDTH / 2;
      windowHalfY = HEIGHT / 2;
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
    }

    function handleMouseMove(event) {
      mousePos = {x:event.clientX, y:event.clientY};
    }
    function handleMouseDown(event) {
      isBlowing = true;
    }
    function handleMouseUp(event) {
      isBlowing = false;
    }
    function handleTouchStart(event) {
      if (event.touches.length > 0) {
        mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY};
        isBlowing = true;
      }
    }
    function handleTouchEnd(event) {
      isBlowing = false;
    }
    function handleTouchMove(event) {
      if (event.touches.length > 0) {
        mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY};
        isBlowing = true;
      }
    }

    function createLights() {
      light = new THREE.HemisphereLight(0xffffff, 0xffffff, .5)
      shadowLight = new THREE.DirectionalLight(0xffffff, .8);
      shadowLight.position.set(200, 200, 200);
      shadowLight.castShadow = true;
      backLight = new THREE.DirectionalLight(0xffffff, .4);
      backLight.position.set(-100, 200, 50);
      backLight.castShadow = true;
      scene.add(backLight);
      scene.add(light);
      scene.add(shadowLight);
    }

    function createFloor(){ 
      floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000,500), new THREE.MeshBasicMaterial({color: 0xebe5e7}));
      floor.rotation.x = -Math.PI/2;
      floor.position.y = -100;
      floor.receiveShadow = true;
      scene.add(floor);
    }

    function createLion(){
      lion = new Lion();
      scene.add(lion.threegroup);
    }

    function createFan(){
      fan = new Fan();
      fan.threegroup.position.z = 350;
      scene.add(fan.threegroup);
    }

    Fan = function(){
      this.isBlowing = false;
      this.speed = 0;
      this.acc =0;
      this.redMat = new THREE.MeshLambertMaterial ({color: 0xad3525, shading:THREE.FlatShading});
      this.greyMat = new THREE.MeshLambertMaterial ({color: 0x653f4c, shading:THREE.FlatShading});
      this.yellowMat = new THREE.MeshLambertMaterial ({color: 0xfdd276, shading:THREE.FlatShading});
      var coreGeom = new THREE.BoxGeometry(10,10,20);
      var sphereGeom = new THREE.BoxGeometry(10, 10, 3);
      var propGeom = new THREE.BoxGeometry(10,30,2);
      propGeom.applyMatrix( new THREE.Matrix4().makeTranslation( 0,25,0) );
      this.core = new THREE.Mesh(coreGeom,this.greyMat);
      var prop1 = new THREE.Mesh(propGeom, this.redMat);
      prop1.position.z = 15;
      var prop2 = prop1.clone();
      prop2.rotation.z = Math.PI/2;
      var prop3 = prop1.clone();
      prop3.rotation.z = Math.PI;
      var prop4 = prop1.clone();
      prop4.rotation.z = -Math.PI/2;
      this.sphere = new THREE.Mesh(sphereGeom, this.yellowMat);
      this.sphere.position.z = 15;
      this.propeller = new THREE.Group();
      this.propeller.add(prop1);
      this.propeller.add(prop2);
      this.propeller.add(prop3);
      this.propeller.add(prop4);
      this.threegroup = new THREE.Group();
      this.threegroup.add(this.core);
      this.threegroup.add(this.propeller);
      this.threegroup.add(this.sphere);
    }

    Fan.prototype.update = function(xTarget, yTarget, deltaTime){
      this.threegroup.lookAt(new THREE.Vector3(0,80,60));
      this.tPosX = rule3(xTarget, -200, 200, -250, 250);
      this.tPosY = rule3(yTarget, -200, 200, 250, -250);
      this.threegroup.position.x += (this.tPosX - this.threegroup.position.x) * deltaTime * 4;
      this.threegroup.position.y += (this.tPosY - this.threegroup.position.y) * deltaTime * 4;
      this.targetSpeed = (this.isBlowing) ? 15 * deltaTime: 5 * deltaTime;
      if (this.isBlowing && this.speed < this.targetSpeed){
        this.acc += .01 * deltaTime;
        this.speed += this.acc;
      }else if (!this.isBlowing){
        this.acc = 0;
        this.speed *= Math.pow(.4, deltaTime);
      }
      this.propeller.rotation.z += this.speed ; 
    }

    Lion = function(){
      this.windTime = 0;
      this.bodyInitPositions = [];
      this.maneParts = [];
      this.threegroup = new THREE.Group();
      this.yellowMat = new THREE.MeshLambertMaterial ({color: 0xfdd276, shading:THREE.FlatShading});
      this.redMat = new THREE.MeshLambertMaterial ({color: 0xad3525, shading:THREE.FlatShading});
      this.pinkMat = new THREE.MeshLambertMaterial ({color: 0xe55d2b, shading:THREE.FlatShading});
      this.whiteMat = new THREE.MeshLambertMaterial ({color: 0xffffff, shading:THREE.FlatShading});
      this.purpleMat = new THREE.MeshLambertMaterial ({color: 0x451954, shading:THREE.FlatShading});
      this.greyMat = new THREE.MeshLambertMaterial ({color: 0x653f4c, shading:THREE.FlatShading});
      this.blackMat = new THREE.MeshLambertMaterial ({color: 0x302925, shading:THREE.FlatShading});
      var bodyGeom = new THREE.CylinderGeometry(30,80, 140, 4);
      var maneGeom = new THREE.BoxGeometry(40,40,15);
      var faceGeom = new THREE.BoxGeometry(80,80,80);
      var spotGeom = new THREE.BoxGeometry(4,4,4);
      var mustacheGeom = new THREE.BoxGeometry(30,2,1);
      mustacheGeom.applyMatrix( new THREE.Matrix4().makeTranslation( 15, 0, 0 ) );
      var earGeom = new THREE.BoxGeometry(20,20,20);
      var noseGeom = new THREE.BoxGeometry(40,40,20);
      var eyeGeom = new THREE.BoxGeometry(5,30,30);
      var irisGeom = new THREE.BoxGeometry(4,10,10);
      var mouthGeom = new THREE.BoxGeometry(20,20,10);
      var smileGeom = new THREE.TorusGeometry( 12, 4, 2, 10, Math.PI );
      var lipsGeom = new THREE.BoxGeometry(40,15,20);
      var kneeGeom = new THREE.BoxGeometry(25, 80, 80);
      kneeGeom.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 50, 0 ) );
      var footGeom = new THREE.BoxGeometry(40, 20, 20);
      this.body = new THREE.Mesh(bodyGeom, this.yellowMat);
      this.body.position.z = -60;
      this.body.position.y = -30;
      this.bodyVertices = [0,1,2,3,4,10];
      for (var i=0;i<this.bodyVertices.length; i++){
        var tv = this.body.geometry.vertices[this.bodyVertices[i]];
        tv.z =70;
        this.bodyInitPositions.push({x:tv.x, y:tv.y, z:tv.z});
      }
      this.leftKnee = new THREE.Mesh(kneeGeom, this.yellowMat);
      this.leftKnee.position.x = 65;
      this.leftKnee.position.z = -20;
      this.leftKnee.position.y = -110;
      this.leftKnee.rotation.z = -.3;
      this.rightKnee = new THREE.Mesh(kneeGeom, this.yellowMat);
      this.rightKnee.position.x = -65;
      this.rightKnee.position.z = -20;
      this.rightKnee.position.y = -110;
      this.rightKnee.rotation.z = .3;
      this.backLeftFoot = new THREE.Mesh(footGeom, this.yellowMat);
      this.backLeftFoot.position.z = 30;
      this.backLeftFoot.position.x = 75;
      this.backLeftFoot.position.y = -90;
      this.backRightFoot = new THREE.Mesh(footGeom, this.yellowMat);
      this.backRightFoot.position.z = 30;
      this.backRightFoot.position.x = -75;
      this.backRightFoot.position.y = -90;
      this.frontRightFoot = new THREE.Mesh(footGeom, this.yellowMat);
      this.frontRightFoot.position.z = 40;
      this.frontRightFoot.position.x = -22;
      this.frontRightFoot.position.y = -90;
      this.frontLeftFoot = new THREE.Mesh(footGeom, this.yellowMat);
      this.frontLeftFoot.position.z = 40;
      this.frontLeftFoot.position.x = 22;
      this.frontLeftFoot.position.y = -90;
      this.mane = new THREE.Group();
      for (var j=0; j<4; j++){
        for (var k=0; k<4; k++){
          var manePart = new THREE.Mesh(maneGeom, this.redMat);
          manePart.position.x = (j*40)-60;
          manePart.position.y = (k*40)-60;
          var amp;
          var zOffset;
          var periodOffset = Math.random()*Math.PI*2;     
          if ((j==0 && k==0) || (j==0 && k==3) || (j==3 && k==0) || (j==3 && k==3)){
            amp = -10-Math.floor(Math.random()*5);
            zOffset = -5;
          }else if (j==0 || k ==0 || j==3 || k==3){
            amp = -5-Math.floor(Math.random()*5);
            zOffset = 0;
          }else{
            amp = 0;
            zOffset = 0;
          }
          this.maneParts.push({mesh:manePart, amp:amp, zOffset:zOffset, periodOffset:periodOffset, xInit:manePart.position.x, yInit:manePart.position.y});
          this.mane.add(manePart);
        }
      }
      this.mane.position.y = -10;
      this.mane.position.z = 80;
      this.face = new THREE.Mesh(faceGeom, this.yellowMat);
      this.face.position.z = 135;
      this.mustaches = [];
      this.mustache1 = new THREE.Mesh(mustacheGeom, this.greyMat);
      this.mustache1.position.x = 30;
      this.mustache1.position.y = -5;
      this.mustache1.position.z = 175; 
      this.mustache2 = this.mustache1.clone();
      this.mustache2.position.x = 35;
      this.mustache2.position.y = -12;
      this.mustache3 = this.mustache1.clone();
      this.mustache3.position.y = -19;
      this.mustache3.position.x = 30;  
      this.mustache4 = this.mustache1.clone();
      this.mustache4.rotation.z = Math.PI;
      this.mustache4.position.x = -30;
      this.mustache5 = new THREE.Mesh(mustacheGeom, this.blackMat);
      this.mustache5 = this.mustache2.clone();
      this.mustache5.rotation.z = Math.PI;
      this.mustache5.position.x = -35;
      this.mustache6 = new THREE.Mesh(mustacheGeom, this.blackMat);
      this.mustache6 = this.mustache3.clone();
      this.mustache6.rotation.z = Math.PI;
      this.mustache6.position.x = -30;
      this.mustaches.push(this.mustache1);
      this.mustaches.push(this.mustache2);
      this.mustaches.push(this.mustache3);
      this.mustaches.push(this.mustache4);
      this.mustaches.push(this.mustache5);
      this.mustaches.push(this.mustache6);
      this.spot1 = new THREE.Mesh(spotGeom, this.redMat);
      this.spot1.position.x = 39;
      this.spot1.position.z = 150;
      this.spot2 = this.spot1.clone();
      this.spot2.position.z = 160;
      this.spot2.position.y = -10;
      this.spot3 = this.spot1.clone();
      this.spot3.position.z = 140;
      this.spot3.position.y = -15;
      this.spot4 = this.spot1.clone();
      this.spot4.position.z = 150;
      this.spot4.position.y = -20;
      this.spot5 = this.spot1.clone();
      this.spot5.position.x = -39;
      this.spot6 = this.spot2.clone();
      this.spot6.position.x = -39;
      this.spot7 = this.spot3.clone();
      this.spot7.position.x = -39;
      this.spot8 = this.spot4.clone();
      this.spot8.position.x = -39;
      this.leftEye = new THREE.Mesh(eyeGeom, this.whiteMat);
      this.leftEye.position.x = 40;
      this.leftEye.position.z = 120;
      this.leftEye.position.y = 25;
      this.rightEye = new THREE.Mesh(eyeGeom, this.whiteMat);
      this.rightEye.position.x = -40;
      this.rightEye.position.z = 120;
      this.rightEye.position.y = 25;
      this.leftIris = new THREE.Mesh(irisGeom, this.purpleMat);
      this.leftIris.position.x = 42;
      this.leftIris.position.z = 120;
      this.leftIris.position.y = 25;
      this.rightIris = new THREE.Mesh(irisGeom, this.purpleMat);
      this.rightIris.position.x = -42;
      this.rightIris.position.z = 120;
      this.rightIris.position.y = 25;
      this.mouth = new THREE.Mesh(mouthGeom, this.blackMat);
      this.mouth.position.z = 171;
      this.mouth.position.y = -30;
      this.mouth.scale.set(.5,.5,1);
      this.smile = new THREE.Mesh(smileGeom, this.greyMat);
      this.smile.position.z = 173;  
      this.smile.position.y = -15;
      this.smile.rotation.z = -Math.PI;
      this.lips = new THREE.Mesh(lipsGeom, this.yellowMat);
      this.lips.position.z = 165;
      this.lips.position.y = -45;
      this.rightEar = new THREE.Mesh(earGeom, this.yellowMat);
      this.rightEar.position.x = -50;
      this.rightEar.position.y = 50;
      this.rightEar.position.z = 105;
      this.leftEar = new THREE.Mesh(earGeom, this.yellowMat);
      this.leftEar.position.x = 50;
      this.leftEar.position.y = 50;
      this.leftEar.position.z = 105;
      this.nose = new THREE.Mesh(noseGeom, this.greyMat);
      this.nose.position.z = 170;
      this.nose.position.y = 25;
      this.head = new THREE.Group();
      this.head.add(this.face);
      this.head.add(this.mane);
      this.head.add(this.rightEar);
      this.head.add(this.leftEar);
      this.head.add(this.nose);
      this.head.add(this.leftEye);
      this.head.add(this.rightEye);
      this.head.add(this.leftIris);
      this.head.add(this.rightIris);
      this.head.add(this.mouth);
      this.head.add(this.smile);
      this.head.add(this.lips);
      this.head.add(this.spot1);
      this.head.add(this.spot2);
      this.head.add(this.spot3);
      this.head.add(this.spot4);
      this.head.add(this.spot5);
      this.head.add(this.spot6);
      this.head.add(this.spot7);
      this.head.add(this.spot8);
      this.head.add(this.mustache1);
      this.head.add(this.mustache2);
      this.head.add(this.mustache3);
      this.head.add(this.mustache4);
      this.head.add(this.mustache5);
      this.head.add(this.mustache6);
      this.head.position.y = 60;
      this.threegroup.add(this.body);
      this.threegroup.add(this.head);
      this.threegroup.add(this.leftKnee);
      this.threegroup.add(this.rightKnee);
      this.threegroup.add(this.backLeftFoot);
      this.threegroup.add(this.backRightFoot);
      this.threegroup.add(this.frontRightFoot);
      this.threegroup.add(this.frontLeftFoot);
      this.threegroup.traverse( function ( object ) {
        if ( object instanceof THREE.Mesh ) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });
    }

    Lion.prototype.updateBody = function(speed){
      this.head.rotation.y += (this.tHeagRotY - this.head.rotation.y) / speed;
      this.head.rotation.x += (this.tHeadRotX - this.head.rotation.x) / speed;
      this.head.position.x += (this.tHeadPosX-this.head.position.x) / speed; 
      this.head.position.y += (this.tHeadPosY-this.head.position.y) / speed; 
      this.head.position.z += (this.tHeadPosZ-this.head.position.z) / speed; 
      this.leftEye.scale.y += (this.tEyeScale - this.leftEye.scale.y) / (speed*2);
      this.rightEye.scale.y = this.leftEye.scale.y;
      this.leftIris.scale.y += (this.tIrisYScale - this.leftIris.scale.y) / (speed*2);
      this.rightIris.scale.y = this.leftIris.scale.y;
      this.leftIris.scale.z += (this.tIrisZScale - this.leftIris.scale.z) / (speed*2);
      this.rightIris.scale.z = this.leftIris.scale.z;
      this.leftIris.position.y += (this.tIrisPosY - this.leftIris.position.y) / speed;
      this.rightIris.position.y = this.leftIris.position.y;
      this.leftIris.position.z += (this.tLeftIrisPosZ - this.leftIris.position.z) / speed;
      this.rightIris.position.z += (this.tRightIrisPosZ - this.rightIris.position.z) / speed;
      this.rightKnee.rotation.z += (this.tRightKneeRotZ - this.rightKnee.rotation.z) / speed;
      this.leftKnee.rotation.z += (this.tLeftKneeRotZ - this.leftKnee.rotation.z) / speed;
      this.lips.position.x += (this.tLipsPosX - this.lips.position.x) / speed;
      this.lips.position.y += (this.tLipsPosY - this.lips.position.y) / speed;
      this.smile.position.x += (this.tSmilePosX - this.smile.position.x) / speed;
      this.mouth.position.z += (this.tMouthPosZ - this.mouth.position.z) / speed;
      this.smile.position.z += (this.tSmilePosZ - this.smile.position.z) / speed;
      this.smile.position.y += (this.tSmilePosY - this.smile.position.y) / speed;
      this.smile.rotation.z += (this.tSmileRotZ - this.smile.rotation.z) / speed;
    }

    Lion.prototype.look = function(xTarget, yTarget){
      this.tHeagRotY = rule3(xTarget, -200, 200, -Math.PI/4, Math.PI/4);
      this.tHeadRotX = rule3(yTarget, -200,200, -Math.PI/4, Math.PI/4);
      this.tHeadPosX = rule3(xTarget, -200, 200, 70,-70);
      this.tHeadPosY = rule3(yTarget, -140, 260, 20, 100);
      this.tHeadPosZ = 0;
      this.tEyeScale = 1;
      this.tIrisYScale = 1;
      this.tIrisZScale = 1;
      this.tIrisPosY = rule3(yTarget, -200,200, 35,15);
      this.tLeftIrisPosZ = rule3(xTarget, -200, 200, 130, 110);
      this.tRightIrisPosZ = rule3(xTarget, -200, 200, 110, 130);
      this.tLipsPosX = 0;
      this.tLipsPosY = -45;
      this.tSmilePosX = 0;
      this.tMouthPosZ = 174;
      this.tSmilePosZ = 173;
      this.tSmilePosY = -15;
      this.tSmileRotZ = -Math.PI;
      this.tRightKneeRotZ = rule3(xTarget, -200, 200, .3-Math.PI/8, .3+Math.PI/8);
      this.tLeftKneeRotZ = rule3(xTarget, -200, 200, -.3-Math.PI/8, -.3+Math.PI/8)
      this.updateBody(10);
      this.mane.rotation.y = 0;
      this.mane.rotation.x = 0;
      for (var i=0; i<this.maneParts.length; i++){
        var m = this.maneParts[i].mesh;
        m.position.z = 0;
        m.rotation.y = 0;
      }
      for (var i=0; i<this.mustaches.length; i++){
        var m = this.mustaches[i];
        m.rotation.y = 0;
      }
      for (var i=0; i<this.bodyVertices.length; i++){
         var tvInit = this.bodyInitPositions[i];
          var tv = this.body.geometry.vertices[this.bodyVertices[i]];
          tv.x = tvInit.x + this.head.position.x;
      }
      this.body.geometry.verticesNeedUpdate = true;
    }

    Lion.prototype.cool = function(xTarget, yTarget, deltaTime){
      this.tHeagRotY = rule3(xTarget, -200, 200, Math.PI/4, -Math.PI/4);
      this.tHeadRotX = rule3(yTarget, -200,200, Math.PI/4, -Math.PI/4);
      this.tHeadPosX = rule3(xTarget, -200, 200, -70,70);
      this.tHeadPosY = rule3(yTarget, -140, 260, 100, 20);
      this.tHeadPosZ = 100;
      this.tEyeScale = 0.1;
      this.tIrisYScale = 0.1;
      this.tIrisZScale = 3;
      this.tIrisPosY = 20;
      this.tLeftIrisPosZ = 120;
      this.tRightIrisPosZ = 120;
      this.tLipsPosX = rule3(xTarget, -200, 200, -15,15);
      this.tLipsPosY = rule3(yTarget, -200, 200, -45,-40);
      this.tMouthPosZ = 168;
      this.tSmilePosX = rule3(xTarget, -200, 200, -15,15); 
      this.tSmilePosY = rule3(yTarget, -200, 200, -20,-8); 
      this.tSmilePosZ = 176;
      this.tSmileRotZ = rule3(xTarget, -200, 200, -Math.PI-.3, -Math.PI+.3);
      this.tRightKneeRotZ = rule3(xTarget, -200, 200, .3+Math.PI/8, .3-Math.PI/8);
      this.tLeftKneeRotZ = rule3(xTarget, -200, 200, -.3+Math.PI/8, -.3-Math.PI/8);
      this.updateBody(10);
      this.mane.rotation.y = -.8*this.head.rotation.y;
      this.mane.rotation.x = -.8*this.head.rotation.x;
      var dt = 20000 / (xTarget*xTarget+yTarget*yTarget);
      dt = Math.max(Math.min(dt,1), .5);
      this.windTime += dt * deltaTime * 40;
      for (var i=0; i<this.maneParts.length; i++){
        var m = this.maneParts[i].mesh;
        var amp = this.maneParts[i].amp;
        var zOffset = this.maneParts[i].zOffset;
        var periodOffset = this.maneParts[i].periodOffset;
        m.position.z = zOffset + Math.sin(this.windTime+periodOffset)*amp*dt*2;   
      }
      this.leftEar.rotation.x = Math.cos(this.windTime)*Math.PI/16*dt; 
      this.rightEar.rotation.x = -Math.cos(this.windTime)*Math.PI/16*dt; 
      for (var i=0; i<this.mustaches.length; i++){
        var m = this.mustaches[i];
        var amp = (i<3) ? -Math.PI/8 : Math.PI/8;
        m.rotation.y = amp + Math.cos(this.windTime + i)*dt*amp;   
      };
      for (var i=0; i<this.bodyVertices.length; i++){
         var tvInit = this.bodyInitPositions[i];
          var tv = this.body.geometry.vertices[this.bodyVertices[i]];
          tv.x = tvInit.x + this.head.position.x;
      }
      this.body.geometry.verticesNeedUpdate = true;
    }

    function loop(){
      if(!isPlaying) {
        requestAnimationFrame(loop);
        return;
      }
      deltaTime = clock.getDelta();
      time += deltaTime;
      render();
      var xTarget = (mousePos.x-windowHalfX);
      var yTarget= (mousePos.y-windowHalfY);
      fan.isBlowing = isBlowing;
      fan.update(xTarget, yTarget, deltaTime);
      if(isBlowing) {
        lion.cool(xTarget, yTarget, deltaTime);
      }else{
        lion.look(xTarget, yTarget);
      }
      requestAnimationFrame(loop);
    }

    function render(){
      renderer.render(scene, camera);
    }

    // FIXED: Use setTimeout to bypass Android WebView window.onload bug
    setTimeout(() => {
        init();
        createLights();
        createFloor();
        createLion();
        createFan();
        loop();
    }, 100);

    function rule3(v,vmin,vmax,tmin, tmax){
      var nv = Math.max(Math.min(v,vmax), vmin);
      var dv = vmax-vmin;
      var pc = (nv-vmin)/dv;
      var dt = tmax-tmin;
      var tv = tmin + (pc*dt);
      return tv;
    }
  <\/script>
</body>
</html>`;

export const RUNNER_3D_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <link href="https://fonts.googleapis.com/css?family=Voltaire" rel="stylesheet">
  <style>
    body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background-color: #dbe6e6; touch-action: none; }
    #world { position: absolute; width: 100%; height: 100%; background-color: #dbe6e6; overflow: hidden; z-index: 1; }
    canvas { position: absolute; top: 0; left: 0; width: 100vw !important; height: 100vh !important; z-index: 99 !important; display: block; }
    
    #gameoverInstructions {
      position: absolute; font-family: 'Voltaire', sans-serif; font-weight: bold; text-transform: uppercase;
      font-size: 80px; text-align: center; color: #ffc5a2; opacity: 0; left: 50%; top: 50%;
      width: 100%; transform: translate(-50%, -100%); user-select: none; transition: all 500ms ease-in-out; z-index: 100;
    }
    #gameoverInstructions.show { opacity: 1; transform: translate(-50%, -50%); transition: all 500ms ease-in-out; }
    
    #dist { position: absolute; left: 50%; top: 50px; transform: translate(-50%, 0%); user-select: none; z-index: 100; }
    .label { position: relative; font-family: 'Voltaire', sans-serif; text-transform: uppercase; color: #ffa873; font-size: 12px; letter-spacing: 2px; text-align: center; margin-bottom: 5px; }
    #distValue { position: relative; text-transform: uppercase; color: #dc5f45; font-size: 40px; font-family: 'Voltaire'; text-align: center; }
    
    #instructions { position: absolute; width: 100%; bottom: 0; margin: auto; margin-bottom: 50px; font-family: 'Voltaire', sans-serif; color: #dc5f45; font-size: 16px; letter-spacing: 1px; text-transform: uppercase; text-align: center; user-select: none; z-index: 100;}
    .lightInstructions { color: #5f9042; }
  </style>
  <script src="./three.min.js"><\/script>
  <script src="./TweenMax.min.js"><\/script>
</head>
<body>
  <div id="world"></div>
  <div id="gameoverInstructions">Game Over</div>
  <div id="dist"><div class="label">distance</div><div id="distValue">000</div></div>
  <div id="instructions">Tap to jump<br><span class="lightInstructions">Grab carrots / avoid hedgehogs</span></div>

  <script>
    //THREEJS RELATED VARIABLES
    var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, gobalLight, shadowLight, backLight, renderer, container, controls, clock;
    var delta = 0, floorRadius = 200, speed = 6, distance = 0, level = 1, levelInterval, levelUpdateFreq = 3000;
    var initSpeed = 5, maxSpeed = 48, monsterPos = .65, monsterPosTarget = .65, floorRotation = 0;
    var collisionObstacle = 10, collisionBonus = 20, gameStatus = "play";
    var cameraPosGame = 160, cameraPosGameOver = 260, monsterAcceleration = 0.004;
    var malusClearColor = 0xb44b39, malusClearAlpha = 0;
    
    var fieldGameOver, fieldDistance;
    var HEIGHT, WIDTH, windowHalfX, windowHalfY, mousePos = { x: 0, y: 0 };
    var hero;
    var isPlaying = true; // For battery optimization

    // Materials
    var blackMat = new THREE.MeshPhongMaterial({ color: 0x100707, shading:THREE.FlatShading });
    var brownMat = new THREE.MeshPhongMaterial({ color: 0xb44b39, shininess:0, shading:THREE.FlatShading });
    var greenMat = new THREE.MeshPhongMaterial({ color: 0x7abf8e, shininess:0, shading:THREE.FlatShading });
    var pinkMat = new THREE.MeshPhongMaterial({ color: 0xdc5f45, shininess:0, shading:THREE.FlatShading });
    var lightBrownMat = new THREE.MeshPhongMaterial({ color: 0xe07a57, shading:THREE.FlatShading });
    var whiteMat = new THREE.MeshPhongMaterial({ color: 0xa49789,  shading:THREE.FlatShading });
    var skinMat = new THREE.MeshPhongMaterial({ color: 0xff9ea5, shading:THREE.FlatShading });

    var PI = Math.PI;

    //INIT THREE JS, SCREEN AND MOUSE EVENTS
    function initScreenAnd3D() {
      HEIGHT = window.innerHeight;
      WIDTH = window.innerWidth;
      windowHalfX = WIDTH / 2;
      windowHalfY = HEIGHT / 2;

      scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0xd6eae6, 160,350);
      
      aspectRatio = WIDTH / HEIGHT;
      
      // THE MOBILE ZOOM TRICK: Wide FOV on mobile, standard 50 on desktop.
      fieldOfView = (WIDTH < 600) ? 90 : 50; 
      
      nearPlane = 1;
      farPlane = 2000;
      camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
      camera.position.x = 0;
      camera.position.z = cameraPosGame;
      camera.position.y = 30;
      camera.lookAt(new THREE.Vector3(0, 30, 0));

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(window.devicePixelRatio); 
      renderer.setClearColor( malusClearColor, malusClearAlpha);
      renderer.setSize(WIDTH, HEIGHT);
      renderer.shadowMap.enabled = true;

      container = document.getElementById('world');
      container.appendChild(renderer.domElement);

      window.addEventListener('resize', handleWindowResize, false);
      document.addEventListener('mousedown', handleMouseDown, false);
      document.addEventListener("touchstart", handleMouseDown, {passive: true});

      window.addEventListener("pauseWallpaper", () => isPlaying = false);
      window.addEventListener("playWallpaper", () => { if(!isPlaying){ isPlaying = true; clock.getDelta(); loop(); }});

      clock = new THREE.Clock();
    }

    function handleWindowResize() {
      HEIGHT = window.innerHeight; WIDTH = window.innerWidth;
      windowHalfX = WIDTH / 2; windowHalfY = HEIGHT / 2;
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
    }

    function handleMouseDown(event){
      if (gameStatus == "play") hero.jump();
      else if (gameStatus == "readyToReplay"){ replay(); }
    }

    function createLights() {
      globalLight = new THREE.AmbientLight(0xffffff, .9);
      shadowLight = new THREE.DirectionalLight(0xffffff, 1);
      shadowLight.position.set(-30, 40, 20);
      shadowLight.castShadow = true;
      shadowLight.shadow.camera.left = -400;
      shadowLight.shadow.camera.right = 400;
      shadowLight.shadow.camera.top = 400;
      shadowLight.shadow.camera.bottom = -400;
      shadowLight.shadow.camera.near = 1;
      shadowLight.shadow.camera.far = 2000;
      shadowLight.shadow.mapSize.width = shadowLight.shadow.mapSize.height = 2048;
      scene.add(globalLight);
      scene.add(shadowLight);
    }

    function createFloor() {
      floorShadow = new THREE.Mesh(new THREE.SphereGeometry(floorRadius, 50, 50), new THREE.MeshPhongMaterial({
        color: 0x7abf8e, specular:0x000000, shininess:1, transparent:true, opacity:.5
      }));
      floorShadow.receiveShadow = true;
      floorGrass = new THREE.Mesh(new THREE.SphereGeometry(floorRadius-.5, 50, 50), new THREE.MeshBasicMaterial({ color: 0x7abf8e }));
      floorGrass.receiveShadow = false;
      floor = new THREE.Group();
      floor.position.y = -floorRadius;
      floor.add(floorShadow);
      floor.add(floorGrass);
      scene.add(floor);
    }

    Hero = function() {
      this.status = "running";
      this.runningCycle = 0;
      this.mesh = new THREE.Group();
      this.body = new THREE.Group();
      this.mesh.add(this.body);
      
      var torsoGeom = new THREE.CubeGeometry(7, 7, 10, 1);
      this.torso = new THREE.Mesh(torsoGeom, brownMat);
      this.torso.position.z = 0; this.torso.position.y = 7; this.torso.castShadow = true;
      this.body.add(this.torso);
      
      var pantsGeom = new THREE.CubeGeometry(9, 9, 5, 1);
      this.pants = new THREE.Mesh(pantsGeom, whiteMat);
      this.pants.position.z = -3; this.pants.position.y = 0; this.pants.castShadow = true;
      this.torso.add(this.pants);
      
      var tailGeom = new THREE.CubeGeometry(3, 3, 3, 1);
      tailGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,-2));
      this.tail = new THREE.Mesh(tailGeom, lightBrownMat);
      this.tail.position.z = -4; this.tail.position.y = 5; this.tail.castShadow = true;
      this.torso.add(this.tail);
      
      this.torso.rotation.x = -Math.PI/8;
      
      var headGeom = new THREE.CubeGeometry(10, 10, 13, 1);
      headGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,7.5));
      this.head = new THREE.Mesh(headGeom, brownMat);
      this.head.position.z = 2; this.head.position.y = 11; this.head.castShadow = true;
      this.body.add(this.head);
      
      var cheekGeom = new THREE.CubeGeometry(1, 4, 4, 1);
      this.cheekR = new THREE.Mesh(cheekGeom, pinkMat);
      this.cheekR.position.x = -5; this.cheekR.position.z = 7; this.cheekR.position.y = -2.5; this.cheekR.castShadow = true;
      this.head.add(this.cheekR);
      
      this.cheekL = this.cheekR.clone();
      this.cheekL.position.x = - this.cheekR.position.x;
      this.head.add(this.cheekL);
      
      var noseGeom = new THREE.CubeGeometry(6, 6, 3, 1);
      this.nose = new THREE.Mesh(noseGeom, lightBrownMat);
      this.nose.position.z = 13.5; this.nose.position.y = 2.6; this.nose.castShadow = true;
      this.head.add(this.nose);
      
      var mouthGeom = new THREE.CubeGeometry(4, 2, 4, 1);
      mouthGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,3));
      mouthGeom.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI/12));
      this.mouth = new THREE.Mesh(mouthGeom, brownMat);
      this.mouth.position.z = 8; this.mouth.position.y = -4; this.mouth.castShadow = true;
      this.head.add(this.mouth);
      
      var pawFGeom = new THREE.CubeGeometry(3,3,3, 1);
      this.pawFR = new THREE.Mesh(pawFGeom, lightBrownMat);
      this.pawFR.position.x = -2; this.pawFR.position.z = 6; this.pawFR.position.y = 1.5; this.pawFR.castShadow = true;
      this.body.add(this.pawFR);
      
      this.pawFL = this.pawFR.clone();
      this.pawFL.position.x = - this.pawFR.position.x; this.pawFL.castShadow = true;
      this.body.add(this.pawFL);
      
      var pawBGeom = new THREE.CubeGeometry(3,3,6, 1);
      this.pawBL = new THREE.Mesh(pawBGeom, lightBrownMat);
      this.pawBL.position.y = 1.5; this.pawBL.position.z = 0; this.pawBL.position.x = 5; this.pawBL.castShadow = true;
      this.body.add(this.pawBL);
      
      this.pawBR = this.pawBL.clone();
      this.pawBR.position.x = - this.pawBL.position.x; this.pawBR.castShadow = true;
      this.body.add(this.pawBR);
      
      var earGeom = new THREE.CubeGeometry(7, 18, 2, 1);
      earGeom.vertices[6].x+=2; earGeom.vertices[6].z+=.5;
      earGeom.vertices[7].x+=2; earGeom.vertices[7].z-=.5;
      earGeom.vertices[2].x-=2; earGeom.vertices[2].z-=.5;
      earGeom.vertices[3].x-=2; earGeom.vertices[3].z+=.5;
      earGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,9,0));
      
      this.earL = new THREE.Mesh(earGeom, brownMat);
      this.earL.position.x = 2; this.earL.position.z = 2.5; this.earL.position.y = 5; this.earL.rotation.z = -Math.PI/12; this.earL.castShadow = true;
      this.head.add(this.earL);
      
      this.earR = this.earL.clone();
      this.earR.position.x = -this.earL.position.x; this.earR.rotation.z = -this.earL.rotation.z; this.earR.castShadow = true;
      this.head.add(this.earR);
      
      var eyeGeom = new THREE.CubeGeometry(2,4,4);
      this.eyeL = new THREE.Mesh(eyeGeom, whiteMat);
      this.eyeL.position.x = 5; this.eyeL.position.z = 5.5; this.eyeL.position.y = 2.9; this.eyeL.castShadow = true;
      this.head.add(this.eyeL);
      
      var irisGeom = new THREE.CubeGeometry(.6,2,2);
      this.iris = new THREE.Mesh(irisGeom, blackMat);
      this.iris.position.x = 1.2; this.iris.position.y = 1; this.iris.position.z = 1;
      this.eyeL.add(this.iris);
      
      this.eyeR = this.eyeL.clone();
      this.eyeR.children[0].position.x = -this.iris.position.x;
      
      
      this.eyeR.position.x = -this.eyeL.position.x;
      this.head.add(this.eyeR);

      this.body.traverse(function(object) {
        if (object instanceof THREE.Mesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });
    }

    BonusParticles = function(){
      this.mesh = new THREE.Group();
      var bigParticleGeom = new THREE.CubeGeometry(10,10,10,1);
      var smallParticleGeom = new THREE.CubeGeometry(5,5,5,1);
      this.parts = [];
      for (var i=0; i<10; i++){
        var partPink = new THREE.Mesh(bigParticleGeom, pinkMat);
        var partGreen = new THREE.Mesh(smallParticleGeom, greenMat);
        partGreen.scale.set(.5,.5,.5);
        this.parts.push(partPink);
        this.parts.push(partGreen);
        this.mesh.add(partPink);
        this.mesh.add(partGreen);
      }
    }

    BonusParticles.prototype.explose = function(){
      var _this = this;
      var explosionSpeed = .5;
      for(var i=0; i<this.parts.length; i++){
        var tx = -50 + Math.random()*100;
        var ty = -50 + Math.random()*100;
        var tz = -50 + Math.random()*100;
        var p = this.parts[i];
        p.position.set(0,0,0);
        p.scale.set(1,1,1);
        p.visible = true;
        var s = explosionSpeed + Math.random()*.5;
        TweenMax.to(p.position, s,{x:tx, y:ty, z:tz, ease:Power4.easeOut});
        TweenMax.to(p.scale, s,{x:.01, y:.01, z:.01, ease:Power4.easeOut, onComplete:removeParticle, onCompleteParams:[p]});
      }
    }

    function removeParticle(p){
      p.visible = false;
    }

    Hero.prototype.run = function(){
      this.status = "running";
      
      var s = Math.min(speed,maxSpeed);
      
      this.runningCycle += delta * s * .7;
      this.runningCycle = this.runningCycle % (Math.PI*2);
      var t = this.runningCycle;
      
      var amp = 4;
      var disp = .2;
      
      // BODY
      
      this.body.position.y = 6+ Math.sin(t - Math.PI/2)*amp;
      this.body.rotation.x = .2 + Math.sin(t - Math.PI/2)*amp*.1;
      
      this.torso.rotation.x =  Math.sin(t - Math.PI/2)*amp*.1;
      this.torso.position.y =  7 + Math.sin(t - Math.PI/2)*amp*.5;
      
      // MOUTH
      this.mouth.rotation.x = Math.PI/16 + Math.cos(t)*amp*.05;
      
      // HEAD
      this.head.position.z = 2 + Math.sin(t - Math.PI/2)*amp*.5;
      this.head.position.y = 8 + Math.cos(t - Math.PI/2)*amp*.7;
      this.head.rotation.x = -.2 + Math.sin(t + Math.PI)*amp*.1;
      
      // EARS
      this.earL.rotation.x = Math.cos(-Math.PI/2 + t)*(amp*.2);
      this.earR.rotation.x = Math.cos(-Math.PI/2 + .2 + t)*(amp*.3);
      
      // EYES
      this.eyeR.scale.y = this.eyeL.scale.y = .7 +  Math.abs(Math.cos(-Math.PI/4 + t*.5))*.6;
      
      // TAIL
      this.tail.rotation.x = Math.cos(Math.PI/2 + t)*amp*.3;
      
      // FRONT RIGHT PAW
      this.pawFR.position.y = 1.5 + Math.sin(t)*amp;
      this.pawFR.rotation.x = Math.cos(t ) * Math.PI/4;
      
      
      this.pawFR.position.z = 6 - Math.cos(t)*amp*2;
      
      // FRONT LEFT PAW
      
      this.pawFL.position.y = 1.5 + Math.sin(disp + t)*amp;
      this.pawFL.rotation.x = Math.cos( t ) * Math.PI/4;
      
      
      this.pawFL.position.z = 6 - Math.cos(disp+t)*amp*2;
      
      // BACK RIGHT PAW
      this.pawBR.position.y = 1.5 + Math.sin(Math.PI + t)*amp;
      this.pawBR.rotation.x = Math.cos(t + Math.PI*1.5) * Math.PI/3;
      
      
      this.pawBR.position.z = - Math.cos(Math.PI + t)*amp;
      
      // BACK LEFT PAW
      this.pawBL.position.y = 1.5 + Math.sin(Math.PI + t)*amp;
      this.pawBL.rotation.x = Math.cos(t + Math.PI *1.5) * Math.PI/3;
      
      
      this.pawBL.position.z = - Math.cos(Math.PI + t)*amp;
      
      
    }

    Hero.prototype.jump = function(){
      if (this.status == "jumping") return;
      this.status = "jumping";
      var _this = this;
      var totalSpeed = 10 / speed;
      var jumpHeight = 45;
      
      TweenMax.to(this.earL.rotation, totalSpeed, {x:"+=.3", ease:Back.easeOut});
      TweenMax.to(this.earR.rotation, totalSpeed, {x:"-=.3", ease:Back.easeOut});
      
      TweenMax.to(this.pawFL.rotation, totalSpeed, {x:"+=.7", ease:Back.easeOut});
      TweenMax.to(this.pawFR.rotation, totalSpeed, {x:"-=.7", ease:Back.easeOut});
      TweenMax.to(this.pawBL.rotation, totalSpeed, {x:"+=.7", ease:Back.easeOut});
      TweenMax.to(this.pawBR.rotation, totalSpeed, {x:"-=.7", ease:Back.easeOut});
      
      TweenMax.to(this.tail.rotation, totalSpeed, {x:"+=1", ease:Back.easeOut});
      
      TweenMax.to(this.mouth.rotation, totalSpeed, {x:.5, ease:Back.easeOut});
      
      TweenMax.to(this.mesh.position, totalSpeed/2, {y:jumpHeight, ease:Power2.easeOut});
      TweenMax.to(this.mesh.position, totalSpeed/2, {y:0, ease:Power4.easeIn, delay:totalSpeed/2, onComplete: function(){
        //t = 0;
        _this.status="running";
      }});
      
    }


    Monster = function(){
      
      this.runningCycle = 0;
      
      this.mesh = new THREE.Group();
      this.body = new THREE.Group();
      
      var torsoGeom = new THREE.CubeGeometry(15,15,20, 1);
      this.torso = new THREE.Mesh(torsoGeom, blackMat);
      
      var headGeom = new THREE.CubeGeometry(20,20,40, 1);
      headGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,20));
      this.head = new THREE.Mesh(headGeom, blackMat);
      this.head.position.z = 12;
      this.head.position.y = 2;
      
      var mouthGeom = new THREE.CubeGeometry(10,4,20, 1);
      mouthGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,-2,10));
      this.mouth = new THREE.Mesh(mouthGeom, blackMat);
      this.mouth.position.y = -8;
      this.mouth.rotation.x = .4;
      this.mouth.position.z = 4;
      
      this.heroHolder = new THREE.Group();
      this.heroHolder.position.z = 20;
      this.mouth.add(this.heroHolder);
      
      var toothGeom = new THREE.CubeGeometry(2,2,1,1);
      
      toothGeom.vertices[1].x-=1;
      toothGeom.vertices[4].x+=1;
      toothGeom.vertices[5].x+=1;
      toothGeom.vertices[0].x-=1;
      
      for(var i=0; i<3; i++){
        var toothf = new THREE.Mesh(toothGeom, whiteMat);
        toothf.position.x = -2.8 + i*2.5;
        toothf.position.y = 1;
        toothf.position.z = 19;
        
        var toothl = new THREE.Mesh(toothGeom, whiteMat);
        toothl.rotation.y = Math.PI/2;
        toothl.position.z = 12 + i*2.5;
        toothl.position.y = 1;
        toothl.position.x = 4;
        
        var toothr = toothl.clone();
        toothl.position.x = -4;
        
        this.mouth.add(toothf);
        this.mouth.add(toothl);
        this.mouth.add(toothr);
      }
      
      var tongueGeometry = new THREE.CubeGeometry(6,1,14);
      tongueGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,0,7));
      
      this.tongue = new THREE.Mesh(tongueGeometry, pinkMat);
      this.tongue.position.z = 2;
      this.tongue.rotation.x = -.2;
      this.mouth.add(this.tongue);
      
      var noseGeom = new THREE.CubeGeometry(4,4,4, 1);
      this.nose = new THREE.Mesh(noseGeom, pinkMat);
      this.nose.position.z = 39.5;
      this.nose.position.y = 9;
      this.head.add(this.nose);
      
      this.head.add(this.mouth);
      
      var eyeGeom = new THREE.CubeGeometry(2,3,3);
      
      this.eyeL = new THREE.Mesh(eyeGeom, whiteMat);
      this.eyeL.position.x = 10;
      this.eyeL.position.z = 5;
      this.eyeL.position.y = 5;
      this.eyeL.castShadow = true;
      this.head.add(this.eyeL);
      
      var irisGeom = new THREE.CubeGeometry(.6,1,1);
      
      this.iris = new THREE.Mesh(irisGeom, blackMat);
      this.iris.position.x = 1.2;
      this.iris.position.y = -1;
      this.iris.position.z = 1;
      this.eyeL.add(this.iris);
      
      this.eyeR = this.eyeL.clone();
      this.eyeR.children[0].position.x = -this.iris.position.x;
      this.eyeR.position.x = -this.eyeL.position.x;
      this.head.add(this.eyeR);
      
      
      var earGeom = new THREE.CubeGeometry(8, 6, 2, 1);
      earGeom.vertices[1].x-=4;
      earGeom.vertices[4].x+=4;
      earGeom.vertices[5].x+=4;
      earGeom.vertices[5].z-=2;
      earGeom.vertices[0].x-=4;
      earGeom.vertices[0].z-=2;

      
      earGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,3,0));
      
      this.earL = new THREE.Mesh(earGeom, blackMat);
      this.earL.position.x = 6;
      this.earL.position.z = 1;
      this.earL.position.y = 10;
      this.earL.castShadow = true;
      this.head.add(this.earL);
      
      this.earR = this.earL.clone();
      this.earR.position.x = -this.earL.position.x;
      this.earR.rotation.z = -this.earL.rotation.z;
      this.head.add(this.earR);
      
      var tailGeom = new THREE.CylinderGeometry(5,2, 20, 4, 1);
      tailGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,10,0));
      tailGeom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
      tailGeom.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI/4));
      
      this.tail = new THREE.Mesh(tailGeom, blackMat);
      this.tail.position.z = -10;
      this.tail.position.y = 4;
      this.torso.add(this.tail);
      
      
      var pawGeom = new THREE.CylinderGeometry(1.5,0,10);
      pawGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,-5,0));
      this.pawFL = new THREE.Mesh(pawGeom, blackMat);
      this.pawFL.position.y = -7.5;
      this.pawFL.position.z = 8.5;
      this.pawFL.position.x = 5.5;
      this.torso.add(this.pawFL);
      
      this.pawFR = this.pawFL.clone();
      this.pawFR.position.x = - this.pawFL.position.x;
      this.torso.add(this.pawFR);
      
      this.pawBR = this.pawFR.clone();
      this.pawBR.position.z = - this.pawFL.position.z;
      this.torso.add(this.pawBR);
      
      this.pawBL = this.pawBR.clone();
      this.pawBL.position.x = this.pawFL.position.x;
      this.torso.add(this.pawBL);
      
      this.mesh.add(this.body);
      this.torso.add(this.head);
      this.body.add(this.torso);
      
      this.torso.castShadow = true;
      this.head.castShadow = true;
      this.pawFL.castShadow = true;
      this.pawFR.castShadow = true;
      this.pawBL.castShadow = true;
      this.pawBR.castShadow = true;
      
      this.body.rotation.y = Math.PI/2;
    }

    Monster.prototype.run = function(){
      var s = Math.min(speed,maxSpeed);
      this.runningCycle += delta * s * .7;
      this.runningCycle = this.runningCycle % (Math.PI*2);
      var t = this.runningCycle;
      
      this.pawFR.rotation.x = Math.sin(t)*Math.PI/4;
      this.pawFR.position.y = -5.5 - Math.sin(t);
      this.pawFR.position.z = 7.5 + Math.cos(t);
      
      this.pawFL.rotation.x = Math.sin(t+.4)*Math.PI/4;
      this.pawFL.position.y = -5.5 - Math.sin(t+.4);
      this.pawFL.position.z = 7.5 + Math.cos(t+.4);
      
      this.pawBL.rotation.x = Math.sin(t+2)*Math.PI/4;
      this.pawBL.position.y = -5.5 - Math.sin(t+3.8);
      this.pawBL.position.z = -7.5 + Math.cos(t+3.8);
      
      this.pawBR.rotation.x = Math.sin(t+2.4)*Math.PI/4;
      this.pawBR.position.y = -5.5 - Math.sin(t+3.4);
      this.pawBR.position.z = -7.5 + Math.cos(t+3.4);
      
      this.torso.rotation.x = Math.sin(t)*Math.PI/8;
      this.torso.position.y = 3-Math.sin(t+Math.PI/2)*3;
      
      //this.head.position.y = 5-Math.sin(t+Math.PI/2)*2;
      this.head.rotation.x = -.1+Math.sin(-t-1)*.4;
      this.mouth.rotation.x = .2 + Math.sin(t+Math.PI+.3)*.4;
      
      this.tail.rotation.x = .2 + Math.sin(t-Math.PI/2);
      
      this.eyeR.scale.y = .5 + Math.sin(t+Math.PI)*.5;
    }

    Hero.prototype.nod = function(){
      var _this = this;
      var sp = .5 + Math.random();
      
      // HEAD
      var tHeadRotY = -Math.PI/6 + Math.random()* Math.PI/3;
      TweenMax.to(this.head.rotation, sp, {y:tHeadRotY, ease:Power4.easeInOut, onComplete:function(){_this.nod()}});
      
      // EARS
      var tEarLRotX =  Math.PI/4 + Math.random()* Math.PI/6;
      var tEarRRotX =  Math.PI/4 + Math.random()* Math.PI/6;
      
      TweenMax.to(this.earL.rotation, sp, {x:tEarLRotX, ease:Power4.easeInOut});
      TweenMax.to(this.earR.rotation, sp, {x:tEarRRotX, ease:Power4.easeInOut});
      
      
      // PAWS BACK LEFT
      
      var tPawBLRot = Math.random()*Math.PI/2;
      var tPawBLY = -4 + Math.random()*8;
      
      TweenMax.to(this.pawBL.rotation, sp/2, {x:tPawBLRot, ease:Power1.easeInOut, yoyo:true, repeat:2});
      TweenMax.to(this.pawBL.position, sp/2, {y:tPawBLY, ease:Power1.easeInOut, yoyo:true, repeat:2});
      
      
      // PAWS BACK RIGHT
      
      var tPawBRRot = Math.random()*Math.PI/2;
      var tPawBRY = -4 + Math.random()*8;
      TweenMax.to(this.pawBR.rotation, sp/2, {x:tPawBRRot, ease:Power1.easeInOut, yoyo:true, repeat:2});
      TweenMax.to(this.pawBR.position, sp/2, {y:tPawBRY, ease:Power1.easeInOut, yoyo:true, repeat:2});
      
      // PAWS FRONT LEFT
      
      var tPawFLRot = Math.random()*Math.PI/2;
      var tPawFLY = -4 + Math.random()*8;
      
      TweenMax.to(this.pawFL.rotation, sp/2, {x:tPawFLRot, ease:Power1.easeInOut, yoyo:true, repeat:2});
      
      TweenMax.to(this.pawFL.position, sp/2, {y:tPawFLY, ease:Power1.easeInOut, yoyo:true, repeat:2});
      
      // PAWS FRONT RIGHT
      
      var tPawFRRot = Math.random()*Math.PI/2;
      var tPawFRY = -4 + Math.random()*8;
      
      TweenMax.to(this.pawFR.rotation, sp/2, {x:tPawFRRot, ease:Power1.easeInOut, yoyo:true, repeat:2});
      
      TweenMax.to(this.pawFR.position, sp/2, {y:tPawFRY, ease:Power1.easeInOut, yoyo:true, repeat:2});
      
      // MOUTH
      var tMouthRot = Math.random()*Math.PI/8;
      TweenMax.to(this.mouth.rotation, sp, {x:tMouthRot, ease:Power1.easeInOut});
      // IRIS
      var tIrisY = -1 + Math.random()*2;
      var tIrisZ = -1 + Math.random()*2;
      var iris1 = this.iris;
      var iris2 = this.eyeR.children[0];
      TweenMax.to([iris1.position, iris2.position], sp, {y:tIrisY, z:tIrisZ, ease:Power1.easeInOut});
      
      //EYES
      if (Math.random()>.2) TweenMax.to([this.eyeR.scale, this.eyeL.scale], sp/8, {y:0, ease:Power1.easeInOut, yoyo:true, repeat:1});
      
    }

    Hero.prototype.hang = function(){
      var _this = this;
      var sp = 1;
      var ease = Power4.easeOut;
      
      TweenMax.killTweensOf(this.eyeL.scale);
      TweenMax.killTweensOf(this.eyeR.scale);
      
      this.body.rotation.x = 0;
      this.torso.rotation.x = 0;
      this.body.position.y = 0;
      this.torso.position.y = 7;
      
      TweenMax.to(this.mesh.rotation, sp, {y:0, ease:ease});
      TweenMax.to(this.mesh.position, sp, {y:-7, z:6, ease:ease});
      TweenMax.to(this.head.rotation, sp, {x:Math.PI/6, ease:ease, onComplete:function(){_this.nod();}});
      
      TweenMax.to(this.earL.rotation, sp, {x:Math.PI/3, ease:ease});
      TweenMax.to(this.earR.rotation, sp, {x:Math.PI/3, ease:ease});
      
      TweenMax.to(this.pawFL.position, sp, {y:-1, z:3, ease:ease});
      TweenMax.to(this.pawFR.position, sp, {y:-1, z:3, ease:ease});
      TweenMax.to(this.pawBL.position, sp, {y:-2, z:-3, ease:ease});
      TweenMax.to(this.pawBR.position, sp, {y:-2, z:-3, ease:ease});
      
      TweenMax.to(this.eyeL.scale, sp, {y:1, ease:ease});
      TweenMax.to(this.eyeR.scale, sp, {y:1, ease:ease});
    }

    Monster.prototype.nod = function(){
      var _this = this;
      var sp = 1 + Math.random()*2;
      
      // HEAD
      var tHeadRotY = -Math.PI/3 + Math.random()*.5;
      var tHeadRotX = Math.PI/3 - .2 +  Math.random()*.4;
      TweenMax.to(this.head.rotation, sp, {x:tHeadRotX, y:tHeadRotY, ease:Power4.easeInOut, onComplete:function(){_this.nod()}});
      
      // TAIL
      
      var tTailRotY = -Math.PI/4;
      TweenMax.to(this.tail.rotation, sp/8, {y:tTailRotY, ease:Power1.easeInOut, yoyo:true, repeat:8});
      
      // EYES
      
      TweenMax.to([this.eyeR.scale, this.eyeL.scale], sp/20, {y:0, ease:Power1.easeInOut, yoyo:true, repeat:1});
    }

    Monster.prototype.sit = function(){
      var sp = 1.2;
      var ease = Power4.easeOut;
      var _this = this;
      TweenMax.to(this.torso.rotation, sp, {x:-1.3, ease:ease});
      TweenMax.to(this.torso.position, sp, {y:-5, ease:ease, onComplete:function(){
        _this.nod();
        gameStatus = "readyToReplay";
      }});
      
      TweenMax.to(this.head.rotation, sp, {x:Math.PI/3, y :-Math.PI/3, ease:ease});
      TweenMax.to(this.tail.rotation, sp, {x:2, y:Math.PI/4, ease:ease});
      TweenMax.to(this.pawBL.rotation, sp, {x:-.1, ease:ease});
      TweenMax.to(this.pawBR.rotation, sp, {x:-.1, ease:ease});
      TweenMax.to(this.pawFL.rotation, sp, {x:1, ease:ease});
      TweenMax.to(this.pawFR.rotation, sp, {x:1, ease:ease});
      TweenMax.to(this.mouth.rotation, sp, {x:.3, ease:ease});
      TweenMax.to(this.eyeL.scale, sp, {y:1, ease:ease});
      TweenMax.to(this.eyeR.scale, sp, {y:1, ease:ease});
      
      //TweenMax.to(this.body.rotation, sp, {y:Math.PI/4});
      
    }


    Carrot = function() {
      this.angle = 0;
      this.mesh = new THREE.Group();
      
      var bodyGeom = new THREE.CylinderGeometry(5,3, 10, 4,1);
      bodyGeom.vertices[8].y+=2;
      bodyGeom.vertices[9].y-=3;
      
      this.body = new THREE.Mesh(bodyGeom, pinkMat);
      
      var leafGeom = new THREE.CubeGeometry(5,10,1,1);
      leafGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,5,0));
      leafGeom.vertices[2].x-=1;
      leafGeom.vertices[3].x-=1;
      leafGeom.vertices[6].x+=1;
      leafGeom.vertices[7].x+=1;
      
      this.leaf1 = new THREE.Mesh(leafGeom,greenMat);
      this.leaf1.position.y = 7;
      this.leaf1.rotation.z = .3;
      this.leaf1.rotation.x = .2;
      
      this.leaf2 = this.leaf1.clone();
      this.leaf2.scale.set(1,1.3,1);
      this.leaf2.position.y = 7;
      this.leaf2.rotation.z = -.3;
      this.leaf2.rotation.x = -.2;
      
      this.mesh.add(this.body);
      this.mesh.add(this.leaf1);
      this.mesh.add(this.leaf2);

      this.body.traverse(function(object) {
        if (object instanceof THREE.Mesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });
    }

    Hedgehog = function() {
      this.angle = 0;
      this.status="ready";
      this.mesh = new THREE.Group();
      var bodyGeom = new THREE.CubeGeometry(6,6,6,1);
      this.body = new THREE.Mesh(bodyGeom, blackMat);
      
      var headGeom = new THREE.CubeGeometry(5,5,7,1);
      this.head= new THREE.Mesh(headGeom, lightBrownMat);
      this.head.position.z = 6;
      this.head.position.y = -.5;
      
      var noseGeom = new THREE.CubeGeometry(1.5,1.5,1.5,1);
      this.nose = new THREE.Mesh(noseGeom, blackMat);
      this.nose.position.z = 4;
      this.nose.position.y = 2;
      
      var eyeGeom = new THREE.CubeGeometry(1,3,3);
      
      this.eyeL = new THREE.Mesh(eyeGeom, whiteMat);
      this.eyeL.position.x = 2.2;
      this.eyeL.position.z = -.5;
      this.eyeL.position.y = .8;
      this.eyeL.castShadow = true;
      this.head.add(this.eyeL);
      
      var irisGeom = new THREE.CubeGeometry(.5,1,1);
      
      this.iris = new THREE.Mesh(irisGeom, blackMat);
      this.iris.position.x = .5;
      this.iris.position.y = .8;
      this.iris.position.z = .8;
      this.eyeL.add(this.iris);
      
      this.eyeR = this.eyeL.clone();
      this.eyeR.children[0].position.x = -this.iris.position.x;
      this.eyeR.position.x = -this.eyeL.position.x;
      
      var spikeGeom = new THREE.CubeGeometry(.5,2,.5,1);
      spikeGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,1,0));
      
      for (var i=0; i<9; i++){ 
        var row = (i%3);
        var col = Math.floor(i/3);
        var sb = new THREE.Mesh(spikeGeom, blackMat);
        sb.rotation.x =-Math.PI/2 + (Math.PI/12*row) -.5 +  Math.random();
        sb.position.z = -3;
        sb.position.y = -2 + row*2;
        sb.position.x = -2 + col*2; 
        this.body.add(sb); 
        var st = new THREE.Mesh(spikeGeom, blackMat);
        st.position.y = 3;
        st.position.x = -2 + row*2;
        st.position.z = -2 + col*2;
        st.rotation.z = Math.PI/6 - (Math.PI/6*row) -.5 +  Math.random();
        this.body.add(st);
        
        var sr = new THREE.Mesh(spikeGeom, blackMat);
        sr.position.x = 3;
        sr.position.y = -2 + row*2;
        sr.position.z = -2 + col*2;
        sr.rotation.z = -Math.PI/2 + (Math.PI/12*row) -.5 +  Math.random();
        this.body.add(sr);
        
        var sl = new THREE.Mesh(spikeGeom, blackMat);
        sl.position.x = -3;
        sl.position.y = -2 + row*2;
        sl.position.z = -2 + col*2;
        sl.rotation.z = Math.PI/2  - (Math.PI/12*row) -.5 +  Math.random();;
        this.body.add(sl); 
      }

      this.head.add(this.eyeR);
      var earGeom = new THREE.CubeGeometry(2, 2, .5, 1);
      this.earL = new THREE.Mesh(earGeom, lightBrownMat);
      this.earL.position.x = 2.5;
      this.earL.position.z = -2.5;
      this.earL.position.y = 2.5;
      this.earL.rotation.z = -Math.PI/12;
      this.earL.castShadow = true;
      this.head.add(this.earL);
      
      this.earR = this.earL.clone();
      this.earR.position.x = -this.earL.position.x;
      this.earR.rotation.z = -this.earL.rotation.z;
      this.earR.castShadow = true;
      this.head.add(this.earR);
      
      var mouthGeom = new THREE.CubeGeometry( 1, 1,.5, 1);
      this.mouth = new THREE.Mesh(mouthGeom, blackMat);
      this.mouth.position.z = 3.5;
      this.mouth.position.y = -1.5;
      this.head.add(this.mouth);
      
      
      this.mesh.add(this.body);
      this.body.add(this.head);
      this.head.add(this.nose);

      this.mesh.traverse(function(object) {
        if (object instanceof THREE.Mesh) {
          object.castShadow = true;
          object.receiveShadow = true;
        }
      });
    }

    Hedgehog.prototype.nod = function(){
      var _this = this;
      var speed = .1 + Math.random()*.5;
      var angle = -Math.PI/4 + Math.random()*Math.PI/2;
      TweenMax.to(this.head.rotation, speed, {y:angle, onComplete:function(){
        _this.nod();
      }});
    }


    function createHero() {
      hero = new Hero();
      hero.mesh.rotation.y = Math.PI/2;
      scene.add(hero.mesh);
      hero.nod();
    }

    function createMonster() {
      
      monster = new Monster();
      monster.mesh.position.z = 20;
      //monster.mesh.scale.set(1.2,1.2,1.2);
      scene.add(monster.mesh);
      updateMonsterPosition();
      
    }

    function updateMonsterPosition(){
      monster.run();
      monsterPosTarget -= delta*monsterAcceleration;
      monsterPos += (monsterPosTarget-monsterPos) *delta;
      if (monsterPos < .56){
        gameOver();
      }
      
      var angle = Math.PI*monsterPos;
      monster.mesh.position.y = - floorRadius + Math.sin(angle)*(floorRadius + 12);
      monster.mesh.position.x = Math.cos(angle)*(floorRadius+15);
      monster.mesh.rotation.z = -Math.PI/2 + angle;
    }

    function gameOver(){
      fieldGameOver.className = "show";
      gameStatus = "gameOver";
      monster.sit();
      hero.hang();
      monster.heroHolder.add(hero.mesh);
      TweenMax.to(this, 1, {speed:0});
      TweenMax.to(camera.position, 3, {z:cameraPosGameOver, y: 60, x:-30});
      carrot.mesh.visible = false;
      obstacle.mesh.visible = false;
      clearInterval(levelInterval);
    }

    function replay(){
      
      gameStatus = "preparingToReplay"
      
      fieldGameOver.className = "";
      
      TweenMax.killTweensOf(monster.pawFL.position);
      TweenMax.killTweensOf(monster.pawFR.position);
      TweenMax.killTweensOf(monster.pawBL.position);
      TweenMax.killTweensOf(monster.pawBR.position);
      
      TweenMax.killTweensOf(monster.pawFL.rotation);
      TweenMax.killTweensOf(monster.pawFR.rotation);
      TweenMax.killTweensOf(monster.pawBL.rotation);
      TweenMax.killTweensOf(monster.pawBR.rotation);
      
      TweenMax.killTweensOf(monster.tail.rotation);
      TweenMax.killTweensOf(monster.head.rotation);
      TweenMax.killTweensOf(monster.eyeL.scale);
      TweenMax.killTweensOf(monster.eyeR.scale);
      
      //TweenMax.killTweensOf(hero.head.rotation);
      
      monster.tail.rotation.y = 0;
        
      TweenMax.to(camera.position, 3, {z:cameraPosGame, x:0, y:30, ease:Power4.easeInOut});
      TweenMax.to(monster.torso.rotation,2, {x:0, ease:Power4.easeInOut});
      TweenMax.to(monster.torso.position,2, {y:0, ease:Power4.easeInOut});
      TweenMax.to(monster.pawFL.rotation,2, {x:0, ease:Power4.easeInOut});
      TweenMax.to(monster.pawFR.rotation,2, {x:0, ease:Power4.easeInOut});
      TweenMax.to(monster.mouth.rotation,2, {x:.5, ease:Power4.easeInOut});
      
      
      TweenMax.to(monster.head.rotation,2, {y:0, x:-.3, ease:Power4.easeInOut});
      
      TweenMax.to(hero.mesh.position, 2, { x:20, ease:Power4.easeInOut});
      TweenMax.to(hero.head.rotation, 2, { x:0, y:0, ease:Power4.easeInOut});
      TweenMax.to(monster.mouth.rotation, 2, {x:.2, ease:Power4.easeInOut});
      TweenMax.to(monster.mouth.rotation, 1, {x:.4, ease:Power4.easeIn, delay: 1, onComplete:function(){
        
        resetGame();
      }});
      
    }

    Tree = function(){
      this.mesh = new THREE.Object3D();
      this.trunc = new Trunc();
      this.mesh.add(this.trunc.mesh);
    }


    Trunc = function(){
      var truncHeight = 50 + Math.random()*150;
      var topRadius = 1+Math.random()*5;
      var bottomRadius = 5+Math.random()*5;
      var mats = [blackMat, brownMat, pinkMat, whiteMat, greenMat, lightBrownMat, pinkMat];
      var matTrunc = blackMat;//mats[Math.floor(Math.random()*mats.length)];
      var nhSegments = 3;//Math.ceil(2 + Math.random()*6);
      var nvSegments = 3;//Math.ceil(2 + Math.random()*6);
      var geom = new THREE.CylinderGeometry(topRadius,bottomRadius,truncHeight, nhSegments, nvSegments);
      geom.applyMatrix(new THREE.Matrix4().makeTranslation(0,truncHeight/2,0));
      
      this.mesh = new THREE.Mesh(geom, matTrunc);
      
      for (var i=0; i<geom.vertices.length; i++){
        var noise = Math.random() ;
        var v = geom.vertices[i];
        v.x += -noise + Math.random()*noise*2;
        v.y += -noise + Math.random()*noise*2;
        v.z += -noise + Math.random()*noise*2;
        
        geom.computeVertexNormals();
        
        // FRUITS
        
        if (Math.random()>.7){
          var size = Math.random()*3;
          var fruitGeometry = new THREE.CubeGeometry(size,size,size,1);
          var matFruit = mats[Math.floor(Math.random()*mats.length)];
          var fruit = new THREE.Mesh(fruitGeometry, matFruit);
          fruit.position.x = v.x;
          fruit.position.y = v.y+3;
          fruit.position.z = v.z;
          fruit.rotation.x = Math.random()*Math.PI;
          fruit.rotation.y = Math.random()*Math.PI;
          
          this.mesh.add(fruit);
        }
        
        // BRANCHES
        
        if (Math.random()>.5 && v.y > 10 && v.y < truncHeight - 10){
          var h = 3 + Math.random()*5;
          var thickness = .2 + Math.random();
          
          var branchGeometry = new THREE.CylinderGeometry(thickness/2, thickness, h, 3, 1);
          branchGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0,h/2,0));
          var branch = new THREE.Mesh(branchGeometry, matTrunc);
          branch.position.x = v.x;
          branch.position.y = v.y;
          branch.position.z = v.z;
          
          var vec = new THREE.Vector3(v.x, 2, v.z);
          var axis = new THREE.Vector3(0,1,0);
          branch.quaternion.setFromUnitVectors(axis, vec.clone().normalize());
          
          
          this.mesh.add(branch);
        }
        
      }
      
      
      this.mesh.castShadow = true;
    }

    var firs = new THREE.Group();

    function createFirs(){
      
      var nTrees = 100;
       for(var i=0; i< nTrees; i++){
        var phi = i*(Math.PI*2)/nTrees;
        var theta = Math.PI/2;
        //theta += .25 + Math.random()*.3; 
        theta += (Math.random()>.05)? .25 + Math.random()*.3 : - .35 -  Math.random()*.1;
       
        var fir = new Tree();
        fir.mesh.position.x = Math.sin(theta)*Math.cos(phi)*floorRadius;
        fir.mesh.position.y = Math.sin(theta)*Math.sin(phi)*(floorRadius-10);
        fir.mesh.position.z = Math.cos(theta)*floorRadius; 
         
        var vec = fir.mesh.position.clone();
        var axis = new THREE.Vector3(0,1,0);
        fir.mesh.quaternion.setFromUnitVectors(axis, vec.clone().normalize());
        floor.add(fir.mesh); 
      }
    }

    function createCarrot(){
      carrot = new Carrot();
      scene.add(carrot.mesh);
    }

    function updateCarrotPosition(){
      carrot.mesh.rotation.y += delta * 6;
      carrot.mesh.rotation.z = Math.PI/2 - (floorRotation+carrot.angle);
      carrot.mesh.position.y = -floorRadius + Math.sin(floorRotation+carrot.angle) * (floorRadius+50);
      carrot.mesh.position.x = Math.cos(floorRotation+carrot.angle) * (floorRadius+50);
      
    }

    function updateObstaclePosition(){
      if (obstacle.status=="flying")return;
      
      // TODO fix this,
      if (floorRotation+obstacle.angle > 2.5 ){
        obstacle.angle = -floorRotation + Math.random()*.3;
        obstacle.body.rotation.y = Math.random() * Math.PI*2;
      }
      
      obstacle.mesh.rotation.z = floorRotation + obstacle.angle - Math.PI/2;
      obstacle.mesh.position.y = -floorRadius + Math.sin(floorRotation+obstacle.angle) * (floorRadius+3);
      obstacle.mesh.position.x = Math.cos(floorRotation+obstacle.angle) * (floorRadius+3);
      
    }

    function updateFloorRotation(){
      floorRotation += delta*.03 * speed;
      floorRotation = floorRotation%(Math.PI*2);
      floor.rotation.z = floorRotation;
    }

    function createObstacle(){
      obstacle = new Hedgehog();
      obstacle.body.rotation.y = -Math.PI/2;
      obstacle.mesh.scale.set(1.1,1.1,1.1);
      obstacle.mesh.position.y = floorRadius+4;
      obstacle.nod();
      scene.add(obstacle.mesh);
    }

    function createBonusParticles(){
      bonusParticles = new BonusParticles();
      bonusParticles.mesh.visible = false;
      scene.add(bonusParticles.mesh);
      
    }



    function checkCollision(){
      var db = hero.mesh.position.clone().sub(carrot.mesh.position.clone());
      var dm = hero.mesh.position.clone().sub(obstacle.mesh.position.clone());
      
      if(db.length() < collisionBonus){
        getBonus();
      }
      
      if(dm.length() < collisionObstacle && obstacle.status != "flying"){
        getMalus();
      }
    }

    function getBonus(){
      bonusParticles.mesh.position.copy(carrot.mesh.position);
      bonusParticles.mesh.visible = true;
      bonusParticles.explose();
      carrot.angle += Math.PI/2;
      //speed*=.95;
      monsterPosTarget += .025;
      
    }

    function getMalus(){
      obstacle.status="flying";
      var tx = (Math.random()>.5)? -20-Math.random()*10 : 20+Math.random()*5;
      TweenMax.to(obstacle.mesh.position, 4, {x:tx, y:Math.random()*50, z:350, ease:Power4.easeOut});
      TweenMax.to(obstacle.mesh.rotation, 4, {x:Math.PI*3, z:Math.PI*3, y:Math.PI*6, ease:Power4.easeOut, onComplete:function(){
        obstacle.status = "ready";
        obstacle.body.rotation.y = Math.random() * Math.PI*2;
        obstacle.angle = -floorRotation - Math.random()*.4;
        
        obstacle.angle = obstacle.angle%(Math.PI*2);
        obstacle.mesh.rotation.x = 0;
        obstacle.mesh.rotation.y = 0;
        obstacle.mesh.rotation.z = 0;
        obstacle.mesh.position.z = 0;
        
      }});
      //
      monsterPosTarget -= .04;
      TweenMax.from(window, .5, {malusClearAlpha:.5, onUpdate:function(){
        renderer.setClearColor(malusClearColor, malusClearAlpha );
      }})
    }

    function updateDistance(){
      distance += delta*speed;
      var d = distance/2;
      fieldDistance.innerHTML = Math.floor(d);
    }

    function updateLevel(){
      if (speed >= maxSpeed) return;
      level++;
      speed += 2; 
    }

    function loop(){
      if(!isPlaying) { requestAnimationFrame(loop); return; } // Pause loop to save battery
      delta = clock.getDelta();
      updateFloorRotation();
      
      if (gameStatus == "play"){
        
        if (hero.status == "running"){
          hero.run();
        }
        updateDistance();
        updateMonsterPosition();
        updateCarrotPosition();
        updateObstaclePosition();
        checkCollision();
      }
      
      render();  
      requestAnimationFrame(loop);
    }

    function render(){
      renderer.render(scene, camera);
    }

    function init(event){
      initScreenAnd3D();
      createLights();
      createFloor()
      createHero();
      createMonster();
      createFirs();
      createCarrot();
      createBonusParticles();
      createObstacle();
      initUI();
      resetGame();
      loop();
      
      //setInterval(hero.blink.bind(hero), 3000);
    }

    function resetGame(){
      scene.add(hero.mesh);
      hero.mesh.rotation.y = Math.PI/2;
      hero.mesh.position.y = 0;
      hero.mesh.position.z = 0;
      hero.mesh.position.x = 0;

      monsterPos = .56;
      monsterPosTarget = .65;
      speed = initSpeed;
      level = 0;
      distance = 0;
      carrot.mesh.visible = true;
      obstacle.mesh.visible = true;
      gameStatus = "play";
      hero.status = "running";
      hero.nod();
      updateLevel();
      levelInterval = setInterval(updateLevel, levelUpdateFreq);
    }

    function initUI(){
      fieldDistance = document.getElementById("distValue");
      fieldGameOver = document.getElementById("gameoverInstructions");
      
    }

    // Load instantly (bypassing window.onload bug in Android)
    setTimeout(init, 100);

  <\/script>
</body>
</html>`;

export const FISH_3D_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <style>
    body, html { 
      margin: 0; padding: 0; width: 100%; height: 100%; 
      overflow: hidden; touch-action: none; 
      background: linear-gradient(#8ee4ae, #e9eba3); 
    }
    #world { position: absolute; width: 100%; height: 100%; overflow: hidden; z-index: 1; }
    canvas { position: absolute; top: 0; left: 0; width: 100vw !important; height: 100vh !important; z-index: 99 !important; display: block; }
  </style>
  <script src="./three.min.js"><\/script>
</head>
<body>
  <div id="world"></div>

  <script>
    var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, shadowLight, light, renderer, container;
    var HEIGHT, WIDTH, windowHalfX, windowHalfY, xLimit, yLimit;
    
    // FISH BODY PARTS
    var fish, bodyFish, tailFish, topFish, sideRightFish, sideLeftFish, rightIris, leftIris, rightEye, leftEye, lipsFish, tooth1, tooth2, tooth3, tooth4, tooth5;

    // FISH SPEED & COLORS
    var fishFastColor = {r:255, g:0, b:224}; 
    var fishSlowColor = {r:0, g:207, b:255}; 
    var angleFin = 0; 
    var colors = ['#dff69e', '#00ceff', '#002bca', '#ff00e0', '#3f159f', '#71b583', '#00a2ff'];

    // PARTICLES
    var flyingParticles = []; 
    var waitingParticles = [];
    var maxParticlesZ = 600; 

    // PHYSICS & MISC
    var speed = {x:0, y:0};
    var smoothing = 10;
    var mousePos = {x:0, y:0};
    var halfPI = Math.PI/2;
    var isPlaying = true;
    var particleInterval;

    function init(){
      scene = new THREE.Scene();
      HEIGHT = window.innerHeight || window.screen.height;
      WIDTH = window.innerWidth || window.screen.width;
      aspectRatio = WIDTH / HEIGHT;
      
      // MOBILE ZOOM TRICK
      fieldOfView = (WIDTH < 600) ? 100 : 60; 
      
      nearPlane = 1; 
      farPlane = 2000; 
      camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
      camera.position.z = 1000;  
      
      renderer = new THREE.WebGLRenderer({alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(WIDTH, HEIGHT);
      container = document.getElementById('world');
      container.appendChild(renderer.domElement);
       
      var ang = (fieldOfView/2)* Math.PI / 180; 
      yLimit = (camera.position.z + maxParticlesZ) * Math.tan(ang); 
      xLimit = yLimit * camera.aspect;
       
      windowHalfX = WIDTH / 2;
      windowHalfY = HEIGHT / 2;
      
      window.addEventListener('resize', onWindowResize, false);
      document.addEventListener('mousemove', handleMouseMove, false);
      document.addEventListener('touchstart', handleTouchStart, {passive: false});
      document.addEventListener('touchend', handleTouchEnd, false);
      document.addEventListener('touchmove', handleTouchMove, {passive: false});

      // Battery Optimization
      window.addEventListener("pauseWallpaper", () => {
        isPlaying = false;
        clearInterval(particleInterval);
      });
      window.addEventListener("playWallpaper", () => { 
        if(!isPlaying){ 
          isPlaying = true; 
          particleInterval = setInterval(flyParticle, 70);
          loop(); 
        }
      });
    }

    function onWindowResize() {
      HEIGHT = window.innerHeight; WIDTH = window.innerWidth;
      windowHalfX = WIDTH / 2; windowHalfY = HEIGHT / 2;
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix(); 
      var ang = (fieldOfView/2)* Math.PI / 180; 
      yLimit = (camera.position.z + maxParticlesZ) * Math.tan(ang); // Fixed author typo here
      xLimit = yLimit * camera.aspect;
    }

    function handleMouseMove(event) {
      mousePos = {x:event.clientX, y:event.clientY};
      updateSpeed();
    }

    function handleTouchStart(event) {
      if (event.touches.length > 0) {
        mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY};
        updateSpeed();
      }
    }

    function handleTouchEnd(event) {
        mousePos = {x:windowHalfX, y:windowHalfY}; // Reset to center when released
        updateSpeed();
    }

    function handleTouchMove(event) {
      if (event.touches.length > 0) {
        mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY};
        updateSpeed();
      }
    }

    function updateSpeed(){
      speed.x = (mousePos.x / WIDTH)*100;
      speed.y = (mousePos.y-windowHalfY) / 10;
    }

    function loop() {
      if(!isPlaying) { requestAnimationFrame(loop); return; }

      fish.rotation.z += ((-speed.y/50)-fish.rotation.z)/smoothing;
      fish.rotation.x += ((-speed.y/50)-fish.rotation.x)/smoothing;
      fish.rotation.y += ((-speed.y/50)-fish.rotation.y)/smoothing;
      
      fish.position.x += (((mousePos.x - windowHalfX)) - fish.position.x) / smoothing;
      fish.position.y += ((-speed.y*10)-fish.position.y)/smoothing;
      
      rightEye.rotation.z = leftEye.rotation.z = -speed.y/150;
      rightIris.position.x = leftIris.position.y = -10 - speed.y/2;
      
      rightEye.scale.set(1,1-(speed.x/150),1);
      leftEye.scale.set(1,1-(speed.x/150),1);
      
      var s2 = speed.x/100; 
      var s3 = speed.x/300; 
      
      angleFin += s2;
      var backTailCycle = Math.cos(angleFin); 
      var sideFinsCycle = Math.sin(angleFin/5);
      
      tailFish.rotation.y = backTailCycle*.5;
      topFish.rotation.x = sideFinsCycle*.5;
      sideRightFish.rotation.x = halfPI + sideFinsCycle*.2;
      sideLeftFish.rotation.x = halfPI + sideFinsCycle*.2;
      
      var rvalue = (fishSlowColor.r + (fishFastColor.r - fishSlowColor.r)*s2)/255;
      var gvalue = (fishSlowColor.g + (fishFastColor.g - fishSlowColor.g)*s2)/255;
      var bvalue = (fishSlowColor.b + (fishFastColor.b - fishSlowColor.b)*s2)/255;
      bodyFish.material.color.setRGB(rvalue,gvalue,bvalue);
      lipsFish.material.color.setRGB(rvalue,gvalue,bvalue);
      
      fish.scale.set(1+s3,1-s3,1-s3);
      
      for (var i=0; i<flyingParticles.length; i++){
        var particle = flyingParticles[i];
        particle.rotation.y += (1/particle.scale.x) *.05;
        particle.rotation.x += (1/particle.scale.x) *.05;
        particle.rotation.z += (1/particle.scale.x) *.05;
        particle.position.x += -10 -(1/particle.scale.x) * speed.x *.2;
        particle.position.y += (1/particle.scale.x) * speed.y *.2;
        if (particle.position.x < -xLimit - 80){ 
          scene.remove(particle);
          waitingParticles.push(flyingParticles.splice(i,1)[0]); 
          i--;
        }
      }
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    }

    function createLight() {
      light = new THREE.HemisphereLight(0xffffff, 0xffffff, .3)
      scene.add(light);
      shadowLight = new THREE.DirectionalLight(0xffffff, .8);
      shadowLight.position.set(1, 1, 1);
      scene.add(shadowLight);
    }

    function createFish(){
      fish = new THREE.Group();
      
      var bodyGeom = new THREE.BoxGeometry(120, 120, 120);
      var bodyMat = new THREE.MeshLambertMaterial({ color: 0x80f5fe , shading: THREE.FlatShading });
      bodyFish = new THREE.Mesh(bodyGeom, bodyMat);
      
      var tailGeom = new THREE.CylinderGeometry(0, 60, 60, 4, false);
      var tailMat = new THREE.MeshLambertMaterial({ color: 0xff00dc, shading: THREE.FlatShading });
      
      tailFish = new THREE.Mesh(tailGeom, tailMat);
      tailFish.scale.set(.8,1,.1);
      tailFish.position.x = -60; 
      tailFish.rotation.z = -halfPI;
      
      var lipsGeom = new THREE.BoxGeometry(25, 10, 120);
      var lipsMat = new THREE.MeshLambertMaterial({ color: 0x80f5fe , shading: THREE.FlatShading });
      lipsFish = new THREE.Mesh(lipsGeom, lipsMat);
      lipsFish.position.x = 65;
      lipsFish.position.y = -47;
      lipsFish.rotation.z = halfPI;
      
      topFish = new THREE.Mesh(tailGeom, tailMat);
      topFish.scale.set(.8,1,.1);
      topFish.position.x = -20; 
      topFish.position.y = 60; 
      topFish.rotation.z = -halfPI;
      
      sideRightFish = new THREE.Mesh(tailGeom, tailMat);
      sideRightFish.scale.set(.8,1,.1);
      sideRightFish.rotation.x = halfPI;
      sideRightFish.rotation.z = -halfPI;
      sideRightFish.position.x = 0; 
      sideRightFish.position.y = -50; 
      sideRightFish.position.z = -60; 
      
      sideLeftFish = new THREE.Mesh(tailGeom, tailMat);
      sideLeftFish.scale.set(.8,1,.1);
      sideLeftFish.rotation.x = halfPI;
      sideLeftFish.rotation.z = -halfPI;
      sideLeftFish.position.x = 0; 
      sideLeftFish.position.y = -50; 
      sideLeftFish.position.z = 60; 
      
      var eyeGeom = new THREE.BoxGeometry(40, 40,5);
      var eyeMat = new THREE.MeshLambertMaterial({ color: 0xffffff, shading: THREE.FlatShading });
      
      rightEye = new THREE.Mesh(eyeGeom,eyeMat );
      rightEye.position.z = -60;
      rightEye.position.x = 25;
      rightEye.position.y = -10;
      
      var irisGeom = new THREE.BoxGeometry(10, 10,3);
      var irisMat = new THREE.MeshLambertMaterial({ color: 0x330000, shading: THREE.FlatShading });
      
      rightIris = new THREE.Mesh(irisGeom,irisMat );
      rightIris.position.z = -65;
      rightIris.position.x = 35;
      rightIris.position.y = -10;
      
      leftEye = new THREE.Mesh(eyeGeom,eyeMat );
      leftEye.position.z = 60;
      leftEye.position.x = 25;
      leftEye.position.y = -10;
      
      leftIris = new THREE.Mesh(irisGeom,irisMat );
      leftIris.position.z = 65;
      leftIris.position.x = 35;
      leftIris.position.y = -10;
        
      var toothGeom = new THREE.BoxGeometry(20, 4, 20);
      var toothMat = new THREE.MeshLambertMaterial({ color: 0xffffff, shading: THREE.FlatShading });
      
      tooth1 = new THREE.Mesh(toothGeom,toothMat);
      tooth1.position.set(65, -35, -50);
      tooth1.rotation.set(-halfPI, 0, halfPI);
      
      tooth2 = new THREE.Mesh(toothGeom,toothMat);
      tooth2.position.set(65, -30, -25);
      tooth2.rotation.set(-Math.PI/12, 0, halfPI);
      
      tooth3 = new THREE.Mesh(toothGeom,toothMat);
      tooth3.position.set(65, -25, 0);
      tooth3.rotation.set(0, 0, halfPI);
      
      tooth4 = new THREE.Mesh(toothGeom,toothMat);
      tooth4.position.set(65, -30, 25);
      tooth4.rotation.set(Math.PI/12, 0, halfPI);
      
      tooth5 = new THREE.Mesh(toothGeom,toothMat);
      tooth5.position.set(65, -35, 50);
      tooth5.rotation.set(Math.PI/8, 0, halfPI);
      
      fish.add(bodyFish);
      fish.add(tailFish);
      fish.add(topFish);
      fish.add(sideRightFish);
      fish.add(sideLeftFish);
      fish.add(rightEye);
      fish.add(rightIris);
      fish.add(leftEye);
      fish.add(leftIris);
      fish.add(tooth1);
      fish.add(tooth2);
      fish.add(tooth3);
      fish.add(tooth4);
      fish.add(tooth5);
      fish.add(lipsFish);
      
      fish.rotation.y = -Math.PI/4;
      scene.add(fish);
    }

    function createParticle(){
      var particle, geometryCore, ray, w,h,d, sh, sv;
      var rnd = Math.random();
      
      if (rnd<.33){
        w = 10 + Math.random()*30; h = 10 + Math.random()*30; d = 10 + Math.random()*30;
        geometryCore = new THREE.BoxGeometry(w,h,d);
      }
      else if (rnd<.66){
        ray = 10 + Math.random()*20;
        geometryCore = new THREE.TetrahedronGeometry(ray);
      }
      else{
        ray = 5+Math.random()*30; sh = 2 + Math.floor(Math.random()*2); sv = 2 + Math.floor(Math.random()*2);
        geometryCore = new THREE.SphereGeometry(ray, sh, sv);
      }
      
      var materialCore = new THREE.MeshLambertMaterial({ color: getRandomColor(), shading: THREE.FlatShading });
      particle = new THREE.Mesh(geometryCore, materialCore);
      return particle;
    }

    function getParticle(){
      if (waitingParticles.length) { return waitingParticles.pop(); }
      else { return createParticle(); }
    }

    function flyParticle(){
      var particle = getParticle();
      particle.position.x = xLimit;
      particle.position.y = -yLimit + Math.random()*yLimit*2;
      particle.position.z = Math.random()*maxParticlesZ;
      var s = .1 + Math.random();
      particle.scale.set(s,s,s);
      flyingParticles.push(particle);
      scene.add(particle);
    }

    function getRandomColor(){
      var col = hexToRgb(colors[Math.floor(Math.random()*colors.length)]);
      var threecol = new THREE.Color("rgb("+col.r+","+col.g+","+col.b+")");
      return threecol;
    }
      
    function hexToRgb(hex) {
      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }

    // Load instantly (bypassing window.onload bug in Android)
    setTimeout(() => {
        init();
        createLight();
        createFish();
        createParticle();
        loop();
        particleInterval = setInterval(flyParticle, 70); 
    }, 100);

  <\/script>
</body>
</html>`;

export const DRAGON_3D_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <style>
    body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #652e37; touch-action: none; }
    #world { position: absolute; width: 100%; height: 100%; overflow: hidden; z-index: 1; }
    canvas { position: absolute; top: 0; left: 0; width: 100vw !important; height: 100vh !important; z-index: 99 !important; display: block; }
    
    #instructions {
      position: absolute; width: 100%; top: 50%; margin-top: 150px; font-family: system-ui, sans-serif;
      color: #fdde8c; font-size: 1.1em; text-transform: uppercase; text-align: center;
      line-height: 1.5; user-select: none; z-index: 100; pointer-events: none;
    }
    .lightInstructions { color: #f89a78; font-size: 0.8em; font-weight: bold; }

    #power {
      position: absolute; width: 100%; top: 50%; margin-top: -220px; font-family: system-ui, sans-serif;
      color: #481f26; font-size: 4em; font-weight: 800; text-transform: uppercase; text-align: center;
      line-height: 1.5; user-select: none; z-index: 100; pointer-events: none;
    }
  </style>
  <script src="./three.min.js"><\/script>
  <script src="./TweenMax.min.js"><\/script>
</head>
<body>
  <div id="world"></div>
  <div id="instructions">Hold to build a sneeze<br/><span class="lightInstructions">- Swipe to rotate -</span></div>
  <div id="power">00</div>

  <script>
    // --- MAIN ENGINE ---
    var scene, camera, renderer, container, clock;
    var env, floor, dragon, sneezingRate = 0, fireRate = 0, maxSneezingRate = 8, sneezeDelay = 500, awaitingSmokeParticles = [], timeSmoke = 0, timeFire = 0, globalSpeedRate = 1, sneezeTimeout, powerField;
    var HEIGHT, WIDTH, isPlaying = true;
    
    // --- NATIVE TOUCH SWIPE ENGINE ---
    var isDragging = false, prevMouseX = 0, targetRotation = Math.PI/6;

    function init() {
      powerField = document.getElementById('power');
      scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0x652e37, 350, 500);

      HEIGHT = window.innerHeight || window.screen.height;
      WIDTH = window.innerWidth || window.screen.width;
      
      // MOBILE ZOOM TRICK: Wide FOV and pulled back camera
      var fieldOfView = (WIDTH < 600) ? 80 : 60;
      var camZ = (WIDTH < 600) ? 400 : 300;
      
      camera = new THREE.PerspectiveCamera(fieldOfView, WIDTH/HEIGHT, 1, 2000);
      camera.position.set(-250, 100, camZ);
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(WIDTH, HEIGHT);
      renderer.shadowMap.enabled = true;
      
      container = document.getElementById('world');
      container.appendChild(renderer.domElement);

      window.addEventListener('resize', onWindowResize, false);
      
      // TOUCH & MOUSE SWIPE LISTENERS
      document.addEventListener('mousedown', (e) => { isDragging = true; prevMouseX = e.clientX; });
      document.addEventListener('mousemove', (e) => { if(isDragging) { targetRotation += (e.clientX - prevMouseX) * 0.01; prevMouseX = e.clientX; }});
      document.addEventListener('mouseup', handleInteractionEnd, false);
      
      document.addEventListener('touchstart', (e) => { if(e.touches.length > 0) { isDragging = true; prevMouseX = e.touches[0].pageX; }}, {passive: true});
      document.addEventListener('touchmove', (e) => { if(isDragging && e.touches.length > 0) { targetRotation += (e.touches[0].pageX - prevMouseX) * 0.01; prevMouseX = e.touches[0].pageX; }}, {passive: true});
      document.addEventListener('touchend', handleInteractionEnd, false);

      // BATTERY OPTIMIZATION
      window.addEventListener("pauseWallpaper", () => isPlaying = false);
      window.addEventListener("playWallpaper", () => { if(!isPlaying){ isPlaying = true; clock.getDelta(); loop(); }});

      clock = new THREE.Clock();
    }

    function onWindowResize() {
      HEIGHT = window.innerHeight; WIDTH = window.innerWidth;
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
    }

    function handleInteractionEnd() {
      isDragging = false;
      if (sneezeTimeout) clearTimeout(sneezeTimeout);
      sneezingRate += (maxSneezingRate - sneezingRate) / 10;
      powerField.innerHTML = parseInt(sneezingRate*100/maxSneezingRate);
      dragon.prepareToSneeze(sneezingRate);
      sneezeTimeout = setTimeout(sneeze, sneezeDelay*globalSpeedRate);
      dragon.isSneezing = true;
    }

    function sneeze() {
      dragon.sneeze(sneezingRate);
      sneezingRate = 0;
      powerField.innerHTML = "00";
    }

    function createLights() {
      var light = new THREE.HemisphereLight(0xffffff, 0xb3858c, .8);
      var shadowLight = new THREE.DirectionalLight(0xffffff, .8);
      shadowLight.position.set(-100, 100, 50);
      shadowLight.castShadow = true;
      var backLight = new THREE.DirectionalLight(0xffffff, .4);
      backLight.position.set(200, 100, 100);
      backLight.castShadow = true;
      scene.add(backLight);
      scene.add(light);
      scene.add(shadowLight);
    }

    function makeCube(mat, w, h, d, posX, posY, posZ, rotX, rotY, rotZ) {
      var geom = new THREE.BoxGeometry(w, h, d);
      var mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(posX, posY, posZ);
      mesh.rotation.set(rotX, rotY, rotZ);
      return mesh;
    }

    function createFloor() {
      env = new THREE.Group();
      floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), new THREE.MeshBasicMaterial({ color: 0X652e37 }));
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -36;
      floor.receiveShadow = true;
      env.add(floor);
      scene.add(env);
    }

    Dragon = function() {
      this.tailAmplitude = 3; this.tailAngle = 0; this.tailSpeed = .07;
      this.wingAmplitude = Math.PI / 8; this.wingAngle = 0; this.wingSpeed = 0.1;
      this.isSneezing = false;
      this.threegroup = new THREE.Group(); 

      var greenMat = new THREE.MeshLambertMaterial({ color: 0x5da683, shading: THREE.FlatShading });
      var lightGreenMat = new THREE.MeshLambertMaterial({ color: 0x95c088, shading: THREE.FlatShading });
      var yellowMat = new THREE.MeshLambertMaterial({ color: 0xfdde8c, shading: THREE.FlatShading });
      var redMat = new THREE.MeshLambertMaterial({ color: 0xcb3e4c, shading: THREE.FlatShading });
      var whiteMat = new THREE.MeshLambertMaterial({ color: 0xfaf3d7, shading: THREE.FlatShading });
      var brownMat = new THREE.MeshLambertMaterial({ color: 0x874a5c, shading: THREE.FlatShading });
      var blackMat = new THREE.MeshLambertMaterial({ color: 0x403133, shading: THREE.FlatShading });

      this.body = new THREE.Group();
      this.belly = makeCube(greenMat, 30, 30, 40, 0, 0, 0, 0, 0, Math.PI / 4);

      this.wingL = makeCube(yellowMat, 5, 30, 20, 15, 15, 0, -Math.PI / 4, 0, -Math.PI / 4);
      this.wingL.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 15, 10));
      this.wingR = this.wingL.clone();
      this.wingR.position.x = -this.wingL.position.x;
      this.wingR.rotation.z = -this.wingL.rotation.z;

      var pikeBodyGeom = new THREE.CylinderGeometry(0, 10, 10, 4, 1);
      this.pikeBody1 = new THREE.Mesh(pikeBodyGeom, greenMat);
      this.pikeBody1.scale.set(.2, 1, 1);
      this.pikeBody1.position.set(0, 26, 10);
      this.pikeBody2 = this.pikeBody1.clone(); this.pikeBody2.position.z = 0;
      this.pikeBody3 = this.pikeBody1.clone(); this.pikeBody3.position.z = -10;

      this.tail = new THREE.Group();
      this.tail.position.set(0, 10, -20);
      var tailMat = new THREE.LineBasicMaterial({ color: 0x5da683, linewidth: 5 });
      var tailGeom = new THREE.Geometry();
      tailGeom.vertices.push( new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 5, -10), new THREE.Vector3(0, -5, -20), new THREE.Vector3(0, 0, -30) );
      this.tailLine = new THREE.Line(tailGeom, tailMat);

      var pikeGeom = new THREE.CylinderGeometry(0, 10, 10, 4, 1);
      pikeGeom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI / 2));
      this.tailPike = new THREE.Mesh(pikeGeom, yellowMat);
      this.tailPike.scale.set(.2, 1, 1);
      this.tailPike.position.set(0, 0, -35);

      this.tail.add(this.tailLine); this.tail.add(this.tailPike);

      this.body.add(this.belly); this.body.add(this.wingL); this.body.add(this.wingR);
      this.body.add(this.tail); this.body.add(this.pikeBody1); this.body.add(this.pikeBody2); this.body.add(this.pikeBody3);

      this.head = new THREE.Group();
      this.face = makeCube(greenMat, 60, 50, 80, 0, 25, 40, 0, 0, 0);
      
      var hornGeom = new THREE.CylinderGeometry(0, 6, 10, 4, 1);
      this.hornL = new THREE.Mesh(hornGeom, yellowMat);
      this.hornL.position.set(10, 55, 10);
      this.hornR = this.hornL.clone(); this.hornR.position.x = -10;

      this.earL = makeCube(greenMat, 5, 10, 20, 32, 42, 2, 0, 0, 0);
      this.earL.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 5, -10));
      this.earL.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 4));
      this.earL.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(-Math.PI / 4));
      this.earR = makeCube(greenMat, 5, 10, 20, -32, 42, 2, 0, 0, 0);
      this.earR.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 5, -10));
      this.earR.geometry.applyMatrix(new THREE.Matrix4().makeRotationX(Math.PI / 4));
      this.earR.geometry.applyMatrix(new THREE.Matrix4().makeRotationY(Math.PI / 4));

      this.mouth = new THREE.Group();
      this.mouth.position.set(0, 3, 50);
      this.jaw = makeCube(greenMat, 30, 10, 30, 0, -5, 15, 0, 0, 0);
      this.tongue = makeCube(redMat, 20, 10, 20, 0, -3, 15, 0, 0, 0);
      this.mouth.add(this.jaw); this.mouth.add(this.tongue);
      
      var smileGeom = new THREE.TorusGeometry( 6, 2, 2, 10, Math.PI );
      this.smile = new THREE.Mesh(smileGeom, blackMat);
      this.smile.position.set(0, 5, 82);
      this.smile.rotation.z = -Math.PI;
      
      this.cheekL = makeCube(lightGreenMat, 4, 20, 20, 30, 18, 55, 0, 0, 0);
      this.cheekR = this.cheekL.clone(); this.cheekR.position.x = -this.cheekL.position.x;
      
      this.eyeL = makeCube(whiteMat, 10, 22, 22, 27, 34, 18, 0, 0, 0);
      this.eyeR = this.eyeL.clone(); this.eyeR.position.x = -27;
      this.irisL = makeCube(brownMat, 10, 12, 12, 28, 30, 24, 0, 0, 0);
      this.irisR = this.irisL.clone(); this.irisR.position.x = -this.irisL.position.x;
      this.noseL = makeCube(blackMat, 5, 5, 8, 5, 40, 77, 0, 0, 0);
      this.noseR = this.noseL.clone(); this.noseR.position.x = -this.noseL.position.x;

      this.head.position.z = 30;
      this.head.add(this.face); this.head.add(this.hornL); this.head.add(this.hornR);
      this.head.add(this.earL); this.head.add(this.earR); this.head.add(this.mouth);
      this.head.add(this.eyeL); this.head.add(this.eyeR); this.head.add(this.irisL);
      this.head.add(this.irisR); this.head.add(this.noseL); this.head.add(this.noseR);
      this.head.add(this.cheekL); this.head.add(this.cheekR); this.head.add(this.smile);
      
      this.legFL = makeCube(greenMat, 20, 10, 20, 20, -30, 15, 0, 0, 0);
      this.legFR = this.legFL.clone(); this.legFR.position.x = -30;
      this.legBL = this.legFL.clone(); this.legBL.position.z = -15;
      this.legBR = this.legBL.clone(); this.legBR.position.x = -30;

      this.threegroup.add(this.body); this.threegroup.add(this.head);
      this.threegroup.add(this.legFL); this.threegroup.add(this.legFR);
      this.threegroup.add(this.legBL); this.threegroup.add(this.legBR);

      this.threegroup.traverse(function(object) {
        if (object instanceof THREE.Mesh) { object.castShadow = true; object.receiveShadow = true; }
      });
    }

    Dragon.prototype.update = function() {
      this.tailAngle += this.tailSpeed/globalSpeedRate;
      this.wingAngle += this.wingSpeed/globalSpeedRate;
      for (var i = 0; i < this.tailLine.geometry.vertices.length; i++) {
        var v = this.tailLine.geometry.vertices[i];
        v.y = Math.sin(this.tailAngle - (Math.PI / 3) * i) * this.tailAmplitude * i * i;
        v.x = Math.cos(this.tailAngle / 2 + (Math.PI / 10) * i) * this.tailAmplitude * i * i;
        if (i == this.tailLine.geometry.vertices.length - 1) {
          this.tailPike.position.set(v.x, v.y, this.tailPike.position.z);
          this.tailPike.rotation.x = (v.y / 30);
        }
      }
      this.tailLine.geometry.verticesNeedUpdate = true;
      this.wingL.rotation.z = -Math.PI / 4 + Math.cos(this.wingAngle) * this.wingAmplitude;
      this.wingR.rotation.z = Math.PI / 4 - Math.cos(this.wingAngle) * this.wingAmplitude;
    }

    Dragon.prototype.prepareToSneeze = function(s) {
      var _this = this; var speed = .7*globalSpeedRate;
      TweenLite.to(this.head.rotation, speed, { x: -s * .12, ease: Back.easeOut });
      TweenLite.to(this.head.position, speed, { z: 30 - s * 2.2, y: s * 2.2, ease: Back.easeOut });
      TweenLite.to(this.mouth.rotation, speed, { x: s * .18, ease: Back.easeOut });
      TweenLite.to(this.smile.position, speed/2, { z:75, y:10, ease: Back.easeOut });
      TweenLite.to(this.smile.scale, speed/2, { x:0, y:0, ease: Back.easeOut });
      TweenMax.to(this.noseL.scale, speed, { x: 1 + s * .1, y: 1 + s * .1, ease: Back.easeOut });
      TweenMax.to(this.noseR.scale, speed, { x: 1 + s * .1, y: 1 + s * .1, ease: Back.easeOut });
      TweenMax.to(this.eyeL.scale, speed, { y: 1 + s * .01, ease: Back.easeOut });
      TweenMax.to(this.eyeR.scale, speed, { y: 1 + s * .01, ease: Back.easeOut });
      TweenMax.to(this.irisL.scale, speed, { y: 1 + s * .05, z: 1 + s * .05, ease: Back.easeOut });
      TweenMax.to(this.irisR.scale, speed, { y: 1 + s * .05, z: 1 + s * .05, ease: Back.easeOut });
      TweenMax.to(this.irisL.position, speed, { y: 30 + s * .8, z: 24 - s * .4, ease: Back.easeOut });
      TweenMax.to(this.irisR.position, speed, { y: 30 + s * .8, z: 24 - s * .4, ease: Back.easeOut });
      TweenMax.to(this.earL.rotation, speed, { x: -s * .1, y: -s * .1, ease: Back.easeOut });
      TweenMax.to(this.earR.rotation, speed, { x: -s * .1, y: s * .1, ease: Back.easeOut });
      TweenMax.to(this.wingL.rotation, speed, { z: -Math.PI / 4 - s * .1, ease: Back.easeOut });
      TweenMax.to(this.wingR.rotation, speed, { z: Math.PI / 4 + s * .1, ease: Back.easeOut });
      TweenMax.to(this.body.rotation, speed, { x: -s * .05, ease: Back.easeOut });
      TweenMax.to(this.body.scale, speed, { y: 1 + s * .01, ease: Back.easeOut });
      TweenMax.to(this.body.position, speed, { z: -s * 2, ease: Back.easeOut });
      TweenMax.to(this.tail.rotation, speed, { x: s * 0.1, ease: Back.easeOut });
    }

    Dragon.prototype.sneeze = function(s) {
      var _this = this; var sneezeEffect = 1 - (s / maxSneezingRate); var speed = .1*globalSpeedRate;
      timeFire = Math.round(s * 10);
      TweenLite.to(this.head.rotation, speed, { x: s * .05, ease: Back.easeOut });
      TweenLite.to(this.head.position, speed, { z: 30 + s * 2.4, y: -s * .4, ease: Back.easeOut });
      TweenLite.to(this.mouth.rotation, speed, { x: 0, ease: Strong.easeOut });
      TweenLite.to(this.smile.position, speed*2, { z:82, y:5, ease: Strong.easeIn });
      TweenLite.to(this.smile.scale, speed*2, { x:1, y:1, ease: Strong.easeIn });
      TweenMax.to(this.noseL.scale, speed, { y: sneezeEffect, ease: Strong.easeOut });
      TweenMax.to(this.noseR.scale, speed, { y: sneezeEffect, ease: Strong.easeOut });
      TweenMax.to(this.noseL.position, speed, { y: 40, ease: Strong.easeOut });
      TweenMax.to(this.noseR.position, speed, { y: 40, ease: Strong.easeOut });
      TweenMax.to(this.irisL.scale, speed, { y: sneezeEffect/2, z: 1, ease: Strong.easeOut });
      TweenMax.to(this.irisR.scale, speed, { y: sneezeEffect/2, z: 1, ease: Strong.easeOut });
      TweenMax.to(this.eyeL.scale, speed, { y: sneezeEffect/2, ease: Back.easeOut });
      TweenMax.to(this.eyeR.scale, speed, { y: sneezeEffect/2, ease: Back.easeOut });
      TweenMax.to(this.wingL.rotation, speed, { z: -Math.PI / 4 + s * .15, ease: Back.easeOut });
      TweenMax.to(this.wingR.rotation, speed, { z: Math.PI / 4 - s * .15, ease: Back.easeOut });
      TweenMax.to(this.body.rotation, speed, { x: s * 0.02, ease: Back.easeOut });
      TweenMax.to(this.body.scale, speed, { y: 1 - s * .03, ease: Back.easeOut });
      TweenMax.to(this.body.position, speed, { z: s * 2, ease: Back.easeOut });
      TweenMax.to(this.irisL.position, speed*7, { y: 35, ease: Back.easeOut });
      TweenMax.to(this.irisR.position, speed*7, { y: 35, ease: Back.easeOut });
      TweenMax.to(this.earR.rotation, speed*3, { x: s * .20, y: s * .20, ease: Back.easeOut });
      TweenMax.to(this.earL.rotation, speed*3, { x: s * .20, y: -s * .20, ease: Back.easeOut,
        onComplete: function() { _this.backToNormal(s); fireRate = s; }
      });
      TweenMax.to(this.tail.rotation, speed*3, { x: -s * 0.1, ease: Back.easeOut });
    }

    Dragon.prototype.backToNormal = function(s) {
      var _this = this; var speed = 1*globalSpeedRate;
      TweenLite.to(this.head.rotation, speed, { x: 0, ease: Strong.easeInOut });
      TweenLite.to(this.head.position, speed, { z: 30, y: 0, ease: Back.easeOut });
      TweenMax.to(this.noseL.scale, speed, { x: 1, y: 1, ease: Strong.easeInOut });
      TweenMax.to(this.noseR.scale, speed, { x: 1, y: 1, ease: Strong.easeInOut });
      TweenMax.to(this.noseL.position, speed, { y: 40, ease: Strong.easeInOut });
      TweenMax.to(this.noseR.position, speed, { y: 40, ease: Strong.easeInOut });
      TweenMax.to(this.irisL.scale, speed, { y: 1, z: 1, ease: Back.easeOut });
      TweenMax.to(this.irisR.scale, speed, { y: 1, z: 1, ease: Back.easeOut });
      TweenMax.to(this.irisL.position, speed*.7, { y: 30, ease: Back.easeOut });
      TweenMax.to(this.irisR.position, speed*.7, { y: 30, ease: Back.easeOut });
      TweenMax.to(this.eyeL.scale, speed, { y: 1, ease: Strong.easeOut });
      TweenMax.to(this.eyeR.scale, speed, { y: 1, ease: Strong.easeOut });
      TweenMax.to(this.body.rotation, speed, { x: 0, ease: Back.easeOut });
      TweenMax.to(this.body.scale, speed, { y: 1, ease: Back.easeOut });
      TweenMax.to(this.body.position, speed, { z: 0, ease: Back.easeOut });
      TweenMax.to(this.wingL.rotation, speed*1.3, { z: -Math.PI / 4, ease: Back.easeInOut });
      TweenMax.to(this.wingR.rotation, speed*1.3, { z: Math.PI / 4, ease: Back.easeInOut });
      TweenMax.to(this.earL.rotation, speed*1.3, { x: 0, y: 0, ease: Back.easeInOut });
      TweenMax.to(this.earR.rotation, speed*1.3, { x: 0, y: 0, ease: Back.easeInOut, onComplete: function() { _this.isSneezing = false; timeSmoke = Math.round(s * 5); } });
      TweenMax.to(this.tail.rotation, speed*1.3, { x: 0, ease: Back.easeOut });
    }

    function createDragon() { dragon = new Dragon(); scene.add(dragon.threegroup); }

    SmokeParticle = function() {
      this.color = { r: 0, g: 0, b: 0 };
      var particleMat = new THREE.MeshLambertMaterial({ transparent: true, opacity: .5, shading: THREE.FlatShading });
      this.mesh = makeCube(particleMat, 4, 4, 4, 0, 0, 0, 0, 0, 0);
      awaitingSmokeParticles.push(this);
    }
    SmokeParticle.prototype.initialize = function() {
      this.mesh.rotation.set(0,0,0); this.mesh.position.set(0,0,0); this.mesh.scale.set(1,1,1);
      this.mesh.material.opacity = .5; awaitingSmokeParticles.push(this);
    }
    SmokeParticle.prototype.updateColor = function() { this.mesh.material.color.setRGB(this.color.r, this.color.g, this.color.b); }
    SmokeParticle.prototype.fly = function() {
      var _this = this; var speed = 10*globalSpeedRate; var ease = Strong.easeOut;
      var initX = this.mesh.position.x; var initY = this.mesh.position.y; var initZ = this.mesh.position.z;
      
      var bezier = { type: "cubic", values: [
        { x: initX, y: initY, z: initZ }, { x: initX + 30 - Math.random() * 10, y: initY + 20 + Math.random() * 2, z: initZ + 20 },
        { x: initX + 10 + Math.random() * 20, y: initY + 40 + Math.random() * 5, z: initZ - 30 }, { x: initX + 50 - Math.random() * 20, y: initY + 70 + Math.random() * 10, z: initZ + 20 }
      ]};
      TweenMax.to(this.mesh.position, speed, { bezier: bezier, ease: ease });
      TweenMax.to(this.mesh.rotation, speed, { x: Math.random() * Math.PI * 3, y: Math.random() * Math.PI * 3, ease: ease });
      TweenMax.to(this.mesh.scale, speed, { x: 5 + Math.random() * 5, y: 5 + Math.random() * 5, z: 5 + Math.random() * 5, ease: ease });
      TweenMax.to(this.mesh.material, speed, { opacity: 0, ease: ease, onComplete: function() { _this.initialize(); } });
    }
    SmokeParticle.prototype.fire = function(f) {
      var _this = this; var speed = 1*globalSpeedRate; var ease = Strong.easeOut;
      var initX = this.mesh.position.x; var initY = this.mesh.position.y; var initZ = this.mesh.position.z;

      TweenMax.to(this.mesh.position, speed, { x: 0, y: initY-2*f, z: Math.max(initZ+15*f, initZ+40), ease: ease });
      TweenMax.to(this.mesh.rotation, speed, { x: Math.random() * Math.PI * 3, y: Math.random() * Math.PI * 3, ease: ease });
      
      var bezierScale = [
        { x:1, y:1, z:1 }, { x:f/maxSneezingRate+Math.random()*.3, y:f/maxSneezingRate+Math.random()*.3, z:f*2/maxSneezingRate+Math.random()*.3 },
        { x:f/maxSneezingRate+Math.random()*.5, y:f/maxSneezingRate+Math.random()*.5, z:f*2/maxSneezingRate+Math.random()*.5 },
        { x:f*2/maxSneezingRate+Math.random()*.5, y:f*2/maxSneezingRate+Math.random()*.5, z:f*4/maxSneezingRate+Math.random()*.5 },
        { x:f*2+Math.random()*5, y:f*2+Math.random()*5, z:f*2+Math.random()*5 }
      ];
      TweenMax.to(this.mesh.scale, speed * 2, { bezier:bezierScale, ease: ease, onComplete: function() { _this.initialize(); } });
      TweenMax.to(this.mesh.material, speed, { opacity: 0, ease: ease });
      
      var bezierColor = [
        { r: 255 / 255, g: 205 / 255, b: 74 / 255 }, { r: 255 / 255, g: 205 / 255, b: 74 / 255 }, { r: 255 / 255, g: 205 / 255, b: 74 / 255 },
        { r: 247 / 255, g: 34 / 255, b: 50 / 255 }, { r: 0 / 255, g: 0 / 255, b: 0 / 255 }
      ];
      TweenMax.to(this.color, speed, { bezier: bezierColor, ease: Strong.easeOut, onUpdate: function() { _this.updateColor(); } });
    }

    function getSmokeParticle() { return awaitingSmokeParticles.length ? awaitingSmokeParticles.pop() : new SmokeParticle(); }

    function loop() {
      if(!isPlaying) { requestAnimationFrame(loop); return; }
      var dt = clock.getDelta();
      // Native smooth rotation
      dragon.threegroup.rotation.y += (targetRotation - dragon.threegroup.rotation.y) * 0.1;

      if (!dragon.isSneezing) dragon.update();

      if (timeSmoke > 0) {
        var noseTarget = (Math.random() > .5) ? dragon.noseL : dragon.noseR;
        var p = getSmokeParticle();
        var pos = noseTarget.localToWorld(new THREE.Vector3(0, 0, 2));
        p.mesh.position.set(pos.x, pos.y, pos.z);
        p.mesh.material.color.setHex(0x555555); p.mesh.material.opacity = .2;
        scene.add(p.mesh); p.fly();
        timeSmoke--;
      }

      if (timeFire > 0) {
        var noseTarget = (Math.random() > .5) ? dragon.noseL : dragon.noseR;
        var f = getSmokeParticle();
        var posF = noseTarget.localToWorld(new THREE.Vector3(0, 0, 2));
        f.mesh.position.set(posF.x, posF.y, posF.z);
        f.color = { r: 255 / 255, g: 205 / 255, b: 74 / 255 };
        f.mesh.material.color.setRGB(f.color.r, f.color.g, f.color.b);
        f.mesh.material.opacity = 1;
        scene.add(f.mesh); f.fire(fireRate);
        timeFire--;
      }

      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    }

    setTimeout(() => {
      init(); createLights(); createFloor(); createDragon(); loop();
    }, 100);

  <\/script>
</body>
</html>`;


export const BIRDS_3D_CODE = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
  <style>
    body, html { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; background: #e0dacd; touch-action: none; }
    #world { position: absolute; width: 100%; height: 100%; overflow: hidden; z-index: 1; }
    canvas { position: absolute; top: 0; left: 0; width: 100vw !important; height: 100vh !important; z-index: 99 !important; display: block; }
    
    #instructions {
      position: absolute; width: 100%; top: 50%; margin-top: 150px; font-family: system-ui, sans-serif;
      color: #b75505; font-size: 1.1em; text-transform: uppercase; text-align: center;
      line-height: 1.5; user-select: none; z-index: 100; pointer-events: none;
    }

  </style>
  <script src="./three.min.js"><\/script>
  <script src="./TweenMax.min.js"><\/script>
</head>
<body>
  <div id="world"></div>
  <div id="instructions">What you doing here ?/></div>

  <script>
    //THREEJS RELATED VARIABLES
    var scene, camera, fieldOfView, aspectRatio, nearPlane, farPlane, shadowLight, backLight, light, renderer, container;
    var clock = new THREE.Clock();

    //SCENE
    var floor, bird1, bird2, bird3;
    var HEIGHT, WIDTH, windowHalfX, windowHalfY, mousePos = {x:0,y:0};
    var isPlaying = true; // Battery optimization

    //INIT THREE JS, SCREEN AND MOUSE EVENTS
    function init(){
      scene = new THREE.Scene();
      HEIGHT = window.innerHeight || window.screen.height;
      WIDTH = window.innerWidth || window.screen.width;
      aspectRatio = WIDTH / HEIGHT;
      
      // MOBILE ZOOM: Wider lens on mobile so all 3 birds fit
      fieldOfView = (WIDTH < 600) ? 90 : 60; 
      
      nearPlane = 1;
      farPlane = 2000; 
      camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
      
      // Adjust camera distance depending on screen size
      camera.position.z = (WIDTH < 600) ? 1200 : 1000;  
      camera.position.y = 300;
      camera.lookAt(new THREE.Vector3(0,0,0));    
      
      renderer = new THREE.WebGLRenderer({alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); 
      renderer.setSize(WIDTH, HEIGHT);
      renderer.shadowMap.enabled = true;
      
      container = document.getElementById('world');
      container.appendChild(renderer.domElement);

      windowHalfX = WIDTH / 2;
      windowHalfY = HEIGHT / 2;
        
      window.addEventListener('resize', onWindowResize, false);
      document.addEventListener('mousemove', handleMouseMove, false);
      document.addEventListener('touchstart', handleTouchStart, {passive: true});
      document.addEventListener('touchend', handleTouchEnd, false);
      document.addEventListener('touchmove', handleTouchMove, {passive: true});

      // Battery Optimization
      window.addEventListener("pauseWallpaper", () => isPlaying = false);
      window.addEventListener("playWallpaper", () => { if(!isPlaying){ isPlaying = true; clock.getDelta(); loop(); }});
    }

    function onWindowResize() {
      HEIGHT = window.innerHeight;
      WIDTH = window.innerWidth;
      windowHalfX = WIDTH / 2;
      windowHalfY = HEIGHT / 2;
      renderer.setSize(WIDTH, HEIGHT);
      camera.aspect = WIDTH / HEIGHT;
      camera.updateProjectionMatrix();
    }

    function handleMouseMove(event) {
      mousePos = {x:event.clientX, y:event.clientY};
    }
    function handleTouchStart(event) {
      if (event.touches.length > 0) { mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY}; }
    }
    function handleTouchEnd(event) {
      mousePos = {x:windowHalfX, y:windowHalfY};
    }
    function handleTouchMove(event) {
      if (event.touches.length > 0) { mousePos = {x:event.touches[0].pageX, y:event.touches[0].pageY}; }
    }

    function createLights() {
      light = new THREE.HemisphereLight(0xffffff, 0xffffff, .5)
      shadowLight = new THREE.DirectionalLight(0xffffff, .8);
      shadowLight.position.set(200, 200, 200);
      shadowLight.castShadow = true;
      backLight = new THREE.DirectionalLight(0xffffff, .4);
      backLight.position.set(-100, 200, 50);
      backLight.castShadow = true;
      scene.add(backLight);
      scene.add(light);
      scene.add(shadowLight);
    }

    //BIRD
    Bird = function(){
      this.rSegments = 4;
      this.hSegments = 3;
      this.cylRay = 120;
      this.bodyBirdInitPositions = [];
      this.vAngle = this.hAngle = 0;
      this.normalSkin = {r:255/255, g:222/255, b:121/255};
      this.shySkin = {r:255/255, g:157/255, b:101/255};
      this.color = {r:this.normalSkin.r, g:this.normalSkin.g, b:this.normalSkin.b};
      this.side = "left";
      
      this.shyAngles = {h:0, v:0};
      this.behaviourInterval;
      this.intervalRunning = false;
      
      this.threegroup = new THREE.Group();
      
      this.yellowMat = new THREE.MeshLambertMaterial ({ color: 0xffde79, shading:THREE.FlatShading });
      this.whiteMat = new THREE.MeshLambertMaterial ({ color: 0xffffff, shading: THREE.FlatShading });
      this.blackMat = new THREE.MeshLambertMaterial ({ color: 0x000000, shading: THREE.FlatShading });
      this.orangeMat = new THREE.MeshLambertMaterial ({ color: 0xff5535, shading: THREE.FlatShading });
      
      this.wingLeftGroup = new THREE.Group();
      this.wingRightGroup = new THREE.Group();
     
      var wingGeom = new THREE.BoxGeometry(60,60, 5);
      var wingLeft = new THREE.Mesh(wingGeom, this.yellowMat);
      this.wingLeftGroup.add(wingLeft);
      this.wingLeftGroup.position.x = 70;
      this.wingLeftGroup.position.z = 0;
      this.wingLeftGroup.rotation.y = Math.PI/2;
      wingLeft.rotation.x = -Math.PI/4;
      
      var wingRight = new THREE.Mesh(wingGeom, this.yellowMat);
      this.wingRightGroup.add(wingRight);
      this.wingRightGroup.position.x = -70;
      this.wingRightGroup.position.z = 0;
      this.wingRightGroup.rotation.y = -Math.PI/2;
      wingRight.rotation.x = -Math.PI/4;
      
      var bodyGeom = new THREE.CylinderGeometry(40, 70, 200, this.rSegments, this.hSegments);
      this.bodyBird = new THREE.Mesh(bodyGeom, this.yellowMat);
      this.bodyBird.position.y = 70;
      
      this.bodyVerticesLength = (this.rSegments+1)*(this.hSegments);
      for (var i=0;i<this.bodyVerticesLength; i++){
        var tv = this.bodyBird.geometry.vertices[i];
        this.bodyBirdInitPositions.push({x:tv.x, y:tv.y, z:tv.z});
      }
      
      this.threegroup.add(this.bodyBird);
      this.threegroup.add(this.wingLeftGroup);
      this.threegroup.add(this.wingRightGroup);
      
      this.face = new THREE.Group();
      var eyeGeom = new THREE.BoxGeometry(60,60,10);
      var irisGeom = new THREE.BoxGeometry(10,10,10);
      
      this.leftEye = new THREE.Mesh(eyeGeom, this.whiteMat);
      this.leftEye.position.set(-30, 120, 35);
      this.leftEye.rotation.y = -Math.PI/4;
      
      this.leftIris = new THREE.Mesh(irisGeom, this.blackMat);
      this.leftIris.position.set(-30, 120, 40);
      this.leftIris.rotation.y = -Math.PI/4;
      
      this.rightEye = new THREE.Mesh(eyeGeom, this.whiteMat);
      this.rightEye.position.set(30, 120, 35);
      this.rightEye.rotation.y = Math.PI/4;
      
      this.rightIris = new THREE.Mesh(irisGeom, this.blackMat);
      this.rightIris.position.set(30, 120, 40);
      this.rightIris.rotation.y = Math.PI/4;
      
      var beakGeom = new THREE.CylinderGeometry(0,20,20, 4,1);
      this.beak = new THREE.Mesh(beakGeom, this.orangeMat);
      this.beak.position.set(0, 70, 65);
      this.beak.rotation.x = Math.PI/2;
      
      this.face.add(this.rightEye); this.face.add(this.rightIris);
      this.face.add(this.leftEye); this.face.add(this.leftIris);
      this.face.add(this.beak);
      
      var featherGeom = new THREE.BoxGeometry(10,20,5);
      this.feather1 = new THREE.Mesh(featherGeom, this.yellowMat);
      this.feather1.position.set(0, 185, 55);
      this.feather1.rotation.x = Math.PI/4;
      this.feather1.scale.set(1.5,1.5,1);
      
      this.feather2 = new THREE.Mesh(featherGeom, this.yellowMat);
      this.feather2.position.set(20, 180, 50);
      this.feather2.rotation.set(Math.PI/4, 0, -Math.PI/8);
        
      this.feather3 = new THREE.Mesh(featherGeom, this.yellowMat);
      this.feather3.position.set(-20, 180, 50);
      this.feather3.rotation.set(Math.PI/4, 0, Math.PI/8);
      
      this.face.add(this.feather1); this.face.add(this.feather2); this.face.add(this.feather3);
      this.threegroup.add(this.face);
      
      this.threegroup.traverse( function ( object ) {
        if ( object instanceof THREE.Mesh ) { object.castShadow = true; object.receiveShadow = true; }
      } );
    }

    Bird.prototype.look = function(hAngle,vAngle){
      this.hAngle = hAngle;
      this.vAngle = vAngle;
      
      this.leftIris.position.y = 120 - this.vAngle*30;
      this.leftIris.position.x = -30 + this.hAngle*10;
      this.leftIris.position.z = 40 + this.hAngle*10;
      
      this.rightIris.position.y = 120 - this.vAngle*30;
      this.rightIris.position.x = 30 + this.hAngle*10;
      this.rightIris.position.z = 40 - this.hAngle*10;
      
      this.leftEye.position.y = this.rightEye.position.y = 120 - this.vAngle*10;
      
      this.beak.position.y = 70 - this.vAngle*20;
      this.beak.rotation.x = Math.PI/2 + this.vAngle/3;
      
      this.feather1.rotation.x = (Math.PI/4) + (this.vAngle/2);
      this.feather1.position.y = 185 - this.vAngle*10;
      this.feather1.position.z = 55 + this.vAngle*10;
      
      this.feather2.rotation.x = (Math.PI/4) + (this.vAngle/2);
      this.feather2.position.y = 180 - this.vAngle*10;
      this.feather2.position.z = 50 + this.vAngle*10;
      
      this.feather3.rotation.x = (Math.PI/4) + (this.vAngle/2);
      this.feather3.position.y = 180 - this.vAngle*10;
      this.feather3.position.z = 50 + this.vAngle*10;
      
      for (var i=0;i<this.bodyVerticesLength; i++){
        var line = Math.floor(i/(this.rSegments+1));
        var tv = this.bodyBird.geometry.vertices[i];
        var tvInitPos = this.bodyBirdInitPositions[i];
        var a;
        if (line >= this.hSegments-1){ a = 0; }
        else { a = this.hAngle/(line+1); }
        var tx = tvInitPos.x*Math.cos(a) + tvInitPos.z*Math.sin(a);
        var tz = -tvInitPos.x*Math.sin(a) + tvInitPos.z*Math.cos(a);
        tv.x = tx; tv.z = tz;
      }
      this.face.rotation.y = this.hAngle;
      this.bodyBird.geometry.verticesNeedUpdate = true;
    }

    Bird.prototype.lookAway = function(fastMove){
      var speed = fastMove? .4 : 2;
      var ease = fastMove? Strong.easeOut : Strong.easeInOut;
      var delay = fastMove? .2 : 0;
      var col = fastMove? this.shySkin : this.normalSkin;
      var tv = (-1 + Math.random()*2) * Math.PI/3;
      var beakScaleX = .75 + Math.random()*.25;
      var beakScaleZ = .5 + Math.random()*.5;
      
      var th = (this.side == "right") ? (-1 + Math.random()) * Math.PI/4 : Math.random() * Math.PI/4;  
      
      TweenMax.killTweensOf(this.shyAngles);
      TweenMax.to(this.shyAngles, speed, {v:tv, h:th, ease:ease, delay:delay});
      TweenMax.to(this.color, speed, {r:col.r, g:col.g, b:col.b, ease:ease, delay:delay});
      TweenMax.to(this.beak.scale, speed, {z:beakScaleZ, x:beakScaleX, ease:ease, delay:delay});
    }

    Bird.prototype.stare = function(){
      var col = this.normalSkin;
      var th = (this.side == "right") ? Math.PI/3 : -Math.PI/3;  
      TweenMax.to(this.shyAngles, 2, {v:-.5, h:th, ease:Strong.easeInOut});
      TweenMax.to(this.color, 2, {r:col.r, g:col.g, b:col.b, ease:Strong.easeInOut});
      TweenMax.to(this.beak.scale, 2, {z:.8, x:1.5, ease:Strong.easeInOut});
    }

    function createFloor(){ 
      floor = new THREE.Mesh(new THREE.PlaneBufferGeometry(1000,1000), new THREE.MeshBasicMaterial({color: 0xe0dacd}));
      floor.rotation.x = -Math.PI/2;
      floor.position.y = -33;
      floor.receiveShadow = true;
      scene.add(floor);
    }

    function createBirds(){
      bird1 = new Bird();
      bird1.threegroup.position.x = 0;
      scene.add(bird1.threegroup);
      
      bird2 = new Bird();
      bird2.threegroup.position.x = -250;
      bird2.side = "right";
      bird2.threegroup.scale.set(.8,.8,.8);
      bird2.threegroup.position.y = -8;
      scene.add(bird2.threegroup);
      
      bird3 = new Bird();
      bird3.threegroup.position.x = 250;
      bird3.side = "left";
      bird3.threegroup.scale.set(.8,.8,.8);
      bird3.threegroup.position.y = -8;
      scene.add(bird3.threegroup);
    }

    function loop(){
      if(!isPlaying) { requestAnimationFrame(loop); return; } // Save Battery
      
      var dt = clock.getDelta();

      var tempHA = (mousePos.x-windowHalfX)/200;
      var tempVA = (mousePos.y - windowHalfY)/200;
      var userHAngle = Math.min(Math.max(tempHA, -Math.PI/3), Math.PI/3);
      var userVAngle = Math.min(Math.max(tempVA, -Math.PI/3), Math.PI/3);
      bird1.look(userHAngle,userVAngle);
      
      if (bird1.hAngle < -Math.PI/5 && !bird2.intervalRunning){
          bird2.lookAway(true);
          bird2.intervalRunning = true;
          bird2.behaviourInterval = setInterval(function(){
            bird2.lookAway(false);
          }, 1500);
      }else if (bird1.hAngle > 0 && bird2.intervalRunning){
        bird2.stare();
        clearInterval(bird2.behaviourInterval);
        bird2.intervalRunning = false;
      }else if (bird1.hAngle > Math.PI/5 && !bird3.intervalRunning){
        bird3.lookAway(true);
        bird3.intervalRunning = true;
        bird3.behaviourInterval = setInterval(function(){
          bird3.lookAway(false);
        }, 1500);
      }else if (bird1.hAngle < 0 && bird3.intervalRunning){
        bird3.stare();
        clearInterval(bird3.behaviourInterval);
        bird3.intervalRunning = false;
      }
      
      bird2.look(bird2.shyAngles.h, bird2.shyAngles.v);
      bird2.bodyBird.material.color.setRGB(bird2.color.r,bird2.color.g,bird2.color.b);
      
      bird3.look(bird3.shyAngles.h, bird3.shyAngles.v);
      bird3.bodyBird.material.color.setRGB(bird3.color.r,bird3.color.g,bird3.color.b);
      
      renderer.render(scene, camera);
      requestAnimationFrame(loop);
    }

    // Load instantly (bypassing window.onload bug in Android)
    setTimeout(() => {
      init();
      createLights();
      createFloor();
      createBirds();
      loop();
    }, 100);

  <\/script>
</body>
</html>`;

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'live',
    name: { en: 'Interactive', hi: 'इंटरएक्टिव', ja: 'インタラクティブ', fr: 'Interactif' },
    title: 'Live & Interactive',
    image: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?q=80&w=2000',
    count: '5 New',
    type: 'live'
  },
  {
    id: 'abstract',
    name: { en: 'Abstract Elements', hi: 'एब्सट्रैक्ट', ja: '抽象', fr: 'Abstrait' },
    title: 'Abstract Elements',
    image: require('../assets/images/categories/category-1.webp'),
    count: '120+',
    type: 'image'
  },
  {
    id: 'nature',
    name: { en: 'Minimal Nature', hi: 'प्रकृति', ja: '自然', fr: 'Nature' },
    title: 'Minimal Nature',
    image: require('../assets/images/categories/category-2.webp'),
    count: '85+',
    type: 'image'
  },
  {
    id: 'urban',
    name: { en: 'Urban Geometry', hi: 'शहरी', ja: '都市', fr: 'Urbain' },
    title: 'Urban Geometry',
    image: require('../assets/images/categories/category-3.webp'),
    count: '98+',
    type: 'image'
  },
];

export const MOCK_WALLPAPERS: Wallpaper[] = [

  {
    _id: 'html_fish',
    url: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=1080', // Replace with a nice cartoon sky image
    thumbnail: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=400',
    author: 'Toss Studio',
    type: 'interactive',
    category: { id: 'live', name: { en: 'Interactive' } },
    indexCode: FISH_3D_CODE
  },
  {
    _id: 'html_aviator',
    url: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=1080', // Replace with a nice cartoon sky image
    thumbnail: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=400',
    author: 'Toss Studio',
    type: 'interactive',
    category: { id: 'live', name: { en: 'Interactive' } },
    indexCode: AVIATOR_3D_CODE
  },
  {
    _id: 'html_runner',
    url: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=1080', // Replace with a nice cartoon sky image
    thumbnail: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=400',
    author: 'Toss Studio',
    type: 'interactive',
    category: { id: 'live', name: { en: 'Interactive' } },
    indexCode: RUNNER_3D_CODE
  },
  {
    _id: 'html_chillLion',
    url: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=1080', // Replace with a nice cartoon sky image
    thumbnail: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=400',
    author: 'Toss Studio',
    type: 'interactive',
    category: { id: 'live', name: { en: 'Interactive' } },
    indexCode: LION_3D_CODE
  },
  {
    _id: 'html_birds',
    url: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=1080', // Replace with a nice cartoon sky image
    thumbnail: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=400',
    author: 'Toss Studio',
    type: 'interactive',
    category: { id: 'live', name: { en: 'Interactive' } },
    indexCode: BIRDS_3D_CODE
  },
  {
    _id: 'html_dragon',
    url: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=1080', // Replace with a nice cartoon sky image
    thumbnail: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=400',
    author: 'Toss Studio',
    type: 'interactive',
    category: { id: 'live', name: { en: 'Interactive' } },
    indexCode: DRAGON_3D_CODE
  },
  {
    _id: 'abstract_1',
    url: 'https://picsum.photos/seed/abs1/1080/2400',
    thumbnail: 'https://picsum.photos/seed/abs1/400/800',
    author: 'Abstract Artist',
    type: 'image',
    category: { id: 'abstract', name: { en: 'Abstract' } },
    indexCode: null
  },
  {
    _id: 'abstract_2',
    url: 'https://picsum.photos/seed/abs2/1080/2400',
    thumbnail: 'https://picsum.photos/seed/abs2/400/800',
    author: 'Digital Guru',
    type: 'image',
    category: { id: 'abstract', name: { en: 'Abstract' } },
    indexCode: null
  },
  {
    _id: 'nature_1',
    url: 'https://picsum.photos/seed/nat1/1080/2400',
    thumbnail: 'https://picsum.photos/seed/nat1/400/800',
    author: 'Nature Lover',
    type: 'image',
    category: { id: 'nature', name: { en: 'Nature' } },
    indexCode: null
  },
  {
    _id: 'nature_2',
    url: 'https://picsum.photos/seed/nat2/1080/2400',
    thumbnail: 'https://picsum.photos/seed/nat2/400/800',
    author: 'Eco Warrior',
    type: 'image',
    category: { id: 'nature', name: { en: 'Nature' } },
    indexCode: null
  },
  {
    _id: 'urban_1',
    url: 'https://picsum.photos/seed/urb1/1080/2400',
    thumbnail: 'https://picsum.photos/seed/urb1/400/800',
    author: 'City Slicker',
    type: 'image',
    category: { id: 'urban', name: { en: 'Urban' } },
    indexCode: null
  },
  {
    _id: 'urban_2',
    url: 'https://picsum.photos/seed/urb2/1080/2400',
    thumbnail: 'https://picsum.photos/seed/urb2/400/800',
    author: 'Modernist',
    type: 'image',
    category: { id: 'urban', name: { en: 'Urban' } },
    indexCode: null
  },
];

export const CATEGORIES = MOCK_CATEGORIES;
export const MOCK_IMAGES = MOCK_WALLPAPERS.map(w => ({ id: w._id, url: w.url, author: w.author }));
