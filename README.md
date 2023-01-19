<!-- Table of Contents -->
# :notebook_with_decorative_cover: Table of Contents

- [About](#about)
- [Installation and Configuration](#Installation-and-configuration)
- [Run API](#run-api)

# About
This is an API for simple Social Media.
Features:
- CRUD User
- Login Feature
- CRUD Post



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