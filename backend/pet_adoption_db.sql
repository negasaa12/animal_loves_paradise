

CREATE DATABASE pet_adoption;

\c pet_adoption

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
    Name TEXT NOT NULL,
    email VARCHAR(255) NOT NULL,
    breed TEXT NOT NULL,
    age INTEGER NOT NULL,
    size TEXT NOT NULL,
    gender TEXT NOT NULL,
    type TEXT NOT NULL,
    description TEXT NOT NULL,
    photo TEXT NOT NULL,
    adopted BOOLEAN DEFAULT FALSE
);

CREATE TABLE User_Pet_Relationship
(
    InteractionID SERIAL PRIMARY KEY,
    UserID INT REFERENCES users(UserID),
    PetID INT REFERENCES pets(petId),
    InteractionType VARCHAR(255) NOT NULL,
    Timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO users (username, firstName, lastName, email, password, location, contact)
VALUES
    ('user1', 'John', 'Doe', 'john@example.com', 'password1', 'Location1', 'Contact1'),
    ('user2', 'Jane', 'Smith', 'jane@example.com', 'password2', 'Location2', 'Contact2'),
    ('user3', 'Bob', 'Johnson', 'bob@example.com', 'password3', 'Location3', 'Contact3'),
    ('user4', 'Alice', 'Brown', 'alice@example.com', 'password4', 'Location4', 'Contact4');
