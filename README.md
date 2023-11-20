# reactjs-junior-demo

## Installation
```
  npm install &&
  cd client && npm install
  cd ../server && npm install
```
## Test
```
  npm run dev
```
Thiết lập sql connection trong /server/config/config.json
diaclet là tên của database như MySQL, PostgresQL, MongoDB

config.json
```json
    {
       "development": {
          "username": "tennguoidung",
          "password": "123456789",
          "database": "demodatabase",
          "host": "127.0.0.1",
          "dialect": "postgres"
      },
      ...
    }
```
