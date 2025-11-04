Feature: Modulo de reclamo para atender pacientes que se encuentran en la lista de espera
    Como médico.
    Quiero reclamar el proximo paciente que debe ser atendido.
    Para sacarlo de la lista de espera y poder registrar un informe de atención.

    Contexto del dominio:
    - Una vez el paciente es reclamado por el médico, el paciente debe salir de la lista de espera 
      y cambiar de estado a "EN_PROCESO" para indicar que esta siendo atendido.

Background: 
    Given que el siguiente médico esta registrado:
    |Nombre   |Apellido | 
    |Francisco|Perez    |
    And estan registrados los siguientes pacientes:
    |Cuil        |Apellido|Nombre    |Obra Social        |
    |23-1234567-9|Nunez   |Marcelo   |Subsidio de Salud  |
    |27-4567890-3|Dufour  |Alexandra |Swiss Medical      |
    |23-4567899-2|Estrella|Patricio  |Fondo de Bikini SA |

Scenario: El medico reclama al siguiente paciente en la lista de espera
    Given la actual lista de espera ordenada por cuil es:
    |Cuil        |
    |27-4567890-3|
    |23-4567899-2|
    |23-1234567-9|
    When el médico reclama al proximo paciente en la lista de espera
    Then el estado del ingreso del paciente con cuil:27-4567890-3 pasa a ser "EN_PROCESO"
    And la lista de espera ordenada por cuil es:
    |Cuil        |
    |23-4567899-2|
    |23-1234567-9|

Scenario: El medico reclama al siguiente paciente pero la lista de espera se encuentra vacía
Given la actual lista de espera esta vacía
When el médico reclama el proximo paciente en la lista de espera
Then el sistema muestra el siguiente mensaje de error: "No hay pacientes en la lista de espera."


    