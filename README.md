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
# Manual Install
## 1. Screen
```
screen -S teneo
```
## 2. Clone Repository
```
git clone https://github.com/winsnip/TENEO_CLI.git
```
## 3. Open Folder
```
cd TENEO_CLI
```
```
pip install -r requirements.txt
```
## 4. Create a file with userid.txt
Before running, make sure you have installed nodejs adn dotenv
```
nano userid.txt
```
## 5. Find user id
u can get user id with inspect on exstension, open teneo exstension and right click on the mouse or F12, if u using smartphone u can choose developer tools, move to the network tab.
to display the user id u must click connect first on the extension until it really connected and now u have found it.

## Copy user id and paste on userid.txt file
CTRL+X choose y ENTER to save
📌 Command
- CTRL+SHIFT+V : used for pasting
## 6. Running
```
python3 main.py
```
📌 Command
- CTRL+A+D     : save screen
to open the teneo screen
📌 Command
```
screen -r teneo
```
donation link
- kalo mau bayarin kopi https://trakteer.id/Winsnipsupport/tip
- u can buy me a coffee https://trakteer.id/Winsnipsupport/tip


