# Identidad Soberana Ganadera - MVP

Plataforma de trazabilidad inmutable para ganado bovino, orientada al cumplimiento de la normativa europea **EUDR** (Reglamento de la UE sobre productos libres de deforestación). Cada hito del animal (nacimiento, vacunación, pesaje, traslado) se registra en **Hedera Consensus Service (HCS)**. El productor conserva la soberanía sobre sus datos y decide qué categorías comparte con SENASA y frigoríficos.

## Declaración de Originalidad

Este proyecto fue desarrollado desde cero durante el **Ideathon NEA TECH 2026** (Track Hedera).

## Funcionalidades

- **Pasaporte y trazabilidad:** línea de tiempo del animal. Cada evento enlaza a su transacción en Hashscan.
- **Soberanía de datos:** el productor activa o desactiva en vivo qué categorías comparte (historial sanitario, métricas de peso, ubicación exacta, datos genéticos).
- **Simulador de actores:** alterna entre Productor, Auditor SENASA y Frigorífico. Los datos no autorizados se muestran protegidos.
- **Registro de eventos:** cada hito nuevo se publica en HCS y se encadena con el ID de transacción del evento anterior.
- **Degradación controlada:** si la red no responde, la API devuelve un `503` con un mensaje controlado y la interfaz sigue operativa.

## Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework | Next.js 16 (App Router, Route Handlers serverless) |
| Lenguaje | TypeScript (modo estricto) |
| Estilos | Tailwind CSS 4 |
| Iconos | lucide-react |
| Blockchain | `@hashgraph/sdk` (Hedera Consensus Service, Testnet) |

## Integración con Hedera

Los hitos de trazabilidad se registran en un **Topic de HCS** mediante `TopicMessageSubmitTransaction`. HCS ofrece orden de consenso justo, mensajes inmutables y sellado de tiempo público verificable. Las tarifas son fijas y predecibles, sin gas variable.

Cada mensaje incluye el payload del evento y el ID de la transacción anterior (`previousHash`), lo que forma una cadena auditable. La API (`/api/sign`) devuelve el `transactionId`, el timestamp de consenso y el enlace a Hashscan. La interfaz solo muestra datos respaldados por la red.

## Prueba de Transacción (Demo)

- **Topic ID (Testnet):** `0.0.11057428`
- **Hashscan:** [https://hashscan.io/testnet/transaction/0.0.11003724@1792214697.886430608](https://hashscan.io/testnet/transaction/0.0.11003724@1792214697.886430608)

## Instalación y Despliegue

### 1. Clonar el repositorio

```bash
git clone https://github.com/JereEG/pypore-mvp.git
cd pypore-mvp
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Crear un archivo `.env.local` en la raíz, basado en `.env.example`:

```env
HEDERA_ACCOUNT_ID=0.0.xxxxxxx
HEDERA_PRIVATE_KEY=302e020100300506032b657004220420...
HEDERA_TOPIC_ID=0.0.xxxxxxx
```

- `HEDERA_ACCOUNT_ID` y `HEDERA_PRIVATE_KEY`: credenciales de una cuenta de Testnet. Se obtienen en el [Hedera Portal](https://portal.hedera.com). La clave se espera en formato DER.
- `HEDERA_TOPIC_ID`: se genera en el siguiente paso.

### 4. Scripts de Hedera

Crear el Topic. Imprime `HEDERA_TOPIC_ID=0.0.xxxxxxx`, que debe copiarse a `.env.local`:

```bash
npm run hedera:create-topic
```

Publicar los eventos históricos del animal semilla en el Topic:

```bash
npm run hedera:seed
```

El script imprime el bloque `events` con los `hederaTransactionId` y `hashscanUrl` reales. Hay que pegarlo en `SEED_ANIMAL_RECORD`, en `src/domain/demoConfig.ts`.

> Ejecutar `hedera:seed` más de una vez duplica los mensajes en el Topic.

### 5. Ejecutar en desarrollo

```bash
npm run dev
```

La aplicación queda disponible en [http://localhost:3000](http://localhost:3000).

### Despliegue (Vercel)

Cargar `HEDERA_ACCOUNT_ID`, `HEDERA_PRIVATE_KEY` y `HEDERA_TOPIC_ID` en **Settings > Environment Variables** (Production y Preview) y hacer un redeploy. Sin estas variables, `/api/sign` responde `503`.

## Estructura del Proyecto

```text
src/
├── app/api/sign/route.ts        # Endpoint serverless: publica en HCS
├── components/                  # UI: pasaporte, soberanía, registro de eventos
├── context/TraceabilityContext  # Estado, roles y políticas de soberanía
├── domain/                      # Tipos del dominio y configuración de la demo
├── lib/hedera.ts                # Cliente y envío de mensajes a HCS
└── scripts/                     # create-topic y seed de eventos históricos
```
