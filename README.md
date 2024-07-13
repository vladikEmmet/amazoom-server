# Amazoom
**This is the server part of an online store of household and industrial equipment (a simple analogue of Amazon). You can find the frontend [here](https://github.com/vladikEmmet/amazoom-client).**

## Description
The project is a simple online store of household and industrial equipment. The user can view the list of products, add them to the cart, and place an order. The administrator can add new products, delete them, and view the list of orders. Also the ability to administer the store if you have the appropriate rights (including deleting and adding new products and editing existing ones).

Each product has a rating and reviews that users can leave about it.

Using NestJS helps you write fast, secure and intuitive code, and Prisma helps you conveniently and flexibly interact with the database (PostgreSQL).

## Technologies
- NestJS, Prisma ORM, PostgreSQL

## Future development should focus on:
- Connecting Redis for data caching;
- Setting up a payment gateway for making payments;

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```
