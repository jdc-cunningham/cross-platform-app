### About
This is a cross-platform note-taking app primarily along with some other "sub-apps" or "modules" sprinkled in eg. a canvas drawing tool that can be saved.

This is the intended functionality at minimum
![cross platform design](./architecture.PNG)

### Technologies
* **Shared API** - `Node/Express/MySQL`
* **Desktop** - `Electron/ReactJS`
* **Mobile** - `React Native`

### API
This is the heart of these random connected apps. It is a remote API accessible by all the different apps eg. mobile/desktop/chrome extension. This one is written with `Node/Express/MySQL`. For me I use a VPS from [OVH](https://www.ovh.com/world/) so my API is remote in that it's not on my home network.

### Desktop
The desktop app is a `ReactJS` build loaded inside an `Electron` app.

![current design and functionality as of 04/26/2020](./electron-basic-app-based-on-reactjs-04-26-2020.gif)

#### Desktop - build/deploy
Within the `/desktop/` folder is a `/reactjs/` folder, in there you do your changes to the base `ReactJS` app then do your `npm run build`.
After that run `npm start` inside the `/desktop/` folder to run the Electron app. If all looks well, package it eg. `npm run package-win`.
Check `package.json` for the different packager options.
The executable file(s) will be in `/desktop/release-builds/` per platform you choose.

### Mobile
This is a React Native app, the apps are generally pretty basic, although built to be dynamic(can add more modules).
Below is a gif showing the Electron app updating some note and then the RN app reads the new value. Later RN updates same value and Electron sees it. Both interfaces are using the `/shared-api/` for modifying and storing data.

![current React Native app 04/30/2020](./react-native-app-04-29-2020.gif)

### Installation/deployment
#### Mac desktop app - assumes API exists

- `cd` into `desktop/reactjs`, make a `.env` file from the `.env.example` file then edit the `.env` file, update the `...API_BASE_PATH` (depends on deployed API), can run local API as well and use `localhost`
- build the `reactjs` app by running `npm install, npm run build`
- go up one directory eg. `cd ..` so you're in the desktop folder directory
- run `npm install` to install Electron then run `npm run package-os` check `package.json` for the platform
- you should see a builds `release-builds` folder appear, open that in finder, find the folder with `darwin` in the name, inside is a `desktop.app` file can double click on that to launch the app on Mac.

### Bugs
- mac - there is a menu error on launch, doesn't prevent app from working though

### Attributes
#### Icons sourced from Flaticon
* [Doc icon](https://www.flaticon.com/authors/monkik)
* [Pencil icon](https://www.flaticon.com/authors/those-icons)
* [Plus icon](https://www.flaticon.com/authors/pixel-perfect)
* [Close icon](https://www.flaticon.com/authors/roundicons)