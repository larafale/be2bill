be2bill
=========

node be2bill library

## Install


```
npm install be2bill --save
```


## Use


```
var be2bill = require('be2bill')({
  production: true, // call be2bill production url
  identifier: 'yourIdentifier',
  password: 'yourPassword',
})

be2bill.payment({

  amount: 400, // 4 euros
  cardcode: '4111111111111111',
  cardcvv: '123',
  cardvaliditydate: '12-14',
  cardfullname: 'John Smith',
  createalias: true

}, function(err, res, body){
  
  if(err) // manage

  console.log(body)
  // { 
  //   OPERATIONTYPE: 'payment',
  //   TRANSACTIONID: 'A1111446',
  //   EXECCODE: '0000',
  //   MESSAGE: 'The transaction has been accepted.',
  //   ALIAS: 'A1111300',
  //   DESCRIPTOR: 'PlateformeCtoC'
  // }

})
```

## API

  - .authorization(params, function(err, res, body){ })
  - .payment(params, function(err, res, body){ })
  - .refund(params, function(err, res, body){ })
  - .capture(params, function(err, res, body){ })
  - .credit(params, function(err, res, body){ })
  - .exportChargeBacks(params, function(err, res, body){ })

## Contribute

  - high avaibility (double request)
  - Form process
  - 3D secure
  - export API
  - enhance API
  - ...

<br/><br/>
## Tests


`npm test`

don't forget to add your account credentials in the test file.

<br/>
issues: 

  - credit() failed due to default be2bill account settings