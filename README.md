### About
This is a cross-platform note-taking app primarily along with some other "sub-apps" or "modules" sprinkled in eg. a canvas drawing tool that can be saved.

### Technologies
* **Desktop** - `Electron/ReactJS`

### API
This is the heart of these random connected apps. It is a remote API accessible by all the different apps eg. mobile/desktop/chrome extension. This one is written with `Node/Express/MySQL`. For me I use a VPS from [OVH](https://www.ovh.com/world/) so my API is remote in that it's not on my home network.

### Desktop
The desktop app is a `ReactJS` build loaded inside an `Electron` app.

#### Desktop - build/deploy
Within the `/desktop/` folder is a `/reactjs/` folder, in there you do your changes to the base `ReactJS` app then do your `npm run build`.
After that run `npm start` inside the `/desktop/` folder to run the Electron app. If all looks well, package it eg. `npm run package-win`.
Check `package.json` for the different packager options.
The executable file(s) will be in `/desktop/release-builds/` per platform you choose.

### Attributes
#### Icons sourced from Flaticon
* [Doc icon](https://www.flaticon.com/authors/monkik)
* [Pencil icon](https://www.flaticon.com/authors/those-icons)
* [Plus icon](https://www.flaticon.com/authors/pixel-perfect)