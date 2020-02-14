---
author: "develobear"
date: 2020-02-13
slug: conditional-object-properties
draft: false
title: "Conditional object properties in JavaScript"
description: Add properties to objects conditionaly without if statements!
weight: 10
tags: [code]
authorAvatar: /img/Bear-avatar.png
image: img/Conditional-object-properties/conditional-object-properties.jpg
comments: true
---

## Intro

I’ve recently came upon a problem where I needed to conditionally add properties to an object. It’s not even that rare — there are plenty of API’s that require sending a field in payload only if it changed on the frontend. Don’t worry though, it’s easy to achieve.

Let’s say we have a following object:

```js
const payload = {
  name: "Bearnard"
};
```

We need to send only the fields that changed. Also, the API doesn’t account for _null_ values, so we’ll need to apply the properties and their new values conditionally (we can’t use conditions in object values, as they will still leave the property inside the object). There are a few ways to achieve that.

## if else

We could of course write and if statement like that:

```js
const payload = {};
if (nameChanged) {
  payload.name = "Beart";
}
```

We would need to create a separate if statement for each property in the entire object which can get a bit lengthy. Anyway, it is certainly very intuitive and easy to read.

## Spread operator

Using ES6 spread operator, we can achieve all of that within the object declaration. It would look like that:

```js
const payload = {
  ...(nameChanged && { name: "Beart" })
};
```

Using the …spread operator, we can apply new properties to our object on some condition. In this case I’ve used example Boolean, but we can use anything there — even functions that return truthy or falsy values:

```js
const payload = {
  ...(checkIfNameChanged() && { name: "Beart" })
};
```

This structure feels a bit more complicated at first, but the value that it brings is worth it. Also, I think that parentheses help for readability, but they aren’t required here.

`...(nameChanged && { name: 'Beart' })` works just like `...nameChanged && { name: 'Beart' }`

### How does it work?

If the condition evaluates to true, the expression will look like that:

`...(true && { name: 'Beart' })`

Knowing how logical AND operator (_&&_) works, we know, that it will be evaluated to:

`...({ name: 'Beart’ })`

which is basically and object spread in ES6. The result of that operation is just an object with name property inside.

However, if the name property hasn’t changed, the conditional statement will evaluate to false, meaning that the line would look like this:

`(false && { name: 'Beart' })`

The AND operator will ignore the object on the right, as the condition is falsy, so we’ll be left with

`…(false)`

which is then ignored by the spread operator (keep in mind that it will only work like that in object spread — not in the array spread). In the end we will be left with an empty object.

## TL;DR

Instead of:

```js
const payload = {};
if (newName !== oldName) {
  payload.name = newName;
}
if (newAge !== oldAge) {
  payload.age = newAge;
}
if (newHairColor !== oldHairColor) {
  payload.hairColor = newHairColor;
}
if (newCar !== oldCar) {
  payload.car = newCar;
}

API.post("/profile", payload);
```

you can do that:

```js
API.post("/profile", {
  ...(newName !== oldName && { name: newName }),
  ...(newAge !== oldAge && { age: newAge }),
  ...(newHairColor !== oldHairColor && { hairColor: newHairColor }),
  ...(newCar !== oldCar && { car: newCar })
});
```

Hey, one more thing. I’ve created the graphics with the help of www.vecteezy.com
