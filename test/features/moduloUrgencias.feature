Feature: Registro de admisiones en el módulo de urgencias
  Como enfermera
  Quiero poder registrar las admisiones de los pacientes a urgencias
  Para determinar qué pacientes tienen mayor prioridad de atención

  Contexto del dominio:
  - Campos obligatorios: Cuil, informe, nivelEmergencia, temperatura, frecuenciaCardiaca, frecuenciaRespiratoria, tensionArterial
  - Niveles de emergencia (orden de prioridad): Crítica > Emergencia > Urgencia > Urgencia Menor > Sin Urgencia

Background:
  Given que la siguiente enfermera esta registrada:
  |Nombre   |Apellido|
  |Florencia|Perez   |
  And que el módulo de urgencias está disponible

Scenario: Registrar ingreso de un paciente existente con todos los datos obligatorios
  Given que el siguiente paciente esta registrado
  |Cuil         |Apellido|Nombre |Obra Social|
  |23-44920883-9|Posse   |Gonzalo|Osde       |
  When Ingresan a urgencias los siguientes pacientes:
    |Cuil         |Informe       |Nivel de Emergencia|Temperatura|Frecuencia Cardiaca|Frecuencia Respiratoria|Tension Arterial|
    |23-44920883-9|Tiene vomito  |Emergencia         |38         |70                 |15                     |120/80          |
  Then el sistema guarda el ingreso del paciente

Scenario: Registrar ingreso de un paciente no existente en el sistema
  Given que el paciente no existe en el sistema
  When Ingresan a urgencias los siguientes pacientes:
    |Cuil         |Informe       |Nivel de Emergencia|Temperatura|Frecuencia Cardiaca|Frecuencia Respiratoria|Tension Arterial|
    |23-44920883-9|Tiene vomito  |Emergencia         |38         |70                 |15                     |120/80          |
  Then el sistema muestra el siguiente mensaje: "Paciente con CUIL 23-44920883-9 no encontrado"

Scenario: Ingreso del primer paciente a la lista de espera de urgencias
  Given que estan registrados los siguientes pacientes:
  |Cuil        |Apellido|Nombre    |Obra Social       |
  |23-1234567-9|Nunez   |Marcelo   |Subsidio de Salud |
  |27-4567890-3|Dufour  |Alexandra |Swiss Medical     |
  When Ingresan a urgencias los siguientes pacientes:
  |Cuil        |Informe         |Nivel de Emergencia|Temperatura|Frecuencia Cardiaca|Frecuencia Respiratoria|Tension Arterial|
  |23-1234567-9|Le agarro dengue|Emergencia         |38         |70                 |15                     |120/80          |
  Then La lista de espera esta ordenada por cuil de la siguiente manera:
  |23-1234567-9|

Scenario: Ingreso de un paciente de bajo nivel de emergencia y luego otro de alto nivel de emergencia
  Given que estan registrados los siguientes pacientes:
  |Cuil        |Apellido|Nombre    |Obra Social        |
  |23-1234567-9|Nunez   |Marcelo   |Subsidio de Salud  |
  |27-4567890-3|Dufour  |Alexandra |Swiss Medical      |
  |23-4567899-2|Estrella|Patricio  |Fondo de Bikini SA |
  When Ingresan a urgencias los siguientes pacientes:
  |Cuil        |Informe        |Nivel de Emergencia|Temperatura|Frecuencia Cardiaca|Frecuencia Respiratoria|Tension Arterial|
  |23-4567899-2|Le duele el ojo|Sin Urgencia       |37         |70                 |15                     |120/80          |
  |23-1234567-9|Le agarro dengue|Emergencia        |38         |70                 |15                     |120/80          |
  Then La lista de espera esta ordenada por cuil de la siguiente manera:
  |23-1234567-9|
  |23-4567899-2|

Scenario: Ingreso un paciente sin urgencia y dos con urgencia
  Given que estan registrados los siguientes pacientes:
  |Cuil        |Apellido|Nombre    |Obra Social        |
  |23-1234567-9|Nunez   |Marcelo   |Subsidio de Salud  |
  |27-4567890-3|Dufour  |Alexandra |Swiss Medical      |
  |23-4567899-2|Estrella|Patricio  |Fondo de Bikini SA |
  When Ingresan a urgencias los siguientes pacientes:
  |Cuil        |Informe            |Nivel de Emergencia|Temperatura|Frecuencia Cardiaca|Frecuencia Respiratoria|Tension Arterial|
  |27-4567890-3|Le duele la pestana|Sin Urgencia       |37         |70                 |15                     |120/80          |
  |23-4567899-2|Le agarro neumonia |Emergencia         |37         |70                 |15                     |120/80          |
  |23-1234567-9|Le agarro dengue   |Emergencia         |38         |70                 |15                     |120/80          |
  Then La lista de espera esta ordenada por cuil de la siguiente manera:
  |23-4567899-2|
  |23-1234567-9|
  |27-4567890-3|

Scenario: Ingreso de paciente con mayor nivel de emergencia
  Given que estan registrados los siguientes pacientes:
  |Cuil         |Apellido      |Nombre   |Obra Social   |
  |23-44190234-4|Perez         |Francisco|Subsidio salud|
  |23-44920883-4|Posse         |Gonzalo  |Osde          |
  |23-45985689-2|Parada Parejas|Manuel   |Sancor salud  |
  When Ingresan a urgencias los siguientes pacientes:
  |Cuil         |Informe        |Nivel de Emergencia|Temperatura|Frecuencia Cardiaca|Frecuencia Respiratoria|Tension Arterial|
  |23-44190234-4|Le duele el ojo|Sin Urgencia       |37         |70                 |15                     |120/80          |
  |23-44920883-4|Le agarro dengue|Emergencia        |38         |70                 |15                     |120/80          |
  Then La lista de espera esta ordenada por cuil de la siguiente manera:
  |23-44920883-4|
  |23-44190234-4|

Scenario: Ingreso de paciente con el mismo nivel de emergencia
  Given que estan registrados los siguientes pacientes:
  |Cuil         |Apellido      |Nombre   |Obra Social   |
  |23-44190234-4|Perez         |Francisco|Subsidio salud|
  |23-44920883-4|Posse         |Gonzalo  |Osde          |
  |23-45985689-2|Parada Parejas|Manuel   |Sancor salud  |
  When Ingresan a urgencias los siguientes pacientes:
  |Cuil         |Informe         |Nivel de Emergencia|Temperatura|Frecuencia Cardiaca|Frecuencia Respiratoria|Tension Arterial|
  |23-45985689-2|le agarro dengue|Emergencia         |38         |75                 |14                     |120/81          |              
  |23-44190234-4|Le duele el ojo |Sin Urgencia       |37         |70                 |15                     |120/80          |
  |23-44920883-4|Le agarro dengue|Emergencia         |38         |70                 |15                     |120/80          |
  Then La lista de espera esta ordenada por cuil de la siguiente manera:
  |23-45985689-2|
  |23-44920883-4|
  |23-44190234-4|

Scenario: Paciente con múltiples niveles de prioridad en cola
  Given que estan registrados los siguientes pacientes:
  |Cuil         |Apellido      |Nombre   |Obra Social   |
  |23-44190234-4|Perez         |Francisco|Subsidio salud|
  |23-44920883-4|Posse         |Gonzalo  |Osde          |
  |23-45985689-2|Parada Parejas|Manuel   |Sancor salud  |
  When Ingresan a urgencias los siguientes pacientes:
  |Cuil         |Informe         |Nivel de Emergencia|Temperatura|Frecuencia Cardiaca|Frecuencia Respiratoria|Tension Arterial|
  |23-45985689-2|le agarro dengue|Urgencia           |38         |75                 |14                     |120/81          |              
  |23-44190234-4|Le duele el ojo |Sin Urgencia       |37         |70                 |15                     |120/80          |
  |23-44920883-4|Le agarro dengue|Emergencia         |38         |70                 |15                     |120/80          |
  Then La lista de espera esta ordenada por cuil de la siguiente manera:
  |23-44920883-4|
  |23-45985689-2|
  |23-44190234-4|

Scenario: Registrar ingreso con valores negativos en Frecuencia Cardíaca
  Given que estan registrados los siguientes pacientes:
  |Cuil         |Apellido    |Nombre|Obra Social  |
  |23-12345678-7|Gomez Rivera|Pablo |Swiss Medical|
  When Ingresan a urgencias los siguientes pacientes:
  |Cuil         |Informe            |Nivel de Emergencia|Temperatura|Frecuencia Cardiaca|Frecuencia Respiratoria|Tension Arterial|
  |23-12345678-7|Le duele la pestana|Sin Urgencia       |37         |-70                |15                     |120/80          |
  Then el sistema muestra el siguiente error: "La frecuencia cardíaca no puede ser negativa"

Scenario: Registrar ingreso con valores negativos en Frecuencia Respiratoria
  Given que estan registrados los siguientes pacientes:
  |Cuil         |Apellido    |Nombre|Obra Social  |
  |23-12345678-7|Gomez Rivera|Pablo |Swiss Medical|
  When Ingresan a urgencias los siguientes pacientes:
  |Cuil         |Informe            |Nivel de Emergencia|Temperatura|Frecuencia Cardiaca|Frecuencia Respiratoria|Tension Arterial|
  |23-12345678-7|Le duele la pestana|Sin Urgencia       |37         |70                 |-15                    |120/80          |
  Then el sistema muestra el siguiente error: "La frecuencia respiratoria no puede ser negativa"

Scenario: Registrar ingreso con valores de temperatura fuera de rango médico
  Given que estan registrados los siguientes pacientes:
  |Cuil         |Apellido|Nombre   |Obra Social   |
  |23-44190234-4|Perez   |Francisco|Subsidio salud|
  When Ingresan a urgencias los siguientes pacientes:
  |Cuil         |Informe     |Nivel de Emergencia|Temperatura|Frecuencia Cardiaca|Frecuencia Respiratoria|Tension Arterial|
  |23-44190234-4|Tiene vomito|Emergencia         |50         |60                 |15                     |120/80          |
  Then el sistema muestra el siguiente error: "La temperatura se encuentra fuera de rango"

Scenario: Registrar ingreso con valores de frecuencia cardíaca fuera de rango médico
  Given que estan registrados los siguientes pacientes:
  |Cuil         |Apellido|Nombre   |Obra Social   |
  |23-44190234-4|Perez   |Francisco|Subsidio salud|
  When Ingresan a urgencias los siguientes pacientes:
  |Cuil         |Informe     |Nivel de Emergencia|Temperatura|Frecuencia Cardiaca|Frecuencia Respiratoria|Tension Arterial|
  |23-44190234-4|Tiene vomito|Emergencia         |37         |10                 |15                     |120/80          |
  Then el sistema muestra el siguiente error: "La frecuencia cardíaca se encuentra fuera de rango"

Scenario: Registrar ingreso con valores de frecuencia respiratoria fuera de rango médico
  Given que estan registrados los siguientes pacientes:
  |Cuil         |Apellido|Nombre   |Obra Social   |
  |23-44190234-4|Perez   |Francisco|Subsidio salud|
  When Ingresan a urgencias los siguientes pacientes:
  |Cuil         |Informe     |Nivel de Emergencia|Temperatura|Frecuencia Cardiaca|Frecuencia Respiratoria|Tension Arterial|
  |23-44190234-4|Tiene vomito|Emergencia         |37         |80                 |120                    |120/80          |
  Then el sistema muestra el siguiente error: "La frecuencia respiratoria se encuentra fuera de rango"

Scenario: Registrar ingreso con valores de tensión arterial fuera de rango médico
  Given que estan registrados los siguientes pacientes:
  |Cuil         |Apellido|Nombre   |Obra Social   |
  |23-44190234-4|Perez   |Francisco|Subsidio salud|
  When Ingresan a urgencias los siguientes pacientes:
  |Cuil         |Informe     |Nivel de Emergencia|Temperatura|Frecuencia Cardiaca|Frecuencia Respiratoria|Tension Arterial|
  |23-44190234-4|Tiene vomito|Emergencia         |37         |80                 |15                     |200/160         |
  Then el sistema muestra el siguiente error: "La tensión arterial se encuentra fuera de rango"



