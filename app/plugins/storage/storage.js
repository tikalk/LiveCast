/**
 * Created with JetBrains WebStorm.
 * User: Arseniy
 * Date: 6/30/13
 * Time: 11:20 AM
 * To change this template use File | Settings | File Templates.
 */
/**
 * Module dependencies.
 */

var options = {
    port: 6379,
    ip: '11.11.11.102'
}

var redis = require('redis');
var client = null;
var exports = {}

function timestamp(){
    return Math.floor((+new Date)/1000);
}

function init(){
    client = redis.createClient(options.port,options.ip);
    
    client.on("error", function (err) {
        exports.onerror.forEach(function(callback){
            try{
                callback(err);
            }
            catch(e){}
        })
        console.log("Redis Error: " + err);
    });
}

exports.get = function(msgType,context,beforeSeconds,callback){
    if(!client) init();
    beforeSeconds = beforeSeconds == -1 ? 0 : timestamp() - beforeSeconds;
    client.zrangebyscore(
        'ZSET:'+msgType+':'+context,
        beforeSeconds,
        '+inf',
        function(err,data){
            if(err) return callback(err);
            var multi = client.multi();
            data.forEach(function(id){
                multi.get('KV:'+msgType+':'+context+':'+id);
            });
            multi.exec(function(err,data){
                if(err) return callback(err);
                var ret = data.map(function(json){
                    return JSON.parse(json);
                });
                callback(null,ret);
            })
    });
}

exports.add = function(msgType,context,data,callback){
    if(!client) init();
    client.incr('INCR:'+msgType+':'+context,function(err,id){
        if(err) return callback(err);
        var dbEntry = {
            id: id,
            time: timestamp(),
            context: context,
            data: data
        };
        client.set('KV:'+msgType+':'+context+':'+id, JSON.stringify(dbEntry,null,'\t'));
        client.zadd('ZSET:'+msgType+':'+context,dbEntry.time,id);
        callback(null,dbEntry.time);
    });
}

exports.onerror = [];

exports.settings = function(opt){
    if(client) client.end();
    options = opt;
    init();
}

module.exports = function(options, imports, register){
    register(null, {
        storage: exports
    });
};