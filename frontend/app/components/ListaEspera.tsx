'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';

interface ValorCuil {
  valor: string;
}

interface PacienteIngreso {
  nombre: string;
  apellido: string;
  cuil: ValorCuil;
}

interface NivelEmergenciaIngreso {
  descripcion: string;
}

interface Ingreso {
  paciente: PacienteIngreso;
  nivelEmergencia: NivelEmergenciaIngreso;
  fechaIngreso?: string;
  estado?: string;
}

export default function ListaEspera({
  refreshTrigger,
  onReclamoExitoso,
}: {
  refreshTrigger: number;
  onReclamoExitoso?: () => void;
}) {
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [userRole, setUserRole] = useState<string>("");
  const [message, setMessage] = useState("");
  const [loadingCuil, setLoadingCuil] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [ingresosAsignados, setIngresosAsignados] = useState<Ingreso[]>([]);
  const [doctorData, setDoctorData] = useState({
    nombre: "",
    apellido: "",
    cuil: "",
    matricula: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const rol: string = payload.rol || "";
      setUserRole(rol);
      const email: string = payload.email || "";
      const baseName = email.split("@")[0] || "medico";
      setDoctorData({
        nombre: baseName,
        apellido: "Cuenta",
        cuil: "20123456789",
        matricula: "MAT-DEFAULT",
      });
    } catch (error) {
      console.error("Error decodificando token:", error);
    }
  }, []);

  const cargarIngresos = useCallback(async (): Promise<void> => {
    try {
      const res = await fetch("/api/urgencias/lista-espera");
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Error al cargar lista de espera");
      }
      const data = await res.json();
      setIngresos(data);
    } catch (err) {
      console.error(err);
      setMessage("Error al cargar lista de espera");
      setToastType("error");
    }
  }, []);

  const cargarMisIngresos = useCallback(async (): Promise<void> => {
    if (userRole !== "medico") {
      return;
    }
    try {
      const res = await fetch("/api/reclamo/mis-ingresos", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
      });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || "Error al cargar mis ingresos");
      }
      const data = await res.json();
      setIngresosAsignados(data);
    } catch (err) {
      console.error(err);
      setToastType("error");
      setMessage("Error al cargar mis ingresos");
    }
  }, [userRole]);

  useEffect(() => {
    cargarIngresos();
  }, [cargarIngresos, refreshTrigger]);

  useEffect(() => {
    cargarMisIngresos();
  }, [cargarMisIngresos, refreshTrigger]);

  const estadoEsEnProceso = useCallback((estado?: string): boolean => {
    if (!estado) {
      return false;
    }
    return estado.toLowerCase() === "en proceso";
  }, []);

  const doctorOcupado = useMemo(
    () => ingresosAsignados.some((ingreso) => estadoEsEnProceso(ingreso.estado)),
    [estadoEsEnProceso, ingresosAsignados],
  );

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case "Critica":
        return "#ef4444";
      case "Emergencia":
        return "#f97316";
      case "Urgencia":
        return "#eab308";
      default:
        return "#3b82f6";
    }
  };

  const handleReclamarPaciente = async (ingresoCuil?: string) => {
    if (ingresos.length === 0) {
      setToastType("error");
      setMessage("No hay nadie en la lista de espera");
      return;
    }
    if (doctorOcupado) {
      setToastType("error");
      setMessage("Ya tienes un paciente en proceso");
      return;
    }
    if (!userRole) {
      setToastType("error");
      setMessage("Debe iniciar sesión para reclamar");
      return;
    }
    const objetivo = ingresoCuil || "";
    setLoadingCuil(objetivo);
    setMessage(`Reclamando paciente ${objetivo || ""}...`);
    setToastType("success");

    const token = localStorage.getItem("token");
    try {
      const res = await fetch("/api/reclamo/reclamar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token || ""}`,
        },
        body: JSON.stringify({
          ...doctorData,
          ingresoCuil: ingresoCuil,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error);
      }

      setMessage(`Paciente ${objetivo || ""} reclamado exitosamente`);
      setToastType("success");
      await cargarIngresos();
      await cargarMisIngresos();
      if (onReclamoExitoso) {
        onReclamoExitoso();
      }
    } catch (err: any) {
      setToastType("error");
      setMessage("Error: " + err.message);
    }
    setLoadingCuil("");
  };

  return (
    <>
      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "1rem",
            gap: "1rem",
          }}
        >
          <h3 className="title" style={{ fontSize: "1.5rem", margin: 0 }}>
            Lista de Espera
          </h3>
          {userRole === "medico" && (
            <button
              onClick={() => handleReclamarPaciente()}
              className="btn btn-primary"
              style={{ padding: "0.5rem 1rem" }}
              disabled={!!loadingCuil || doctorOcupado}
            >
              {loadingCuil
                ? "Reclamando..."
                : doctorOcupado
                  ? "Ocupado"
                  : "Reclamar"}
            </button>
          )}
        </div>

        {message && (
          <div
            style={{
              padding: "0.75rem",
              borderRadius: "0.5rem",
              marginBottom: "1rem",
              background:
                toastType === "error"
                  ? "rgba(239, 68, 68, 0.1)"
                  : "rgba(34, 197, 94, 0.1)",
              color:
                toastType === "error" ? "var(--error)" : "var(--success)",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            {loadingCuil && toastType !== "error" && (
              <span
                className="spinner"
                style={{
                  width: "16px",
                  height: "16px",
                  border: "2px solid var(--primary)",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 0.8s linear infinite",
                }}
              />
            )}
            <span>{message}</span>
          </div>
        )}

        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              textAlign: "left",
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid var(--card-border)" }}>
                <th style={{ padding: "1rem" }}>Paciente</th>
                <th style={{ padding: "1rem" }}>CUIL</th>
                <th style={{ padding: "1rem" }}>Nivel</th>
                <th style={{ padding: "1rem" }}>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {ingresos.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    style={{
                      padding: "1rem",
                      textAlign: "center",
                      color: "var(--secondary)",
                    }}
                  >
                    No hay pacientes en espera
                  </td>
                </tr>
              ) : (
                ingresos.map((ingreso, i) => (
                  <tr
                    key={i}
                    style={{ borderBottom: "1px solid var(--card-border)" }}
                  >
                    <td style={{ padding: "1rem" }}>
                      {ingreso.paciente.nombre} {ingreso.paciente.apellido}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      {ingreso.paciente.cuil.valor}
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <span
                        style={{
                          padding: "0.25rem 0.75rem",
                          borderRadius: "999px",
                          fontSize: "0.875rem",
                          background: `${getNivelColor(
                            ingreso.nivelEmergencia.descripcion,
                          )}20`,
                          color: getNivelColor(
                            ingreso.nivelEmergencia.descripcion,
                          ),
                        }}
                      >
                        {ingreso.nivelEmergencia.descripcion}
                      </span>
                    </td>
                    <td style={{ padding: "1rem" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                        }}
                      >
                        <span>{new Date().toLocaleDateString()}</span>
                        {userRole === "medico" && (
                          <button
                            onClick={() =>
                              handleReclamarPaciente(
                                ingreso.paciente.cuil.valor,
                              )
                            }
                            className="btn"
                            style={{
                              padding: "0.35rem 0.5rem",
                              minWidth: "2.5rem",
                              background: "rgba(59,130,246,0.15)",
                              opacity:
                                loadingCuil === ingreso.paciente.cuil.valor ||
                                doctorOcupado
                                  ? 0.6
                                  : 1,
                              cursor:
                                loadingCuil === ingreso.paciente.cuil.valor ||
                                doctorOcupado
                                  ? "wait"
                                  : "pointer",
                            }}
                            aria-label="Reclamar paciente"
                            disabled={
                              loadingCuil === ingreso.paciente.cuil.valor ||
                              doctorOcupado
                            }
                          >
                            {loadingCuil === ingreso.paciente.cuil.valor
                              ? "..."
                              : "⚡"}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </>
  );
}
