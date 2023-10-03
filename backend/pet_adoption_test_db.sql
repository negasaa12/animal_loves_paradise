DROP DATABASE IF EXISTS pet_adoption_test;

CREATE DATABASE pet_adoption_test;

\c pet_adoption_test

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS pets;

CREATE TABLE users
(
   userID SERIAL PRIMARY KEY,
   username VARCHAR(255) NOT NULL,
   firstName  VARCHAR(255) NOT NULL,
   lastName  VARCHAR(255) NOT NULL,
   email VARCHAR(255) NOT NULL,
   password TEXT,
   location VARCHAR(255),
   contact TEXT
);

CREATE TABLE pets
(
    petId SERIAL PRIMARY KEY,
    name TEXT NOT NULL,

    breed TEXT NOT NULL,
    age TEXT NOT NULL,
    size TEXT NOT NULL,
    gender TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT DEFAULT 'none',
    photo TEXT ,
    adopted TEXT
);

CREATE TABLE User_Pet_Relationship
(
    InteractionID SERIAL PRIMARY KEY,
    UserID INT REFERENCES users(UserID),
    PetID INT REFERENCES pets(petId),
    InteractionType VARCHAR(255) NOT NULL,
    Timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

