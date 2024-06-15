# Turbo-orderdev

orderdev.com is a web application that allows users to place orders for food and drinks from a restaurant.
The repo is built using the Turborepo monorepo tool.

add hosts file entries

```
127.0.0.1 auth.orderdev.local
127.0.0.1 restaurant.orderdev.local
```

google oauth Authorized redirect URIs

```
http://localhost:54321/auth/v1/callback
http://127.0.0.1:54321/auth/v1/callback
https://---prod-project-id---.supabase.co/auth/v1/callback
```

SUPABASE STEPS

1. https://supabase.com/dashboard/project/---prod-project-id---/auth/providers

```

disable email
enable google with
- SUPABASE_AUTH_EXTERNAL_GOOGLE_ID
- SUPABASE_AUTH_EXTERNAL_GOOGLE_SECRET
```

2. https://supabase.com/dashboard/project/---prod-project-id---/auth/url-configuration

```
Site URL
prod: "https://auth.orderdev.com"
# local: "http://auth.orderdev.local:4321"
```
