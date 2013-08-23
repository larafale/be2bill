var _ = require('lodash')
var request = require('request')
var crypto = require('crypto')
var utils = require('./utils')

module.exports = function(options) {

  options = _.extend(options || {}, {
    url: 'https://secure-test.be2bill.com/front/service/rest/process.php',
    version: '2.0'
  })

  return {

    request: function(method, params, cb){

      if(!options.identifier || !options.password) return cb('provide identifier & password')

      // default attented params
      params = _.extend(params, { 
        identifier: options.identifier, 
        version: options.version
      })

      // generate hash
      params.hash = this.sign(params)

      // url encode params for body request
      params = this.parametize(method, params)

      // make the call
      request.post({ 
        url: options.url, 
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, 
        body: params 
      }, function(err, res, body){

        if(err) return cb(err)

        // parse content
        try {

          body = JSON.parse(body)
          cb(err || (body.EXECCODE != "0000" ? body.MESSAGE : null), res, body)

        }catch(e){

          cb(err)

        }

      })
    },

    payment: function(params, cb){

      // default attented params
      params = _.extend(params, { 
        operationtype: 'payment',
        description: utils.random(),
        clientreferrer: utils.random(),
        clientuseragent: utils.random(),
        clientemail: utils.random() + '@gmail.com', 
        clientident: utils.random(),
        orderid: utils.random(),
        clientip: '127.127.127.127'
      })

      this.request('payment', params, cb)

    }, 

    authorization: function(params, cb){
      
      // default attented params
      params = _.extend(params, { 
        operationtype: 'authorization',
        description: utils.random(),
        clientreferrer: utils.random(),
        clientuseragent: utils.random(),
        clientemail: utils.random() + '@gmail.com', 
        clientident: utils.random(),
        orderid: utils.random(),
        clientip: '127.127.127.127'
      })

      this.request('authorization', params, cb)

    }, 

    capture: function(params, cb){
      
      // default attented params
      params = _.extend(params, { 
        operationtype: 'capture',
        description: utils.random(),
        orderid: utils.random()
      })

      this.request('capture', params, cb)

    },

    refund: function(params, cb){
      
      // default attented params
      params = _.extend(params, {
        operationtype: 'refund', 
        description: utils.random(),
        orderid: utils.random()
      })

      this.request('refund', params, cb)

    }, 

    credit: function(params, cb){

      // default attented params
      params = _.extend(params, {
        operationtype: 'credit', 
        description: utils.random(),
        clientreferrer: utils.random(),
        clientuseragent: utils.random(),
        clientemail: utils.random() + '@gmail.com', 
        clientident: utils.random(),
        orderid: utils.random(),
        clientip: '127.127.127.127'
      })

      this.request('credit', params, cb)

    }, 

    // sign request & return hash
    sign: function(params){

      var sorted = _.map(params, function(val, key){ return key.toUpperCase()+'='+val }).sort() // sort params
        , string = options.password + sorted.join(options.password) + options.password // join with password

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