# How to Implement Localization

## Libraries

- [react-i18next](https://react.i18next.com/)

## Folders

The application content can be divided in 2 groups:

- React defined content (i.e. html or react defined text). This is translated via i18next.

![documentation/images/screenshot_i18next_folder.png](documentation/images/screenshot_i18next_folder.png)

- API related data (example, sports data). This comes translated in the API, using the language provided in the
  accepted-language header (this is handled by the axios.js request header interceptors for us).

## Translation keys

- Pattern is `snake_case`

  `Bad`:
    ```javascript
      {
        homePage: "Home"
      }
    ```
  `Good`:
    ```javascript
      {
        home_page: "Home"
      }
    ```

- Keys are sorted alphabetically. To sort keys, run `npm run scripts-sort-translations` script.

