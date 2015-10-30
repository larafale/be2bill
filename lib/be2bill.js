var _ = require('lodash')
var request = require('request')
var crypto = require('crypto')
var utils = require('./utils')
var codes = require('./codes.json')

module.exports = function(options) {

  options = _.extend(options || {}, {
    version: '2.0',
    url: options.production
      ? 'https://secure-magenta1.be2bill.com/front/service/rest/process.php'
      : 'https://secure-test.be2bill.com/front/service/rest/process.php'
  })

  return {

    request: function(method, params, cb){

      if(!options.identifier || !options.password) 
        return cb('provide identifier & password')

      // default attented params
      params = _.extend(params, { 
        identifier: options.identifier, 
        version: options.version
      })

      // generate hash
      params.hash = this.sign(params)

      // url encode params for body request
      params = this.parametize(method, params)

      if(options.debug) console.log(params)

      // make the call (everything is POST)
      request.post({ 
        url: options.url, 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, 
        body: params,
        strictSSL: true
      }, function(err, res, body){

        if(err) 
          return cb(err)

        // parse content
        try {
          body = JSON.parse(body)
        }catch(e){
          console.log('catch')
          cb(err||{})
        }

        // nice error message
        var errBe2bill = false

        if(body.EXECCODE != "0000"){
          if(_.contains(['1001', '1002'], body.EXECCODE)){
            var s = codes[body.EXECCODE].split('X')
            s[2] = s[1]
            s[1] = '"'+body.MESSAGE.split('"')[1]+'"'
            errBe2bill = new Error(s.join(''))
            errBe2bill.code = body.EXECCODE
          }else{
            errBe2bill = new Error(codes[body.EXECCODE])
            errBe2bill.code = body.EXECCODE
          }
        }

        cb(err || errBe2bill, res, body)

      })
    },

    payment: function(params, cb){

      // default attented params
      params = _.extend({ 
        operationtype: 'payment',
        description: utils.random(),
        clientreferrer: utils.random(),
        clientuseragent: utils.random(),
        clientemail: utils.random() + '@gmail.com', 
        clientident: utils.random(),
        orderid: utils.random(),
        clientip: '127.127.127.127'
      }, params)

      this.request('payment', params, cb)

    }, 

    authorization: function(params, cb){
      
      // default attented params
      params = _.extend({ 
        operationtype: 'authorization',
        description: utils.random(),
        clientreferrer: utils.random(),
        clientuseragent: utils.random(),
        clientemail: utils.random() + '@gmail.com', 
        clientident: utils.random(),
        orderid: utils.random(),
        clientip: '127.127.127.127'
      }, params)

      this.request('authorization', params, cb)

    }, 

    capture: function(params, cb){
      
      // default attented params
      params = _.extend({ 
        transactionid: '',
        operationtype: 'capture',
        description: utils.random(),
        orderid: utils.random()
      }, params)

      this.request('capture', params, cb)

    },

    refund: function(params, cb){
      
      // default attented params
      params = _.extend({
        operationtype: 'refund', 
        description: utils.random(),
        orderid: utils.random()
      }, params)

      this.request('refund', params, cb)

    }, 

    credit: function(params, cb){

      // default attented params
      params = _.extend({
        operationtype: 'credit', 
        description: utils.random(),
        clientreferrer: utils.random(),
        clientuseragent: utils.random(),
        clientemail: utils.random() + '@gmail.com', 
        clientident: utils.random(),
        orderid: utils.random(),
        clientip: '127.127.127.127'
      }, params)

      this.request('credit', params, cb)

    }, 

    // sign request & return hash
    sign: function(params){

      var sorted = _.map(params, function(val, key){ return key.toUpperCase()+'='+val }).sort() // sort params
        , string = options.password + sorted.join(options.password) + options.password // join with password

      // console.log('---------')
      // console.log(string)
      // console.log('---------')

      return crypto.createHash('sha256').update(string).digest('hex')

    },

    // return url encoded request body
    parametize: function(method, params){

      //too bad be2bill use nested level params :(
      var topLevel = 'method=' + method + '&'
        , secondLevel = _.map(params, function(val, key){ return "params["+ key.toUpperCase()+"]="+val }).sort().join('&')

      return topLevel + secondLevel

    }

  }

}