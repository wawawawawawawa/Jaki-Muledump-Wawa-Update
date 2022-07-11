//  support displaying gift chests in the correct order; we'll mimick vaultorders just in case
//  not currently used, but here for reference for the time being
var giftorders = [
    //  giftlayout=0; default view
    {
        layoutname: "Default",
        vaultwidth: 5,
        vaultorder:
            [
                4,  2,  1,  3,  5,
                9,  7,  6,  8,  10,
                14, 12, 11, 13, 15,
                19, 17, 16, 18, 20,
                24, 22, 21, 23, 25,
                29, 27, 25, 28, 30
            ]
    }
];

//  predefined vault layouts
//  see https://github.com/jakcodex/muledump/wiki/Vault+Builder for usage information and warnings
var vaultorders = [
    //  vaultlayout=0; single
    {
        layoutname: "Single Column",
        vaultshowempty: false,
        vaultcompressed: true,
        vaultwidth: 2,
        vaultorder: []
    },
    //  vaultlayout=1; 3
    {
        layoutname: "3 Columns",
        vaultshowempty: false,
        vaultcompressed: true,
        vaultwidth: 6,
        vaultorder: []
    },
    //  vaultlayout=2; 6
    {
        layoutname: "6 Columns",
        vaultshowempty: false,
        vaultcompressed: true,
        vaultwidth: 12,
        vaultorder: []
    },
    //  vaultlayout=3; max
    {
        layoutname: "Max Width",
        vaultshowempty: false,
        vaultcompressed: true,
        vaultwidth: 1000,
        vaultorder: []
    },
    //  vaultlayout=4; smart
    {
        layoutname: "Smart",
        vaultshowempty: false,
        vaultcompressed: true,
        vaultwidth: 1000,
        vaultorder: []
    }
];

//  populate simple view vaultorder
for ( var i = 1; i <= 250; i++ ) 
{
	vaultorders[0].vaultorder.push(i);
	vaultorders[1].vaultorder.push(i);
	vaultorders[2].vaultorder.push(i);
	vaultorders[3].vaultorder.push(i);
	vaultorders[4].vaultorder.push(i);
}

//  used for rate limiting management
var RateLimitExpiration = '';
try {
    RateLimitExpiration = localStorage['muledump:ratelimitexpiration']
} catch(e) {}
if ( !RateLimitExpiration ) RateLimitExpiration = 0;

var RateLimitTimer = false;

//  used for rate limiting management
var RateLimitExpiration2 = '';
try {
    RateLimitExpiration2 = localStorage['muledump:ratelimitexpiration2']
} catch(e) {}
if ( !RateLimitExpiration2 ) RateLimitExpiration2 = 0;

var RateLimitTimer2 = false;

//  optional value; can be a url or base64 image source; if omitted, master/lib/renders.png is used from Github
//  note: I'm choosing to use the Github URL instead of a base64 string here because renders.png is huuuuuuuge in base64
//  var RemoteRendersURL = "";
