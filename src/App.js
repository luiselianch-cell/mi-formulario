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
  "SAN SALVADOR", "ANTIGUO CUSCATLÁN", "MEJICANOS", "SANTA TECLA",
  "SOYAPANGO", "APOPA", "AYUTUXTEPEQUE", "CIUDAD DELGADO", "CUSCATANCINGO", "ILOPANGO", "NUEVO CUSCATLAN", "SAN MARCOS", "SAN MARTIN",
  "Otro",
];

const RELACION_ENTREGA = [
  "Lugar de residencia del cliente",
  "Lugar de trabajo del cliente",
  "Lugar de estudio del cliente",
  "Cliente visitará el lugar durante unas horas",
  "Cliente llegará al lugar para recibir la orden",
];

const HORAS_LIMITE = [
  "10:00 AM — lo más tarde",
  "11:00 AM — lo más tarde",
  "12:00 PM — lo más tarde",
  "1:00 PM — lo más tarde",
  "2:00 PM — lo más tarde",
  "3:00 PM — lo más tarde",
  "4:00 PM — lo más tarde",
  "5:00 PM — lo más tarde",
  "6:00 PM — lo más tarde",
];

const FORMAS_PAGO = ["Efectivo (Contraentrega)", "Transferencia Bancaria (Ya completo el pago)", "Transferencia Bancaria (Pagará cuando reciba)", "Link de Pago con Tarjeta (Ya completo el pago)", "Link de Pago con Tarjeta (Pagará cuando reciba)", "Otra forma de pago"];
const TIPOS_COMPROBANTE = ["Ticket Normal", "FACTURA CONSUMIDOR FINAL", "FACTURA CREDITO FISCAL", "Asignar comprobante"];
const COMENTARIOS_PREDET = ["Contactar al cliente con anticipación para coordinar entrega", "Cliente enviará la ubicación de entrega", "Cliente ya completó el pago, solo entregar", "Cliente pide que le contacten por Whatsapp", "Cliente pide que le contacten por llamada directa", "Favor entregar en vigilancia del lugar", "Favor entregar en recepción del lugar", "Cliente indica que puede recibir desde ya", "Descuento previamente autorizado por Caleb"];
const PERFILES = ["WhatsApp Principal", "Inbox Pagina FB", "WhatsApp Negro", "P. Personal Yanci", "P. Personal Sarai Eunice", "P. Personal Caleb", "P. Personal Kevin", "P. Personal Maressa", "P. Personal Marisol", "Perfil Andrea Marketplace", "Perfil Jessica Marketplace", "WhatsApp Del Jefazo Calen", "Instagram", "Cliente ordeno por llamada", "Pedido Pagina web Tecno Gadger", "Otro WhatsApp"];
const QUIEN_INGRESA = ["Tecno Gadget - Fer", "Tecno Gadget - Jefferson", "Tecno Gadget - Wendy", "Tecno Gadget - Liss", "Tecno Gadget - Isa", "Tecno Gadget - Josue", "Yanci (Vend)", "Sara Eunice (Vend)", "Kevin (Vend)", "Maressa (Vend)", "Marisol (Vend)", "Herbert (Vend)", "Caleb (Venta Propia)", "Pedido de Pagina Web"];

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

// ══ Paleta Tecno Gadget ══════════════════════════════════
const C = {
  bg: "#f4f6f9",
  card: "#ffffff",
  primary: "#003366",
  accent: "#0066CC",
  accentLight: "#e8f0fb",
  border: "#d0dce8",
  borderFocus: "#0066CC",
  text: "#1a1a2e",
  textSub: "#4a5568",
  textMuted: "#8898aa",
  inputBg: "#f8fafd",
  inputDisabled: "#eef2f7",
  error: "#e53e3e",
  success: "#276749",
  successBg: "#f0fff4",
  successBorder: "#9ae6b4",
  errorBg: "#fff5f5",
  errorBorder: "#feb2b2",
  warningBg: "#fffbeb",
  warningBorder: "#f6e05e",
  warningText: "#744210",
  histBg: "#f0f5ff",
  histBorder: "#c3d4f0",
};

function Field({ label, required, hint, children }) {
  return (
    <div style={{ marginBottom: "1.2rem" }}>
      <label style={{
        display: "block",
        fontSize: "0.75rem",
        fontWeight: 700,
        color: C.primary,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
        marginBottom: "0.35rem",
      }}>
        {label}
        {required && <span style={{ color: C.error, marginLeft: 3 }}>*</span>}
      </label>
      {hint && (
        <p style={{ fontSize: "0.75rem", color: C.textMuted, marginBottom: "0.4rem", marginTop: 0 }}>
          {hint}
        </p>
      )}
      {children}
    </div>
  );
}

const inputStyle = (disabled) => ({
  width: "100%",
  background: disabled ? C.inputDisabled : C.inputBg,
  border: "1px solid " + C.border,
  borderRadius: "0.45rem",
  padding: "0.65rem 0.85rem",
  color: disabled ? C.textMuted : C.text,
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
      autoComplete="off"
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
          color: value === opt ? C.primary : C.textSub,
          fontSize: "0.88rem",
          cursor: disabled ? "default" : "pointer",
          padding: "0.4rem 0.6rem",
          borderRadius: "0.35rem",
          background: value === opt ? C.accentLight : "transparent",
          border: value === opt ? "1px solid " + C.accent : "1px solid transparent",
          transition: "background 0.15s",
          fontWeight: value === opt ? 600 : 400,
        }}>
          <input
            type="radio"
            name={name}
            value={opt}
            checked={value === opt}
            onChange={onChange}
            disabled={disabled}
            style={{ accentColor: C.accent, width: 16, height: 16 }}
          />
          {opt}
        </label>
      ))}
    </div>
  );
}

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
        <div style={{ flex: 1, height: 1, background: C.border }} />
        <span style={{
          fontSize: "0.68rem",
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: C.accent,
          fontWeight: 700,
          whiteSpace: "nowrap",
        }}>{title}</span>
        <div style={{ flex: 1, height: 1, background: C.border }} />
      </div>
      {children}
    </div>
  );
}

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
      "tipo_comprobante", "perfil_salio_1", "quien_ingresa",
    ];
    const errs = {};
    required.forEach((k) => { if (!form[k]) errs[k] = true; });
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function guardarEnSupabase(orden) {
    const res = await fetch(process.env.REACT_APP_SUPABASE_URL + "/rest/v1/ordenes_locales", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.REACT_APP_SUPABASE_KEY,
        Authorization: "Bearer " + process.env.REACT_APP_SUPABASE_KEY,
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
        message: "Nueva Orden - Locales Feb 2026" +
          "\nCliente: " + (orden.nombre_cliente || "No especificado") +
          "\nContacto: " + (orden.numero_contacto || "-") +
          "\nArticulos: " + orden.articulos +
          "\nMunicipio: " + orden.municipio +
          "\nDireccion: " + orden.direccion_entrega +
          "\nHora limite: " + (orden.hora_limite || "No especificada") +
          "\nTotal: " + orden.total_pagar +
          "\nPago: " + orden.forma_pago +
          "\nComprobante: " + orden.tipo_comprobante +
          "\nPerfil: " + orden.perfil_salio_1 +
          "\nIngreso: " + orden.quien_ingresa +
          "\nNotas: " + (orden.comentario_libre || "Sin notas"),
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

  const err = (k) => errors[k] ? { border: "1px solid " + C.error } : {};

  return (
    <div style={{
      minHeight: "100vh",
      background: C.bg,
      fontFamily: "'Segoe UI', system-ui, -apple-system, sans-serif",
      padding: "2rem 1rem 4rem",
    }}>
      <div style={{ maxWidth: 560, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "1.75rem", textAlign: "center" }}>
          <div style={{
            display: "inline-block",
            background: C.primary,
            color: "#fff",
            fontSize: "0.65rem",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            fontWeight: 700,
            padding: "0.3rem 0.9rem",
            borderRadius: "2rem",
            marginBottom: "0.75rem",
          }}>Tecno Gadget · Locales 2026</div>
          <h1 style={{
            fontSize: "1.8rem",
            fontWeight: 800,
            color: C.primary,
            margin: 0,
            lineHeight: 1.15,
          }}>Registro de Orden</h1>
          <p style={{ color: C.textMuted, fontSize: "0.82rem", marginTop: "0.35rem", marginBottom: 0 }}>
            Los campos con <span style={{ color: C.error }}>*</span> son obligatorios.
            Al guardar se enviará notificación por WhatsApp.
          </p>
        </div>

        {/* Feedback */}
        {status === "success" && (
          <div style={{
            background: C.successBg, border: "1px solid " + C.successBorder,
            borderRadius: "0.5rem", padding: "0.8rem 1rem",
            color: C.success, fontSize: "0.88rem", marginBottom: "1.25rem",
            display: "flex", alignItems: "center", gap: "0.5rem",
          }}>
            ✅ Orden guardada y notificación enviada por WhatsApp.
          </div>
        )}
        {status === "error" && (
          <div style={{
            background: C.errorBg, border: "1px solid " + C.errorBorder,
            borderRadius: "0.5rem", padding: "0.8rem 1rem",
            color: C.error, fontSize: "0.88rem", marginBottom: "1.25rem",
          }}>
            ⚠️ Ocurrió un error. Revisa la consola o las credenciales.
          </div>
        )}
        {Object.keys(errors).length > 0 && (
          <div style={{
            background: C.warningBg, border: "1px solid " + C.warningBorder,
            borderRadius: "0.5rem", padding: "0.8rem 1rem",
            color: C.warningText, fontSize: "0.85rem", marginBottom: "1.25rem",
          }}>
            ⚠️ Completa los campos marcados en rojo antes de continuar.
          </div>
        )}

        {/* Card */}
        <div style={{
          background: C.card,
          border: "1px solid " + C.border,
          borderRadius: "1rem",
          padding: "1.75rem",
          boxShadow: "0 4px 24px rgba(0,51,102,0.08)",
        }}>

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

            <Field label="Artículos a enviar" required hint="Si el producto tiene código o modelo, ingrésalo para facilitar la preparación del paquete.">
              <textarea
                name="articulos"
                value={form.articulos}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Ej: 2x Modelo-A001, 1x Modelo-B220…"
                style={{ ...inputStyle(isLoading), ...err("articulos"), resize: "vertical", minHeight: 72 }}
                autoComplete="off"
              />
            </Field>
          </Section>

          <Section title="Datos del cliente">
            <Field label="Nombre del cliente">
              <Input name="nombre_cliente" value={form.nombre_cliente} onChange={handleChange} disabled={isLoading} placeholder="Nombre completo" />
            </Field>
            <Field label="Número de contacto" hint="Ingresar todos los números juntos. Ejemplo: 71002233">
              <Input name="numero_contacto" value={form.numero_contacto} onChange={handleChange} disabled={isLoading} placeholder="71002233" type="tel" />
            </Field>
          </Section>

          <Section title="Entrega">
            <Field label="Municipio de entrega" required>
              <Select name="municipio" value={form.municipio} onChange={handleChange} disabled={isLoading} options={MUNICIPIOS} />
              {errors.municipio && <div style={{ height: 1, background: C.error, marginTop: 2, borderRadius: 1 }} />}
            </Field>

            <Field label="Dirección de entrega" required>
              <textarea
                name="direccion_entrega"
                value={form.direccion_entrega}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Calle, número, colonia, referencias…"
                style={{ ...inputStyle(isLoading), ...err("direccion_entrega"), resize: "vertical", minHeight: 64 }}
                autoComplete="off"
              />
            </Field>

            <Field label="Relación del cliente con el lugar de entrega" required>
              {errors.relacion_entrega && (
                <div style={{ fontSize: "0.75rem", color: C.error, marginBottom: "0.4rem" }}>Selecciona una opción</div>
              )}
              <RadioGroup name="relacion_entrega" value={form.relacion_entrega} onChange={handleChange} options={RELACION_ENTREGA} disabled={isLoading} />
            </Field>

            <Field label="Hora límite para completar entrega" hint="Es obligatorio preguntar al cliente a qué hora es lo más tarde que puede recibir.">
              <Select name="hora_limite" value={form.hora_limite} onChange={handleChange} disabled={isLoading} options={HORAS_LIMITE} placeholder="Selecciona hora…" />
            </Field>
          </Section>

          <Section title="Pago y comprobante">
            <Field label="Total a pagar" required hint="Usar formato: $00.00 — ejemplo: $24.50 (incluir el envío en el total)">
              <input name="total_pagar" value={form.total_pagar} onChange={handleChange} disabled={isLoading} placeholder="$24.50" style={{ ...inputStyle(isLoading), ...err("total_pagar") }} />
            </Field>
            <Field label="Forma de pago" required>
              <Select name="forma_pago" value={form.forma_pago} onChange={handleChange} disabled={isLoading} options={FORMAS_PAGO} />
              {errors.forma_pago && <div style={{ height: 1, background: C.error, marginTop: 2 }} />}
            </Field>
            <Field label="Tipo de comprobante" required>
              <Select name="tipo_comprobante" value={form.tipo_comprobante} onChange={handleChange} disabled={isLoading} options={TIPOS_COMPROBANTE} />
              {errors.tipo_comprobante && <div style={{ height: 1, background: C.error, marginTop: 2 }} />}
            </Field>
            <Field label="Comentarios predeterminados (no obligatorio)">
              <Select name="comentario_predet" value={form.comentario_predet} onChange={handleChange} disabled={isLoading} options={COMENTARIOS_PREDET} placeholder="Sin comentario" />
            </Field>
          </Section>

          <Section title="Origen de la orden">
            <Field label="Perfil donde salió la orden" required>
              <Select name="perfil_salio_1" value={form.perfil_salio_1} onChange={handleChange} disabled={isLoading} options={PERFILES} />
              {errors.perfil_salio_1 && <div style={{ height: 1, background: C.error, marginTop: 2 }} />}
            </Field>
            <Field label="¿Quién ingresa la orden?" required>
              <Select name="quien_ingresa" value={form.quien_ingresa} onChange={handleChange} disabled={isLoading} options={QUIEN_INGRESA} />
              {errors.quien_ingresa && <div style={{ height: 1, background: C.error, marginTop: 2 }} />}
            </Field>
            <Field label="Comentario libre">
              <textarea
                name="comentario_libre"
                value={form.comentario_libre}
                onChange={handleChange}
                disabled={isLoading}
                placeholder="Cualquier detalle adicional sobre esta orden…"
                style={{ ...inputStyle(isLoading), resize: "vertical", minHeight: 72 }}
                autoComplete="off"
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
                background: isLoading ? C.border : "linear-gradient(90deg," + C.primary + "," + C.accent + ")",
                color: isLoading ? C.textMuted : "#ffffff",
                border: "none", borderRadius: "0.55rem",
                fontWeight: 800, fontSize: "0.95rem",
                cursor: isLoading ? "default" : "pointer",
                letterSpacing: "0.02em", transition: "opacity 0.15s",
                boxShadow: isLoading ? "none" : "0 4px 14px rgba(0,51,102,0.3)",
              }}
            >
              {isLoading ? "Enviando..." : "Enviar orden"}
            </button>
            <button
              onClick={() => { setForm({ ...initialForm, fecha_orden: today() }); setErrors({}); }}
              disabled={isLoading}
              style={{
                width: "100%", padding: "0.7rem",
                background: "transparent", color: C.textMuted,
                border: "1px solid " + C.border, borderRadius: "0.55rem",
                fontWeight: 600, fontSize: "0.88rem", cursor: "pointer",
              }}
            >
              Limpiar formulario
            </button>
          </div>
        </div>

        {/* Historial */}
        {historial.length > 0 && (
          <div style={{ marginTop: "1.75rem" }}>
            <div style={{
              fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.14em",
              textTransform: "uppercase", color: C.textMuted, marginBottom: "0.6rem",
            }}>Órdenes registradas esta sesión</div>
            {historial.map((o) => (
              <div key={o.id} style={{
                background: C.histBg, border: "1px solid " + C.histBorder,
                borderRadius: "0.5rem", padding: "0.65rem 0.9rem",
                display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: "0.4rem",
              }}>
                <div>
                  <div style={{ color: C.primary, fontSize: "0.85rem", fontWeight: 600 }}>
                    {o.nombre_cliente || "Sin nombre"} — {o.municipio}
                  </div>
                  <div style={{ color: C.textMuted, fontSize: "0.75rem", marginTop: 2 }}>
                    {o.articulos?.slice(0, 40)}{o.articulos?.length > 40 ? "…" : ""}
                  </div>
                </div>
                <div style={{ color: C.accent, fontWeight: 700, fontSize: "0.9rem", marginLeft: "1rem", whiteSpace: "nowrap" }}>
                  {o.total_pagar}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <p style={{ 
  textAlign: "center", 
  color: "#8898aa", 
  fontSize: "0.75rem", 
  marginTop: "2rem" 
}}>
  Con tecnologia de No Just a Forms, Desarrollado por Elian Chevez para Tecno Gadget.
</p>
    </div>
  );
}
