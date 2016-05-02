---
title: Grafana 2.0 Alpha & Preview
author: Torkel Ödegaard
published_on: February 10, 2015
---

As some of you already know, at least those who read the previous blog post [on the future of Grafana](http://grafana.org/blog/2015/01/12/grafana2-the-future-and-raintank.html),
we have been working on a backend for the Grafana 2.0 release. A backend is really essential if Grafana is to be able
to expand its capabilities to support alerting, PNG rendering of panels, and of course user managment and authentication.
A backend will also make it easier to install and get started with Grafana as you will no longer need to learn how to
configure nginx or deal with complex CORS issues for Graphite or OpenTSDB. Something that
many new users struggle with when setting up Grafana for the first time.

Grafana 2.0 has been long in the making but has seen accelerated progress in the last two months
thanks to my collegues at [Raintank](http://raintank.io), where we are working on building a nextgen open source
infrastructure monitoring platform.

![](blog/Grafana2_Preview_1.png)

## Code & Docker image
The Grafana 2.0 backend and frontend changes are now public in the [develop](https://github.com/grafana/grafana/tree/develop)
branch in the main grafana repository on Github. The readme on that branch contains instructions for how to build and run the
new backend. You can also try it using docker with a single line like this:

```
docker run -i -p 3000:3000 grafana/grafana:develop
```

There are no offical binary packages yet as there is still some work that needs
to be done before a beta release can be made. Grafana 2.0 is not ready for
production use yet. If you want to help please checkout out the develop branch
or try the docker image and submit feedback and bug reports on github!

There is no updated documentation for Grafana 2.0, that is one of the items we will work on
in the run up to a beta release.

You can also try out a preview build on [play.grafana.org/v2](http://play.grafana.org/v2), login with
guest/guest or you can signup. If you signup you will be automatically added as a Viewer to the main account.
This preview is automatically updated after each successful commit & build of the develop branch.

## The backend

The backend is written in Go and defaults to an embedded sqlite3 database so there is no dependency on
Elasticsearch for dashboards storage. If you are already using InfluxDB or Elasticsearch for dashboard
storage there is an import feature under the account page where you can import your existing dashboards.

### Panel rendering

The backend supports rendering any panel to a PNG image, this will enable some slick integration
in the future with services like Slack and Hipchat. When we eventually tackle alerting this feature
should also come in handy as we could provide images of related graphs along with alert notifications.

Currently the PNG rendering feature is a just a simple link in the share panel dialog.

### User & Account model

To support SaaS and larger Grafana installations we have added a User and Account model similar to
how Google Analytics has implemented this. Dashboards, data sources, etc are not tied to a specific user
but to an Account, users are linked to accounts with a specific Role (Admin, Editor, Viewer).

To simplify smaller Grafana setups you can configure Grafana to be in a single account mode where new user
signups are automatically assigned to a specific account. And you can also enable anonymous access if you
do not care about authentication or user managment at all.

Currently users can signup and login with a specified email/password or via Github or Google OAuth integration.
LDAP integration is in on the roadmap but not implemented yet.

## UI Changes
It was a big challange to modify the existing Grafana UI to accomodate more views like Profile, Account,
Datasources, Admin etc, without sacrificing the clean simple top navigation. We tried many alternatives
of sidebars and collapsable top top navbars.

![](animated_gifs/grafana2_sidenav_gif1.gif)

The above animated gif shows the sidebar we ended up with, as well as the new dashboard search dropdown.
We will continue to refine and polish this solution. For more on the creative process and details
on all the UI mockups and navigation alternatives we explored read this
[blog post by Matt Toback](https://blog.raintank.io/ux-the-long-road-to-the-shortest-path). Matt is lead
on customer experiance at [Raintank](http://raintank.io).

### Dashboard list panel
There is currently one new panel in Grafana 2.0 that can show the current user's starred dashboards as well
as a list of dashboards based on search query or dashboard tags.

![](blog/dashlist_panel_1.png)

There is a [github issue](https://github.com/grafana/grafana/issues/1449) for this new panel where feedback
would be greatly appreciated.

### Standalone mode
The frontend has been slighly changed to support a standalone mode where it can work mostly like Grafana has
in the past, that is without any backend. This mode is currently broken in the develop branch but will
be made functioning again before release. We belive that many Grafana users value the pure frontend (no backend)
nature of Grafana and we would hate to abandon or dissapoint this user group so we will try to support
a standalone mode and build as long as the interest is high and the complexity of supporting both is acceptable.
But it is likely that long term this standalone mode will be removed, but this is all up to user feedback.

### Beta
So stay tuned for a beta sometime early or mid March (if this goes as we hope).
Subscribe to newsletter to get notified.

<section class="newsletter">
  <form action="http://grafana.us8.list-manage.com/subscribe/post?u=2aeb5711db2aececc990be536&amp;id=5585d37ecc" method="post" id="mc-embedded-subscribe-form" name="mc-embedded-subscribe-form" class="validate" target="_blank">
    <row class="collapse">
      <div class="medium-10 columns">
        <input type="email" value="" name="EMAIL" class="email" id="mce-EMAIL" placeholder="email address">
      </div>
      <div class="medium-2 columns">
        <input type="submit" value="Subscribe" name="subscribe" id="mc-embedded-subscribe" class="button postfix">
      </div>
    </row>
  </form>
</section>

## Thanks to project sponsors
* [Squarespace](http://www.squarespace.com)
* [Dreamhost](http://www.dreamhost.com)
* [Demonware](http://www.demonware.net)
* [Mediamath](https://developer.mediamath.com/OpenSource)

