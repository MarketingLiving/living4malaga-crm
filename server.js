/**
 * ==========================================================================
 * LIVING4MALAGA INVESTOR CRM - PRODUCTION BACKEND SERVER (SOLUCIÓN HÍBRIDA)
 * ==========================================================================
 * Este servidor Express sirve la aplicación de panel de control CRM y expone
 * los endpoints de API unificados para captar envíos en tiempo real del
 * widget incrustado en tu página de WordPress https://living4malaga.com/invertir/
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_FILE = path.join(__dirname, 'database.json');

// Semilla por defecto por si se reinicia o no existe
const SEED_DATA = [
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
    }
];

// Middlewares
app.use(cors());
app.use(express.json());

// Redirigir la raíz al CRM para facilitar el acceso administrativo
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'crm.html'));
});

// Servir todos los archivos estáticos de la carpeta (widget.html, crm.html, etc.)
app.use(express.static(__dirname));

// ==========================================================================
// PERSISTENCIA DE BASE DE DATOS LOCAL
// ==========================================================================
function readDatabase() {
    if (!fs.existsSync(DB_FILE)) {
        fs.writeFileSync(DB_FILE, JSON.stringify(SEED_DATA, null, 2), 'utf8');
        return SEED_DATA;
    }
    try {
        const data = fs.readFileSync(DB_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error("Error leyendo base de datos JSON:", error);
        return SEED_DATA;
    }
}

function writeDatabase(data) {
    try {
        fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (error) {
        console.error("Error escribiendo base de datos JSON:", error);
        return false;
    }
}

// ==========================================================================
// ENDPOINT 1: PASO 1 (WP EMBED / CF7 FALLBACK WEBHOOK)
// ==========================================================================
app.post('/api/webhooks/wordpress', (req, res) => {
    try {
        const payload = req.body;
        console.log("Paso 1 recibido desde Widget/WordPress:", payload);

        // Extraer campos
        const rawName = payload['your-name'] || payload['name'] || 'Inversor Desconocido';
        const rawEmail = payload['your-email'] || payload['email'];
        const rawPhone = payload['tel-38'] || payload['phone'] || 'No indicado';
        const rawTipo = payload['tipo_operacion'] || 'Inversión';
        const rawZona = payload['zona'] || 'Málaga Capital';
        const budgetRaw = payload['your-message'] || payload['budget_raw'] || 'No especificado';

        if (!rawEmail) {
            return res.status(400).json({ success: false, message: "El campo 'your-email' es obligatorio." });
        }

        // Detectar Idioma
        let language = 'ES';
        if (['Buy to live', 'Sell property', 'Investment', 'Second home'].includes(rawTipo) || 
            ['Málaga City', "I'm not sure yet"].includes(rawZona)) {
            language = 'EN';
        }

        // Mapeo unificado
        let normalizedTipo = rawTipo;
        if (rawTipo === "Buy to live") normalizedTipo = "Compra para vivir";
        if (rawTipo === "Sell property") normalizedTipo = "Venta";
        if (rawTipo === "Second home") normalizedTipo = "Segunda residencia";
        if (rawTipo === "Investment") normalizedTipo = "Inversión";

        let normalizedZona = rawZona;
        if (rawZona === "Málaga City") normalizedZona = "Málaga Capital";
        if (rawZona === "I'm not sure yet") normalizedZona = "No estoy decidido";

        const leads = readDatabase();
        let leadIndex = leads.findIndex(l => l.email.toLowerCase() === rawEmail.toLowerCase());
        
        const leadId = "lead_" + Date.now();
        const timestamp = new Date().toISOString();

        const newLead = {
            id: leadId,
            name: rawName,
            email: rawEmail.toLowerCase(),
            phone: rawPhone,
            language: language,
            stage: "form1",
            status: "Nuevo",
            createdAt: timestamp,
            updatedAt: timestamp,
            wpData: {
                tipo_operacion: normalizedTipo,
                zona: normalizedZona,
                budget_raw: budgetRaw
            },
            tallyData: null,
            notes: `Lead registrado automáticamente a través del Formulario Embebido (${language}).`,
            history: [
                { date: timestamp, label: "Paso 1 Completado", desc: `Ingresó datos de contacto en la página de WordPress /invertir/ (${language}).` }
            ]
        };

        if (leadIndex !== -1) {
            // Actualizar preexistente
            leads[leadIndex].name = rawName;
            leads[leadIndex].phone = rawPhone;
            leads[leadIndex].language = language;
            leads[leadIndex].wpData = newLead.wpData;
            leads[leadIndex].updatedAt = timestamp;
            leads[leadIndex].history.push({
                date: timestamp,
                label: "Actualización Paso 1",
                desc: "Se recibieron nuevos datos de contacto desde el formulario embebido."
            });
            console.log(`Lead preexistente actualizado en Paso 1: ${rawEmail}`);
            writeDatabase(leads);
            return res.status(200).json({ success: true, message: "Lead actualizado.", lead_id: leads[leadIndex].id });
        } else {
            // Agregar nuevo
            leads.unshift(newLead);
            console.log(`Nuevo lead captado en Paso 1: ${rawEmail}`);
            writeDatabase(leads);
            return res.status(200).json({ success: true, message: "Lead registrado.", lead_id: leadId });
        }

    } catch (error) {
        console.error("Error en Webhook Paso 1:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor.", error: error.message });
    }
});

// ==========================================================================
// ENDPOINT 2: PASO 2 (WIDGET COMPLETO / TALLY COMPATIBLE WEBHOOK)
// ==========================================================================
app.post('/api/webhooks/tally', (req, res) => {
    try {
        const payload = req.body;
        console.log("Paso 2 recibido (Webhook de Tally / Widget):", payload);

        // Extraer parámetros de tracking
        const urlParams = payload.url_parameters || {};
        const trackerLeadId = urlParams.lead_id;
        const trackerEmail = urlParams.email;

        const dataPayload = payload.data || {};
        const fields = dataPayload.fields || [];

        let extractedEmail = trackerEmail;
        const tallyAnswers = {};

        // Parsear respuestas
        fields.forEach(f => {
            const label = f.label;
            const value = f.value;
            if (!value) return;

            if (label.includes("Correo electrónico") || label.includes("Email address")) {
                extractedEmail = value;
            }

            // A. Tipo de compra
            if (label.includes("tipo de compra") || label.includes("type of purchase")) {
                let norm = value;
                if (value === "Main residence") norm = "Vivienda habitual";
                if (value === "Second home") norm = "Segunda residencia";
                if (value === "Holiday rental") norm = "Alquiler vacacional";
                tallyAnswers.purchaseType = norm;
            }
            
            // B. Plazo
            if (label.includes("Cuándo le gustaría") || label.includes("When would you like")) {
                let norm = value;
                if (value === "As soon as possible") norm = "Lo antes posible";
                if (value === "Within the next 3-6 months") norm = "En los próximos 3-6 meses";
                if (value === "Later / just exploring options") norm = "Más adelante / explorando opciones";
                tallyAnswers.timeline = norm;
            }

            // C. Zonas detalladas
            if (label.includes("Zonas específicas") || label.includes("Specific areas") || label.includes("zonas específicas")) {
                tallyAnswers.areaDetail = value;
            }

            // D. Tipo propiedad
            if (label.includes("tipo de propiedad") || label.includes("kind of property")) {
                let norm = value;
                if (value === "Apartment") norm = "Piso";
                if (value === "Penthouse") norm = "Ático";
                if (value === "Villa / Detached house") norm = "Villa / casa independiente";
                if (value === "New development") norm = "Obra nueva";
                if (value === "Not sure yet") norm = "Aún no lo tengo definido";
                tallyAnswers.propertyType = norm;
            }

            // E. Dormitorios
            if (label.includes("dormitorios") || label.includes("bedrooms")) {
                tallyAnswers.bedrooms = value;
            }

            // F. Extras
            if (label.includes("extras") || label.includes("extras are essential")) {
                const arr = Array.isArray(value) ? value : [value];
                tallyAnswers.extras = arr.map(ex => {
                    if (ex === "Pool") return "Piscina";
                    if (ex === "Terrace") return "Terraza";
                    if (ex === "Sea views") return "Vistas al mar";
                    if (ex === "Garden") return "Jardín";
                    return ex;
                });
            }

            // G. Presupuesto
            if (label.includes("rango de inversión") || label.includes("budget range")) {
                let norm = value;
                if (value === "Under €200,000") norm = "Menos de 200.000€";
                if (value === "€200,000 - €400,000") norm = "200.000€ - 400.000€";
                if (value === "€400,000 - €700,000") norm = "400.000€ - 700.000€";
                if (value === "Over €700,000") norm = "Más de 700.000€";
                tallyAnswers.budgetRange = norm;
            }

            // H. Financiación
            if (label.includes("financiación") || label.includes("financing")) {
                let norm = value;
                if (value === "Yes") norm = "Sí";
                if (value === "No") norm = "No";
                if (value === "To be decided") norm = "Aún por definir";
                tallyAnswers.financing = norm;
            }
        });

        // Correlacionar
        const leads = readDatabase();
        let matchedIndex = -1;

        if (trackerLeadId) {
            matchedIndex = leads.findIndex(l => l.id === trackerLeadId);
        }
        if (matchedIndex === -1 && extractedEmail) {
            matchedIndex = leads.findIndex(l => l.email.toLowerCase() === extractedEmail.toLowerCase());
        }

        const timestamp = new Date().toISOString();

        if (matchedIndex !== -1) {
            // Fusión
            leads[matchedIndex].stage = "form2";
            leads[matchedIndex].status = "Tally Completado";
            leads[matchedIndex].updatedAt = timestamp;
            leads[matchedIndex].tallyData = tallyAnswers;
            leads[matchedIndex].history.push({
                date: timestamp,
                label: "Perfil Inversor Recibido",
                desc: "Completó el Paso 2 interactivo (Cuestionario detallado). Ficha consolidada."
            });

            console.log(`Paso 2 fusionado correctamente para: ${leads[matchedIndex].email}`);
            writeDatabase(leads);
            return res.status(200).json({ success: true, message: "Datos unificados correctamente en el lead." });
        } else {
            // Huérfano
            const newLeadId = "lead_" + Date.now();
            const fallbackEmail = extractedEmail || `directo_${Date.now()}@living4malaga.com`;
            
            const orphanLead = {
                id: newLeadId,
                name: "Inversor Directo Form 2",
                email: fallbackEmail.toLowerCase(),
                phone: "No indicado",
                language: "ES",
                stage: "form2",
                status: "Tally Completado",
                createdAt: timestamp,
                updatedAt: timestamp,
                wpData: {
                    tipo_operacion: tallyAnswers.purchaseType || "Inversión",
                    zona: tallyAnswers.areaDetail || "Málaga Capital",
                    budget_raw: tallyAnswers.budgetRange || "No indicado"
                },
                tallyData: tallyAnswers,
                notes: "Registrado directamente a través del cuestionario detallado Paso 2.",
                history: [
                    { date: timestamp, label: "Registro Directo Paso 2", desc: "Completó Paso 2 directamente sin pasar por Paso 1." }
                ]
            };

            leads.unshift(orphanLead);
            writeDatabase(leads);
            console.log(`Creado lead huérfano desde Paso 2: ${fallbackEmail}`);
            return res.status(201).json({ success: true, message: "Creado nuevo lead desde Paso 2.", lead_id: newLeadId });
        }

    } catch (error) {
        console.error("Error en Webhook Paso 2:", error);
        return res.status(500).json({ success: false, message: "Error interno del servidor.", error: error.message });
    }
});

// ==========================================================================
// REST API DE GESTIÓN PARA EL PANEL CRM
// ==========================================================================

// Listar todos los leads
app.get('/api/leads', (req, res) => {
    res.json(readDatabase());
});

// Actualizar estado de un lead
app.patch('/api/leads/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
        return res.status(400).json({ success: false, message: "El 'status' es obligatorio." });
    }

    const leads = readDatabase();
    const idx = leads.findIndex(l => l.id === id);

    if (idx === -1) {
        return res.status(404).json({ success: false, message: "Lead no encontrado." });
    }

    const oldStatus = leads[idx].status;
    const timestamp = new Date().toISOString();

    leads[idx].status = status;
    leads[idx].updatedAt = timestamp;
    leads[idx].history.push({
        date: timestamp,
        label: "Cambio de Estado",
        desc: `Estado de captación modificado manualmente en panel de "${oldStatus}" a "${status}".`
    });

    writeDatabase(leads);
    res.json({ success: true, lead: leads[idx] });
});

// Guardar notas del asesor
app.patch('/api/leads/:id/notes', (req, res) => {
    const { id } = req.params;
    const { notes } = req.body;

    const leads = readDatabase();
    const idx = leads.findIndex(l => l.id === id);

    if (idx === -1) {
        return res.status(404).json({ success: false, message: "Lead no encontrado." });
    }

    const timestamp = new Date().toISOString();
    leads[idx].notes = notes;
    leads[idx].updatedAt = timestamp;
    
    if (notes.trim().length > 0) {
        leads[idx].history.push({
            date: timestamp,
            label: "Nota Guardada",
            desc: "Se editó la nota de seguimiento interno."
        });
    }

    writeDatabase(leads);
    res.json({ success: true, lead: leads[idx] });
});

// Resetear base de datos
app.post('/api/database/reset', (req, res) => {
    writeDatabase(SEED_DATA);
    res.json({ success: true, message: "Base de datos restaurada a la semilla por defecto." });
});

// ==========================================================================
// INICIO DE SERVIDOR
// ==========================================================================
app.listen(PORT, () => {
    console.log(`==================================================================`);
    console.log(`🚀 LIVING4MALAGA INVESTOR CRM - SERVIDOR INICIADO`);
    console.log(`📌 Accede a tu CRM de administración: http://localhost:${PORT}`);
    console.log(`📌 Enlace API Formulario WordPress:  POST http://localhost:${PORT}/api/webhooks/wordpress`);
    console.log(`📌 Enlace API Cuestionario Paso 2:   POST http://localhost:${PORT}/api/webhooks/tally`);
    console.log(`==================================================================`);
});
