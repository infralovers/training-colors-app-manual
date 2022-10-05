# Colors App

Based on work by: https://github.com/bedis/colors_app

## Description

Dummy nodejs application which returns a colored paged based on color found in a variable environment. Variable name is "COLOR". If COLOR is empty, then "white" is used. A color could be in the HTML form: COLOR=#0f0f0f

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

## Infralovers/Commandemy usage

- Used in this blog post
- Used in a variety of CICD examples
