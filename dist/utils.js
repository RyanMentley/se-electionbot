"use strict";

const path = require('path');

const https = require('https');

const express = require('express');

module.exports = {
  staticServer: function staticServer() {
    const app = express().set('port', process.env.PORT || 5000);
    const staticPath = path.join(__dirname, '../static');
    app.use('/', express.static(staticPath));
    app.listen(app.get('port'), () => {
      console.log("INIT - Node app ".concat(staticPath, " is listening on port ").concat(app.get('port'), "."));
    });
    process.on('SIGINT', function () {
      app.close(function () {
        console.log('gracefully shutting down');
      });
    });
    return app;
  },
  keepAlive: function keepAlive(url) {
    let mins = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;
    // Fetch endpoint to prevent server from idling
    setInterval(function () {
      https.get(url).on('error', function (err) {
        console.error("ERROR - Keep-alive failed." + err.message);
      });
    }, mins * 60000);
  },
  dateToTimestamp: function dateToTimestamp(date) {
    if (typeof date === 'number') date = new Date(date); // from int

    if (typeof date !== 'object') date = new Date(); // invalid, default to now

    return date.toISOString().replace('T', ' ').replace(/\.\d+/, '');
  }
};