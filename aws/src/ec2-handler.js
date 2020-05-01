"use strict";

/*
** Lambda for EC2 start/stop
** event description ->
** {
**   id     : ec2id
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
                        return reject(new Error("Error"));
                    } else if (data) {
                        return resolve("Success");
                    }
                });
            } else {
                return reject(new Error(err));
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
                        return reject(new Error("Error"));
                    } else if (data) {
                        return resolve("Success");
                    }
                });
            } else {
                return reject(new Error(err));
            }
        });
    });
}

exports.handler = async (event, context, callback) =>
{
    let event_array;
    var responseerr = {
        statusCode: 500,
        body: JSON.stringify("Error"),
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'}
    };
    try {
        event_array = JSON.parse(event.body);
    } catch (err) {
        return callback(null, responseerr);
    }
    const ec2id = event_array.id;
    const action = event_array.action;
    if (action === "START" && !(await ec2_start(ec2id)))
        return callback(null, responseerr);
    else if (action === "STOP" && !(await ec2_stop(ec2id)))
        return callback(null, responseerr);
    else
        return callback(null, responseerr);
    return callback(null, {
        statusCode: 200,
        body: JSON.stringify("Success"),
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin':'*'}
    });
};