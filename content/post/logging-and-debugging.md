---
author: "develobear"
date: 2019-02-11
slug: logging-and-debugging
title: Logging and debugging in JavaScript. A few methods I use on a daily basis.
description: I wrote this article to share a few debugging and logging methods I tend to use on a daily basis. I hope that at least some of them aren’t as popular as _console.log_, at least among the ones that just begin their journey with JavaScript.
weight: 10
tags: [code]
authorAvatar: /img/Bear-avatar.png
image: img/Logging-and-debugging/BearLogging.png
comments: true
---

# A few methods I use on a daily basis.

I wrote this article to share a few debugging and logging methods I tend to use on a daily basis. I hope that at least some of them aren’t as popular as _console.log_, at least among the ones that just begin their journey with JavaScript.

## 1. console.log()

I think the _console.log_ method is pretty straight forward. However, if you’re new to web development, here is a quick description. The _console.log_ method is probably the most used utility developers use to debug their JavaScript. You can pass an object, string, number, array etc. as an argument and it will print its value to the console available in most modern browsers.

💡 Tip #1: When logging arrays, we can use the spread operator, so we don't need to click the array in console.

### Code example

```js
const elements = ["theDevelobear", { is: "a" }, ["great", "blog"]];

console.log(elements);
console.log(...elements);
```

Above code example would print the following output into the console.
<img src="/img/Logging-and-debugging/logelements.jpg" />

### The console.log trap

_console.log_ can sometimes be deceiving. What I mean is that what you see in the console can be something you wouldn't expect it to be. Consider the following code:

```js
const bear = { name: "Teddy" };
console.log(bear);
bear.name = "Bearnard";
console.log(bear);
```

What you would probably expect to see in the console is the first object containing the name "Teddy" and the second with the name "Bearnard". Let's see:

<img src="/img/Logging-and-debugging/teddybear.jpg" />

It seems right, but wait. Let's expand the objects:

<img src="/img/Logging-and-debugging/notteddybearatall.jpg" />

What?! 🤨

Told you — _console.log_ can sometimes be deceiving. What happend here is quite easy to understand and also quite easy to forget about. The _console.log_ method uses the value in the collapsed version and a reference to object when expanded.

### Stylish console.logs

Printing values to console is really useful, but the .log() method can do much more cool stuff. It takes a formatting string as a first argument, so you can place a _%c_ operator and pass a string with CSS styles as a second argument. This way you can make the values more visible, or display a message to users who are accessing the console on your production site (just like Facebook does).

💡Tip #2: You can use console.clear() in code to be sure that the message is printed at the top of the console.

### Code example

```js
const styles = [
  "border: 1px solid #3E0E02",
  "color: white",
  "padding: 20px",
  "background: -webkit-linear-gradient(#ee0979, #ff6a00)",
  "font-size: 1.5rem",
  "text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)",
  "box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset",
  "line-height: 40px",
  "text-align: center",
  "font-weight: bold"
].join(";");

console.clear();
console.log(
  "%c Are you sure you need to be here? Please visit https://example.com/faq to read more about security issues",
  styles
);
```

Following code will generate:

<img src="/img/Logging-and-debugging/myerror.jpg" />

Facebook console example:

<img src="/img/Logging-and-debugging/fberror.jpg" />

## 2. Use _debugger_ and feel like an embedded developer

What if you don't want to put console.logs everywhere? You can use the _debugger_.

It is a great tool that you can use to stop the execution of the script on certain lines (just like with breakpoints). You can place the _debugger_ keyword inside of your code, for example inside of function and the context of the method will be available in the javascript console in your browser. You'll also be able to see the values of variables available in the scope, step over to another function call, resume the execution and so on. Having some experience with debugging the STM32 C and Assembly code I must admit that using the _debugger_ feels simmilar (ten thousand times faster with all the hot reloading magic, but still simmilar).

It needs some getting used to, though.

### Example - _debugger_ basics

Let's say you have a function in your code which looks like this:

```js
const dummyFunc = () => {
  const a = 7;
  debugger;
  const b = a * 2;
  debugger;
  const c = b * 2;
  debugger;
};
```

After running your code, Chrome will stop the execution of the code on the first _debugger_. It will act like a breakpoint. It will also automatically open the "Sources" tab for you. There are a few useful things hidden inside.

<img src="/img/Logging-and-debugging/firstStep.jpg" />

The window on the top obviously shows the code that is running. We need it to keep track of where we are at the moment.

Below the code, we can see a Scope/Watch window. It is used to observe the values of our local variables as well as the ones from the global object (Window in my case).

After clicking Resume Script Execution button the code will start to run and pause on the second debugger.

<img src="/img/Logging-and-debugging/secondStep.jpg" />

Now we can see that the variables did update.

<img src="/img/Logging-and-debugging/thirdStep.jpg" />

The Watch window allows us to watch specific variables during the execution of the script.

## 3. console.assert()

You can use console.assert() to make assertions inside your code. It is really useful when you need to check whether some condition occurs and you don’t want to go through a list of true/false values or put additional "ifs" only to debug the app. Using _console.assert_ you can just throw a message when the assertion method returns false.

**Caution:** Keep in mind that falsy assertion in Node.js < v10.0.0 will throw an AssertionError and pause the execution of your app.

#### Code example

```js
console.assert(true, "This message will NOT be outputted");
console.assert(false, "This message WILL be outputted");
```

## 4. console.count()

If you don’t know this one and you develop React apps, you definitely should try it. console.count() method logs the number of times it was called. This function takes an optional string type argument which will be its title. In case you don’t provide the argument, it will display a message like “default - <count>”.

#### Code example

```js
console.count(); // returns "default: 1"
console.count("Sidebar component render count: "); // returns "Sidebar component render count: 1"

console.countReset(); // default: 0
console.countReset("Sidebar component render count: "); // Sidebar component render count: 0
```

This leads us to why I think you should know this method. It enables you to easily count the number of renders of each component you use. Of course, you can use a package for that, but if you’re a \#BundleSizeFreak then Tip #3 is for you.

💡Tip #3: You can simply put a console.count() inside of component’s render method and it will let you know if your components doesn’t re-render unnecessarily.

## 5. Turbo Console Log

<img src="/img/Logging-and-debugging/insert_log_message.gif" />

Unfortunately, this is not one of the methods from chrome's console (it would look really cool though — this.turboConsoleLog) but it is a great extension available to download from the [VSCode Marketplace](https://marketplace.visualstudio.com/items?itemName=ChakrounAnas.turbo-console-log). If you’re using VSCode like I do, you should really check it out. It enables you to log a variable by selecting it and pressing **ctrl+alt+L**. You can also configure it with a few settings:

- Log message prefix — this one is great! You can provide an emoji (like the one on the picture below) and the log will instantly become more visible in the console.

  <img src="/img/Logging-and-debugging/emoji.jpg" />

- Wrap log message — instead of providing an emoji at the beginning of the message, you can automatically wrap it like on the gif below.

  <img src="/img/Logging-and-debugging/wrapped.jpg" />

There are also a few keyboard shortcuts we can use to be more productive:

- **ctrl+alt+L** (L like log) — main shortcut that puts a console.log below,
- **alt + shift + C** (C like comment) — by pressing this combination you can comment out all console.logs inside a file.
- **alt + shift + U** (U like uncomment) — uncommenting all console.logs.
- **alt + shift + D** (D like delete) — deleting all console.logs from the file.

## 6. Be creative, add your own console methods

You can easily add your own methods and use them in your projects, just get creative and remember that it is meant to help you be more productive. You can create a _console.yolo_ method which will for example… see for yourself!

{{< tweet 1095072002984067072 >}}

#### Code example

```js
const styles = [
  "border: 1px solid #3E0E02",
  "color: white",
  "padding: 20px",
  "background: -webkit-linear-gradient(#61045f, #aa076b)",
  "font-size: 1.5rem",
  "text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)",
  "box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5), 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset",
  "line-height: 40px",
  "text-align: center",
  "font-weight: bold",
  "animation: anim 5s infinite;"
].join(";");
const sound = new Audio(
  "https://gitlab.com/jakub.szewczykk/develobear/raw/master/static/img/Logging-and-debugging/shooting_stars.mp3"
);

console.yolo = msg => {
  console.log("%c " + msg, styles);
  sound.play();
};

console.yolo("Only You Live Once");
```

Hey, one more thing. I’ve created the graphics with the help of www.vecteezy.com
