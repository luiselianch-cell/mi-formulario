import { useState } from "react";

// eslint-disable-next-line no-unused-vars
const CONFIG = {
  supabase: {
    url: process.env.REACT_APP_SUPABASE_URL,
    anonKey: process.env.REACT_APP_SUPABASE_KEY,
  },
  callmebot: {
    phone: process.env.REACT_APP_WA_PHONE,
    apiKey: process.env.REACT_APP_WA_APIKEY,
  },
};

// ══ Opciones de selects ══════════════════════════════════
const MUNICIPIOS = [
  "APOPA", "SOYAPANGO", "SAN MARTIN", "SAN SALVADOR CENTRO",
  "SS", "SS", "SS", "SS",
  "Otro",
];

const RELACION_ENTREGA = [
  "Lugar de residencia del cliente",
  "Lugar de trabajo del cliente",
  "Lugar de estudio del cliente",
  "Cliente visitará el lugar durante unas horas",
  "Cliente llegará al lugar para recibir la orden",
];

const HORAS_LIMITE = [ "10:00 AM — lo más tarde",
  "11:00 AM — lo más tarde",
  "12:00 PM — lo más tarde",
  "1:00 PM — lo más tarde",
  "2:00 PM — lo más tarde",
  "3:00 PM — lo más tarde",
  "4:00 PM — lo más tarde",
  "5:00 PM — lo más tarde",
  "6:00 PM — lo más tarde",
];

const FORMAS_PAGO = ["Efectivo", "Transferencia", "Tarjeta", "PayPal", "Otro"];
const TIPOS_COMPROBANTE = ["Ticket", "Factura", "Sin comprobante"];
const COMENTARIOS_PREDET = ["Sin comentario", "Frágil", "Urgente", "Con cambio"];
const PERFILES = ["Instagram", "Facebook", "TikTok", "WhatsApp", "Referido", "Otro"];
const QUIEN_INGRESA = ["Administrador", "Vendedor 1", "Vendedor 2", "Vendedor 3"];

// ══ Helpers ══════════════════════════════════════════════
const today = () => new Date().toISOString().split("T")[0];

const initialForm = {
  fecha_orden: today(),
  articulos: "",
  nombre_cliente: "",
  numero_contacto: "",
  municipio: "",
  direccion_entrega: "",
  relacion_entrega: "",
  hora_limite: "",
  total_pagar: "",
  forma_pago: "",
  tipo_comprobante: "",
  comentario_predet: "",
  perfil_salio_1: "",
  perfil_salio_2: "",
  quien_ingresa: "",
  comentario_libre: "",
};

function Field({ label, required, hint, children }) {
  return (
    <div style={{ marginBottom: "1.2rem" }}>
      <label style={{
        display: "block",
        fontSize: "0.78rem",
        fontWeight: 700,
        color: "#94a3b8",
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        marginBottom: "0.35rem",
      }}>
        {label}
        {required && <span style={{ color: "#f43f5e", marginLeft: 3 }}>*</span>}
      </label>
      {hint && (
        <p style={{ fontSize: "0.75rem", color: "#475569", marginBottom: "0.4rem", marginTop: 0 }}>
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}

const inputStyle = (disabled) => ({
  width: "100%",
  background: disabled ? "#0a111e" : "#0f172a",
  border: "1px solid #1e3a5f",
  borderRadius: "0.45rem",
  padding: "0.65rem 0.85rem",
  color: disabled ? "#334155" : "#e2e8f0",
  fontSize: "0.93rem",
  outline: "none",
  boxSizing: "border-box",
  fontFamily: "inherit",
});

function Input({ name, value, onChange, disabled, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      style={inputStyle(disabled)}
    />
  );
}

function Select({ name, value, onChange, disabled, options, placeholder = "Selecciona…" }) {
  return (
    <select
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{ ...inputStyle(disabled), appearance: "none", cursor: "pointer" }}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function RadioGroup({ name, value, onChange, options, disabled }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
      {options.map((opt) => (
        <label key={opt} style={{
          display: "flex",
          alignItems: "center",
          gap: "0.6rem",
          color: "#cbd5e1",
          fontSize: "0.88rem",
          cursor: disabled ? "default" : "pointer",
          padding: "0.4rem 0.6rem",
          borderRadius: "0.35rem",
          background: value === opt ? "#0f2d4a" : "transparent",
          border: value === opt ? "1px solid #0ea5e9" : "1px solid transparent",
          transition: "background 0.15s",
        }}>
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={onChange}
            disabled={disabled}
            style={{ accentColor: "#0ea5e9", width: 16, height: 16 }}
          />
          {opt}
        </label>
      ))}
    </div>
  );
}

// ══ Sección visual ═══════════════════════════════════════
function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "0.5rem" }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "0.6rem",
        marginBottom: "1rem",
        paddingTop: "0.5rem",
      }}>
        <div style={{ flex: 1, height: 1, background: "#1e3a5f" }} />
        <span style={{
          fontSize: "0.68rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "#0ea5e9",
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}>{title}</span>
        <div style={{ flex: 1, height: 1, background: "#1e3a5f" }} />
      </div>
      {children}
    </div>
  );
}

// ══ Componente principal ══════════════════════════════════
export default function FormularioOrdenes() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const [historial, setHistorial] = useState([]);

  const isLoading = status === "loading";

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: false }));
  }

  function validate() {
    const required = [
      "fecha_orden", "articulos", "municipio", "direccion_entrega",
      "relacion_entrega", "total_pagar", "forma_pago",
      "tipo_comprobante", "perfil_salio_1", "perfil_salio_2", "quien_ingresa",
    ];
    const errs = {};
    required.forEach((k) => { if (!form[k]) errs[k] = true; });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function guardarEnSupabase(orden) {
  
    const res = await fetch(`${CONFIG.supabase.url}/rest/v1/ordenes_locales`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: CONFIG.supabase.anonKey,
        Authorization: `Bearer ${CONFIG.supabase.anonKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(orden),
    });
    if (!res.ok) throw new Error("Error al guardar en base de datos");
    return await res.json();
    
  }

  async function enviarWhatsApp(orden) {
      await fetch("https://dbpqfplomejtkoxjpvrn.supabase.co/functions/v1/super-service", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      phone: process.env.REACT_APP_WA_PHONE,
      apikey: process.env.REACT_APP_WA_APIKEY,
      message: "Nueva Orden - Locales Feb 2026 | Cliente: " + (orden.nombre_cliente || "No especificado") + " | Articulos: " + orden.articulos + " | Total: " + orden.total_pagar + " | Municipio: " + orden.municipio + " | Pago: " + orden.forma_pago,
    }),
  });
}

  async function handleSubmit() {
    if (!validate()) return;
    setStatus("loading");
    try {
      const orden = { ...form, creado_en: new Date().toISOString() };
      const [saved] = await guardarEnSupabase(orden);
      await enviarWhatsApp(orden);
      setHistorial((p) => [saved, ...p].slice(0, 6));
      setForm({ ...initialForm, fecha_orden: today() });
      setStatus("success");
      setTimeout(() => setStatus("idle"), 4000);
    } catch (err) {
      setStatus("error");
    }
  }

  const err = (k) => errors[k] ? { border: "1px solid #f43f5e" } : {};

  // ──────────────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh",
      background: "#060d18",
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      padding: "2rem 1rem 4rem",
    }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "1.75rem" }}>
          <div style={{
            fontSize: "0.68rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "#0ea5e9",
            fontWeight: 700,
            marginBottom: "0.4rem",
          }}>Locales · Febrero 2026</div>
          <h1 style={{
            fontSize: "1.8rem",
            fontWeight: 800,
            color: "#f8fafc",
            margin: 0,
            lineHeight: 1.15,
          }}>Registro de Orden</h1>
          <p style={{ color: "#475569", fontSize: "0.82rem", marginTop: "0.35rem", marginBottom: 0 }}>
            Los campos con <span style={{ color: "#f43f5e" }}>*</span> son obligatorios.
            Al guardar se enviará notificación por WhatsApp.
          </p>
        </div>

        {/* Feedback */}
        {status === "success" && (
          <div style={{
            background: "#052e16", border: "1px solid #16a34a",
            borderRadius: "0.5rem", padding: "0.8rem 1rem",
            color: "#4ade80", fontSize: "0.88rem", marginBottom: "1.25rem",
            display: "flex", alignItems: "center", gap: "0.5rem",
          }}>
            ✅ Orden guardada y notificación enviada por WhatsApp.
          </div>
        )}
        {status === "error" && (
          <div style={{
            background: "#450a0a", border: "1px solid #f87171",
            borderRadius: "0.5rem", padding: "0.8rem 1rem",
            color: "#fca5a5", fontSize: "0.88rem", marginBottom: "1.25rem",
          }}>
            ⚠️ Ocurrió un error. Revisa la consola o las credenciales en CONFIG.
          </div>
        )}
        {Object.keys(errors).length > 0 && (
          <div style={{
            background: "#2d1a00", border: "1px solid #f59e0b",
            borderRadius: "0.5rem", padding: "0.8rem 1rem",
            color: "#fcd34d", fontSize: "0.85rem", marginBottom: "1.25rem",
          }}>
            ⚠️ Completa los campos marcados en rojo antes de continuar.
          </div>
        )}

        {/* Card */}
        <div style={{
          background: "#0d1b2e",
          border: "1px solid #1e3a5f",
          borderRadius: "1rem",
          padding: "1.75rem",
          boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
        }}>

          {/* ── Bloque 1: Info básica */}
          <Section title="Información de la orden">
            <Field label="Fecha en que se ingresa la orden" required>
              <input
                type="date"
                name="fecha_orden"
                value={form.fecha_orden}
                onChange={handleChange}
                disabled={isLoading}
                style={{ ...inputStyle(isLoading), ...err("fecha_orden") }}
              />
            </Field>

            <Field
              label="Artículos a enviar"
              required
              hint="Si el producto tiene código o modelo, ingrésalo para facilitar la preparación del paquete."
            >
              <textarea
                name="articulos"
                value={form.articulos}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Ej: 2x Modelo-A001, 1x Modelo-B220…"
                style={{ ...inputStyle(isLoading), ...err("articulos"), resize: "vertical", minHeight: 72 }}
              />
            </Field>
          </Section>

          {/* ── Bloque 2: Cliente */}
          <Section title="Datos del cliente">
            <Field label="Nombre del cliente">
              <Input name="nombre_cliente" value={form.nombre_cliente} onChange={handleChange} disabled={isLoading} placeholder="Nombre completo" />
            </Field>

            <Field label="Número de contacto" hint="Ingresar todos los números juntos. Ejemplo: 71002233">
              <Input name="numero_contacto" value={form.numero_contacto} onChange={handleChange} disabled={isLoading} placeholder="71002233" type="tel" />
            </Field>
          </Section>

          {/* ── Bloque 3: Entrega */}
          <Section title="Entrega">
            <Field label="Municipio de entrega" required>
              <div style={{ position: "relative" }}>
                <Select
                  name="municipio"
                  value={form.municipio}
                  onChange={handleChange}
                  disabled={isLoading}
                  options={MUNICIPIOS}
                  style={err("municipio")}
                />
                {errors.municipio && <div style={{ height: 1, background: "#f43f5e", marginTop: 2, borderRadius: 1 }} />}
              </div>
            </Field>

            <Field label="Dirección de entrega" required>
              <textarea
                name="direccion_entrega"
                value={form.direccion_entrega}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Calle, número, colonia, referencias…"
                style={{ ...inputStyle(isLoading), ...err("direccion_entrega"), resize: "vertical", minHeight: 64 }}
              />
            </Field>

            <Field label="Relación del cliente con el lugar de entrega" required>
              {errors.relacion_entrega && (
                <div style={{ fontSize: "0.75rem", color: "#f43f5e", marginBottom: "0.4rem" }}>
                  Selecciona una opción
                </div>
              )}
              <RadioGroup
                name="relacion_entrega"
                value={form.relacion_entrega}
                onChange={handleChange}
                options={RELACION_ENTREGA}
                disabled={isLoading}
              />
            </Field>

            <Field
              label="Hora límite para completar entrega"
              hint="Es obligatorio preguntar al cliente a qué hora es lo más tarde que puede recibir."
            >
              <Select name="hora_limite" value={form.hora_limite} onChange={handleChange} disabled={isLoading} options={HORAS_LIMITE} placeholder="Selecciona hora…" />
            </Field>
          </Section>

          {/* ── Bloque 4: Pago */}
          <Section title="Pago y comprobante">
            <Field label="Total a pagar" required hint='Usar formato: $00.00 — ejemplo: $24.50 (incluir el envío en el total)'>
              <input
                name="total_pagar"
                value={form.total_pagar}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="$24.50"
                style={{ ...inputStyle(isLoading), ...err("total_pagar") }}
              />
            </Field>

            <Field label="Forma de pago" required>
              <Select name="forma_pago" value={form.forma_pago} onChange={handleChange} disabled={isLoading} options={FORMAS_PAGO} />
              {errors.forma_pago && <div style={{ height: 1, background: "#f43f5e", marginTop: 2 }} />}
            </Field>

            <Field label="Tipo de comprobante" required>
              <Select name="tipo_comprobante" value={form.tipo_comprobante} onChange={handleChange} disabled={isLoading} options={TIPOS_COMPROBANTE} />
              {errors.tipo_comprobante && <div style={{ height: 1, background: "#f43f5e", marginTop: 2 }} />}
            </Field>

            <Field label="Comentarios predeterminados (no obligatorio)">
              <Select name="comentario_predet" value={form.comentario_predet} onChange={handleChange} disabled={isLoading} options={COMENTARIOS_PREDET} placeholder="Sin comentario" />
            </Field>
          </Section>

          {/* ── Bloque 5: Perfil y cierre */}
          <Section title="Origen y operador">
            <Field label="Perfil donde salió la orden" required>
              <Select name="perfil_salio_1" value={form.perfil_salio_1} onChange={handleChange} disabled={isLoading} options={PERFILES} />
              {errors.perfil_salio_1 && <div style={{ height: 1, background: "#f43f5e", marginTop: 2 }} />}
            </Field>

            <Field label="Perfil donde salió la orden (secundario)" required>
              <Select name="perfil_salio_2" value={form.perfil_salio_2} onChange={handleChange} disabled={isLoading} options={PERFILES} />
              {errors.perfil_salio_2 && <div style={{ height: 1, background: "#f43f5e", marginTop: 2 }} />}
            </Field>

            <Field label="¿Quién ingresa la orden?" required>
              <Select name="quien_ingresa" value={form.quien_ingresa} onChange={handleChange} disabled={isLoading} options={QUIEN_INGRESA} />
              {errors.quien_ingresa && <div style={{ height: 1, background: "#f43f5e", marginTop: 2 }} />}
            </Field>

            <Field label="Comentario libre">
              <textarea
                name="comentario_libre"
                value={form.comentario_libre}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Cualquier detalle adicional sobre esta orden…"
                style={{ ...inputStyle(isLoading), resize: "vertical", minHeight: 72 }}
              />
            </Field>
          </Section>

          {/* Botones */}
          <div style={{ marginTop: "0.5rem", display: "flex", flexDirection: "column", gap: "0.55rem" }}>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              style={{
                width: "100%", padding: "0.85rem",
                background: isLoading ? "#0a3a5a" : "linear-gradient(90deg,#0284c7,#38bdf8)",
                color: isLoading ? "#94a3b8" : "#0f172a",
                border: "none", borderRadius: "0.55rem",
                fontWeight: 800, fontSize: "0.95rem",
                cursor: isLoading ? "default" : "pointer",
                letterSpacing: "0.02em", transition: "opacity 0.15s",
              }}
            >
              {isLoading ? "Guardando..." : "Enviar orden"}
            </button>
            <button
              onClick={() => { setForm({ ...initialForm, fecha_orden: today() }); setErrors({}); }}
              disabled={isLoading}
              style={{
                width: "100%", padding: "0.7rem",
                background: "transparent", color: "#475569",
                border: "1px solid #1e3a5f", borderRadius: "0.55rem",
                fontWeight: 600, fontSize: "0.88rem", cursor: "pointer",
              }}
            >
              Limpiar formulario
            </button>
          </div>
        </div>

        {/* Historial de sesión */}
        {historial.length > 0 && (
          <div style={{ marginTop: "1.75rem" }}>
            <div style={{
              fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em",
              textTransform: "uppercase", color: "#334155", marginBottom: "0.6rem",
            }}>Órdenes registradas esta sesión</div>
            {historial.map((o) => (
              <div key={o.id} style={{
                background: "#0d1b2e", border: "1px solid #1e3a5f",
                borderRadius: "0.5rem", padding: "0.65rem 0.9rem",
                display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: "0.4rem",
              }}>
                <div>
                  <div style={{ color: "#e2e8f0", fontSize: "0.85rem", fontWeight: 600 }}>
                    {o.nombre_cliente || "Sin nombre"} — {o.municipio}
                  </div>
                  <div style={{ color: "#475569", fontSize: "0.75rem", marginTop: 2 }}>
                    {o.articulos?.slice(0, 40)}{o.articulos?.length > 40 ? "…" : ""}
                  </div>
                </div>
                <div style={{ color: "#38bdf8", fontWeight: 700, fontSize: "0.9rem", marginLeft: "1rem", whiteSpace: "nowrap" }}>
                  {o.total_pagar}
                </div>
              </div>
            ))}
          </div>
        )}

        <p style={{ color: "#1e3a5f", fontSize: "0.72rem", textAlign: "center", marginTop: "1.5rem" }}>
          No Just a Brand x Tecno Gadget © 2026. Todos los derechos reservados.
        </p>
      </div>
    </div>
  );
}
