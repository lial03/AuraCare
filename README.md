# AuraCare - Mental Health Support Web App

This project has been modified to replace the Twilio SMS notification system with an **Email Notification System** using **Nodemailer**.

## Changes Implemented

1.  **Backend (`AuraCare/backend/`)**:

    - Removed `twilio` dependency and installed `nodemailer`.
    - Created `emailService.js` to handle email sending logic.
    - Updated `server.js` to import and use `emailService.sendSupportEmail` in the `/api/need-support` endpoint.
    - The `SupportContactSchema` in `server.js` was updated to store `email` instead of `phone`.
    - The `/api/support-circle` endpoints were updated to handle `email` instead of `phone`.

2.  **Frontend (`AuraCare/src/`)**:
    - Updated `SupportCircle.jsx` to collect and display a contact's **Email** instead of their **Phone Number**.
    - Updated `SupportCircle.css` to reflect the new input field class name.
    - Updated the notification message in `SupportCircle.jsx` to indicate an **EMAIL** will be sent.

## Setup and Configuration

To run the application and test the new email feature, you must configure the email credentials in the backend's `.env` file.

1.  **Backend Dependencies**:

    - Navigate to `AuraCare/backend` and run `npm install`. (This has already been done for `nodemailer`).

2.  **Configure Email Credentials**:

    - Edit the `.env` file located in `AuraCare/backend/`.
    - Replace the placeholder values with your actual email credentials:
      ```
      # Email Service Credentials (for nodemailer)
      # IMPORTANT: For Gmail, you must use an App Password, not your regular password.
      # See: https://support.google.com/accounts/answer/185833
      EMAIL_USER=your_email@gmail.com
      EMAIL_PASS=your_app_password
      ```

3.  **Run the Application**:
    - **Backend**: In the `AuraCare/backend` directory, run `node server.js` (or `npm run dev` if you have `nodemon`).
    - **Frontend**: In the `AuraCare` root directory, run `npm install` and then `npm run dev` to start the React application.

## Testing the New Feature

1.  Log in to the application.
2.  Navigate to **My Support Circle**.
3.  Add a new contact, providing their **Name** and **Email Address**.
4.  Navigate to the **Dashboard**.
5.  Click the **"I Need Support Now"** button.
6.  The contact(s) you added should receive an email notification from the address configured in your `.env` file.
