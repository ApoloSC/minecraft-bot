# 🤖 Bot AFK de Minecraft - Mineflayer

Bot AFK para servidores de Minecraft no premium que evita ser expulsado por inactividad.

## 🚀 Características

- ✅ Conexión a servidores no premium (offline mode)
- ✅ Sistema anti-AFK automático
- ✅ Reconexión automática en caso de desconexión
- ✅ Movimientos aleatorios (mirar, saltar, agacharse)
- ✅ Respawn automático al morir
- ✅ Logs detallados de actividad
- ✅ Dockerizado y listo para Coolify

## 📋 Requisitos

- Docker y Docker Compose
- Node.js 18+ (solo para desarrollo local)

## 🛠️ Instalación

### Opción 1: Despliegue con Docker Compose

1. Clona el repositorio:
```bash
git clone <tu-repositorio>
cd minecraft-afk-bot
```

2. Configura las variables de entorno (opcional):
```bash
cp .env.example .env
# Edita .env con tus valores
```

3. Inicia el bot:
```bash
docker-compose up -d
```

4. Ver logs:
```bash
docker-compose logs -f
```

### Opción 2: Desarrollo Local

1. Instala las dependencias:
```bash
npm install
```

2. Configura las variables de entorno:
```bash
cp .env.example .env
# Edita .env
```

3. Inicia el bot:
```bash
npm start
```

## ⚙️ Configuración

Edita las variables de entorno en `docker-compose.yml` o `.env`:

| Variable | Descripción | Default |
|----------|-------------|---------|
| `BOT_USERNAME` | Nombre del bot en el servidor | `AFKBot` |
| `SERVER_HOST` | Dirección del servidor | `server.dispearson.tech` |
| `SERVER_PORT` | Puerto del servidor | `25565` |
| `RECONNECT_DELAY` | Tiempo de espera antes de reconectar (ms) | `5000` |
| `ANTI_AFK_INTERVAL` | Intervalo entre acciones anti-AFK (ms) | `30000` |

## 🎮 Uso

1. Inicia el bot con Docker Compose
2. El bot se conectará automáticamente al servidor
3. Mueve manualmente al bot a la posición deseada en el servidor
4. El bot realizará movimientos anti-AFK automáticamente

## 🐳 Despliegue en Coolify

1. Sube el código a GitHub
2. En Coolify, crea una nueva aplicación
3. Selecciona tu repositorio de GitHub
4. Coolify detectará automáticamente el Dockerfile
5. Configura las variables de entorno en Coolify
6. Despliega

## 📊 Monitoreo

Ver logs en tiempo real:
```bash
docker-compose logs -f minecraft-bot
```

Ver estado del contenedor:
```bash
docker-compose ps
```

## 🛑 Detener el Bot

```bash
docker-compose down
```

## 🔧 Solución de Problemas

### El bot no se conecta
- Verifica que el servidor esté en línea
- Confirma que el dominio y puerto sean correctos
- Revisa que el servidor permita conexiones no premium

### El bot se desconecta constantemente
- Aumenta el `RECONNECT_DELAY`
- Verifica los logs para ver el motivo de desconexión

### El bot sigue siendo expulsado por AFK
- Reduce el `ANTI_AFK_INTERVAL` (ej: 15000 para 15 segundos)
- Verifica que el plugin anti-AFK del servidor no sea muy estricto

## 📝 Licencia

MIT

## ⚠️ Advertencia

Este bot es solo para uso educativo. Asegúrate de tener permiso para usar bots en el servidor antes de conectarlo.