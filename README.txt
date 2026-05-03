I AM GOD FINAL V1 — FULL REPLACEMENT PACKAGE

Upload/replace ALL files in GitHub:
- index.html
- styles.css
- app.js
- attributes-data.js
- access.html
- create-access.html
- assets/bible-light-hero.png

IMPORTANT BEFORE COMMIT/TEST:
In app.js, replace:
PASTE_YOUR_SUPABASE_ANON_KEY_HERE
with your Supabase anon/public key.

Already included:
- Supabase URL: https://xaiwaotwfstwmcqjbuic.supabase.co
- Supabase table name: iamgod_registrations
- Basic pay link
- Full pay link

What this version includes:
- Clean hero with approved Bible/light image
- No “rotating attribute tiles” wording
- Tiles rotate every 15 seconds quietly
- 30 attributes so rotation is visible
- Free / Basic / Full three-column plan chart
- One registration form below the plan choices
- Registration saves to Supabase before payment redirect
- Free users: payment_status=free, access_status=active
- Basic/Full: payment_status=pending, access_status=pending_payment, then redirect to GoDaddy pay link

Supabase table should include:
id, created_at, name, email, phone, selected_plan, payment_status, access_status, daily_email_opt_in, future_sms_opt_in

RLS is currently disabled, which is okay for this V1 launch test.


BASIC ACCESS V1 ADDED:
- basic.html
- Shows core attribute library
- Search/filter
- Definitions
- First Scripture witness
- Reflection prompts
- Upgrade strip to Full Access

Suggested immediate use:
- Set Basic payment success/return URL to https://iamgod.world/basic.html if your pay link supports return URLs.
- If not, manually send paid Basic users this link after payment until automated unlock is built.


PAY LINK + UPGRADE FLOW V1 ADDED:
- app.js now has Basic and Full GoDaddy pay links built in.
- Existing email users are updated instead of blocked.
- Free users can upgrade to Basic or Full using the same email.
- Basic redirects to Basic pay link.
- Full redirects to Full pay link.

IMPORTANT:
- In app.js, replace PASTE_YOUR_SUPABASE_ANON_KEY_HERE with your actual Supabase anon/publishable key before committing if it is not already inserted.
