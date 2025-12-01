const mineflayer = require('mineflayer');
const antiafk = require('mineflayer-antiafk');

// Configuración desde variables de entorno
const BOT_USERNAME = process.env.BOT_USERNAME || 'AFKBot';
const SERVER_HOST = process.env.SERVER_HOST || 'server.dispearson.tech';
const SERVER_PORT = parseInt(process.env.SERVER_PORT) || 25565;
const MINECRAFT_VERSION = process.env.MINECRAFT_VERSION || '1.21.1';
const RECONNECT_DELAY = parseInt(process.env.RECONNECT_DELAY) || 5000;

let bot;

function createBot() {
  const botOptions = {
    host: SERVER_HOST,
    port: SERVER_PORT,
    username: BOT_USERNAME,
    version: MINECRAFT_VERSION,
    auth: 'offline',
    hideErrors: false
  };
  
  console.log('🔧 Conectando con opciones:', JSON.stringify(botOptions, null, 2));
  
  bot = mineflayer.createBot(botOptions);
  
  // Cargar plugin anti-AFK
  bot.loadPlugin(antiafk);

  bot.on('login', () => {
    console.log(`✅ Bot conectado como ${bot.username}`);
    console.log(`📍 Servidor: ${SERVER_HOST}:${SERVER_PORT}`);
    console.log(`🎮 Versión: ${MINECRAFT_VERSION}`);
  });

  bot.on('spawn', () => {
    console.log('🎮 Bot spawneado en el servidor');
    const pos = bot.entity.position;
    console.log(`📌 Posición: X=${pos.x.toFixed(2)}, Y=${pos.y.toFixed(2)}, Z=${pos.z.toFixed(2)}`);
    
    // Configurar y activar anti-AFK
    bot.afk.setOptions({
      actions: ['rotate', 'jump', 'swingArm'], // Acciones simples
      fishing: false,
      minInterval: 30000, // Mínimo 30 segundos entre acciones
      maxInterval: 60000  // Máximo 60 segundos entre acciones
    });
    
    bot.afk.start();
    console.log('🔄 Sistema anti-AFK activado');
  });

  bot.on('chat', (username, message) => {
    if (username === bot.username) return;
    console.log(`💬 ${username}: ${message}`);
  });

  bot.on('kicked', (reason) => {
    console.log(`⚠️ Bot expulsado del servidor`);
    console.log(`📋 Razón:`, JSON.stringify(reason));
    reconnect();
  });

  bot.on('error', (err) => {
    console.error('❌ Error:', err.message);
    if (err.code) console.error('📋 Código:', err.code);
  });

  bot.on('end', (reason) => {
    console.log('🔌 Conexión terminada');
    if (reason) console.log('📋 Razón:', reason);
    reconnect();
  });

  bot.on('health', () => {
    if (bot.health < 5) {
      console.log('⚠️ Salud baja, deteniendo anti-AFK');
      bot.afk.stop();
    }
  });

  bot.on('death', () => {
    console.log('💀 El bot murió, respawneando...');
    bot.chat('/respawn');
    setTimeout(() => {
      if (bot.afk) bot.afk.start();
    }, 2000);
  });
}

function reconnect() {
  console.log(`⏳ Reconectando en ${RECONNECT_DELAY/1000} segundos...`);
  setTimeout(() => {
    console.log('🔄 Intentando reconectar...');
    createBot();
  }, RECONNECT_DELAY);
}

// Manejo de señales
process.on('SIGINT', () => {
  console.log('\n👋 Cerrando bot...');
  if (bot) bot.quit();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Cerrando bot (SIGTERM)...');
  if (bot) bot.quit();
  process.exit(0);
});

// Iniciar
console.log('🚀 Iniciando bot AFK de Minecraft...');
createBot();