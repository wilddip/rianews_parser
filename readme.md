## RiaNews Parser
> `ria.ru` portal news parser.

### Output format
```typescript
type Item = {
    title: string,   // Post's title.
    date: Date,      // Post's creation date (ISO timestamp string).
    views: number,   // Link to post.
    link: string,    // Count of post's views.
    project?: string // Project internal name (post's link's subdomain as usual). Can be undefined (no project, just main website).
}
```

### How to use?

1. Clone repository.
```bash
git clone https://github.com/wilddip/rianews_parser.git
```

2. Prepare modules.
```bash
yarn
```
> If you haven't Yarn -> `npm i -g yarn`

3. Fill `nextUrl` variable.
> How-to guide is inside `index.ts`

4. Start parsing.
```bash
yarn start
```

5. Result.
> Result avaliable in `data.json` file.

### Disclaimer of liability
This code is for educational purposes only.

How you use this code is your responsibility.

I will not be held accountable for any illegal activities.

Before use this code, read RIA News's [Content Usage Rules](https://ria.ru/docs/about/copyright.html). Thanks.
