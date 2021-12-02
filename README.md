# Backend Coffee Shop

Cara instalasi sebagai berikut:

- Clone repository ini

```cli
git clone https://github.com/roufurrohim/cf-backend.git
```

- Instalasi depedensi :

```
npm install
```

## API DOCUMENTATION

**Standard Status Response**

| Status Code | Description                             |
| :---------- | :-------------------------------------- |
| 200         | `Get all success`                       |
| 201         | `Created data success`                  |
| 400         | `Error on client side (input false)`    |
| 404         | `Data not found`                        |
| 502         | `Invalid response from another request` |


**Standard API**

[click me](https://github.com/roufurrohim/tester/blob/master/Coffee-shop.postman_collection.json)


**.env example**
```
HOST=
DB_USERNAME=
DB_NAME=
DB_PASSWORD= 
KEY_SECRET=
REDIS_HOSTNAME=
REDIS_PORT=
REDIS_PASSWORD=
```