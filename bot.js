const mineflayer = require('mineflayer');

// Configuración desde variables de entorno
const BOT_USERNAME = process.env.BOT_USERNAME || 'AFKBot';
const SERVER_HOST = process.env.SERVER_HOST || 'server.dispearson.tech';
const SERVER_PORT = parseInt(process.env.SERVER_PORT) || 25565;
const MINECRAFT_VERSION = process.env.MINECRAFT_VERSION || '1.21.1';
const RECONNECT_DELAY = parseInt(process.env.RECONNECT_DELAY) || 5000;
const ANTI_AFK_INTERVAL = parseInt(process.env.ANTI_AFK_INTERVAL) || 30000;

let bot;
let antiAfkInterval;

function createBot() {
  bot = mineflayer.createBot({
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_USERNAME,
    version: MINECRAFT_VERSION,
    auth: 'offline' // Para servidores no premium
  });

  bot.on('login', () => {
    console.log(`✅ Bot conectado como ${bot.username}`);
    console.log(`📍 Servidor: ${SERVER_HOST}:${SERVER_PORT}`);
    console.log(`🎮 Versión de Minecraft: ${MINECRAFT_VERSION}`);
    startAntiAfk();
  });

  bot.on('spawn', () => {
    console.log('🎮 Bot spawneado en el servidor');
    const pos = bot.entity.position;
    console.log(`📌 Posición inicial: X=${pos.x.toFixed(2)}, Y=${pos.y.toFixed(2)}, Z=${pos.z.toFixed(2)}`);
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    console.log(`💬 ${username}: ${message}`);
  });

  bot.on('kicked', (reason) => {
    console.log(`⚠️ Bot expulsado del servidor`);
    console.log(`📋 Razón: ${reason}`);
    stopAntiAfk();
    reconnect();
  });

  bot.on('error', (err) => {
    console.error('❌ Error:', err.message);
    if (err.code) console.error('📋 Código de error:', err.code);
    stopAntiAfk();
    reconnect();
  });

  bot.on('end', (reason) => {
    console.log('🔌 Conexión terminada');
    if (reason) console.log('📋 Razón:', reason);
    stopAntiAfk();
    reconnect();
  });

  bot.on('health', () => {
    console.log(`❤️ Salud: ${bot.health.toFixed(1)}/20 | 🍖 Hambre: ${bot.food.toFixed(1)}/20`);
  });

  bot.on('death', () => {
    console.log('💀 El bot murió, respawneando...');
    bot.chat('/respawn');
  });
}

function startAntiAfk() {
  console.log(`🔄 Anti-AFK activado (cada ${ANTI_AFK_INTERVAL/1000}s)`);
  
  antiAfkInterval = setInterval(() => {
    try {
      if (!bot || !bot.entity) return;

      // Rotación aleatoria de cabeza
      const yaw = Math.random() * Math.PI * 2;
      const pitch = (Math.random() - 0.5) * Math.PI / 2;
      bot.look(yaw, pitch, false);

      // Ocasionalmente saltar
      if (Math.random() < 0.3) {
        bot.setControlState('jump', true);
        setTimeout(() => {
          bot.setControlState('jump', false);
        }, 100);
      }

      // Ocasionalmente agacharse
      if (Math.random() < 0.2) {
        bot.setControlState('sneak', true);
        setTimeout(() => {
          bot.setControlState('sneak', false);
        }, 500);
      }

      console.log('🎯 Movimiento anti-AFK ejecutado');
    } catch (err) {
      console.error('❌ Error en anti-AFK:', err.message);
    }
  }, ANTI_AFK_INTERVAL);
}

function stopAntiAfk() {
  if (antiAfkInterval) {
    clearInterval(antiAfkInterval);
    antiAfkInterval = null;
    console.log('⏸️ Anti-AFK detenido');
  }
}

function reconnect() {
  console.log(`⏳ Reconectando en ${RECONNECT_DELAY/1000} segundos...`);
  setTimeout(() => {
    console.log('🔄 Intentando reconectar...');
    createBot();
  }, RECONNECT_DELAY);
}

// Manejo de señales para cerrar correctamente
process.on('SIGINT', () => {
  console.log('\n👋 Cerrando bot...');
  stopAntiAfk();
  if (bot) {
    bot.quit();
  }
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Cerrando bot (SIGTERM)...');
  stopAntiAfk();
  if (bot) {
    bot.quit();
  }
  process.exit(0);
});

// Iniciar el bot
console.log('🚀 Iniciando bot AFK de Minecraft...');
createBot();