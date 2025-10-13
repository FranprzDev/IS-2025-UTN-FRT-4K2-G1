Feature: Registro de admisiones en el módulo de urgencias
  Como enfermera
  Quiero poder registrar las admisiones de los pacientes a urgencias
  Para determinar qué pacientes tienen mayor prioridad de atención

  Contexto del dominio:
  - Campos obligatorios: fechaIngreso, informe, nivelEmergencia, frecuenciaCardiaca, frecuenciaRespiratoria, tensionArterial
  - Niveles de emergencia (orden de prioridad): Crítica > Emergencia > Urgencia > Menor
  - Estados del paciente: PENDIENTE, EN_ATENCION, ATENDIDO, DERIVADO

Background:
  Given que la enfermera está autenticada en el sistema
  And que el módulo de urgencias está disponible

Scenario: Registrar ingreso de un paciente existente con todos los datos obligatorios
  Given que existe un paciente identificado en el sistema
  And que la enfermera ingresa todos los datos obligatorios correctamente
  | fechaIngreso | informe | nivelEmergencia | estado | temperatura | frecuenciaCardiaca | frecuenciaRespiratoria | tensionArterial |
  | 07/10/2025 | "Dolor en el pecho" | "Crítica" | PENDIENTE | 38.2 | 90 | 20 | 120/80 |
  When la enfermera registra la admisión
  Then el sistema guarda el ingreso del paciente
  And el paciente entra en la cola de atención con estado "PENDIENTE"

Scenario: Registrar ingreso de un paciente no existente en el sistema
  Given que el paciente no existe en el sistema
  When la enfermera intenta registrar la admisión
  Then el sistema muestra un mensaje indicando que el paciente debe ser creado primero
  And el sistema redirige a la pantalla de creación de pacientes

Scenario Outline: Registrar ingreso con dato obligatorio faltante
  Given que el paciente existe en el sistema
  And que la enfermera omite el dato "<campo>"
  When intenta registrar la admisión
  Then el sistema muestra un mensaje de error indicando que falta el dato "<campo>"

  Examples:
  | campo                 |
  | informe               |
  | nivel de emergencia   |
  | frecuencia cardíaca   |
  | frecuencia respiratoria |
  | tensión arterial      |

Scenario Outline: Registrar ingreso con valores negativos en frecuencias
  Given que el paciente existe en el sistema
  And que la enfermera ingresa un valor negativo en "<campo_frecuencia>"
  And que ingresa "-5" como valor
  When intenta registrar la admisión
  Then el sistema muestra un mensaje de error indicando que los valores de frecuencia no pueden ser negativos

  Examples:
  | campo_frecuencia     |
  | frecuencia cardíaca  |
  | frecuencia respiratoria |

Scenario Outline: Registrar ingreso con valores fuera de rango médico
  Given que el paciente existe en el sistema
  And que la enfermera ingresa "<valor>" en "<campo>"
  When intenta registrar la admisión
  Then el sistema muestra un mensaje de error indicando que "<campo>" está fuera del rango válido

  Examples:
  | campo | valor | rango |
  | temperatura | 25.0 | 35.0-42.0°C |
  | temperatura | 50.0 | 35.0-42.0°C |
  | frecuencia cardíaca | 300 | 40-200 lpm |
  | frecuencia respiratoria | 5 | 8-60 rpm |
  | tensión arterial | 300/200 | 90/60-180/120 mmHg |

Scenario: Registrar ingreso con fecha futura
  Given que el paciente existe en el sistema
  And que la enfermera ingresa una fecha futura "15/12/2025"
  When intenta registrar la admisión
  Then el sistema muestra un mensaje de error indicando que la fecha no puede ser futura

Scenario: Ingreso de paciente con mayor nivel de emergencia
  Given que hay un paciente B en espera con nivel de emergencia "Urgencia"
  And que la enfermera registra un nuevo paciente A con nivel de emergencia "Crítica"
  When ambos pacientes están en la lista de espera
  Then el sistema debe atender primero al paciente A antes que al paciente B

Scenario: Ingreso de paciente con menor nivel de emergencia
  Given que hay un paciente B en espera con nivel de emergencia "Crítica"
  And que la enfermera registra un nuevo paciente A con nivel de emergencia "Urgencia"
  When ambos pacientes están en la lista de espera
  Then el sistema debe atender primero al paciente B antes que al paciente A

Scenario: Ingreso de paciente con el mismo nivel de emergencia
  Given que hay un paciente B en espera con nivel de emergencia "Urgencia"
  And que la enfermera registra un nuevo paciente A con nivel de emergencia "Urgencia"
  And que el paciente B ingresó antes al sistema
  When ambos pacientes están en la lista de espera
  Then el sistema debe atender primero al paciente B por orden de llegada

Scenario: Paciente con múltiples niveles de prioridad en cola
  Given que hay pacientes en espera con diferentes niveles de emergencia:
  | paciente | nivel | tiempoEspera |
  | C | "Menor" | 2 horas |
  | B | "Urgencia" | 30 minutos |
  | A | "Crítica" | 5 minutos |
  When se atiende al siguiente paciente
  Then el sistema debe atender primero al paciente A (Crítica)
  And luego al paciente B (Urgencia)
  And finalmente al paciente C (Menor)