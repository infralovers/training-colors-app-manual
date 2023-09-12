# Colors App (Manual)

Based on work by: https://github.com/bedis/colors_app

## Why is this called "Manual" ?

The code is used for CI/CD examples in our trainings.
This repo expects you change the background color of the app manually (see below).
With it, we simulate changes happening in an exisiting code base and releaseing a new version.

In the original version, you changed colors by changing the value of an environment variable.

## Changing color

Open `colors.js` on line `4` and edit the color to your needs.

## Build

```
docker build --tag colors .
```

## Start with Docker-Compose

```
docker-compose up -d
```

## Access

```
http://localhost:8080
```
