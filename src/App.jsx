import { useState } from "react";

// Paleta idêntica ao HoraHora
const C = {
  blue: "#003A8C",
  blueLight: "#0057D9",
  bluePale: "#E8F0FB",
  gray: "#F4F6FA",
  grayMid: "#C8D0DE",
  grayDark: "#6B7A99",
  success: "#0A7A4B",
  successLight: "#E6F4EF",
  danger: "#C0392B",
  dangerLight: "#FDECEA",
  warning: "#D97706",
  warningLight: "#FFF7ED",
  text: "#0D1B3E",
  white: "#FFFFFF",
  purple: "#7C3AED",
  purpleLight: "#EDE9FE",
};

// Logo AGP oficial
const LOGO = "https://www.agpglass.com/themes/custom/agp/logo.svg";

const TURNOS = ["1º Turno", "2º Turno", "3º Turno"];

const SETORES = [
  { id: "corte", nome: "Corte", icon: "✂️" },
  { id: "embolsamento", nome: "Embolsamento", icon: "📦" },
  { id: "audaces", nome: "Audaces", icon: "🖥️" },
];

// ---------- Form inicial por setor ----------
const FORM_CORTE = {
  matricula: "", turno: "1º Turno",
  paineisCortados: "", lamina: "boa", materialEstoque: "",
  paineisPendentes: "", statusPU: "ok",
  incidenteSeg: false, incidenteSegDesc: "",
  equipProblema: false, equipProblemaDesc: "",
  observacao: "",
};
const FORM_EMBOLSAMENTO = {
  matricula: "", turno: "1º Turno",
  paineisEmbolsados: "", filaAguardando: "", consumiveis: "ok",
  incidenteSeg: false, incidenteSegDesc: "",
  equipProblema: false, equipProblemaDesc: "",
  observacao: "",
};
const FORM_AUDACES = {
  matricula: "", turno: "1º Turno",
  programaRodando: "", paineisPorCarro: "",
  paradaMaquina: false, paradaMaquinaDesc: "",
  manutencaoPendente: false, manutencaoPendenteDesc: "",
  observacao: "",
};

// ---------- Mock de dados iniciais ----------
const hoje = new Date().toLocaleDateString("pt-BR");
const MOCK = [
  {
    id: 1, setor: "corte", data: hoje, turno: "1º Turno", matricula: "3789",
    paineisCortados: 42, lamina: "boa", materialEstoque: "8 rolos",
    paineisPendentes: 3, statusPU: "ok",
    incidenteSeg: false, incidenteSegDesc: "",
    equipProblema: false, equipProblemaDesc: "",
    observacao: "Corte fluindo normal. PU reposto no início do turno.",
    hora: "15:02",
  },
  {
    id: 2, setor: "embolsamento", data: hoje, turno: "1º Turno", matricula: "4102",
    paineisEmbolsados: 38, filaAguardando: 4, consumiveis: "baixo",
    incidenteSeg: false, incidenteSegDesc: "",
    equipProblema: true, equipProblemaDesc: "Seladora 2 esquentando demais, abrir chamado.",
    observacao: "Estoque de bolsas baixo, pedir reposição.",
    hora: "15:05",
  },
  {
    id: 3, setor: "audaces", data: hoje, turno: "1º Turno", matricula: "3651",
    programaRodando: "Programa MX-220", paineisPorCarro: "Carro A: 12 / Carro B: 8",
    paradaMaquina: false, paradaMaquinaDesc: "",
    manutencaoPendente: false, manutencaoPendenteDesc: "",
    observacao: "Carro B ficou pela metade, próximo turno continua.",
    hora: "15:08",
  },
];

// ================= COMPONENTES BASE =================
function Card({ children, style }) {
  return (
    <div style={{
      background: C.white, borderRadius: 12, padding: 20,
      boxShadow: "0 1px 3px rgba(13,27,62,0.1)",
      border: `1px solid ${C.grayMid}50`, 
      ...style,
    }}>{children}</div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: C.grayDark, marginBottom: 6 }}>{label}</label>
      {children}
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 12px", borderRadius: 9,
  border: `1px solid ${C.grayMid}`, fontSize: 14, color: C.text,
  background: C.white, outline: "none",
};

function TextInput(props) { return <input {...props} style={{ ...inputStyle, ...props.style }} />; }
function Select({ children, ...props }) {
  return <select {...props} style={{ ...inputStyle, ...props.style }}>{children}</select>;
}
function TextArea(props) {
  return <textarea {...props} rows={3} style={{ ...inputStyle, resize: "vertical", ...props.style }} />;
}

function Toggle({ label, value, onChange, descValue, onDescChange, descPlaceholder }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: C.grayDark }}>{label}</span>
        <button
          onClick={() => onChange(!value)}
          style={{
            position: "relative", width: 52, height: 28, borderRadius: 14,
            border: "none", cursor: "pointer", flexShrink: 0,
            background: value ? C.danger : C.grayMid, transition: "background .2s",
          }}
        >
          <span style={{
            position: "absolute", top: 3, left: value ? 27 : 3, width: 22, height: 22,
            borderRadius: "50%", background: C.white, transition: "left .2s",
          }} />
        </button>
      </div>
      {value && (
        <TextArea
          value={descValue} onChange={(e) => onDescChange(e.target.value)}
          placeholder={descPlaceholder || "Descreva..."}
          style={{ marginTop: 8, borderColor: C.danger }}
        />
      )}
    </div>
  );
}

// ================= FORMULÁRIOS =================
function FormCorte({ form, set, onSubmit }) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 14 }}>
        <Field label="Matrícula"><TextInput value={form.matricula} onChange={(e) => set("matricula", e.target.value)} placeholder="Ex: 3789" /></Field>
        <Field label="Turno"><Select value={form.turno} onChange={(e) => set("turno", e.target.value)}>{TURNOS.map((t) => <option key={t}>{t}</option>)}</Select></Field>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 14 }}>
        <Field label="Painéis cortados no turno"><TextInput type="number" value={form.paineisCortados} onChange={(e) => set("paineisCortados", e.target.value)} placeholder="0" /></Field>
        <Field label="Painéis pendentes de corte"><TextInput type="number" value={form.paineisPendentes} onChange={(e) => set("paineisPendentes", e.target.value)} placeholder="0" /></Field>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 14 }}>
        <Field label="Lâmina"><Select value={form.lamina} onChange={(e) => set("lamina", e.target.value)}><option value="boa">Boa</option><option value="trocar">Precisa trocar</option></Select></Field>
        <Field label="Status do PU"><Select value={form.statusPU} onChange={(e) => set("statusPU", e.target.value)}><option value="ok">OK</option><option value="baixo">Estoque baixo</option><option value="repor">Repor urgente</option></Select></Field>
      </div>
      <Field label="Material (aramida) em estoque"><TextInput value={form.materialEstoque} onChange={(e) => set("materialEstoque", e.target.value)} placeholder="Ex: 8 rolos" /></Field>
      <Toggle label="Incidente de segurança?" value={form.incidenteSeg} onChange={(v) => set("incidenteSeg", v)} descValue={form.incidenteSegDesc} onDescChange={(v) => set("incidenteSegDesc", v)} descPlaceholder="Descreva o incidente / quase-acidente" />
      <Toggle label="Equipamento com problema?" value={form.equipProblema} onChange={(v) => set("equipProblema", v)} descValue={form.equipProblemaDesc} onDescChange={(v) => set("equipProblemaDesc", v)} descPlaceholder="Qual equipamento e o problema" />
      <Field label="Observação"><TextArea value={form.observacao} onChange={(e) => set("observacao", e.target.value)} placeholder="Observação livre para o próximo turno..." /></Field>
      <SubmitBtn onClick={onSubmit} />
    </>
  );
}

function FormEmbolsamento({ form, set, onSubmit }) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 14 }}>
        <Field label="Matrícula"><TextInput value={form.matricula} onChange={(e) => set("matricula", e.target.value)} placeholder="Ex: 4102" /></Field>
        <Field label="Turno"><Select value={form.turno} onChange={(e) => set("turno", e.target.value)}>{TURNOS.map((t) => <option key={t}>{t}</option>)}</Select></Field>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 14 }}>
        <Field label="Painéis embolsados (prontos p/ autoclave)"><TextInput type="number" value={form.paineisEmbolsados} onChange={(e) => set("paineisEmbolsados", e.target.value)} placeholder="0" /></Field>
        <Field label="Fila aguardando embolsamento"><TextInput type="number" value={form.filaAguardando} onChange={(e) => set("filaAguardando", e.target.value)} placeholder="0" /></Field>
      </div>
      <Field label="Consumíveis (bolsas, fitas)"><Select value={form.consumiveis} onChange={(e) => set("consumiveis", e.target.value)}><option value="ok">OK</option><option value="baixo">Estoque baixo</option><option value="repor">Repor urgente</option></Select></Field>
      <Toggle label="Incidente de segurança?" value={form.incidenteSeg} onChange={(v) => set("incidenteSeg", v)} descValue={form.incidenteSegDesc} onDescChange={(v) => set("incidenteSegDesc", v)} descPlaceholder="Descreva o incidente / quase-acidente" />
      <Toggle label="Equipamento com problema?" value={form.equipProblema} onChange={(v) => set("equipProblema", v)} descValue={form.equipProblemaDesc} onDescChange={(v) => set("equipProblemaDesc", v)} descPlaceholder="Qual equipamento e o problema" />
      <Field label="Observação"><TextArea value={form.observacao} onChange={(e) => set("observacao", e.target.value)} placeholder="Observação livre para o próximo turno..." /></Field>
      <SubmitBtn onClick={onSubmit} />
    </>
  );
}

function FormAudaces({ form, set, onSubmit }) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
        <Field label="Matrícula"><TextInput value={form.matricula} onChange={(e) => set("matricula", e.target.value)} placeholder="Ex: 3651" /></Field>
        <Field label="Turno"><Select value={form.turno} onChange={(e) => set("turno", e.target.value)}>{TURNOS.map((t) => <option key={t}>{t}</option>)}</Select></Field>
      </div>
      <Field label="Programa / arquivo rodando"><TextInput value={form.programaRodando} onChange={(e) => set("programaRodando", e.target.value)} placeholder="Ex: Programa MX-220" /></Field>
      <Field label="Painéis cortados por carro"><TextArea value={form.paineisPorCarro} onChange={(e) => set("paineisPorCarro", e.target.value)} placeholder="Ex: Carro A: 12 / Carro B: 8 (pela metade)" /></Field>
      <Toggle label="Parada de máquina no turno?" value={form.paradaMaquina} onChange={(v) => set("paradaMaquina", v)} descValue={form.paradaMaquinaDesc} onDescChange={(v) => set("paradaMaquinaDesc", v)} descPlaceholder="Motivo e duração da parada" />
      <Toggle label="Manutenção pendente?" value={form.manutencaoPendente} onChange={(v) => set("manutencaoPendente", v)} descValue={form.manutencaoPendenteDesc} onDescChange={(v) => set("manutencaoPendenteDesc", v)} descPlaceholder="O que precisa de manutenção" />
      <Field label="Observação"><TextArea value={form.observacao} onChange={(e) => set("observacao", e.target.value)} placeholder="Observação livre para o próximo turno..." /></Field>
      <SubmitBtn onClick={onSubmit} />
    </>
  );
}

function SubmitBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", padding: "13px", borderRadius: 10, border: "none",
      background: C.blue, color: C.white, fontSize: 15, fontWeight: 700,
      cursor: "pointer", marginTop: 6,
    }}>Registrar passagem de turno</button>
  );
}

// ================= DASHBOARD =================
function Badge({ children, tone }) {
  const tones = {
    danger: { bg: C.dangerLight, fg: C.danger },
    warning: { bg: C.warningLight, fg: C.warning },
    success: { bg: C.successLight, fg: C.success },
    neutral: { bg: C.bluePale, fg: C.blue },
  };
  const t = tones[tone] || tones.neutral;
  return <span style={{ background: t.bg, color: t.fg, fontSize: 12, fontWeight: 700, padding: "3px 9px", borderRadius: 7, display: "inline-block" }}>{children}</span>;
}

function alertasDoRegistro(r) {
  const a = [];
  if (r.incidenteSeg) a.push({ tone: "danger", txt: "⚠️ Incidente de segurança" });
  if (r.equipProblema) a.push({ tone: "danger", txt: "🔧 Equipamento com problema" });
  if (r.paradaMaquina) a.push({ tone: "danger", txt: "⏸️ Parada de máquina" });
  if (r.manutencaoPendente) a.push({ tone: "warning", txt: "🔧 Manutenção pendente" });
  if (r.lamina === "trocar") a.push({ tone: "warning", txt: "🔪 Trocar lâmina" });
  if (r.statusPU === "repor") a.push({ tone: "warning", txt: "🧴 Repor PU" });
  if (r.statusPU === "baixo") a.push({ tone: "warning", txt: "🧴 PU baixo" });
  if (r.consumiveis === "repor") a.push({ tone: "warning", txt: "📦 Repor consumíveis" });
  if (r.consumiveis === "baixo") a.push({ tone: "warning", txt: "📦 Consumíveis baixos" });
  return a;
}

function DashCardSetor({ setor, registro }) {
  const meta = SETORES.find((s) => s.id === setor);
  if (!registro) {
    return (
      <Card>
        <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 8 }}>{meta.icon} {meta.nome}</div>
        <div style={{ color: C.grayDark, fontSize: 13 }}>Nenhuma passagem registrada ainda.</div>
      </Card>
    );
  }
  const alertas = alertasDoRegistro(registro);
  return (
    <Card>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 14, gap: 12 }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: C.text }}>{meta.icon} {meta.nome}</div>
        <div style={{ textAlign: "right", fontSize: 12, color: C.grayDark, flexShrink: 0 }}>
          <div style={{ fontWeight: 600 }}>{registro.turno}</div>
          <div style={{ fontSize: 11 }}>{registro.data} · {registro.hora}</div>
        </div>
      </div>

      {alertas.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 14 }}>
          {alertas.map((a, i) => <Badge key={i} tone={a.tone}>{a.txt}</Badge>)}
        </div>
      )}

      <div style={{ fontSize: 15, lineHeight: 1.8, color: C.text, marginBottom: 14, background: C.gray, borderRadius: 10, padding: "12px 14px" }}>
        {setor === "corte" && (<>
          <div><b>Cortados:</b> {registro.paineisCortados} | <b>Pendentes:</b> {registro.paineisPendentes}</div>
          <div><b>Material:</b> {registro.materialEstoque}</div>
        </>)}
        {setor === "embolsamento" && (<>
          <div><b>Embolsados:</b> {registro.paineisEmbolsados} | <b>Fila:</b> {registro.filaAguardando}</div>
        </>)}
        {setor === "audaces" && (<>
          <div><b>Programa:</b> {registro.programaRodando}</div>
          <div><b>Por carro:</b> {registro.paineisPorCarro}</div>
        </>)}
      </div>

      {registro.observacao && (
        <div style={{ marginBottom: 12, background: C.bluePale, borderRadius: 10, padding: "12px 14px", fontSize: 13, color: C.text, borderLeft: `4px solid ${C.blue}` }}>
          <b style={{ color: C.blue }}>📝 Observação:</b> {registro.observacao}
        </div>
      )}

      {(registro.incidenteSegDesc || registro.equipProblemaDesc || registro.paradaMaquinaDesc || registro.manutencaoPendenteDesc) && (
        <div style={{ marginBottom: 12, background: C.dangerLight, borderRadius: 10, padding: "12px 14px", fontSize: 13, color: C.danger, borderLeft: `4px solid ${C.danger}` }}>
          {registro.incidenteSegDesc && <div>⚠️ <b>Incidente:</b> {registro.incidenteSegDesc}</div>}
          {registro.equipProblemaDesc && <div>🔧 <b>Equipamento:</b> {registro.equipProblemaDesc}</div>}
          {registro.paradaMaquinaDesc && <div>⏸️ <b>Parada:</b> {registro.paradaMaquinaDesc}</div>}
          {registro.manutencaoPendenteDesc && <div>🔧 <b>Manutenção:</b> {registro.manutencaoPendenteDesc}</div>}
        </div>
      )}

      <div style={{ fontSize: 12, color: C.grayDark }}>Registrado por <b>mat. {registro.matricula}</b></div>
    </Card>
  );
}

function Dashboard({ registros }) {
  const ultimoPorSetor = (id) => registros.filter((r) => r.setor === id).sort((a, b) => b.id - a.id)[0];
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, color: C.text }}>Última passagem por setor</h2>
      <p style={{ color: C.grayDark, fontSize: 14, marginBottom: 22 }}>O que o turno anterior deixou registrado.</p>
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
        gap: 18,
        "@media (max-width: 768px)": {
          gridTemplateColumns: "1fr",
        }
      }}>
        {SETORES.map((s) => <DashCardSetor key={s.id} setor={s.id} registro={ultimoPorSetor(s.id)} />)}
      </div>
    </div>
  );
}

// ================= HISTÓRICO =================
function Historico({ registros }) {
  const [filtro, setFiltro] = useState("todos");
  const lista = registros.filter((r) => filtro === "todos" || r.setor === filtro).sort((a, b) => b.id - a.id);
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 14 }}>Histórico de passagens</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
        <FiltroBtn ativo={filtro === "todos"} onClick={() => setFiltro("todos")}>Todos</FiltroBtn>
        {SETORES.map((s) => <FiltroBtn key={s.id} ativo={filtro === s.id} onClick={() => setFiltro(s.id)}>{s.icon} {s.nome}</FiltroBtn>)}
      </div>
      {lista.length === 0 && <Card><div style={{ color: C.grayDark }}>Nenhum registro.</div></Card>}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {lista.map((r) => {
          const meta = SETORES.find((s) => s.id === r.setor);
          const alertas = alertasDoRegistro(r);
          return (
            <Card key={r.id}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <div style={{ fontWeight: 800 }}>{meta.icon} {meta.nome} · {r.turno}</div>
                <div style={{ fontSize: 12, color: C.grayDark }}>{r.data} · {r.hora} · mat. {r.matricula}</div>
              </div>
              {alertas.length > 0 && (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
                  {alertas.map((a, i) => <Badge key={i} tone={a.tone}>{a.txt}</Badge>)}
                </div>
              )}
              {r.observacao && <div style={{ marginTop: 8, fontSize: 13, color: C.text }}>📝 {r.observacao}</div>}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function FiltroBtn({ ativo, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 14px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer",
      border: `1px solid ${ativo ? C.blue : C.grayMid}`,
      background: ativo ? C.blue : C.white, color: ativo ? C.white : C.grayDark,
    }}>{children}</button>
  );
}

// ================= APP =================
export default function App() {
  const [aba, setAba] = useState("dashboard");
  const [setorAtivo, setSetorAtivo] = useState("corte");
  const [registros, setRegistros] = useState(MOCK);

  const [fCorte, setFCorte] = useState(FORM_CORTE);
  const [fEmb, setFEmb] = useState(FORM_EMBOLSAMENTO);
  const [fAud, setFAud] = useState(FORM_AUDACES);

  const setCorte = (k, v) => setFCorte((p) => ({ ...p, [k]: v }));
  const setEmb = (k, v) => setFEmb((p) => ({ ...p, [k]: v }));
  const setAud = (k, v) => setFAud((p) => ({ ...p, [k]: v }));

  const registrar = (setor, form, reset, initial) => {
    if (!form.matricula.trim()) { alert("Informe a matrícula."); return; }
    const novo = {
      ...form, id: Date.now(), setor,
      data: new Date().toLocaleDateString("pt-BR"),
      hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
    setRegistros((p) => [...p, novo]);
    reset(initial);
    setAba("dashboard");
  };

  const tabBtn = (id, label) => (
    <button onClick={() => setAba(id)} style={{
      padding: "9px 14px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer",
      border: "none", background: aba === id ? C.white : "transparent",
      color: aba === id ? C.blue : "#FFFFFFDD", whiteSpace: "nowrap",
      boxShadow: aba === id ? "0 1px 4px rgba(0,0,0,0.12)" : "none",
      transition: "all 0.2s",
    }}>{label}</button>
  );

  return (
    <div style={{ minHeight: "100vh", background: C.gray, overflowX: "hidden" }}>
      {/* Header */}
      <div style={{ background: C.blue, padding: "12px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.12)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          {/* Logo + Título */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <img 
              src={LOGO} 
              alt="AGP" 
              style={{ height: 28, filter: "brightness(0) invert(1)" }} 
              onError={(e) => { 
                e.target.style.display = "none"; 
              }} 
            />
            <div style={{ flex: 1 }}>
              <div style={{ color: C.white, fontSize: 20, fontWeight: 800, lineHeight: 1, margin: 0 }}>AGP TrocaTurno</div>
              <div style={{ color: "#FFFFFFAA", fontSize: 11, margin: 0 }}>Passagem de Turno · Setor Opaco</div>
            </div>
          </div>
          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 2 }}>
            {tabBtn("dashboard", "📊 Dashboard")}
            {tabBtn("registrar", "📝 Registrar")}
            {tabBtn("historico", "📋 Histórico")}
          </div>
        </div>
      </div>

      {/* Conteúdo */}
      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "20px 16px 60px" }}>
        {aba === "dashboard" && <Dashboard registros={registros} />}
        {aba === "historico" && <Historico registros={registros} />}
        {aba === "registrar" && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, color: C.text }}>Registrar passagem de turno</h2>
            <p style={{ color: C.grayDark, fontSize: 13, marginBottom: 18 }}>Preencha o formulário do setor correspondente.</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap", overflowX: "auto" }}>
              {SETORES.map((s) => <FiltroBtn key={s.id} ativo={setorAtivo === s.id} onClick={() => setSetorAtivo(s.id)}>{s.icon} {s.nome}</FiltroBtn>)}
            </div>
            <Card style={{ maxWidth: 800 }}>
              {setorAtivo === "corte" && <FormCorte form={fCorte} set={setCorte} onSubmit={() => registrar("corte", fCorte, setFCorte, FORM_CORTE)} />}
              {setorAtivo === "embolsamento" && <FormEmbolsamento form={fEmb} set={setEmb} onSubmit={() => registrar("embolsamento", fEmb, setFEmb, FORM_EMBOLSAMENTO)} />}
              {setorAtivo === "audaces" && <FormAudaces form={fAud} set={setAud} onSubmit={() => registrar("audaces", fAud, setFAud, FORM_AUDACES)} />}
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
