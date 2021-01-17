
# Cloudflare Pages CRON build trigger
Simple CRON Trigger to trigger re-build of Cloudflare Pages deployment.

Disclaimer: **This project is using not documented API of a Cloudflare Pages beta product, its functionality can change or stop working anytime.**

The API does not support scoped API tokens yet, so Global API Key is required. **I do not recommend using it for production accounts.** :)

## Deployment
- replace `account_id`,`ENV_ACCOUNT_ID` and `ENV_PAGES_ID` in [wrangler.toml](./wrangler.toml)
- `wrangler secret put SECRET_AUTH_KEY` _(global api key)_
- `wrangler secret put SECRET_AUTH_EMAIL` 
- `wrangler publish`
