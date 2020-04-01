### Look into

- how to add SSL, saw in console
- make a base install regarding the platform detection, re-usable methods like the window generator
- look into .env file for prod set by `process.env.NODE_ENV` -> `production` for example, useful for that devtools not being visible in prod
- multi-screen support regarding positioning of openend windows
- locking sub windows inside parent windows

### Important
- preload
  - this is needed to have secure access to Node without leaving a security vulnerability to the web, particularly important for remote applications where accidentally giving access to Node allows attacker to access file system
  - link: https://stackoverflow.com/questions/44391448/electron-require-is-not-defined/57049268#57049268

### Packaging
- link: https://www.christianengvall.se/electron-packager-tutorial/