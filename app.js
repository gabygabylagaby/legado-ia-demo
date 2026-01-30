// Base de datos simulada en localStorage
class LegalDatabase {
    constructor() {
        this.storageKey = 'legado_ia_chats';
        this.currentChatKey = 'legado_ia_current_chat';
        this.initDatabase();
    }

    initDatabase() {
        if (!localStorage.getItem(this.storageKey)) {
            const initialData = {
                chats: [],
                nextId: 1
            };
            localStorage.setItem(this.storageKey, JSON.stringify(initialData));
        }
    }

    getData() {
        return JSON.parse(localStorage.getItem(this.storageKey));
    }

    saveData(data) {
        localStorage.setItem(this.storageKey, JSON.stringify(data));
    }

    createChat(title) {
        const data = this.getData();
        const newChat = {
            id: data.nextId++,
            title: title,
            messages: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        data.chats.unshift(newChat);
        this.saveData(data);
        return newChat;
    }

    getChat(id) {
        const data = this.getData();
        return data.chats.find(chat => chat.id === id);
    }

    getAllChats() {
        const data = this.getData();
        return data.chats;
    }

    addMessage(chatId, message) {
        const data = this.getData();
        const chat = data.chats.find(c => c.id === chatId);
        if (chat) {
            chat.messages.push(message);
            chat.updatedAt = new Date().toISOString();
            this.saveData(data);
        }
    }

    deleteChat(chatId) {
        const data = this.getData();
        data.chats = data.chats.filter(c => c.id !== chatId);
        this.saveData(data);
    }

    getCurrentChatId() {
        return parseInt(localStorage.getItem(this.currentChatKey));
    }

    setCurrentChatId(chatId) {
        localStorage.setItem(this.currentChatKey, chatId);
    }
}

// Respuestas mockeadas sobre derecho boliviano
const legalResponses = {
    default: `Como asistente legal especializado en derecho boliviano, estoy aquí para ayudarte. Sin embargo, necesito más detalles sobre tu consulta para brindarte información precisa y relevante.

Por favor, especifica tu pregunta sobre:
- **Derecho Civil**: Contratos, obligaciones, propiedad
- **Derecho Laboral**: Relaciones laborales, despidos, beneficios sociales
- **Derecho Comercial**: Constitución de empresas, sociedades comerciales
- **Derecho Penal**: Delitos, procedimientos penales
- **Derecho de Familia**: Matrimonio, divorcio, filiación, sucesiones

¿En qué área específica del derecho boliviano necesitas asesoramiento?`,

    empresa: `Para constituir una **empresa en Bolivia**, debes seguir estos pasos según la normativa vigente:

**1. Requisitos Previos:**
- Definir el tipo de sociedad (S.R.L., S.A., empresa unipersonal)
- Elaborar minuta de constitución
- Capital mínimo: Bs. 1,000 para S.R.L.

**2. Trámites en FUNDEMPRESA:**
- Registro de matrícula de comercio
- Inscripción de testimonio de constitución
- Obtención de NIT (Número de Identificación Tributaria)

**3. Documentación necesaria:**
- Testimonio de constitución (notariado)
- Fotocopia de C.I. de socios
- Poder del representante legal
- Balance de apertura

**4. Registro en el SIN:**
- Empadronamiento en el Servicio de Impuestos Nacionales
- Inscripción al IVA (si corresponde)
- Registro de sistema de facturación

**5. Otros registros:**
- Caja Nacional de Salud (CNS)
- AFP para empleados
- Ministerio de Trabajo

El proceso completo puede tomar entre 15 a 30 días hábiles. Te recomiendo contar con asesoría legal especializada para garantizar el cumplimiento de todos los requisitos.`,

    laboral: `El **proceso laboral en Bolivia** se rige por la Ley General del Trabajo y tiene las siguientes características:

**Derechos fundamentales del trabajador:**
- Jornada de 8 horas diarias
- Pago de aguinaldo (un mes de salario al año)
- Pago de primas y bonos
- Indemnización por despido injustificado
- Vacaciones anuales (15 días después del primer año)

**En caso de despido:**
1. **Desahucio**: Aviso previo con 3 meses de anticipación
2. **Indemnización**: Un mes de salario por año trabajado (máx. 7 años)
3. **Finiquito**: Incluye vacaciones, aguinaldo proporcional

**Proceso de demanda laboral:**
- Presentación ante el Ministerio de Trabajo
- Conciliación obligatoria
- Si no hay acuerdo: demanda ante Juez de Trabajo
- El proceso puede durar 6-12 meses

**Importante**: Los derechos laborales en Bolivia son irrenunciables y la carga de la prueba recae en el empleador.

¿Tienes alguna situación laboral específica que necesites consultar?`,

    contrato: `Los **contratos de arrendamiento en Bolivia** se regulan por el Código Civil y tienen estas características:

**Tipos de arrendamiento:**
1. **Arrendamiento de vivienda**
2. **Arrendamiento comercial**
3. **Arrendamiento de terrenos**

**Elementos esenciales del contrato:**
- Identificación de las partes
- Descripción del inmueble
- Monto del alquiler
- Plazo del contrato
- Garantías (depósito en garantía: 1-2 meses)
- Obligaciones de ambas partes

**Derechos del arrendatario:**
- Uso pacífico del inmueble
- Permanencia por el plazo pactado
- Reembolso de mejoras necesarias (con acuerdo)

**Derechos del arrendador:**
- Cobro puntual del alquiler
- Inspección del inmueble (con aviso previo)
- Recuperación del inmueble al término del contrato

**Desalojo:**
- Judicial: Por incumplimiento de contrato
- Vencimiento de plazo
- Proceso: 3-6 meses aproximadamente

**Recomendación**: Siempre registrar el contrato ante Derechos Reales para mayor seguridad jurídica.`,

    herencia: `Las **herencias y sucesiones en Bolivia** se rigen por el Código Civil y el Código de Familia:

**Tipos de sucesión:**
1. **Testamentaria**: Según voluntad del causante
2. **Legítima (intestada)**: Según ley cuando no hay testamento

**Orden de sucesión intestada:**
1. Descendientes (hijos, nietos)
2. Ascendientes (padres, abuelos)
3. Cónyuge o conviviente
4. Hermanos
5. Parientes colaterales hasta 4to grado

**Proceso de sucesión:**

**1. Declaratoria de herederos:**
- Certificado de defunción
- Partida de nacimiento de herederos
- Certificado de matrimonio (si aplica)
- Inventario de bienes

**2. Trámites:**
- Presentación ante Notario o Juez
- Publicación de edictos (20 días)
- Resolución de declaratoria
- Inscripción en Derechos Reales

**Cuota hereditaria legitimaria:**
- **50%** para herederos forzosos
- **50%** de libre disposición

**Impuesto a la herencia:**
- 1% del valor de los bienes heredados
- Exenciones según monto y relación

**Tiempo estimado**: 3-6 meses sin conflictos

¿Tienes alguna consulta específica sobre una sucesión en particular?`,

    penal: `El **derecho penal boliviano** se estructura de la siguiente manera:

**Sistema de Justicia Penal:**
- Código Penal Boliviano
- Código de Procedimiento Penal
- Principio de presunción de inocencia

**Proceso penal ordinario:**

**1. Etapa preparatoria:**
- Denuncia o querella
- Investigación fiscal (6 meses prorrogables)
- Imputación formal

**2. Etapa de juicio:**
- Acusación
- Audiencia de juicio oral
- Sentencia

**Derechos del imputado:**
- Defensa técnica (abogado)
- Ser informado de la acusación
- Guardar silencio
- Presunción de inocencia
- Debido proceso

**Medidas cautelares:**
- Detención preventiva (como última opción)
- Arraigo
- Fianza económica
- Presentación periódica

**Tipos de penas:**
- Privación de libertad
- Multas
- Prestación de trabajo
- Inhabilitación

**Salidas alternativas:**
- Conciliación
- Suspensión condicional del proceso
- Procedimiento abreviado

¿Necesitas información sobre algún delito o procedimiento específico?`
};

// Función para generar respuesta basada en palabras clave
function generateResponse(userMessage) {
    const messageLower = userMessage.toLowerCase();
    
    if (messageLower.includes('empresa') || messageLower.includes('constituir') || 
        messageLower.includes('sociedad') || messageLower.includes('s.r.l') || 
        messageLower.includes('negocio')) {
        return legalResponses.empresa;
    }
    
    if (messageLower.includes('laboral') || messageLower.includes('trabajo') || 
        messageLower.includes('despido') || messageLower.includes('empleado') ||
        messageLower.includes('aguinaldo') || messageLower.includes('indemnizacion')) {
        return legalResponses.laboral;
    }
    
    if (messageLower.includes('contrato') || messageLower.includes('arrendamiento') || 
        messageLower.includes('alquiler') || messageLower.includes('arriendo')) {
        return legalResponses.contrato;
    }
    
    if (messageLower.includes('herencia') || messageLower.includes('sucesion') || 
        messageLower.includes('testamento') || messageLower.includes('heredero')) {
        return legalResponses.herencia;
    }
    
    if (messageLower.includes('penal') || messageLower.includes('delito') || 
        messageLower.includes('denuncia') || messageLower.includes('proceso penal')) {
        return legalResponses.penal;
    }
    
    return legalResponses.default;
}

// Clase principal de la aplicación
class LegadoApp {
    constructor() {
        this.db = new LegalDatabase();
        this.currentChatId = null;
        this.initElements();
        this.attachEventListeners();
        this.loadChatHistory();
        this.autoResizeTextarea();
    }

    initElements() {
        this.newChatBtn = document.getElementById('newChatBtn');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        this.messagesContainer = document.getElementById('messages');
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.chatHistory = document.getElementById('chatHistory');
        this.todayChats = document.getElementById('todayChats');
        this.yesterdayChats = document.getElementById('yesterdayChats');
        this.weekChats = document.getElementById('weekChats');
    }

    attachEventListeners() {
        this.newChatBtn.addEventListener('click', () => this.createNewChat());
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Example prompts
        document.querySelectorAll('.example-prompt').forEach(prompt => {
            prompt.addEventListener('click', () => {
                const text = prompt.dataset.prompt;
                this.messageInput.value = text;
                this.sendMessage();
            });
        });
    }

    autoResizeTextarea() {
        this.messageInput.addEventListener('input', () => {
            this.messageInput.style.height = 'auto';
            this.messageInput.style.height = this.messageInput.scrollHeight + 'px';
        });
    }

    createNewChat() {
        const chat = this.db.createChat('Nueva consulta legal');
        this.currentChatId = chat.id;
        this.db.setCurrentChatId(chat.id);
        this.loadChatHistory();
        this.clearMessages();
        this.showWelcomeScreen();
        this.messageInput.focus();
    }

    loadChatHistory() {
        const chats = this.db.getAllChats();
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const lastWeek = new Date(today);
        lastWeek.setDate(lastWeek.getDate() - 7);

        this.todayChats.innerHTML = '';
        this.yesterdayChats.innerHTML = '';
        this.weekChats.innerHTML = '';

        chats.forEach(chat => {
            const chatDate = new Date(chat.createdAt);
            const chatElement = this.createChatHistoryItem(chat);

            if (chatDate >= today) {
                this.todayChats.appendChild(chatElement);
            } else if (chatDate >= yesterday) {
                this.yesterdayChats.appendChild(chatElement);
            } else if (chatDate >= lastWeek) {
                this.weekChats.appendChild(chatElement);
            }
        });
    }

    createChatHistoryItem(chat) {
        const item = document.createElement('div');
        item.className = 'history-item';
        if (chat.id === this.currentChatId) {
            item.classList.add('active');
        }

        item.innerHTML = `
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span class="history-item-title">${chat.title}</span>
        `;

        item.addEventListener('click', () => {
            this.loadChat(chat.id);
        });

        return item;
    }

    loadChat(chatId) {
        this.currentChatId = chatId;
        this.db.setCurrentChatId(chatId);
        const chat = this.db.getChat(chatId);
        
        this.clearMessages();
        this.hideWelcomeScreen();
        
        chat.messages.forEach(msg => {
            this.displayMessage(msg.role, msg.content, false);
        });

        this.loadChatHistory();
        this.scrollToBottom();
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        // Crear nuevo chat si no existe
        if (!this.currentChatId) {
            const title = message.substring(0, 50) + (message.length > 50 ? '...' : '');
            const chat = this.db.createChat(title);
            this.currentChatId = chat.id;
            this.db.setCurrentChatId(chat.id);
        }

        this.hideWelcomeScreen();
        
        // Guardar y mostrar mensaje del usuario
        const userMessage = { role: 'user', content: message };
        this.db.addMessage(this.currentChatId, userMessage);
        this.displayMessage('user', message);
        
        this.messageInput.value = '';
        this.messageInput.style.height = 'auto';
        this.sendButton.disabled = true;

        // Simular typing
        this.showTypingIndicator();

        // Simular delay de respuesta (500-1500ms)
        const delay = 500 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));

        this.hideTypingIndicator();

        // Generar y mostrar respuesta
        const response = generateResponse(message);
        const assistantMessage = { role: 'assistant', content: response };
        this.db.addMessage(this.currentChatId, assistantMessage);
        this.displayMessage('assistant', response);

        this.sendButton.disabled = false;
        this.loadChatHistory();
        this.messageInput.focus();
    }

    displayMessage(role, content, animate = true) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        if (animate) {
            messageDiv.style.opacity = '0';
        }

        const avatarSVG = role === 'user' 
            ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>'
            : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 4L6 8V14C6 18 9 21 12 23C15 21 18 18 18 14V8L12 4Z" fill="currentColor"/></svg>';

        messageDiv.innerHTML = `
            <div class="message-avatar">
                ${avatarSVG}
            </div>
            <div class="message-content">
                <div class="message-role">${role === 'user' ? 'Tú' : 'Legado IA'}</div>
                <div class="message-text">${this.formatMessage(content)}</div>
            </div>
        `;

        this.messagesContainer.appendChild(messageDiv);

        if (animate) {
            requestAnimationFrame(() => {
                messageDiv.style.transition = 'opacity 0.3s ease';
                messageDiv.style.opacity = '1';
            });
        }

        this.scrollToBottom();
    }

    formatMessage(text) {
        // Formato básico de markdown
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n\n/g, '</p><p>')
            .replace(/\n-/g, '<li>')
            .replace(/<li>/g, '</li><li>')
            .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
            .replace(/<\/li><li><\/li>/g, '')
            .replace(/^/, '<p>')
            .replace(/$/, '</p>');
    }

    showTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message assistant typing';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 4L6 8V14C6 18 9 21 12 23C15 21 18 18 18 14V8L12 4Z" fill="currentColor"/>
                </svg>
            </div>
            <div class="message-content">
                <div class="message-role">Legado IA</div>
                <div class="typing-indicator">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    hideTypingIndicator() {
        const typing = document.getElementById('typing-indicator');
        if (typing) {
            typing.remove();
        }
    }

    showWelcomeScreen() {
        this.welcomeScreen.style.display = 'flex';
        this.messagesContainer.style.display = 'none';
    }

    hideWelcomeScreen() {
        this.welcomeScreen.style.display = 'none';
        this.messagesContainer.style.display = 'flex';
    }

    clearMessages() {
        this.messagesContainer.innerHTML = '';
    }

    scrollToBottom() {
        const chatContainer = document.getElementById('chatContainer');
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const app = new LegadoApp();
    
    // Cargar chat actual si existe
    const currentChatId = app.db.getCurrentChatId();
    if (currentChatId && app.db.getChat(currentChatId)) {
        app.loadChat(currentChatId);
    }
});
