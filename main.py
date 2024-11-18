import os
import aiohttp
import asyncio
from colorama import Fore, Style


green = Fore.LIGHTGREEN_EX
magenta = Fore.LIGHTMAGENTA_EX
yellow = Fore.LIGHTYELLOW_EX
reset = Style.RESET_ALL


ping_emoji = "⚡"
laugh_emoji = "😂"
timer_emoji = "⏳"
refresh_emoji = "🔄"

class TeneoXD:
    def __init__(self):
        self.wss_url = "wss://secure.ws.teneo.pro/websocket"
        self.ping_count = 0 

    def log(self, msg, color=green):
        """Log without timestamp, only the message."""
        print(f"{color}{msg}{reset}")

    async def connect(self, userid):
        self.ses = aiohttp.ClientSession()
        try:
            while True:
                try:
                    async with self.ses.ws_connect(
                        url=f"{self.wss_url}?userId={userid}&version=v0.2"
                    ) as wss:
                        self.log("Connected to websocket server", green)
                        while True:
                            msg = await wss.receive_json(timeout=10)
                            point_today = msg.get("pointsToday")
                            point_total = msg.get("pointsTotal")

                            # Send PING to server every 10 seconds
                            for i in range(90):
                                await wss.send_json({"type": "PING"})
                                self.ping_count += 1
                                self.log_heartbeat(i)  
                                await countdown(10)

                                
                                if self.ping_count % 15 == 0:
                                    self.log_points_and_refresh(point_today, point_total)

                except Exception as e:
                    self.log(f"Error: {e}", yellow)
                    self.log("Retrying connection...", yellow)
        except asyncio.CancelledError:
            self.log("Session closed.", green)
        finally:
            await self.ses.close()

    def log_heartbeat(self, countdown_time):
        """Log heartbeat with emoticons and countdown timer."""
        remaining_time = 10 - (countdown_time % 10)  
        self.log(f"{ping_emoji} Next heartbeat in: {timer_emoji} {remaining_time} seconds {laugh_emoji} !!", magenta)

    def log_points_and_refresh(self, point_today, point_total):
        """Log points and refresh message every 15 PINGs."""
        self.log(f"{ping_emoji} Next heartbeat in: {timer_emoji} 10 seconds {laugh_emoji} !!", magenta)
        self.log(
            f"Point today: {point_today} Point total: {point_total} | {refresh_emoji} in 24 Hours !!",
            green,
        )

async def countdown(t):
    """Countdown timer displayed in log every 10 seconds."""
    for i in range(t, 0, -1):
        minute, seconds = divmod(i, 60)
        hour, minute = divmod(minute, 60)
        seconds = str(seconds).zfill(2)
        minute = str(minute).zfill(2)
        hour = str(hour).zfill(2)
        print(f"{yellow}Waiting for {hour}:{minute}:{seconds} ", flush=True, end="\r")
        await asyncio.sleep(1)

async def login_and_get_userid():
   
    print(Fore.BLUE + '██     ██ ██ ███    ██ ███████ ███    ██ ██ ██████  ')
    print('██     ██ ██ ████   ██ ██      ████   ██ ██ ██   ██ ')
    print('██  █  ██ ██ ██ ██  ██ ███████ ██ ██  ██ ██ ██████  ')
    print('██ ███ ██ ██ ██  ██ ██      ██ ██  ██ ██ ██ ██      ')
    print(' ███ ███  ██ ██   ████ ███████ ██   ████ ██ ██      ')
    print(Fore.RESET)
    print("Join our Telegram channel: https://t.me/winsnip")

 
    email = input("Input email: ")
    password = input("Input password: ")
    
    login_url = (
        "https://ikknngrgxuxgjhplbpey.supabase.co/auth/v1/token?grant_type=password"
    )
    login_data = {
        "email": email,
        "password": password,
        "gotrue_meta_security": {},
    }
    headers = {
        "accept": "*/*",
        "accept-language": "en-US,en;q=0.9,id;q=0.8",
        "apikey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlra25uZ3JneHV4Z2pocGxicGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0MzgxNTAsImV4cCI6MjA0MTAxNDE1MH0.DRAvf8nH1ojnJBc3rD_Nw6t1AV8X_g6gmY_HByG2Mag",
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlra25uZ3JneHV4Z2pocGxicGV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjU0MzgxNTAsImV4cCI6MjA0MTAxNDE1MH0.DRAvf8nH1ojnJBc3rD_Nw6t1AV8X_g6gmY_HByG2Mag",
        "content-type": "application/json;charset=UTF-8",
        "origin": "chrome-extension://emcclcoaglgcpoognfiggmhnhgabppkm",
        "priority": "u=1, i",
        "sec-ch-ua": '"Chromium";v="130", "Microsoft Edge";v="130", "Not?A_Brand";v="99"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0",
        "x-client-info": "supabase-js-web/2.45.4",
        "x-supabase-api-version": "2024-01-01",
    }
    async with aiohttp.ClientSession() as client:
        result = await client.post(login_url, json=login_data, headers=headers)
        if result.status != 200:
            print(f"[x] login failure, try again later or get data manually!")
            exit()
        res = await result.json()
        userid = res.get("user", {}).get("id")

        
        with open("userid.txt", "w") as file:
            file.write(userid)
        
        print(f"[+] login success, now run main.py!")

async def main():
    os.system("cls" if os.name == "nt" else "clear")
    # Cek apakah file userid.txt ada
    if not os.path.exists("userid.txt"):
        # Menampilkan pesan setelah logo
        print(f"{green}you haven't userid.txt file, it's ok!{reset}")
    
    print(f"Running setup.py to login...") 

    await login_and_get_userid()

    userid = open("userid.txt").read()
    await asyncio.create_task(TeneoXD().connect(userid=userid))

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n[+] Program interrupted, closing session...")
       
        try:
            loop = asyncio.get_event_loop()
            loop.close()
        except RuntimeError:
            pass  # No loop available to close
