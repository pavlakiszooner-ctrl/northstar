Northstar Web Solutions — Local Development Notes

Form submission (email)
-----------------------
This site uses a client-side form. To have the contact form actually send emails, configure one of the following options and set the endpoint in `script.js` (the `FORM_POST_URL` constant):

1) Formspree (recommended, quick)
   - Create a free account at https://formspree.io and add a new form.
   - In the form settings, set the destination email to `northstarwebsolutionsldn@gmail.com`.
   - Copy the POST endpoint (e.g. `https://formspree.io/f/yourFormId`) and paste it into `FORM_POST_URL`.
   - Form submissions will then be forwarded to the configured email.

2) Serverless function (custom)
   - Implement a POST endpoint (e.g., Netlify Functions, Vercel Serverless, AWS Lambda) that accepts the form fields and uses an SMTP provider or transactional email API (SendGrid, Mailgun) to send mail.
   - Point `FORM_POST_URL` to your function's URL and ensure it accepts FormData or JSON.

3) EmailJS (client-side but requires account)
   - Sign up at https://www.emailjs.com, create a service and email template, and follow their docs to send directly from the browser. This requires adding public keys to the frontend.

If you want, I can help set up Formspree and add the real endpoint for you. Replace the placeholder in `script.js` once you have the real endpoint.