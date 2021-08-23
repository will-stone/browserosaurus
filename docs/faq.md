# Frequently Asked Questions

## Which is the supported version of macOS?

I can only officially support the version of macOS that I am currently using,
which right now is 11.5.2.

## How do I set my favourite browser?

A favourite browser will open when the SPACE key is pressed. It will also move
to the front of the picker window, and therefore an easier target to click with
the mouse. You can set your favourite in the Preferences menu (found in the "B"
menubar icon).

## I would like to open a particular browser automatically for specific URLs.

Browserosaurus does not provide a method for automatically selecting browsers,
rather opting for the consistency that the picker window will show every time.
If you would like to be able to set rules, I highly recommend
[Finicky](https://github.com/johnste/finicky) by
[John Sterling](https://johnste.github.io/) which can very easily be used in
tandem with Browserosaurus, meaning the best of both worlds: a rules engine and
a graphical interface.

## The picker window is very slow to display.

The app needs to be running in the background for the picker window to show
immediately. You can confirm Browserosaurus is running by looking for the "B"
icon in the menubar. If Browserosaurus is not currently running, it can take a
few seconds until it is available. Each subsequently clicked link will open the
picker window promptly.

## I am clicking links in my browser but Browserosaurus does not show.

Only links clicked outside of browsers will open Browserosaurus. This is by
design.

## Does Browserosaurus collect any of my data and send it to an online service?

No.

## Not even the link I click?

No. The only outgoing call Browserosaurus makes is to check for an update.

## I installed or removed a browser but I am not seeing this updated in the picker window.

Browserosaurus checks for installed browsers when it is first opened. Clicking
the rescan button, in the Preferences menu, will trigger a new scan for
installed browsers.

## I have a browser that is not shown in the picker window, even after reloading Browserosaurus.

Browserosaurus only supports a
[select list](https://github.com/will-stone/browserosaurus/blob/master/src/config/apps.ts)
of browsers. Please ensure that Spotlight's indexing for applications is enabled
in the Spotlight settings, as this is required for Browserosaurus to find your
installed browsers.

## Why/how is this free?

Browserosaurus has by far been the most enjoyable project I have ever created
and this comes from the fact that I use it every day. Being a fan of open source
software, I thought I would share it with the world. If you love Browserosaurus
as much as I do, please consider sponsoring its future maintenance. Thank you.
