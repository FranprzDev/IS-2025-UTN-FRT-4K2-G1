# Guía para Grabación de Evidencia (Loom)

Siga estos pasos para grabar la evidencia de las pruebas funcionales del Módulo de Urgencias.

## Preparación
1. Asegúrese de tener instalada la extensión de Loom o la aplicación de escritorio.
2. Tenga abierta la aplicación en su navegador (generalmente `http://localhost:3001`).
3. Tenga a mano el documento `PLAN_DE_PRUEBAS.md` para seguir los escenarios.

## Guion de Grabación

### Introducción (10-15 segundos)
- Inicie la grabación.
- Mencione su nombre y el objetivo: "Validación de la Historia de Usuario IS2025-001: Módulo de Urgencias".
- Muestre brevemente el Dashboard vacío o la pantalla de inicio.

### Escenario 1: Registro de Paciente
- Vaya a la pestaña **Nuevo Paciente**.
- Cargue un paciente ficticio (ej. "Juan Perez", CUIL "20-12345678-9").
- Mencione: "Registrando nuevo paciente con datos válidos".
- Envíe el formulario y destaque la redirección automática.

### Escenario 2: Ingreso de Urgencia
- Muestre que el CUIL ya está cargado en el formulario de urgencia.
- Seleccione un nivel de emergencia (ej. "Urgencia").
- Complete los signos vitales.
- Envíe el formulario y muestre la confirmación.

### Escenario 3: Verificación en Lista de Espera
- Muestre que el paciente aparece en la tabla de la pestaña **Lista de Espera**.
- Destaque los datos correctos (Nombre, Nivel, Hora).

### Escenario 4: Prueba de Prioridad (Crítico)
- Vuelva a **Nuevo Paciente** y cree otro paciente (ej. "Maria Gomez").
- Regístrele una urgencia con nivel **"Crítica"** (más grave que el anterior).
- Vaya a la **Lista de Espera** y muestre que Maria aparece **primera** en la lista, arriba de Juan, demostrando el ordenamiento por triaje.

### Escenario 5: Cierre
- Haga un breve resumen: "El sistema registra pacientes, admite urgencias y ordena correctamente la lista de espera".
- Finalice la grabación.

## Entrega
- Copie el link generado por Loom.
- Péguelo en la columna "Observaciones" del Excel de pruebas adjunto a la tarea.
