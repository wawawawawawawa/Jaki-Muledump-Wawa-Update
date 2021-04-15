====================== EDIT FOR EXALT ======================

[u]For MuleDump :[/u]

1) You need to use Jaki CORS extension ([Firefox version](https://addons.mozilla.org/en-US/firefox/addon/muledump-cors-adapter/) and [Chrome version](https://chrome.google.com/webstore/detail/jakcodexmuledump-cors-ada/iimhkldbldnmapepklmeeinclchfkddd)) or any CORS extension
2) Download my muledump version (but be careful, I don't have autoupdates, so don't download "latest release" from 2019 lol, just Code -> Download ZIP like in the pic below (aka, don't do red, but do green part)

![Download MD](https://i.imgur.com/h5Kru0D.png)

Also, this means that you need to re-download like that when I change stuff, as no autoupdate, so it won't tell you to download it again (just re-download if you have issue, I might have fixed it)

When you do re-download, keep your quickLaunch.ini file, that way you won't need to re-do the clientToken part if you use OCL

For OCL :
1) You need to install [AutoIt](https://www.autoitscript.com/cgi-bin/getfile.pl?autoit3/autoit-v3-setup.exe) and [AutoHotkey](https://www.autohotkey.com/) and get Current Version (NOT V2 Alpha)    
2) You need to change the path in the end of mulelogin.au3 (see below), the default value is C:\Program Files\MuleDump (you can edit it with notepad)

![mulelogin.au3](https://i.imgur.com/tGxL19O.png)

In my case, I need to change `FileChangeDir ("C:\Program Files\MuleDump\")` into `FileChangeDir ("D:\Desktop\Jaki-Muledump-Wawa-Update-master\")`

3) You need to reinstall mulelogin.au3
4) Go to muledump, then open quickLaunch.ahk, this will show an empty command prompt (it writes clientToken in quickLaunch.ini, you can verify the information is here)
5) Close the command prompt, you will get an error, it's fine (there's the clientToken, but not user/pass in the .ini yet)
6) Click on the arrow icon in Muledump to load your account! (now MD will write user/pass in the .ini, and since clientToken is there as well, everything is set!)

Errors :
1) Having minus sign ( - ) in user/pass breaks OCL, to fix
- You can remove - from user/pass :)
- Or you can go to quickLaunch.ini, add the remaining of your password there, and double click quickLaunch.ahk, this will skip muledump part (aka, put your user/pass inside the .ini)

2) Having "Token for different machine" error means I don't have the correct clientToken somehow, to fix
- Find your token by other means (fiddle for instance)
- Put the correct token inside quickLaunch.ini
- Reload Muledump and click the arrow icon

3) Some account are not loading! It shows undefined (or wrong) chest number in the account name, to fix
- Go to muledump/lib/muledump/
- There is a file called mule.js, and another file called mule_NO_INFO.js
- Replace the contents of mule.js with the one from mule_NO_INFO.js (you can also delete mule.js and rename mule_NO_INFO.js into mule.js :p)
- Refresh muledump
- Somehow some faulty accounts (that needs TOS or whatnot) make it so that I can't get correct number of chest, reload them with the NO_INFO file (perhaps need manual load as well to accept TOS, not sure), then you can put back the regular mule.js with the info on the account

Here the difference between the 2 files :

Regular mule.js :
![mule.js](https://i.imgur.com/hbCOGsC.png)
mule_NO_INFO.js :
![mule.js](https://i.imgur.com/tyN3eKS.png)

=======================================================

This is a fork from [Jaki MD](https://github.com/jakcodex), so I have put his README below.

The tweaks look like this :

Shiny Wawa Option Update (with Pet Integration!) :
![Wawa Option Update](https://i.imgur.com/PEyrxOW.png)

Dungeon Stats on your account :
![New Dungeon Stats](https://i.imgur.com/WvCCgbx.png)

Gift/Other Stats on your account :
![New Account Stats](https://i.imgur.com/q5K9HBb.png)

![Jakcodex/Muledump](https://img.shields.io/badge/jakcodex-muledump-blue.svg?style=flat-square)
[![Muledump Online](https://img.shields.io/badge/dynamic/json.svg?label=online&colorB=9e43f9&prefix=v&suffix=&query=$.version&uri=https%3A%2F%2Fjakcodex.github.io%2Fmuledump%2Fpackage.json)](https://jakcodex.github.io/muledump/muledump.html)
[![Muledump Preview](https://img.shields.io/badge/dynamic/json.svg?label=preview&colorB=5942f4&prefix=v&suffix=&query=$.version&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fjakcodex%2Fmuledump-preview%2Fmaster%2Fpackage.json)](https://jakcodex.github.io/muledump-preview/muledump.html)

## Welcome

This is a fork of Atomizer's [Muledump](https://github.com/atomizer) continuing the project into a new age.

You can read about the reasoning for a new fork in the [upstream notes](UPSTREAM.md).

## Synopsis

This tool allows you to list contents of all your accounts in a single page (characters, their stats and items, items in vaults). Also it generates a summary of all the items - you probably saw screenshots of these in trading forum ([example](https://imgur.com/dDA2vC9)).

The point of playing the game is to have fun. Muling is not fun. I am trying to increase overall fun ratio by decreasing amount of time spent fussing with mules and storagekeeping.

## Requirements

Currently due to how Deca handles requests to ROTMG servers a browser extension is required to use this Muledump.

See the [Requirements](REQUIREMENTS.md) page for more information.

### Head over to [Installation and Setup](https://github.com/jakcodex/muledump/wiki/Installation-and-Setup) in the wiki for a detailed setup guide.

## Release Information

The current version is Jakcodex/Muledump v9.5.

Muledump Online is available hosted on Github [here](https://jakcodex.github.io/muledump/muledump.html).

All released versions are available for download [here](https://github.com/jakcodex/muledump/releases).

## Muledump Online Version

- Open [https://jakcodex.github.io/muledump/muledump.html](https://jakcodex.github.io/muledump/muledump.html)
- Returning users can upload a backup or import their existing accounts.js file
- New users will be guided through first time setup
- This version runs entirely on your local computer and is updated automatically with new releases
- All user and account data submitted and stored in this version never leaves your computer

## Muledump Local Version

- Unzip the latest muledump release
- Open **`muledump.html`**
- First time users will be guided thru Muledump setup
- Returning users are ready to go immediately

## Main Features

- Manage all of your ROTMG accounts from a single interface
- [SetupTools](docs/setuptools/index.md) - An easy to use, browser-based user interface for managing Muledump
- [Groups Manager](docs/setuptools/help/groups-manager/manager.md) - Account grouping and ordering utility to customize the Muledump accounts list
- [Muledump Online](https://jakcodex.github.io/muledump/muledump.html) - Load Muledump directly from Github using SetupTools
- [One Click Login](https://github.com/jakcodex/muledump/wiki/One-Click-Login) - Login to your accounts via the browser or Flash Projector with one click
- [Storage Compression](https://github.com/jakcodex/muledump/wiki/Storage-Compression) - Store more data in the browser than previously possible
- [Muledump Totals](https://github.com/jakcodex/muledump/wiki/Totals) - Filtering on fame bonus, feed power, soulbound, tradeable, ut, and st, and specified accounts, and easy switching between pre-defined totals configs
- [White Bag Tracker](docs/muledump/whitebags.md) - Track your white bag collection the way you want to
- Skin Wardrobe - View all skins owned by your accounts
- MuleQueue - Task queuing to control the flow of requests from Muledump
- Vault display is fully customizable and comes with four pre-defined layouts
- Full character skin and dye support in portraits
- Character sorting by fame, exp, total fame, class, active time, maxed stats, and custom lists
- Custom character lists allow you to create custom Muledump account layouts showing only characters you specify
- Exporting works with the following modes: text, csv, json, image, imgur, paste
- Fully compliant with Deca rate limiting

## Not so obvious features

- click on item to filter accounts that hold it
- click on account name for individual options menu
- shift+click an account to filter totals display
- ctrl-click account name to temporarily hide it from totals
- ctrl-click on an item to open its Realmeye menu
- ctrl-click on two items to open the Realmeye Trading menu
- logins thru muledump count towards daily login calendar
- account settings include automatic reload, login-only (daily calendar only), and cache disable
- right click anywhere on a mule to access the mule menu
- active mulequeue can be resumed if muledump is closed
- See a full list of available actions at the [Keyboard and Mouse Controls](https://github.com/jakcodex/muledump/wiki/Keyboard-and-Mouse-Controls) wiki

## Check out the [Frequently Asked Questions](https://github.com/jakcodex/muledump/wiki/Frequently-Asked-Questions) and explore the [wiki](https://github.com/jakcodex/muledump/wiki) for more information!

[Steam Users Setup Guide](https://github.com/jakcodex/muledump/wiki/Steam-Users-Setup-Guide)

[Kongregate Users Setup Guide](https://github.com/jakcodex/muledump/wiki/Kongregate-Users-Setup-Guide)

<a id="jakcodex-supportandcontributions"></a>
## Support and Contributions

Jakcodex/Muledump operates its own Discord server - [https://discord.gg/JFS5fqW](https://discord.gg/JFS5fqW).

Feel free to join and ask for help getting setup, hear about new updates, offer your suggestions and feedback, or just say hi. We love to hear from the community!

If you encounter a bug, have a feature request, or have any other feedback you can also check out the [issue tracker](https://github.com/jakcodex/muledump/issues) to see if it's already being discussed. If not then you can [submit a new issue](https://github.com/jakcodex/muledump/issues/new).

If you are interested in helping test new versions of this software before release then check out [Muledump Preview](https://github.com/jakcodex/muledump-preview/) for the recent stable development builds of Muledump.

Feel free to submit pull requests or patches if you have any Muledump changes you'd like to contribute. See [Contributing](https://github.com/jakcodex/muledump/wiki/Contributing) for more information.

## Version and Update Information

Muledump versions are described as x.y.p where x is the major version, y is the minor version, and p is the patch version.

All version increments are published as an official Muledump Local release.

Muledump Online always runs the latest version of Muledump with all patches.

## Special Thanks

Muledump Renders are maintained by [tuvior](https://github.com/tuvior).

Thanks to [Atomizer](https://github.com/atomizer) for all the original Muledump work and for his [endorsement](https://github.com/atomizer/muledump#on-indefinite-hiatus-an-active-fork-is-here).

Thanks to [Wawawa](https://github.com/wawawawawawawa) for his progress tracking feature.

This project uses open source libraries from many projects. See our dependencies to check them out.

This project uses textures and animated graphics courtesy of [Loading.io](https://www.loading.io).

## FYI

The following paths are for Github Pages configuration and are not apart of the Muledump code: _layouts, assets, and _config.yml.

## Donations

People ask about donating to the Jakcodex/Muledump project rather frequently. This project has not been without its expenses, so your contributions are welcome and appreciated.

If you are so inclined, you can donate to one of these locations:

##### Paypal
paypal@jakcodex.io

##### Bitcoin
bitcoin:1FfFBFNcWuvZMFRvZ7K9byh341h7yJte2P

## Privacy Policy

Click to read more about our [Privacy Policy](privacy-policy.md).

## Jakcodex/Muledump License

Copyright 2018 [Jakcodex](https://github.com/jakcodex)

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

1. Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.

2. Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.

3. Neither the name of the copyright holder nor the names of its contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
