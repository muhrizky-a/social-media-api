<!-- Table of Contents -->
# :notebook_with_decorative_cover: Table of Contents

- [About](#about)
- [Installation and Configuration](#Installation-and-configuration)
- [Run API](#run-api)

# About
This is an API for simple Social Media. Like a social media, it has these core features:
- CRUD User
- Login Feature (with JWT)
- CRUD Post

## Project structure

    .
    ├── src                     # Source files (alternatively `lib` or `app`)
    ├── __test__                # Automated tests (alternatively `spec` or `tests`)
    ├── uploads                 # Tools and utilities
    ├── .env                    # Environtment Variables
    ├── .sequelizerc            # Sequelize configuration file
    ├── index.js                # Main app
    ├── jest.config.js          # Jest configuration file
    ├── package-lock.json       # Node.js project Informations
    ├── package.json            # Node.js project Informations
    └── README.md               # Documentation

The project structure like this is for easier folder and file management within project.
The API uses `Model Route Controller Service` pattern to separate data model, business logics, and controller that invokes the logic.

All of these pattern are used for better code readability and maintenance.


# Installation and Configuration
## Node
- Run these commands to install latest LTS version of Node
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.38.0/install.sh | bash
source ~/.bashrc
nvm list-remote
nvm install lts/*
```


## MySQL
### Install
- Run these commands to install mysql
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql.service
```

### Configure Database
- Connect to mysql
```bash
sudo mysql
```

- Create new Database
```bash
mysql > CREATE DATABASE socmed;
```

- Add new users and grant user all the privileges to recently created database.
```bash
mysql > CREATE USER 'dbuser'@'%' IDENTIFIED BY 'secret';
mysql > GRANT ALL PRIVILEGES ON socmed.* TO 'dbuser'@'%';
mysql > FLUSH PRIVILEGES;
```

### Finalize
`sudo systemctl start mysql.service`

# Run API
## Clone GitHub Repo
- Run these commands to clone this repo
```bash
cd ~
git clone https://github.com/muhrizky-a/social-media-api.git
cd ~/social-media-api
```

## Install Node Packages
- Run these commands to install packages needed to run the API
```bash
npm install
npm install pm2 -g
npm run migrate:up
```
## Start the API
- Run these commands to start the API with PM2
```bash
cd ~/social-media-api
pm2 start
```

## Test the API
- Run the end-to-end testing for API
```bash
npm test
```