# Environment Variables Setup

Copy the following to your `.env` file and fill in your values.

## Required Variables

```bash
# =============================================================================
# DATABASE
# =============================================================================
# PostgreSQL connection string (Railway, Supabase, or local)
DATABASE_URL="postgresql://user:password@host:5432/optimus_seo?schema=public"

# =============================================================================
# AUTHENTICATION (Better Auth)
# =============================================================================
# Generate with: openssl rand -base64 32
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# =============================================================================
# EMAIL (Resend)
# =============================================================================
RESEND_API_KEY=""
EMAIL_FROM="noreply@optimus-seo.com"

# =============================================================================
# DATAFORSEO API
# =============================================================================
# Get credentials at https://dataforseo.com
DATAFORSEO_LOGIN=""
DATAFORSEO_PASSWORD=""

# =============================================================================
# LLM PROVIDERS (BYOK - Bring Your Own Key)
# =============================================================================
# Platform default keys (optional - users can provide their own)
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""
GOOGLE_AI_API_KEY=""

# =============================================================================
# ENCRYPTION
# =============================================================================
# For encrypting API keys stored in database
# Generate with: openssl rand -base64 32
ENCRYPTION_KEY=""

# =============================================================================
# ANALYTICS & MONITORING
# =============================================================================
POSTHOG_API_KEY=""
POSTHOG_HOST="https://app.posthog.com"
SENTRY_DSN=""

# =============================================================================
# STRIPE (SaaS Phase)
# =============================================================================
STRIPE_SECRET_KEY=""
STRIPE_WEBHOOK_SECRET=""
STRIPE_PUBLISHABLE_KEY=""

# =============================================================================
# RAZORPAY (India - SaaS Phase)
# =============================================================================
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
RAZORPAY_WEBHOOK_SECRET=""
```

## Setup Instructions

### 1. Database (Railway)

1. Go to [Railway](https://railway.app)
2. Create a new project
3. Add PostgreSQL service
4. Copy the connection string to `DATABASE_URL`

### 2. Authentication

Generate a secret key:
```bash
openssl rand -base64 32
```

### 3. DataForSEO

1. Sign up at [DataForSEO](https://dataforseo.com)
2. Deposit minimum $50
3. Get API credentials from dashboard

### 4. LLM Providers

Get API keys from:
- [OpenAI](https://platform.openai.com)
- [Anthropic](https://console.anthropic.com)
- [Google AI](https://makersuite.google.com)

### 5. Email (Resend)

1. Sign up at [Resend](https://resend.com)
2. Create an API key
3. Verify your domain
