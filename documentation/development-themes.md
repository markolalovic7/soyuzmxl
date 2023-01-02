# How to add and update themes

## Intro

We have our themes written is scss. To be able to switch between them dynamically, they should be represented in js format and passed to css as css variables.

## Helper tool

To generate json from existing theme we use a scss-to-json library - https://github.com/ryanbahniuk/scss-to-json.
To use this library, please clone it to your PC as follows:
1) git clone https://github.com/ryanbahniuk/scss-to-json.git
2) cd scss-to-json
3) npm install
4) cd bin

## Adding / updating theme

To get scss theme representation in js format run scss-to-json script with specified file path, for example (macOS):
`./scss-to-json /Users/{your username}/workspace/soyuz/src/applications/vanillamobile/scss/themes/lucky-red_theme.module.scss | pbcopy`

`pbcopy` will save command's output into your clipboard and you can paste it later into js file (or, copy the output from the terminal manually)

Paste the json theme into  `src/application/vanillamobile/themes/lucky-red-theme.js`, select all dollar sign (`$`) symbols and remove them. Export this object as a default.
Import this file into `themes/index.js` (if this theme is new) and add it to the exported object with an appropriate key name `LUCKY_RED_THEME: LuckyRedTheme`.
You can use theme in the project only if it's enabled in cms (**TODO - add cms integration**) and enabled theme exists in our project. 


## Add css variables support for the application (if application hasn't been supported css vars yet)


Create scss file with all variables required for the app. (`vanilla-theme.variables.scss`). Select one of the existing themes. Select common variables from it (everything except the top section aux variables), and replace variables with a regex:

`(.*?): (.*?);`

`$1: var(--$1);`

Add a section :root, by copying the previous body, and modifying it with:

`\$(.*?): (.*?);`

`--$1: white;`

Include this file into the start of the application's main scss module.
