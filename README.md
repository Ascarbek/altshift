# AltShift Browser Extension
## Start local dev environment

1. Install dependencies `npm install` or `yarn`

2. create file in `src/config.json`
```json
{
"backend": "https://backend.altshift.cc"
}
```

3. Create `downloaded` folder and put a sample video there.

4. Go to `src/wrapper/App.svelte` and set preferred values for `videoId` and `videoType`

5. Run `npm run serve-static` or `yarn run serve-static`
   
6. Run `npm run dev:rollup` or `yarn run dev:rollup`

## Build

Run `npm run build:rollup` or `yarn run build:rollup`
All required files will be in `public` folder