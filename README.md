# Adoption App for Animal Lovers 



## Project Focus
Our primary focus lies in crafting an appealing and user-friendly front-end interface. We aim to ensure smooth navigation and interaction, prioritizing the user's experience while they look and find a pet they wish to adopt.


## Features Implemented
- **User Registration and Login**: Create personalized profiles and ensure user account security.
- **Animal Catalog**: Browse pet profiles with images, descriptions, and adoption availability status.
- **User-Pet Interaction**: Mark pets as favorites and record adoption history.
- **Filter and Search**: Search and filter pets based on various attributes.
- **Profile Management**: Users can view and update their profiles.
- **Secure Storage**: User-sensitive data is securely stored using encryption techniques.
- **CRUD Operations**: Basic Create, Read, Update, and Delete operations for pets and user profiles.
- **Authentication**: Ensures secure access to user accounts.

**Reasoning**: These features were chosen to create a comprehensive platform that enhances the pet adoption experience for users while promoting responsible pet ownership.

## Application Type
The "Adoption App for Animal Lovers" will be a responsive website, accessible across various devices. This ensures users can easily engage with the platform on their preferred devices.

## Project Objectives
Our project aims to achieve two primary objectives:
1. Connect animal lovers with pets in need of homes.
2. Create a platform that simplifies the adoption process, enhancing the lives of both animals and individuals seeking companionship.

## Target Audience
Our platform caters to a wide demographic of animal enthusiasts, spanning diverse age groups and backgrounds. The primary audience consists of individuals who are eager to adopt pets and are seeking a seamless and reliable adoption experience.

## Data Strategy
To populate the platform, we will utilize a PET API, gathering crucial data such as images, age, size, breed, names, and adoption availability status for animals. This comprehensive dataset will empower users to make informed decisions.

## Project Approach
### Database Schema
We will design a structured schema with dedicated tables for animals. Key attributes like name, age, size, breed, and adoption availability will be integrated.

### API Challenges
Challenges related to data quality, particularly regarding breed information, will be addressed through rigorous data validation and cleaning procedures.

## Technology Stack
- Frontend: React
- Backend: Node.js
- Postgresql
  

### Security Measures
User-sensitive information, including passwords and personal details, will be securely stored using encryption techniques to ensure privacy.

### Functionality
The application will offer user registration, secure login, personalized profiles showcasing adopted pets, and an extensive catalog of available animals.

### User Experience
Users will follow a seamless journey - from registration and login to exploring the animal catalog, applying filters, and ultimately selecting pets for adoption. Adopted pets will be featured in the user's profile.

### Enhanced Features
In addition to basic CRUD operations, our app will provide  profile, Authentication,  and insights into seeing what animal is right for you.

## Conclusion
The "Adoption App for Animal Lovers" project amalgamates compassion with technology. By harnessing the capabilities of React and Node.js, we aim to build an impactful platform that transcends functionality, delivering a transformative experience for both animals and their future owners.





# Schema Design for Adoption Website

## User Table

- **Primary Key**: UserID
- **Columns**:
  - UserID (Primary Key)
  - Username
  - Email
  - Password
  - ProfilePicture
  - Location
  - Contact Information
  - API Key/Token
  - Role (User, Admin, etc.)

## Pet Table

- **Primary Key**: PetID
- **Columns**:
  - PetID (Primary Key)
  - Name
  - Type (e.g., dog, cat, bird)
  - Breed
  - Age
  - Size
  - Description
  - Photos (possibly as references to image files)
  - Contact
  - Availability for Adoption (Boolean)


## User-Pet Relationship Table (Favorites, Adoption History, etc.)

- **Primary Key**: InteractionID
- **Columns**:
  - InteractionID (Primary Key)
  - UserID (Foreign Key referencing User.UserID)
  - PetID (Foreign Key referencing Pet.PetID)
  - InteractionType (e.g., Favorite, Adoption)
  - Timestamp

### Schema Overview

- The User and Pet tables have primary keys (UserID and PetID, respectively).
- The User-Pet Relationship table is used to establish many-to-many relationships between users and pets. It has foreign keys referencing both the User and Pet tables, allowing you to track interactions like favorites and adoption history.
- You can use the InteractionType column to distinguish between different types of interactions (e.g., favorite or adoption).
- Timestamps can be used to track when these interactions occurred.

This is a simplified textual representation. To create a visual representation using Crow's Foot notation, you would typically use specialized database design software or draw it out on paper or a digital drawing tool. The relationships in Crow's Foot notation would involve lines connecting the tables with crow's foot symbols at the ends indicating the "many" side of the relationship.
