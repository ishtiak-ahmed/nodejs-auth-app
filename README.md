# NodeJS Auth App
## NodeJS, Express, JWT, Mongoose, MongoDB, Bcrypt, Nodemailer

This a fully functional auth app with user registration, email verification, refresh token to secure and improve user experiences.

## To run this app -
  -> Clone the repo  
  -> run `yarn` or `npm i`  
  -> create a .env file  
  -> .env example -  
    APP_NAME= Auth App  
    DB_URI= mongodburi  
    jWT_SECRET= jwtsecret  
    REFRESH_SECRET = refreshsecret  
    GMAIL_ID = example@gmail.com  
    GMAIL_PASS = password 
    BASE_API = api.example.com  
  -> You need to setup your gmail to use less secure app   
  -> yarn dev (if you don't have nodemon installed globally, please do it or add as dev dependency)  
  -> The current access token expire in `1 hour`, if you want more security and won't worry about api call, can limit it to `10 seconds` or as per your choice  
  -> Currently I have not implemented logout from all devices functionality, but I wish to add it later.  

  Enjoy!  
  Ishtiak Ahmed  