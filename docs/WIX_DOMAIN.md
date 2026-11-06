# Wix domain subscription

`hormonetherapyhub.com` stays registered at Wix. DNS stays in the Wix
account. Vercel hosts the website. Cancel the Wix website plan. Keep
the domain subscription, and keep the Wix account open.

Checked against Wix's nameservers on 2026-11-06, after the site moved.
Nameservers are `ns0.wixdns.net` and `ns1.wixdns.net`.

Wix treats the website plan and the domain as separate subscriptions.
Canceling a Premium or Studio plan does not cancel a domain, a mailbox,
or an app. Each line is canceled on its own. See
[Canceling a Wix Premium or Studio Plan](https://support.wix.com/en/article/canceling-a-wix-premium-or-studio-plan).

## What to cancel

Cancel the website plan only, from **Premium Subscriptions**:

1. Open the menu on the website plan row.
2. Click **Cancel Plan**.
3. Click **Cancel Now**.

**Cancel Now** turns off auto-renew. After the first 14 days of that
plan, it stays active until the end of the period already paid. Wix
can charge a renewal as early as three weeks before that date, so
cancel before that charge, not on the expiration day.

Inside the first 14 days of a new plan, **Cancel Now** ends the plan
immediately and refunds it. The Wix site then falls back to its free
`wixsite.com` address right away.

Do not cancel these lines:

-   The domain for `hormonetherapyhub.com`. Renewal of that domain is
    the Wix charge that stays. Domain privacy stays too, if it is its
    own line. The price and the renewal date are on the domain row.
-   The mailbox. The DNS page labels it **Google Workspace**, and mail
    for `PeggyB@hormonetherapyhub.com` delivers through Google. The
    project plan's note that the owner uses only free Gmail is out of
    date.

Do not close the Wix account. Do not delete the Wix site to stop the
bill. Canceling the website plan stops that renewal. The site can stay
in the account at no plan cost and remains the old copy of the site.
Do not click **Use custom nameservers**. Custom nameservers would move
DNS out of Wix.

## When the website plan ends

The old Wix site reverts to its free `wixsite.com` address, and Wix
disconnects the custom domain from that Wix site. The domain
subscription keeps managing DNS.

On that day, open **Domains → hormonetherapyhub.com → Manage DNS
Records** and confirm the two website rows are still:

| Type  | Host | Value                                      |
| ----- | ---- | ------------------------------------------ |
| A     | `@`  | `216.198.79.1`                             |
| CNAME | `www`| `52955a7f49cd5462.vercel-dns-017.com`      |

In the Wix form, leave the host field blank for `@`. If Wix has put
its own website records back, restore these two values. Their TTL is
30 minutes. A visitor can keep a previous answer until that timer runs
out.

Leave every other row:

-   TXT: both `google-site-verification` records, and
    `v=spf1 include:_spf.google.com ~all`
-   MX: the five Google Workspace servers
-   The other CNAME rows (`_dmarc`, both `_domainkey` rows, and `sg`)
-   Nameservers: `ns0.wixdns.net`, `ns1.wixdns.net`

## Rollback

To send the domain back to the Wix site, replace only those two
website rows:

-   Remove the A record `216.198.79.1`. Restore A records for the bare
    domain at `185.230.63.171`, `185.230.63.186`, and `185.230.63.107`.
-   Point the `www` CNAME back at `cdn3.wixdns.net`.

Leave the mail, verification, and nameserver records as they are.
With a 30-minute TTL, a rollback can take that long to reach someone
who already loaded the new site.
