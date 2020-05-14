"use strict";

/*
** Lambda for EC2 start/stop
** event description ->
** {
**   ids : [ids, ...]
**   action : START | STOP
** }
*/

const AWS = require('aws-sdk');
const ec2 = new AWS.EC2();

function ec2_start(id)
{
    return new Promise((resolve, reject) => {
        ec2.startInstances({InstanceIds: id, DryRun: true}, function(err, data) {
            if (err && err.code === 'DryRunOperation') {
                ec2.startInstances({InstanceIds: id, DryRun: false}, function(err, data) {
                    if (err) {
                        return reject(err);
                    } else if (data) {
                        return resolve("Success");
                    }
                });
            } else {
                return reject(err);
            }
        });
    });
}

function ec2_stop(id)
{
    return new Promise((resolve, reject) => {
        ec2.stopInstances({InstanceIds: id, DryRun: true}, function(err, data) {
            if (err && err.code === 'DryRunOperation') {
                ec2.stopInstances({InstanceIds: id, DryRun: false}, function(err, data) {
                    if (err) {
                        return reject(err);
                    } else if (data) {
                        return resolve("Success");
                    }
                });
            } else {
                return reject(err);
            }
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
    if (action === "START")
        promised = await ec2_start(ids);
    else if (action === "STOP")
        promised = await ec2_stop(ids);
    else
        return callback(null, response);
    response.body = promised;
    if (promised == "Success")
        response.statusCode = 200;
    return callback(null, response);
};