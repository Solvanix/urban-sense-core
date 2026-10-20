# SENSE Go

Arabic-first Expo mobile companion for the SENSE Experience tourism platform.

## What is included

- RTL discovery of Al-Eizariya experiences.
- Category filters for heritage, food, nature, and craft.
- Local saved day plan using AsyncStorage.
- Place stories and responsible tourism principles.
- Provider entry point that hands off to the web onboarding flow.
- Clear distinction between curated concepts and verified live availability.

## Run locally

```bash
cd apps/sense-go
pnpm install
pnpm start
```

## Build an Android test APK on GitHub

The `SENSE Go Android APK` workflow creates an installable Android debug APK when changes under this app are pushed to `main`, when a pull request targets `main`, or when the workflow is started manually from the GitHub Actions tab.

After a successful run, open the workflow run in GitHub Actions and download the `sense-go-android-debug-apk` artifact. This debug build is for testing and is not a Play Store release. A production release still requires a production signing setup and a separate release workflow.

The app intentionally does not claim live booking or payment. Those flows remain behind the SENSE Experience review and provider verification boundary.
