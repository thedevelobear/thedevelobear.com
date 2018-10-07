---
author: "Develobear"
date: 2018-09-25
slug: 5-things-to-improve-performance
title: 5 things you can do to speed up your React app 🏎
weight: 10
tags: [code]
authorAvatar: /img/Bear-avatar.png
image: img/5-things-to-improve-performance/Bearmula_One.png
comments: true
---

## Short Intro
It is a well-known fact that people aren’t capable of using all the potential hidden inside their personal computers, laptops or even smartphones. Just stop for a second and look around: we have technology that is capable of things that we cannot possibly imagine, yet we struggle to create a website that doesn’t lag on the newest MacBook Pro or create an android app that won’t crash every now and then on an 8 gig snapdragon 845 smartphone. We have hundreds, or even thousands of times more computing power than people had when they reached the moon.

Fortunately, this won’t be another post that just nags about technology being ahead of us or our inability to fully use it’s potential, but there is one thing I just have to complain about: we are lazy enough to just be OK with it. We don’t even try to pursue it. **Most developers don’t think about the performance of their apps because they know that our devices are getting stronger and stronger every year.**

> “If you want to change the world, first change yourself” ~ every coach ever

That’s why I’m going to give you a few tips on how you can speed up your React apps and be proud that you at least tried.

## 1. Pure components
Pure components are probably the easiest ones to include in your app (you just need to add a few letters and voila). Change this:
```javascript
 class BearComponent extends Component {
    //...
 }
```
To this:
```javascript
 class BearComponent extends PureComponent {
    //...
 }
```

As you can see, the PureComponent looks pretty much like a normal Component on the outside but the key difference is that it handles the shouldComponentUpdate() method for you. When the props or state update, PureComponent will do a shallow comparison on them and update the state if necessary.

## 2. toUpdate || !toUpdate – shouldComponentUpdate?
The shouldComponentUpdate() method is a built-in lifecycle method in React Component that is invoked before every render except the initial one. Keep in mind that you can’t use this (or any other) lifecycle method in stateless functional components. They lack the lifecycle methods because they are just pure JavaScript methods that are mounted or can even be called directly.

### Prevent unnecessary re-renders

The easiest method to use this lifecycle hook is to simply return false when you are sure that the component doesn’t need to change throughout the lifespan of your app.

``` jsx
 class BearComponent extends PureComponent {
  shouldComponentUpdate (nextProps, nextState) {
    return false
  }
  render () {
    return <span>🐻</span>
  }
}
```
In this case we are sure that no matter what props we pass to this component, or what state changes we make, the component will just render a cute little bear, therefore we can tell React to render it only once.

### Check the props yourself

Imagine a scenario in which you need to re-render the BearComponent only if the “isPanda” prop is changed. It could be handled by PureComponent in this case, but there are cases in which we need to re-render the component based on a bunch of other props passed. For the sake of this tutorial being easy to understand I’ll use the easier form in this example:
```jsx
class BearComponent extends PureComponent {
  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.isPanda != this.props.isPanda;
  }
  render () {
    const {isPanda} = this.props
    return <span>{isPanda ? '🐼' : '🐻'}</span>
  }
}
```

You can do the same thing using HOCs — for example from the great [Recompose](https://github.com/acdlite/recompose) library.  It looks way cleaner with more props.

```jsx
@onlyUpdateForKeys(['isPanda', 'anotherProp'])
class BearComponent extends Component {
  render () {
    const {isPanda} = this.props
    return <span>{isPanda ? '🐼' : '🐻'}</span>
  }
}
```

### How to implement it in an existing app?

You can use [why-did-you-update](https://github.com/maicki/why-did-you-update) library, which notifies you when potentially unnecessary re-renders occur. You can use it by simply placing the code mentioned below and observing the console while using your app.

```jsx
import React from 'react';

if (process.env.NODE_ENV !== 'production') {
  const {whyDidYouUpdate} = require('why-did-you-update');
  whyDidYouUpdate(React);
}
```

It is really helpful when you need to realize what unnecessarily re-renders in your app and how you can prevent it.

## 3.  Use babel plugins for constant and inline elements
Babel has lots of plugins that can help developers in many ways. We’ll be focusing on ones that help us increase the performance.

### @babel/plugin-transform-react-constant-elements

> This plugin can speed up reconciliation and reduce garbage collection pressure by hoisting React elements to the highest possible scope, preventing multiple unnecessary re-instantiations.

The above quote from official [babeljs](https://babeljs.io/docs/en/babel-plugin-transform-react-constant-elements) site sounds a bit… sophisticated (just like their bazillion word plugin titles), but don’t worry. The average developer doesn’t even need to know what happens under the hood – just include this plugin in your babel config and enjoy.

### @babel/plugin-transform-react-inline-elements

React Inline Elements plugin converts JSX elements into object literals they are supposed to return. Note that this plugin should only be used in the production environment, because it skips important checks that happen in development mode, including propTypes and makes warning messages less developer friendly.
You can configure your plugins via .babelrc file
```js
{
  “plugins”: [
    “@babel/plugin-transform-react-constant-elements”,
    “@babel/plugin-transform-react-inline-elements”
  ]
}
```

## 4. Debounce input handlers
 A debounce function can be used to delay certain events so that they don’t get fired up every millisecond. For example, if you create a search input that fetches the suggestions you should debounce the fetching method so that you don’t call API every time the onChange event handler fires (users can type really fast). It will cause a bearly (😎) noticeable delay between typing and getting the suggestions, but it can significantly improve the overall performance.

```jsx
import debounce from 'lodash/debounce'
class SearchBar extends React.Component {
  constructor() {
    super()
	  this.handleChange = this.handleChange.bind(this)
    this.delayedAjaxCall = debounce(this.ajaxCall, 250)
  }

  ajaxCall(event) {
    //..some suggestions fetching logic
  }

  handleChange(event) {
    //Ensure that the event is not pooled
    event.persist()
    this.delayedAjaxCall(event)
  }

  render() {
    return (
      <div>
        <input onChange={this.handleChange}/>
      </div>
    )
  }
}
```

Another example could be when you have a window resize listener and want to change layouts when the window resizes. We all know that web pages often lag when you resize the browser window. You can prevent it by creating a debounced window resize handler which waits… let’s say 1 second before changing the layouts in your app.
```jsx
import React, { Component } from 'react'
import { Debounce } from 'react-throttle'
import WindowResizeListener from 'react-window-size-listener'

class App extends Component {
  render () {
    return (
      <div>
        <Debounce time='1000' handler='onResize'>
          <WindowResizeListener
            onResize={(windowSize) => this.props.handleResize(windowSize)}
          />
        </Debounce>
      </div>
    )
  }
}
```

## 5. Reduce bundle size
Reducing bundle size reduces the time needed to fetch our JavaScript code from server to client. It is really important because we don’t want our users to wait too long.

### We're up all night to get chunky

> “She's up all night 'til the sun
>
> I'm up all night to get some (performance improvements)
>
> She's up all night for good fun
>
> I'm up all night to get chunky.”
>
> ~ Daft Punk

Developers should minify and obfuscate their code before deploying it to production. This rule itself is perfectly fine and obvious to most developers; however what if the minified bundle is still big enough to cause delays while fetching it from the server? Simple minification is fine for smaller React apps, but if you see that fetching it takes too much time, you should take a look at code splitting, which is Webpack’s built-in feature. It breaks the JavaScript code into smaller chunks which are faster to deliver to client.

The code splitting topic is quite extensive and I could probably write a separate post about it, so as long as I don’t have one, you can use the guide from the official [Webpack docs](https://webpack.js.org/guides/code-splitting/).

### Check your imports

There is a really easy way to reduce bundle size by just checking your imports. When performing methods or components from 3rd party libraries, make sure you import only the things you need, not the whole library itself. For instance, if you’re using lodash and need the fill method, import it directly instead of calling it on lodash object:

```js
// Instead of this

import _ from ‘lodash’

let array = [1, 2, 3];
_.fill(array, '🐻');

// Do this

import fill from ‘lodash/fill’

let array = [1, 2, 3];
fill(array, '🐻');

```

## TL;DR

---
Use PureComponents or shouldComponentUpdate() lifecycle method to check whether the component should re-render or not. You can check unnecessary re-renders using [why-did-you-update](https://github.com/maicki/why-did-you-update) library.

---
Use @babel/plugin-transform-react-constant-elements and @babel/plugin-transform-react-inline-elements.

---
Debounce methods that are fired frequently, for example input change handlers with API calls.

---
Reduce bundle size by using code splitting (check [Webpack docs](https://webpack.js.org/guides/code-splitting/)) and importing methods and components directly.

---

## Summary

Let me just quote myself here…

> “Most developers don’t think about the performance of their apps because they know that our devices are getting stronger and stronger every year.”

If you read this post, or maybe you just looked through it briefly but decided to use some of the included tips, then you are not like “most developers”.  You’re probably not OK with the performance of your apps and you want to change something — that’s great, salute to you!

Of course there are many other ways to improve performance of your React apps, but hey, we all have to start somewhere, right? I might write part 2 when I find something worth mentioning here, but until then… have fun speeding up your apps!

Hey, one more thing. I've created the graphics with the help of <a rel="nofollow" target="_blank" href="https://vecteezy.com"> www.vecteezy.com</a>
