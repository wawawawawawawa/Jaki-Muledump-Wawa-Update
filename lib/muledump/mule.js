var iTotalFame;
var ATime = [];

// colors
var lightgreen = "#90ff90";
var darkgreen = "#00ff00";
var lightred = "#ff9090";
var darkred = "#ff0000";
var gold = "#fcdf00";

var check = 0;

var DungeonStatsHtml = [];

(function($, window) {

    var options = window.options;
    var accounts = window.accounts;
    var items = window.items;
    var classes = window.classes;

// max width of an account box in columns
    var ROW = ( setuptools.data.config.rowlength ) ? setuptools.data.config.rowlength : 7;
    var vaultlayout = ( setuptools.data.config.vaultlayout ) ? setuptools.data.config.vaultlayout : 0;

//  we'll prepare this later
    VAULTORDER = [];
    vaultwidth = ROW;
	///wawa init bug
	init_totals();
// dom snippet generators

    function stat(where, type, text) {
        return $('<strong class="stat">').addClass(type).text(text).appendTo(where);
    }

    function maketable(classname, items, row) {
        row = row || ROW;
        var $t = $('<table>').addClass(classname);
        var $row;
        for (var i = 0; i < items.length; i++) {
            if (i % row === 0) {
                if ($row) $t.append($row);
                $row = $('<tr>');
            }
            $('<td class="cont">').append(items[i]).appendTo($row);
        }
        if ($row) $t.append($row);
        var cols = items.length >= row ? row : items.length;
        cols = cols || 1;
        $t.css('width', '' + (184 * cols + 14 * (cols - 1)) + 'px');
        return $t;
    }

    var NUMCLASSES = 0;
    for (var i in classes) NUMCLASSES++;

    var STARFAME = [20, 500, 1500, 5000, 15000];
    var STARCOLOR = ['#8a98de', '#314ddb', '#c1272d', '#f7931e', '#ffff00', '#ffffff'];
    function addstar($t, d) {
        var r = 0;
        if (!d.Account.Stats || !d.Account.Stats.ClassStats) return;
        var s = d.Account.Stats.ClassStats;
        if (!s.length) s = [s];
        for (var i = 0; i < s.length; i++) {
            var b = +s[i].BestBaseFame || 0;
            for (var j = 0; b >= STARFAME[j] && j < 5; j++);
            r += j;
        }
        var $s = $('<span>').addClass('scont');
        $('<span>').text(r).appendTo($s);
        var $st = $('<span>').text('\u2605').addClass('star');
        $st.css('color', STARCOLOR[Math.floor(r / NUMCLASSES)] || 'lime');
        $st.appendTo($s);
		
        $s.appendTo($t);
        setuptools.app.ga('send', 'event', {
            eventCategory: 'stars',
            eventAction: r
        });
    }
	
	function addstarplus($t, d) {
        var r = 0;
        if (!d.Account.Stats || !d.Account.Stats.ClassStats) return;
        var s = d.Account.Stats.ClassStats;
        if (!s.length) s = [s];
        for (var i = 0; i < s.length; i++) {
            var b = +s[i].BestBaseFame || 0;
            for (var j = 0; b >= STARFAME[j] && j < 5; j++);
            r += j;
        }
        var $s = $('<span>').addClass('scont');
        $('<span>').text(r).appendTo($s);
        var $st = $('<span>').text('\u2605').addClass('star');
        $st.css('color', STARCOLOR[Math.floor(r / NUMCLASSES)] || 'lime');
        $st.appendTo($s);
		var $AccFame = $('<scont>').addClass('famegold').html(NumberFormat(d.Account.Stats.Fame, ',') + '  ');
		var $AccGold = $('<scont>').addClass('famegold').html(NumberFormat(d.Account.Credits, ',') + '  ');
		$AccFame.append('<img class="imgfamegold" src="lib/Fame.png"></img>');
		$AccGold.append('<img class="imgfamegold" src="lib/Gold.png"></img>');
		$AccFame.appendTo($s);
		$AccGold.appendTo($s);
		
        $s.appendTo($t);
        setuptools.app.ga('send', 'event', {
            eventCategory: 'stars',
            eventAction: r
        });
    }

    function addreloader(mule, target) {
        var button = $('<div class="button reloader">');
        button.text('\u21bb');
        if (mule.data) {
            var updated = new Date(mule.data.query.created);
            setuptools.app.muledump.tooltip(button, 'nomargin autoHeight', '<div style="font-size:1.2em">Last Updated: ' + updated.toLocaleString() + '</div>');
        }
		 // instantiate a date object
		 var dt = new Date();

		// dt.getMonth() will return a month between 0 - 11
		// we add one to get to the last day of the month 
		// so that when getDate() is called it will return the last day of the month
		 var month = dt.getMonth() + 1;
		 var year = dt.getFullYear();

		// this line does the magic (in collab with the lines above)
		 var daysInMonth = new Date(year, month, 0).getDate();
		 var daysLeft = daysInMonth - updated.toString().substring(8,10)
		 // console.log(daysLeft);
 
		if (options.wanotif && daysLeft <= options.notiftime)
		{
			if (check == 0)
			{
				prompt("Need to check calendar soon!", updated.toString().substring(0,15));
				check = 1;
			}
		}
        button.on('click.muledump.reloader', function(){
            setuptools.app.mulequeue.task.start(mule.guid);
        });
        button.appendTo(target);
    }

    function addmainbutton(mule, target) {
		
        //  reload button
        addreloader(mule, target);

        //  one-click login
        if ( window.mulelogin ) {

            // var l = $('<a>').addClass('button');
            // l.text('\u21d7');
            // l.attr('href', setuptools.app.muledump.mulelinkold(mule.guid));
			// setuptools.app.muledump.tooltip(l, 'nomargin autoHeight', '<div style="font-size:1.2em">Open Account</div>');
            // l.appendTo(target);
			
            var l2 = $('<a>').addClass('button');
            l2.text('\u21d7');
            // l2.text('\u26E8');
            l2.attr('href', setuptools.app.muledump.mulelink(mule.guid));
			setuptools.app.muledump.tooltip(l2, 'nomargin autoHeight', '<div style="font-size:1.2em">Open Exalt Account</div>');
            l2.appendTo(target);

        }

    }

    function addmulemenu(mule) {

        var menu = $('<div class="button muleMenu noselect">');
        menu.html('&#8801;');
		setuptools.app.muledump.tooltip(menu, 'nomargin autoHeight', '<div style="font-size:1.2em">Mule Menu</div>');
        menu.off('click.muledump.mulemenu').on('click.muledump.mulemenu', function (e) {
            setuptools.app.muledump.mulemenu(e, mule.guid, menu, menu, {
                option: 'pos',
                vpx: 26
            });
        });
        if ( setuptools.data.config.muleMenu === false ) menu.css({visibility: 'hidden', width: 0, height: 0});
        menu.appendTo(mule.dom);

        $('div.mule > div.name').off('contextmenu.muledump.mulemenu').on('contextmenu.muledump.mulemenu', function(e) {
            setuptools.app.muledump.mulemenu(e, mule.guid, menu);
        });

        mule.dom.off('contextmenu.muledump.mulemenu').on('contextmenu.muledump.mulemenu', function(e) {
            if ( $(e.target)[0].localName === 'img' && $(e.target)[0].className === 'portrait' ) return;
            setuptools.app.muledump.mulemenu(e, mule.guid, menu);
        });

    }

    //  xml to json
    function xmlToJson(xml) {

        // Create the return object
        var obj = {};

        //  element
        if (xml.nodeType === 1) {


            //  attributes are treated as keys
            if (xml.attributes.length > 0) {
                for (var j = 0; j < xml.attributes.length; j++) {
                    var attribute = xml.attributes.item(j);
                    obj[attribute.nodeName] = attribute.nodeValue;
                }
            }

            //  text
        } else if (xml.nodeType === 3) {
            obj = xml.nodeValue;
        }

        // do children
        if (xml.hasChildNodes()) {
            for(var i = 0; i < xml.childNodes.length; i++) {
                var item = xml.childNodes.item(i);
                var nodeName = item.nodeName;
                if (typeof(obj[nodeName]) === "undefined") {
                    obj[nodeName] = xmlToJson(item);
                    if ( nodeName === '#text' ) obj = obj[nodeName];
                } else {
                    if (typeof(obj[nodeName].push) === "undefined") {
                        var old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(xmlToJson(item));
                    if ( nodeName === '#text' ) obj = obj[nodeName];
                }
            }
        }

        return obj;
    }

// Mule object

    var Mule = function(guid) {

        if (!guid || !(guid in window.accounts)) return;
        var self = this;
        this.guid = guid;
        this.fails = 0;
        this.loaded = false;
        this.fresh = false;
        this.customSorting = false;
        this.shrunk = false;
        this.dom = $('<div class="mule">');
        if ( setuptools.app.muledump.totals.config.getKey('accountFilter').indexOf(this.guid) > -1 ) this.dom.addClass('filteringEnabled');
        this.dom.appendTo($('#stage')).hide();

        //  make sure no secondary account data caches are kept if the main data cache is missing
        if ( !localStorage[this.cache_id()] ) setuptools.app.muledump.cleanupDataForGuid(this.guid);

        //  prepare totals counter and import cache
        this.totals = new Muledump_TotalsCounter(this.guid, true, function(self) {

            //  we will skip importing if account filter is active and we're not on it
            if (
                setuptools.app.muledump.totals.config.getKey('accountFilter').length === 0 ||
                (typeof self === 'object' && typeof self.guid === 'string' && setuptools.app.muledump.totals.config.getKey('accountFilter').indexOf(self.guid) > -1)
            ) setuptools.tmp.globalTotalsCounter.import(self);

        });

        if ( Array.isArray(setuptools.data.options.disabled) === true && setuptools.data.options.disabled.indexOf(this.guid) > -1 ) {
            this.disabled = true;
            self.dom.toggleClass('disabled', this.disabled);
        }

        //  ctrl+click to disable/enable a mule
        this.dom.on('click.muledump.disableMule', ':not(.item)', function(e) {
            if (setuptools.app.muledump.keys('ctrl', e) === true && setuptools.app.muledump.keys('shift', e) === false) {
                self.disabled = !self.disabled;
                self.dom.toggleClass('disabled', self.disabled);
                if ( self.disabled === true && setuptools.app.muledump.totals.config.getKey('disabled').indexOf(self.guid) === -1 ) setuptools.app.muledump.totals.config.getKey('disabled').push(self.guid);
                if ( self.disabled === false && setuptools.app.muledump.totals.config.getKey('disabled').indexOf(self.guid) > -1 ) setuptools.app.muledump.totals.config.getKey('disabled').splice(setuptools.app.muledump.totals.config.getKey('disabled').indexOf(self.guid), 1);
                setuptools.app.muledump.totals.config.setKey('disabled', setuptools.app.muledump.totals.config.getKey('disabled'));
                setuptools.tmp.globalTotalsCounter.import(self.guid, self.disabled);
                setuptools.app.muledump.totals.updateSecondaryFilter();
				if ( setuptools.app.muledump.totals.config.getKey('sortingMode') === 'items' ) window.init_totals();
                window.update_totals();
                window.update_filter();
                option_updated('totals');
                return;
            }
        });

        //  adjust account filter on shift+click of the mule
        this.dom.on('click.muledump.mule', function(e) {

            if ( setuptools.app.muledump.keys('shift', e) === false || setuptools.app.muledump.keys('ctrl', e) === true ) return;

            //  add account to account filter
            if ( setuptools.app.muledump.totals.config.getKey('accountFilter').indexOf(self.guid) === -1 ) {

                self.dom.addClass('filteringEnabled');
                setuptools.app.muledump.totals.config.getKey('accountFilter').push(self.guid);
                setuptools.app.muledump.totals.config.setKey('accountFilter', setuptools.app.muledump.totals.config.getKey('accountFilter'));

                if ( setuptools.tmp.updateFilterTimer1 ) clearTimeout(setuptools.tmp.updateFilterTimer1);
                setuptools.tmp.updateFilterTimer1 = setTimeout(function() {
                    setuptools.tmp.globalTotalsCounter.import(self.guid);
                    setuptools.app.muledump.totals.updateSecondaryFilter();
					if ( setuptools.app.muledump.totals.config.getKey('sortingMode') === 'items' ) window.init_totals();
                    window.update_totals();
                    window.update_filter();
                    option_updated('totals');
                }, 1000);

            }
            //  remove account from account filter
            else {

                function updateFilter() {

                    setuptools.tmp.globalTotalsCounter.import();
                    setuptools.app.muledump.totals.updateSecondaryFilter();
					if ( setuptools.app.muledump.totals.config.getKey('sortingMode') === 'items' ) window.init_totals();
                    window.update_totals();
                    window.update_filter();
                    option_updated('totals');

                }

                self.dom.removeClass('filteringEnabled');
                setuptools.app.muledump.totals.config.getKey('accountFilter').splice(setuptools.app.muledump.totals.config.getKey('accountFilter').indexOf(self.guid), 1);
                setuptools.app.muledump.totals.config.setKey('accountFilter', setuptools.app.muledump.totals.config.getKey('accountFilter'));
                if ( setuptools.tmp.updateFilterTimer2 ) clearTimeout(setuptools.tmp.updateFilterTimer2);
                setuptools.tmp.updateFilterTimer2 = setTimeout(updateFilter, 1000);

            }

        });
    };

    Mule.prototype.opt = function(name) {
        var o = options[this.guid];
        if (o && name in o) {
            return o[name];
        }
        return options[name];
    };

    Mule.prototype.cache_id = function() {
        return 'muledump:' + this.guid
    };

    //
    Mule.prototype.log = function(s, cl) {
    };

    Mule.prototype.error = function(s, callback, options) {

        if ( typeof options !== 'object' ) options = {};

        //  don't show if errors are turned off
        if ( setuptools.data.config.errors === false ) return;

        //  build the message
        var self = this;

        //  if this account isn't set to loginOnly and there's no scrollHeight/width, then the dom isn't rendered
        //  in this situation we will forward the error to a lightbox
        if ( this.canParse !== true ) {
            setuptools.app.assistants.muledumperror(this.guid, s);
            return;
        }

        if ( this.errorBar instanceof jQuery ) {

            this.errorBar.html(' \
                <div class="flex-container">\
                    <div style="margin-right: 5px;">' + s + '</div> \
                    <div class="setuptools link errorAck menuStyle ack mr0 ml5" title="Dismiss" style="width: auto; height: auto; opacity: 1; border: 0; box-shadow: 0 0 0px 2px #000000;">Dismiss</div>\
                </div>\
            ');
            if ( setuptools.tmp.masonry ) setuptools.tmp.masonry.layout();

        }

        //  bind the acknowledgement button
        $('div.mule[data-guid="' + this.guid + '"] div.setuptools.link.errorAck').on('click.muledump.errorAck', function () {

            //  remove the bar
            if ( setuptools.data.config.animations === 1 ) {

                //  custom callback on click
                if ( typeof callback === 'function' ) callback();

                if ( options.action === 'removeall' ) {

                    self.dom.fadeOut(600, function() {
                        self.dom.remove();
                    });

                } else $(this).fadeOut(600, function () {
                    this.remove();
                });

                self.errorBar.slideUp(700, function () {
                    self.errorBar.show().text('');
                    if ( setuptools.tmp.masonry ) setuptools.tmp.masonry.layout();
                });

            } else {

                this.remove();
                self.errorBar.text('');
                if ( setuptools.tmp.masonry ) setuptools.tmp.masonry.layout();

            }

        });

    };

    //  complete a MuleQueue task
    Mule.prototype.queueFinish = function(guid, status, cache_only, errorMessage) {

        //  return a promise
        if ( typeof this.MuleQueue === 'function' ) {

            this.MuleQueue({
                state: 'finished',
                guid: guid,
                status: status,
                cache_only: cache_only,
                errorMessage: errorMessage
            });

        }

        if ( this.deleteAccount === true ) setuptools.app.config.userDelete(guid);

    };

    Mule.prototype.createCounter = function(cache, callback) {

        if ( typeof cache !== 'boolean' ) cache = false;
        if ( typeof callback !== 'function' && callback !== false ) callback = function(self) {

            if (
                setuptools.app.muledump.totals.config.getKey('accountFilter').length === 0 ||
                setuptools.app.muledump.totals.config.getKey('accountFilter').indexOf(self.guid) > -1
            ) {
                setuptools.tmp.globalTotalsCounter.import(self);
            }

        };
        setuptools.app.muledump.cleanupSecondaryCache(this.guid);
        this.totals = new Muledump_TotalsCounter(this.guid, cache, callback);

    };

    Mule.prototype.query = function(ignore_cache, cache_only, freshness, MuleQueue) {
        if ( !cache_only ) cache_only = false;
        if ( !freshness ) freshness = false;
        if ( setuptools.state.loaded === true && setuptools.app.config.validateFormat(setuptools.data.accounts, 1) === true && setuptools.data.accounts.accounts[this.guid].cacheEnabled === false ) {
            ignore_cache = true;
        }
        var self = this;
        if ( typeof MuleQueue === 'function' ) this.MuleQueue = MuleQueue;
        $('#accopts').hide().data('guid', '');

        // read from cache if possible
        if (!ignore_cache || ignore_cache === false ) {
            var c = '';
            try {
                c = setuptools.storage.read(this.cache_id(), true);
                c = JSON.parse(c);
            } catch(e) {}
            if (c) {

                //  users can specify a maximum age of cache data before reloading automatically
                var cacheStale = false;
                if (
                    (cache_only !== true || freshness === true) &&
                    setuptools.state.loaded === true &&
                    setuptools.app.config.validateFormat(setuptools.data.accounts, 1) === true &&
                    setuptools.data.config.autoReloadDays > 0 &&
                    setuptools.data.accounts.accounts[this.guid].autoReload === true
                ) {

                    //  let's convert the cache date to utc midnight of the same day
                    var date = new Date(c.query.created);
                    var utcCacheDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));
                    var cacheDate = utcCacheDate.getTime();
                    var currentDate = Date.now()-setuptools.tmp.timeOffset;
                    var cacheAge = Math.floor(((currentDate-cacheDate)/1000)/86400);
                    //setuptools.app.techlog('MuleQueue/CacheInfo age for ' + this.guid + ' is ' + ((currentDate-cacheDate)/1000).toFixed(0));
                    if ( cacheAge >= setuptools.data.config.autoReloadDays ) {

                        cacheStale = true;
                        window.techlog('MuleQueue/StaleCache found for ' + this.guid, 'string');
                        setuptools.app.ga('send', 'event', {
                            eventCategory: 'detect',
                            eventAction: 'staleCache'
                        });

                    }

                }

                //  users can disable cache data for specific accounts
                if (
                    setuptools.state.loaded === false ||
                    setuptools.app.config.validateFormat(setuptools.data.accounts, 0) === true ||
                    (setuptools.app.config.validateFormat(setuptools.data.accounts, 1) === true && setuptools.data.accounts.accounts[this.guid].cacheEnabled === true )
                ) {

                    //  parse the cache data as-is while we sort out what else to do
                    this.parse(c, true);

                    //  now we will enforce cache freshness
                    if ( cacheStale === false ) {

                        this.fresh = true;
                        if (cache_only === false) this.queueFinish(this.guid, 'cache');
                        return;

                    }

                }

            }

        }

        if ( cache_only === true ) return;

        var CR = { guid: this.guid };
        var pass = window.accounts[this.guid] || '';

        //  don't accept blank passwords
        if ( pass === '' ) {
            this.error("Password is empty");
            this.queueFinish(this.guid, 'error', false, 'Password is empty');
            return;
        }

        var platform = this.guid.split(':')[0];
		var magicWord = "";
        if (['kongregate', 'steamworks', 'kabam'].indexOf(platform) >= 0) {
            CR.secret = pass
			magicWord = "secret=" + encodeURIComponent(pass)
        } else {
            CR.password = pass
			magicWord = "password=" + encodeURIComponent(pass)
        }
        var realmApiURL = setuptools.config.appspotProd;
        if (
            setuptools.state.loaded === true &&
            setuptools.data.accounts.accounts[this.guid].testing === true
        ) realmApiURL = setuptools.config.appspotTesting;

        setuptools.app.uaTiming('mule', 'realmAPICharListGet', 'start', this.guid);
		
			function myCallBack(xml, textStatus, request) {
				if (xml.responseText === undefined || xml.responseText.match(/<AccessToken>(.+)<\/AccessToken>/) === null)
				{
					window.realmAPI(
						'/account/verify?' + $.param(setuptools.config.realmApiParams),
						CR,
						{url: realmApiURL},
						function(xhr) {
							xhr.done(onResponse).fail(onFail)
						}
					);
				}
				else
				{
					window.realmAPI(
						'char/list',
						// CR,
						{guid: this.guid, accessToken: xml.responseText.match(/<AccessToken>(.+)<\/AccessToken>/)[1]},
						{url: realmApiURL},
						function(xhr) {
							xhr.done(onResponse).fail(onFail)
						}
					);
				}

			function onFail(xhr) {

				setuptools.app.uaTiming('mule', 'realmAPICharListGet', 'cancel', self.guid);
				self.busy = false;
				self.fails++;
				setuptools.tmp.corsAttempts++;
				if ( self.fails < setuptools.config.muledump.corsMaxAttempts) {

					setTimeout(function() { self.query(true); }, 1000);

				} else {

					//  cors error have status code 0
					if ( xhr.status === 0 ) {

						self.queueFinish(self.guid, 'error', false, 'Could not connect to Appspot (CORS error?)');
						self.error('There was a problem connecting to ROTMG servers. <a href="#" class="setuptools link cors">Click here</a> for help.');
						$('.setuptools.link.cors').off('click.setuptools.corsAssistant').on('click.setuptools.corsAssistant', function () {
							setuptools.app.assistants.cors(true);
						});

						//  help the user with potential cors issues (maybe network, or otherwise) on first occurrence
						setuptools.app.assistants.cors();

						setuptools.app.ga('send', 'event', {
							eventCategory: 'detect',
							eventAction: 'corsError'
						});

						return;

					}

					if ( xhr.status > 0 ) {

						self.queueFinish(self.guid, 'error', false, 'Could not connect to Appspot due to HTTP Error ' + xhr.status);
						self.error('HTTP Error ' + xhr.status + ' was returned. <a href="' + setuptools.config.httpErrorHelp + '" target="_blank">Click here</a> for help.');
						setuptools.app.assistants.xhrError(xhr);
						setuptools.app.ga('send', 'event', {
							eventCategory: 'detect',
							eventAction: 'realmApiHttpError',
							eventLabel: xhr.status.toString()
						});

					}

				}

			}

			function onResponse(xml, textStatus, request) {

				setuptools.app.uaTiming('mule', 'realmAPICharListGet', 'stop', self.guid);

				//  check for the x-jakcodex-cors response header
				if ( setuptools.state.extension === undefined ) {

					if ( !request.getResponseHeader('X-Jakcodex-CORS') ) {

						setuptools.state.extension = false;
						setuptools.app.ga('send', 'event', {
							eventCategory: 'detect',
							eventAction: 'nonJakcodexCORS'
						});
						if (['chrome', 'opera', 'firefox'].indexOf(setuptools.browser) > -1) setuptools.app.muledump.notices.add('New CORS Extension Available', setuptools.app.assistants.jakcodexcors);

					} else {

						setuptools.state.extension = true;
						setuptools.app.ga('send', 'event', {
							eventCategory: 'detect',
							eventAction: 'isJakcodexCORS'
						});

					}

				}

				self.busy = false;
				parser = new DOMParser();
				date = new Date(Date.now()-( (typeof setuptools.tmp.timeOffset === 'number') ? setuptools.tmp.timeOffset : 0 ));
				window.techlog("Response from api: " + xml, "api");

				//  check for an error response
				if ( error = xml.match(/^<Error\/?>(.*?)<\/?Error>$/) ) {

					var errOpts = {};
					console.log('ERROR = ' + error + '   ' + error[1]);
					if ( error[1] === 'Account credentials not valid' ) {

						//  disabled invalid accounts
						if ( [0,4].indexOf(setuptools.data.config.badaccounts) > -1 ) {
							errOpts.action = 'removeall';
							setuptools.app.config.userToggle(self.guid);
						}

						//  delete invalid accounts
						if ( [2,5].indexOf(setuptools.data.config.badaccounts) > -1 ) {
							errOpts.action = 'removeall';
							self.deleteAccount = true;
						}

						self.queueFinish(self.guid, 'error', false, error[1]);
						self.error(error[1], undefined, errOpts);
						setuptools.app.ga('send', 'event', {
							eventCategory: 'detect',
							eventAction: 'invalidCredentials'
						});

					} else if ( error[1] === 'Internal error, please wait 5 minutes to try again!' ) {

						self.log("Your IP is being rate limited by Deca. Waiting 5 minutes to retry.");
						self.queueFinish(self.guid, 'rateLimited', 'Request was rate limited by Appspot');

						//  we'll not send any xhr requests for 5 minutes
						window.RateLimitExpiration = Date.now()+setuptools.data.mqRateLimitExpiration;

						try {
							localStorage['muledump:ratelimitexpiration'] = window.RateLimitExpiration
						} catch(e) {}
						
					} else if ( error[1] === 'Try again later' ) {

						self.log("Your IP is being rate limited by Deca. Waiting to retry.");
						self.queueFinish(self.guid, 'rateLimited2', 'Request was rate limited by Appspot');

						//  we'll not send any xhr requests for X minutes
						window.RateLimitExpiration2 = Date.now()+setuptools.data.config.mqBGTimeout;

						try {
							localStorage['muledump:ratelimitexpiration2'] = window.RateLimitExpiration2
						} catch(e) {}

					} else if ( error[1] === 'Account is under maintenance' ) {

						if ( setuptools.state.loaded === true && setuptools.data.accounts.accounts[self.guid].banned === false ) {
							setuptools.data.accounts.accounts[self.guid].banned = true;
							setuptools.app.config.save('Banned, boo!', true);
						}

						//  disabled banned accounts
						if ( [1,4].indexOf(setuptools.data.config.badaccounts) > -1 ) setuptools.app.config.userToggle(self.guid);

						//  delete invalid accounts
						if ( [3,5].indexOf(setuptools.data.config.badaccounts) > -1 ) self.deleteAccount = true;

						self.queueFinish(self.guid, 'error', false, error[1]);
						self.error("This account is banned - RIP");
						setuptools.app.ga('send', 'event', {
							eventCategory: 'detect',
							eventAction: 'accountBanned'
						});

					} else if ( error[1].match(/^Account in use/) ) {

						self.queueFinish(self.guid, 'error', false, error[1]);
						self.error("Account in use");
						setuptools.app.ga('send', 'event', {
							eventCategory: 'detect',
							eventAction: 'accountInUse'
						});

					} else {

						self.queueFinish(self.guid, 'error', false, error[1]);
						self.error(error[1]);
						setuptools.app.ga('send', 'event', {
							eventCategory: 'detect',
							eventAction: 'genericServerError'
						});

					}

					//  no errors, this is a good start
				} else {

					self.queueFinish(self.guid, 'ok');
					if ( setuptools.state.loaded === true && setuptools.data.accounts.accounts[self.guid].banned === true ) {
						setuptools.data.accounts.accounts[self.guid].banned = false;
						setuptools.app.config.save('Unbanned, hooray!');
					}
					if ( this.loginOnly === false ) self.errorBar.empty();
					
					// stupid way to fix IDs with #
					// as far as I know theres nowhere else a # can show up
					// xml = xml.replaceAll(/(\d+)#\d+/g, "$1");
					xml = xml.replace(/(\d+)#\d+/g, "$1");
					
					//  let's simulate a YQL response
					setuptools.app.uaTiming('mule', 'xmlToJson', 'start', self.guid, false, setuptools.app.uaTimingAggregate);
					var xmlParse = parser.parseFromString(xml, "text/xml");
					//console.log(xmlParse);
					var JSONData = xmlToJson(xmlParse);
					setuptools.app.uaTiming('mule', 'xmlToJson', 'stop', self.guid);
					JSONData.other = {
						maxCharNum: xmlParse.querySelectorAll('[maxNumChars]')[0].attributes['maxNumChars'].value,
						nextCharId: xmlParse.querySelectorAll('[nextCharId]')[0].attributes['nextCharId'].value
					};

					data = {
						query: {
							created: date.toISOString(),
							updated: date.toISOString(),
							results: JSONData
						},
						meta: {
							token: setuptools.config.actoken,
							version: $.extend(true, {}, setuptools.version)
						}
					};

					var res = data.query.results;
					window.techlog("Response data for " + self.guid, 'api');
					window.techlog(JSON.stringify(data, null, 5), 'api');

					if (res.Error) {
						self.error("server error");
						window.techlog('Server error processing ' + self.guid + ': ' + JSON.stringify(data, null, 5), 'verbose');
						return;
					}

					function watchProgress(percent) {
						if (typeof percent !== 'string') {
							self.error('migration failed');
							return
						}
						if (percent === '100') {
							self.reload();
							return
						}
						self.log('migration: ' + percent + '%');
						window.realmAPI('migrate/progress', CR, function (xhr) {
							xhr.fail(onFail).done(function (data) {
								date = new Date();
								data = {
									query: {
										created: date.toISOString(),
										updated: date.toISOString(),
										results: xmlToJson(parser.parseFromString(data, "text/xml"))
									}
								};
								var res = data && data.query && data.query.results;
								var per = res.Progress && res.Progress.Percent;
								watchProgress(per);
							})
						})
					}

					if (res.Migrate) {
						self.log('attempting migration');

						window.realmAPI('migrate/doMigration', CR, {url: true, type: 'migration'}, function () {
							watchProgress('0')
						});
						return
					}

					if ( !res.Chars ) return;

					res = res.Chars;

					if ('TOSPopup' in res) {
						window.realmAPI('account/acceptTOS', CR, {url: true, type: 'tos'})
					}

					if (res.Account && res.Account.IsAgeVerified !== "1") {
						CR.isAgeVerified = 1;
						window.realmAPI('account/verifyage', CR, {url: true, type: 'ageVerify'})
					}

					//  reinitialize totals counting for this mule before parsing
					self.createCounter();

					self.parse(data, false);
				}
			}
		}
		$.ajax({
			dataType:"text",
			url: "https://www.realmofthemadgod.com/account/verify?" + $.param(setuptools.config.realmApiParams),
			method: "POST",
			data: "guid=" + encodeURIComponent(this.guid) + "&" + magicWord + "&clientToken=0",
			complete: myCallBack,
			error: setuptools.app.assistants.xhrError,
			timeout: setuptools.config.realmApiTimeout
		})
    };

    Mule.prototype.reload = function() {

        this.fails = 0;
        if (this.overlay) this.overlay.find('.log').empty();
        if (window.RateLimitExpiration >= Date.now()) {
            this.query(false, true);
        } else {
            this.query(true);
        }

    };


    var PROPTAGS = 'ObjectType Level Exp CurrentFame'.split(' ');
    var STATTAGS = 'MaxHitPoints MaxMagicPoints Attack Defense Speed Dexterity HpRegen MpRegen'.split(' ');
    var STATABBR = 'HP MP ATT DEF SPD DEX VIT WIS'.split(' ');
    Mule.prototype.parse = function(data, skipCacheWrite) {

        this.canParse = true;
        if ( !skipCacheWrite ) skipCacheWrite = false;

        //  calculate some account statistics
        function calculateStatTotals(data, guid) {

            var ign = '';
            var char = [];

            result = {
                TotalFame: 0,
                TotalExp: 0,
                TotalDeathFame: 0,
                TotalDeathExp: 0,
                TotalGifts: 0,
                TotalChars: 0,
                TotalActive: 0,
                TotalChests: 1,
				//wawa
				TotalOryx: 0,
				TotalTiles: 0,
				//wawa
                CacheAge: 0,
                ign: ( typeof data.Account === 'object' ) ? data.Account.Name : ''
            };

            //  determine cache age
            var date = new Date(q.created);
            var cacheDate = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0));
            result.CacheAge = Math.floor(((Date.now()-cacheDate.getTime())/1000)/86400);

            //  count chests
            var chests = d.Account.Vault ? d.Account.Vault.Chest || ['-1'] : ['-1'];
            if ( Array.isArray(chests) ) {
                result.TotalChests = chests.length;
            } else if ( typeof chests === 'object' || typeof chests === 'string' ) {
                result.TotalChests = 1;
            }

            //  single character account
            if (
                typeof data.Char === 'object' &&
                typeof data.Char.Account === 'object' &&
                typeof data.Char.Account.Name === 'string'
            ) {

                char.push(data.Char);

            }
            //  multiple character account
            else if (
                typeof data.Char === 'object' &&
                data.Char.length > 0
            ) {

                char = data.Char;

            }

            //  add up the numbers
            for ( x = 0; x < char.length; x++ ) {
                var stats = readstats(char[x].PCStats); //id 20
                result.TotalActive += Number(stats[20]);
				result.TotalOryx += Number(stats[11]);
				result.TotalTiles += Number(stats[3]);
            }

            //  let's reduce this as much as possible
            var TimeActive = result.TotalActive/60;
            var ActiveSuffix = ' hours';
            TimeActive = Math.floor(TimeActive);
            result.TotalActive = TimeActive + ActiveSuffix;

            //  calculate gift stats
            if ( typeof data.Account.Gifts === 'string' ) result.TotalGifts = data.Account.Gifts.split(',').length;

            //  calculate fame and exp stats
            if ( typeof data.Char !== 'undefined' ) {

                //  if the user has multiple characters this will be an array
                if (data.Char.length) {

                    result.TotalChars = data.Char.length;
                    for ( var i = 0; i < data.Char.length; i++ ) {

                        result.TotalFame = Number(result.TotalFame) + Number(data.Char[i].CurrentFame);
                        result.TotalExp = Number(result.TotalExp) + Number(data.Char[i].Exp);
                        result.TotalDeathFame += data.Char[i].muledump.TotalFame || 0;
                    }

                    //  otherwise it is an object
                } else {

                    result.TotalChars = Number(1);
                    result.TotalFame = Number(result.TotalFame) + Number(data.Char.CurrentFame);
                    result.TotalExp = Number(result.TotalExp) + Number(data.Char.Exp);
                    result.TotalDeathFame += data.Char.muledump.TotalFame || 0;
                }

            }

            //  format last gold purchase date
            result.LastGoldPurchase = "N/A";
            if ( typeof data.SalesForce.last_purchase_date === 'string' ) result.LastGoldPurchase = data.SalesForce.last_purchase_date;
            if ( result.LastGoldPurchase.indexOf(':') > -1 ) result.LastGoldPurchase = result.LastGoldPurchase.substr(0, result.LastGoldPurchase.length-3);

            return result;

        }

        if (this.overlay) this.overlay.hide();

        if ( setuptools.state.loaded === true ) ROW = setuptools.data.config.rowlength;

        function parseQueryString(queryString) {
            var query = {};
            var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
            for (var i = 0; i < pairs.length; i++) {
                var pair = pairs[i].split('=');
                query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
            }
            return query;
        }

        //  start parse timer
        setuptools.app.uaTiming('mule', 'parse', 'start', this.guid, false, setuptools.app.uaTimingAggregate);

        //  shortcut
        var self = this;
        var d = data.query.results.Chars;
        var q = data.query;

        //  store the updated server list if it is present
        if ( typeof d.Servers === 'object' && typeof d.Servers.Server === 'object' && typeof d.Servers.Server.push === 'function' )
            setuptools.storage.write('ServerList', JSON.stringify(d.Servers.Server, true, 5));

        //  we only need the following information
        //  use this to see full xml contents
        //  console.log(parser.parseFromString(xml, "text/xml"));
        if ( !d.OwnedSkins ) d.OwnedSkins = [];
        if ( !d.SalesForce ) d.SalesForce = {lifetime_spend: "0"};
        d = {
            Char: d.Char,
            Account: d.Account || {},
            OwnedSkins: ( typeof d.OwnedSkins === 'object' && typeof d.OwnedSkins.push === 'function' ) ? d.OwnedSkins : (
                ( typeof d.OwnedSkins === 'object' ) ? [] : d.OwnedSkins.split(',')
            ),
            SalesForce: ( typeof d.SalesForce === 'object' ) ? d.SalesForce : (
                ( d.SalesForce === "undefined" ) ? {} : parseQueryString(atob(d.SalesForce))
            )
        };

        //  reset the cache object for storage
        data.query.results.Chars = d;

        this.data = data;
        this.dom.hide().empty();
        this.overlay = null;

        //  moved up here because we're modifying the structure to add sort keys and such

        var carr = [];
        if (d.Char) { // stupid array/object detection
            if (!d.Char.length) carr = [d.Char]; else carr = d.Char;
        }
		///wawa start
		// console.log(carr);
		var arr = [];
		var ClassList = { Rogue: {Num: 0}, Archer: {Num: 0}, Wizard: {Num: 0}, Priest: {Num: 0}, Warrior: {Num: 0}, Knight: {Num: 0}, Paladin: {Num: 0}, Assassin: {Num: 0}, Necromancer: {Num: 0}, Huntress: {Num: 0}, Mystic: {Num: 0}, Trickster: {Num: 0}, Sorcerer: {Num: 0}, Ninja: {Num: 0}, Samurai: {Num: 0}, Bard: {Num: 0}, Summoner: {Num: 0}, Kensei: {Num: 0} };
		var CharNumData = [];
		var BaseFameTotal = Number(0);
		var DeadFameTotal = Number(0);
		//wawa end
        //  add keys for sorting
        for ( var i in carr ) {

            if (carr.hasOwnProperty(i)) {

                if (typeof carr[i].muledump === 'undefined') carr[i].muledump = {};

                //  add ClassName
                carr[i].muledump.ClassName = ( typeof carr[i].ObjectType && Array.isArray(classes[carr[i].ObjectType]) === true ) ? classes[carr[i].ObjectType][0] : '????';

                //  record FirstSeen
                setuptools.app.muledump.charSeen(self.guid, carr[i].id);

                //  add TotalFame
                var fame = Number(carr[i].CurrentFame);
                for (var k in bonuses) {

                    if (bonuses.hasOwnProperty(k)) {

                        var b = bonuses[k](readstats(carr[i].PCStats), carr[i], d, fame);
                        if (!b || b === -1) continue;
                        var incr = 0;
                        if (typeof b === 'object') {
                            incr += b.add;
                            b = b.mul;
                        }
                        incr += Math.floor(fame * b);
                        fame += incr;

                    }

                }
                carr[i].muledump.TotalFame = fame;

                //  add ?/8
                carr[i].muledump.MaxedStats = 0;
                for (var t = 0; t < STATTAGS.length; t++) {
                    var s = carr[i][STATTAGS[t]] || 0;
                    var carrcl = classes[carr[i].ObjectType];
                    if(carrcl && parseInt(s) === carrcl[3][t]){
                        carr[i].muledump.MaxedStats++;
                    }
                }

                //  add value
                carr[i].muledump.CharValue = setuptools.app.muledump.value.char(this.guid, carr[i].id, true);

            }

        }

        // write cache (even with cacheEnabled===false we'll still write it; just won't use it on reload)
        if ( skipCacheWrite !== true ) {

            try {
                window.techlog('Muledump/DataCache writing to ' + this.cache_id());
                setuptools.app.uaTiming('mule', 'writeAccountDataCache', 'start', this.guid, false, setuptools.app.uaTimingAggregate);
                setuptools.storage.write(this.cache_id(), data, true);
                setuptools.app.uaTiming('mule', 'writeAccountDataCache', 'stop', this.guid);
            } catch (e) {

            }

        }

        //  add ign to the user account object
        if (
            setuptools.state.loaded === true &&
            setuptools.app.config.validateFormat(setuptools.data.accounts, 1) === true &&
            setuptools.app.config.userExists(this.guid) === true &&
            typeof d.Account === 'object' &&
            typeof d.Account.Name === 'string' &&
            d.Account.Name.length > 0
        ) setuptools.data.accounts.accounts[this.guid].ign = d.Account.Name;

        //  if this account is marked login-only then we are done
        this.loginOnly = false;
        if (
            setuptools.state.loaded === true &&
            setuptools.app.config.validateFormat(setuptools.data.accounts, 1) === true &&
            setuptools.data.accounts.accounts[this.guid].loginOnly === true
        ) this.loginOnly = true;

        var f = false;
        var arr = [];
        var CountingCharList = carr;

        if ( this.loginOnly === false ) {

            this.dom.attr('data-guid', this.guid);

            //  display guid
            if (this.opt('email')) {
                $('<input type="text" readonly="readonly">').addClass('guid').val(this.guid).appendTo(this.dom);
                $('<br>').appendTo(this.dom);
            }

            //  error bar
            this.errorBar = $('<div>').addClass('errorBar stickynotice').css({'font-size': '12px'});
            if (setuptools.data.config.animations < 1) this.errorBar.addClass('AReduced');
            this.errorBar.appendTo(this.dom);

            addmainbutton(this, this.dom);
            addmulemenu(this);
			
			///dungeon stats
			var dungeonbutton = $('<div class="button dungeon"></div>');
			dungeonbutton.text('\u2713');
			dungeonbutton.appendTo(this.dom);
			// dungeonbutton.click(function (e) {
				// setuptools.lightbox.create('dungeon', DungeonStatsHtml.join(''));
				// setuptools.lightbox.build('dungeon', DungeonStatsHtml.join(''));
				// setuptools.lightbox.display('dungeon');
			// });

            //  check if email address is verified (but skip steamworks/kongregate/etc)
            if (!('VerifiedEmail' in d.Account) && !this.guid.match(/(?:\:)/)) {
                var $warn = $('<span class="button warn">').text('!!');
                $warn.attr('title', 'email not verified').appendTo(this.dom)
            }

            d.Account = d.Account || {};
           if ((this.opt('accountName') === false))
			{
				d.Account.Name = '&nbsp;';
				var $name = $('<div>').addClass('name').html(d.Account.Name || '(no name)');
			}
			else
			{
				var extraName = this.opt('extraName');
				if (extraName === 'Name' || extraName === 'Stars' || extraName === 'Stars+')
				{
					var $name = $('<div>').addClass('name').html(d.Account.Name || '(no name)');
				}
				if (extraName === 'Extra' || extraName === 'All')
				{
					var $name = $('<div>').addClass('name').html(d.Account.Name + ' : ' + ((d.Char != undefined ? (d.Char.length != undefined ? d.Char.length + ' / ' + ((data.query.results.other) ? data.query.results.other.maxCharNum : 'N/A') + ' Chars & ' + (d.Account.Vault.Chest.length != undefined ? (d.Account.Vault.Chest.length + ' Vaults') : '') : '1 / ' + ((data.query.results.other) ? data.query.results.other.maxCharNum : 'N/A') + ' Char & ' + (d.Account.Vault.Chest.length != undefined ? (d.Account.Vault.Chest.length + ' Vaults') : '')) : '0 / ' + ((data.query.results.other) ? data.query.results.other.maxCharNum : 'N/A') + ' Char & ' + (d.Account.Vault.Chest.length != undefined ? (d.Account.Vault.Chest.length + ' Vaults') : '')) || '(No Name) : ' + (d.Char.length != undefined ? d.Char.length + ' / ' + ((data.query.results.other) ? data.query.results.other.maxCharNum : 'N/A') + ' Chars & ' + (d.Account.Vault.Chest.length != undefined ? (d.Account.Vault.Chest.length + ' Vaults') : '') : '0 / ' + ((data.query.results.other) ? data.query.results.other.maxCharNum : 'N/A') + ' Char & ' + (d.Account.Vault.Chest.length != undefined ? (d.Account.Vault.Chest.length + ' Vaults') : ''))));
				}
				if (extraName === 'Stars+' || extraName === 'All')
				{
					addstarplus($name, d);
				}
				if (extraName === 'Stars')
				{
					addstar($name, d);
				}
			}
						
            //  click name to access account options
            $name.on('click.muledump.muleAccountName', function (e) {
				// console.log("target = " + e.target + "this = " + this);
                // if (e.target !== this) return;
				
                setuptools.lightbox.menu.context.close();
                if ( setuptools.app.muledump.keys('ctrl', e) === true || setuptools.app.muledump.keys('shift', e) === true ) return;
                var $ao = $('#accopts');
                $ao.css({
                    left: e.pageX - 5 + 'px',
                    top: e.pageY - 5 + 'px'
                });
                window.updaccopts(self.guid);
                $ao.css({
                    'display': 'block',
                    'visibility': 'visible'
                });
            });
			
            $name.appendTo(this.dom);
			
            if ( !this.opt('shrink') ) {

                //  display account info
                if (this.opt('accountinfo')) {
                    stats = calculateStatTotals(this.data.query.results.Chars, this.guid);
                    $('<div class="stats">\
                        <div class="flex-container"><div>Account Data Cache Age</div><div>' + stats.CacheAge + ' ' + ((stats.CacheAge === 1) ? 'day' : 'days') + '</div></div> \
                        <div class="flex-container"><div>Account Fame</div><div>' + this.data.query.results.Chars.Account.Stats.Fame + '</div></div> \
                        <div class="flex-container"><div>All Time Account Fame</div><div>' + this.data.query.results.Chars.Account.Stats.TotalFame + '</div></div> \
                        <div class="flex-container"><div>Account Gold</div><div>' + this.data.query.results.Chars.Account.Credits + '</div></div> \
                        <div class="flex-container"><div>Gift Items</div><div>' + stats.TotalGifts + '</div></div> \
                        <div class="flex-container"><div>Last Gold Purchase</div><div>' + stats.LastGoldPurchase + '</div></div> \
                        <div class="flex-container"><div>Total Char Exp</div><div>' + stats.TotalExp + '</div></div> \
                        <div class="flex-container"><div>Total Char Fame</div><div>' + stats.TotalFame + '</div></div> \
                        <div class="flex-container"><div>Total Death Fame</div><div>' + stats.TotalDeathFame + '</div></div> \
                        <div class="flex-container"><div>Total Characters</div><div>' + stats.TotalChars + ' / ' + ((data.query.results.other) ? data.query.results.other.maxCharNum : 'N/A') + ' Char Slots</div></div> \
                        <div class="flex-container"><div>Total Characters Created</div><div>' + ((data.query.results.other) ? (data.query.results.other.nextCharId - 1) : 'N/A') + '</div></div> \
						<div class="flex-container"><div>Total Tiles Discovered</div><div>' + stats.TotalTiles + '</div></div> \
						<div class="flex-container"><div>Total Oryx Killed</div><div>' + stats.TotalOryx + '</div></div> \
                        <div class="flex-container"><div>Total Skins Unlocked</div><div>' + (this.data.query.results.Chars.OwnedSkins.length + Object.keys(classes).length) + ' of ' + Object.keys(skins).length + '</div></div>\
                        <div class="flex-container"><div>Total Time Active</div><div>' + stats.TotalActive + '</div></div> \
                        <!-- removed for now due to inaccurate data coming from deca -- <div class="flex-container"><div>Lifetime Gold Purchased</div><div>' + this.data.query.results.Chars.SalesForce.lifetime_spend + '</div></div>--> \
                        <div class="flex-container"><div>Total Unlocked Chests</div><div>' + stats.TotalChests + ' of ' + (vaultorders[0].vaultorder.filter(function (item) {
                        return (item !== 0)
                    })).length + '</div></div> \
                </div>').appendTo(this.dom);
                }

                //  for future use - skins owned by percentage to append total skins unlocked
                //' / ' + ( ((this.data.query.results.Chars.OwnedSkins.length/Object.keys(skins).length)*100).toFixed(0) ) + '%</div></div> \

                //  check for gift chests bug
                var TotalGifts = 0;
                if (typeof d.Account.Gifts === 'string') TotalGifts = d.Account.Gifts.split(',').length;
                if (TotalGifts >= setuptools.config.giftsWarningThreshold) {

                    //  check if we should alert the user
                    if (
                        setuptools.app.config.determineFormat(setuptools.data.accounts) === 0 ||
                        setuptools.data.accounts.accounts[this.guid].giftsBugAck !== true
                    ) {

                        this.error('Warning: Account is nearing the <a href="' + setuptools.config.giftChestsBugHelp + '" class="rateLimited nopulse" target="_blank">gift chests bug</a>!', function () {

                            if (setuptools.app.config.determineFormat(setuptools.data.accounts) === 1) {

                                setuptools.data.accounts.accounts[self.guid].giftsBugAck = true;
                                setuptools.app.config.save('Gift Chests Bug Ack');

                            }

                        });

                    }

                }
                //  reset the acknowledgement if the issue isn't detected
                else if (
                    setuptools.state.loaded === true &&
                    setuptools.app.config.determineFormat(setuptools.data.accounts) === 1 &&
                    setuptools.data.accounts.accounts[self.guid].giftsBugAck === true
                ) setuptools.data.accounts.accounts[self.guid].giftsBugAck = false;

            }

            //  sort the character list
            if (setuptools.data.config.debugging === true) setuptools.app.uaTiming('mule', 'parseCharacterSorting', 'start', this.guid, false, setuptools.app.uaTimingAggregate);

            //  if we had been customSorting we need to regenerate the totals
            if (this.customSorting === true && this.opt('chsort') !== '100') {

                this.createCounter();
                this.redoTotals = true;
                this.customSorting = false;

            }

            //  custom
            if (this.opt('chsort') === '100') {

                //  clean and read the active char sorting list
                if (skipCacheWrite !== true) setuptools.app.muledump.charsort.clean(this.guid);
                var CharList = setuptools.app.muledump.charsort.read(this.guid, true);
                if (Array.isArray(CharList) && CharList.length > 0) {

                    CharList = setuptools.app.muledump.charsort.disabled(this.guid, setuptools.app.muledump.charsort.read(this.guid), CharList);
                    this.createCounter();
                    this.redoTotals = true;
                    this.customSorting = true;

                    carr = CharList;
                    if (setuptools.data.options.totalsGlobal === false) CountingCharList = CharList;

                } else {

                    //  reset the active list
                    if (Array.isArray(CharList) && CharList.length === 0) setuptools.app.muledump.charsort.active(this.guid);

                    //  use default
                    carr.sort(function (a, b) {
                        return a.id - b.id
                    });

                }

                //  character value
            } else if (this.opt('chsort') === '7') {
                carr.sort(function (a, b) {
                    return b.muledump.CharValue - a.muledump.CharValue;
                });
                //  active time
            } else if (this.opt('chsort') === '6') {
                carr.sort(function (a, b) {
                    return b.muledump.MaxedStats - a.muledump.MaxedStats;
                })
            } else if (this.opt('chsort') === '5') {

                carr.sort(function (a, b) {

                    var statsA = readstats(a.PCStats);
                    var statsB = readstats(b.PCStats);
                    return Number(statsB[20]) - Number(statsA[20])

                });

                //  class, by fame
            } else if (this.opt('chsort') === '4') {

                //  sort alphabetically and by current fame
                carr.sort(function (a, b) {
                    if (a.muledump.ClassName < b.muledump.ClassName) return -1;
                    if (a.muledump.ClassName > b.muledump.ClassName) return 1;
                    if (a.muledump.ClassName === b.muledump.ClassName) {
                        return b.CurrentFame - a.CurrentFame;
                    }
                    return 0;
                });

                //  base exp
            } else if (this.opt('chsort') === '3') {

                carr.sort(function (a, b) {
                    return b.Exp - a.Exp
                });

                //  total fame
            } else if (this.opt('chsort') === '2') {

                carr.sort(function (a, b) {
                    return b.muledump.TotalFame - a.muledump.TotalFame
                });

                //  base fame
            } else if (this.opt('chsort') === '1') {

                carr.sort(function (a, b) {
                    return b.CurrentFame - a.CurrentFame
                });

                //  id (default)
            } else {
                carr.sort(function (a, b) {
                    return a.id - b.id
                });
            }

            if (setuptools.data.config.debugging === true) setuptools.app.uaTiming('mule', 'parseCharacterSorting', 'stop', this.guid);

        }

        //  main character loop
        if ( typeof setuptools.tmp.wawawaTimers === 'undefined' ) setuptools.tmp.wawawaTimers = {};
        if ( typeof setuptools.tmp.mainCharLoopTimers === 'undefined' ) setuptools.tmp.mainCharLoopTimers = {};
        setuptools.tmp.wawawaTimers[this.guid] = 0;
        setuptools.tmp.mainCharLoopTimers[this.guid] = 0;

        //  loop chars for counting
        if ( this.totals.cache === false ) {

            for ( var z = 0; z < CountingCharList.length; z++ ) {

                if ( typeof CountingCharList[z] !== 'object' ) CountingCharList[z] = {};
                var eqc = (CountingCharList[z].Equipment || '').split(',');
                for ( var tec = 0; tec < 4; tec++ ) this.totals.count(eqc[tec] || "-1", 'equipment');
                for ( var tic = 4; tic < 12; tic++ ) this.totals.count(eqc[tic] || "-1", 'inv');
                if ( +CountingCharList[z].HasBackpack === 1 ) for ( var tbc = 12; tbc < ( (eqc.length < 20) ? 20 : eqc.length ); tbc++ ) this.totals.count(eqc[tbc] || "-1", 'backpack');

            }

        }

        //  loop chars for display
		var StatId = [2793, 2794, 2591, 2592, 2593, 2636, 2612, 2613]; // life, mana, att, def, spd, dex, vit, wis
		var PotList = {Count: 0}
		var DungeonStats = [];
		var STShardNumber = 0;
		var SlotCouponNumber = 0;
		var ChestCouponNumber = 0;
		var QuestChestNumber = 0;
		var EpicQuestChestNumber = 0;
		var LootTierNumber = 0;
		var LootDropNumber = 0;
		var CloverNumber = 0;
		var MaxLvlNumber = 0;
		for (m in shortdungeonnames) {
			DungeonStats.push({'Dungeon':shortdungeonnames[m], 'Number': 0});
		}
        for (var i = 0; i < carr.length; i++) {
			setuptools.app.uaTiming('mule', 'mainCharLoopTimer', 'start', this.guid);
            var c = carr[i], $c = $('<div class="char">');
            if (!c) continue;
            var cl = classes[c.ObjectType];
			var stupidvar0 = 0;
			var st = readstats(c.PCStats); 
			for (m in shortdungeonnames) {
				DungeonStats[stupidvar0].Number += st[m];
				stupidvar0++
			}
			stupidvar0 = 0;
            			
			///Wawa start
			var FullID = d.Account.Name + ' ' + c.id; // for console purposes
			if (cl)
			{
				ClassList[cl[0]]['Num'] += 1;
			}
			BaseFameTotal += Number(c.CurrentFame);
			// Fame Display
			var st = readstats(c.PCStats); 
			iTotalFame = +c.CurrentFame;
			var fame = +c.CurrentFame;
			var Bestfame = +d.Account.Stats.BestCharFame;
			var fbonus = [];
			var fbonus2 = [];
			var fbonus3 = [];
			fbonus.push('<div style="display:flex; flex-direction: column">');
			fbonus2.push('<div style="display:flex; flex-direction: column">');
			fbonus3.push('<div class="flex-container noFlexAutoWidth" style="flex-direction: column"><div class="flex-container" style="align-items:flex-start">');
			fbonus.push('<div class="statItem" style="font-weight:700; font-size:1.5em; align-self:center">Base Fame : <span style="color:' + darkgreen + '">' + NumberFormat(iTotalFame, ',') + ' Fame</span></div>');
			for (var k in bonuses) {
				var b = bonuses[k](st, c, d, iTotalFame); 
				if (!b) continue; 
				var incr = 0; 
				if (typeof b == 'object') {
					incr += b.add; 
					b = b.mul; } 
				incr += Math.floor(iTotalFame * b); 
				iTotalFame += incr; 
				fbonus.push('<div class="statItem" style="font-weight:700; align-self:flex-end; font-size:1.2em">' + k + ' : <span style="color:' + lightgreen + '">+' + NumberFormat(incr, ',') + ' Fame</span></div>');
			}
			DeadFameTotal += Number(iTotalFame);
			
			// Time Display
			var v = st[20];
			ATime = [];
			var divs = { 'y': 525600, 'm': 43200, 'd': 1440, 'h': 60, 'min': 1 };
			for (var s in divs) {
				if (ATime.length > 4) break;
				var t = Math.floor(v / divs[s]);
				if (t) ATime.push(t + s);
				v %= divs[s];
			}
			
			/// Wawa end
            // if (!cl) continue;
            if ( this.loginOnly === false && !this.opt('shrink') && this.opt('chdesc') ) {

                f = true;

                //  draw character portrait and description
                setuptools.app.muledump.drawPortrait(c, $c);
			}


            if ( this.loginOnly === false && !this.opt('shrink') ) {
                f = true;
                var $stats = $('<table class="stats">');

                for (var t = 0; t < STATTAGS.length; t++) {
                    var $row;
                    if (t % 2 === 0) $row = $('<tr>');
                    $('<td class="sname">').text(STATABBR[t]).appendTo($row);
                    var $s = $('<td>');
                    var s = +c[STATTAGS[t]] || 0;
                    var stt = this.opt('sttype');
			
			///pots left
			if (!cl) {
			}
			else
			{
				var l2m = cl[3][t] - s;
				if (t < 2) {
					l2m = Math.ceil(l2m / 5);
				}
				if (carr[i].Level === "20") {
					if(PotList[StatId[t]] === undefined)
					{
						if (l2m === 0) {
						}
						else {
							PotList[StatId[t]] = l2m
							PotList['Count'] += 1;
						}
					}
					else {
						PotList[StatId[t]] += l2m
					}
				}
			}						
			if (!cl) {
                    }
                    else if (stt === 'base') {
                        stat($s, 'base', s).toggleClass('maxed', s === cl[3][t]);
                    } else if (stt === 'avg') {
                        var avgd = s - Math.floor(cl[1][t] + (cl[2][t] - cl[1][t]) * (+c.Level - 1) / 19);
                        stat($s, 'avg', (avgd > 0 ? '+' : '') + avgd)
                            .addClass(avgd > 0 ? 'good' : (avgd < 0 ? 'bad' : ''))
                            .toggleClass('very', Math.abs(avgd) > 14);
                    } else if (stt === 'max') {
                        stat($s, 'max', l2m)
                            .toggleClass('maxed', cl[3][t] <= s);
                    } else if (stt == 'comb') {
						if (s < cl[3][t]) {
							var StatData = [];
							var avgd = s - Math.floor(cl[1][t] + (cl[2][t] - cl[1][t]) * (+c.Level - 1) / 19);
							if (t < 2) {
								stat($s, 'small', s + '/' + cl[3][t])
									.addClass(avgd > 0 ? 'good' : (avgd < 0 ? 'bad' : ''))
									.toggleClass('very', Math.abs(avgd) > 14)
								
								StatData.push('<div class="' + (avgd > 0 ? 'good' : (avgd < 0 ? 'bad' : 'avg')) + ((Math.abs(avgd) > 14) ? ' very' : '') + '" style="font-size:1.3em; font-weight:700">' + s + ' / ' + cl[3][t] + '</div><div class="' + (avgd > 0 ? 'good' : (avgd < 0 ? 'bad' : 'avg')) + ((Math.abs(avgd) > 14) ? ' very' : '') + '" style="font-size:1.3em; font-weight:700">' + (avgd > 0 ? '+' : '') + avgd + ' From Average ( ' + (avgd > 0 ? '+' : '') + avgd / 5 + ' )</div><div class="' + (avgd > 0 ? 'good' : (avgd < 0 ? 'bad' : 'avg')) + ((Math.abs(avgd) > 14) ? ' very' : '') + '" style="font-size:1.3em; font-weight:700">' + l2m + ' Left To Max</div>');
							}
							else {
								stat($s, 'small', s + '/' + cl[3][t] + ' (' + l2m + ')')
									.addClass(avgd > 0 ? 'good' : (avgd < 0 ? 'bad' : ''))
									.toggleClass('very', Math.abs(avgd) > 14)
								
								StatData.push('<div class="' + (avgd > 0 ? 'good' : (avgd < 0 ? 'bad' : 'avg')) + ((Math.abs(avgd) > 14) ? ' very' : '') + '" style="font-size:1.3em; font-weight:700">' + s + ' / ' + cl[3][t] + '</div><div class="' + (avgd > 0 ? 'good' : (avgd < 0 ? 'bad' : 'avg')) + ((Math.abs(avgd) > 14) ? ' very' : '') + '" style="font-size:1.3em; font-weight:700">' + (avgd > 0 ? '+' : '') + avgd + ' From Average</div><div class="' + (avgd > 0 ? 'good' : (avgd < 0 ? 'bad' : 'avg')) + ((Math.abs(avgd) > 14) ? ' very' : '') + '" style="font-size:1.3em; font-weight:700">' + l2m + ' Left To Max</div>');
							}
							
							setuptools.app.muledump.tooltip($s, 'nomargin autoHeight', StatData.join(' '));
						} else {
							stat($s, 'maxed', s)
						}
                    }
                    $s.appendTo($row);
                    if (t % 2) $row.appendTo($stats);
                }
				if (this.opt('stats')) {
					$c.append($stats);
				}
            }

            // items
            var eq = (c.Equipment || '').split(',');
            var tcount = [];
            var dobp = this.opt('backpack') && +c.HasBackpack;

            if (this.opt('equipment') || this.opt('inv') || dobp) {

                f = true;
                if ( this.loginOnly === false && !this.opt('shrink') ) var itc = $('<div>').addClass('items');
                if (this.opt('equipment')) {
                    tcount = tcount.concat(eq.slice(0, 4));
                    if ( this.loginOnly === false && !this.opt('shrink') ) itc.append(setuptools.app.muledump.item_listing(eq.slice(0, 4), 'equipment', c.ObjectType));
                }
                if (this.opt('inv')) {
                    tcount = tcount.concat(eq.slice(4, 12));
                    if ( this.loginOnly === false && !this.opt('shrink') ) itc.append(setuptools.app.muledump.item_listing(eq.slice(4, 12), 'inv'));
                }
                if (dobp) {
                    tcount = tcount.concat(eq.slice(12, eq.length));
                    if ( this.loginOnly === false && !this.opt('shrink') ) itc.append(setuptools.app.muledump.item_listing(eq.slice(12, eq.length), 'backpack'));
                }

                if ( this.loginOnly === false && !this.opt('shrink') ) itc.appendTo($c);

            }

            var hpmp = c.EquipQS;
            var items = ( typeof hpmp === 'string' ) ? hpmp.split(',') : undefined;
            if ( Array.isArray(items) === true ) {
                // quickslot counting for totals
                if ( this.totals.cache === false ) {
                    for ( var j = 0; j < items.length; j++ ) {
                        var item = items[j].split("|");
                        var qty = +(item[1] || 1);
                        if ( item[0] !== "-1" ) {
                            this.totals.count(item[0], "hpmp", qty);
                        }
                    }
                }

                // quickslot display
                if ( this.loginOnly === false && !this.opt('shrink') && this.opt('hpmp') ) {
                    var quickslotsCount = (+c.Has3Quickslots ? 3 : 2);
                    while ( items.length < quickslotsCount ) {
                        items.push("-1|0");
                    }
                    var r = $('<div class="itemsc hpmp noselect">');
                    for ( var j = 0; j < items.length; j++ ) {
                        var item = items[j].split("|");
                        var qty = +(item[1] || 1) || undefined;
                        setuptools.app.muledump.item(item[0], undefined, qty, undefined).appendTo(r);
                    }
                    $('<div class="items">').append(r).appendTo($c);
                }
            }

            //  keeping this separate from the wawawa code
            if ( this.loginOnly === false && !this.opt('shrink') && this.opt('wawawa')) {

                if (setuptools.tmp.gaSentWawawa !== true) {

                    setuptools.tmp.gaSentWawawa = true;
                    setuptools.app.ga('send', 'event', {
                        eventCategory: 'options',
                        eventAction: 'wawawa'
                    });

                }

            }

            /*
            //  Wawawa Option
            //  https://github.com/wawawawawawawa/muledump
            //  https://github.com/jakcodex/muledump/pull/19
            //  Thank you, Wawawa!
            */
            /////////////////////////
            // WAWAWA PART
			var stupidvar = 0;
            if (this.loginOnly === false && !this.opt('shrink') && this.opt('wawawa')) {

                if ( setuptools.data.config.debugging === true ) setuptools.app.uaTiming('mule', 'parseWawawa', 'start', this.guid);
                // Useful Functions
			function round(value, decimals) {
				return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
			}
			
			function apply_bonus(value) {
				for (var k in bonuses) { 
				var b = bonuses[k](st, c, d, value); 
				if (!b) continue; 
				var incr = 0; 
				if (typeof b == 'object') {
					incr += b.add; 
					b = b.mul; } 
				incr += Math.floor(value * b); 
				value += incr;
				}
				return value;
			}
			
			function statOut(stat, value, tooltip, color){
				var StatText = $('<div class="flex-container noFlexAutoJustify WawaType">');
				StatText.append($('<div style="color:' + color + '; font-weight:bold">').text(stat + ' = ' + value)); // '\xa0' = non breakable char with .text()
				if (tooltip) {
					setuptools.app.muledump.tooltip(StatText, 'statContainer autoHeight', tooltip);
				}
				StatText.appendTo($c);
            }
			
			// Fame Display
			var FameBoost = round((iTotalFame / fame) * 100, 2);
			fbonus.push('<div class="statItem" style="font-weight:700; font-size:1.5em; align-self:center"><span style="text-decoration:underline">Total Fame :</span><span style="color:' + gold + '"> ' + NumberFormat(iTotalFame, ',') + ' Fame</span></div><div class="statItem" style="font-weight:700; font-size:1.3em; align-self:center">Fame Boost :<span style="color:' + gold + '"> ' + NumberFormat(FameBoost, ',') + ' %</span></div>' + ((iTotalFame >= d.Account.Stats.BestCharFame) ? '<div class="statItem" style="font-weight:700; font-size:1.3em; align-self:center">Highest Fame Achieved :<span style="color:' + gold + '"> ' + NumberFormat(Bestfame, ',') + ' Fame</span></div>' : ''));
			
			var lower = 0;
			var upper = d.Account.Stats.BestCharFame;
			if (upper - lower == 1) {
				upper = +c.CurrentFame + 1;
			}
			while (upper - lower > 1) {
				var middle = lower + Math.floor((upper - lower) / 2);
				var current = apply_bonus(middle);
				if (current >= d.Account.Stats.BestCharFame) {
					upper = middle;
				} else {
					lower = middle;
				}
			}
			if (iTotalFame < d.Account.Stats.BestCharFame) {
				var upperleft = upper - c.CurrentFame;
				fbonus2.push('<div class="statItem" style="font-weight:700; font-size:1.3em">Highest Fame Achieved :<span style="color:' + gold + '"> ' + NumberFormat(Bestfame, ',') + ' Fame</span></div><div class="statItem" style="font-weight:700; font-size:1.3em; align-self:center; text-decoration:underline">With current boosts :</div><div class="statItem" style="font-weight:700; align-self:center; font-size:1.3em">Gain First Born at ' + NumberFormat(lower, ',') + ' Base Fame</div><div class="statItem" style="font-weight:700; align-self:center; font-size:1.3em">(' + NumberFormat(upperleft, ',') + ' Base Fame Left)</div>');
			}
			fbonus.push('</div>');
			fbonus2.push('</div>');
			fbonus3.push(fbonus.join(' ') + fbonus2.join(' ') + '</div></div>');
			
			// Total Fame
			var fameColor = darkred;
			if(iTotalFame > 400){ fameColor = darkgreen; }
			if(iTotalFame > 2000){ fameColor = gold; }
			statOut('Total Fame', NumberFormat(iTotalFame, ',') + ' Fame ', fbonus3.join(''), fameColor);
			
			// Time Active
			var FPM = [];
			var v = st[20];
			var BaseFPM = round(fame / v, 2);
			var TotalFPM = round(iTotalFame / v, 2);
			
			FPM.push('<div class="statItem" style="font-weight:700; font-size:1.3em; align-self:center"><span style="color:' + lightgreen + '">' + NumberFormat(BaseFPM, ',') + '</span> Base Fame/Minute</div><div class="statItem" style="font-weight:700; font-size:1.3em; align-self:center"><span style="color:' + darkgreen + '">' + NumberFormat(TotalFPM, ',') + '</span> Total Fame/Minute</div>');
			
			
			var timeColor = darkred;
			if(st[20] > 10){ timeColor = lightgreen; }
			if(st[20] > 30){ timeColor = darkgreen; }
			if(st[20] > 60){ timeColor = gold; }
			if (ATime.length == 0) {
				statOut('Active Time', ' < 1 min', '', timeColor)
			} else {
				statOut('Active Time', ATime.join(' '), FPM.join(''), timeColor)
			}
			// Tiles Uncovered
			var TilesDone = NumberFormat(st[3], ',');
			var TPM = round(st[3] / st[20], 0);
			var TilesData = [];
			var TilesLeft = 4e6 - st[3] + 1;
			
			TilesData.push('<div class="statItem" style="font-weight:700; font-size:1.3em; align-self:center"><span style="color:' + gold + '">' + NumberFormat(TPM, ',') + '</span> Tiles/Minute</div>');
			var TilesLeftExpl = TilesLeft - 3e6;
			var vCart = round((4e6 - st[3] + 1) / round(st[3] / st[20], 0), 0), TilesTime = [];
			var vExpl = round((1e6 - st[3] + 1) / round(st[3] / st[20], 0), 0), TilesTimeExpl = [];
			for (var sCart in divs) {
				if (TilesTime.length > 4) break;
				var tCart = Math.floor(vCart / divs[sCart]);
				var tExpl = Math.floor(vExpl / divs[sCart]);
				if (tCart) TilesTime.push(tCart + sCart);
					vCart %= divs[sCart];
				if (tExpl) TilesTimeExpl.push(tExpl + sCart);
					vExpl %= divs[sCart];
			}
			if (TilesLeft > 3e6) {
				TilesData.push('<div class="statItem" style="font-weight:700; font-size:1.3em; align-self:center">Explorer : <span style="color:' + lightgreen + '">' + NumberFormat(TilesLeftExpl, ',') + '</span> Tiles Left</div><div class="statItem" style="font-weight:700; font-size:1.3em; align-self:center">Average Time Left : <span style="color:' + lightgreen + '">' +  TilesTimeExpl.join(' ') + '</span> Left</div>');
			}
			if (TilesLeft > 0) {
				TilesData.push('<div class="statItem" style="font-weight:700; font-size:1.3em; align-self:center">Cartographer : <span style="color:' + darkgreen + '">' + NumberFormat(TilesLeft, ',') + '</span> Tiles Left</div><div class="statItem" style="font-weight:700; font-size:1.3em; align-self:center">Average Time Left : <span style="color:' + darkgreen + '">' + TilesTime.join(' ') + '</span> Left</div>');
			}
			var tilesColor = darkred;
			if(st[3] > 0){ tilesColor = lightgreen; }
			if(st[3] > 1e6){ tilesColor = darkgreen; }
			if(st[3] > 4e6){ tilesColor = gold; }
			statOut('Tiles', TilesDone, TilesData.join(' '), tilesColor)
			
			//Tunnel Rat
			var QuestList = [];
			var QuestListNumber = [];
			var QuestMiss = [];
			var QuestMissNumber = [];
			var TratQuest = [];
			var TratQuestNumber = [];
			var TratQuest2 = [];
			var TratQuest2Number = [];
			var TratQuest3 = [];
			TratQuest.push('<div class="flex-container noFlexAutoWidth" style="flex-flow:column;">')
			TratQuestNumber.push('<div class="flex-container noFlexAutoWidth" style="flex-flow:column;">')
			TratQuest2.push('<div class="flex-container noFlexAutoWidth" style="flex-flow:column;">')
			TratQuest2Number.push('<div class="flex-container noFlexAutoWidth" style="flex-flow:column;">')
			TratQuest3.push('<div style="display:flex; flex-direction: row"><div class="flex-container noFlexAutoWidth" style="flex-direction: column"><div class="flex-container" style="align-items:flex-end">')
			QuestList.push('<div class="flex-container noFlexAutoWidth" style="flex-flow:column;">')
			QuestListNumber.push('<div class="flex-container noFlexAutoWidth" style="flex-flow:column;">')
			QuestMiss.push('<div class="flex-container noFlexAutoWidth" style="flex-flow:column;">')
			QuestMissNumber.push('<div class="flex-container noFlexAutoWidth" style="flex-flow:column;">')
			
			for (m in shortdungeonnames) {
				// DungeonStats[stupidvar].Number += st[m];
				if (m > 12) {
					if (st[m] != 0) {
						QuestList.push('<div class="statItem" style="font-size:1.15em; align-self:flex-start">' + shortdungeonnames[m] + ' : </div>');
						QuestListNumber.push('<div class="statItem" style="font-size:1.15em; align-self:flex-end">' + NumberFormat(st[m], ',') + '</div>');
					}
					else {
						QuestMiss.push('<div class="statItem" style="font-size:1.15em; align-self:flex-start">' + shortdungeonnames[m] + ' : </div>');
						QuestMissNumber.push('<div class="statItem" style="font-size:1.15em; align-self:flex-end">' + NumberFormat(st[m], ',') + '</div>');
					}
				}
				if (m < 25)
				{
					if (st[m] == 0) {
						TratQuest.push('<div class="statItem" style="font-size:1.3em; align-self:flex-start; font-weight:700; color:' + darkred + '">' + shortdungeonnames[m] + ' : </div>');
						TratQuestNumber.push('<div class="statItem" style="font-size:1.3em; align-self:flex-end; font-weight:700; color:' + darkred + '">' + NumberFormat(st[m], ',') + '</div>');
					}
				}
				else {
					if (st[m] == 0) {
						TratQuest2.push('<div class="statItem" style="font-size:1.15em; align-self:flex-start">' + shortdungeonnames[m] + ' : </div>');
						TratQuest2Number.push('<div class="statItem" style="font-size:1.15em; align-self:flex-end">' + NumberFormat(st[m], ',') + '</div>');
					}
				}
				stupidvar++;
			}
			stupidvar = 0;
			// console.log(FullID, DungeonStats);
			QuestList.push('</div>');
			QuestListNumber.push('</div>');
			QuestMiss.push('</div>');
			QuestMissNumber.push('</div>');
			TratQuest.push('</div>');
			TratQuestNumber.push('</div>');
			TratQuest2.push('</div>');
			TratQuest2Number.push('</div>');
			TratQuest3.push(TratQuest.join(' ') + TratQuestNumber.join(' ') + TratQuest2.join(' ') + TratQuest2Number.join(' ') + '</div></div></div>');
			
			if (TratQuest.length === 2) {
				if (QuestMiss.length === 2) {
					statOut('Tunnel Rat', "Complete", '', gold)
				}
				else {
					statOut('Tunnel Rat', "Done", '<div style="display:flex; flex-direction: row"><div class="flex-container noFlexAutoWidth noFlexAutoAlign" style="flex-direction: column"><div class="flex-container noFlexAutoAlign" style="justify-content:flex-start">' + QuestMiss.join(' ') + QuestMissNumber.join(' ') + '</div></div></div>', gold)
				}
			}
			else {
				var tunnelColor = darkred;
				var tunnelText = "Not Started";
				if(TratQuest.length < 12){ tunnelColor = lightgreen; tunnelText = "In Progress" }
				if(TratQuest.length < 7){ tunnelColor = darkgreen; tunnelText = "In Progress" }
				statOut('Tunnel Rat', tunnelText, TratQuest3.join(' '), tunnelColor)
			}
			//Oryx Kills
			var OKill = st[11];
			if (OKill < 1) {
				statOut('Oryx Kills', NumberFormat(OKill, ','), '', darkred)
			}
			else {
				statOut('Oryx Kills', NumberFormat(OKill, ','), '', gold)
			}
			//Accuracy
			var ShotData = [];
			var iAcc = round(100 * st[1] / st[0], 2);
			var l2Acc = (0.75 * st[0] - st[1]) / 0.25;
			if (Math.ceil(l2Acc) === l2Acc) l2Acc += 1;
			var l2Acc2 = (0.5 * st[0] - st[1]) / 0.5;
			if (Math.ceil(l2Acc2) === l2Acc2) l2Acc2 += 1;
			var l2Acc3 = (0.25 * st[0] - st[1]) / 0.75;
			if (Math.ceil(l2Acc3) === l2Acc3) l2Acc3 += 1;
			var accColor = darkred;
			var AccurateText = [darkred, 'Hits Left'];
			var SharpshooterText = [darkred, 'Hits Left'];
			var SniperText = [darkred, 'Hits Left'];
			if(iAcc > 25){ 
				accColor = lightgreen;
				AccurateText = [gold, 'Extra Shots Left'];
			}
			if(iAcc > 50){ 
				accColor = darkgreen;
				SharpshooterText = [gold, 'Extra Shots Left'];
			}
			if(iAcc > 75){ 
				accColor = gold;
				SniperText = [gold, 'Extra Shots Left'];
			}
			
			ShotData.push('<div class="statItem" style="font-weight:700; font-size:1.3em; align-self:center">Total Shots : <span style="color:' + gold + '">' + NumberFormat(st[0], ',') + '</span></div>' 
			+ '<div class="statItem" style="font-weight:700; font-size:1.3em; align-self:center">Total Hits : <span style="color:' + gold + '">' + NumberFormat(st[1], ',') + '</span></div>' 
			+ '<div class="statItem" style="font-weight:700; font-size:1.3em; align-self:center">Ability Used : <span style="color:' + gold + '">' + NumberFormat(st[2], ',') + '</span></div>'
			+ '<div class="statItem" style="font-weight:700; font-size:1.2em; align-self:flex-end">Accurate : <span style="color:' + AccurateText[0] + '">' + NumberFormat(Math.abs(Math.ceil(l2Acc3)), ',') + '</span> ' + AccurateText[1] + '</div>' 
			+  '<div class="statItem" style="font-weight:700; font-size:1.2em; align-self:flex-end">Sharpshooter : <span style="color:' + SharpshooterText[0] + '">' + NumberFormat(Math.abs(Math.ceil(l2Acc2)), ',') + '</span> ' + SharpshooterText[1] + '</div>'  
			+ '<div class="statItem" style="font-weight:700; font-size:1.2em; align-self:flex-end">Sniper : <span style="color:' + SniperText[0] + '">' + NumberFormat(Math.abs(Math.ceil(l2Acc)), ',') + '</span> ' + SniperText[1] + '</div>');
			
			statOut('Accuracy', iAcc + ' %', ShotData.join(' '), accColor)
			//Gods Killed
			var GodKillRatio = round(100 * st[8] / (st[6] + st[8]), 2);
			var GodData =[];
			var GodKillLeft = st[6] - st[8] + 1;
			var tenpercent = (st[6] / 10 - st[8]) + 1;
			if(tenpercent < 0)
			{
				tenpercent = (st[8] * 10) - st[6] - 1;
			}
			var godsColor = darkred;
			var EGText = [darkred, 'God Kills Left'];
			var SGText = [darkred, 'God Kills Left'];
			if(GodKillRatio > 0){ godsColor = lightgreen; }
			if(GodKillRatio > 10){ 
				godsColor = darkgreen; 
				EGText = [gold, 'Extra Monster Kills Left']; 
			}
			if(GodKillRatio > 50){ 
				godsColor = gold; 
				SGText = [gold, 'Extra Monster Kills Left']; 
			}
			GodData.push('<div class="statItem" style="font-weight:700; font-size:1.3em; align-self:center">Monster Kills : <span style="color:' + gold + '">' + NumberFormat(st[6], ',') + '</span></div>' 
			+ '<div class="statItem" style="font-weight:700; font-size:1.3em; align-self:center">God Kills : <span style="color:' + gold + '">' + NumberFormat(st[8], ',') + '</span></div>' 
			+ '<div class="statItem" style="font-weight:700; font-size:1.2em; align-self:flex-end">Ennemy of the Gods : <span style="color:' + EGText[0] + '">' + NumberFormat(Math.abs(Math.ceil(tenpercent)), ',') + '</span> ' + EGText[1] + '</div>' 
			+ '<div class="statItem" style="font-weight:700; font-size:1.2em; align-self:flex-end">Slayer of the Gods : <span style="color:' + SGText[0] + '">' + NumberFormat(Math.abs(GodKillLeft), ',') + '</span> ' + SGText[1] + '</div>');
		   
			statOut('God Kill Ratio', GodKillRatio + ' %', GodData.join(' '), godsColor)
			// Party Level Ups
			var LvlUp = st[19];
			var LvlUpLeft = 1000 - st[19] + 1;
			var LvlUpData = [];
			if (LvlUpLeft > 0) {
				LvlUpData.push('<div class="statItem" style="font-weight:700; font-size:1.3em; align-self:flex-end">Leader of Men : <span style="color:' + gold + '">' + NumberFormat(LvlUpLeft, ',')  + '</span> Level Up Left</div>');
				if (LvlUpLeft > 900) {
					LvlUpData.push('<div class="statItem" style="font-weight:700; font-size:1.3em; align-self:flex-end">Team Player : <span style="color:' + gold + '">' + NumberFormat((LvlUpLeft - 900), ',')  + '</span> Level Up Left</div>');
				}
			}
			if (LvlUpLeft <= 0) LvlUpLeft = '';
			var lvlColor = darkred;
			if(LvlUp > 0){ lvlColor = lightgreen; }
			if(LvlUp > 100){ lvlColor = darkgreen; }
			if(LvlUp > 1000){ lvlColor = gold; }
			statOut('Level Up', NumberFormat(LvlUp, ','), LvlUpData.join(' '), lvlColor)
			// Quests Complete
			var QuestDone = st[12];
			if (QuestDone < 1001) {
				QuestDone = NumberFormat(QuestDone, ',') + ' / 1000';
			}
			else {
				QuestDone = NumberFormat(QuestDone, ',');
			}
			var questsColor = darkred;
			if(st[12] > 1){ questsColor = lightgreen; }
			if(st[12] > 500){ questsColor = darkgreen; }
			if(st[12] > 1000){ questsColor = gold; }
			if (QuestList.length > 2) {
				statOut('Quests Completed', QuestDone, '<div style="display:flex; flex-direction: row"><div class="flex-container noFlexAutoWidth noFlexAutoAlign" style="flex-direction: column"><div class="flex-container noFlexAutoAlign" style="justify-content:flex-start">' + QuestList.join(' ') + QuestListNumber.join(' ') + '</div></div></div>', questsColor)
			}
			else {
				statOut('Quests Completed', QuestDone, '', questsColor)
			}
        }
		// WAWAWA PART END
		/////////////////////////

            if (this.opt('pcstats') || this.opt('goals')) {


                f = true;
                $c.append(window.printstats(c, d, this.opt('goals'), this.opt('pcstats'), this));
            }
            arr.push($c);

            setuptools.app.uaTiming('mule', 'mainCharLoopTimer', 'stop', this.guid);

        }
		///wawawa start
		// Number of each class tooltip
		// if (this.opt('wabanitem') || this.opt('wabanut') || this.opt('wabandye'))
		// {
			CharNumData.push('<div class="flex-container noFlexAutoWidth" style="flex-flow:column; font-size:1.3em; font-weight:700"><div class="flex-container" style="flex-flow:row"><div class="flex-container" style="flex-flow:row; border:solid 2px grey"><div class="flex-container" style="flex-flow:row; flex-basis:content; flex-shrink:0">');
			CharNumData.push('<div class="flex-container noFlexAutoJustify noFlexAutoAlign ml10 mr10" style="flex-flow:column; flex-shrink:0; flex-basis:content; align-self:flex-end; justify-content:flex-end; height:100%"><div class="flex-container" style="flex-shrink:0; justify-content:flex-end">Number of Chars Per Class : </div><div class="flex-container" style="flex-shrink:0; justify-content:flex-end">Highest Base Fame Per Class : </div><div class="flex-container" style="flex-shrink:0; justify-content:flex-end">Highest Total Fame Per Class : </div></div>');
			for (var i in ClassList) {
				CharNumData.push('<div class="flex-container ml10 mr10" style="flex-flow:column"><div class="item"><img src="lib/' + i + '.png"></img><div style="">' + ClassList[i]['Num'] + '</div></div><div class="flex-container">' + (d.Account.Stats.ClassStats[stupidvar] ? d.Account.Stats.ClassStats[stupidvar].BestBaseFame : 0) + '</div><div class="flex-container">' + (d.Account.Stats.ClassStats[stupidvar] ? d.Account.Stats.ClassStats[stupidvar].BestTotalFame : 0) + '</div></div>');
				stupidvar += 1;
			}
			stupidvar = 0;
			CharNumData.push('</div><div class="flex-container ml10 mr10" style="flex-flow:row; justify-content:flex-end"><div class="flex-container" style="flex-flow:column; flex-shrink:0; flex-basis:content; justify-content:flex-end"><div class="flex-container" style="flex-flow:row; flex-shrink:0; justify-content:flex-start">Total Base Fame : ' + NumberFormat(BaseFameTotal, ',') + ' Fame</div><div class="flex-container" style="flex-flow:row; flex-shrink:0; justify-content:flex-start">Total Dead Fame : ' + NumberFormat(DeadFameTotal, ',') + ' Fame</div><div class="flex-container" style="flex-flow:row; flex-shrink:0; justify-content:flex-start">Best Fame Achieved : ' + NumberFormat(Bestfame, ',') + ' Fame</div></div>');
			CharNumData.push('</div></div></div>');
			
			var KeyList = {Count: 0};
			var ClothList = {Count: 0};
			var DyeList = {Count: 0};
			var SkinList = {Count: 0};
			var PetFoodList = {Count: 0};
			var BuffList = {Count: 0};
			var MarkList = {Count: 0};
			var PotionList = {Count: 0};
			var WhiteList = {Count: 0};
			var UTList = {Count: 0};
			var STList = {Count: 0};
			
			///gift data
			var gifts = d.Account.Gifts;
			var Totitems = (typeof gifts === 'string') ? gifts.split(',') : [];
			
			///vault data
			var chests;
			if (d.Account.Vault) {
				chests = d.Account.Vault ? d.Account.Vault.Chest || ['-1'] : ['-1'];
				if (typeof chests === 'string') chests = [chests];
				if (typeof chests === 'object' && Object.keys(chests).length === 0) chests = ['-1'];
			}
			for (var i = 0; i < chests.length; i++) {
				if (chests[i] === 0) {
					continue;
				}
				if (typeof chests[i] !== 'string') {
					chests[i] = '-1';
				}
				if (chest = chests[i].split(',')) {
					for (var j = 0; j < 8; j++) {
						if (chest[j] !== '-1' && chest[j] !== undefined) {
							let itemid = chest[j];
							let res = itemid.split('#')[0]
							if(res !== null) itemid = res;
							Totitems.push(itemid);
						}
					}
				}
			}
			
			///pot data
			var pots = d.Account.Potions;
			// console.log(d.Account);
			var Totpots = (typeof pots === 'string') ? pots.split(',') : undefined;
			// console.log(Totpots);
			if (Totpots)
			{
				for (var tp = 0; tp < Totpots.length; tp++) {
					if (window.items[Totpots[tp]] === undefined || Totpots[tp] === "-1") {
						// console.log(window.items[Totpots[tp]], Totpots[tp], "UNDEFINED");
					}
					else 
					{
						// console.log(window.items[Totpots[tp]], Totpots[tp], "DEFINED");
						if (PotionList[Totpots[tp]]) {
							PotionList[Totpots[tp]] += 1;
							
						// console.log(window.items[Totpots[tp]], Totpots[tp], "DEFINED");
						}
						else {
							PotionList[Totpots[tp]] = 1;
							PotionList['Count'] += 1;
						}
					}
				}
			}
			
			///char data
			for ( var z = 0; z < CountingCharList.length; z++ ) {

				if ( typeof CountingCharList[z] !== 'object' ) CountingCharList[z] = {};
				var eqc = (CountingCharList[z].Equipment || '').split(',');
				for ( var tec = 0; tec < eqc.length; tec++ ) {
					if (eqc[tec] !== '-1' && eqc[tec] !== undefined) {
						Totitems.push(eqc[tec]);
					}
				}
			}
			
			///window data
			var MaxItems = Math.floor((window.innerWidth - 76) / 50);
			
			for (var tg = 0; tg < Totitems.length; tg++) {
				
						// console.log(window.itemSlotTypeName, "Event");
				if (window.items[Totitems[tg]] === undefined) {
					// console.log(window.items[Totitems[tg]], Totitems[tg]);
				}
				else 
				{
					if (setuptools.app.muledump.itemSlotTypeName === 42019)
					{
						console.log(setuptools.app.muledump.itemSlotTypeName, "Event");
					}
					// console.log(window.items[Totitems[tg]], Totitems[tg]);
					/// UT
					if (window.items[Totitems[tg]][9] === 1 && window.items[Totitems[tg]][1] !== 10) {
						if (window.items[Totitems[tg]][7] === 6) {
							// console.log(window.items[Totitems[tg]], "white");
							if (WhiteList[Totitems[tg]]) {
								WhiteList[Totitems[tg]] += 1;
							}
							else {
								WhiteList[Totitems[tg]] = 1;
								WhiteList['Count'] += 1;
							}
						}
						else {
							// console.log(window.items[Totitems[tg]], "UT");
							if (UTList[Totitems[tg]]) {
								UTList[Totitems[tg]] += 1;
							}
							else {
								UTList[Totitems[tg]] = 1;
								UTList['Count'] += 1;
							}
						}
					}
					/// ST
					if (window.items[Totitems[tg]][9] === 2) {
						if (STList[Totitems[tg]]) {
							STList[Totitems[tg]] += 1;
						}
						else {
							STList[Totitems[tg]] = 1;
							STList['Count'] += 1;
						}
						// console.log(window.items[Totitems[tg]], "ST");
					}
					// if (window.items[Totitems[tg]][1] === 10) {
						// console.log(window.items[Totitems[tg]], "Event");
					// }
					/// buffs
					if (window.items[Totitems[tg]][10] === 42021 || window.items[Totitems[tg]][10] === 42019 || window.items[Totitems[tg]][10] === 42020) {
						if (BuffList[Totitems[tg]]) {
							BuffList[Totitems[tg]] += 1;
						}
						else {
							BuffList[Totitems[tg]] = 1;
							BuffList['Count'] += 1;
						}
					}
					
					/// pots on acc
					if (window.items[Totitems[tg]][10] === 42010 || window.items[Totitems[tg]][10] === 42011 || window.items[Totitems[tg]][10] === 42012) {
						if (PotionList[Totitems[tg]]) {
							PotionList[Totitems[tg]] += 1;
						}
						else {
							PotionList[Totitems[tg]] = 1;
							PotionList['Count'] += 1;
						}						
					}
					// console.log(window.items[Totitems[tg]]);
					
					/// marks
					if (window.items[Totitems[tg]][10] === 42028 || window.items[Totitems[tg]][10] === 42022) {
						if (MarkList[Totitems[tg]]) {
							MarkList[Totitems[tg]] += 1;
						}
						else {
							MarkList[Totitems[tg]] = 1;
							MarkList['Count'] += 1;
						}
					}
					/// pet food
					if (window.items[Totitems[tg]][10] === 42026) {
						if (PetFoodList[Totitems[tg]]) {
							PetFoodList[Totitems[tg]] += 1;
						}
						else {
							PetFoodList[Totitems[tg]] = 1;
							PetFoodList['Count'] += 1;
						}
					}
					/// keys
					var lastword = window.items[Totitems[tg]][0].split(" ");
					var itemtype = lastword[lastword.length - 1];
					var itemtype2 = lastword[lastword.length - 2];
					// if(itemtype == "Key") {
					if(window.items[Totitems[tg]][10] === 42013 || window.items[Totitems[tg]][10] === 42014) {
						if (KeyList[Totitems[tg]]) {
							KeyList[Totitems[tg]] += 1;
						}
						else {
							KeyList[Totitems[tg]] = 1;
							KeyList['Count'] += 1;
						}
					}
					
					/// cloth
					else if(itemtype == "Cloth" || itemtype2 == "Cloth" && itemtype != "Armor") {
						if (ClothList[Totitems[tg]]) {
							ClothList[Totitems[tg]] += 1;
						}
						else {
							ClothList[Totitems[tg]] = 1;
							ClothList['Count'] += 1;
						}
					}
					
					/// dye
					else if(itemtype == "Dye" || itemtype2 == "Dye" && itemtype != "Armor") {
					// else if(window.items[Totitems[tg]][10] === 42015) {
						if (DyeList[Totitems[tg]]) {
							DyeList[Totitems[tg]] += 1;
						}
						else {
							DyeList[Totitems[tg]] = 1;
							DyeList['Count'] += 1;
						}
					}
					
					/// skin
					// else if(itemtype == "Skin" || itemtype2 == "Skin" && itemtype == "(SB)") {
					else if( window.items[Totitems[tg]][10] === 42016 || window.items[Totitems[tg]][10] === 42027) {
						if (SkinList[Totitems[tg]]) {
							SkinList[Totitems[tg]] += 1;
						}
						else {
							SkinList[Totitems[tg]] = 1;
							SkinList['Count'] += 1;
						}
					}
				}
			}
			if (this.opt('wabanitem')) {
				/// pots + marks + buffs
				// MaxLines = Math.ceil((PotList['Count'] + MarkList['Count'] + BuffList['Count']) / MaxItems);
				MaxLines = Math.ceil((PotList['Count'] + PotionList['Count'] + MarkList['Count'] + BuffList['Count'] + KeyList['Count'] + PetFoodList['Count'] + SkinList['Count']) / MaxItems);
				CharNumData.push('<div class="flex-container" style="flex-direction: row">');
				
				if (PotList['Count'] > 0) {
					CharNumData.push('<div class="flex-container" style="flex-direction: column; border: solid 2px grey"><div class="flex-container" style="flex-direction: row;">Left to Max :</div><div class="flex-container" style="flex-direction: row">');
					for (var i in PotList) {
						if (i !== 'Count') {
							if (stupidvar === Math.ceil(PotList['Count'] / MaxLines)) {
								CharNumData.push('</div><div class="flex-container" style="flex-direction: row">');
								stupidvar = 0;
							}
							CharNumData.push('<div class="flex-container item noFlexAutoWidth" style="background-position: -' + window.items[i][3] + 'px -' + window.items[i][4] + 'px; border: solid 1px #000; align-self:center; flex-shrink:0;"><div style="">' + PotList[i] + '</div></div>');
							stupidvar++;
						}
					}
					stupidvar = 0;
					CharNumData.push('</div></div>'); 
				}
				
				if (PotionList['Count'] > 0) {
					CharNumData.push('<div class="flex-container" style="flex-direction: column; border: solid 2px grey"><div class="flex-container" style="flex-direction: row;">Pots on Account :</div><div class="flex-container" style="flex-direction: row">');
					for (var i in PotionList) {
						if (i !== 'Count') {
							if (stupidvar === Math.ceil(PotionList['Count'] / MaxLines)) {
								CharNumData.push('</div><div class="flex-container" style="flex-direction: row">');
								stupidvar = 0;
							}
							CharNumData.push('<div class="flex-container item noFlexAutoWidth" style="background-position: -' + window.items[i][3] + 'px -' + window.items[i][4] + 'px; border: solid 1px #000; align-self:center; flex-shrink:0;"><div style="">' + PotionList[i] + '</div></div>');
							stupidvar++;
						}
					}
					stupidvar = 0;
					CharNumData.push('</div></div>'); 
				}
				
				if (MarkList['Count'] > 0) {
					CharNumData.push('<div class="flex-container" style="flex-direction: column; border: solid 2px grey"><div class="flex-container" style="flex-direction: row;">Marks and Events :</div><div class="flex-container" style="flex-direction: row">');
					for (var i in MarkList) {
						if (i !== 'Count') {
							if (stupidvar === Math.ceil(MarkList['Count'] / MaxLines)) {
								CharNumData.push('</div><div class="flex-container" style="flex-direction: row">');
								stupidvar = 0;
							}
							CharNumData.push('<div class="flex-container item noFlexAutoWidth" style="background-position: -' + window.items[i][3] + 'px -' + window.items[i][4] + 'px; border: solid 1px #000; align-self:center; flex-shrink:0;"><div style="">' + MarkList[i] + '</div></div>');
							stupidvar++;
						}
					}
					stupidvar = 0;
					CharNumData.push('</div></div>'); 
				}
				
				if (BuffList['Count'] > 0) {
					CharNumData.push('<div class="flex-container" style="flex-direction: column; border: solid 2px grey"><div class="flex-container" style="flex-direction: row;">Buffs :</div><div class="flex-container" style="flex-direction: row">');
					for (var i in BuffList) {
						if (i !== 'Count') {
							if (stupidvar === Math.ceil(BuffList['Count'] / MaxLines)) {
								CharNumData.push('</div><div class="flex-container" style="flex-direction: row">');
								stupidvar = 0;
							}
							CharNumData.push('<div class="flex-container item noFlexAutoWidth" style="background-position: -' + window.items[i][3] + 'px -' + window.items[i][4] + 'px; border: solid 1px #000; align-self:center; flex-shrink:0;"><div style="">' + BuffList[i] + '</div></div>');
							stupidvar++;
						}
					}
					stupidvar = 0;
					CharNumData.push('</div></div>'); 
				}
				
				// CharNumData.push('</div>');
				
				/// keys + petfood + skins
				// MaxLines = Math.ceil((KeyList['Count'] + PetFoodList['Count'] + SkinList['Count']) / MaxItems);
				// CharNumData.push('<div>\xa0</div><div class="flex-container" style="flex-direction: row">');
				
				if (KeyList['Count'] > 0) {
					CharNumData.push('<div class="flex-container" style="flex-direction: column; border: solid 2px grey"><div class="flex-container" style="flex-direction: row;">Keys :</div><div class="flex-container" style="flex-direction: row">');
					for (var i in KeyList) {
						if (i !== 'Count') {
							if (stupidvar === Math.ceil(KeyList['Count'] / MaxLines)) {
								CharNumData.push('</div><div class="flex-container" style="flex-direction: row">');
								stupidvar = 0;
							}
							CharNumData.push('<div class="flex-container item noFlexAutoWidth" style="background-position: -' + window.items[i][3] + 'px -' + window.items[i][4] + 'px; border: solid 1px #000; align-self:center; flex-shrink:0;"><div style="">' + KeyList[i] + '</div></div>');
							stupidvar++;
						}
					}
					stupidvar = 0;
					CharNumData.push('</div></div>'); 
				}
				
				if (PetFoodList['Count'] > 0) {
					CharNumData.push('<div class="flex-container" style="flex-direction: column; border: solid 2px grey"><div class="flex-container" style="flex-direction: row;">Pet Food :</div><div class="flex-container" style="flex-direction: row">');
					for (var i in PetFoodList) {
						if (i !== 'Count') {
							if (stupidvar === Math.ceil(PetFoodList['Count'] / MaxLines)) {
								CharNumData.push('</div><div class="flex-container" style="flex-direction: row">');
								stupidvar = 0;
							}
							CharNumData.push('<div class="flex-container item noFlexAutoWidth" style="background-position: -' + window.items[i][3] + 'px -' + window.items[i][4] + 'px; border: solid 1px #000; align-self:center; flex-shrink:0;"><div style="">' + PetFoodList[i] + '</div></div>');
							stupidvar++;
						}
					}
					stupidvar = 0;
					CharNumData.push('</div></div>'); 
				}
				
				if (SkinList['Count'] > 0) {
					CharNumData.push('<div class="flex-container" style="flex-direction: column; border: solid 2px grey"><div class="flex-container" style="flex-direction: row;">Skins :</div><div class="flex-container" style="flex-direction: row">');
					for (var i in SkinList) {
						if (i !== 'Count') {
							if (stupidvar === Math.ceil(SkinList['Count'] / MaxLines)) {
								CharNumData.push('</div><div class="flex-container" style="flex-direction: row">');
								stupidvar = 0;
							}
							CharNumData.push('<div class="flex-container item noFlexAutoWidth" style="background-position: -' + window.items[i][3] + 'px -' + window.items[i][4] + 'px; border: solid 1px #000; align-self:center; flex-shrink:0;"><div style="">' + SkinList[i] + '</div></div>');
							stupidvar++;
						}
					}
					stupidvar = 0;
					CharNumData.push('</div></div>'); 
				}
				
				CharNumData.push('</div>');
			}
			
			if (this.opt('wabanut')) {
				/// Whites	
				var MaxLines = Math.ceil((WhiteList['Count'] + UTList['Count'] + STList['Count']) / MaxItems);
				CharNumData.push('<div class="flex-container" style="flex-direction: row">');
				if (WhiteList['Count'] > 0) {
					CharNumData.push('<div class="flex-container" style="flex-direction: column; border: solid 2px grey"><div class="flex-container" style="flex-direction: row">Whites :</div><div class="flex-container" style="flex-direction: row">');
					for (var i in WhiteList) {
						if (i !== 'Count') {
							if (stupidvar === Math.ceil(WhiteList['Count'] / MaxLines)) {
								CharNumData.push('</div><div class="flex-container" style="flex-direction: row">');
								stupidvar = 0;
							}
							CharNumData.push('<div class="flex-container item noFlexAutoWidth" style="background-position: -' + window.items[i][3] + 'px -' + window.items[i][4] + 'px; border: solid 1px #000; align-self:center; flex-shrink:0;"><div style="">' + WhiteList[i] + '</div></div>');
							stupidvar++;
						}
					}
					stupidvar = 0;
					CharNumData.push('</div></div>'); 
				}
				if (STList['Count'] > 0) {
					CharNumData.push('<div class="flex-container" style="flex-direction: column; border: solid 2px grey"><div class="flex-container" style="flex-direction: row">ST :</div><div class="flex-container" style="flex-direction: row">');
					for (var i in STList) {
						if (i !== 'Count') {
							if (stupidvar === Math.ceil(STList['Count'] / MaxLines)) {
								CharNumData.push('</div><div class="flex-container" style="flex-direction: row">');
								stupidvar = 0;
							}
							CharNumData.push('<div class="flex-container item noFlexAutoWidth" style="background-position: -' + window.items[i][3] + 'px -' + window.items[i][4] + 'px; border: solid 1px #000; align-self:center; flex-shrink:0;"><div style="">' + STList[i] + '</div></div>');
							stupidvar++;
						}
					}
					stupidvar = 0;
					CharNumData.push('</div></div>'); 
				}
				if (UTList['Count'] > 0) {
					CharNumData.push('<div class="flex-container" style="flex-direction: column; border: solid 2px grey"><div class="flex-container" style="flex-direction: row">Other UT :</div><div class="flex-container" style="flex-direction: row">');
					for (var i in UTList) {
						if (i !== 'Count') {
							if (stupidvar === Math.ceil(UTList['Count'] / MaxLines)) {
								CharNumData.push('</div><div class="flex-container" style="flex-direction: row">');
								stupidvar = 0;
							}
							CharNumData.push('<div class="flex-container item noFlexAutoWidth" style="background-position: -' + window.items[i][3] + 'px -' + window.items[i][4] + 'px; border: solid 1px #000; align-self:center; flex-shrink:0;"><div style="">' + UTList[i] + '</div></div>');
							stupidvar++;
						}
					}
					stupidvar = 0;
					CharNumData.push('</div></div>'); 
				}
				
				CharNumData.push('</div>');
			}
			/////////////////////////////////
				
			// var wat = this.opt('watype');
			// if (wat == "withdye")
			// {
			if (this.opt('wabandye')) {
				/// clothes + dyes	
				var MaxLines = Math.ceil((ClothList['Count'] + DyeList['Count']) / MaxItems);
				CharNumData.push('<div class="flex-container" style="flex-direction: row">');
				if (ClothList['Count'] > 0) {
					CharNumData.push('<div class="flex-container" style="flex-direction: column; border: solid 2px grey"><div class="flex-container" style="flex-direction: row">Clothes :</div><div class="flex-container" style="flex-direction: row">');
					for (var i in ClothList) {
						if (i !== 'Count') {
							if (stupidvar === Math.ceil(ClothList['Count'] / MaxLines)) {
								CharNumData.push('</div><div class="flex-container" style="flex-direction: row">');
								stupidvar = 0;
							}
							CharNumData.push('<div class="flex-container item noFlexAutoWidth" style="background-position: -' + window.items[i][3] + 'px -' + window.items[i][4] + 'px; border: solid 1px #000; align-self:center; flex-shrink:0;"><div style="">' + ClothList[i] + '</div></div>');
							stupidvar++;
						}
					}
					stupidvar = 0;
					CharNumData.push('</div></div>'); 
				}
				
				if (DyeList['Count'] > 0) {
					CharNumData.push('<div class="flex-container" style="flex-direction: column; border: solid 2px grey"><div class="flex-container">Dyes :</div><div class="flex-container" style="flex-direction: row">');
					for (var i in DyeList) {
						if (i !== 'Count') {
							if (stupidvar === Math.ceil(DyeList['Count'] / MaxLines)) {
								CharNumData.push('</div><div class="flex-container" style="flex-direction: row">');
								stupidvar = 0;
							}
							CharNumData.push('<div class="flex-container item noFlexAutoWidth" style="background-position: -' + window.items[i][3] + 'px -' + window.items[i][4] + 'px; border: solid 1px #000; align-self:center; flex-shrink:0;"><div style="">' + DyeList[i] + '</div></div>');
							stupidvar++;
						}
					}
					stupidvar = 0;
					CharNumData.push('</div></div>'); 
				}
			}
			
			CharNumData.push('</div>');
					
			setuptools.app.muledump.tooltip($name, 'autoHeight', CharNumData.join(' '));
		
		// }
		///dungeon stats
		
		DungeonStatsHtml.push('<div class="flex-container" style="flex-direction: column; font-size:1.3em; font-weight:700">Dungeons Complete :\xa0<div class="flex-container" style="flex-direction: row"><div class="flex-container" style="flex-direction: column"><div class="flex-container" style="flex-direction: row"></div><div class="flex-container" style="flex-direction: column;">');
		for (var i = 0; i < DungeonStats.length; i++) {
			if (stupidvar === 10) {
				DungeonStatsHtml.push('</div></div><div class="flex-container" style="flex-direction: row"><div class="flex-container" style="flex-direction: column;">');
				stupidvar = 0;
			}
			DungeonStatsHtml.push('<div class="flex-container noFlexAutoWidth" style="flex-shrink:0; flex-direction: row">' + DungeonStats[i].Dungeon + ' : ' + '<div style="flex-shrink:0; flex-direction: row">' + DungeonStats[i].Number + '</div></div>');
			stupidvar++;
		}
		stupidvar = 0;
		DungeonStatsHtml.push('</div></div></div>'); 
		
		setuptools.app.muledump.tooltip(dungeonbutton, 'autoHeight', DungeonStatsHtml.join(''));
		// setuptools.lightbox.build('dungeon', DungeonStatsHtml.join(''));
		
		DungeonStatsHtml = [];
		
		// console.log(window.items);
		///wawawa end
		
        if (!this.opt('shrink') && f) {
            this.dom.append($('<hr class="chars">'));
            maketable('chars', arr).appendTo(this.dom);
        }
        arr = [];

        //  record cummulative timing data
        if ( typeof timing.aggregate['mule-mainCharLoopTimer'] === 'object' ) setuptools.app.ga('timing', {
            category: 'mule',
            key: 'parseMainCharacterLoop',
            value: timing.aggregate['mule-mainCharLoopTimer'].mean
        });

        function makechest(items, classname, line) {
			if (!line)
				line = false;
            var il = setuptools.app.muledump.item_listing(items.slice(0, 8), classname, undefined, line)
            return $('<div class="items">').append(il)
        }
		
		function arrangechests(v, sort) {
			var block = []
			for (i = 0; i <= v.length; i+=8)
			{
				var chest = ""
				for (j = 0; j < 8; j++)
				{
					if (j === 7)
					{
						if (v[i+j] === undefined)
						{
							chest += "-1"
						}
						else
						{
							chest += v[i+j]
						}
					}
					else
					{
						if (v[i+j] === undefined)
						{
							chest += "-1,"
						}
						else
						{
							chest += v[i+j] + ","
						}
					}
				}
				block.push(chest)
			}
			v = block
			var length = v.length
			var maxwidth = vaultwidth
			if (sort === true)
			{
				maxwidth = Math.floor(Number(setuptools.data.config.rowlength) / 2)
				if (!d.Char.length)
				{
					maxwidth = 1
				}
				if (maxwidth >  Math.floor(d.Char.length / 2))
				{
					maxwidth =  Math.floor(d.Char.length / 2)
				}
			}
			var percolumn = Math.floor(length / maxwidth)
			var rest = length % maxwidth
			if (percolumn === 0)
			{
				percolumn = rest
				rest = 0
			}
			
			var newR = []
			if (rest === 0) {
				for (j = 0; j < percolumn; j++)	{
					var colIndex = percolumn 
					for (i = j; i <= length; i+=colIndex) {
						var cVault = v[i];
						if (typeof cVault !== 'undefined') {
							newR.push(cVault);
						}
					}
				}
			}
			else {
				for (j = 0; j <= percolumn; j++) {
					var colIndex = percolumn + 1
					var count = 1
					for (i = j; i <= length; i+=colIndex) {
						if (count > rest) {
							colIndex = percolumn 
							if (j == percolumn) {
								continue
							}
						}
						var cVault = v[i];
						if (typeof cVault !== 'undefined') {
							newR.push(cVault);
						}
						count++
					}
				}
				count = 0
			}
			return [maxwidth, newR];
		}
		
		function arrangevaults(v, sort) {
			//  moving that here
			var r = [], i, j;
			var length = 0
			for (i = 0; i < VAULTORDER.length; i++) {
				if (i % vaultwidth === 0 && r.length) {
					for (j = 0; j < r.length; j++) if (r[j]) break;
					if (j >= r.length) r = [];
				}
				var c = v[VAULTORDER[i] - 1];
				if (typeof c !== 'undefined') {
					r.push(c);
					length += 1
				}
				else
				{
					r.push(0);
				}
			}
			var maxwidth = vaultwidth
			if (sort === true)
			{
				maxwidth = Math.floor(Number(setuptools.data.config.rowlength) / 2)
				if (!d.Char.length)
				{
					maxwidth = 1
				}
				if (maxwidth >  Math.floor(d.Char.length / 2))
				{
					maxwidth =  Math.floor(d.Char.length / 2)
				}
			}
			if (sort === false)
			{
				maxwidth = Math.floor(Number(setuptools.data.config.rowlength) / 2)
			}
			var percolumn = Math.floor(length / maxwidth)
			var rest = length % maxwidth
			if (percolumn === 0)
			{
				percolumn = rest
				rest = 0
			}
			
			var newR = []
			if (rest === 0) {
				for (j = 0; j < percolumn; j++)	{
					var colIndex = percolumn 
					for (i = j; i <= length; i+=colIndex) {
						var cVault = v[i];
						if (typeof cVault !== 'undefined') {
							newR.push(cVault);
						}
					}
				}
			}
			else {
				for (j = 0; j <= percolumn; j++) {
					var colIndex = percolumn + 1
					var count = 1
					for (i = j; i <= length; i+=colIndex) {
						if (count > rest) {
							colIndex = percolumn 
							if (j == percolumn) {
								continue
							}
						}
						var cVault = v[i];
						if (typeof cVault !== 'undefined') {
							newR.push(cVault);
						}
						count++
					}
				}
				count = 0
			}
			return [maxwidth, newR];
		}
		
        // select the vault order for this char
        vaultlayout = ( this.opt('vaultlayout') ) ? this.opt('vaultlayout') : window.vaultlayout;
		vaultwidth = ( typeof window.vaultorders[vaultlayout] === 'object' && window.vaultorders[vaultlayout].vaultwidth ) ? (window.vaultorders[vaultlayout].vaultwidth / 2) : (ROW / 2);
        VAULTORDER = window.vaultorders[vaultlayout].vaultorder;

		//  vaults
        var chests;
        if ( d.Account.Vault && this.totals.cache === false ) {

            //  counting for totals
            chests = d.Account.Vault ? d.Account.Vault.Chest || ['-1'] : ['-1'];
            if (typeof chests === 'string') chests = [chests];
            if ( typeof chests === 'object' && Object.keys(chests).length === 0 ) chests = ['-1'];
            if ( Array.isArray(chests) === false ) {
                setuptools.app.techlog('Mule ' + this.guid + ' encountered bad chest data');
                setuptools.app.techlog(chests);
                chests = ['-1'];
            }
            for ( var tv = 0; tv < chests.length; tv++ ) {

                if ( chests[tv] === 0 ) continue;
                if ( typeof chests[tv] !== 'string' ) chests[tv] = '-1';
                if (chest = chests[tv].split(','))
                    for (var tv2 = 0; tv2 < 8; tv2++)
                        this.totals.count(chest[tv2] || '-1', 'vaults');

            }
        }
        //  display vaults
        if (this.opt('vaults')) {

            if ( setuptools.data.config.debugging === true ) setuptools.app.uaTiming('mule', 'parseVaults', 'start', this.guid, false, setuptools.app.uaTimingAggregate);
            if ( this.loginOnly === false && !this.opt('shrink') ) this.dom.append($('<hr class="vaults">'));

            if ( !chests ) {

                chests = d.Account.Vault ? d.Account.Vault.Chest || ['-1'] : ['-1'];
                if (typeof chests === 'string') chests = [chests];
                if (typeof chests === 'object' && Object.keys(chests).length === 0) chests = ['-1'];

            }
			if (this.opt('vaultlayout') === "4")
			{
				var w = arrangevaults(chests, true);
			}
			else if (this.opt('vaultlayout') === "3")
			{
				var w = arrangevaults(chests, false);
			}
			else
			{
				var w = arrangevaults(chests);
			}
            chests = w[1];
            for (var x = 0; x < chests.length; x++) {

                //  non-existent chests are skipped
                if ( typeof chests[x] !== "string" ) {

                    //  this is a spacer
                    if ( chests[x] === 0 ) {

                        arr.push(null);
                        continue;

                    }

                    //  empty chests are empty
                    if ( typeof chests[x] === 'object' ) chests[x] = '-1,-1,-1,-1,-1,-1,-1,-1';

                }

                var chest = (chests[x] || '-1').split(',');
                while (chest.length < 8) chest.push('-1');
				arr.push(makechest(chest, 'vaults', true));
            }
            if ( this.loginOnly === false && !this.opt('shrink') ) maketable('vaults', arr, w[0]).appendTo(this.dom);
            if ( setuptools.data.config.debugging === true ) setuptools.app.uaTiming('mule', 'parseVaults', 'stop', this.guid);
			
			//  potion storage counting for totals
			var potions = d.Account.Potions;
			var items = ( typeof potions === 'string' ) ? potions.split(',') : undefined;
			if ( Array.isArray(items) === true && this.totals.cache === false ) {
				for (var tp = 0; tp < items.length; tp++) {
					if (items[tp] !== "-1") {
						this.totals.count(items[tp], 'potions');
					}
				}
			}
        }
		
	//  display potion storage
        if (this.opt('potions')) {

            if ( setuptools.data.config.debugging === true ) setuptools.app.uaTiming('mule', 'parsePotions', 'start', this.guid, false, setuptools.app.uaTimingAggregate);
            if ( this.loginOnly === false && !this.opt('shrink') ) {
                this.dom.append($('<hr class="potions">'));
                if ( Array.isArray(items) === true ) {

                    var counters = [{item: "-1", count: 0}];
                    for (var tp = 0; tp < items.length; tp++) {
                        if (items[tp] >= 0x2368) {
                            // Greater potions take two slots in the client but not the API
                            counters[0].count--;
                        }
						let res = items[tp].split('#')[0]
						if(res !== null) items[tp] = res;
                        var ndx = counters.findIndex(c => c.item === items[tp]);
                        if (ndx === -1) {
                            counters.push({item: items[tp], count: 1});
                        } else {
                            counters[ndx].count++;
                        }
                    }
                    counters.sort((a,b) => {
                        if (a.item === "-1") {
                            return 1;
                        } else if (b.item === "-1") {
                            return -1;
                        } else {
                            return a.item - b.item;
                        }
                    });

                    var r = $('<div class="itemsc potions noselect">');
                    for (var tp = 0; tp < counters.length; tp++) {
                        if (counters[tp].count > 0) {
                            setuptools.app.muledump.item(counters[tp].item, undefined, counters[tp].count, undefined).appendTo(r);
                        }
                    }
                    $('<div class="items">').append(r).appendTo(this.dom);
                }
            }
            if ( setuptools.data.config.debugging === true ) setuptools.app.uaTiming('mule', 'parsePotions', 'stop', this.guid);

        }
		
        //  gift chests counting for totals
        var gifts = d.Account.Gifts;
        var items = ( typeof gifts === 'string' ) ? gifts.split(',').reverse() : undefined;
        if ( Array.isArray(items) === true && this.totals.cache === false ) {
            for (var tg = 0; tg < items.length; tg++) {
                this.totals.count(items[tg], 'gifts');
			}
        }

        //  display gift chests
        if (this.opt('gifts')) {

            if ( setuptools.data.config.debugging === true ) setuptools.app.uaTiming('mule', 'parseGifts', 'start', this.guid, false, setuptools.app.uaTimingAggregate);
            if ( this.loginOnly === false && !this.opt('shrink') ) this.dom.append($('<hr class="gifts">'));
            if ( Array.isArray(items) === true ) {

                var garr = [];
				var w = arrangechests(items, true);
				items = w[1];
				
				for (var x = 0; x < items.length; x++) {

					//  non-existent chests are skipped
					if ( typeof items[x] !== "string" ) {

						//  this is a spacer
						if ( items[x] === 0 ) {

							garr.push(null);
							continue;

						}

						//  empty chests are empty
						if ( typeof items[x] === 'object' ) items[x] = '-1,-1,-1,-1,-1,-1,-1,-1';

					}

					var item = (items[x] || '-1').split(',');
					while (item.length < 8) item.push("-1");
					garr.push(makechest(item, 'gifts', true));
				}
				if ( this.loginOnly === false && !this.opt('shrink') ) maketable('gifts', garr, w[0]).appendTo(this.dom);
            }
            if ( setuptools.data.config.debugging === true ) setuptools.app.uaTiming('mule', 'parseGifts', 'stop', this.guid);

        }
        setuptools.app.uaTiming('mule', 'parse', 'stop', this.guid);

        if ( this.totals.cache === false ) {
            this.totals.save();
            this.redoTotals = true;
        }

        if ( this.loginOnly === false ) {

            var original = this.loaded;
            this.loaded = true;
            this.dom.css('display', 'inline-block');
            relayout(( original === false || this.redoTotals === true ) ? undefined : false);

        }

        //  hotkey for creating image of mule
        this.dom.on('click.mule.screenshot', function(e) {
            var dom = $(this)[0];
             //  this does not work as intended; need to clone somehow instead: // $(dom).find('.button').remove();
            if ( setuptools.app.muledump.keys(['ctrl','shift'], e) === true ) setuptools.app.muledump.exporter.canvas(dom);
        });

        //  hotkey for creating image of all chars
        this.dom.find('table.chars').on('click.chars.screenshot', function(e) {
            if ( setuptools.app.muledump.keys(['ctrl','shift'], e) === true ) setuptools.app.muledump.exporter.canvas($(this)[0]);
        });

        //  hotkey for creating image of a char
        this.dom.find('table.chars > tr > td.cont').on('click.char.screenshot', function(e) {
            if ( setuptools.app.muledump.keys(['ctrl','shift'], e) === true ) setuptools.app.muledump.exporter.canvas($(this)[0]);
        });

        //  hotkey for creating image of specific vault
        this.dom.find('table.vaults > tr > td.cont').on('click.vault.screenshot', function(e) {
            if ( setuptools.app.muledump.keys(['ctrl','shift'], e) === true ) setuptools.app.muledump.exporter.canvas($(this)[0]);
        });

        //   hotkey for creating image of gift chests
        this.dom.find('table.gifts').on('click.gifts.screenshot', function(e) {
            if ( setuptools.app.muledump.keys(['ctrl','shift'], e) === true ) setuptools.app.muledump.exporter.canvas($(this)[0]);
        });
		// console.log(window.items[8848][10]);
    };

    window.Mule = Mule


})($, window);
