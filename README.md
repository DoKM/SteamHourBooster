# SteamHourBooster
## This is pretty bad
## don't use it
## thats why i archived it
Steam HourBooster made in nodeJS with a php/Laravel based Frontend using the adminlte template

Features:
    No having to type in appids (except if your account is on private (or doesnt have any games))
    Supports 2fa via manually entering the code and using TOTP
    Auto relogin (variable relogin time)
    Doesn't kick you from your game and will continue boosting after you turn it off
    Pretty bad encryption (Freshman :/)

Usage:

For this to work, you could use Docker with docker-compose:

(prefered)

1. Get docker installed and docker-compose
2. Go into the folder, run the start.sh script or go into the frontend folder open cmd or another cli and run docker-compose up -d
3. Everything should setup
3.5. Check if the mysql database is setup (it should I might have forgotten)
4. go into the docker php container and exec something*
      something*: "docker exec php php artisan migrate:fresh"
      to setup the database's tables
5. setup the .env file
      copy the .env.example and rename it to .env
      fill in the info like
        mysql info: find it in the docker-compose.yml file in the Frontend folder
        Steam api: request an api key
        Email provider: use gmail or go disable it in the frontend/routes/web.php auth(verify) (should be false then)
        and set APP_ENV to "production" if you're using https

or manually (no idea, really, wasnt planning to do it this way from the start, so good luck)


Note: any changes made in the mysql info should be reflected in the frontend/.env and the backend/src/config.ts (will need to recompile the code to js using npm)

Afterwards, make an account, verify it (or not) and make yourself an admin by going to /AdminBackdoor
Backdoor only works if there is no superadmin yet, afterwards you can disable registeration in the .env by changing AUTH_REGISTER to false


Things used
Laravel
Laravel Adminlte
Syntax/Steamapi
Node modules:
    Node-Steam-User
    Node-Steam-TOTP
    Crypto-js
    Crypto
    Node-forge
    Node-mysql
    FS

Prob more          
