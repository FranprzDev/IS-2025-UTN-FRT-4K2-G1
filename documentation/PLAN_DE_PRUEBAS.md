# Plan de Pruebas - Módulo de Urgencias (IS2025-001)

Este documento detalla los escenarios de prueba para validar la implementación del Módulo de Urgencias.

| ID | Escenario | Pasos de Prueba | Resultado Esperado |
|----|-----------|-----------------|--------------------|
| **SC01** | **Registro de Nuevo Paciente** | 1. Ir a la pestaña "Nuevo Paciente".<br>2. Completar todos los campos obligatorios (Nombre, Apellido, CUIL, Obra Social).<br>3. Hacer clic en "Crear Paciente". | El sistema muestra un mensaje de éxito y redirige automáticamente a la pestaña "Ingresar Urgencia" con el CUIL precargado. |
| **SC02** | **Ingreso de Urgencia (Paciente Existente)** | 1. Estando en "Ingresar Urgencia" (con CUIL ya cargado).<br>2. Seleccionar Nivel de Emergencia (ej. "Urgencia").<br>3. Completar signos vitales (Temp, FC, FR, TA) y motivo.<br>4. Hacer clic en "Registrar Ingreso". | El sistema confirma el registro y redirige a la "Lista de Espera", donde aparece el nuevo ingreso. |
| **SC03** | **Validación de Campos Obligatorios** | 1. Ir a "Ingresar Urgencia".<br>2. Dejar campos vacíos (ej. Temperatura o Motivo).<br>3. Intentar "Registrar Ingreso". | El navegador muestra alertas de validación o el sistema impide el envío, destacando los campos faltantes. |
| **SC04** | **Priorización en Lista de Espera** | 1. Registrar una urgencia con nivel "Urgencia Menor" (Nivel 4).<br>2. Registrar otra urgencia con nivel "Crítica" (Nivel 1).<br>3. Ir a "Lista de Espera". | El paciente con nivel "Crítica" debe aparecer **arriba** del paciente con "Urgencia Menor", independientemente del orden de llegada. |
| **SC05** | **Persistencia de Datos en Sesión** | 1. Navegar entre las pestañas "Nuevo Paciente", "Ingresar Urgencia" y "Lista de Espera".<br>2. Verificar que la lista de espera mantiene los datos cargados previamente. | La información se mantiene consistente mientras el servidor esté activo (persistencia en memoria). |

## Notas para el Tester
- Asegúrese de que el backend y frontend estén corriendo (`pnpm run dev` en ambas terminales).
- Para el video, narre brevemente lo que está haciendo en cada paso.
