# Email Setup Guide for Contact Form

Your contact form is now configured to send emails via Gmail SMTP. Follow these steps to complete the setup.

## Prerequisites

- A Gmail account
- Node.js and npm installed

## Step 1: Install Nodemailer

First, install the required package:

```bash
npm install nodemailer
```

## Step 2: Generate Gmail App Password

Gmail requires an **App Password** for third-party applications (not your regular Gmail password).

### Instructions:

1. **Enable 2-Step Verification** (if not already enabled):
   - Go to: https://myaccount.google.com/security
   - Find "2-Step Verification" and turn it on
   - Follow the setup process

2. **Generate App Password**:
   - Go to: https://myaccount.google.com/apppasswords
   - Or Google Account → Security → 2-Step Verification → App passwords
   - Select app: **Mail**
   - Select device: **Other (Custom name)** → Enter "Portfolio Website"
   - Click **Generate**
   - Copy the **16-character password** (it looks like: `abcd efgh ijkl mnop`)

⚠️ **Important**: Save this password - you won't be able to see it again!

## Step 3: Configure Environment Variables

1. Create a `.env` file in your project root (or update existing one):

```bash
cp .env.example .env
```

2. Open `.env` and update these values:

```env
# Email Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-actual-email@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
CONTACT_EMAIL=your-actual-email@gmail.com
```

**Replace:**
- `your-actual-email@gmail.com` → Your Gmail address
- `abcd efgh ijkl mnop` → The 16-character App Password you generated
- `CONTACT_EMAIL` → Email where you want to receive contact form messages (usually same as SMTP_USER)

## Step 4: Test the Setup

1. Start your development server:
```bash
npm run dev
```

2. Open http://localhost:3000/contact

3. Fill out and submit the contact form

4. Check your inbox (the email specified in `CONTACT_EMAIL`)

## Troubleshooting

### "Email service not configured" error
- Check that all SMTP_* variables are set in `.env`
- Restart your server after updating `.env`

### "Invalid login" or authentication errors
- Make sure you're using an **App Password**, not your regular Gmail password
- Verify 2-Step Verification is enabled
- Remove spaces from the App Password (should be 16 characters without spaces)

### Emails not arriving
- Check your spam/junk folder
- Verify `CONTACT_EMAIL` is correct in `.env`
- Check server logs for error messages
- Try sending a test email from Gmail's web interface to verify account is working

### "Less secure app" errors
- Gmail no longer supports "less secure apps"
- You MUST use an App Password with 2-Step Verification
- Cannot use regular password anymore

## Gmail Sending Limits

Gmail has daily sending limits:
- **Free Gmail accounts**: ~500 emails/day
- **Google Workspace accounts**: ~2000 emails/day

For a personal portfolio, this should be more than enough.

## Alternative: Use SendGrid (Production)

For production sites with higher volume, consider using SendGrid:

1. Sign up at: https://sendgrid.com (free tier: 100 emails/day)
2. Get API key from Settings → API Keys
3. Update `.env`:
```env
SENDGRID_API_KEY=your-api-key
```
4. Update `src/utils/email.js` to use SendGrid instead of SMTP

## Security Best Practices

✅ **DO:**
- Keep your `.env` file private (already in `.gitignore`)
- Use App Passwords instead of regular passwords
- Set strong passwords for your Gmail account
- Monitor email sending activity

❌ **DON'T:**
- Commit `.env` file to Git
- Share your App Password with anyone
- Use your personal Gmail password in code
- Disable 2-Step Verification

## Need Help?

If you encounter issues:
1. Check the server logs: Look for error messages in your terminal
2. Verify environment variables: Make sure `.env` is loaded correctly
3. Test Gmail login: Try logging into Gmail web interface
4. Review error messages: Check both browser console and server logs

---

## Quick Reference

**Gmail App Password URL**: https://myaccount.google.com/apppasswords

**Required Environment Variables**:
- `SMTP_HOST` → smtp.gmail.com
- `SMTP_PORT` → 587
- `SMTP_USER` → Your Gmail address
- `SMTP_PASS` → 16-character App Password
- `CONTACT_EMAIL` → Where to receive messages

**Package Required**: `nodemailer` (install with `npm install nodemailer`)

---

Once configured, your contact form will:
- ✅ Send you an email for each submission
- ✅ Include sender's name, email, and message
- ✅ Allow you to reply directly from your inbox
- ✅ Log all submissions for debugging
- ✅ Handle errors gracefully
