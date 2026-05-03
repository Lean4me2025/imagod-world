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
