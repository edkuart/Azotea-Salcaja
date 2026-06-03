"use client";

import { useState } from "react";

/* ─── Grain texture (mismo del diseño original) ───────────────────────────── */
const GRAIN_BG = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='240' height='240'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.9 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

function Grain() {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 40,
        opacity: 0.05, mixBlendMode: "multiply", backgroundImage: GRAIN_BG,
      }}
    />
  );
}

/* ─── Lockup reutilizable ──────────────────────────────────────────────────── */
function Lockup({ size }: { size: number }) {
  return (
    <span style={{ lineHeight: 0.78, position: "relative", display: "block" }}>
      <span style={{ fontFamily: "var(--font-display)", fontSize: size, display: "inline-block", color: "var(--color-cream)" }}>
        Chess
      </span>
      <span style={{
        fontFamily: "var(--font-chess)", fontStyle: "italic", fontWeight: 900,
        fontSize: size * 0.82, display: "inline-block",
        color: "var(--color-stage)",
        marginLeft: size * 0.86 * 0.5,
        marginTop: size * -0.18,
      }}>
        itos
      </span>
    </span>
  );
}

/* ─── 1 · INSTAGRAM POST 1080×1080 ────────────────────────────────────────── */
function IgPost() {
  return (
    <div style={{
      width: 1080, height: 1080,
      background: "var(--color-ink)",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      padding: "84px 80px 0",
      position: "relative", overflow: "hidden",
    }}>
      {/* Knight watermark */}
      <div aria-hidden style={{
        position: "absolute", top: "48%", left: "50%",
        transform: "translate(-50%,-50%)",
        fontSize: 980, lineHeight: 1,
        color: "var(--color-cream)", opacity: 0.07, zIndex: 0, pointerEvents: "none",
        fontFamily: "var(--font-chess)",
      }}>♞</div>

      {/* Top bar */}
      <div style={{ position: "relative", zIndex: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{
          fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.2em",
          fontSize: 26, color: "var(--color-marquee)", display: "inline-flex", alignItems: "center", gap: "0.7em",
        }}>
          Ajedrez para niños
          <span style={{ display: "inline-block", width: 54, height: 3, background: "var(--color-stage)" }} />
        </span>
        <span style={{ fontSize: 40, color: "var(--color-cream)", opacity: 0.55, fontFamily: "var(--font-chess)" }}>
          ♜ ♞ ♝
        </span>
      </div>

      {/* Center lockup */}
      <div style={{ position: "relative", zIndex: 10, flex: 1, display: "flex", alignItems: "center" }}>
        <div style={{ lineHeight: 0.78 }}>
          <span style={{
            fontFamily: "var(--font-display)", fontSize: 340, display: "inline-block",
            color: "var(--color-cream)", textShadow: "10px 10px 0 var(--color-stage)",
          }}>Chess</span>
          <span style={{
            fontFamily: "var(--font-chess)", fontStyle: "italic", fontWeight: 900,
            fontSize: 340 * 0.82, display: "inline-block",
            color: "var(--color-stage)",
            marginLeft: "0.86em", marginTop: "-0.18em",
          }}>itos</span>
        </div>
      </div>

      {/* Bottom strip */}
      <div style={{
        position: "relative", zIndex: 10,
        margin: "0 -80px",
        background: "var(--color-marquee)",
        color: "var(--color-ink)",
        display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5em",
        height: 128,
        fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.12em",
        fontSize: 36, whiteSpace: "nowrap",
        borderTop: "4px solid var(--color-ink)",
      }}>
        Lunes <span style={{ color: "var(--color-stage)" }}>·</span> 5:30 PM <span style={{ color: "var(--color-stage)" }}>·</span> Azotea Salcajá
      </div>

      <Grain />
    </div>
  );
}

/* ─── 2 · INSTAGRAM STORY 1080×1920 ───────────────────────────────────────── */
const BENEFITS = [
  { ico: "♛", b: "Pensamiento",   s: "estratégico"     },
  { ico: "♞", b: "Concentración", s: "y enfoque"        },
  { ico: "♜", b: "Resolución",    s: "de problemas"     },
  { ico: "♟", b: "Disciplina",    s: "y paciencia"      },
];

function IgStory() {
  return (
    <div style={{
      width: 1080, height: 1920,
      background: "var(--color-grain)",
      display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden",
    }}>
      {/* Top dark section */}
      <div style={{
        background: "var(--color-ink)", color: "var(--color-cream)",
        padding: "120px 90px 96px",
        position: "relative", overflow: "hidden",
        borderBottom: "6px solid var(--color-stage)",
      }}>
        {/* Disc decoration */}
        <div aria-hidden style={{
          position: "absolute", right: -150, top: -150,
          width: 520, height: 520, borderRadius: "50%",
          border: "3px solid #C9A84C", opacity: 0.4,
        }} />
        <span style={{
          fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.2em",
          fontSize: 30, color: "var(--color-marquee)",
          display: "inline-flex", alignItems: "center", gap: "0.7em",
        }}>
          Clases para niños
          <span style={{ display: "inline-block", width: 60, height: 3, background: "var(--color-stage)" }} />
        </span>
        <div style={{ marginTop: 34, lineHeight: 0.78 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 212, display: "inline-block", color: "var(--color-cream)" }}>Chess</span>
          <span style={{ fontFamily: "var(--font-chess)", fontStyle: "italic", fontWeight: 900, fontSize: 212 * 0.84, display: "inline-block", color: "var(--color-stage)", marginLeft: "0.04em" }}>itos</span>
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 38, color: "var(--color-cream)", opacity: 0.85, marginTop: 18 }}>
          Ajedrez infantil en <b style={{ color: "var(--color-marquee)" }}>Azotea Salcajá</b> · todos los lunes
        </p>
      </div>

      {/* Benefits */}
      <div style={{ flex: 1, padding: "74px 90px", display: "flex", flexDirection: "column", gap: 34, justifyContent: "center" }}>
        <div style={{ fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.22em", fontSize: 28, color: "var(--color-stage)", marginBottom: 6 }}>
          ¿Por qué ajedrez?
        </div>
        {BENEFITS.map((p) => (
          <div key={p.b} style={{
            background: "var(--color-grain)", border: "3px solid var(--color-ink)",
            boxShadow: "8px 8px 0 var(--color-ink)",
            display: "flex", alignItems: "center", gap: 34, padding: "34px 40px",
          }}>
            <span style={{ fontSize: 78, lineHeight: 1, color: "var(--color-ink)", width: 84, textAlign: "center", flexShrink: 0, fontFamily: "var(--font-chess)" }}>{p.ico}</span>
            <span>
              <b style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 48, lineHeight: 1, color: "var(--color-ink)" }}>{p.b}</b>
              <span style={{ display: "block", fontFamily: "var(--font-body)", fontSize: 28, color: "#444", marginTop: 8 }}>{p.s}</span>
            </span>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div style={{
        background: "var(--color-stage)", color: "var(--color-cream)",
        padding: "72px 90px 84px", textAlign: "center",
        borderTop: "6px solid var(--color-ink)",
      }}>
        <span style={{
          fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.2em",
          fontSize: 28, color: "var(--color-marquee)",
          display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.7em",
        }}>
          Cupos limitados
          <span style={{ display: "inline-block", width: 60, height: 3, background: "var(--color-marquee)" }} />
        </span>
        <h2 style={{
          fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.04em",
          fontSize: 120, lineHeight: 0.92, margin: "20px 0 26px",
        }}>
          Inscripciones<br />abiertas
        </h2>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: 20,
          background: "var(--color-ink)", border: "3px solid var(--color-cream)",
          padding: "24px 40px",
          fontFamily: "ui-monospace, monospace", fontWeight: 600,
          fontSize: 50, color: "var(--color-cream)", letterSpacing: "0.02em",
        }}>
          <span style={{ color: "var(--color-marquee)", fontFamily: "var(--font-poster)" }}>WA</span>
          +502 3526 2791
        </span>
      </div>

      <Grain />
    </div>
  );
}

/* ─── 3 · BANNER 1200×628 ─────────────────────────────────────────────────── */
const CURRIC = [
  { mes: "Mes 1", nm: "Fundamentos", ds: "Piezas, movimientos y reglas del juego" },
  { mes: "Mes 2", nm: "Táctica",     ds: "Clavadas, horquillas y combinaciones"   },
  { mes: "Mes 3", nm: "Estrategia",  ds: "Aperturas, planes y finales básicos"    },
];

function Banner() {
  return (
    <div style={{
      width: 1200, height: 628,
      display: "grid", gridTemplateColumns: "1fr 1fr",
      background: "var(--color-grain)",
      position: "relative", overflow: "hidden",
    }}>
      {/* Left — ink */}
      <div style={{
        background: "var(--color-ink)", color: "var(--color-cream)",
        padding: "64px 60px",
        position: "relative", overflow: "hidden",
        display: "flex", flexDirection: "column", justifyContent: "space-between",
      }}>
        <div aria-hidden style={{
          position: "absolute", right: -70, bottom: -120,
          fontSize: 520, lineHeight: 1,
          color: "var(--color-cream)", opacity: 0.06,
          fontFamily: "var(--font-chess)",
        }}>♞</div>

        <span style={{
          fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.2em",
          fontSize: 22, color: "var(--color-marquee)", zIndex: 2, position: "relative",
          display: "inline-flex", alignItems: "center", gap: "0.7em",
        }}>
          Ajedrez para niños
          <span style={{ display: "inline-block", width: 44, height: 3, background: "var(--color-stage)" }} />
        </span>

        <div style={{ zIndex: 2, position: "relative", lineHeight: 0.78, marginTop: 6 }}>
          <span style={{ fontFamily: "var(--font-display)", fontSize: 150, display: "inline-block", color: "var(--color-cream)", textShadow: "6px 6px 0 var(--color-stage)" }}>Chess</span>
          <span style={{ fontFamily: "var(--font-chess)", fontStyle: "italic", fontWeight: 900, fontSize: 150 * 0.82, display: "inline-block", color: "var(--color-stage)", marginLeft: "0.5em", marginTop: "-0.12em" }}>itos</span>
        </div>

        <div style={{
          zIndex: 2, position: "relative",
          display: "flex", gap: 0,
          borderTop: "2px solid rgba(255,253,208,0.25)", paddingTop: 24,
        }}>
          {[
            { b: "3",   s: "Meses"    },
            { b: "12",  s: "Semanas"  },
            { b: "Lun", s: "5:30 PM"  },
          ].map(({ b, s }, i) => (
            <div key={s} style={{
              flex: 1,
              borderLeft: i > 0 ? "2px solid rgba(255,253,208,0.25)" : "none",
              paddingLeft: i > 0 ? 22 : 0,
            }}>
              <b style={{ display: "block", fontFamily: "var(--font-display)", fontSize: 46, lineHeight: 0.9, color: "var(--color-marquee)" }}>{b}</b>
              <span style={{ display: "block", fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.18em", fontSize: 17, marginTop: 8, color: "var(--color-cream)", opacity: 0.8 }}>{s}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right — grain */}
      <div style={{ padding: "54px 56px", display: "flex", flexDirection: "column" }}>
        <span style={{
          fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.22em",
          fontSize: 20, color: "var(--color-stage)",
          display: "inline-flex", alignItems: "center", gap: "0.6em",
        }}>
          <span style={{ display: "inline-block", width: 40, height: 3, background: "var(--color-stage)" }} />
          El programa
        </span>

        <h3 style={{
          fontFamily: "var(--font-chess)", fontStyle: "italic", fontWeight: 700,
          fontSize: 40, color: "var(--color-ink)", margin: "10px 0 22px", lineHeight: 1,
        }}>
          Tres meses, tres niveles.
        </h3>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
          {CURRIC.map((c) => (
            <div key={c.mes} style={{
              background: "var(--color-grain)", border: "2px solid var(--color-ink)",
              boxShadow: "5px 5px 0 var(--color-ink)",
              borderLeft: "8px solid var(--color-stage)",
              padding: "18px 24px",
              display: "flex", alignItems: "baseline", gap: 20,
            }}>
              <span style={{ fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.16em", fontSize: 18, color: "var(--color-stage)", width: 118, flexShrink: 0 }}>{c.mes}</span>
              <span style={{ fontFamily: "var(--font-display)", fontSize: 38, color: "var(--color-ink)", lineHeight: 1 }}>{c.nm}</span>
              <span style={{ fontFamily: "var(--font-body)", fontSize: 21, color: "#555", marginLeft: "auto", textAlign: "right", maxWidth: "42%", lineHeight: 1.2 }}>{c.ds}</span>
            </div>
          ))}
        </div>
      </div>

      <Grain />
    </div>
  );
}

/* ─── 4 · WHATSAPP STATUS 1080×1920 ───────────────────────────────────────── */
function Status() {
  return (
    <div style={{
      width: 1080, height: 1920,
      background: "var(--color-ink)", color: "var(--color-cream)",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      textAlign: "center", padding: "120px 80px",
      position: "relative", overflow: "hidden",
    }}>
      {/* Giant pawn */}
      <div aria-hidden style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-54%)",
        fontSize: 1380, lineHeight: 1,
        color: "var(--color-stage)", opacity: 0.92, zIndex: 0,
        fontFamily: "var(--font-chess)", pointerEvents: "none",
      }}>♟</div>

      <div style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{
          fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.4em",
          fontSize: 30, color: "var(--color-marquee)", marginBottom: 30,
        }}>
          Lunes · 5:30 PM
        </div>
        <h1 style={{
          fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.26em",
          fontSize: 158, lineHeight: 1, margin: 0, color: "var(--color-cream)",
          textShadow: "8px 8px 0 var(--color-ink)",
        }}>
          Chessitos
        </h1>
        <div style={{ width: 120, height: 4, background: "var(--color-marquee)", margin: "46px 0" }} />
        <div style={{ fontFamily: "var(--font-body)", fontSize: 46, color: "var(--color-cream)" }}>
          Inscríbete:{" "}
          <b style={{ fontFamily: "ui-monospace, monospace", fontWeight: 600, color: "var(--color-marquee)", letterSpacing: "0.02em" }}>
            +502 3526 2791
          </b>
        </div>
      </div>

      <div style={{
        position: "absolute", left: 0, right: 0, bottom: 96, zIndex: 10,
        fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.3em",
        fontSize: 30, color: "#C9A84C",
        textAlign: "center",
      }}>
        Azotea Salcajá · Salcajá, Guatemala
      </div>

      <Grain />
    </div>
  );
}

/* ─── Artboards config ─────────────────────────────────────────────────────── */
const ARTBOARDS = [
  { id: "ig-post",  label: "Instagram Post",          w: 1080, h: 1080, Component: IgPost   },
  { id: "ig-story", label: "Instagram Story",         w: 1080, h: 1920, Component: IgStory  },
  { id: "banner",   label: "Facebook / WA Banner",    w: 1200, h: 628,  Component: Banner   },
  { id: "status",   label: "WhatsApp Status",         w: 1080, h: 1920, Component: Status   },
];

/* ─── Main page ────────────────────────────────────────────────────────────── */
export default function KitPage() {
  const [active, setActive] = useState<string | null>(null);

  const focused = active ? ARTBOARDS.find((a) => a.id === active) : null;

  return (
    <div style={{ minHeight: "100vh", background: "#1a1a1a", fontFamily: "var(--font-poster)" }}>

      {/* Top bar */}
      <div style={{
        background: "#111", borderBottom: "2px solid #333",
        padding: "16px 24px",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16,
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div>
          <p style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--color-cream)", lineHeight: 1 }}>
            Chess<em style={{ fontFamily: "var(--font-chess)", fontStyle: "italic", color: "var(--color-stage)" }}>itos</em>
            {" "}
            <span style={{ fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.2em", fontSize: 10, color: "rgba(255,253,208,0.4)", verticalAlign: "middle" }}>
              Kit de redes sociales
            </span>
          </p>
        </div>
        <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(255,253,208,0.4)", textAlign: "right" }}>
          Haz clic en un artboard para ver a tamaño completo · luego captura pantalla
        </p>
      </div>

      {/* Gallery grid */}
      {!focused && (
        <div style={{ padding: "40px 32px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 40 }}>
          {ARTBOARDS.map(({ id, label, w, h, Component }) => {
            const scale = 320 / w;
            return (
              <div key={id}>
                <p style={{ fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.2em", fontSize: 10, color: "rgba(255,253,208,0.5)", marginBottom: 10 }}>
                  {label} · {w}×{h}
                </p>
                <div
                  style={{
                    width: 320, height: Math.round(h * scale),
                    position: "relative", overflow: "hidden",
                    cursor: "pointer",
                    outline: "2px solid #333",
                    transition: "outline-color 0.15s",
                  }}
                  onClick={() => setActive(id)}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.outlineColor = "var(--color-stage)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.outlineColor = "#333"; }}
                  title="Clic para ver a tamaño completo"
                >
                  <div style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "top left",
                    width: w, height: h,
                    pointerEvents: "none",
                  }}>
                    <Component />
                  </div>
                </div>
                <button
                  onClick={() => setActive(id)}
                  style={{
                    marginTop: 8, width: "100%",
                    background: "none", border: "1px solid #333",
                    color: "rgba(255,253,208,0.6)",
                    fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.16em", fontSize: 9,
                    padding: "6px 0", cursor: "pointer",
                  }}
                >
                  Ver completo →
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Full-size view */}
      {focused && (
        <div>
          {/* Back bar */}
          <div style={{
            background: "#111", padding: "12px 24px",
            display: "flex", alignItems: "center", gap: 16,
            borderBottom: "1px solid #333",
          }}>
            <button
              onClick={() => setActive(null)}
              style={{
                background: "none", border: "1px solid #444",
                color: "var(--color-marquee)",
                fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.16em", fontSize: 10,
                padding: "8px 14px", cursor: "pointer",
              }}
            >
              ← Galería
            </button>
            <p style={{ fontFamily: "var(--font-poster)", textTransform: "uppercase", letterSpacing: "0.2em", fontSize: 10, color: "rgba(255,253,208,0.5)" }}>
              {focused.label} · {focused.w}×{focused.h}px
            </p>
            <p style={{ fontFamily: "var(--font-body)", fontSize: 12, color: "rgba(255,253,208,0.35)", marginLeft: "auto" }}>
              Haz zoom al 100% y captura pantalla · o usa la extensión de tu navegador
            </p>
          </div>

          {/* Artboard centered, scrollable */}
          <div style={{ padding: 40, display: "flex", justifyContent: "center", overflowX: "auto" }}>
            <div style={{ flexShrink: 0 }}>
              <focused.Component />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
