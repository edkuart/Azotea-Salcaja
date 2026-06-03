import { Trash2 } from "lucide-react";
import type { EnrollmentStatus } from "@prisma/client";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminShell } from "@/components/admin/AdminShell";
import { db } from "@/lib/db";
import { updateEnrollmentStatus, deleteEnrollment } from "@/app/actions/enrollments";

export const dynamic = "force-dynamic";

const STATUS_CFG: Record<EnrollmentStatus, { label: string; bg: string; color: string }> = {
  pending:   { label: "Pendiente",   bg: "rgba(217,119,6,0.1)",   color: "var(--color-amber)"   },
  contacted: { label: "Contactado",  bg: "rgba(59,130,246,0.1)",  color: "#3b82f6"               },
  enrolled:  { label: "Inscrito",    bg: "rgba(21,128,61,0.1)",   color: "var(--color-emerald)" },
  cancelled: { label: "Cancelado",   bg: "rgba(204,45,48,0.1)",   color: "var(--color-stage)"   },
};

const EXPERIENCE_LABEL: Record<string, string> = {
  none:         "Ninguna",
  basic:        "Básica",
  intermediate: "Intermedia",
};

const STATUS_ORDER: EnrollmentStatus[] = ["pending", "contacted", "enrolled", "cancelled"];

export default async function InscripcionesPage() {
  const enrollments = await db().chessEnrollment.findMany({
    orderBy: { createdAt: "desc" },
  });

  const counts = {
    pending:   enrollments.filter((e) => e.status === "pending").length,
    contacted: enrollments.filter((e) => e.status === "contacted").length,
    enrolled:  enrollments.filter((e) => e.status === "enrolled").length,
    cancelled: enrollments.filter((e) => e.status === "cancelled").length,
  };

  return (
    <AdminShell>
      <AdminPageHeader
        eyebrow="Ajedrez"
        title="Inscripciones Chessitos"
        description="Solicitudes de inscripción al programa de clases. Gestiona el estado de cada solicitud."
      />

      {/* Stats strip */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "8px", marginTop: "24px" }}>
        {(["pending", "contacted", "enrolled", "cancelled"] as EnrollmentStatus[]).map((s) => {
          const cfg = STATUS_CFG[s];
          return (
            <div
              key={s}
              style={{
                background: "var(--color-grain)",
                border: "2px solid var(--color-ink)",
                boxShadow: "3px 3px 0 var(--color-ink)",
                padding: "12px 14px",
                textAlign: "center",
              }}
            >
              <p style={{ fontFamily: "var(--font-display)", fontSize: "2rem", lineHeight: 0.95, color: cfg.color }}>
                {counts[s]}
              </p>
              <p style={{ fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.14em", fontSize: "9px", opacity: 0.65, marginTop: "4px" }}>
                {cfg.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div style={{ marginTop: "28px" }}>
        {enrollments.length === 0 ? (
          <div
            style={{
              border: "2px dashed rgba(26,26,26,0.2)",
              padding: "48px 24px",
              textAlign: "center",
            }}
          >
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", color: "var(--color-ink)", marginBottom: "6px" }}>
              Sin inscripciones todavía
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: "13px", color: "#888" }}>
              Cuando un padre llene el formulario en{" "}
              <span style={{ fontFamily: "ui-monospace, monospace", fontSize: "12px" }}>/ajedrez/clases/inscribir</span>,
              aparecerá aquí.
            </p>
          </div>
        ) : (
          <div style={{ display: "grid", gap: "8px" }}>
            {enrollments.map((e) => {
              const cfg = STATUS_CFG[e.status];
              const dateStr = new Date(e.createdAt).toLocaleDateString("es", {
                day: "numeric", month: "short", year: "numeric",
              });

              return (
                <article
                  key={e.id}
                  style={{
                    background: "var(--color-grain)",
                    border: "2px solid var(--color-ink)",
                    borderLeft: `4px solid ${cfg.color}`,
                  }}
                >
                  {/* Top row */}
                  <div
                    style={{
                      padding: "12px 16px",
                      display: "grid",
                      gridTemplateColumns: "1fr auto",
                      gap: "12px",
                      alignItems: "start",
                      borderBottom: "1px dashed rgba(26,26,26,0.15)",
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                        <p style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", color: "var(--color-ink)" }}>
                          {e.childName}
                          <span style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#888", marginLeft: "8px" }}>
                            {e.childAge} años
                          </span>
                        </p>
                        <span
                          style={{
                            fontFamily: "var(--font-poster)",
                            textTransform: "uppercase",
                            letterSpacing: "0.12em",
                            fontSize: "9px",
                            background: cfg.bg,
                            color: cfg.color,
                            border: `1px solid ${cfg.color}`,
                            padding: "2px 8px",
                          }}
                        >
                          {cfg.label}
                        </span>
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "16px",
                          flexWrap: "wrap",
                          marginTop: "5px",
                          fontFamily: "var(--font-poster)",
                          textTransform: "uppercase",
                          letterSpacing: "0.13em",
                          fontSize: "9px",
                          color: "#666",
                        }}
                      >
                        <span>Tutor: {e.parentName}</span>
                        <span>·</span>
                        <span>{e.phone}</span>
                        {e.email && <><span>·</span><span>{e.email}</span></>}
                        <span>·</span>
                        <span>Exp: {EXPERIENCE_LABEL[e.experience] ?? e.experience}</span>
                        <span>·</span>
                        <span>{dateStr}</span>
                      </div>
                      {e.message && (
                        <p style={{ fontFamily: "var(--font-body)", fontSize: "12px", color: "#555", marginTop: "6px", fontStyle: "italic" }}>
                          "{e.message}"
                        </p>
                      )}
                    </div>

                    {/* Delete */}
                    <form action={deleteEnrollment.bind(null, e.id)}>
                      <button
                        type="submit"
                        title="Eliminar solicitud"
                        style={{
                          background: "none",
                          border: "1px solid rgba(204,45,48,0.3)",
                          color: "var(--color-stage)",
                          padding: "6px",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                        onClick={(ev) => {
                          if (!confirm(`¿Eliminar inscripción de ${e.childName}?`)) ev.preventDefault();
                        }}
                      >
                        <Trash2 style={{ width: "14px", height: "14px" }} aria-hidden />
                      </button>
                    </form>
                  </div>

                  {/* Status actions */}
                  <div
                    style={{
                      padding: "8px 16px",
                      display: "flex",
                      gap: "6px",
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <span style={{ fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.16em", fontSize: "9px", color: "#888", marginRight: "4px" }}>
                      Cambiar estado:
                    </span>
                    {STATUS_ORDER.filter((s) => s !== e.status).map((s) => {
                      const sCfg = STATUS_CFG[s];
                      return (
                        <form key={s} action={updateEnrollmentStatus.bind(null, e.id, s)}>
                          <button
                            type="submit"
                            style={{
                              fontFamily: "var(--font-poster)",
                              textTransform: "uppercase",
                              letterSpacing: "0.14em",
                              fontSize: "9px",
                              background: "none",
                              border: `1px solid ${sCfg.color}`,
                              color: sCfg.color,
                              padding: "4px 10px",
                              cursor: "pointer",
                            }}
                          >
                            {sCfg.label}
                          </button>
                        </form>
                      );
                    })}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </AdminShell>
  );
}
