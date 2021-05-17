# AltShift Browser Extension
## Start local dev environment

1. Install dependencies `npm install` or `yarn`

2. Create a file: `src/config.json` and put this content:
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
1. Install dependencies `npm install` or `yarn`

2. Create a file: `src/config.json` and put this content:
```json
{
"backend": "https://backend.altshift.cc"
}
```

3. Run `npm run build:rollup` or `yarn run build:rollup`

Now all required files will be in `public` folder.