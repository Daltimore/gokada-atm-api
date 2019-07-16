# Gokada-ATM-API

## Getting Started


Please ensure Node Js and npm are installed


```
  1. Install Nodejs
  2.  git clone https://github.com/akinmaurice/atm-api.git
  2.  cd atm-api
  4.  npm install
  5.  npm run dev
  6.  To test, npm run test

```

## Technology Stack

```
  1. Node JS
```


##  Start Server

> POST http://localhost:4000/


### Request Query
| parameters | Type | Description |
| ---------- |:-----:|-----------:|
| card_number    | string |  Card Number (any 16 digit number is valid) |
| pin   | string |  User Pin. (1234 is the right value) |

### Response

```json

{
    "current_url": "https://domain.com/",
    "data": {
        "message": "Session Started",
        "session_data": {
            "account_name": "Gokada Name"
        }
    },
    "status": "success"
}

```


## Get User Account Balance

> GET http://localhost:4000/balance


### Response

```json

{
    "current_url": "https://domain.com/balance",
    "data": {
        "message": "User Account Balance",
        "account_data": {
            "account_balance": 40000,
            "book_balance": 40000,
            "account_number": "1234567890",
            "account_name": "Gokada Name"
        }
    },
    "status": "success"
}
```



## Make Withdrawal

> POST http://localhost:4000/withdrawal


### Request Query
| parameters | Type | Description |
| ---------- |:-----:|-----------:|
| amount    | Numeric |  Amount to withdraw |
| notes   | integer |  Notes to withdrawal 500 or 1000 |


### Response

```json

{
    "current_url": "https://domain.com/withdrawal",
    "data": {
        "message": "Account Withdrawal",
        "withdrawal_data": {
            "account_number": "1234567890",
            "account_name": "Gokada Name",
            "withdrawal_amount": 5000,
            "withdrawal_notes": 500,
            "number_of_notes": 10,
            "old_balance": 35000,
            "new_balance": 30000,
            "date": "2019-05-31",
            "time": "02:33:36",
            "atm_location": "IKEGA GRA"
        }
    },
    "status": "success"
}
```