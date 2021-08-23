# Publishing

This document is for the maintainer. If you are contributing to the
Browserosaurus project, you will not need to follow these steps.

Setup Keychain for notarization:

```sh
xcrun notarytool store-credentials "AC_PASSWORD" --apple-id "email@example.com" --team-id "team-id" --password "app-password" --keychain "~/Library/Keychains/login.keychain-db"
```

This will create an item called `com.apple.gke.notary.tool` in your `login`
keychain.

- "AC_PASSWORD" is the name to be given to the keychain profile, and can be left
  as-is.
- The apple ID is usually your email address associated with your Apple
  Developer account.
- The Team ID can be found here:
  https://developer.apple.com/account/#!/membership/
- Password is the app-specific password that can be configured here:
  https://appleid.apple.com/account/manage
- I have found it best to store the generated item in the `login` keychain, and
  the location used above is usually where it is found.

The following command will prompt to bump version number, package, notarize, and
make ZIP bundle:

```
npm run release
```

The zip files can then be added to a GitHub release.
