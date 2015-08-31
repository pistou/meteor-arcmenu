# arcmenu
Arcmenu is a package for Meteor to create Arc Menus.

## Demo
You can find a demo at http://arcmenu.meteor.com/

## Installation
Add arcmenu to your Meteor project

`$ meteor add pistou:arcmenu`

## How to use
Add menu to your template, like this:

```html
<template name="example">
    <div class="arcmenu">
        <a href="#" class="arcmenu-display">+</a>
        <ul class="arcmenu-menu">
            <li><a href="#">A</a></li>
            <li><a href="#">B</a></li>
            <li><a href="#">C</a></li>
            <li><a href="#">D</a></li>
        </ul>
    </div>
</template>
```

Then your initialize your menu like so:
```js
Template.example.onRendered(function () {
    $(".arcmenu").arcmenu();
});
```

##### Custom options
| Option        | Default       | Description                                           |
| ------------- | ------------- | ----------------------------------------------------- |
| Width         | 55px          | *(String)* Width of the main button                   |
| Height        | 55px          | *(String)* Height of the main button                  |
| angleStart    | 0             | *(Int)* Angle in degrees to position the firts item   |
| angleInterval | 45            | *(Int)* Angle in degrees to use between each item     |
| delay         | 50            | *(Int)*                                               |
| distance      | 100           | *(Int)* Distance between center and items             |
| show          | easeOutBack   | *(String)* Easing to use on show animation            |
| hide          | easeInBack    | *(String)* Easing to use on hide animation            |
| onOpen        | false         | *(function)* Callback function after opening menu     |
| onClose       | false         | *(function)* Callback function after closing menu     |
| iconRotation  | 225           | *(Int)* Rotation angle to apply on the main button    |
