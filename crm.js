// ==========================================================================
// LIVING4MALAGA INVESTOR CRM - LÓGICA DE CONTROLADOR PRINCIPAL
// ==========================================================================

// Leads Semilla de Demostración Corporativa
const CRM_SEED_LEADS = [
    {
        id: "lead_corp_1",
        name: "María Teresa Ortega",
        email: "m.ortega.inversiones@gmail.com",
        phone: "+34 622 455 677",
        language: "ES",
        stage: "form2",
        status: "Inversión Activa",
        createdAt: "2026-05-22T09:15:00.000Z",
        updatedAt: "2026-05-24T12:30:00.000Z",
        wpData: {
            tipo_operacion: "Inversión",
            zona: "Málaga Capital",
            budget_raw: "Dispongo de 450.000€ propios"
        },
        tallyData: {
            purchaseType: "Inversión",
            timeline: "Lo antes posible",
            areaDetail: "Centro Histórico, Malagueta, Soho",
            propertyType: "Ático",
            bedrooms: "2",
            extras: ["Terraza", "Vistas al mar", "Parking"],
            budgetRange: "400.000€ - 700.000€",
            financing: "No"
        },
        notes: "Perfil Excelente. Viene recomendada. Quiere comprar dos apartamentos pequeños o un ático en el centro para alquiler de corta temporada gestionado por Living4malaga. Reserva firmada.",
        history: [
            { date: "2026-05-22T09:15:00.000Z", label: "Paso 1 Completado", desc: "Completó el Paso 1 en la página /invertir/ (ES)." },
            { date: "2026-05-22T09:17:00.000Z", label: "Paso 2 Completado", desc: "Completó el perfil inversor avanzado en la misma pantalla. Fusión instantánea en CRM." },
            { date: "2026-05-23T10:00:00.000Z", label: "Llamada comercial", desc: "Asignado asesor. Agendadas visitas para ver inmuebles." },
            { date: "2026-05-24T12:30:00.000Z", label: "Reserva Confirmada", desc: "Reserva de ático en Malagueta firmada con éxito. Estado: Inversión Activa." }
        ]
    },
    {
        id: "lead_corp_2",
        name: "David H. Vance",
        email: "d.vance.invest@luxuryhomes.com",
        phone: "+44 7700 900077",
        language: "EN",
        stage: "form2",
        status: "Bajo Análisis",
        createdAt: "2026-05-26T16:40:00.000Z",
        updatedAt: "2026-05-26T16:45:00.000Z",
        wpData: {
            tipo_operacion: "Second home",
            zona: "Costa del Sol",
            budget_raw: "Up to 380,000 Euros, cash buyer"
        },
        tallyData: {
            purchaseType: "Second home",
            timeline: "Within the next 3-6 months",
            areaDetail: "Nerja, Rincón de la Victoria, Torrox",
            propertyType: "Villa / Detached house",
            bedrooms: "3",
            extras: ["Pool", "Terrace", "Garden"],
            budgetRange: "€200,000 - €400,000",
            financing: "No"
        },
        notes: "Inversor británico. Busca segunda residencia en el este de Málaga (Axarquía). Valora mucho las vistas y el jardín. Sin necesidad de hipoteca.",
        history: [
            { date: "2026-05-26T16:40:00.000Z", label: "Step 1 Completed", desc: "Completed basic step on WordPress /invertir/ page (EN)." },
            { date: "2026-05-26T16:45:00.000Z", label: "Step 2 Completed", desc: "Submitted advanced profile questions. Correlated instantly in CRM." }
        ]
    },
    {
        id: "lead_corp_3",
        name: "Javier Espinosa",
        email: "espinosa_javi@outlook.es",
        phone: "+34 699 334 455",
        language: "ES",
        stage: "form1",
        status: "Nuevo",
        createdAt: "2026-05-29T10:05:00.000Z",
        updatedAt: "2026-05-29T10:05:00.000Z",
        wpData: {
            tipo_operacion: "Compra para vivir",
            zona: "Málaga Capital",
            budget_raw: "Presupuesto de unos 220.000€"
        },
        tallyData: null,
        notes: "Registrado en el Paso 1. Cerró la página antes de completar el Paso 2 (Cuestionario Avanzado). Pendiente de contactar por teléfono para calificar.",
        history: [
            { date: "2026-05-29T10:05:00.000Z", label: "Paso 1 Completado", desc: "Completó datos de contacto en la página de WordPress." }
        ]
    }
];

let crmLeads = [];
let crmActiveTab = "dashboard";
let crmOpenLeadId = null;
let crmSortField = "createdAt";
let crmSortAsc = false;

// ==========================================================================
// INICIALIZACIÓN
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
    // Cargar iconos Lucide
    lucide.createIcons();

    // Actualizar fecha
    updateCrmDate();

    // Inicializar Base de Datos
    initCrmDatabase();

    // Rerenderizar panel
    renderCrmAll();

    // Inicializar guías e inyectores
    initCrmGuides();
    initCrmSandbox();

    // Escuchar cambios de localStorage en tiempo real
    // Esto permite que si rellenan el formulario en el Sandbox o en otra pestaña,
    // el panel del CRM se actualice al instante de forma mágica.
    window.addEventListener("storage", (e) => {
        if (e.key === "living4malaga_crm_leads") {
            console.log("Cambio detectado en base de datos. Actualizando CRM...");
            initCrmDatabase();
            renderCrmAll();
        }
    });

    // Encuesta periódica interna del localStorage por si acaso
    setInterval(() => {
        const saved = localStorage.getItem("living4malaga_crm_leads");
        if (saved) {
            const parsed = JSON.parse(saved);
            if (parsed.length !== crmLeads.length) {
                console.log("Actualización por periodicidad de base de datos...");
                crmLeads = parsed;
                renderCrmAll();
            }
        }
    }, 1500);
});

function initCrmDatabase() {
    const saved = localStorage.getItem("living4malaga_crm_leads");
    if (saved) {
        try {
            crmLeads = JSON.parse(saved);
        } catch (e) {
            crmLeads = [...CRM_SEED_LEADS];
            saveCrmDatabase();
        }
    } else {
        crmLeads = [...CRM_SEED_LEADS];
        saveCrmDatabase();
    }
}

function saveCrmDatabase() {
    localStorage.setItem("living4malaga_crm_leads", JSON.stringify(crmLeads));
}

function resetCrmDatabase() {
    if (confirm("¿Estás seguro de que deseas reiniciar la base de datos de Living4malaga? Esto restaurará la semilla de demostración y borrará tus pruebas locales.")) {
        crmLeads = [...CRM_SEED_LEADS];
        saveCrmDatabase();
        renderCrmAll();
        alert("Base de datos CRM restaurada.");
    }
}

function updateCrmDate() {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const today = new Date();
    document.getElementById("crm-date-display").textContent = today.toLocaleDateString('es-ES', options);
}

// ==========================================================================
// NAVEGACIÓN ENTRE SECCIONES DEL CRM
// ==========================================================================
function switchCrmTab(tabName) {
    crmActiveTab = tabName;

    // Quitar clases activas de la barra lateral y de las secciones
    document.querySelectorAll(".crm-nav-item").forEach(el => el.classList.remove("active"));
    document.querySelectorAll(".crm-section").forEach(el => el.classList.remove("active"));

    // Activar pestaña y sección correspondiente
    document.getElementById(`btn-tab-${tabName}`).classList.add("active");
    document.getElementById(`crm-view-${tabName}`).classList.add("active");

    if (tabName === "dashboard") {
        renderCrmDashboard();
    } else if (tabName === "leads") {
        renderCrmLeadsTable();
    }

    lucide.createIcons();
}

// ==========================================================================
// RENDERIZADORES DE TABLAS Y KPIs
// ==========================================================================
function renderCrmAll() {
    renderCrmKPIs();
    renderCrmDashboard();
    renderCrmLeadsTable();
    
    // Actualizar contador del sidebar
    document.getElementById("crm-sidebar-badge").textContent = crmLeads.length;
}

function renderCrmKPIs() {
    const total = crmLeads.length;
    const completed = crmLeads.filter(l => l.stage === "form2").length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    let volume = 0;
    crmLeads.forEach(l => {
        if (l.tallyData && l.tallyData.budgetRange) {
            volume += crmParseBudgetRange(l.tallyData.budgetRange);
        } else if (l.wpData && l.wpData.budget_raw) {
            volume += crmParseRawBudget(l.wpData.budget_raw);
        }
    });

    const formattedVol = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(volume);

    document.getElementById("kpi-total").textContent = total;
    document.getElementById("kpi-profiles").textContent = completed;
    document.getElementById("kpi-conv").textContent = `${rate}%`;
    document.getElementById("kpi-volume").textContent = formattedVol;
}

function crmParseBudgetRange(text) {
    if (!text) return 0;
    if (text.includes("Menos") || text.includes("Under") || text.includes("200.000€")) return 150000;
    if (text.includes("200.000") || text.includes("200,000")) return 300000;
    if (text.includes("400.000") || text.includes("400,000")) return 550000;
    if (text.includes("Más") || text.includes("Over")) return 900000;
    return 0;
}

function crmParseRawBudget(text) {
    if (!text) return 0;
    const nums = text.replace(/\./g, '').match(/\d+/g);
    if (nums && nums.length > 0) {
        const val = parseInt(nums[0]);
        if (val < 1000) return val * 1000;
        return val;
    }
    return 200000;
}

function renderCrmDashboard() {
    const total = crmLeads.length;

    // 1. Estadísticas de idioma
    const esCount = crmLeads.filter(l => l.language === "ES").length;
    const enCount = crmLeads.filter(l => l.language === "EN").length;
    
    const esPct = total > 0 ? Math.round((esCount / total) * 100) : 50;
    const enPct = total > 0 ? Math.round((enCount / total) * 100) : 50;

    document.getElementById("txt-lang-es").textContent = `${esCount} Leads (${esPct}%)`;
    document.getElementById("txt-lang-en").textContent = `${enCount} Leads (${enPct}%)`;
    
    document.getElementById("bar-seg-es").style.width = `${esPct}%`;
    document.getElementById("bar-seg-en").style.width = `${enPct}%`;

    // 2. Rango de presupuestos
    const ranges = { under: 0, mid: 0, high: 0, over: 0 };
    
    crmLeads.filter(l => l.stage === "form2" && l.tallyData).forEach(l => {
        const r = l.tallyData.budgetRange;
        if (r.includes("Menos") || r.includes("Under")) ranges.under++;
        else if (r.includes("200") && r.includes("400")) ranges.mid++;
        else if (r.includes("400") && r.includes("700")) ranges.high++;
        else if (r.includes("Más") || r.includes("Over")) ranges.over++;
    });

    const max = Math.max(1, ranges.under, ranges.mid, ranges.high, ranges.over);

    const rowsHTML = `
        <div class="crm-budget-bar-row">
            <span class="crm-budget-label">&lt; 200.000 €</span>
            <div class="crm-budget-track">
                <div class="crm-budget-fill" style="width: ${(ranges.under / max) * 100}%;"></div>
            </div>
            <span class="crm-budget-count">${ranges.under}</span>
        </div>
        <div class="crm-budget-bar-row">
            <span class="crm-budget-label">200k - 400k €</span>
            <div class="crm-budget-track">
                <div class="crm-budget-fill" style="width: ${(ranges.mid / max) * 100}%;"></div>
            </div>
            <span class="crm-budget-count">${ranges.mid}</span>
        </div>
        <div class="crm-budget-bar-row">
            <span class="crm-budget-label">400k - 700k €</span>
            <div class="crm-budget-track">
                <div class="crm-budget-fill" style="width: ${(ranges.high / max) * 100}%;"></div>
            </div>
            <span class="crm-budget-count">${ranges.high}</span>
        </div>
        <div class="crm-budget-bar-row">
            <span class="crm-budget-label">&gt; 700.000 €</span>
            <div class="crm-budget-track">
                <div class="crm-budget-fill" style="width: ${(ranges.over / max) * 100}%;"></div>
            </div>
            <span class="crm-budget-count">${ranges.over}</span>
        </div>
    `;
    document.getElementById("crm-budget-chart-rows").innerHTML = rowsHTML;

    // 3. Render Recientes
    const recent = [...crmLeads].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
    const recentTbody = document.getElementById("crm-recent-tbody");
    
    if (recent.length === 0) {
        recentTbody.innerHTML = `<tr><td colspan="7" class="text-center">No hay leads. Usa el Sandbox para crear uno.</td></tr>`;
        return;
    }

    recentTbody.innerHTML = recent.map(l => {
        const budgetVal = l.tallyData ? l.tallyData.budgetRange : (l.wpData.budget_raw || 'No indicado');
        const statusClass = l.status.toLowerCase().replace("ó", "o").replace("á", "a").replace(" ", "-");
        
        return `
            <tr>
                <td>
                    <div class="crm-cell-lead">
                        <strong>${l.name}</strong>
                        <span>${l.email}</span>
                    </div>
                </td>
                <td>
                    <span class="crm-flag-badge">
                        <span class="crm-lang-flag ${l.language === 'ES' ? 'es' : 'en'}"></span>
                        ${l.language}
                    </span>
                </td>
                <td><strong>${l.wpData.tipo_operacion}</strong></td>
                <td class="highlight-gold">${budgetVal}</td>
                <td>
                    <span class="crm-badge-stage ${l.stage === 'form1' ? 'wp' : 'tally'}">
                        ${l.stage === 'form1' ? 'Paso 1 (Web)' : 'Paso 2 (Completo)'}
                    </span>
                </td>
                <td>
                    <span class="crm-status-tag ${statusClass}">${l.status}</span>
                </td>
                <td>
                    <button class="crm-action-btn" onclick="openCrmLeadDrawer('${l.id}')" title="Ver ficha del lead">
                        <i data-lucide="eye"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join("");
}

function renderCrmLeadsTable() {
    const tbody = document.getElementById("crm-leads-tbody");
    const searchVal = document.getElementById("crm-search-input").value.toLowerCase();
    const filterLang = document.getElementById("crm-filter-lang").value;
    const filterStage = document.getElementById("crm-filter-stage").value;
    const filterStatus = document.getElementById("crm-filter-status").value;

    let filtered = crmLeads.filter(l => {
        const matchesSearch = l.name.toLowerCase().includes(searchVal) || 
                              l.email.toLowerCase().includes(searchVal) || 
                              l.phone.toLowerCase().includes(searchVal);
        const matchesLang = filterLang ? l.language === filterLang : true;
        const matchesStage = filterStage ? l.stage === filterStage : true;
        const matchesStatus = filterStatus ? l.status === filterStatus : true;

        return matchesSearch && matchesLang && matchesStage && matchesStatus;
    });

    // Ordenación
    filtered.sort((a, b) => {
        let valA, valB;
        if (crmSortField === "name") {
            valA = a.name.toLowerCase();
            valB = b.name.toLowerCase();
        } else if (crmSortField === "language") {
            valA = a.language;
            valB = b.language;
        } else if (crmSortField === "stage") {
            valA = a.stage;
            valB = b.stage;
        } else if (crmSortField === "status") {
            valA = a.status;
            valB = b.status;
        } else {
            valA = new Date(a.createdAt);
            valB = new Date(b.createdAt);
        }

        if (valA < valB) return crmSortAsc ? -1 : 1;
        if (valA > valB) return crmSortAsc ? 1 : -1;
        return 0;
    });

    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="text-center">No se encontraron inversores con los filtros aplicados.</td></tr>`;
        return;
    }

    tbody.innerHTML = filtered.map(l => {
        const budgetVal = l.tallyData ? l.tallyData.budgetRange : (l.wpData.budget_raw || 'No indicado');
        const statusClass = l.status.toLowerCase().replace("ó", "o").replace("á", "a").replace(" ", "-");
        const regDate = new Date(l.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
        
        return `
            <tr>
                <td>
                    <div class="crm-cell-lead">
                        <strong>${l.name}</strong>
                        <span>${l.email} | ${l.phone}</span>
                    </div>
                </td>
                <td>
                    <span class="crm-flag-badge">
                        <span class="crm-lang-flag ${l.language === 'ES' ? 'es' : 'en'}"></span>
                        ${l.language}
                    </span>
                </td>
                <td><strong>${l.wpData.tipo_operacion}</strong></td>
                <td>${l.wpData.zona || 'Málaga Capital'}</td>
                <td class="highlight-gold">${budgetVal}</td>
                <td>
                    <span class="crm-badge-stage ${l.stage === 'form1' ? 'wp' : 'tally'}">
                        ${l.stage === 'form1' ? 'Paso 1' : 'Paso 2'}
                    </span>
                </td>
                <td>
                    <span class="crm-status-tag ${statusClass}">${l.status}</span>
                </td>
                <td>${regDate}</td>
                <td>
                    <button class="crm-action-btn" onclick="openCrmLeadDrawer('${l.id}')" title="Ver ficha del lead">
                        <i data-lucide="eye"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join("");

    lucide.createIcons();
}

function filterCrmLeads() {
    renderCrmLeadsTable();
}

function sortCrmLeads(field) {
    if (crmSortField === field) {
        crmSortAsc = !crmSortAsc;
    } else {
        crmSortField = field;
        crmSortAsc = true;
    }
    renderCrmLeadsTable();
}

// ==========================================================================
// DRAWER / DETALLES DE INVERSOR Y ANOTACIONES
// ==========================================================================
function openCrmLeadDrawer(leadId) {
    const lead = crmLeads.find(l => l.id === leadId);
    if (!lead) return;

    crmOpenLeadId = leadId;

    document.getElementById("dr-lang").textContent = lead.language;
    document.getElementById("dr-lang").className = `badge-lang ${lead.language === 'ES' ? 'gold' : 'navy'}`;
    
    document.getElementById("dr-name").textContent = lead.name;
    const dStr = new Date(lead.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    document.getElementById("dr-date").textContent = `Registrado el ${dStr}`;
    
    document.getElementById("dr-status-select").value = lead.status;
    document.getElementById("dr-email").textContent = lead.email;
    document.getElementById("dr-phone").textContent = lead.phone;

    // Paso 1 WordPress
    document.getElementById("dr-wp-op").textContent = lead.wpData.tipo_operacion;
    document.getElementById("dr-wp-area").textContent = lead.wpData.zona;
    document.getElementById("dr-wp-budget").textContent = `"${lead.wpData.budget_raw}"`;

    // Paso 2 Cuestionario Avanzado (Tally replacement)
    const blockStatus = document.getElementById("dr-tally-status");
    const blockContent = document.getElementById("dr-tally-content");

    if (lead.stage === "form2" && lead.tallyData) {
        blockStatus.textContent = "Completado";
        blockStatus.className = "crm-badge-tag gold";
        
        blockContent.innerHTML = `
            <div class="crm-qa-list">
                <div class="crm-qa-item">
                    <span>¿Qué tipo de compra busca?</span>
                    <p>${lead.tallyData.purchaseType}</p>
                </div>
                <div class="crm-qa-item">
                    <span>¿Cuándo desea realizar la compra?</span>
                    <p>${lead.tallyData.timeline}</p>
                </div>
                <div class="crm-qa-item">
                    <span>Zonas específicas de interés</span>
                    <p>${lead.tallyData.areaDetail}</p>
                </div>
                <div class="crm-qa-item">
                    <span>¿Qué tipo de propiedad busca?</span>
                    <p>${lead.tallyData.propertyType}</p>
                </div>
                <div class="crm-qa-item">
                    <span>Dormitorios</span>
                    <p>${lead.tallyData.bedrooms}</p>
                </div>
                <div class="crm-qa-item">
                    <span>Extras imprescindibles</span>
                    <p>${lead.tallyData.extras && lead.tallyData.extras.length > 0 ? lead.tallyData.extras.join(', ') : 'Ninguno especificado'}</p>
                </div>
                <div class="crm-qa-item">
                    <span>Rango de inversión cómodo</span>
                    <p class="highlight-gold">${lead.tallyData.budgetRange}</p>
                </div>
                <div class="crm-qa-item">
                    <span>¿Requiere financiación hipotecaria?</span>
                    <p>${lead.tallyData.financing}</p>
                </div>
            </div>
        `;
    } else {
        blockStatus.textContent = "Pendiente";
        blockStatus.className = "crm-badge-tag navy";
        blockContent.innerHTML = `<p class="pending-text">El inversor aún no ha rellenado el Paso 2 (Cuestionario detallado) en la web.</p>`;
    }

    // Timeline Historial
    const timeline = document.getElementById("dr-timeline");
    timeline.innerHTML = lead.history.map((ev, idx) => {
        const isLast = idx === lead.history.length - 1;
        const eDate = new Date(ev.date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
        return `
            <div class="crm-timeline-event ${isLast ? 'primary' : 'completed'}">
                <div class="crm-event-header">
                    <strong class="crm-event-title">${ev.label}</strong>
                    <span class="crm-event-date">${eDate}</span>
                </div>
                <p class="crm-event-desc">${ev.desc}</p>
            </div>
        `;
    }).join("");

    // Notas de asesor
    document.getElementById("dr-notes-input").value = lead.notes || "";

    // Abrir Drawer
    document.getElementById("crm-lead-drawer").classList.add("active");
    lucide.createIcons();
}

function closeCrmLeadDrawer() {
    document.getElementById("crm-lead-drawer").classList.remove("active");
    crmOpenLeadId = null;
}

function updateCrmLeadStatus() {
    if (!crmOpenLeadId) return;

    const idx = crmLeads.findIndex(l => l.id === crmOpenLeadId);
    if (idx === -1) return;

    const newStatus = document.getElementById("dr-status-select").value;
    const oldStatus = crmLeads[idx].status;

    if (oldStatus !== newStatus) {
        crmLeads[idx].status = newStatus;
        crmLeads[idx].updatedAt = new Date().toISOString();
        
        crmLeads[idx].history.push({
            date: new Date().toISOString(),
            label: "Cambio de Estado",
            desc: `Estado de captación modificado manualmente de "${oldStatus}" a "${newStatus}".`
        });

        saveCrmDatabase();
        renderCrmAll();
        openCrmLeadDrawer(crmOpenLeadId);
    }
}

function saveCrmLeadNotes() {
    if (!crmOpenLeadId) return;

    const idx = crmLeads.findIndex(l => l.id === crmOpenLeadId);
    if (idx === -1) return;

    const textNotes = document.getElementById("dr-notes-input").value;
    crmLeads[idx].notes = textNotes;
    crmLeads[idx].updatedAt = new Date().toISOString();

    if (textNotes.trim().length > 0) {
        crmLeads[idx].history.push({
            date: new Date().toISOString(),
            label: "Nota del Asesor",
            desc: "Se guardó una nueva nota o comentario en la ficha interna de seguimiento."
        });
    }

    saveCrmDatabase();
    renderCrmAll();
    openCrmLeadDrawer(crmOpenLeadId);
    alert("Notas de asesor guardadas correctamente.");
}

// ==========================================================================
// PREVISUALIZACIÓN DE SANDBOX / CARGA DEL WIDGET EN TELÉFONO MOCK
// ==========================================================================
function initCrmSandbox() {
    // Inyectamos el HTML del widget directamente dentro del contenedor del simulador
    const mount = document.getElementById("sandbox-widget-mount");
    if (!mount) return;

    // Hacemos un fetch local rápido de widget.html
    fetch('widget.html')
        .then(res => res.text())
        .then(html => {
            mount.innerHTML = html;
            // Esperar un momento a que se dibuje y re-enlazar los eventos y Lucide del widget
            setTimeout(() => {
                // El widget.js cargado en la página se encargará de las funciones onclick="submitStep1()" etc.
                // Reiniciar el formulario del widget simulado
                if (typeof resetWidgetForm === 'function') resetWidgetForm();
            }, 200);
        })
        .catch(err => {
            console.error("Error inyectando el widget en el sandbox:", err);
            mount.innerHTML = `<p style="color:red;padding:20px;text-align:center;">Error al cargar widget.html. Abre el CRM en servidor local o coloca los archivos en el mismo directorio.</p>`;
        });
}

// ==========================================================================
// PESTAÑA DE INTEGRACIÓN - COPILAR CÓDIGOS PARA WORDPRESS
// ==========================================================================
function initCrmGuides() {
    // Leer widget.html, widget.css y widget.js para mostrarlos en los cuadros de código listos para copiar
    
    // HTML
    fetch('widget.html')
        .then(res => res.text())
        .then(text => {
            document.getElementById("code-html-box").value = text;
        });

    // CSS
    fetch('widget.css')
        .then(res => res.text())
        .then(text => {
            document.getElementById("code-css-box").value = text;
        });

    // JS
    fetch('widget.js')
        .then(res => res.text())
        .then(text => {
            document.getElementById("code-js-box").value = text;
        });
}

// Copiar código al portapapeles
window.copyCode = function(boxId) {
    const textEl = document.getElementById(boxId);
    textEl.select();
    textEl.setSelectionRange(0, 99999); // Para móviles
    
    try {
        navigator.clipboard.writeText(textEl.value);
        alert("¡Código copiado al portapapeles con éxito!");
    } catch (err) {
        // Fallback antiguo
        document.execCommand("copy");
        alert("¡Código copiado al portapapeles con éxito!");
    }
};
