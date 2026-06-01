// ==========================================================================
// LIVING4MALAGA - LÓGICA DEL WIDGET INVERSOR EMBEBIDO
// ==========================================================================

let currentLanguage = 'ES';
let currentLeadId = null;
let currentLeadEmail = null;

// Backend API URL (configurable en producción)
const CRM_API_URL = window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1')
    ? 'http://localhost:3000'
    : window.location.origin; // Usa el mismo hosting en producción

// ==========================================================================
// TEXTOS Y TRADUCCIONES DEL WIDGET (DICCIONARIO ES / EN)
// ==========================================================================
const TRANSLATIONS = {
    ES: {
        subtitle: "Perfil de Inversor",
        intro: "Completa el Paso 1 para guardar tus datos y recibir una propuesta personalizada.",
        name: "Nombre y apellido *",
        name_placeholder: "Tu nombre completo",
        email: "Correo electrónico *",
        email_placeholder: "correo@ejemplo.com",
        phone: "Número de teléfono *",
        phone_placeholder: "+34 600 000 000",
        operation: "¿Qué busca? *",
        op_inv: "Inversión",
        op_live: "Compra para vivir",
        op_sec: "Segunda residencia",
        op_sell: "Venta",
        area: "¿Qué zona le interesa? *",
        area_cap: "Málaga Capital (Centro, Malagueta, etc.)",
        area_costa: "Costa del Sol (Este/Oeste)",
        area_prov: "Málaga Provincia",
        area_axar: "Axarquía",
        area_unsure: "Aún no estoy decidido",
        budget_raw: "En caso de compra, ¿cuál es su presupuesto? *",
        budget_raw_placeholder: "Ej. Dispongo de unos 300.000 euros para invertir.",
        btn_next: "Siguiente paso",
        
        purchase_type: "¿Qué tipo de compra está buscando? *",
        pur_inv: "Inversión",
        pur_main: "Vivienda habitual",
        pur_sec: "Segunda residencia",
        pur_holiday: "Alquiler vacacional",
        
        timeline: "¿Cuándo le gustaría comprar? *",
        time_soon: "Lo antes posible",
        time_months: "En los próximos 3-6 meses",
        time_later: "Más adelante / explorando opciones",
        
        area_detail: "Zonas específicas de interés (Barrios, Calles...) *",
        area_detail_placeholder: "Ej. Pedregalejo, Soho, Centro Histórico",
        
        property_type: "¿Qué tipo de propiedad busca? *",
        prop_apt: "Piso / Apartamento",
        prop_pent: "Ático",
        prop_villa: "Villa / Casa independiente",
        prop_new: "Obra nueva",
        prop_unsure: "Aún no lo tengo definido",
        
        bedrooms: "¿Cuántos dormitorios necesita? *",
        
        extras: "¿Qué extras son imprescindibles?",
        chk_pool: "Piscina",
        chk_terrace: "Terraza",
        chk_parking: "Parking",
        chk_views: "Vistas al mar",
        chk_garden: "Jardín",
        
        budget_range: "¿En qué rango de inversión se siente más cómodo? *",
        bud_under: "Menos de 200.000 €",
        bud_mid: "200.000 € - 400.000 €",
        bud_high: "400.000 € - 700.000 €",
        bud_over: "Más de 700.000 €",
        
        financing: "¿Necesitará financiación para la compra? *",
        fin_yes: "Sí",
        fin_no: "No",
        fin_unsure: "Aún por definir",
        
        btn_back: "Atrás",
        btn_submit: "Enviar Perfil Inversor",
        
        success_title: "¡Perfil Guardado con Éxito!",
        success_desc: "Gracias por completar tu perfil. Nuestro equipo de asesores en inversiones inmobiliarias revisará tus preferencias y te contactará en breve con las mejores oportunidades de Málaga.",
        btn_new_form: "Enviar otra solicitud"
    },
    EN: {
        subtitle: "Investor Profile",
        intro: "Complete Step 1 to save your details and receive a customized proposal.",
        name: "Name and surname *",
        name_placeholder: "Your full name",
        email: "Email address *",
        email_placeholder: "email@example.com",
        phone: "Phone number *",
        phone_placeholder: "+44 7911 123456",
        operation: "What are you looking for? *",
        op_inv: "Investment",
        op_live: "Buy to live",
        op_sec: "Second home",
        op_sell: "Sell property",
        area: "Which area are you interested in? *",
        area_cap: "Málaga City (Center, Malagueta, etc.)",
        area_costa: "Costa del Sol (East/West)",
        area_prov: "Málaga Province",
        area_axar: "Axarquía",
        area_unsure: "I'm not sure yet",
        budget_raw: "If buying, what is your budget? *",
        budget_raw_placeholder: "E.g. Up to 400k Euros, ready to buy.",
        btn_next: "Next step",
        
        purchase_type: "What type of purchase are you looking for? *",
        pur_inv: "Investment",
        pur_main: "Main residence",
        pur_sec: "Second home",
        pur_holiday: "Holiday rental",
        
        timeline: "When would you like to make the purchase? *",
        time_soon: "As soon as possible",
        time_months: "Within the next 3-6 months",
        time_later: "Later / just exploring options",
        
        area_detail: "Specific areas of interest (Neighborhoods, Streets...) *",
        area_detail_placeholder: "E.g. Pedregalejo, Soho, Old Town",
        
        property_type: "What kind of property are you looking for? *",
        prop_apt: "Apartment",
        prop_pent: "Penthouse",
        prop_villa: "Villa / Detached house",
        prop_new: "New development",
        prop_unsure: "Not sure yet",
        
        bedrooms: "How many bedrooms do you need? *",
        
        extras: "What extras are essential?",
        chk_pool: "Pool",
        chk_terrace: "Terrace",
        chk_parking: "Parking",
        chk_views: "Sea views",
        chk_garden: "Garden",
        
        budget_range: "What is your preferred budget range? *",
        bud_under: "Under €200,000",
        bud_mid: "€200,000 - €400,000",
        bud_high: "€400,000 - €700,000",
        bud_over: "Over €700,000",
        
        financing: "Will you need financing? *",
        fin_yes: "Yes",
        fin_no: "No",
        fin_unsure: "To be decided",
        
        btn_back: "Back",
        btn_submit: "Submit Investor Profile",
        
        success_title: "Profile Saved Successfully!",
        success_desc: "Thank you for completing your profile. Our real estate investment advisory team will review your preferences and contact you shortly with the best opportunities in Málaga.",
        btn_new_form: "Send another request"
    }
};

// ==========================================================================
// TRADUCTOR DING-DONG (IN-PLACE LANG REFRESH)
// ==========================================================================
function toggleWidgetLanguage(lang) {
    currentLanguage = lang;

    // Cambiar clases de botones activos
    document.getElementById("btn-lang-es").classList.remove("active");
    document.getElementById("btn-lang-en").classList.remove("active");
    
    if (lang === 'ES') {
        document.getElementById("btn-lang-es").classList.add("active");
    } else {
        document.getElementById("btn-lang-en").classList.add("active");
    }

    const dict = TRANSLATIONS[lang];

    // Paso 1
    document.getElementById("lbl-widget-subtitle").textContent = dict.subtitle;
    document.getElementById("lbl-intro-text").textContent = dict.intro;
    
    document.getElementById("lbl-name").textContent = dict.name;
    document.getElementById("w-name").placeholder = dict.name_placeholder;
    
    document.getElementById("lbl-email").textContent = dict.email;
    document.getElementById("w-email").placeholder = dict.email_placeholder;
    
    document.getElementById("lbl-phone").textContent = dict.phone;
    document.getElementById("w-phone").placeholder = dict.phone_placeholder;
    
    document.getElementById("lbl-operation").textContent = dict.operation;
    document.getElementById("opt-op-inv").textContent = dict.op_inv;
    document.getElementById("opt-op-live").textContent = dict.op_live;
    document.getElementById("opt-op-second").textContent = dict.op_sec;
    document.getElementById("opt-op-sell").textContent = dict.op_sell;
    
    document.getElementById("lbl-area").textContent = dict.area;
    document.getElementById("opt-area-cap").textContent = dict.area_cap;
    document.getElementById("opt-area-costa").textContent = dict.area_costa;
    document.getElementById("opt-area-prov").textContent = dict.area_prov;
    document.getElementById("opt-area-axar").textContent = dict.area_axar;
    document.getElementById("opt-area-unsure").textContent = dict.area_unsure;
    
    document.getElementById("lbl-budget-raw").textContent = dict.budget_raw;
    document.getElementById("w-budget-raw").placeholder = dict.budget_raw_placeholder;
    document.getElementById("lbl-btn-next").textContent = dict.btn_next;

    // Paso 2
    document.getElementById("lbl-purchase-type").textContent = dict.purchase_type;
    document.getElementById("opt-pur-inv").textContent = dict.pur_inv;
    document.getElementById("opt-pur-main").textContent = dict.pur_main;
    document.getElementById("opt-pur-sec").textContent = dict.pur_sec;
    document.getElementById("opt-pur-holiday").textContent = dict.pur_holiday;
    
    document.getElementById("lbl-timeline").textContent = dict.timeline;
    document.getElementById("opt-time-soon").textContent = dict.time_soon;
    document.getElementById("opt-time-months").textContent = dict.time_months;
    document.getElementById("opt-time-later").textContent = dict.time_later;
    
    document.getElementById("lbl-area-detail").textContent = dict.area_detail;
    document.getElementById("w-area-detail").placeholder = dict.area_detail_placeholder;
    
    document.getElementById("lbl-property-type").textContent = dict.property_type;
    document.getElementById("opt-prop-apt").textContent = dict.prop_apt;
    document.getElementById("opt-prop-pent").textContent = dict.prop_pent;
    document.getElementById("opt-prop-villa").textContent = dict.prop_villa;
    document.getElementById("opt-prop-new").textContent = dict.prop_new;
    document.getElementById("opt-prop-unsure").textContent = dict.prop_unsure;
    
    document.getElementById("lbl-bedrooms").textContent = dict.bedrooms;
    
    document.getElementById("lbl-extras").textContent = dict.extras;
    document.getElementById("lbl-chk-pool").textContent = dict.chk_pool;
    document.getElementById("lbl-chk-terrace").textContent = dict.chk_terrace;
    document.getElementById("lbl-chk-parking").textContent = dict.chk_parking;
    document.getElementById("lbl-chk-views").textContent = dict.chk_views;
    document.getElementById("lbl-chk-garden").textContent = dict.chk_garden;
    
    document.getElementById("lbl-budget-range").textContent = dict.budget_range;
    document.getElementById("opt-bud-under").textContent = dict.bud_under;
    document.getElementById("opt-bud-mid").textContent = dict.bud_mid;
    document.getElementById("opt-bud-high").textContent = dict.bud_high;
    document.getElementById("opt-bud-over").textContent = dict.bud_over;
    
    document.getElementById("lbl-financing").textContent = dict.financing;
    document.getElementById("opt-fin-yes").textContent = dict.fin_yes;
    document.getElementById("opt-fin-no").textContent = dict.fin_no;
    document.getElementById("opt-fin-unsure").textContent = dict.fin_unsure;
    
    document.getElementById("lbl-btn-back").textContent = dict.btn_back;
    document.getElementById("lbl-btn-submit").textContent = dict.btn_submit;

    // Pantalla éxito
    document.getElementById("lbl-success-title").textContent = dict.success_title;
    document.getElementById("lbl-success-desc").textContent = dict.success_desc;
    document.getElementById("lbl-btn-new-form").textContent = dict.btn_new_form;
}

// Auto-detectar idioma del navegador al iniciar
(function autoDetectLanguage() {
    setTimeout(() => {
        const userLang = navigator.language || navigator.userLanguage;
        if (userLang && userLang.toLowerCase().startsWith('en')) {
            toggleWidgetLanguage('EN');
        } else {
            toggleWidgetLanguage('ES');
        }
    }, 100);
})();

// ==========================================================================
// TRANSICIONES Y VALIDACIONES DE PASOS
// ==========================================================================
function submitStep1() {
    const name = document.getElementById("w-name").value.trim();
    const email = document.getElementById("w-email").value.trim();
    const phone = document.getElementById("w-phone").value.trim();
    const budgetRaw = document.getElementById("w-budget-raw").value.trim();

    if (!name || !email || !phone || !budgetRaw) {
        alert(currentLanguage === 'ES' ? "Por favor rellena todos los campos obligatorios (*)." : "Please fill in all required fields (*).");
        return;
    }

    // Guardar email temporal
    currentLeadEmail = email;

    // Recopilar respuestas del Paso 1
    const wpData = {
        name: name,
        email: email,
        phone: phone,
        tipo_operacion: document.getElementById("w-operation").value,
        zona: document.getElementById("w-area").value,
        budget_raw: budgetRaw
    };

    console.log("Enviando Paso 1 al CRM:", wpData);

    // Intentar enviar datos del Paso 1 a la API en producción
    // (Incluye fallback robusto a localStorage por si se corre en entorno local desconectado)
    fetch(`${CRM_API_URL}/api/webhooks/wordpress`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'your-name': wpData.name,
            'your-email': wpData.email,
            'tel-38': wpData.phone,
            'tipo_operacion': wpData.tipo_operacion,
            'zona': wpData.zona,
            'your-message': wpData.budget_raw
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            currentLeadId = data.lead_id;
            console.log("Lead creado en producción exitosamente. ID:", currentLeadId);
        } else {
            // Fallback a almacenamiento local mock si el servidor devolvió error o no es compatible
            mockSaveStep1(wpData);
        }
    })
    .catch(err => {
        console.warn("Servidor backend offline. Usando persistencia local unificada (localStorage Fallback)...");
        mockSaveStep1(wpData);
    })
    .finally(() => {
        // Pasar al paso 2 con animación fluida
        document.getElementById("l4m-step-1-fields").classList.remove("active");
        document.getElementById("l4m-step-2-fields").classList.add("active");
        
        // Actualizar barra de progreso
        document.getElementById("l4m-progress-fill").style.width = "60%";
        document.getElementById("step-ind-1").className = "l4m-step-indicator completed";
        document.getElementById("step-ind-2").className = "l4m-step-indicator active";
        
        // Cambiar texto
        document.getElementById("lbl-intro-text").textContent = currentLanguage === 'ES'
            ? "¡Excelente! Tus datos básicos han sido guardados. Completa este último paso para afinar las recomendaciones."
            : "Great! Your basic details are saved. Complete this last step to refine our property recommendations.";
    });
}

function goBackToStep1() {
    document.getElementById("l4m-step-2-fields").classList.remove("active");
    document.getElementById("l4m-step-1-fields").classList.add("active");
    
    // Regresar barra
    document.getElementById("l4m-progress-fill").style.width = "15%";
    document.getElementById("step-ind-1").className = "l4m-step-indicator active";
    document.getElementById("step-ind-2").className = "l4m-step-indicator";
    
    document.getElementById("lbl-intro-text").textContent = TRANSLATIONS[currentLanguage].intro;
}

// FALLBACK PERSISTENCIA LOCAL (MOCK WEBHOOK PARA ENTORNO OFFLINE / TEST LOCAL)
function mockSaveStep1(wpData) {
    currentLeadId = "lead_" + Date.now();
    
    const saved = localStorage.getItem("living4malaga_crm_leads");
    let leadsList = [];
    
    if (saved) {
        try { leadsList = JSON.parse(saved); } catch (e) { leadsList = []; }
    }

    const timestamp = new Date().toISOString();
    const newLead = {
        id: currentLeadId,
        name: wpData.name,
        email: wpData.email.toLowerCase(),
        phone: wpData.phone,
        language: currentLanguage,
        stage: "form1",
        status: "Nuevo",
        createdAt: timestamp,
        updatedAt: timestamp,
        wpData: {
            tipo_operacion: wpData.tipo_operacion,
            zona: wpData.zona,
            budget_raw: wpData.budget_raw
        },
        tallyData: null,
        notes: `Registrado en WordPress (${currentLanguage}). Guardado mediante fallback local.`,
        history: [
            { date: timestamp, label: "Registro Portal", desc: `Ingresó datos del Paso 1 en la página /invertir/ (${currentLanguage}).` }
        ]
    };

    leadsList.unshift(newLead);
    localStorage.setItem("living4malaga_crm_leads", JSON.stringify(leadsList));
    console.log("Paso 1 guardado en localStorage:", newLead);
}

// ==========================================================================
// ENVÍO DE PASO 2 (PERFIL COMPLETO / FINALIZAR)
// ==========================================================================
function handleFormSubmission(event) {
    event.preventDefault();

    // Recopilar extras marcados
    const checkedExtras = [];
    document.querySelectorAll('input[name="w-extras"]:checked').forEach(el => {
        checkedExtras.push(el.value);
    });

    const tallyData = {
        purchaseType: document.getElementById("w-purchase-type").value,
        timeline: document.getElementById("w-timeline").value,
        areaDetail: document.getElementById("w-area-detail").value.trim() || 'Cualquiera',
        propertyType: document.getElementById("w-property-type").value,
        bedrooms: document.getElementById("w-bedrooms").value,
        extras: checkedExtras,
        budgetRange: document.getElementById("w-budget-range").value,
        financing: document.getElementById("w-financing").value
    };

    console.log("Enviando Paso 2 al CRM:", tallyData);

    // Intentar enviar datos del Paso 2 a la API en producción
    fetch(`${CRM_API_URL}/api/webhooks/tally`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Simulamos la llamada webhook de Tally incluyendo los URL parameters de correlación
        body: JSON.stringify({
            url_parameters: {
                lead_id: currentLeadId,
                email: currentLeadEmail
            },
            data: {
                fields: [
                    { label: "¿Qué tipo de compra está buscando?", value: tallyData.purchaseType },
                    { label: "¿Cuándo le gustaría realizar la compra?", value: tallyData.timeline },
                    { label: "¿Qué zonas específicas le interesan?", value: tallyData.areaDetail },
                    { label: "¿Qué tipo de propiedad está buscando?", value: tallyData.propertyType },
                    { label: "¿Cuántos dormitorios necesita?", value: tallyData.bedrooms },
                    { label: "¿Qué extras son imprescindibles?", value: tallyData.extras },
                    { label: "¿En qué rango de inversión se siente más cómodo?", value: tallyData.budgetRange },
                    { label: "¿Necesitarás financiación para la compra?", value: tallyData.financing }
                ]
            }
        })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            console.log("Paso 2 integrado y fusionado en el servidor correctamente.");
        } else {
            mockSaveStep2(tallyData);
        }
    })
    .catch(err => {
        console.warn("Servidor backend offline. Fusionando localmente en localStorage...");
        mockSaveStep2(tallyData);
    })
    .finally(() => {
        // Mostrar pantalla de éxito
        document.getElementById("l4m-step-2-fields").classList.remove("active");
        document.getElementById("l4m-progress-fill").style.width = "100%";
        document.getElementById("step-ind-2").className = "l4m-step-indicator completed";
        document.getElementById("lbl-intro-text").style.display = "none";
        
        document.getElementById("l4m-success-screen").classList.add("active");
    });
}

// FUSIÓN LOCAL MOCK (PASO 2 EN LOCALSTORAGE)
function mockSaveStep2(tallyData) {
    const saved = localStorage.getItem("living4malaga_crm_leads");
    if (!saved) return;

    try {
        let leadsList = JSON.parse(saved);
        // Buscar el lead por ID o por email
        let idx = leadsList.findIndex(l => l.id === currentLeadId);
        if (idx === -1 && currentLeadEmail) {
            idx = leadsList.findIndex(l => l.email.toLowerCase() === currentLeadEmail.toLowerCase());
        }

        const timestamp = new Date().toISOString();

        if (idx !== -1) {
            // Fusionar respuestas
            leadsList[idx].stage = "form2";
            leadsList[idx].status = "Tally Completado"; // Equivalente a cuestionario finalizado
            leadsList[idx].updatedAt = timestamp;
            leadsList[idx].tallyData = tallyData;
            leadsList[idx].history.push({
                date: timestamp,
                label: "Perfil Inversor Recibido",
                desc: "Completó el cuestionario avanzado (Paso 2) desde la Landing Page. Datos unificados."
            });
            
            localStorage.setItem("living4malaga_crm_leads", JSON.stringify(leadsList));
            console.log("Fusión completada localmente con éxito:", leadsList[idx]);
        }
    } catch (e) {
        console.error("Error realizando la fusión local:", e);
    }
}

// RESET FORMULARIO
function resetWidgetForm() {
    // Limpiar inputs
    document.getElementById("w-name").value = "";
    document.getElementById("w-email").value = "";
    document.getElementById("w-phone").value = "";
    document.getElementById("w-budget-raw").value = "";
    document.getElementById("w-area-detail").value = "";

    // Regresar a pantalla 1
    document.getElementById("l4m-success-screen").classList.remove("active");
    document.getElementById("l4m-step-1-fields").classList.add("active");
    
    // Regresar progreso
    document.getElementById("l4m-progress-fill").style.width = "15%";
    document.getElementById("step-ind-1").className = "l4m-step-indicator active";
    document.getElementById("step-ind-2").className = "l4m-step-indicator";
    
    document.getElementById("lbl-intro-text").style.display = "block";
    document.getElementById("lbl-intro-text").textContent = TRANSLATIONS[currentLanguage].intro;

    currentLeadId = null;
    currentLeadEmail = null;
}
