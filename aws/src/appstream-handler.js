"use strict";

/*
** Lambda for fleet start/stop
** event description ->
** {
**   fleetids : [ids, ...]
**   action  : START | STOP
** }
*/

const AWS = require('aws-sdk');
const appsteam = new AWS.AppStream();

function fleet_start(ids)
{
    return new Promise((resolve, reject) => {
        const params = {
            Name: ids
        };
        appsteam.startFleet(params, function(err, data) {
            if (err)
                return reject(err);
            else
                return resolve("Success")
        });
    });
}

function fleet_stop(ids)
{
    return new Promise((resolve, reject) => {
        const params = {
            Name: ids
        };
        appsteam.stopFleet(params, function(err, data) {
            if (err)
                return reject(err);
            else
                return resolve("Success")
        });
    });
}
exports.handler = async (event, callback) =>
{
    var promised;
    var response = {
        statusCode: 500,
        body: "Bad data format",
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'}
    };
    try {
        const ids = event.ids;
        const action = event.action;
    } catch (err) {
        return callback(null, response);
    }
    for (let i in ids)
    {
        if (action === "START")
            promised = await fleet_start(ids[i]);
        else if (action === "STOP")
            promised = await fleet_stop(ids[i]);
        else
            return callback(null, response);
    }
    response.body = promised;
    if (promised == "Success")
        response.statusCode = 200;
    return callback(null, response);
};