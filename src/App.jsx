import { useState } from "react";

// Colors - Professional palette
const C = {
  blue: "#003A8C",
  blueLight: "#0057D9",
  bluePale: "#E8F0FB",
  gray: "#F4F6FA",
  grayMid: "#C8D0DE",
  grayDark: "#6B7A99",
  grayDarker: "#3F4A5E",
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

const LOGO = "https://www.agpglass.com/themes/custom/agp/logo.svg";
const TURNOS = ["1º Turno", "2º Turno", "3º Turno"];
const SETORES = [
  { id: "corte", nome: "Corte" },
  { id: "embolsamento", nome: "Embolsamento" },
  { id: "audaces", nome: "Audaces" },
];

const TIPOS_ANOMALIA = [
  "Defeito em painel",
  "Equipamento parou",
  "Material com problema",
  "Qualidade baixa",
  "Parada de produção",
  "Outro",
];

const FORM_ANOMALIA = {
  matricula: "", turno: "1º Turno", setor: "corte",
  tipoAnomalia: "Defeito em painel",
  descricao: "", causaRaiz: "",
  acaoTomada: "", resultado: "resolvido",
  duracaoParada: "",
};

const hoje = new Date().toLocaleDateString("pt-BR");
const MOCK_ANOMALIAS = [
  {
    id: 1, matricula: "3789", turno: "1º Turno", setor: "corte", data: hoje,
    tipoAnomalia: "Equipamento parou", descricao: "Lâmina do corte travou",
    causaRaiz: "Acúmulo de resíduos de aramida",
    acaoTomada: "Limpeza com ar comprimido a 6 bar", resultado: "resolvido",
    duracaoParada: "15", hora: "10:30",
  },
  {
    id: 2, matricula: "4102", turno: "1º Turno", setor: "embolsamento", data: hoje,
    tipoAnomalia: "Material com problema", descricao: "Bolsas com furos pequenos",
    causaRaiz: "Fornecedor enviou lote com defeito",
    acaoTomada: "Separação manual e contato com fornecedor", resultado: "parcial",
    duracaoParada: "45", hora: "14:15",
  },
];

const MOCK_LICOES = [
  {
    id: 1, setor: "corte", problema: "Lâmina enferrujando",
    causa: "Umidade alta e falta de lubrificação", acao: "Aplicar óleo de silicone a cada 4h",
    frequencia: 7, ultimaOcorrencia: hoje,
  },
  {
    id: 2, setor: "audaces", problema: "Carro travando",
    causa: "Programação de velocidade inadequada", acao: "Reduzir velocidade em 20% no programa",
    frequencia: 5, ultimaOcorrencia: hoje,
  },
];

// ============= BASE COMPONENTS =============
function Card({ children, style }) {
  return (
    <div style={{
      background: C.white, borderRadius: 12, padding: 20,
      boxShadow: "0 1px 3px rgba(13,27,62,0.1)",
      border: "1px solid " + C.grayMid + "50",
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
  border: "1px solid " + C.grayMid, fontSize: 14, color: C.text,
  background: C.white, outline: "none",
};

function TextInput(props) { return <input {...props} style={{ ...inputStyle, ...props.style }} />; }
function Select({ children, ...props }) {
  return <select {...props} style={{ ...inputStyle, ...props.style }}>{children}</select>;
}
function TextArea(props) {
  return <textarea {...props} rows={3} style={{ ...inputStyle, resize: "vertical", ...props.style }} />;
}

function Badge({ children, tone }) {
  const tones = {
    danger: { bg: C.dangerLight, fg: C.danger },
    warning: { bg: C.warningLight, fg: C.warning },
    success: { bg: C.successLight, fg: C.success },
    neutral: { bg: C.bluePale, fg: C.blue },
  };
  const t = tones[tone] || tones.neutral;
  return <span style={{ background: t.bg, color: t.fg, fontSize: 12, fontWeight: 700, padding: "4px 10px", borderRadius: 6, display: "inline-block" }}>{children}</span>;
}

// ============= ANOMALIAS TAB =============
function AnomaliaForm({ form, set, onSubmit }) {
  return (
    <>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 14 }}>
        <Field label="Matrícula"><TextInput value={form.matricula} onChange={(e) => set("matricula", e.target.value)} placeholder="Ex: 3789" /></Field>
        <Field label="Turno"><Select value={form.turno} onChange={(e) => set("turno", e.target.value)}>{TURNOS.map((t) => <option key={t}>{t}</option>)}</Select></Field>
        <Field label="Setor"><Select value={form.setor} onChange={(e) => set("setor", e.target.value)}>{SETORES.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}</Select></Field>
      </div>
      <Field label="Tipo de Anomalia"><Select value={form.tipoAnomalia} onChange={(e) => set("tipoAnomalia", e.target.value)}>{TIPOS_ANOMALIA.map((t) => <option key={t}>{t}</option>)}</Select></Field>
      <Field label="Descrição"><TextArea value={form.descricao} onChange={(e) => set("descricao", e.target.value)} placeholder="O que aconteceu exatamente?" /></Field>
      <Field label="Causa Raiz"><TextArea value={form.causaRaiz} onChange={(e) => set("causaRaiz", e.target.value)} placeholder="Por que aconteceu? (opcional)" rows={2} /></Field>
      <Field label="Ação Tomada"><TextArea value={form.acaoTomada} onChange={(e) => set("acaoTomada", e.target.value)} placeholder="O que foi feito pra resolver?" /></Field>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 14, marginBottom: 14 }}>
        <Field label="Resultado"><Select value={form.resultado} onChange={(e) => set("resultado", e.target.value)}><option value="resolvido">Resolvido</option><option value="parcial">Parcialmente Resolvido</option><option value="pendente">Pendente</option></Select></Field>
        <Field label="Duração da Parada (min)"><TextInput type="number" value={form.duracaoParada} onChange={(e) => set("duracaoParada", e.target.value)} placeholder="0" /></Field>
      </div>
      <button onClick={onSubmit} style={{ width: "100%", padding: "13px", borderRadius: 10, border: "none", background: C.blue, color: C.white, fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Registrar Anomalia</button>
    </>
  );
}

function AnomaliaHistorico({ anomalias }) {
  const [filtroSetor, setFiltroSetor] = useState("todos");
  const lista = anomalias.filter((a) => filtroSetor === "todos" || a.setor === filtroSetor).sort((a, b) => b.id - a.id);
  
  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, color: C.text }}>Histórico de Anomalias</h2>
      <p style={{ color: C.grayDark, fontSize: 14, marginBottom: 18 }}>Todos os problemas registrados e resoluções aplicadas.</p>
      
      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        <FiltroBtn ativo={filtroSetor === "todos"} onClick={() => setFiltroSetor("todos")}>Todos</FiltroBtn>
        {SETORES.map((s) => <FiltroBtn key={s.id} ativo={filtroSetor === s.id} onClick={() => setFiltroSetor(s.id)}>{s.nome}</FiltroBtn>)}
      </div>

      {lista.length === 0 && <Card><div style={{ color: C.grayDark }}>Nenhuma anomalia registrada.</div></Card>}
      
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {lista.map((a) => (
          <Card key={a.id}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, gap: 12, flexWrap: "wrap" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 4 }}>{a.tipoAnomalia}</div>
                <div style={{ fontSize: 13, color: C.grayDark }}>{a.data} · {a.hora} · {SETORES.find(s => s.id === a.setor)?.nome}</div>
              </div>
              <Badge tone={a.resultado === "resolvido" ? "success" : a.resultado === "parcial" ? "warning" : "danger"}>
                {a.resultado === "resolvido" ? "Resolvido" : a.resultado === "parcial" ? "Parcial" : "Pendente"}
              </Badge>
            </div>

            <div style={{ background: C.gray, borderRadius: 10, padding: "12px 14px", marginBottom: 12, fontSize: 13, lineHeight: 1.6 }}>
              <div><b>Descrição:</b> {a.descricao}</div>
              {a.causaRaiz && <div><b>Causa:</b> {a.causaRaiz}</div>}
              <div><b>Ação:</b> {a.acaoTomada}</div>
              {a.duracaoParada && <div><b>Parada:</b> {a.duracaoParada} min</div>}
            </div>

            <div style={{ fontSize: 12, color: C.grayDark }}>Registrado por mat. {a.matricula}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============= LICOES APRENDIDAS =============
function LicoesAprendidas({ licoes, anomalias }) {
  const [filtroSetor, setFiltroSetor] = useState("todos");
  const lista = licoes.filter((l) => filtroSetor === "todos" || l.setor === filtroSetor);
  
  const licoesComFreq = lista.map((l) => ({
    ...l,
    frequencia: anomalias.filter((a) => a.setor === l.setor && a.descricao.toLowerCase().includes(l.problema.toLowerCase())).length,
  })).sort((a, b) => b.frequencia - a.frequencia);

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, color: C.text }}>Base de Conhecimento</h2>
      <p style={{ color: C.grayDark, fontSize: 14, marginBottom: 18 }}>Problemas recorrentes e soluções que funcionaram. Conhecimento compartilhado da linha.</p>

      <div style={{ display: "flex", gap: 8, marginBottom: 18, flexWrap: "wrap" }}>
        <FiltroBtn ativo={filtroSetor === "todos"} onClick={() => setFiltroSetor("todos")}>Todos</FiltroBtn>
        {SETORES.map((s) => <FiltroBtn key={s.id} ativo={filtroSetor === s.id} onClick={() => setFiltroSetor(s.id)}>{s.nome}</FiltroBtn>)}
      </div>

      {licoesComFreq.length === 0 && <Card><div style={{ color: C.grayDark }}>Nenhuma lição registrada ainda.</div></Card>}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 16 }}>
        {licoesComFreq.map((l) => (
          <Card key={l.id} style={{ borderLeft: "4px solid " + C.blue }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12, gap: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: C.text, marginBottom: 4 }}>{l.problema}</div>
                <div style={{ fontSize: 12, color: C.grayDark }}>{SETORES.find(s => s.id === l.setor)?.nome}</div>
              </div>
              <Badge tone="neutral">{l.frequencia} ocorrências</Badge>
            </div>

            <div style={{ background: C.bluePale, borderRadius: 10, padding: "12px 14px", marginBottom: 12, fontSize: 13, lineHeight: 1.6 }}>
              <div style={{ marginBottom: 8 }}>
                <b style={{ color: C.blue }}>Causa:</b> {l.causa}
              </div>
              <div>
                <b style={{ color: C.blue }}>Ação Padrão:</b> {l.acao}
              </div>
            </div>

            <div style={{ fontSize: 11, color: C.grayDark }}>Última ocorrência: {l.ultimaOcorrencia}</div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============= ANALYTICS =============
function Analise({ anomalias }) {
  const total = anomalias.length;
  const resolvidas = anomalias.filter((a) => a.resultado === "resolvido").length;
  const tempoMedioParada = anomalias.filter((a) => a.duracaoParada).reduce((sum, a) => sum + parseInt(a.duracaoParada || 0), 0) / anomalias.filter((a) => a.duracaoParada).length || 0;

  const anomaliasPerSetor = SETORES.map((s) => ({
    setor: s.nome,
    count: anomalias.filter((a) => a.setor === s.id).length,
  }));

  const tiposFreq = {};
  anomalias.forEach((a) => {
    tiposFreq[a.tipoAnomalia] = (tiposFreq[a.tipoAnomalia] || 0) + 1;
  });
  const tiposOrdenados = Object.entries(tiposFreq).sort((a, b) => b[1] - a[1]);

  return (
    <div>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, color: C.text }}>Análise de Anomalias</h2>
      <p style={{ color: C.grayDark, fontSize: 14, marginBottom: 22 }}>Indicadores de desempenho e padrões da linha de produção.</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <Card style={{ borderTop: "4px solid " + C.success }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: C.success }}>{total}</div>
          <div style={{ fontSize: 13, color: C.grayDark, marginTop: 4 }}>Total de Anomalias</div>
        </Card>
        <Card style={{ borderTop: "4px solid " + C.blue }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: C.blue }}>{resolvidas}</div>
          <div style={{ fontSize: 13, color: C.grayDark, marginTop: 4 }}>Resolvidas ({((resolvidas/total)*100).toFixed(0)}%)</div>
        </Card>
        <Card style={{ borderTop: "4px solid " + C.warning }}>
          <div style={{ fontSize: 32, fontWeight: 800, color: C.warning }}>{tempoMedioParada.toFixed(0)}</div>
          <div style={{ fontSize: 13, color: C.grayDark, marginTop: 4 }}>Tempo Médio de Parada (min)</div>
        </Card>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14, color: C.text }}>Anomalias por Setor</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {anomaliasPerSetor.map((item) => (
            <div key={item.setor}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontWeight: 600, color: C.text }}>{item.setor}</span>
                <span style={{ fontWeight: 700, color: C.blue }}>{item.count}</span>
              </div>
              <div style={{ height: 8, background: C.gray, borderRadius: 4, overflow: "hidden" }}>
                <div style={{ height: "100%", background: C.blue, width: (item.count / total) * 100 + "%" }} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 14, color: C.text }}>Tipos de Anomalia (Top 5)</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {tiposOrdenados.slice(0, 5).map(([tipo, count]) => (
            <div key={tipo} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 12px", background: C.gray, borderRadius: 8 }}>
              <span style={{ color: C.text, fontSize: 13 }}>{tipo}</span>
              <Badge tone="neutral">{count}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

// ============= HELPER COMPONENTS =============
function FiltroBtn({ ativo, onClick, children }) {
  return (
    <button onClick={onClick} style={{
      padding: "8px 14px", borderRadius: 9, fontSize: 13, fontWeight: 700, cursor: "pointer",
      border: "1px solid " + (ativo ? C.blue : C.grayMid),
      background: ativo ? C.blue : C.white, color: ativo ? C.white : C.grayDark,
    }}>{children}</button>
  );
}

// ============= MAIN APP =============
export default function App() {
  const [aba, setAba] = useState("anomalias");
  const [anomalias, setAnomalias] = useState(MOCK_ANOMALIAS);
  const [licoes, setLicoes] = useState(MOCK_LICOES);
  const [formAnomalia, setFormAnomalia] = useState(FORM_ANOMALIA);

  const setAnomalia = (k, v) => setFormAnomalia((p) => ({ ...p, [k]: v }));

  const registrarAnomalia = () => {
    if (!formAnomalia.matricula.trim() || !formAnomalia.descricao.trim()) {
      alert("Preencha matrícula e descrição");
      return;
    }
    const nova = {
      ...formAnomalia, id: Date.now(),
      data: new Date().toLocaleDateString("pt-BR"),
      hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    };
    setAnomalias((p) => [...p, nova]);
    setFormAnomalia(FORM_ANOMALIA);
    setAba("anomalias_historico");
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
      <div style={{ background: C.blue, padding: "12px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.12)", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 1240, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <img 
              src={LOGO} 
              alt="AGP" 
              style={{ height: 28, filter: "brightness(0) invert(1)" }} 
              onError={(e) => { e.target.style.display = "none"; }} 
            />
            <div style={{ flex: 1 }}>
              <div style={{ color: C.white, fontSize: 20, fontWeight: 800, lineHeight: 1, margin: 0 }}>AGP TrocaTurno</div>
              <div style={{ color: "#FFFFFFAA", fontSize: 11, margin: 0 }}>Passagem de Turno · Anomalias · Lições Aprendidas</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 4, overflowX: "auto", paddingBottom: 2 }}>
            {tabBtn("anomalias", "Registrar Anomalia")}
            {tabBtn("anomalias_historico", "Histórico")}
            {tabBtn("licoes", "Base de Conhecimento")}
            {tabBtn("analise", "Análise")}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1240, margin: "0 auto", padding: "20px 16px 60px" }}>
        {aba === "anomalias" && (
          <div>
            <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4, color: C.text }}>Registrar Anomalia</h2>
            <p style={{ color: C.grayDark, fontSize: 13, marginBottom: 18 }}>Documente problemas encontrados durante o turno para construir a base de conhecimento da linha.</p>
            <Card style={{ maxWidth: 800 }}>
              <AnomaliaForm form={formAnomalia} set={setAnomalia} onSubmit={registrarAnomalia} />
            </Card>
          </div>
        )}

        {aba === "anomalias_historico" && <AnomaliaHistorico anomalias={anomalias} />}
        {aba === "licoes" && <LicoesAprendidas licoes={licoes} anomalias={anomalias} />}
        {aba === "analise" && <Analise anomalias={anomalias} />}
      </div>
    </div>
  );
}
