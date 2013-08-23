module.exports.random       = function(len){ var pos, charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', random  = ''; for (var i = 0; i < (len||6); i++) { pos = Math.floor(Math.random() * charSet.length); random += charSet.substring(pos, pos+1); } return random; }
module.exports.nextUrl      = function(url, page, field){ url = url.split('&page=')[0]; return url + (/\?/.test(url) ? '&' : '?') + (field || 'page') + '=' + (page+1) }
module.exports.randomToken  = function(){ return require('crypto').createHash('md5').update(module.exports.random(8)).digest("hex") }
module.exports.salt         = function(){ return Math.round((new Date().valueOf() * Math.random())) + '' }
module.exports.encrypt      = function(password, salt){ return require('crypto').createHmac('sha1', salt).update(password).digest('hex') }
module.exports.ucfirst      = function(string, lower){ return string.charAt(0).toUpperCase() + (lower ? string.slice(1) : string.slice(1).toLowerCase()) }
module.exports.round        = function(num, decimals){ decimals = decimals || 2; return Math.round(num*Math.pow(10,decimals))/Math.pow(10,decimals) }
module.exports.toObjectKey  = function(arr, key){ var object = {}; for(var i=0; i<arr.length; i++) object[arr[i][key]] = arr[i]; return object; }
module.exports.paddy        = function(n, p, c){ var pad_char = typeof c !== 'undefined' ? c : '0'; var pad = new Array(1 + p).join(pad_char); return (pad + n).slice(-pad.length); }