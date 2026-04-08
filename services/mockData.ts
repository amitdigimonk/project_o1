import { Category, Wallpaper } from '../types';

const AVIATOR_3D_CODE = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no"><style>body,html{margin:0;padding:0;width:100%;height:100%;background:#f7d9aa;overflow:hidden}#world{position:absolute;width:100%;height:100%;overflow:hidden;z-index:1}canvas{position:absolute;top:0;left:0;width:100vw!important;height:100vh!important;z-index:99!important;display:block}</style><script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r75/three.min.js"><\/script></head><body><div id="world"></div><script>var Colors={red:0xf25346,yellow:0xedeb27,white:0xd8d0d1,brown:0x59332e,pink:0xF5986E,brownDark:0x23190f,blue:0x68c3c0,green:0x458248,purple:0x551A8B,lightgreen:0x629265};var scene,camera,fieldOfView,aspectRatio,nearPlane,farPlane,HEIGHT,WIDTH,renderer,container;var isPlaying=true;function createScene(){HEIGHT=window.innerHeight||1000;WIDTH=window.innerWidth||500;scene=new THREE.Scene();scene.fog=new THREE.Fog(0xf7d9aa,100,950);aspectRatio=WIDTH/HEIGHT;fieldOfView=60;nearPlane=1;farPlane=10000;camera=new THREE.PerspectiveCamera(fieldOfView,aspectRatio,nearPlane,farPlane);camera.position.x=0;camera.position.y=150;camera.position.z=100;renderer=new THREE.WebGLRenderer({alpha:true,antialias:false,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.5));renderer.setSize(WIDTH,HEIGHT);renderer.shadowMap.enabled=true;container=document.getElementById("world");container.appendChild(renderer.domElement);window.addEventListener("resize",handleWindowResize,false)}function handleWindowResize(){HEIGHT=window.innerHeight;WIDTH=window.innerWidth;renderer.setSize(WIDTH,HEIGHT);camera.aspect=WIDTH/HEIGHT;camera.updateProjectionMatrix()}var hemisphereLight,shadowLight;function createLights(){hemisphereLight=new THREE.HemisphereLight(0xaaaaaa,0x000000,.9);shadowLight=new THREE.DirectionalLight(0xffffff,.9);shadowLight.position.set(0,350,350);shadowLight.castShadow=true;shadowLight.shadow.camera.left=-650;shadowLight.shadow.camera.right=650;shadowLight.shadow.camera.top=650;shadowLight.shadow.camera.bottom=-650;shadowLight.shadow.camera.near=1;shadowLight.shadow.camera.far=1000;shadowLight.shadow.mapSize.width=1024;shadowLight.shadow.mapSize.height=1024;scene.add(hemisphereLight);scene.add(shadowLight)}var Land=function(){var geom=new THREE.CylinderGeometry(600,600,1700,40,10);geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));var mat=new THREE.MeshPhongMaterial({color:Colors.lightgreen,shading:THREE.FlatShading});this.mesh=new THREE.Mesh(geom,mat);this.mesh.receiveShadow=true};var Orbit=function(){this.mesh=new THREE.Object3D()};var Sun=function(){this.mesh=new THREE.Object3D();var sunGeom=new THREE.SphereGeometry(400,20,10);var sunMat=new THREE.MeshPhongMaterial({color:Colors.yellow,shading:THREE.FlatShading});var sun=new THREE.Mesh(sunGeom,sunMat);sun.castShadow=false;sun.receiveShadow=false;this.mesh.add(sun)};var Cloud=function(){this.mesh=new THREE.Object3D();var geom=new THREE.DodecahedronGeometry(20,0);var mat=new THREE.MeshPhongMaterial({color:Colors.white});var nBlocs=3+Math.floor(Math.random()*3);for(var i=0;i<nBlocs;i++){var m=new THREE.Mesh(geom,mat);m.position.x=i*15;m.position.y=Math.random()*10;m.position.z=Math.random()*10;m.rotation.z=Math.random()*Math.PI*2;m.rotation.y=Math.random()*Math.PI*2;var s=.1+Math.random()*.9;m.scale.set(s,s,s);this.mesh.add(m)}};var Sky=function(){this.mesh=new THREE.Object3D();this.nClouds=25;var stepAngle=Math.PI*2/this.nClouds;for(var i=0;i<this.nClouds;i++){var c=new Cloud();var a=stepAngle*i;var h=800+Math.random()*200;c.mesh.position.y=Math.sin(a)*h;c.mesh.position.x=Math.cos(a)*h;c.mesh.rotation.z=a+Math.PI/2;c.mesh.position.z=-400-Math.random()*400;var s=1+Math.random()*2;c.mesh.scale.set(s,s,s);this.mesh.add(c.mesh)}};var Tree=function(){this.mesh=new THREE.Object3D();var matTreeLeaves=new THREE.MeshPhongMaterial({color:Colors.green,shading:THREE.FlatShading});var geonTreeBase=new THREE.BoxGeometry(10,20,10);var matTreeBase=new THREE.MeshBasicMaterial({color:Colors.brown});var treeBase=new THREE.Mesh(geonTreeBase,matTreeBase);treeBase.castShadow=true;treeBase.receiveShadow=true;this.mesh.add(treeBase);var geomTreeLeaves1=new THREE.CylinderGeometry(1,36,36,4);var treeLeaves1=new THREE.Mesh(geomTreeLeaves1,matTreeLeaves);treeLeaves1.castShadow=true;treeLeaves1.receiveShadow=true;treeLeaves1.position.y=20;this.mesh.add(treeLeaves1);var geomTreeLeaves2=new THREE.CylinderGeometry(1,27,27,4);var treeLeaves2=new THREE.Mesh(geomTreeLeaves2,matTreeLeaves);treeLeaves2.castShadow=true;treeLeaves2.receiveShadow=true;treeLeaves2.position.y=40;this.mesh.add(treeLeaves2);var geomTreeLeaves3=new THREE.CylinderGeometry(1,18,18,4);var treeLeaves3=new THREE.Mesh(geomTreeLeaves3,matTreeLeaves);treeLeaves3.castShadow=true;treeLeaves3.receiveShadow=true;treeLeaves3.position.y=55;this.mesh.add(treeLeaves3)};var petalColors=[Colors.red,Colors.yellow,Colors.blue];var Flower=function(){this.mesh=new THREE.Object3D();var geomStem=new THREE.BoxGeometry(5,50,5,1,1,1);var matStem=new THREE.MeshPhongMaterial({color:Colors.green,shading:THREE.FlatShading});var stem=new THREE.Mesh(geomStem,matStem);stem.castShadow=false;stem.receiveShadow=true;this.mesh.add(stem);var geomPetalCore=new THREE.BoxGeometry(10,10,10,1,1,1);var matPetalCore=new THREE.MeshPhongMaterial({color:Colors.yellow,shading:THREE.FlatShading});var petalCore=new THREE.Mesh(geomPetalCore,matPetalCore);petalCore.castShadow=false;petalCore.receiveShadow=true;var petalColor=petalColors[Math.floor(Math.random()*3)];var geomPetal=new THREE.BoxGeometry(15,20,5,1,1,1);var matPetal=new THREE.MeshBasicMaterial({color:petalColor});geomPetal.vertices[5].y-=4;geomPetal.vertices[4].y-=4;geomPetal.vertices[7].y+=4;geomPetal.vertices[6].y+=4;geomPetal.translate(12.5,0,3);var petals=[];for(var i=0;i<4;i++){petals[i]=new THREE.Mesh(geomPetal,matPetal);petals[i].rotation.z=i*Math.PI/2;petals[i].castShadow=true;petals[i].receiveShadow=true}petalCore.add(petals[0],petals[1],petals[2],petals[3]);petalCore.position.y=25;petalCore.position.z=3;this.mesh.add(petalCore)};var Forest=function(){this.mesh=new THREE.Object3D();this.nTrees=60;var stepAngle=Math.PI*2/this.nTrees;for(var i=0;i<this.nTrees;i++){var t=new Tree();var a=stepAngle*i;var h=605;t.mesh.position.y=Math.sin(a)*h;t.mesh.position.x=Math.cos(a)*h;t.mesh.rotation.z=a+(Math.PI/2)*3;t.mesh.position.z=0-Math.random()*600;var s=.3+Math.random()*.75;t.mesh.scale.set(s,s,s);this.mesh.add(t.mesh)}this.nFlowers=60;var stepAngle=Math.PI*2/this.nFlowers;for(var i=0;i<this.nFlowers;i++){var f=new Flower();var a=stepAngle*i;var h=605;f.mesh.position.y=Math.sin(a)*h;f.mesh.position.x=Math.cos(a)*h;f.mesh.rotation.z=a+(Math.PI/2)*3;f.mesh.position.z=0-Math.random()*600;var s=.1+Math.random()*.3;f.mesh.scale.set(s,s,s);this.mesh.add(f.mesh)}};var AirPlane=function(){this.mesh=new THREE.Object3D();var geomCockpit=new THREE.BoxGeometry(80,50,50,1,1,1);var matCockpit=new THREE.MeshPhongMaterial({color:Colors.red,shading:THREE.FlatShading});geomCockpit.vertices[4].y-=10;geomCockpit.vertices[4].z+=20;geomCockpit.vertices[5].y-=10;geomCockpit.vertices[5].z-=20;geomCockpit.vertices[6].y+=30;geomCockpit.vertices[6].z+=20;geomCockpit.vertices[7].y+=30;geomCockpit.vertices[7].z-=20;var cockpit=new THREE.Mesh(geomCockpit,matCockpit);cockpit.castShadow=true;cockpit.receiveShadow=true;this.mesh.add(cockpit);var geomEngine=new THREE.BoxGeometry(20,50,50,1,1,1);var matEngine=new THREE.MeshPhongMaterial({color:Colors.white,shading:THREE.FlatShading});var engine=new THREE.Mesh(geomEngine,matEngine);engine.position.x=40;engine.castShadow=true;engine.receiveShadow=true;this.mesh.add(engine);var geomTailPlane=new THREE.BoxGeometry(15,20,5,1,1,1);var matTailPlane=new THREE.MeshPhongMaterial({color:Colors.red,shading:THREE.FlatShading});var tailPlane=new THREE.Mesh(geomTailPlane,matTailPlane);tailPlane.position.set(-35,25,0);tailPlane.castShadow=true;tailPlane.receiveShadow=true;this.mesh.add(tailPlane);var geomSideWing=new THREE.BoxGeometry(40,4,150,1,1,1);var matSideWing=new THREE.MeshPhongMaterial({color:Colors.red,shading:THREE.FlatShading});var sideWingTop=new THREE.Mesh(geomSideWing,matSideWing);var sideWingBottom=new THREE.Mesh(geomSideWing,matSideWing);sideWingTop.castShadow=true;sideWingTop.receiveShadow=true;sideWingBottom.castShadow=true;sideWingBottom.receiveShadow=true;sideWingTop.position.set(20,12,0);sideWingBottom.position.set(20,-3,0);this.mesh.add(sideWingTop);this.mesh.add(sideWingBottom);var geomWindshield=new THREE.BoxGeometry(3,15,20,1,1,1);var matWindshield=new THREE.MeshPhongMaterial({color:Colors.white,transparent:true,opacity:.3,shading:THREE.FlatShading});var windshield=new THREE.Mesh(geomWindshield,matWindshield);windshield.position.set(5,27,0);windshield.castShadow=true;windshield.receiveShadow=true;this.mesh.add(windshield);var geomPropeller=new THREE.BoxGeometry(20,10,10,1,1,1);geomPropeller.vertices[4].y-=5;geomPropeller.vertices[4].z+=5;geomPropeller.vertices[5].y-=5;geomPropeller.vertices[5].z-=5;geomPropeller.vertices[6].y+=5;geomPropeller.vertices[6].z+=5;geomPropeller.vertices[7].y+=5;geomPropeller.vertices[7].z-=5;var matPropeller=new THREE.MeshPhongMaterial({color:Colors.brown,shading:THREE.FlatShading});this.propeller=new THREE.Mesh(geomPropeller,matPropeller);this.propeller.castShadow=true;this.propeller.receiveShadow=true;var geomBlade1=new THREE.BoxGeometry(1,100,10,1,1,1);var geomBlade2=new THREE.BoxGeometry(1,10,100,1,1,1);var matBlade=new THREE.MeshPhongMaterial({color:Colors.brownDark,shading:THREE.FlatShading});var blade1=new THREE.Mesh(geomBlade1,matBlade);blade1.position.set(8,0,0);blade1.castShadow=true;blade1.receiveShadow=true;var blade2=new THREE.Mesh(geomBlade2,matBlade);blade2.position.set(8,0,0);blade2.castShadow=true;blade2.receiveShadow=true;this.propeller.add(blade1,blade2);this.propeller.position.set(50,0,0);this.mesh.add(this.propeller);var wheelProtecGeom=new THREE.BoxGeometry(30,15,10,1,1,1);var wheelProtecMat=new THREE.MeshPhongMaterial({color:Colors.white,shading:THREE.FlatShading});var wheelProtecR=new THREE.Mesh(wheelProtecGeom,wheelProtecMat);wheelProtecR.position.set(25,-20,25);this.mesh.add(wheelProtecR);var wheelTireGeom=new THREE.BoxGeometry(24,24,4);var wheelTireMat=new THREE.MeshPhongMaterial({color:Colors.brownDark,shading:THREE.FlatShading});var wheelTireR=new THREE.Mesh(wheelTireGeom,wheelTireMat);wheelTireR.position.set(25,-28,25);var wheelAxisGeom=new THREE.BoxGeometry(10,10,6);var wheelAxisMat=new THREE.MeshPhongMaterial({color:Colors.brown,shading:THREE.FlatShading});var wheelAxis=new THREE.Mesh(wheelAxisGeom,wheelAxisMat);wheelTireR.add(wheelAxis);this.mesh.add(wheelTireR);var wheelProtecL=wheelProtecR.clone();wheelProtecL.position.z=-wheelProtecR.position.z;this.mesh.add(wheelProtecL);var wheelTireL=wheelTireR.clone();wheelTireL.position.z=-wheelTireR.position.z;this.mesh.add(wheelTireL);var wheelTireB=wheelTireR.clone();wheelTireB.scale.set(.5,.5,.5);wheelTireB.position.set(-35,-5,0);this.mesh.add(wheelTireB);var suspensionGeom=new THREE.BoxGeometry(4,20,4);suspensionGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0,10,0));var suspensionMat=new THREE.MeshPhongMaterial({color:Colors.red,shading:THREE.FlatShading});var suspension=new THREE.Mesh(suspensionGeom,suspensionMat);suspension.position.set(-35,-5,0);suspension.rotation.z=-.3;this.mesh.add(suspension)};var sky,forest,land,orbit,airplane,sun;var mousePos={x:0,y:0};var offSet=-600;function createSky(){sky=new Sky();sky.mesh.position.y=offSet;scene.add(sky.mesh)}function createLand(){land=new Land();land.mesh.position.y=offSet;scene.add(land.mesh)}function createOrbit(){orbit=new Orbit();orbit.mesh.position.y=offSet;orbit.mesh.rotation.z=-Math.PI/6;scene.add(orbit.mesh)}function createForest(){forest=new Forest();forest.mesh.position.y=offSet;scene.add(forest.mesh)}function createSun(){sun=new Sun();sun.mesh.scale.set(1,1,.3);sun.mesh.position.set(0,-30,-850);scene.add(sun.mesh)}function createPlane(){airplane=new AirPlane();airplane.mesh.scale.set(.35,.35,.35);airplane.mesh.position.set(-40,110,-250);scene.add(airplane.mesh)}function updatePlane(){var targetY=normalize(mousePos.y,-.75,.75,50,190);var targetX=normalize(mousePos.x,-.75,.75,-100,-20);airplane.mesh.position.y+=(targetY-airplane.mesh.position.y)*0.01;airplane.mesh.position.x+=(targetX-airplane.mesh.position.x)*0.01;airplane.mesh.rotation.z=(targetY-airplane.mesh.position.y)*0.003;airplane.mesh.rotation.x=(airplane.mesh.position.y-targetY)*0.0015;airplane.mesh.rotation.y=(airplane.mesh.position.x-targetX)*0.0015;airplane.propeller.rotation.x+=0.03}function normalize(v,vmin,vmax,tmin,tmax){var nv=Math.max(Math.min(v,vmax),vmin);var dv=vmax-vmin;var pc=(nv-vmin)/dv;var dt=tmax-tmin;return tmin+(pc*dt)}function loop(){if(!isPlaying)return;land.mesh.rotation.z+=.0004;orbit.mesh.rotation.z+=.0001;sky.mesh.rotation.z+=.0002;forest.mesh.rotation.z+=.0004;updatePlane();renderer.render(scene,camera);requestAnimationFrame(loop)}function handlePointerMove(event){var clientX=event.touches?event.touches[0].clientX:event.clientX;var clientY=event.touches?event.touches[0].clientY:event.clientY;var tx=-1+(clientX/WIDTH)*2;var ty=1-(clientY/HEIGHT)*2;mousePos={x:tx,y:ty}}function init(){createScene();createLights();createPlane();createOrbit();createSun();createLand();createForest();createSky();document.addEventListener("mousemove",handlePointerMove,false);document.addEventListener("touchmove",handlePointerMove,{passive:true});document.addEventListener("touchstart",handlePointerMove,{passive:true});window.addEventListener("pauseWallpaper",()=>isPlaying=false);window.addEventListener("playWallpaper",()=>{if(!isPlaying){isPlaying=true;loop()}});loop()}window.addEventListener("load",()=>{setTimeout(init,500);},false);<\/script></body></html>`;

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
    _id: 'html_aviator',
    url: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=1080', // Replace with a nice cartoon sky image
    thumbnail: 'https://images.unsplash.com/photo-1517482811403-125032338167?q=80&w=400',
    author: 'Toss Studio',
    type: 'interactive',
    category: { id: 'live', name: { en: 'Interactive' } },
    indexCode: AVIATOR_3D_CODE
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
