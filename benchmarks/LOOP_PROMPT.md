# Loop de Evaluación y Mejora Continua — Pyporé

Usa este prompt cada vez que agregues respuestas reales de la encuesta anónima o transcripciones de entrevistas de campo en `benchmarks/`:

---

Actúa como **Senior Forward Deployed Engineer** de **Pyporé**.

1. **Inspección de Evidencia Real:**
   - Lee las nuevas respuestas de productores, veterinarios o frigoríficos en `benchmarks/` y compáralas contra `benchmarks/casos-campo.json` y `src/lib/naturalEventParser.ts`.
   - Identifica qué términos rurales, abreviaturas, errores de carga o fricciones reales de campo no están cubiertos todavía.

2. **Evaluación del Extractor y Flujo Offline:**
   - Evalúa la precisión de `parseNaturalFieldEvent` sobre los casos nuevos (tipo de evento, cantidad/ID, fecha, ubicación).
   - Verifica que el flujo **Modo Potrero (Sin Señal)** + **Sincronización a Hedera HCS** + **Constancia Imprimible** resuelva el dolor sin pedir pasos innecesarios.

3. **Priorización (Top 3 Mejoras de Mayor Impacto):**
   - Propón exactamente las **3 mejoras de producto con mayor impacto operativo/comercial**, ordenadas por retorno para el productor y cumplimiento **EUDR / SENASA**, indicando:
     1. Dolor real observado en los datos.
     2. Cambio concreto en código o UX.
     3. Criterio de verificación medible.
