---
title: Grafana 3.0 Beta Released
author: Torkel Ödegaard
published_on: March 31, 2016
---

Today is the day! We are pleased to announce that Grafana 3.0 beta
is released along with a preview of [Grafana.net](http://grafana.net)! Since our last release
approximately 3 months ago, we’ve been extremely busy. This is the biggest
update to Grafana ever, with over 1500 commits by over 30 contributors.

Read on below to learn more about what’s new in 3.0 or:

<div class="text-center">
<a class="button secondary radius" href="/download">Download Grafana 3.0</a>.
<a class="button primary radius" href="http://play.grafana.org" target="_blank">Live Demo</a>.
</div>


## Release Highlights

### Commercial Support

Commercial Support subscriptions for Grafana are now [generally available](https://grafana.net/support/plans/).

Raintank is committed to a 100% open-source strategy for Grafana. We
do not want to go down the “open core” route. If your organization
finds Grafana valuable, please consider purchasing a subscription. Get
direct support, bug fixes, and training from the core Grafana team.

### Plugins

With the popularity of Grafana continuing to accelerate, it has been
challenging to keep up with all the requests for new features, new
panels, new data sources, and new functionality. Saying “no” so often
has been frustrating, especially for an open source project with such
a vibrant community.

The team felt that it was time to dramatically improve extensibility
through plugin support. Grafana 3.0 comes with a completely revamped
plugin SDK / API.

We’ve refactored our **Data Source** plugin architecture and added
two new plugin types:

* **Panel** plugins let you add new panel types for your Dashboards.
* **App** plugins bundle **Panels** plugins, **Data Sources** plugins,
Dashboards, and Grafana **Pages**. Apps are a great way to provide an
entire experience right within Grafana.

### Grafana.net

<img src="/assets/img/blog/v3.0/grafana_net_tour.png">

A preview of [Grafana.net](http://grafana.net) is launching along with this release. We
think it’s the perfect compliment to Grafana.

Grafana.net currently offers a central repository where the community
can come together to discover and share plugins (Data Sources, Panels,
Apps) and Dashboards for Grafana 3.0 and above.

We are also working on a hosted Graphite-compatible Data Source that
will be optimized for use with Grafana. It’ll be easy to combine your
existing Data Source(s) with this OpenSaaS option.

Finally, Grafana.net will also be a hub to manage all your Grafana
instances. You’ll be able to monitor their health and availability,
perform Dashboard backups, and more.

Grafana.net will officially launch along with the stable version of
Grafana 3.0, but <a href=http://www.grafana.net>check out the preview
and sign up for an account</a> in the meantime.


### grafana-cli

Grafana 3.0 comes with a new command line tool called grafana-cli. You
can easily install plugins from Grafana.net with it. For
example:


```
grafana-cli install grafana-pie-chart-panel
```

### Personalization & Preferences

The home dashboard, timezone and theme can now be customized on Organization
and user Profile level. Grafana can also track recently viewed dashboards, which
can then be displayed in the dashboard list panel.

### Improved Playlists

You can now save Playlists, and start them by using a Playlist URL. If
you update a running Playlist, it will update after its next cycle.

This is powerful as it allows you to remote control Grafana. If you
have a big TV display showing Grafana in your company lobby, create a
playlist named Lobby, and start it on the computer connected to the
Lobby TV.

You can now change the Lobby playlist and have the dashboards shown in
the Lobby update accordingly, automatically.

The playlist does not even have to contain multiple Dashboards; you
can use this feature to reload the whole Dashboard (and Grafana)
periodically and remotely.

You can also make Playlists dynamic by using Dashboard **tags** to
define the Playlist.

<img src="/assets/img/v3/playlist.png">

### Improved UI

We’ve always tried to focus on a good looking, usable, and responsive
UI. We’ve continued to pay a lot of attention to these areas in this
release.

Grafana 3.0 has a dramatically updated UI that not only looks better
but also has a number of usability improvements. The side menu now
works as a dropdown that you can pin to the side. The Organization /
Profile / Sign out side menu links have been combined into an on hover
slide out menu.

In addition, all the forms and the layouts of all pages have been
updated to look and flow better, and be much more consistent. There
are literally hundreds of UI improvements and refinements.

Here’s the new side menu in action:

<img src="/assets/img/v3/menu.gif">

And here's the new look for Dashboard settings:

<img src="/assets/img/v3/dashboard_settings.png">

Check out the <a href="http://play.grafana.org" target="_blank">Play
Site</a> to get a feel for some of the UI changes.

### Improved Annotations

It is now possible to define a link in each annotation. You can hover
over the link and click the annotation text. This feature is very
useful for linking to particular commits or tickets where more
detailed information can be presented to the user.

<img src="/assets/img/v3/annotation_links.gif">

### Prometheus, InfluxDB, and OpenTSDB improvements

All three of these popular included Data Sources have seen a variety
of improvements in this release. Here are some highlights:

####Prometheus

The Prometheus Data Source now supports annotations.

#### InfluxDB

You can now select the InfluxDB policy from the query editor.
<img src="/assets/img/v3/influxdb_policy.png">

Grafana 3.0 also comes with support for InfluxDB 0.11.

#### OpenTSDB

OpenTSDB 2.2 is better supported and now supports millisecond precision.

### Improved code, and reduced technical debt

The styling system has seen a massive update and clean-up. Grafana 1.x
and 2.x were built on a shaky and old style foundation based on
Bootstrap 2.3, followed by a Bootswatch dark theme, followed by many
custom overrides. This has been completely removed, and we have
switched to a modern and custom SASS based style foundation. In
addition, much of the code has been migrated to ES6 and Typescript.

These changes dramatically improve the maintainability  of the code
going forward.

#### Where’s alerting?

We are aware that many of you are waiting for the alerting feature,
and regrettably it didn’t make it into this beta.

While we understand that many are disappointed, and anxious to get
alerting in Grafana, the team strongly felt that improving
extensibility and addressing technical debt were more important in the
short term, and will give us a stronger base to build alerting on top
of. We have spent a lot of effort making sure that the code base
remains modern and of high quality.

We did not take this decision lightly, and hope that our users
understand the logic behind our choice. Once Grafana 3.0 stable is
released, we will be circling back on Alerting.

### Breaking changes

Dashboards from v2.6 are compatible; no manual updates should be necessary. There could
be some edge case scenarios where dashboards using templating could stop working.
If that is the case just enter the edit view for the template variable and hit Update button.
This is due to a simplification of the variable format system where template variables are
now stored without any formatting (glob/regex/etc), this is done on the fly when the
variable is interpolated.

* Plugin API: The plugin API has changed so if you are using a custom
data source (or panel) they need to be updated as well.

* InfluxDB 0.8: This data source is no longer included in releases,
you can still install manually from [Grafana.net](http://grafana.net)

* KairosDB: This data source has also no longer shipped with Grafana,
you can install it manually from [Grafana.net](http://grafana.net)

### CHANGELOG

For a detailed list and link to github issues for everything included
in the 3.0 release please view the
[CHANGELOG.md](https://github.com/grafana/grafana/blob/master/CHANGELOG.md)
file.
