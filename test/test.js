var assert = require("chai").assert
var be2bill = require('../lib/be2bill')({
  identifier: 'yourIdentifier',
  password: 'yourPassword'
})

describe('be2bill', function(){

  before(function(done){
    done()
  })

  beforeEach(function(done){
    done()
  })

  var payment, authorization, alias

  it('authorization', function(done){

    be2bill.authorization({ 
      amount: 400, 
      cardcode: '4111111111111111',
      cardcvv: '123',
      cardvaliditydate: '12-14',
      cardfullname: 'John Smith',
      createalias: true
    }, function(err, res, body){
      if (err) throw err
      assert.equal(body.EXECCODE, '0000')
      authorization = body.TRANSACTIONID
      done()
    })

  })

  it('payment', function(done){

    be2bill.payment({ 
      amount: 400, 
      cardcode: '4111111111111111',
      cardcvv: '123',
      cardvaliditydate: '12-14',
      cardfullname: 'John Smith',
      createalias: true
    }, function(err, res, body){
      if (err) throw err
      assert.equal(body.EXECCODE, '0000')
      alias = body.ALIAS
      payment = body.TRANSACTIONID
      done()
    })

  })

  it('payment with alias', function(done){

    be2bill.payment({ 
      amount: 400, 
      alias: alias,
      aliasmode: 'oneclick'
    }, function(err, res, body){
      if (err) throw err
      assert.equal(body.EXECCODE, '0000')
      alias = body.ALIAS
      payment = body.TRANSACTIONID
      done()
    })

  })

  it('refund', function(done){

    be2bill.refund({ 
      transactionid: payment
    }, function(err, res, body){
      if (err) throw err
      assert.equal(body.EXECCODE, '0000')
      done()
    })

  })

  it('credit', function(done){

    be2bill.credit({ 
      amount: 400,
      alias: alias,
      aliasmode: 'oneclick'
    }, function(err, res, body){
      if (err) throw err
      assert.equal(body.EXECCODE, '0000')
      done()
    })

  })

  it('capture', function(done){

    be2bill.capture({ 
      transactionid: authorization
    }, function(err, res, body){
      if (err) throw err
      assert.equal(body.EXECCODE, '0000')
      done()
    })

  })

})