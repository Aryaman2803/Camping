# Camping

Website where users can create and review campgrounds. In order to review or create a campground, you must have an account.
This project was created using Node.js, Express, MongoDB, and Bootstrap. Passport.js was used to handle authentication.

## Features
* Authentication:
  * User login with username and password
  * Admin sign-up with admin code.
  
* Authorization:
  * One cannot manage posts and view user profile without being authenticated
  * One cannot edit or delete posts and comments created by other users
  * Admin can manage all posts and comments.
  
* Manage campground posts with basic functionalities:
  * Create, edit and delete posts and comments
  * Upload campground photos
  * Display campground location on Maps
  * Search existing campgrounds.
  
* Manage user account with basic functionalities:
  * Profile page setup with sign-up.
  
* Flash messages responding to users' interaction with the app
* Responsive web design

### Custom Enhancements
* Update campground photos when editing campgrounds
* Use Helmet to strengthen security

## Getting Started
<ins></ins>

> This app contains API secrets and passwords that have been hidden deliberately, so the app cannot be run with its features on your local machine. However, feel free to clone this repository if necessary.

1. Install mongodb
2. Create a [cloudinary](https://cloudinary.com/users/login) account to get an API key and secret code.

### Clone or download this repository

```
git clone https://github.com/Aryaman2803/Camping.git
```
### Install dependencies
```
npm install
```
#### Check the .env file and the root of the project and add the following:
```
DATABASEURL='<url>'
API_KEY=''<key>
API_SECRET='<secret>'
```
