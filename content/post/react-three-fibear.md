---
author: "develobear"
date: 2020-10-29
slug: react-three-fibear
title: My take on react-three-fiber library
description: So I decided to try out the *react-three-fiber* library, and it was... fun. I did enjoy the result, however the building process was a bit tiring. Let's dive deeper into that.
weight: 10
tags: [code]
authorAvatar: /img/Bear-avatar.png
image: img/React-three-fibear/react-three-fibear.png
comments: true
---

## Short Intro

So I decided to try out the *react-three-fiber* library, and it was... fun. I did enjoy the result, however the building process was a bit tiring. Let's dive deeper into that.

First, you can check the project here:

➡️ https://thedevelobear.github.io/react-three-fibear/ ⬅️

React-three-fiber library itself is great. It lets you build declarative scenes with re-usable components. Also, the render loop lives outside of React, so using React doesn't influence the performance in comparison to pure three.js.
You can use all the elements provided by three.js, like *meshes*, *geometries* or *materials*, but...

What bugs me is that the documentation is limited in comparison to what react-three-fiber lets you do. For example, you can easily use a GLTF object exported from e.g. Blender or Maya, you can even use a compressed Draco version, but you need to import the GLTFLoader or DRACOLoader from the *three/examples/jsm/loaders*, and it's not documented anywhere.
Unless you find it somewhere, it's not that easy to use it. One more thing is that three.js components are rendered through a shadow dom, so they're accessed without import statements. You'll see the examples later in this post. 

Although the documentation lacks some key features it was a blast to write a 3d scene in React and run it in the browser.

## My project
### Bear
I wanted to give 3d modeling a shot, so I downloaded Blender, watched a few tutorials and created a model of a bear. What a surprise... LOL 😂

I then exported it to GLTF, used Google's Draco encoder and compressed it to DracoGLTF. 
In order to use a DracoGLTF object in my scene, I needed to use a *useLoader* hook from react-three fiber. It was as easy as that:

```jsx
const gltf = useLoader(
    GLTFLoader,
    "/DevelobearDraco.gltf",
    loader => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco-gltf/");
      loader.setDRACOLoader(dracoLoader);
    }
  );
```
In order to use the loader I also needed to add a decoder, as well as the object itself to my public directory.
After loading my gltf object, I needed to render it to the scene. In order to do that, we need to render the primitives, meshes and materials ourselves.
Luckily, there is a library to help us with that — it's called *@react-three/gltfjsx*. It spits out a jsx component that we can use in the scene. The component structure depends on the object itself, so here's an example from gltfjsx:
```jsx
import React from 'react'
import { useLoader } from 'react-three-fiber'
import { useGLTF } from '@react-three/drei/useGLTF'

export default function Model(props) {
  const { nodes, materials } = useGLTF('/model.gltf')
  return (
    <group {...props} dispose={null}>
      <group name="Camera" position={[10, 0, 50]} rotation={[Math.PI / 2, 0, 0]}>
        <primitive object={nodes.Camera_Orientation} />
      </group>
      <group name="Sun" position={[100, 50, 100]} rotation={[-Math.PI / 2, 0, 0]}>
        <primitive object={nodes.Sun_Orientation} />
      </group>
      <group name="Cube">
        <mesh material={materials.base} geometry={nodes.Cube_003_0.geometry} />
        <mesh material={materials.inner} geometry={nodes.Cube_003_1.geometry} />
      </group>
    </group>
  )
}

useGLTF.preload('/model.gltf')
```

As you can see there's a camera, sun and cube object from the model. Using react-three-fiber we can extract the parts to different, re-usable components.
In my project, I've extracted all the parts to separate components.

### Camera

As for the camera, I've used a default camera from react-three fiber with custom OrbitControls.

```jsx
const Controls = () => {
  const { camera } = useThree();
  const ref = useRef();
  useRender(() => ref.current.update());
  return (
    <orbitControls
      args={[camera]}
      ref={ref}
      enableZoom={false}
      enableKeys={false}
      minPolarAngle={Math.PI / 2.5}
      maxPolarAngle={Math.PI / 1.7}
      minAzimuthAngle={-Math.PI / 16}
      maxAzimuthAngle={Math.PI / 16}
      enableDamping
      dampingFactor={0.07}
    />
  );
};
```

I've adjusted polar and azimuth angles to limit the camera's rotation.

### Environment and stars

At that point, I've had a bear and camera movement done. I needed to create the environment.
I've decided to place the bear in the outer space, so the environment was quite easy to create. 

I've created a black environment:  

```jsx
const Environment = () => {
  return (
    <mesh>
      <sphereBufferGeometry args={[5, 10, 10]} attach="geometry" />
      <meshStandardMaterial color={0x000} attach="material" side={BackSide} />
    </mesh>
  );
};
```

After that, I've added stars with some movement — the code gets longer here, so feel free to check it in [my repo](https://github.com/thedevelobear/react-three-fibear/blob/master/src/components/Stars.js).

At that point the scene was only missing the logo and lighting, so I started to work on it.
The logo was as easy as creating a mesh with plane geometry and a meshPhongMaterial.

```jsx
    <a.group className="link"
      {...props}
      scale={[0.1 * size, 0.04 * size, 0.1]}
      {...spring}
      {...bindHover()}
      onClick={() => window.location.href = 'https://thedevelobear.com'}>
      <mesh
        args={[geometry, material]}
        position={[0, 1, -20]}
        receiveShadow
        castShadow
      >
        <planeGeometry ref={geometry} attach="geometry" />
        <meshPhongMaterial
          transparent
          ref={material}
          attach="material"
          map={logo}
        />
      </mesh>
    </a.group>
```

### Animations

As you can see, I've used {...spring} and {...bindHover()} spreads in the previous example — you may wonder why.
Those are used in order to create animations in my scene. Animations in react-three-fiber are created using *react-spring/three* and *react-use-gesture* libraries.
The *react-use-gesture* library is used in order to detect hover events on objects and *react-spring/three* is used for animations.

In order to animate objects in the scene, we need to use animated meshes, from *react-spring/three*: 
The example usage in my project looks like that:

```jsx
import { a, useSpring } from "react-spring/three";

 ...

  const [spring, setSpring] = useSpring(() => ({
    scale: [0.2, 0.2, 0.2],
    config: { mass: 3, friction: 40, tension: 800 }
  }));

  const bindHover = useHover(
    ({ hovering }) =>
      setSpring({ scale: hovering ? [0.25, 0.25, 0.25] : [0.2, 0.2, 0.2] }),
    {
      pointerEvents: true
    }
  );

 ...

  return (
    <a.group
      ref={group}
      {...props}
      {...spring}
      {...bindHover()}
      onClick={onBellyClick}
    >
```


### Lights and post-processing

Adding lights in react-three-fiber is easy too! You can create ambient lights, spotlights and point lights easily.

```jsx
const Lights = () => {
  return (
    <group>
      <ambientLight />
      <pointLight />
      <spotLight
        castShadow
        intensity={5}
        angle={Math.PI / 16}
        position={[10, 10, 10]}
        shadow-mapSize-width={4056}
        shadow-mapSize-height={4056}
      />
    </group>
  );
};
```

As for the post-processing, the situation gets complicated really quickly — especially considering the fact that I wanted to create a **noir** style in the outer space.
I might write a separate blog post just about post-processing, shaders etc. in the future, but for now, you can [check how I did the effects here](https://github.com/thedevelobear/react-three-fibear/blob/master/src/components/Effects.js).
## End result

<img src="/img/React-three-fibear/react-three-fibear.png" />

Developing the whole thing took me a while, but I'm satisfied with the result!

Feel free to click around:

➡️ https://thedevelobear.github.io/react-three-fibear/ ⬅️

## Summary

As you can see, the process itself is quite complicated, but I must say it's very satisfying, considering that you can access the 3d scenes everywhere — even on mobile phones!
If you're interested in web development, and I guess you are if you're reading this blog post, you must try react-three-fiber. Despite its downsides and the amount of googling during development, it's a hell of a ride! You need to try it 😊

If you got that far in this blog post — thank you! It means much to me! If you liked it, feel free to leave a comment below and keep having fun!
