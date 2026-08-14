// ============================================
// FUNÇÕES AUXILIARES
// ============================================
const fmt = (v) => "R$ " + Number(v).toLocaleString("pt-BR", {minimumFractionDigits:2, maximumFractionDigits:2});
const dat = (d) => d ? moment(d).format("DD/MM/YYYY") : "Não informada";

Chart.defaults.font.family = "Inter, sans-serif";
Chart.defaults.font.size = 11;
Chart.defaults.font.weight = 300;
Chart.defaults.color = "#717b78";
Chart.defaults.borderColor = "#e8ecea";

const CHART_COLORS = ["#18745b", "#476d78", "#9a7650", "#7d8b87", "#b05f54", "#738d68", "#8b7694"];
const AREA_CHART_COLORS = ["#16856b", "#397a9b", "#d39a45", "#7c8f9b", "#c56359", "#78966b", "#8c73a3"];

const compactCurrency = value => new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    notation: "compact",
    maximumFractionDigits: 1
}).format(value);

const barValueLabels = {
    id: "barValueLabels",
    afterDatasetsDraw(chart) {
        const {ctx} = chart;
        ctx.save();
        ctx.fillStyle = "#59635f";
        ctx.font = "300 10px Inter";
        ctx.textBaseline = "middle";
        chart.getDatasetMeta(0).data.forEach((bar, index) => {
            ctx.fillText(compactCurrency(chart.data.datasets[0].data[index]), bar.x + 7, bar.y);
        });
        ctx.restore();
    }
};

const doughnutCenterText = {
    id: "doughnutCenterText",
    afterDraw(chart) {
        const {ctx, chartArea} = chart;
        if (!chartArea) return;
        const total = chart.data.datasets[0].data.reduce((sum, value) => sum + value, 0);
        const x = (chartArea.left + chartArea.right) / 2;
        const y = (chartArea.top + chartArea.bottom) / 2;
        ctx.save();
        ctx.textAlign = "center";
        ctx.fillStyle = "#717b78";
        ctx.font = "500 9px Inter";
        ctx.fillText("TOTAL EXECUTADO", x, y - 9);
        ctx.fillStyle = "#18211f";
        ctx.font = "300 17px Inter";
        ctx.fillText(compactCurrency(total), x, y + 15);
        ctx.restore();
    }
};

// ============================================
// TOTAIS CORRETOS (FORÇADOS MANUALMENTE)
// ============================================
const TOTAL_SALDO_DI = 4003044.87;
const TOTAL_SALDO_GERAL = 80380089.63;

// ============================================
// DADOS COMPLETOS (129 GASTOS)
// ============================================
const gastos = [
{item:1,valor:40000,data:"2026-01-06",projeto:"GEREB 031 FIO 23",rubrica:"SPCD",area:"GABINETE",descricao:"EVENTO: 14º CONGRESSO BRASILEIRO DE SAÚDE COLETIVA.",favorecido:"KINGSMAN SOLUCOES EM EVENTOS LTDA",meta:3,modalidade:"SPCD"},
{item:2,valor:3952.38,data:"2026-01-14",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"GABINETE",descricao:"REUNIÃO COM PRESIDENTE DA FIOCRUZ BRASÍLIA - DR MÁRIO MOREIRA",favorecido:"MARIA FABIANA DAMÁSIO PASSOS",meta:4,modalidade:"PASSAGENS"},
{item:3,valor:570,data:"2026-01-14",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"GABINETE",descricao:"REUNIÃO COM PRESIDENTE DA FIOCRUZ BRASÍLIA",favorecido:"MARIA FABIANA DAMÁSIO PASSOS",meta:4,modalidade:"DIÁRIAS"},
{item:4,valor:2249.9,data:"2026-01-12",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"PARTICIPAR DO II SEMINÁRIO STEM NA SAÚDE",favorecido:"NOELY FABIANA OLIVEIRA DE MOURA",meta:4,modalidade:"PASSAGENS"},
{item:5,valor:1470,data:"2026-01-12",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"PARTICIPAR DO II SEMINÁRIO STEM NA SAÚDE",favorecido:"NOELY FABIANA OLIVEIRA DE MOURA",meta:4,modalidade:"DIÁRIAS"},
{item:6,valor:30000,data:"2026-02-02",projeto:"GEREB 012 FIO 25",rubrica:"CLT",area:"NUSMAD",descricao:"CONTRATAÇÃO CLT - VALOR ANUAL BRUTO",favorecido:"LÍSIA HELENA OLIVIERA SALES",meta:1,modalidade:"CLT"},
{item:7,valor:646.3375,data:"2026-02-26",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"NETHIS",descricao:"PARTICIPAÇÃO REUNIÕES GOVERNO ESTADUAL",favorecido:"JOSÉ FRANCISCO NOGUEIRO PARANAGUÁ DE SANTANA",meta:4,modalidade:"PASSAGENS"},
{item:8,valor:1216.6666666666667,data:"2026-02-26",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"NETHIS",descricao:"PARTICIPAÇÃO REUNIÕES GOVERNO ESTADUAL",favorecido:"JOSÉ FRANCISCO NOGUEIRO PARANAGUÁ DE SANTANA",meta:4,modalidade:"DIÁRIAS"},
{item:9,valor:1676.6,data:"2026-01-21",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"GABINETE",descricao:"PARTICIPAR DE REUNIÕES DE AÇÃO",favorecido:"MARIA FABIANA DAMÁSIO PASSOS",meta:4,modalidade:"PASSAGENS"},
{item:10,valor:237.5,data:"2026-06-21",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"GABINETE",descricao:"PARTICIPAR DE REUNIÕES DE AÇÃO",favorecido:"MARIA FABIANA DAMÁSIO PASSOS",meta:4,modalidade:"DIÁRIAS"},
{item:11,valor:7185,data:"2026-01-22",projeto:"GEREB 005 FIO 21",rubrica:"SPCD",area:"GABINETE",descricao:"RENOVAÇÃO DE LICENÇA ADOBE - ASCOM",favorecido:"MCR SOFTWARE",meta:5,modalidade:"SPCD"},
{item:12,valor:1104.3125,data:"2026-01-16",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"PSAT",descricao:"PARTICIPAR PLANEJAMENTO RESIDÊNCIA",favorecido:"FRANCILENE MENEZES DOS SANTOS",meta:4,modalidade:"PASSAGENS"},
{item:13,valor:987.5,data:"2026-01-16",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"PSAT",descricao:"PARTICIPAR PLANEJAMENTO RESIDÊNCIA",favorecido:"FRANCILENE MENEZES DOS SANTOS",meta:4,modalidade:"DIÁRIAS"},
{item:14,valor:480.3875,data:"2026-01-28",projeto:"GEREB 031 FIO 23",rubrica:"PASSAGENS",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"PARTICIPAR AULAS ESPECIALIZAÇÃO",favorecido:"FABIANA DA SILVA RODRIGUES FERNANDES",meta:3,modalidade:"PASSAGENS"},
{item:15,valor:800,data:"2026-01-28",projeto:"GEREB 031 FIO 23",rubrica:"DIÁRIAS",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"PARTICIPAR AULAS ESPECIALIZAÇÃO",favorecido:"FABIANA DA SILVA RODRIGUES FERNANDES",meta:3,modalidade:"DIÁRIAS"},
{item:16,valor:8312.5,data:"2026-01-29",projeto:"GEREB 013 FIO 21",rubrica:"SPCD",area:"ASCOM",descricao:"SERVIÇOS GRÁFICOS: FOLDERS",favorecido:"IMAGEM GRÁFICA",meta:5,modalidade:"SPCD"},
{item:17,valor:15225,data:"2026-01-30",projeto:"GEREB 009 FIO 24",rubrica:"SPCD",area:"PSAT",descricao:"SERVIÇOS GRÁFICOS LIVRO TERRITÓRIOS SAUDÁVEIS",favorecido:"EDITORA EXPRESSÃO POPULAR LTDA",meta:3,modalidade:"SPCD"},
{item:18,valor:1062.4291666666666,data:"2026-01-28",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"NEVS",descricao:"MINISTRAR DISCIPLINA MESTRADO RONDÔNIA",favorecido:"EDUARDO AUGUSTO FERNANDES NILSON",meta:4,modalidade:"PASSAGENS"},
{item:19,valor:1050,data:"2026-01-28",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"NEVS",descricao:"MINISTRAR DISCIPLINA MESTRADO",favorecido:"EDUARDO AUGUSTO FERNANDES NILSON",meta:4,modalidade:"DIÁRIAS"},
{item:20,valor:939.9541666666665,data:"2026-01-28",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"NEVS",descricao:"MINISTRAR DISCIPLINA",favorecido:"ANA GRETEL ECHAZU",meta:4,modalidade:"PASSAGENS"},
{item:21,valor:883.3333333333333,data:"2026-01-28",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"NEVS",descricao:"MINISTRAR DISCIPLINA",favorecido:"ANA GRETEL ECHAZU",meta:4,modalidade:"DIÁRIAS"},
{item:22,valor:939.9541666666665,data:"2026-01-28",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"NEVS",descricao:"MINISTRAR DISCIPLINA",favorecido:"NOELY FABIANA OLIVEIRA DE MOURA",meta:4,modalidade:"PASSAGENS"},
{item:23,valor:883.3333333333333,data:"2026-01-28",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"NEVS",descricao:"MINISTRAR DISCIPLINA",favorecido:"NOELY FABIANA OLIVEIRA DE MOURA",meta:4,modalidade:"DIÁRIAS"},
{item:24,valor:1789.275,data:"2026-01-30",projeto:"GEREB 018 FIO 23",rubrica:"PASSAGENS",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"OFICINA JATOBÁ 60+",favorecido:"MARIA CRISTINA RODRIGUES GUILAM",meta:3,modalidade:"PASSAGENS"},
{item:25,valor:612.5,data:"2026-01-30",projeto:"GEREB 018 FIO 23",rubrica:"DIÁRIAS",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"OFICINA JATOBÁ 60+",favorecido:"MARIA CRISTINA RODRIGUES GUILAM",meta:3,modalidade:"DIÁRIAS"},
{item:26,valor:833.3333333333333,data:"2026-01-10",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 01 MÊS",favorecido:"ALAN RAYMISON TAVARES RABELO",meta:3,modalidade:"BOLSA"},
{item:27,valor:2083.3333333333335,data:"2026-01-10",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 01 MÊS",favorecido:"ANDREIA GUSSI DE OLIVEIRA",meta:3,modalidade:"BOLSA"},
{item:28,valor:833.3333333333333,data:"2026-02-03",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 06 MESES",favorecido:"BEATRIZ OLIVEIRA BLACKMAN MACHADO",meta:3,modalidade:"BOLSA"},
{item:29,valor:1666.6666666666665,data:"2026-02-03",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 02 MESES",favorecido:"CAMILA LIMA NOGUEIRA",meta:3,modalidade:"BOLSA"},
{item:30,valor:7062.5,data:"2026-01-26",projeto:"GEREB 031 FIO 23",rubrica:"SPCD",area:"ASCOM",descricao:"SERVIÇOS GRÁFICOS: FOLDERS",favorecido:"IMAGEM GRÁFICA",meta:3,modalidade:"SPCD"},
{item:31,valor:7187.5,data:"2026-01-02",projeto:"GEREB 031 FIO 23",rubrica:"SPCD",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"AQUISIÇÃO LICENÇA ADOBE",favorecido:"JR COMERCIO LTDA",meta:3,modalidade:"SPCD"},
{item:32,valor:2065.4166666666665,data:"2026-03-02",projeto:"GEREB 031 FIO 23",rubrica:"SPCD",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"KIT TECLADO E MOUSE",favorecido:"JR COMERCIO LTDA",meta:3,modalidade:"SPCD"},
{item:33,valor:4083.333333333333,data:"2026-02-10",projeto:"GEREB 031 FIO 23",rubrica:"SPCD",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"EVENTO COLETIVO JATOBÁ 60+",favorecido:"IARA MARIA MAXIMO NOGUEIRA ME",meta:3,modalidade:"SPCD"},
{item:34,valor:2173.054166666667,data:"2026-02-08",projeto:"GEREB 014 FIO 24",rubrica:"PASSAGENS",area:"GABINETE",descricao:"REUNIÃO PRESIDÊNCIA",favorecido:"MARIA FABIANA DAMÁSIO PASSOS",meta:1,modalidade:"PASSAGENS"},
{item:35,valor:237.5,data:"2026-02-08",projeto:"GEREB 014 FIO 24",rubrica:"DIÁRIAS",area:"GABINETE",descricao:"REUNIÃO PRESIDÊNCIA",favorecido:"MARIA FABIANA DAMÁSIO PASSOS",meta:1,modalidade:"DIÁRIAS"},
{item:36,valor:933.3875,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"PASSAGENS",area:"CPP",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"MARCIA DA LUZ MOTA",meta:5,modalidade:"PASSAGENS"},
{item:37,valor:425,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"DIÁRIAS",area:"CPP",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"MARCIA DA LUZ MOTA",meta:5,modalidade:"DIÁRIAS"},
{item:38,valor:933.3875,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"PASSAGENS",area:"CPP",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"MARGE TENORIO",meta:5,modalidade:"PASSAGENS"},
{item:39,valor:425,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"DIÁRIAS",area:"PEPTS",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"MARGE TENORIO",meta:5,modalidade:"DIÁRIAS"},
{item:40,valor:933.3875,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"PASSAGENS",area:"CPP",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"ANA GRETEL ECHAZU",meta:5,modalidade:"PASSAGENS"},
{item:41,valor:425,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"DIÁRIAS",area:"CPP",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"ANA GRETEL ECHAZU",meta:5,modalidade:"DIÁRIAS"},
{item:42,valor:933.3875,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"PASSAGENS",area:"PEPTS",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"FLÁVIA TAVARES SILVA ELIAS",meta:5,modalidade:"PASSAGENS"},
{item:43,valor:425,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"DIÁRIAS",area:"PEPTS",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"FLÁVIA TAVARES SILVA ELIAS",meta:5,modalidade:"DIÁRIAS"},
{item:44,valor:933.3875,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"PASSAGENS",area:"GABINETE",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"ALEXANDRO RODRIGUES PINTO",meta:5,modalidade:"PASSAGENS"},
{item:45,valor:425,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"DIÁRIAS",area:"GABINETE",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"ALEXANDRO RODRIGUES PINTO",meta:5,modalidade:"DIÁRIAS"},
{item:46,valor:933.3875,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"PASSAGENS",area:"CPP",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"JOÃO VITOR DA SILVA SANTOS",meta:5,modalidade:"PASSAGENS"},
{item:47,valor:425,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"DIÁRIAS",area:"CPP",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"JOÃO VITOR DA SILVA SANTOS",meta:5,modalidade:"DIÁRIAS"},
{item:48,valor:651.1541666666666,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"PASSAGENS",area:"CPP",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"LUCIANA GUERRA GALLO",meta:5,modalidade:"PASSAGENS"},
{item:49,valor:425,data:"2026-02-10",projeto:"GEREB 013 FIO 21",rubrica:"DIÁRIAS",area:"CPP",descricao:"FÓRUM OSWALDO CRUZ",favorecido:"LUCIANA GUERRA GALLO",meta:5,modalidade:"DIÁRIAS"},
{item:50,valor:1461.7208333333335,data:"2026-02-12",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"GABINETE",descricao:"REUNIÃO PRESIDÊNCIA",favorecido:"MARIA FABIANA DAMÁSIO PASSOS",meta:4,modalidade:"PASSAGENS"},
{item:51,valor:237.5,data:"2026-02-12",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"GABINETE",descricao:"REUNIÃO PRESIDÊNCIA",favorecido:"MARIA FABIANA DAMÁSIO PASSOS",meta:4,modalidade:"DIÁRIAS"},
{item:52,valor:4166.666666666667,data:"2026-02-13",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 03 MESES",favorecido:"CECILIA CUNHA FRANCO FERREIRA VILAS BOAS",meta:3,modalidade:"BOLSA"},
{item:53,valor:6666.666666666666,data:"2026-02-13",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 03 MESES",favorecido:"WAGNER ELIAS PINHEIRO DOS SANTOS",meta:3,modalidade:"BOLSA"},
{item:54,valor:1183.3333333333333,data:"2026-02-13",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 02 MESES",favorecido:"FERNANDA KNIERIM CORREA",meta:3,modalidade:"BOLSA"},
{item:55,valor:2500,data:"2026-02-13",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 03 MESES",favorecido:"FRANCILENE MENEZES DOS SANTOS",meta:3,modalidade:"BOLSA"},
{item:56,valor:71256.5,data:"2026-03-18",projeto:"GEREB 033 FIO 23",rubrica:"CLT",area:"NUGP",descricao:"CONTRATAÇÃO CLT - GEANE MONTENEGRO",favorecido:"GEANE DI MAGIELLI FIGUEIRO DA SILVA MONTENEGRO",meta:7,modalidade:"CLT"},
{item:57,valor:1212.0541666666666,data:"2026-02-20",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"ASCOM",descricao:"FÓRUM DE ASSESSORES",favorecido:"FABIANA MASCARENHAS SANT'ANA",meta:4,modalidade:"PASSAGENS"},
{item:58,valor:237.5,data:"2026-02-20",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"ASCOM",descricao:"FÓRUM DE ASSESSORES",favorecido:"FABIANA MASCARENHAS SANT'ANA",meta:4,modalidade:"DIÁRIAS"},
{item:59,valor:1536.9416666666666,data:"2026-02-20",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"PSAT",descricao:"MINISTRAR AULA RESIDÊNCIA",favorecido:"FRANCILENE MENEZES DOS SANTOS",meta:4,modalidade:"PASSAGENS"},
{item:60,valor:2487.5,data:"2026-02-20",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"PSAT",descricao:"MINISTRAR AULA RESIDÊNCIA",favorecido:"FRANCILENE MENEZES DOS SANTOS",meta:4,modalidade:"DIÁRIAS"},
{item:61,valor:735.375,data:"2026-02-20",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"PSAT",descricao:"MINISTRAR AULA",favorecido:"MAURICÉIA MARIA DE SANTANA",meta:4,modalidade:"PASSAGENS"},
{item:62,valor:800,data:"2026-02-20",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"PSAT",descricao:"MINISTRAR AULA",favorecido:"MAURICÉIA MARIA DE SANTANA",meta:4,modalidade:"DIÁRIAS"},
{item:63,valor:22083.333333333336,data:"2026-03-04",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 06 MESES",favorecido:"MATEUS DOS SANTOS BRITO",meta:3,modalidade:"BOLSA"},
{item:64,valor:5833.333333333334,data:"2026-03-03",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 02 MESES",favorecido:"PAMELA ARRUDA VASCONCELLOS",meta:3,modalidade:"BOLSA"},
{item:65,valor:10833.333333333332,data:"2026-03-06",projeto:"GEREB 007 FIO 20",rubrica:"SPCD",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"ALIMENTAÇÃO EVENTO",favorecido:"IARA MARIA MAXIMO NOGUEIRA ME",meta:4,modalidade:"SPCD"},
{item:66,valor:687.5,data:"2026-03-09",projeto:"GEREB 007 FIO 20",rubrica:"SPCD",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"SERVIÇOS GRÁFICOS AULA MAGNA",favorecido:"FERNANDO CAMARGOS DA SILVA",meta:4,modalidade:"SPCD"},
{item:67,valor:5737.5,data:"2026-03-02",projeto:"GEREB 031 FIO 23",rubrica:"SPCD",area:"GABINETE",descricao:"CALENDÁRIOS 2026",favorecido:"IMAGEM GRÁFICA",meta:3,modalidade:"SPCD"},
{item:68,valor:1149.7208333333333,data:"2026-02-26",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"GABINETE",descricao:"PART. FÓRUM OSWALDO CRUZ",favorecido:"MARIA FABIANA DAMÁSIO PASSOS",meta:4,modalidade:"PASSAGENS"},
{item:69,valor:237.5,data:"2026-02-26",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"GABINETE",descricao:"PART. FÓRUM OSWALDO CRUZ",favorecido:"MARIA FABIANA DAMÁSIO PASSOS",meta:4,modalidade:"DIÁRIAS"},
{item:70,valor:1080.825,data:"2026-03-06",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"AULA INAUGURAL FIOCRUZ",favorecido:"LUCIANA SEPULVEDA KOPTCKE",meta:4,modalidade:"PASSAGENS"},
{item:71,valor:237.5,data:"2026-03-06",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"AULA INAUGURAL",favorecido:"LUCIANA SEPULVEDA KOPTCKE",meta:4,modalidade:"DIÁRIAS"},
{item:72,valor:2083.3333333333335,data:"2026-03-17",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 03 MESES",favorecido:"PEDRO HENRIQUE SANTOS VITORIANO",meta:3,modalidade:"BOLSA"},
{item:73,valor:46896.05,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"NEAD",descricao:"CONTRATAÇÃO CLT ALEXANDRA JAPIASSU",favorecido:"ALEXANDRA GALVAO DE OLIVEIRA JAPIASSU",meta:12,modalidade:"CLT"},
{item:74,valor:124486.9,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"UNASUS",descricao:"CONTRATAÇÃO CLT ALYSSON LEMOS",favorecido:"ALYSSON FELICIANO LEMOS",meta:12,modalidade:"CLT"},
{item:75,valor:20828.8,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"UNASUS",descricao:"CONTRATAÇÃO CLT BRUNO LUCENA",favorecido:"BRUNO EDUARDO LUCENA DOS SANTOS",meta:12,modalidade:"CLT"},
{item:76,valor:32887.6,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"NUGP",descricao:"CONTRATAÇÃO CLT ERIKA VASCONCELOS",favorecido:"ERIKA DE SA VASCONCELOS",meta:12,modalidade:"CLT"},
{item:77,valor:56495.85,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"UNASUS",descricao:"CONTRATAÇÃO CLT CAROLINA ALVARES",favorecido:"CAROLINA CARDOSO ALVARES",meta:12,modalidade:"CLT"},
{item:78,valor:51775,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"UNASUS",descricao:"CONTRATAÇÃO CLT CLAUDIA CORREA",favorecido:"CLAUDIA LOPES CORREA",meta:12,modalidade:"CLT"},
{item:79,valor:41110.65,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"NUGP",descricao:"CONTRATAÇÃO CLT DENIS COSTA",favorecido:"DENIS HENRIQUE COSTA",meta:12,modalidade:"CLT"},
{item:80,valor:47290.5,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"UNASUS",descricao:"CONTRATAÇÃO CLT GIANNI LAROCCA",favorecido:"GIANNI REINALDI LAROCCA",meta:12,modalidade:"CLT"},
{item:81,valor:42774.2,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"UNASUS",descricao:"CONTRATAÇÃO CLT ILMA SANTOS",favorecido:"ILMA FRANCISCA SANTOS",meta:12,modalidade:"CLT"},
{item:82,valor:59727.3,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"GABINETE",descricao:"CONTRATAÇÃO CLT JULIANA STEIMBACK",favorecido:"JULIANA GOMES DOS SANTOS STEIMBACK",meta:12,modalidade:"CLT"},
{item:83,valor:31881.35,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"UNASUS",descricao:"CONTRATAÇÃO CLT KARLA SOUSA",favorecido:"KARLA MARIA PEREIRA SOUSA",meta:12,modalidade:"CLT"},
{item:84,valor:20828.8,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"GESTÃO",descricao:"CONTRATAÇÃO CLT KLEBER CAVALCANTE",favorecido:"KLEBER PASSOS CAVALCANTE",meta:12,modalidade:"CLT"},
{item:85,valor:47115.75,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"GESTÃO",descricao:"CONTRATAÇÃO CLT LEONARDO PAULA",favorecido:"LEONARDO DOS SANTOS DE PAULA",meta:12,modalidade:"CLT"},
{item:86,valor:47290.5,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"UNASUS",descricao:"CONTRATAÇÃO CLT MARIA DAMASCENO",favorecido:"MARIA DAS GRACAS BARROSO DAMASCENO",meta:12,modalidade:"CLT"},
{item:87,valor:59727.3,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"GABINETE",descricao:"CONTRATAÇÃO CLT MEIRILUCI LIMA",favorecido:"MEIRILUCI ALVES LIMA",meta:12,modalidade:"CLT"},
{item:88,valor:62504.6,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"NUGP",descricao:"CONTRATAÇÃO CLT PAULO CUGULA",favorecido:"PAULO ROBERTO CUGULA",meta:12,modalidade:"CLT"},
{item:89,valor:32887.6,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"UNASUS",descricao:"CONTRATAÇÃO CLT POLLYANA PEREIRA",favorecido:"POLLYANA DOS SANTOS PEREIRA",meta:12,modalidade:"CLT"},
{item:90,valor:83536.7,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"UNASUS",descricao:"CONTRATAÇÃO CLT RAFAEL MONTEIRO",favorecido:"RAFAEL DE MEDEIROS MONTEIRO",meta:12,modalidade:"CLT"},
{item:91,valor:40013.25,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"ASCOM",descricao:"CONTRATAÇÃO CLT SERGIO VELHO JR",favorecido:"SERGIO VELHO DA SILVA JUNIOR",meta:12,modalidade:"CLT"},
{item:92,valor:59727.3,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"UNASUS",descricao:"CONTRATAÇÃO CLT SUSANA BELICH",favorecido:"SUSANA DAMASCENO BELICH",meta:12,modalidade:"CLT"},
{item:93,valor:80144.75,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"UNASUS",descricao:"CONTRATAÇÃO CLT SUZANA FRANCO",favorecido:"SUZANA MELO FRANCO",meta:12,modalidade:"CLT"},
{item:94,valor:47115.75,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"AJUR",descricao:"CONTRATAÇÃO CLT THIAGO LIMA",favorecido:"THIAGO FIGUEIREDO DE LIMA",meta:12,modalidade:"CLT"},
{item:95,valor:44583.05,data:"2026-03-18",projeto:"GEREB 008 FIO 25",rubrica:"CLT",area:"NEAD",descricao:"CONTRATAÇÃO CLT VANDO PINTO",favorecido:"VANDO CARVALHO RODRIGUES PINTO",meta:12,modalidade:"CLT"},
{item:96,valor:43021.15,data:"2026-03-18",projeto:"GEREB 023 FIO 23",rubrica:"CLT",area:"NUGP",descricao:"CONTRATAÇÃO CLT ELAINE ROCHA",favorecido:"ELAINE RIBEIRO ROCHA",meta:8,modalidade:"CLT"},
{item:97,valor:46682.65,data:"2026-03-18",projeto:"GEREB 033 FIO 23",rubrica:"CLT",area:"NUGP",descricao:"CONTRATAÇÃO CLT ARIEDNA JESUS",favorecido:"ARIEDNA AZEVEDO DE JESUS",meta:7,modalidade:"CLT"},
{item:98,valor:44843.5,data:"2026-03-18",projeto:"GEREB 033 FIO 23",rubrica:"CLT",area:"NUGP",descricao:"CONTRATAÇÃO CLT ARTHUR LIMA",favorecido:"ARTHUR VIEIRA DE LIMA",meta:7,modalidade:"CLT"},
{item:99,valor:32887.6,data:"2026-03-18",projeto:"GEREB 033 FIO 23",rubrica:"CLT",area:"NUGP",descricao:"CONTRATAÇÃO CLT CAMILA SALGADO",favorecido:"CAMILA LIMA SALGADO DOS SANTOS",meta:7,modalidade:"CLT"},
{item:100,valor:71256.5,data:"2026-03-18",projeto:"GEREB 033 FIO 23",rubrica:"CLT",area:"NUGP",descricao:"CONTRATAÇÃO CLT CRISTIANO COSTA",favorecido:"CRISTIANO GOMES DA COSTA",meta:7,modalidade:"CLT"},
{item:101,valor:52212.6,data:"2026-03-18",projeto:"GEREB 033 FIO 23",rubrica:"CLT",area:"NUGP",descricao:"CONTRATAÇÃO CLT ROSANGELA RIBEIRO",favorecido:"ROSANGELA COSTA RIBEIRO",meta:7,modalidade:"CLT"},
{item:102,valor:25760.1,data:"2026-03-18",projeto:"GEREB 014 FIO 24",rubrica:"CLT",area:"NUSMAD",descricao:"CONTRATAÇÃO CLT CAMILA SELESTINO",favorecido:"CAMILA LINO SELESTINO DA SILVA",meta:10,modalidade:"CLT"},
{item:103,valor:1500,data:"2026-03-23",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 1 MÊS",favorecido:"THAIARA DORNELLES LAGO",meta:3,modalidade:"BOLSA"},
{item:104,valor:1050,data:"2026-03-30",projeto:"GEREB 009 FIO 24",rubrica:"SPCD",area:"PSAT",descricao:"PLANEJAMENTO PEDAGÓGICO",favorecido:"RUBENS MALAQUIAS",meta:3,modalidade:"SPCD"},
{item:105,valor:4926.87,data:"2026-03-23",projeto:"GEREB 031 FIO 23",rubrica:"PASSAGENS",area:"NETHIS",descricao:"LANÇAMENTO COALIZAÇÃO",favorecido:"ROBERTA DE FREITAS CAMPOS",meta:3,modalidade:"PASSAGENS"},
{item:106,valor:570,data:"2026-03-23",projeto:"GEREB 031 FIO 23",rubrica:"DIÁRIAS",area:"NETHIS",descricao:"LANÇAMENTO COALIZAÇÃO",favorecido:"ROBERTA DE FREITAS CAMPOS",meta:3,modalidade:"DIÁRIAS"},
{item:107,valor:4883.88,data:"2026-03-30",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"ASCOM",descricao:"OFICINA OBSMA",favorecido:"ADRIELLY MONIQUE REGO REIS",meta:4,modalidade:"PASSAGENS"},
{item:108,valor:1170,data:"2026-03-30",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"ASCOM",descricao:"OFICINA OBSMA",favorecido:"ADRIELLY MONIQUE REGO REIS",meta:4,modalidade:"DIÁRIAS"},
{item:109,valor:4883.88,data:"2026-03-30",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"ASCOM",descricao:"OFICINA OBSMA",favorecido:"GIOVANNA BRUNA RODRIGUES MARTINS",meta:4,modalidade:"PASSAGENS"},
{item:110,valor:11170,data:"2026-03-30",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"ASCOM",descricao:"OFICINA OBSMA",favorecido:"GIOVANNA BRUNA RODRIGUES MARTINS",meta:4,modalidade:"DIÁRIAS"},
{item:111,valor:4883.88,data:"2026-03-30",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"ASCOM",descricao:"OFICINA OBSMA",favorecido:"FERNANDO DA SILVA PINTO",meta:4,modalidade:"PASSAGENS"},
{item:112,valor:1170,data:"2026-03-30",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"ASCOM",descricao:"OFICINA OBSMA",favorecido:"FERNANDO DA SILVA PINTO",meta:4,modalidade:"DIÁRIAS"},
{item:113,valor:4883.88,data:"2026-03-30",projeto:"GEREB 007 FIO 20",rubrica:"PASSAGENS",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"OFICINA OBSMA",favorecido:"DOUGLAS FERNANDES DA SILVA",meta:4,modalidade:"PASSAGENS"},
{item:114,valor:1170,data:"2026-03-30",projeto:"GEREB 007 FIO 20",rubrica:"DIÁRIAS",area:"ESCOLA DE GOVERNO FIOCRUZ",descricao:"OFICINA OBSMA",favorecido:"DOUGLAS FERNANDES DA SILVA",meta:4,modalidade:"DIÁRIAS"},
{item:115,valor:7620,data:"2026-04-09",projeto:"GEREB 007 FIO 20",rubrica:"SPCD",area:"ASCOM",descricao:"MATERIAL GRÁFICO SEMANA GESTÃO",favorecido:"POSITIVA",meta:4,modalidade:"SPCD"},
{item:116,valor:8928,data:"2026-04-09",projeto:"GEREB 007 FIO 20",rubrica:"SPCD",area:"ASCOM",descricao:"MATERIAL GRÁFICO SEMANA GESTÃO",favorecido:"POSITIVA",meta:4,modalidade:"SPCD"},
{item:117,valor:3297,data:"2026-04-09",projeto:"GEREB 031 FIO 23",rubrica:"SPCD",area:"ASCOM",descricao:"MATERIAL GRÁFICO",favorecido:"POSITIVA",meta:3,modalidade:"SPCD"},
{item:118,valor:533.76,data:"2026-04-14",projeto:"GEREB 023 FIO 23",rubrica:"REEMBOLSO",area:"ASCOM",descricao:"RENOVAÇÃO LICENÇA FLICKR",favorecido:"FLICKR.COM",meta:2,modalidade:"REEMBOLSO"},
{item:119,valor:2000,data:"2026-04-14",projeto:"GEREB 007 FIO 20",rubrica:"SPCD",area:"GESTÃO",descricao:"AQUISIÇÃO DE LIVROS",favorecido:"HY PRODUÇÕES E EVENTOS",meta:4,modalidade:"SPCD"},
{item:120,valor:2000,data:"2026-02-20",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 1 MÊS",favorecido:"VINICIUS VIERA DA SILVA",meta:3,modalidade:"BOLSA"},
{item:121,valor:53900,data:"2026-04-23",projeto:"GEREB 009 FIO 24",rubrica:"BOLSA",area:"PSAT",descricao:"BOLSA - 07 MESES",favorecido:"FATIMA CRISTINA CUNHA MAIA SILVA",meta:3,modalidade:"BOLSA"},
{item:122,valor:4487.13,data:"2026-04-16",projeto:"GEREB 001 FIO 24",rubrica:"PASSAGENS",area:"GABINETE",descricao:"REUNIÃO PRESIDÊNCIA CANAL SAÚDE",favorecido:"MARIA FABIANA DAMÁSIO PASSOS",meta:3,modalidade:"PASSAGENS"},
{item:123,valor:570,data:"2026-04-16",projeto:"GEREB 001 FIO 24",rubrica:"DIÁRIAS",area:"GABINETE",descricao:"REUNIÃO PRESIDÊNCIA",favorecido:"MARIA FABIANA DAMÁSIO PASSOS",meta:3,modalidade:"DIÁRIAS"},
{item:124,valor:3312.27,data:"2026-04-16",projeto:"GEREB 001 FIO 24",rubrica:"PASSAGENS",area:"ASCOM",descricao:"ASSESSORAR DIRETORA",favorecido:"FABIANA MASCARENHAS SANTANA",meta:3,modalidade:"PASSAGENS"},
{item:125,valor:570,data:"2026-04-16",projeto:"GEREB 001 FIO 24",rubrica:"DIÁRIAS",area:"ASCOM",descricao:"ASSESSORAR DIRETORA",favorecido:"FABIANA MASCARENHAS SANTANA",meta:3,modalidade:"DIÁRIAS"},
{item:126,valor:1800.82,data:"2026-04-15",projeto:"GEREB 018 FIO 23",rubrica:"PASSAGENS",area:"GESTÃO",descricao:"SEMANA DE GESTÃO",favorecido:"ROGÉRIO SENA CORADO",meta:3,modalidade:"PASSAGENS"},
{item:127,valor:146000,data:"2026-01-02",projeto:"GEREB 014 FIO 25",rubrica:"BOLSA",area:"NUSMAD",descricao:"BOLSA - 10 MESES",favorecido:"FERNANDA MARIA DUARTE SEVERO",meta:5,modalidade:"BOLSA"},
{item:128,valor:57600,data:"2026-01-02",projeto:"GEREB 018 FIO 23",rubrica:"BOLSA",area:"NUSMAD",descricao:"BOLSA - 06 MESES",favorecido:"JAQUELINE TAVARES DE ASSIS",meta:3,modalidade:"BOLSA"},
{item:129,valor:27000,data:"2026-01-02",projeto:"GEREB 018 FIO 23",rubrica:"BOLSA",area:"NUSMAD",descricao:"BOLSA - 06 MESES",favorecido:"KARINA APARECIDA FIGUEIREDO",meta:3,modalidade:"BOLSA"}
];

// ============================================
// PROJETOS (28 REGISTROS)
// ============================================
const projetos = [
{id:"GEREB-013-FIO-21",numInstrumento:"52/2021",nome:"GESTÃO ESTRATÉGICA PARA ACESSO E QUALIDADE DA ASSISTÊNCIA FARMACÊUTICA NO SUS.",valorTotal:55407026,coordenador:"DANIELLA CRISTINA RODRIGUES PEREIRA",secretarias:"DAF/SCTIE/MS",objeto:"GESTÃO ESTRATÉGICA PARA ACESSO E QUALIDADE DA ASSISTÊNCIA FARMACÊUTICA.",inicio:"2021-12-10",fim:"2025-12-10",saldoDI:0,saldoGeral:-2457850.79},
{id:"GEREB-035-FIO-23",numInstrumento:"79/2023",nome:"CAPACITAÇÃO EM VIGILÂNCIA, PREVENÇÃO E CONTROLE DE ZOONOSES",valorTotal:3000000,coordenador:"KELLEN CRISTINA DA SILVA GASQUE",secretarias:"Secretaria de Vigilância em Saúde e Ambiente - SVSA/MS",objeto:"Capacitação em vigilância, prevenção e controle de zoonoses",inicio:"2023-12-22",fim:"2025-12-22",saldoDI:365263.06,saldoGeral:1619158.39},
{id:"GEREB-055-FIO-24",numInstrumento:"21/2024",nome:"AÇÕES DE PROMOÇÃO DA POLÍTICA NACIONAL DE EDUCAÇÃO POPULAR EM SAÚDE NO SUS",valorTotal:7000000,coordenador:"OSVALDO PERALTA BONETTI",secretarias:"Coordenação-Geral de Articulação Interfederativa e Participativa (CGAIP)",objeto:"Promoção da Política Nacional de Educação Popular em Saúde",inicio:"2024-08-20",fim:"2026-08-20",saldoDI:31893.12,saldoGeral:669755.44},
{id:"GEREB-010-FIO-24",numInstrumento:"137/2023",nome:"FORMAÇÃO EM POLÍTICAS PÚBLICAS DE SAÚDE NA ÁREA DE AVALIAÇÃO DE TECNOLOGIAS EM SAÚDE",valorTotal:2461725,coordenador:"FLÁVIA TAVARES SILVA ELIAS",secretarias:"Secretaria de Inovação e Saúde Digital - SEIDIGI/MS",objeto:"Formação em Avaliação de Tecnologias em Saúde",inicio:"2024-01-12",fim:"2026-07-12",saldoDI:69117.39,saldoGeral:1371932.26},
{id:"GEREB-033-FIO-23",numInstrumento:"55/2023",nome:"DESENVOLVIMENTO DE AÇÕES ESTRATÉGICAS DE PREPARAÇÃO E RESPOSTA ÀS EMERGÊNCIAS EM SAÚDE PÚBLICA",valorTotal:40991199,coordenador:"MÁRCIO ALDRIN FRANÇA CAVALCANTE",secretarias:"Secretaria de Vigilância em Saúde e Ambiente - SVSA/MS",objeto:"Preparação e resposta a emergências em saúde pública",inicio:"2023-12-21",fim:"2028-12-21",saldoDI:0,saldoGeral:-153274.19},
{id:"GEREB-029-FIO-23",numInstrumento:"39/2023",nome:"INTELIGÊNCIA ESTRATÉGICA NA TRANSFORMAÇÃO DIGITAL EM SAÚDE",valorTotal:5000000,coordenador:"WAGNER DE JESUS MARTINS",secretarias:"Departamento de Monitoramento e disseminação de informações - Seidigi/MS",objeto:"Inteligência estratégica para transformação digital em saúde",inicio:"2023-12-14",fim:"2027-12-14",saldoDI:11912.61,saldoGeral:250165.68},
{id:"GEREB-005-FIO-25",numInstrumento:"137/2024",nome:"PERIFERIA SAUDÁVEL, SUSTENTÁVEL E SOLIDÁRIA",valorTotal:50000000,coordenador:"WAGNER DE JESUS MARTINS",secretarias:"Secretária Executiva – SE",objeto:"Desenvolvimento territorial solidário e sustentável em periferias",inicio:"2025-01-06",fim:"2028-01-06",saldoDI:7394.06,saldoGeral:155701.23},
{id:"GEREB-061-FIO-24",numInstrumento:"55/2024",nome:"ESTUDO PARA ATUALIZAÇÃO DA POLÍTICA NACIONAL DE ATENÇÃO INTEGRAL DA SAÚDE DA MULHER",valorTotal:4024057,coordenador:"ANA CONCEIÇÃO RIBEIRO DANTAS SATURNINO",secretarias:"Secretária de Atenção Primária à Saúde - SAPS",objeto:"Atualização da PNAISM",inicio:"2024-12-11",fim:"2026-04-11",saldoDI:1851.13,saldoGeral:40325.44},
{id:"GEREB-022-FIO-20",numInstrumento:"109/2020",nome:"EDUCAÇÃO PARA O DESENVOLVIMENTO DOS SERVIDORES PÚBLICOS FEDERAIS DO MINISTÉRIO DA SAÚDE",valorTotal:4291963,coordenador:"LUCIANA SEPÚLVEDA KOPTCKE",secretarias:"Subsecretaria de Assuntos Administravos - COGEP - DIEDEP",objeto:"Capacitação de servidores públicos federais",inicio:"2020-12-29",fim:"2025-12-01",saldoDI:5759.33,saldoGeral:151182.33},
{id:"GEREB-013-FIO-24",numInstrumento:"142/2023",nome:"FORTALECIMENTO DO ACESSO A PLANTAS MEDICINAIS E FITOTERÁPICOS NO SUS",valorTotal:9000000,coordenador:"WAGNER DE JESUS MARTINS",secretarias:"DAF/SCTIE/MS",objeto:"Fortalecimento da Política Nacional de Plantas Medicinais",inicio:"2024-01-24",fim:"2028-01-24",saldoDI:7491.84,saldoGeral:157328.56},
{id:"GEREB-021-FIO-23",numInstrumento:"010/2023",nome:"FORTALECIMENTO DO PROGRAMA DE TREINAMENTO EM EPIDEMIOLOGIA APLICADA AOS SERVIÇOS DO SUS",valorTotal:4500000,coordenador:"NOELY FABIANA OLIVEIRA DE MOURA",secretarias:"Secretaria de Vigilância em Saúde e Ambiente - SVSA",objeto:"Treinamento em epidemiologia aplicada",inicio:"2023-11-29",fim:"2027-11-29",saldoDI:111877.2,saldoGeral:2349421.22},
{id:"GEREB-023-FIO-23",numInstrumento:"37/2023",nome:"IMPLEMENTAÇÃO DE MODELO DE GOVERNANÇA E GESTÃO DAS COOPERAÇÕES TÉCNICAS",valorTotal:60352517,coordenador:"MÁRCIO ALDRIN FRANÇA CAVALCANTE",secretarias:"Departamento de Cooperação Técnica e Desenvolvimento em Saúde - DECOOP",objeto:"Governança e gestão de cooperações técnicas",inicio:"2023-11-29",fim:"2027-11-29",saldoDI:370502.98,saldoGeral:7780562.11},
{id:"GEREB-018-FIO-25",numInstrumento:"153/2024",nome:"EDUCAÇÃO PERMANENTE EM SAÚDE: CAPACITAÇÃO DE TRABALHADORES, GESTORES E USUÁRIOS DO SUS",valorTotal:34797400,coordenador:"LUCIANA REZENDE DA SILVA GARCEZ",secretarias:"Secretaria de Gestão do Trabalho e da Educação na Saúde - SGTES",objeto:"Educação permanente em saúde",inicio:"2025-03-12",fim:"2029-03-12",saldoDI:125400.31,saldoGeral:4431925.39},
{id:"GEREB-009-FIO-24",numInstrumento:"168/2023",nome:"TERRITÓRIOS SAUDÁVEIS E SUSTENTÁVEIS NA PROMOÇÃO DO CUIDADO",valorTotal:24300010,coordenador:"ANDRE LUIZ DUTRA FENNER",secretarias:"Departamento de Promoção da Saúde / SAPS",objeto:"Promoção de territórios saudáveis e sustentáveis",inicio:"2024-01-12",fim:"2028-01-12",saldoDI:419436.57,saldoGeral:8808169.74},
{id:"GEREB-008-FIO-24",numInstrumento:"108/2023",nome:"QUALIFICAÇÃO DO CADASTRO NACIONAL DE ESTABELECIMENTOS DE SAÚDE (CNES)",valorTotal:5123000,coordenador:"OSVALDO PERALTA BONETTI",secretarias:"Secretaria de Gestão do Trabalho e da Educação na Saúde (SGTES)",objeto:"Qualificação do CNES",inicio:"2024-01-10",fim:"2026-01-10",saldoDI:9134.67,saldoGeral:191828.07},
{id:"GEREB-011-FIO-24",numInstrumento:"120/2023",nome:"DIAGNÓSTICO E ANÁLISE DA TRANSFORMAÇÃO DIGITAL EM SAÚDE NO BRASIL",valorTotal:1850253,coordenador:"MANOEL DE ARAÚJO AMORIM",secretarias:"Secretaria de Inovação e Saúde Digital - SEIDIGI/MS",objeto:"Diagnóstico da transformação digital em saúde",inicio:"2024-01-16",fim:"2025-07-16",saldoDI:528.77,saldoGeral:14336.93},
{id:"GEREB-021-FIO-22",numInstrumento:"25/2022",nome:"APRIMORAMENTO, QUALIFICAÇÃO E GESTÃO DE VIGILÂNCIA LABORATORIAL",valorTotal:1500000,coordenador:"NOELY FABIANA OLIVEIRA DE MOURA",secretarias:"SVS – Departamento de Articulação Estratégica de Vigilância em Saúde / DAEVS",objeto:"Aprimoramento da vigilância laboratorial",inicio:"2022-09-02",fim:"2025-07-20",saldoDI:581.72,saldoGeral:12216.14},
{id:"GEREB-008-FIO-25",numInstrumento:"148/2024",nome:"APOIO E FOMENTO AO DESENVOLVIMENTO DE SERVIÇOS, AÇÕES, ESTUDOS E INFORMAÇÕES ESTRATÉGICAS",valorTotal:137366000,coordenador:"LUCIANA REZENDE DA SILVA GARCEZ",secretarias:"Secretaria de Gestão do Trabalho e da Educação na Saúde - SGTES",objeto:"Apoio ao desenvolvimento de serviços e informações estratégicas",inicio:"2025-01-06",fim:"2029-01-06",saldoDI:60772.92,saldoGeral:3078837.32},
{id:"GEREB-008-FIO-20",numInstrumento:"50/2020",nome:"GESTÃO E GOVERNANÇA NO CAMPO DA CIÊNCIA, TECNOLOGIA E INOVAÇÃO EM SAÚDE",valorTotal:27103328,coordenador:"JOSE ANTONIO SILVESTRE FERNANDES NETO",secretarias:"Secretaria de Ciência, Tecnologia, Inovação e Insumos Estratégicos - SCTIE",objeto:"Gestão e governança em CT&IS",inicio:"2020-08-12",fim:"2025-08-05",saldoDI:0,saldoGeral:-54442.67},
{id:"GEREB-037-FIO-23",numInstrumento:"65/2023",nome:"PROJETO DE PESQUISA APLICADO À INOVAÇÃO NOS PROCESSOS DE AUDITORIA DO SUS",valorTotal:19594720,coordenador:"WAGNER DE JESUS MARTINS",secretarias:"Gabinete do Ministério da Saúde",objeto:"Inovação nos processos de auditoria do SUS",inicio:"2023-12-22",fim:"2027-07-22",saldoDI:52151.72,saldoGeral:1095186.85},
{id:"GEREB-012-FIO-24",numInstrumento:"166/2023",nome:"ESTRATÉGIA DE ENFRENTAMENTO AO RACISMO NA SAÚDE",valorTotal:32210366,coordenador:"DENISE OLIVEIRA E SILVA",secretarias:"Secretaria Executiva/MS",objeto:"Enfrentamento ao racismo na saúde",inicio:"2024-01-24",fim:"2027-01-24",saldoDI:1149.22,saldoGeral:24148.7},
{id:"GEREB-024-FIO-22",numInstrumento:"14/2022",nome:"PROGRAMA DE FORMAÇÃO A DISTÂNCIA PARA PROFISSIONAIS E GESTORES DO SUS",valorTotal:2826360,coordenador:"KELLEN CRISTINA DA SILVA GASQUE",secretarias:"Secretaria de Atenção Primária à Saúde (COGE/SAPS)",objeto:"Formação a distância para profissionais e gestores",inicio:"2022-09-15",fim:"2026-02-04",saldoDI:21792.62,saldoGeral:462026.41},
{id:"GEREB-003-FIO-24",numInstrumento:"82/2023",nome:"FORTALECIMENTO DO CENTRO NACIONAL DE INTELIGÊNCIA EPIDEMIOLÓGICA",valorTotal:15200000,coordenador:"NOELY FABIANA OLIVEIRA DE MOURA",secretarias:"Secretaria de Vigilância em Saúde e Ambiente - SVSA",objeto:"Fortalecimento do CNIE",inicio:"2024-01-03",fim:"2029-01-03",saldoDI:228066.27,saldoGeral:4789391.55},
{id:"GEREB-018-FIO-23",numInstrumento:"15/2023",nome:"APRIMORAMENTO DAS PRÁTICAS INSTITUCIONAIS NO ÂMBITO DO MINISTÉRIO DA SAÚDE",valorTotal:183000000,coordenador:"JOSE ANTONIO SILVESTRE FERNANDES NETO",secretarias:"SAA - Subsecretaria de Assuntos Administrativos",objeto:"Aprimoramento de práticas institucionais",inicio:"2023-09-27",fim:"2028-09-27",saldoDI:294674.98,saldoGeral:6594876.8},
{id:"GEREB-031-FIO-23",numInstrumento:"63/2023",nome:"PROGRAMA DE FORMAÇÃO DE AGENTES EDUCADORAS/ES POPULARES DE SAÚDE",valorTotal:23698852,coordenador:"OSVALDO PERALTA BONETTI",secretarias:"Secretaria de Gestão do Trabalho e da Educação na Saúde - SGTES",objeto:"Formação de agentes educadores populares de saúde",inicio:"2023-12-21",fim:"2025-12-21",saldoDI:14062.06,saldoGeral:296662.67},
{id:"GEREB-002-FIO-24",numInstrumento:"64/2023",nome:"O ENSINO DA SAÚDE DIGITAL NO BRASIL",valorTotal:2176078,coordenador:"DÉBORA DUPAS GONÇALVES DO NASCIMENTO",secretarias:"Gestão de Ensino/MS",objeto:"Estudo sobre ensino da saúde digital no Brasil",inicio:"2023-12-28",fim:"2025-12-28",saldoDI:12072.09,saldoGeral:721542.07},
{id:"GEREB-007-FIO-20",numInstrumento:"49/2020",nome:"FORTALECIMENTO DA VIGILÂNCIA DAS INFECÇÕES CRÔNICAS E IST",valorTotal:35000000,coordenador:"NOELY FABIANA OLIVEIRA DE MOURA",secretarias:"Secretaria de Vigilância em Saúde e Ambiente - SVSA",objeto:"Vigilância de infecções crônicas e IST",inicio:"2020-07-29",fim:"2026-07-02",saldoDI:22746.48,saldoGeral:558246.34}
];

// ============================================
// CÓDIGO PRINCIPAL DO DASHBOARD
// ============================================
let dadosFiltrados = [...gastos];
let chartRanking = null, chartRubrica = null, chartAreaRubric = null, tabelaGastos = null;

function atualizarRanking() {
    const mapa = new Map();
    dadosFiltrados.forEach(item => mapa.set(item.projeto, (mapa.get(item.projeto) || 0) + item.valor));
    const ordenado = Array.from(mapa.entries()).sort((a,b) => b[1] - a[1]).slice(0,10);
    if (chartRanking) chartRanking.destroy();
    const ctx = document.getElementById("rankingAllProjectsChart").getContext("2d");
    chartRanking = new Chart(ctx, {
        type: "bar",
        data: { labels: ordenado.map(p => p[0]), datasets: [{ label: "", data: ordenado.map(p => p[1]), backgroundColor: "#18745b", borderRadius: 2 }] },
        plugins: [barValueLabels],
        options: { indexAxis: "y", responsive: true, maintainAspectRatio: true, layout: { padding: { right: 72 } }, scales: { x: { beginAtZero: true, border: { display: false }, grid: { color: "#edf0ef" }, ticks: { callback: value => compactCurrency(value) } }, y: { border: { display: false }, grid: { display: false } } }, plugins: { legend: { display: false }, tooltip: { displayColors: false, callbacks: { label: ctx => fmt(ctx.raw) } } } }
    });
}

function atualizarRankingSaldo() {
    const container = document.getElementById("rankingSaldoList");
    const comSaldo = projetos.filter(p => p.saldoDI > 0).sort((a,b) => b.saldoDI - a.saldoDI).slice(0,5);
    if (!container) return;
    if (comSaldo.length === 0) container.innerHTML = "<div class='ranking-item'>Nenhum projeto com saldo DI positivo.</div>";
    else container.innerHTML = comSaldo.map((p, i) => `<div class="ranking-item"><div class="ranking-position">${String(i + 1).padStart(2, "0")}</div><div class="ranking-info"><div class="ranking-projeto">${p.id}</div><div class="ranking-value">${fmt(p.saldoDI)}</div></div></div>`).join('');
}

function atualizarRubrica() {
    const mapa = new Map();
    dadosFiltrados.forEach(item => mapa.set(item.rubrica, (mapa.get(item.rubrica) || 0) + item.valor));
    if (chartRubrica) chartRubrica.destroy();
    const ctx = document.getElementById("rubricChart").getContext("2d");
    chartRubrica = new Chart(ctx, {
        type: "doughnut",
        data: { labels: Array.from(mapa.keys()), datasets: [{ data: Array.from(mapa.values()), backgroundColor: CHART_COLORS, borderColor: "#ffffff", borderWidth: 2 }] },
        plugins: [doughnutCenterText],
        options: { cutout: "70%", radius: "88%", plugins: { legend: { position: "bottom", labels: { usePointStyle: true, pointStyle: "rectRounded", padding: 16, boxWidth: 9, boxHeight: 9 } }, tooltip: { displayColors: false, callbacks: { label: ctx => { const total = ctx.dataset.data.reduce((sum, value) => sum + value, 0); const percentage = total ? (ctx.raw / total * 100).toLocaleString("pt-BR", {maximumFractionDigits: 1}) : 0; return `${ctx.label}: ${fmt(ctx.raw)} · ${percentage}%`; } } } } }
    });
}

function atualizarAreaRubric() {
    const areaMap = new Map();
    dadosFiltrados.forEach(item => {
        if (!areaMap.has(item.area)) areaMap.set(item.area, new Map());
        areaMap.get(item.area).set(item.rubrica, (areaMap.get(item.area).get(item.rubrica) || 0) + item.valor);
    });
    const areas = Array.from(areaMap.entries())
        .sort((a, b) => Array.from(b[1].values()).reduce((sum, value) => sum + value, 0) - Array.from(a[1].values()).reduce((sum, value) => sum + value, 0))
        .map(([area]) => area);
    const areaLabels = areas.map(area => {
        const words = area.split(" ");
        const lines = [];
        words.forEach(word => {
            const current = lines.at(-1);
            if (!current || `${current} ${word}`.length > 16) lines.push(word);
            else lines[lines.length - 1] = `${current} ${word}`;
        });
        return lines;
    });
    const rubricas = [...new Set(dadosFiltrados.map(i => i.rubrica))];
    const datasets = rubricas.map((rub, index) => ({ label: rub, data: areas.map(area => areaMap.get(area)?.get(rub) || 0), backgroundColor: AREA_CHART_COLORS[index % AREA_CHART_COLORS.length], hoverBackgroundColor: AREA_CHART_COLORS[index % AREA_CHART_COLORS.length], borderColor: "#ffffff", borderWidth: 1, borderRadius: 2, stack: "stack0" }));
    if (chartAreaRubric) chartAreaRubric.destroy();
    const ctx = document.getElementById("areaRubricChart").getContext("2d");
    chartAreaRubric = new Chart(ctx, {
        type: "bar",
        data: { labels: areaLabels, datasets: datasets },
        options: { responsive: true, maintainAspectRatio: true, aspectRatio: 2.8, scales: { x: { stacked: true, border: { display: false }, grid: { display: false }, ticks: { autoSkip: false, maxRotation: 0, minRotation: 0, font: { size: 9 } } }, y: { stacked: true, beginAtZero: true, border: { display: false }, grid: { color: "#edf0ef" }, ticks: { callback: value => compactCurrency(value) } } }, plugins: { legend: { position: "top", align: "end", labels: { usePointStyle: true, pointStyle: "rectRounded", padding: 16, boxWidth: 9, boxHeight: 9 } }, tooltip: { displayColors: true, callbacks: { title: items => areas[items[0].dataIndex], label: ctx => `${ctx.dataset.label}: ${fmt(ctx.raw)}` } } } }
    });
}

function configurarModalProjetos() {
    const modal = document.getElementById("projects-modal");
    const openButton = document.getElementById("open-projects-modal");
    const closeButton = document.getElementById("close-projects-modal");
    const searchInput = document.getElementById("projects-search");
    const tableBody = document.getElementById("projects-table-body");
    const count = document.getElementById("projects-count");
    let previousFocus = null;

    const escapeHtml = value => String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

    const normalize = value => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    const sortedProjects = [...projetos].sort((a, b) => b.saldoDI - a.saldoDI);

    function renderProjects(query = "") {
        const term = normalize(query.trim());
        const filtered = term ? sortedProjects.filter(project => normalize(`${project.id} ${project.nome} ${project.coordenador} ${project.numInstrumento}`).includes(term)) : sortedProjects;
        count.textContent = `${filtered.length} ${filtered.length === 1 ? "projeto" : "projetos"}`;
        tableBody.innerHTML = filtered.length ? filtered.map(project => `
            <tr>
                <td class="project-code">${escapeHtml(project.id)}</td>
                <td class="project-name">${escapeHtml(project.nome)}</td>
                <td class="money">${fmt(project.valorTotal)}</td>
                <td class="money ${project.saldoDI < 0 ? "negative" : "positive"}">${fmt(project.saldoDI)}</td>
                <td class="money ${project.saldoGeral < 0 ? "negative" : "positive"}">${fmt(project.saldoGeral)}</td>
                <td class="term">${dat(project.inicio)} – ${dat(project.fim)}</td>
            </tr>`).join("") : '<tr><td class="no-projects" colspan="6">Nenhum projeto encontrado.</td></tr>';
    }

    function openModal() {
        previousFocus = document.activeElement;
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        renderProjects();
        requestAnimationFrame(() => searchInput.focus());
    }

    function closeModal() {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        searchInput.value = "";
        previousFocus?.focus();
    }

    renderProjects();
    openButton.addEventListener("click", openModal);
    closeButton.addEventListener("click", closeModal);
    searchInput.addEventListener("input", event => renderProjects(event.target.value));
    modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
    document.addEventListener("keydown", event => { if (event.key === "Escape" && modal.classList.contains("is-open")) closeModal(); });
}

function configurarModalAreas() {
    const modal = document.getElementById("area-modal");
    const openButton = document.getElementById("open-area-modal");
    const closeButton = document.getElementById("close-area-modal");
    const searchInput = document.getElementById("area-search");
    const tableHead = document.getElementById("area-detail-head");
    const tableBody = document.getElementById("area-detail-body");
    const tableFoot = document.getElementById("area-detail-foot");
    const count = document.getElementById("area-count");
    let previousFocus = null;

    const normalize = value => String(value ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

    function getSummary() {
        const modalities = [...new Set(dadosFiltrados.map(item => item.rubrica))].sort();
        const map = new Map();
        dadosFiltrados.forEach(item => {
            if (!map.has(item.area)) map.set(item.area, new Map());
            map.get(item.area).set(item.rubrica, (map.get(item.area).get(item.rubrica) || 0) + item.valor);
        });
        const rows = Array.from(map.entries()).map(([area, values]) => ({ area, values, total: Array.from(values.values()).reduce((sum, value) => sum + value, 0) })).sort((a, b) => b.total - a.total);
        return {modalities, rows, total: rows.reduce((sum, row) => sum + row.total, 0)};
    }

    function renderAreas(query = "") {
        const {modalities, rows, total} = getSummary();
        const term = normalize(query.trim());
        const filtered = term ? rows.filter(row => normalize(row.area).includes(term)) : rows;
        count.textContent = `${filtered.length} ${filtered.length === 1 ? "área" : "áreas"}`;
        tableHead.innerHTML = `<tr><th>Área demandante</th>${modalities.map(modality => `<th>${modality}</th>`).join("")}<th>Total</th><th>Participação</th></tr>`;
        tableBody.innerHTML = filtered.length ? filtered.map(row => `<tr><td class="project-code area-cell">${row.area}</td>${modalities.map(modality => `<td class="money">${row.values.get(modality) ? fmt(row.values.get(modality)) : "—"}</td>`).join("")}<td class="money area-row-total">${fmt(row.total)}</td><td class="money">${total ? (row.total / total * 100).toLocaleString("pt-BR", {maximumFractionDigits: 1}) : 0}%</td></tr>`).join("") : `<tr><td class="no-projects" colspan="${modalities.length + 3}">Nenhuma área encontrada.</td></tr>`;
        tableFoot.innerHTML = `<tr><td>Total geral</td>${modalities.map(modality => `<td>${fmt(rows.reduce((sum, row) => sum + (row.values.get(modality) || 0), 0))}</td>`).join("")}<td>${fmt(total)}</td><td>100%</td></tr>`;
    }

    function openModal() {
        previousFocus = document.activeElement;
        renderAreas();
        modal.classList.add("is-open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");
        requestAnimationFrame(() => searchInput.focus());
    }

    function closeModal() {
        modal.classList.remove("is-open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        searchInput.value = "";
        previousFocus?.focus();
    }

    renderAreas();
    openButton.addEventListener("click", openModal);
    closeButton.addEventListener("click", closeModal);
    searchInput.addEventListener("input", event => renderAreas(event.target.value));
    modal.addEventListener("click", event => { if (event.target === modal) closeModal(); });
    document.addEventListener("keydown", event => { if (event.key === "Escape" && modal.classList.contains("is-open")) closeModal(); });
}

function atualizarKPIs() {
    const totalGasto = dadosFiltrados.reduce((acc, i) => acc + i.valor, 0);
    const projetosOnerados = new Set(dadosFiltrados.map(i => i.projeto)).size;
    const mapaProjetos = new Map();
    dadosFiltrados.forEach(i => mapaProjetos.set(i.projeto, (mapaProjetos.get(i.projeto) || 0) + i.valor));
    const topProjeto = Array.from(mapaProjetos.entries()).sort((a,b) => b[1] - a[1])[0];
    document.getElementById("kpiContainer").innerHTML = `
        <div class="kpi-card"><div class="kpi-title">Total gasto em 2026</div><div class="kpi-value">${fmt(totalGasto)}</div></div>
        <div class="kpi-card"><div class="kpi-title">Projeto com maior gasto</div><div class="kpi-value">${topProjeto ? topProjeto[0] : "N/A"}<br>${topProjeto ? fmt(topProjeto[1]) : ""}</div></div>
        <div class="kpi-card"><div class="kpi-title">Saldo total DI dos projetos<br>Caixa Fiotec · 24/04/2026</div><div class="kpi-value">${fmt(TOTAL_SALDO_DI)}</div></div>
        <div class="kpi-card"><div class="kpi-title">Saldo total geral disponível<br>Caixa Fiotec · 24/04/2026</div><div class="kpi-value">${fmt(TOTAL_SALDO_GERAL)}</div></div>
        <div class="kpi-card"><div class="kpi-title">Projetos onerados</div><div class="kpi-value">${projetosOnerados}</div></div>
    `;
}

function atualizarTabela() {
    if (tabelaGastos) tabelaGastos.destroy();
    tabelaGastos = new Tabulator("#gastos-table", {
        data: dadosFiltrados,
        columns: [
            { title: "Descrição", field: "descricao", width: 300, headerFilter: "input" },
            { title: "Valor (R$)", field: "valor", width: 120, formatter: cell => fmt(cell.getValue()), headerFilter: "input" },
            { title: "Área Demandante", field: "area", width: 180, headerFilter: "input" },
            { title: "Favorecido", field: "favorecido", width: 220, headerFilter: "input" },
            { title: "Projeto", field: "projeto", width: 150, headerFilter: "input" },
            { title: "Meta", field: "meta", width: 80, headerFilter: "input" },
            { title: "Modalidade", field: "modalidade", width: 120, headerFilter: "input" },
            { title: "Rubrica", field: "rubrica", width: 120, headerFilter: "input" }
        ],
        layout: "fitColumns",
        pagination: "local",
        paginationSize: 15,
        height: "500px"
    });
}

function atualizarTudo() {
    atualizarKPIs();
    atualizarRanking();
    atualizarRubrica();
    atualizarAreaRubric();
    atualizarTabela();
    atualizarRankingSaldo();
}

function aplicarFiltros() {
    let resultado = [...gastos];
    const projeto = document.getElementById("filter-projeto").value;
    const rubrica = document.getElementById("filter-rubrica").value;
    const area = document.getElementById("filter-area").value;
    const favorecido = document.getElementById("filter-favorecido").value;
    const dataInicio = document.getElementById("data-inicio").value;
    const dataFim = document.getElementById("data-fim").value;
    if (projeto) resultado = resultado.filter(i => i.projeto === projeto);
    if (rubrica) resultado = resultado.filter(i => i.rubrica === rubrica);
    if (area) resultado = resultado.filter(i => i.area === area);
    if (favorecido) resultado = resultado.filter(i => i.favorecido === favorecido);
    if (dataInicio) resultado = resultado.filter(i => i.data >= dataInicio);
    if (dataFim) resultado = resultado.filter(i => i.data <= dataFim);
    dadosFiltrados = resultado;
    atualizarTudo();
}

function resetFiltros() {
    document.getElementById("filter-projeto").value = "";
    document.getElementById("filter-rubrica").value = "";
    document.getElementById("filter-area").value = "";
    document.getElementById("filter-favorecido").value = "";
    document.getElementById("data-inicio").value = "";
    document.getElementById("data-fim").value = "";
    dadosFiltrados = [...gastos];
    atualizarTudo();
}

function exportarCSV() {
    if (!tabelaGastos) return;
    const data = tabelaGastos.getData();
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "gastos_di_2026_filtrados.csv";
    link.click();
}

function carregarFiltros() {
    const projetosUnicos = [...new Set(gastos.map(g => g.projeto))].sort();
    const rubricasUnicas = [...new Set(gastos.map(g => g.rubrica))].sort();
    const areasUnicas = [...new Set(gastos.map(g => g.area))].sort();
    const favorecidosUnicos = [...new Set(gastos.map(g => g.favorecido))].sort();
    document.getElementById("filter-projeto").innerHTML = '<option value="">Todos</option>' + projetosUnicos.map(p => `<option value="${p}">${p}</option>`).join('');
    document.getElementById("filter-rubrica").innerHTML = '<option value="">Todas</option>' + rubricasUnicas.map(r => `<option value="${r}">${r}</option>`).join('');
    document.getElementById("filter-area").innerHTML = '<option value="">Todas</option>' + areasUnicas.map(a => `<option value="${a}">${a}</option>`).join('');
    document.getElementById("filter-favorecido").innerHTML = '<option value="">Todos</option>' + favorecidosUnicos.map(f => `<option value="${f}">${f}</option>`).join('');
}

function configurarDetalhesProjeto() {
    const projSelect = document.getElementById("projetoDetalhesSelect");
    const instSelect = document.getElementById("instrumentoDetalhesSelect");
    projSelect.innerHTML = '<option value="">-- Selecione um projeto --</option>';
    projetos.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p.id;
        opt.textContent = `${p.id} - ${p.nome.substring(0,60)}${p.nome.length > 60 ? "..." : ""}`;
        projSelect.appendChild(opt);
    });
    const instSet = new Set();
    projetos.forEach(p => { if (p.numInstrumento) instSet.add(p.numInstrumento); });
    instSelect.innerHTML = '<option value="">-- Selecione um número --</option>';
    Array.from(instSet).sort().forEach(num => {
        const opt = document.createElement("option");
        opt.value = num;
        opt.textContent = num;
        instSelect.appendChild(opt);
    });
    function mostrarDetalhes() {
        const projId = projSelect.value;
        const instNum = instSelect.value;
        let projeto = null;
        if (projId) projeto = projetos.find(p => p.id === projId);
        else if (instNum) projeto = projetos.find(p => p.numInstrumento === instNum);
        if (projeto) {
            if (projSelect.value !== projeto.id) projSelect.value = projeto.id;
            if (instSelect.value !== projeto.numInstrumento) instSelect.value = projeto.numInstrumento;
            document.getElementById("projetoInfoContainer").style.display = "block";
            document.getElementById("projetoInfoGrid").innerHTML = `
                <div class="info-card"><div class="info-label">IDENTIFICAÇÃO DO PROJETO FIOTEC</div><div class="info-value">${projeto.id}</div></div>
                <div class="info-card"><div class="info-label">NÚMERO DO INSTRUMENTO</div><div class="info-value">${projeto.numInstrumento || "Não informado"}</div></div>
                <div class="info-card"><div class="info-label">NOME DO PROJETO</div><div class="info-value">${projeto.nome}</div></div>
                <div class="info-card"><div class="info-label">VALOR TOTAL DO PROJETO</div><div class="info-value">${fmt(projeto.valorTotal)}</div></div>
                <div class="info-card"><div class="info-label">COORDENADOR</div><div class="info-value">${projeto.coordenador}</div></div>
                <div class="info-card"><div class="info-label">SECRETARIAS</div><div class="info-value">${projeto.secretarias || "Não informada"}</div></div>
                <div class="info-card"><div class="info-label">INÍCIO DA VIGÊNCIA</div><div class="info-value">${dat(projeto.inicio)}</div></div>
                <div class="info-card"><div class="info-label">FINAL DA VIGÊNCIA</div><div class="info-value">${dat(projeto.fim)}</div></div>
                <div class="info-card"><div class="info-label">SALDO DI DISPONÍVEL NO MOMENTO</div><div class="info-value">${fmt(projeto.saldoDI)}</div></div>
                <div class="info-card objeto-text"><div class="info-label">OBJETO DO PROJETO</div><div class="info-value large">${projeto.objeto}</div></div>
            `;
        } else {
            document.getElementById("projetoInfoContainer").style.display = "none";
        }
    }
    projSelect.addEventListener("change", mostrarDetalhes);
    instSelect.addEventListener("change", mostrarDetalhes);
}

document.addEventListener("DOMContentLoaded", () => {
    carregarFiltros();
    configurarDetalhesProjeto();
    configurarModalProjetos();
    configurarModalAreas();
    atualizarTudo();
    document.getElementById("aplicar-filtros").addEventListener("click", aplicarFiltros);
    document.getElementById("reset-filtros").addEventListener("click", resetFiltros);
    document.getElementById("export-csv").addEventListener("click", exportarCSV);
});
