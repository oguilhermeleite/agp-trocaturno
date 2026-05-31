# 🔄 AGP TrocaTurno

**Passagem de Turno Digital** para o Setor Opaco da AGP sGlass Brasil.

Sistema web que substitui a passagem de turno manual, permitindo que cada setor (Corte, Embolsamento, Audaces) registre um checklist estruturado ao final do turno, deixando tudo documentado para o próximo turno.

## 🎯 Funcionalidades

- **📊 Dashboard**: Visualiza a última passagem de cada setor com alertas de segurança, equipamentos com problema e pendências
- **📝 Registrar**: Formulários específicos por setor com checklist, toggles de incidentes e campo de observação livre
- **📋 Histórico**: Lista completa de todas as passagens, filtrável por setor e data

## 🏗️ Setores

### ✂️ Corte
- Painéis cortados / pendentes
- Status da lâmina
- Material (aramida) em estoque
- Status do PU
- Incidentes de segurança
- Equipamentos com problema

### 📦 Embolsamento
- Painéis embolsados / fila
- Status de consumíveis (bolsas, fitas)
- Incidentes de segurança
- Equipamentos com problema

### 🖥️ Audaces
- Programa / arquivo em execução
- Painéis cortados por carro
- Paradas de máquina
- Manutenção pendente

## 🚀 Stack

- **React 18** + Vite
- **Styled-Components** (inline CSS)
- Deploy: **Vercel**

## 📦 Instalação

```bash
git clone https://github.com/oguilhermeleite/agp-trocaturno.git
cd agp-trocaturno
npm install
npm run dev
```

## 🔧 Build & Deploy

```bash
# Build para produção
npm run build

# Preview do build
npm run preview
```

Deploy automático no Vercel — acesso via: https://agp-trocaturno.vercel.app

## 📄 Estrutura

```
src/
├── App.jsx           # App principal com todas as abas
├── main.jsx          # Entrada React
└── index.css         # Estilos base
```

## 🎨 Design

- Paleta: Azul AGP (#003A8C) + cinzas neutros
- Badges de alerta: Vermelho (erro), Laranja (aviso)
- Responsivo: Mobile-first, desktop-optimized
- Logo AGP carregada do site oficial

## 👨‍💻 Autor

Desenvolvido por Guilherme Leite ([oguilhermeleite](https://github.com/oguilhermeleite))

## 📞 Contato / Feedback

Dúvidas ou sugestões? Abra uma issue no repositório.

---

**AGP TrocaTurno** · Setor Opaco · 2026
