// Mock Data & Logic for Legado IA

class LegadoManager {
    constructor() {
        this.chats = JSON.parse(localStorage.getItem('legado_chats')) || [];
        this.currentChatId = null;
        this.isLoggedIn = sessionStorage.getItem('legado_auth') === 'true';
        
        this.init();
    }

    get dateKey() {
        return new Date().toISOString().split('T')[0];
    }

    init() {
        // Elements
        this.authScreen = document.getElementById('authScreen');
        this.appInterface = document.getElementById('appInterface');
        this.loginForm = document.getElementById('loginForm');
        
        this.chatContainer = document.getElementById('chatContainer');
        this.messagesArea = document.getElementById('messages');
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.input = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendButton');
        this.newChatBtn = document.getElementById('newChatBtn');
        this.logoutBtn = document.getElementById('logoutBtn');
        
        // Mobile Elements
        this.sidebar = document.getElementById('sidebar');
        this.sidebarOverlay = document.getElementById('sidebarOverlay');
        this.mobileMenuBtn = document.getElementById('mobileMenuBtn');
        this.mobileNewChatBtn = document.getElementById('mobileNewChatBtn');

        // Logic Init
        if (this.isLoggedIn) {
            this.showApp();
        } else {
            this.showAuth();
        }

        this.seedMockData();
        this.bindEvents();
        this.renderHistory();
    }

    seedMockData() {
        if (this.chats.length === 0) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yDate = yesterday.toISOString().split('T')[0];
            
            this.chats = [
                { id: '1', title: 'Recurso de casación en Bolivia', date: this.dateKey, messages: [] },
                { id: '2', title: 'Procedimiento de divorcio', date: yDate, messages: [] },
                { id: '3', title: 'Despido injustificado', date: yDate, messages: [] },
                { id: '4', title: 'Contrato de compraventa', date: yDate, messages: [] }
            ];
            this.saveChats();
        }
    }

    bindEvents() {
        // Auth
        this.loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.login();
        });

        this.logoutBtn.addEventListener('click', () => this.logout());

        // Mobile Events
        if (this.mobileMenuBtn) {
            this.mobileMenuBtn.addEventListener('click', () => {
                this.sidebar.classList.add('open');
                this.sidebarOverlay.classList.add('active');
            });
        }
        if (this.sidebarOverlay) {
            this.sidebarOverlay.addEventListener('click', () => {
                this.sidebar.classList.remove('open');
                this.sidebarOverlay.classList.remove('active');
            });
        }
        if (this.mobileNewChatBtn) {
            this.mobileNewChatBtn.addEventListener('click', () => {
                this.createNewChat();
                this.sidebar.classList.remove('open');
                this.sidebarOverlay.classList.remove('active');
            });
        }

        // Chat
        this.input.addEventListener('input', () => {
            // Auto-grow textarea
            this.input.style.height = 'auto';
            this.input.style.height = Math.min(this.input.scrollHeight, 200) + 'px';
            this.sendBtn.disabled = this.input.value.trim() === '';
        });

        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        this.sendBtn.addEventListener('click', () => this.sendMessage());

        if (this.newChatBtn) {
            this.newChatBtn.addEventListener('click', () => this.createNewChat());
        }
        
        // Search btn (Mock alert for now)
        const searchBtn = document.getElementById('searchChatBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                alert('Funcionalidad de búsqueda en desarrollo');
            });
        }

        // Example prompts
        document.querySelectorAll('.example-card').forEach(card => {
            card.addEventListener('click', () => {
                const prompt = card.dataset.prompt;
                this.input.value = prompt;
                this.sendMessage();
                // Ensure welcome screen is hidden explicitly if sendMessage adjustment wasn't enough (redundancy fix)
                if (this.welcomeScreen) this.welcomeScreen.classList.add('hidden');
            });
        });
    }

    // --- Auth Logic ---
    login() {
        const logDiv = document.getElementById('loginLog');
        logDiv.textContent = '';
        // Simulación de login siempre exitoso
        const btn = this.loginForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Autenticando...';
        btn.disabled = true;
        console.log('[Legado] Intentando login...');

        setTimeout(() => {
            let storageOk = true;
            try {
                sessionStorage.setItem('legado_auth', 'true');
            } catch (e) {
                storageOk = false;
                console.warn('[Legado] sessionStorage falló:', e);
            }
            this.isLoggedIn = true;
            logDiv.style.color = '#0a0';
            logDiv.textContent = 'Login exitoso, cargando interfaz...';
            console.log('[Legado] Login exitoso, mostrando interfaz');
            // Forzar mostrar la app aunque falle sessionStorage
            this.showApp();
            btn.innerText = originalText;
            btn.disabled = false;
        }, 800);
    }

    logout() {
        this.isLoggedIn = false;
        sessionStorage.removeItem('legado_auth');
        this.showAuth();
        this.resetChatView();
    }

    showAuth() {
        this.authScreen.classList.remove('hidden');
        this.appInterface.classList.add('hidden');
    }

    showApp() {
        // Forzar mostrar la interfaz
        this.authScreen.classList.add('hidden');
        this.appInterface.classList.remove('hidden');
        // Forzar display por si hay conflicto de CSS
        this.authScreen.style.display = 'none';
        this.appInterface.style.display = 'flex';
        this.resetChatView();
        // Log visual de depuración
        setTimeout(() => {
            if (!this.appInterface || this.appInterface.classList.contains('hidden') || this.appInterface.style.display === 'none') {
                const logDiv = document.getElementById('loginLog');
                if (logDiv) {
                    logDiv.style.color = '#b00';
                    logDiv.textContent = 'Error: No se pudo mostrar la interfaz. Revisa la consola (F12) y verifica que app.js esté cargando.';
                }
            }
        }, 500);
    }

    // --- Chat Logic ---
    createNewChat() {
        this.currentChatId = null;
        this.resetChatView();
        this.renderHistory(); // Refresh active states
    }

    resetChatView() {
        this.messagesArea.innerHTML = '';
        this.welcomeScreen.classList.remove('hidden');
        this.input.value = '';
        this.input.style.height = 'auto';
        this.sendBtn.disabled = true;
        
        // Remove active class from sidebar
        document.querySelectorAll('.history-item').forEach(el => el.classList.remove('active'));
    }

    loadChat(chatId) {
        const chat = this.chats.find(c => c.id === chatId);
        if (!chat) return;

        this.currentChatId = chatId;
        this.welcomeScreen.classList.add('hidden');
        this.messagesArea.innerHTML = '';

        chat.messages.forEach(msg => this.appendMessageToDOM(msg.role, msg.content, false));
        
        // Scroll to bottom
        this.chatContainer.scrollTo(0, this.chatContainer.scrollHeight);

        // Update active state in sidebar
        this.renderHistory();
    }

    async sendMessage() {
        const text = this.input.value.trim();
        if (!text) return;

        // UI Updates: Hide welcome screen immediately
        this.input.value = '';
        this.input.style.height = 'auto';
        this.sendBtn.disabled = true;
        this.welcomeScreen.classList.add('hidden'); // This hides the entire welcome block

        // Create chat if new
        if (!this.currentChatId) {
            const newChat = {
                id: Date.now().toString(),
                title: text.length > 24 ? text.substring(0, 24) + '...' : text,
                date: this.dateKey,
                messages: []
            };
            this.chats.unshift(newChat);
            this.currentChatId = newChat.id;
            this.renderHistory();
        }

        // Add User Message
        this.addMessageToChat(this.currentChatId, 'user', text);
        this.appendMessageToDOM('user', text);

        // Simulate Loading
        const loadingId = this.showTyping();

        // Simulate AI Response
        const response = await this.mockResponse(text);

        // Remove loading and add Assistant Message
        this.removeTyping(loadingId);
        this.addMessageToChat(this.currentChatId, 'assistant', response);
        this.appendMessageToDOM('assistant', response);
    }

    addMessageToChat(chatId, role, content) {
        const chat = this.chats.find(c => c.id === chatId);
        if (chat) {
            chat.messages.push({ role, content, timestamp: Date.now() });
            this.saveChats();
        }
    }

    appendMessageToDOM(role, content, animate = true) {
        const div = document.createElement('div');
        div.className = `message-row ${role}`;
        
        const isUser = role === 'user';
        const avatar = isUser ? 'UL' : 
            `<svg viewBox="0 0 40 40" fill="none" style="width:20px;height:20px;"><path d="M20 4L8 10V18C8 26 14 32 20 36C26 32 32 26 32 18V10L20 4Z" fill="white"/><path d="M20 12L14 15V21C14 25 17 28 20 30C23 28 26 25 26 21V15L20 12Z" fill="#230440"/></svg>`;

        // Format content with simple markdown-like parsing
        let formattedContent = content
            .replace(/\n/g, '<br>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        div.innerHTML = `
            <div class="message-content">
                <div class="message-avatar">
                   ${isUser ? 'UL' : avatar}
                </div>
                <div class="message-text">
                    ${formattedContent}
                </div>
            </div>
        `;

        this.messagesArea.appendChild(div);
        
        if (animate) {
            div.style.opacity = '0';
            div.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, fill: 'forwards' });
        }
        
        this.chatContainer.scrollTo({ top: this.chatContainer.scrollHeight, behavior: 'smooth' });
    }

    showTyping() {
        const id = 'typing-' + Date.now();
        const div = document.createElement('div');
        div.className = 'message-row assistant';
        div.id = id;
        div.innerHTML = `
            <div class="message-content">
                <div class="message-avatar" style="background:var(--color-principal);color:white">
                    <svg viewBox="0 0 40 40" fill="none" style="width:20px;height:20px;"><path d="M20 4L8 10V18C8 26 14 32 20 36C26 32 32 26 32 18V10L20 4Z" fill="white"/><path d="M20 12L14 15V21C14 25 17 28 20 30C23 28 26 25 26 21V15L20 12Z" fill="#230440"/></svg>
                </div>
                <div class="message-text">
                    <div class="typing-dots">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>
            </div>
        `;
        this.messagesArea.appendChild(div);
        this.chatContainer.scrollTo({ top: this.chatContainer.scrollHeight, behavior: 'smooth' });
        return id;
    }

    removeTyping(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    saveChats() {
        localStorage.setItem('legado_chats', JSON.stringify(this.chats));
    }

    renderHistory() {
        const todayContainer = document.getElementById('todayChats');
        const yesterdayContainer = document.getElementById('yesterdayChats');
        // Clear lists
        todayContainer.innerHTML = '';
        yesterdayContainer.innerHTML = '';

        // Simple categorization: Today vs Older
        this.chats.forEach(chat => {
            const el = document.createElement('div');
            el.className = `history-item ${chat.id === this.currentChatId ? 'active' : ''}`;
            el.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                <span>${chat.title}</span>
            `;
            el.addEventListener('click', () => this.loadChat(chat.id));

            if (chat.date === this.dateKey) {
                todayContainer.appendChild(el);
            } else {
                yesterdayContainer.appendChild(el);
            }
        });
    }

    // --- Mock AI Brain ---
    mockResponse(input) {
        return new Promise(resolve => {
            setTimeout(() => {
                const lowerInput = input.toLowerCase();
                
                if (lowerInput.includes('sociedad') || lowerInput.includes('empresa') || lowerInput.includes('srl') || lowerInput.includes('s.r.l')) {
                    resolve(`Para constituir una **Sociedad de Responsabilidad Limitada (S.R.L.)** en Bolivia, debes seguir estos pasos clave:

1. **Control de Homonimia**: Verificar en FUNDEMPRESA (o SEPREC) que el nombre esté disponible.
2. **Minuta de Constitución**: Documento redactado por un abogado que incluye el capital social, objeto, domicilio y socios.
3. **Escritura Pública**: Protocolización de la minuta ante Notario de Fe Pública.
4. **Registro de Comercio**: Inscripción en el Registro de Comercio para obtener la Matrícula de Comercio.
5. **NIT**: Obtención del Número de Identificación Tributaria en Impuestos Nacionales.

El capital social se divide en cuotas de igual valor (múltiplos de 100 Bs) y la responsabilidad está limitada al monto de los aportes.`);
                } 
                else if (lowerInput.includes('alquiler') || lowerInput.includes('arrendamiento') || lowerInput.includes('contrato')) {
                    resolve(`En un **Contrato de Alquiler de Vivienda**, es fundamental incluir las siguientes cláusulas para seguridad de ambas partes:

* **Objeto y Ubicación**: Descripción precisa del inmueble.
* **Canon de Alquiler**: Monto mensual, fecha de pago y moneda.
* **Garantía**: Monto entregado para cubrir daños o servicios impagos al finalizar el contrato (usualmente 1 o 2 meses).
* **Plazo**: Duración del contrato (el Código Civil establece plazos máximos, pero comúnmente es 1 año).
* **Usos y Prohibiciones**: Destino exclusivo para vivienda, prohibición de subalquilar sin autorización.
* **Resolución**: Causales para terminar el contrato antes de tiempo.

Te recomiendo reconocer las firmas ante notario para darle fecha cierta al documento.`);
                }
                else if (lowerInput.includes('laboral') || lowerInput.includes('beneficios') || lowerInput.includes('despido')) {
                    resolve(`En materia **Laboral**, aquí tienes algunos puntos clave de la Ley General del Trabajo:

* **Indemnización por Tiempo de Servicios**: Corresponde un sueldo por cada año trabajado si hay despido injustificado o retiro voluntario luego de 90 días.
* **Desahucio**: Pago de 3 sueldos promedio si el despido es intempestivo y sin causa legal justificada (Artículo 16 LGT).
* **Aguinaldo**: Pago obligatorio de un sueldo completo sin descuentos antes del 20 de diciembre.
* **Vacaciones**: 
  - 1 a 5 años: 15 días hábiles
  - 5 a 10 años: 20 días hábiles
  - 10+ años: 30 días hábiles

¿Necesitas que calculemos algún beneficio específico con datos reales?`);
                }
                else {
                    resolve(`Entendido. Como **Legado IA**, estoy procesando tu consulta sobre "${input}". 

Para darte una respuesta jurídica precisa bajo la legislación boliviana, ¿podrías especificar un poco más el contexto?

Puedo ayudarte en áreas como:
* Derecho Civil (Contratos, Deudas)
* Derecho Comercial (Empresas, Sociedades)
* Derecho Laboral (Beneficios, Contratos)
* Derecho Familiar (Asistencia Familiar, Divorcios)

Por favor, proporcióname más detalles.`);
                }
            }, 1000 + Math.random() * 1500); // Random realistic delay
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.legadoApp = new LegadoManager();
});
