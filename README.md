<p align="center">
  <a href="https://hycon.io" rel="noopener" target="_blank"><img width="300" src="http://www.hycon.io/wp-content/uploads/2018/08/hycon_logo2.png" alt="Hycon logo"></a></p>
</p>

<h1 align="center">Hycon Pocket</h1>

## Key Features

* Secure in-app wallet generation and recovery
* Device-based security – all your private keys are stored locally, and not sent across the internet
* Address book feature, making it easy to pay your friends, family, and frequently-used services
* View wallet balance and transaction details
* Send and receive Hycon just by scanning a QR code
* Fingerprint and FaceID support for better security
* English and Korean languages supported

## Download

[Get it on Google Play](https://play.google.com/store/apps/details?id=io.hycon.litewallet&hl=en)

[Download on the App Store](https://itunes.apple.com/us/app/hycon-pocket/id1439548798?mt=8)

## Future Features

* Biometrics-only authentication for wallets
* UI / UX Updates

## FAQ

- ***Can I use my old wallet?***

Yes, you can. Because all of our wallets (full node, chrome extension and desktop) use same mnemonic words.

- ***How long should I wait until I can use this application to make transfers?***

Right away. It doesn't need to sync since it connects to a fully synced remote nodes automatically.


## For Developers

### Pre-requisites

- [@Team-Hycon/hycon-gui](https://github.com/Team-Hycon/hycon-gui). This repository is only a submodule.
- Node.js
- Git
- Android Studio & Android SDK, and/or XCode & iOS SDK

### How To Use

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone the main repository
$ git clone https://github.com/Team-Hycon/hycon-gui

# Go into the repository
$ cd hycon-gui

# Initialize and update this submodule
$ git submodule init && git submodule update

# Install common dependencies
$ npm install

# Install the cordova platform, <platform> is `android` or `ios`
$ cordova platform add <platform>

# Compile and pack typescript codes (from `src/mobile` directory)
$ npm build:mobile

# Build the app with cordova, <platform> is `android` or `ios`
$ cordova build <platform>

# Run the app and deploy on the <platform>. This will deploy on an emulator or connected device, 
# depending on development system settings. Please refer to the official docs here: 
# https://cordova.apache.org/docs/en/latest/guide/support/index.html.
$ cordova run <platform>
```

## Issues & Pull Requests

If you have an issue, feel free to add it to the [Issues](https://github.com/Team-Hycon/hycon-pocket/issues) tab or send an email to [support@hycon.io](mailto:support@hycon.io).
If you'd like to help us out, the [Pull Request](https://github.com/Team-Hycon/hycon-pocket/pulls) tab is a great place to start.

**If you have found a security bug, please contact us at [security@glosfer.com](security@glosfer.com).**
