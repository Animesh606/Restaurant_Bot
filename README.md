# Restaurant Bot

## Overview

The Restaurant Bot simplifies your dining experience by helping you find restaurants, browse menus, make reservations, and place orders for delivery or pickup. This bot is built using the Microsoft Bot Framework, Bot Framework Emulator, Restify and a Node.js server with Express, integrating with a MySQL database for data storage.

## Features

- **Restaurant Discovery**: Search for restaurants by cuisine, location, price range, or specific keywords.
- **Menu Exploration**: Access digital menus with clear descriptions, pictures, and customer reviews.
- **Reservation Management**: Make reservations for your desired date and time, specifying any special requests.
- **Ordering Made Easy**: Place orders for delivery or pickup directly through the bot, adding or removing items with ease.
- **Payment Integration**: Securely pay for your order using a connected payment method within the chat interface.
- **Order Tracking**: Receive real-time updates on the status of your order, from confirmation to delivery (or pickup notification).
- **Table Management**: Manage your reservations and orders in one place, allowing for easy cancellations or modifications.
- **Personalized Recommendations**: Based on your past choices and preferences, the bot can suggest relevant restaurants and dishes.

## Prerequisites

- Node.js (version 14 or later)
- MySQL
- Bot Framework Emulator
- Ngrok (for tunneling, if necessary)

## Setup Instructions

### Step 1: Clone the Repository

```sh
git clone https://github.com/Animesh606/Restaurant_Bot.git
cd restaurant-bot
```
### Step 2: Configure the MySQL Database
Create a MySQL database and tables as per the schema provided below:

```sql
CREATE DATABASE restaurant_bot;

USE restaurant_bot;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20)
);

CREATE TABLE restaurants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cuisine VARCHAR(255),
    location VARCHAR(255),
    price_range VARCHAR(50),
    description TEXT
);

CREATE TABLE menus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restaurant_id INT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    restaurant_id INT,
    order_date DATETIME,
    total_amount DECIMAL(10, 2),
    status VARCHAR(50),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);

CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    menu_id INT,
    quantity INT,
    price DECIMAL(10, 2),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (menu_id) REFERENCES menus(id)
);

CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    restaurant_id INT,
    reservation_date DATETIME,
    special_requests TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);
```

### Step 3: Configure Environment Variables in Server
 Create a .env file in the server directory of your project and add the following environment variables

 ```makefile
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=restaurant_bot
 ```

 ### Step 4: Start the server
 To start the server, run the following command from the root directory of your project:

 ```sh
 cd server
 npm install
 npm build
 npm start
 ```

### Step 5: Configure Environment Variables in Bot
Create a .env file in the bot directory of your project and add the following environment variables

```makefile
MicrosoftAppType=
MicrosoftAppId=
MicrosoftAppPassword=
MicrosoftAppTenantId=
LuisAppId=
LuisAPIKey=
LuisAPIHostName=
```

### Step 6: Run the Bot Server
To run the bot server, run the following command from the root directory of your project:

```sh
cd bot
npm install
npm start
```

### Step 7: Start the Bot Framework Emulator
- Download and install the [Bot Framework Emulator]("https://github.com/Microsoft/BotFramework-Emulator/releases").
- Open the Bot Framework Emulator.
- Click on Open Bot and enter the following URL:
```bash
http://localhost:3978/api/messages
```
- Enter your Microsoft App ID and Password from the .env file.

## Usage
- **Restaurant Discovery**: Type "find restaurant" to search for restaurants.
- **Menu Exploration**: Type "show menu" to browse the menu of a restaurant.
- **Reservation Management**: Type "make reservation" to book a table.
- **Ordering**: Type "place order" to order food for delivery or pickup.

## License
This project is licensed under the MIT License - see the [LICENSE]("https://github.com/Animesh606/Restaurant_Bot/blob/main/LICENSE") file for details
