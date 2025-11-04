Feature: Registro de pacientes en el sistema
    Como enfermera
    Quiero registrar pacientes
    Para poder realizar el ingreso a urgencias o buscarlos durante un ingreso en caso de que el paciente aparezca en urgencia más de una vez.

    Contexto del dominio:
    - Datos del paciente: Cuil, Apellido, Nombre, domicilio, Obra Social.

    Background:
        Given que la siguiente enfermera esta registrada:
        |Nombre   |Apellido|
        |Florencia|Perez   |

Scenario: Registrar paciente con todos los datos mandatorios y con obra social existente.
    Given que existe la siguiente obra social:
    |Nombre |
    |Osde   |
    When se registra el siguiente paciente:
    |Cuil         |Apellido |Nombre  |Domicilio        |Obra Social |Numero de afiliado|
    |20-44920883-9|Posse    |Gonzalo |Juan B. Teran 690|Osde        |56875             |
    Then el sistema registra el paciente

Scenario: Registrar paciente con todos los datos mandatorios pero sin obra social.
    When se registra el siguiente paciente:
    |Cuil         |Apellido |Nombre  |Domicilio        |Obra Social |Numero de afiliado|
    |20-44920883-9|Posse    |Gonzalo |Juan B. Teran 690|            |                  |
    Then el sistema registra el paciente.

    Scenario: Registrar paciente con todos los datos mandatorios pero con obra social inexistente.
    Given que existen las siguientes obras sociales:
    |Nombre      |
    |Osde        |
    |Sancor salud|
    When se registra el siguiente paciente:
    |Cuil         |Apellido |Nombre  |Domicilio        |Obra Social      |Numero de afiliado|
    |20-44920883-9|Posse    |Gonzalo |Juan B. Teran 690|La ayuda de jesus|                  |
    Then el sistema muestra el siguiente mensaje de error: "No se puede registrar al paciente con una obra social inexistente"

Scenario: Registrar un paciente con todos los datos mandatorios, con obra social existente, pero no esta afiliado.
    Given que existe la siguiente obra social:
    |Nombre |
    |Osde   |
    And el paciente no esta afiliado a dicha obra social.
    When se registra el siguiente paciente
    |Cuil         |Apellido |Nombre  |Domicilio        |Obra Social |Numero de afiliado|
    |20-44920883-9|Posse    |Gonzalo |Juan B. Teran 690|Osde        |56875             |
    Then El sistema muestra el siguiente mensaje de error: "El paciente no esta afiliado a esta obra social"

Scenario: Registrar un paciente con algun dato mandatorio faltante.
    When se registra el siguiente paciente:
    |Cuil         |Apellido |Nombre  |Domicilio        |Obra Social |Numero de afiliado|
    |             |Posse    |Gonzalo |Juan B. Teran 690|Osde        |56875             |
    Then El sistema envia el siguiente mensaje de error: "Se debe completar el campo: <campo>"

    examples: 
    |campo    |
    |Cuil     |
    |Apellido |
    |Nombre   |
    |Domicilio|