# Gmail SMTP Setup Guide

## Quick Setup (5 minutes)

### Step 1: Enable 2-Step Verification
1. Go to https://myaccount.google.com/security
2. Scroll to "How you sign in to Google"
3. Click on "2-Step Verification"
4. Follow the prompts to enable it (if not already enabled)

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. You might need to sign in again
3. In the "Select app" dropdown, choose **Mail**
4. In the "Select device" dropdown, choose **Other (Custom name)**
5. Type "SkillLink" and click **Generate**
6. Copy the 16-character password (it will look like: `xxxx xxxx xxxx xxxx`)

### Step 3: Update Your .env File
1. Open `skilllink-platform/backend/.env`
2. Replace these values:
   ```env
   GMAIL_USER=your-actual-email@gmail.com
   GMAIL_APP_PASSWORD=xxxxxxxxxxxxxxxx
   ```
   
   Example:
   ```env
   GMAIL_USER=john.doe@gmail.com
   GMAIL_APP_PASSWORD=abcd efgh ijkl mnop
   ```

### Step 4: Restart Backend Server
The backend will automatically pick up the new configuration.

## Testing
Once configured, try inviting a facilitator or student. You should receive an actual email!

## Limits
- **500 emails per day** (Gmail free tier)
- Perfect for development and small-scale production

## Troubleshooting

### "Invalid credentials" error
- Make sure you're using an **App Password**, not your regular Gmail password
- Remove any spaces from the app password in .env

### "Less secure app access" error
- This shouldn't happen with App Passwords
- Make sure 2-Step Verification is enabled

### Emails not sending
- Check the backend console for error messages
- Verify your Gmail credentials are correct
- Make sure you haven't hit the 500/day limit

## Alternative: Use Dev Mode
If you don't want to set up Gmail right now, the app works fine in dev mode - it just logs emails to the console instead of sending them. You can still test all features!
