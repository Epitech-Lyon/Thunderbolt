"use strict";

/*
** Lambda for EC2 start/stop
** event description ->
** {
**   ec2ids : [ec2id, ...]
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

exports.handler = async (event, context, callback) =>
{
    let event_array;
    var promised;
    var response = {
        statusCode: 500,
        body: "Unknow command",
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'}
    };
    try {
        event_array = JSON.parse(event.body);
    } catch (err) {
        response.body = "Parser fail"
        return callback(null, response);
    }
    const ec2id = event_array.ec2ids;
    const action = event_array.action;
    if (action === "START")
        promised = await ec2_start(ec2id);
    else if (action === "STOP")
        promised = await ec2_stop(ec2id);
    else
        return callback(null, response);
    response.body = promised;
    return callback(null, response);
};