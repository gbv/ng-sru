This repository contains the draft of JavaScript client for the
[Search/Retrieve via URL (SRU)](http://www.loc.gov/standards/sru/) protocol.
The current client is based on [AngularJS](https://angularjs.org/) 1.3, a later
version may also be usable server-side with [node.js](https://nodejs.org/).

## Installation

### bower

```bash
bower install ng-sru --save
```

## Usage

See `demo/index.html`.

## Overview

* `demo/index.html` - sample application
* `ng-sru.js` - AngularJS module
* `microxml.js` - helper module, required by ng-sru.js

## Enabling client-side SRU

To access an SRU-server via client-side JavaScript the server either has to
share a common domain name with the client application or send the
`Access-Control-Allow-Origin` header to support Cross-Origin Resource Sharing
(CORS). This can be achieved by putting the SRU server behind a HTTP proxy:

*the following notes are not tested yet!*

### Apache as CORS proxy

```.bash
$ sudo a2enmod proxy proxy_http headers
$ sudo vim /etc/apache2/mods-enabled/proxy.conf
...
Header add Access-Control-Allow-Origin "*"
Header add Access-Control-Allow-Headers "DNT,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type"
Header add Access-Control-Allow-Methods "GET, OPTIONS"
...
```

### nginx as CORS proxy

```
location /some-path {
    if ($request_method = 'OPTIONS') {
        add_header Access-Control-Allow-Origin "*";
        add_header Access-Control-Allow-Methods "GET, OPTIONS";
        add_header Access-Control-Allow-Headers "DNT,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type";
        add_header Content-Type "text/plain";
        add_header Content-Lengt' 0;
        return 204;
    }
    if ($request_method = 'GET') {
        add_header Access-Control-Allow-Origin "*";
        add_header Access-Control-Allow-Methods "GET, OPTIONS";
        add_header Access-Control-Allow-Headers "DNT,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type";

        proxy_passs http://$arg_uri; # customize this. current setting uses any URI passed as "?uri="
        # proxy_hide_header Access-Control-Allow-Origin;
     }
}
```


