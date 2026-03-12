import mineflayer from "mineflayer"
import { mineflayer as mineflayerViewer } from "prismarine-viewer"
import vec3 from 'vec3'

const bot = mineflayer.createBot({
  host: 'javabottest.aternos.me', // minecraft server ip
  username: 'Herobrine', // username to join as if auth is `offline`, else a unique identifier for this account. Switch if you want to change accounts
  auth: 'offline', // for offline mode servers, you can set this to 'offline'
  // port: 25565,              // set if you need a port that isn't 25565
  version: "1.21.11",
  // password: '12345678'      // set if you want to use password-based auth (may be unreliable). If specified, the `username` must be an email
})

bot.on('chat', (username, message) => {
  if (username === bot.username) return
  bot.chat(message)
})

// Log errors and kick reasons:
bot.on('kicked', console.log)
bot.on('error', console.log)

bot.on('death', () => bot.respawn())

bot.on('login', () => {
  console.log('Bot logged in successfully')
})

async function digDown() {
  try {
    const mine = bot.blockAt(vec3(Math.floor(bot.entity.position.x), Math.floor(bot.entity.position.y) - 1, Math.floor(bot.entity.position.z)));
    if (!mine) {
        setTimeout(digDown, 1000);
        return;
    }
    await bot.dig(mine, true);
  } catch(e) {console.log(e)}
  
  setTimeout(digDown, 1000);
}

let done = false;
bot.on('spawn', () => {
  if (done) return;
  done = true;

  console.log('Bot spawned in the world')
  mineflayerViewer(bot, { port: 3000 }) // Start the viewing server on port 3000
  digDown();
})