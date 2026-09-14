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

The app intentionally does not claim live booking or payment. Those flows remain behind the SENSE Experience review and provider verification boundary.
