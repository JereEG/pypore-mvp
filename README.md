# Pypore - Identidad Soberana Ganadera - MVP

Plataforma de trazabilidad inmutable para ganado (**punta de lanza en rodeo bubalino del NEA** con escalamiento a ganado bovino), orientada al cumplimiento de la normativa europea **EUDR** (Reglamento de la UE sobre productos libres de deforestación). Cada hito del animal (nacimiento, vacunación, pesaje, traslado) se ancla en **Hedera Consensus Service (HCS)** como fuente de verdad inmutable mientras el productor conserva la soberanía sobre sus datos frente a SENASA y frigoríficos.

## Declaración de Originalidad

Este proyecto fue desarrollado desde cero durante el **Ideathon NEA TECH 2026** (1° Puesto Track Hedera).

## Arquitectura Híbrida: DB Tradicional + Fuente de Verdad en Hedera

El diseño de producción de Pyporé combina dos capas complementarias:

1. **Base de Datos Tradicional (Capa Operativa y Privada):** Almacenamiento relacional de establecimientos, rodeos, métricas comerciales sensibles, políticas de soberanía del productor y cola de sincronización offline para operación sin conectividad en el corral. Garantiza consultas instantáneas, generación de guías/certificados imprimibles y resguardo de la privacidad comercial fuera de cadena pública.
2. **Hedera Consensus Service — HCS (Fuente de Verdad Inmutable):** Anclaje criptográfico de hashes SHA-256 encadenados (`previousHash`), firmas verificables (Triple Firma) y sellado temporal de consenso a costo fijo predecible (`$0.0001 USD` por mensaje). Permite auditar matemáticamente que ningún registro almacenado en la DB tradicional fue alterado retroactivamente.

## Funcionalidades

- **Landing Institucional (`/`):** Propuesta de valor, estrategia beachhead en el Búfalo de Agua (humedales libres de deforestación), tesis de inversión, arquitectura híbrida, historia, valores y convocatoria.
- **Demo Interactiva (`/demo`):**
  - **Selector de Rodeo:** Alterna en vivo entre **Búfalo Mediterráneo (`AR-05-BUF-0108`, Punta de Lanza)** y **Bovino Braford (`AR-05-8842-A`)**.
  - **Pasaporte y Trazabilidad:** Línea de tiempo del ejemplar con enlaces verificables a Hashscan.
  - **Control Instantáneo por QR & Guía DTA:** Modal nativo imprimible para auditoría en ruta, Prefectura y frigoríficos.
  - **Soberanía de Datos:** El productor activa o desactiva en vivo qué categorías comparte (historial sanitario, métricas de peso, ubicación exacta, datos genéticos).
  - **Simulador de Actores:** Alterna entre Productor, Auditor SENASA y Frigorífico; los datos no autorizados se muestran protegidos.
  - **Registro de Eventos & Cola Offline:** Publica hitos en HCS encadenados al `previousHash` anterior y ofrece registro local SHA-256 en modo contingencia offline ante falta de conectividad.

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
