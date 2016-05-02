---
title: Timing is Everything. Editor Mode in Grafana 3.0 for the Clock Panel Plugin
author: Daniel Lee
published_on: April 15, 2016
---

In [part 1](http://grafana.org/blog/2016/04/08/clock-plugin-p1.html), I wrote a simple Clock Plugin. However, it's too simple to be usable for most people. In this post, I will show how to make this plugin customizable and at the same time explain more about how plugins can hook into Grafana. To make the clock panel more usable, we should be able to:

- choose a 12 or 24 hour clock
- set the background color
- set the font size
- set date/time formats 

Then after that we'll add some more features. Support for time zones and a countdown would be useful additions.

## Defaults

We define fields to be saved in Grafana by creating values on the panel object of the controller. You can see these values for any panel by choosing View JSON from the settings menu in Grafana. Here's an excerpt from the clock panel json (with some fields removed), the panel data is saved in the panels array:

```json
{
  "id": 4,
  "title": "Clock",
...
  "rows": [
    {
...
      "panels": [
        {
          "bgColor": "rgb(132, 151, 130)",
          "clockType": "24 hour",
```

In our code we can define panel data by first creating a JavaScript with the default values for the fields and then setting them on the panel object:

```javascript
const panelDefaults = {
  clockType: '24 hour',
  fontSize: '60px',
  fontWeight: 'normal',
  bgColor: null
};

constructor($scope, $injector) {
  super($scope, $injector);
  _.defaults(this.panel, panelDefaults);

  this.updateClock();
}
```

The Lodash function defaults, which is called in the code above: `_.defaults`, sets a default value only if the value is not already set. 

We can now use these fields in our controller or module.html template:

```html
<h2 style="font-size: {{ctrl.panel.fontSize}};">{{ctrl.time}}</h2>
```

But if we want our users to be able to change these panel values then we need to expose them in the Grafana editor.

## Editor Mode

When you click Edit on a panel, you open Editor mode. This is where we want to add in our options so that a user can customize the clock panel. Every panel has a general tab where you change the title and width etc. We will create a new editor tab beside the general tab with the clock specific options. We won't have to write much code for this new tab as the Grafana conventions mean all we need to is to hook up an Angular template with input fields and Grafana will take care of the rest. Grafana will automatically save the values to the dashboard json and load them without us writing any extra code.

## Using Events

To add our editor tab we will hook into the event model so that we can add the tab when the *init-edit-mode* event is triggered. The following code should be added to the constructor of the ClockCtrl class:

```javascript
this.events.on('init-edit-mode', this.onInitEditMode.bind(this));
```

Then we need to create a function called onInitEditMode. The tab is added by calling the controller function, addEditorTab. This function has two parameters; the tab name and the path to a html template for our new editor tab. It can be a bit tricky to figure out the path, the path name will be based on the id that is specified in the plugin.json file. In this case our plugin id is **grafana-clock-panel**. We need to create a new Angular template which we will call editor.html.

```javascript
onInitEditMode() {
  this.addEditorTab('Options', 'public/plugins/grafana-clock-panel/editor.html', 2);
}
```

## Editor HTML and CSS

In our editor.html we will now use Grafana css styles rather than our own. We don't really want to do anything custom here. It should look the same as other tabs in Grafana.

I'm using the [gf-form css class](https://github.com/grafana/grafana/blob/master/public/sass/components/_gf-form.scss) from Grafana. I have one row with a couple of columns (following the new style in Grafana 3.0). Each column is wrapped in a div like this:

```html
<div class="section gf-form-group">
 ```

Then each pair, label and field is wrapped in a div with a gf-form class.

```html
<div class="gf-form">
  <label class="gf-form-label width-8">Font Size</label>
  <input type="text" class="gf-form-input width-4" ng-model="ctrl.panel.fontSize" ng-change="ctrl.render()" ng-model-onblur>
</div>
```

Note that we there are some Angular attributes here. *ng-model* will update the panel data. *ng-change* will render the panel when you change the value. This change will occur on the onblur event due to the *ng-model-onblur* attribute. This means you can see the effect of your changes on the panel while editing.

![](blog/clock-panel-editor.png)

On the editor tab we use a drop down for 12/24 hour clock, an input field for font size and a color picker for the background color.

The drop down/select has its own *gf-form-select-wrapper* css class and looks like this:

```html
<div class="gf-form">
  <label class="gf-form-label width-9">12 or 24 hour</label>
  <div class="gf-form-select-wrapper max-width-9">
    <select class="input-small gf-form-input" ng-model="ctrl.panel.clockType" ng-options="t for t in ['12 hour', '24 hour', 'custom']" ng-change="ctrl.render()"></select>
  </div>
</div>
```

The color picker (or spectrum picker) is a component that already exists in Grafana. We use it like this for the background color:

```html
<spectrum-picker class="gf-form-input" ng-model="ctrl.panel.bgColor" ng-change="ctrl.render()" ></spectrum-picker>
```

## Editor Tab Finished

And that's it! It really is quite simple to create your own editor tab. To reiterate, this all ties together quite neatly. We specify properties and panel defaults in the constructor for ClockCtrl and these can then be changed in the editor. We don't have to do anything special to save the changes. Grafana takes care of that. 

One thing to be aware of  is that panel defaults are used the first time a panel is created to set the initial values of the panel properties. After the panel is saved then the saved value will be used instead. So beware if you update panel defaults they will not automatically update the property in existing panel. For example, if I set the default font size to 60px first and then in version 2 of the plugin change it to 50px, existing panels will still have 60px and only new panels will get the new 50px value.

## Clean up after $timeout

Now that we know about the event system, we can clean up a potential memory leak. We are using the Angular function $timeout which is a wrapper for setTimeout but that uses promises unlike the core setTimeout function. If we don't cancel it then it can potentially cause problems. We can listen to the *panel-teardown* event and call cancel to make sure the timeout promise gets destroyed.

We listen to the event in the constructor:

```javascript
this.events.on('panel-teardown', this.onPanelTeardown.bind(this));
```

And then call cancel on teardown:

```javascript
onPanelTeardown() {
  this.$timeout.cancel(this.nextTickPromise);
}
```

## Customization Complete!

We now have a fully functional panel that shows the time and updates every second. You can customize it and change colors and font sizes, as well as choosing between a 12 and 24 hour clock.

But am I satisfied? No! More features!

## More features - Countdown

It's always fun with a countdown to lunch or to launch of a new product. The countdown is very similar to our normal clock. It uses the current time as well and compares it to the end time. The difference between them is the countdown value.

```javascript
const now = moment();
const timeLeft = moment.duration(moment(this.panel.countdownSettings.endCountdownTime).diff(now));
```

It would also be nice to define the text that shows up when the countdown finishes. This is pretty easy. We need to add it in three places. First add a new default field in the ClockCtrl and then add the field to the editor html and lastly use the value in the module.html template.

There is some text formatting code too if you're interested then check out the [renderCountdown function in the ClockCtrl class on GitHub](https://github.com/grafana/clock-panel/blob/47ba362d8bd3696c93c4ac65ca28b0a9eb26906e/src/clock_ctrl.js#L94-L128).

Now we have a working countdown!

## More features - Simple Timezones

Next up timezones. I work in a distributed company and it would be great to know what the time is in New York, Seattle, Perth and Hawaii. Or to know what GMT time is right now (if your servers run on GMT/UTC).

This will be a simple implementation allowing the user to choose an offset from UTC or to just show local time. Remember that inputs have to be parsed to integer values as they are saved as strings.

```javascript
if (this.panel.offsetFromUtc) {
  now = moment().utcOffset(parseInt(this.panel.offsetFromUtc, 10));
} else {
  now = moment();
}
```
Now we have a customizable digital Clock Panel with the ability to show times from different time zones.

## Finished!

I think this is as far as I want to take Clock panel for the moment but I am of course open to Pull Requests and feature requests. You can find the [code on GitHub](https://github.com/grafana/clock-panel) and the Clock can be installed in Grafana with the Grafana CLI tool:

```shell
grafana-cli plugins install grafana-clock-panel
```

Hopefully this is useful to new plugin authors and please don't hesitate to ask questions if you get stuck.
