# Cloudflare Pages branch preview

Simple CRON Trigger to trigger to fetch latest branch builds and Worker to proxy them.

Disclaimer: **This project is using not documented API of a Cloudflare Pages beta product, its functionality can change or stop working anytime.**

The API does not support scoped API tokens yet, so Global API Key is required. **I do not recommend using it for production accounts.** :)

## How it works

Every CRON Trigger schedule latest deployments are fetched from the API and branches object constructed and uploaded to KV.

Proxy Worker reads KV branches config, determines branch from request URL and passes the request to the latest branch build URL.

### Branch names slugification

Based on https://gitlab.com/gitlab-org/gitlab-foss/-/blob/master/lib/gitlab/utils.rb#L73

- Lowercased
- Anything not matching [a-z0-9-] is replaced with a -
- First/Last Character is not a hyphen

## Deployment

### KV

- run `wrangler kv:namespace create KV_PAGES_BRANCH_PREVIEW` and replace KV settings in [wrangler.toml](./wrangler.toml)

### Environment variables/Secrets

- replace `account_id`, `ENV_ACCOUNT_ID` and `ENV_PAGES_ID` in [wrangler.toml](./wrangler.toml)
- replace `ENV_HOSTNAME_SUFFIX` with domain suffix in [wrangler.toml](./wrangler.toml) _(branch name to proxy to is determined from `hostname.replace(ENV_HOSTNAME_SUFFIX, ''`)_
- `wrangler secret put SECRET_AUTH_KEY` _(global api key)_
- `wrangler secret put SECRET_AUTH_EMAIL`
- `wrangler publish`
- create Worker routes for your branches you want to proxy, e.g. `*-pages-preview.statusflare.com/*` _(the suffix must match the `ENV_HOSTNAME_SUFFIX`, do not forget for the `/*` at the end of the route)_
- create DNS records for your branches, e.g. `develop-pages-preview.statusflare.com`, `beta-pages-preview.statusflare.com`

## Known issues

- Branch names in Cloudflare Pages are not 1:1, e.g. `e/anything` becomes `anything`, just note the branch name created in Cloudflare and access that one.
