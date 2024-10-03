# TENEO_CLI
teneo is an extension node based project that will run automatically when you click connect node in the extension.
Before running the extension, make sure you register first if you haven't registered, if you have, skip it.
# Register
1. https://teneo.pro/community-node : Click Download The Ektension
- Click Ektension
- Activate Developer Mode
- Click + From Zip > Upload Zip File
- Open Ektension
- Name : Teneo Community Node
- Create Account
- Enter Code : jSWys
- Verify Email
- Run Nodes Ektension
- Get 2500 Node Point
2. After all steps have been successfully completed, You can stop connecting to the node to run on a VPS of at least Ubuntu 22.04.
3. prepare coffee and let's be creative in this game
4. open your vps, input command :

# Instal On CLI
## create folder
```
mkdir teneo
cd teneo
```
## crate .env
Before running, make sure you have installed nodejs
```
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
node -v
```

```
nano .env
```
copy the command below and paste it
```
SUPABASE_URL=https://ikknngrgxuxgjhplbpey.supabase.co
SUPABASE_KEY=
SUPABASE_USER_EMAIL=
SUPABASE_USER_PASSWORD=
```
You can find the subbase key by first logging in to the extension, when you are logged in, right click and select inspect.
move to the network tab and click user, copy your token bearer.
## fill in file .env
📌 paste your bearer token into supabase_key and fill in the email and password used to log in to the extension. and CTRL+X choose y ENTER.
📌 command
- CTRL+SHIFT+V : used for pasting
- CTRL+A+D     : save screen
## Running
```
node teneo.js
```

