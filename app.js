// Mock Data & Logic for Legado IA

class LegadoManager {
    constructor() {
        this.chats = JSON.parse(localStorage.getItem('legado_chats_en')) || [];
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
                { id: '1', title: 'Cassation appeal in Bolivia', date: this.dateKey, messages: [] },
                { id: '2', title: 'Divorce procedure', date: yDate, messages: [] },
                { id: '3', title: 'Unjustified dismissal', date: yDate, messages: [] },
                { id: '4', title: 'Sales contract', date: yDate, messages: [] }
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
                alert('Search functionality under development');
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
        // Simulate login always successful
        const btn = this.loginForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = 'Authenticating...';
        btn.disabled = true;
        console.log('[Legado] Attempting login...');

        setTimeout(() => {
            let storageOk = true;
            try {
                sessionStorage.setItem('legado_auth', 'true');
            } catch (e) {
                storageOk = false;
                console.warn('[Legado] sessionStorage failed:', e);
            }
            this.isLoggedIn = true;
            logDiv.style.color = '#0a0';
            logDiv.textContent = 'Login successful, loading interface...';
            console.log('[Legado] Login successful, showing interface');
            // Force show app even if sessionStorage fails
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
        localStorage.setItem('legado_chats_en', JSON.stringify(this.chats));
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
                    resolve(`To constitute a **Limited Liability Company (S.R.L.)** in Bolivia, you must follow these key steps:

1. **Homonymy Control**: Verify at FUNDEMPRESA (or SEPREC) that the name is available.
2. **Constitution Minute**: Document drafted by a lawyer that includes the social capital, object, domicile and partners.
3. **Public Deed**: Protocolization of the minute before a Public Notary.
4. **Commerce Registry**: Registration in the Commerce Registry to obtain the Commerce Registration.
5. **NIT**: Obtaining the Tax Identification Number at National Taxes.

The social capital is divided into quotas of equal value (multiples of 100 Bs) and liability is limited to the amount of contributions.`);
                } 
                else if (lowerInput.includes('alquiler') || lowerInput.includes('arrendamiento') || lowerInput.includes('contrato')) {
                    resolve(`In a **Housing Rental Contract**, it is essential to include the following clauses for the security of both parties:

* **Object and Location**: Precise description of the property.
* **Rental Fee**: Monthly amount, payment date and currency.
* **Guarantee**: Amount delivered to cover damages or unpaid services at the end of the contract (usually 1 or 2 months).
* **Term**: Duration of the contract (the Civil Code establishes maximum terms, but commonly it is 1 year).
* **Uses and Prohibitions**: Exclusive destination for housing, prohibition of subleasing without authorization.
* **Resolution**: Grounds for terminating the contract early.

I recommend acknowledging the signatures before a notary to give a certain date to the document.`);
                }
                else if (lowerInput.includes('laboral') || lowerInput.includes('beneficios') || lowerInput.includes('despido')) {
                    resolve(`In **Labor** matters, here are some key points of the General Labor Law:

* **Compensation for Time of Service**: Corresponds to one salary for each year worked if there is unjustified dismissal or voluntary retirement after 90 days.
* **Eviction**: Payment of 3 average salaries if the dismissal is untimely and without justified legal cause (Article 16 LGT).
* **Christmas Bonus**: Mandatory payment of a full salary without deductions before December 20.
* **Vacations**: 
  - 1 to 5 years: 15 working days
  - 5 to 10 years: 20 working days
  - 10+ years: 30 working days

Do you need us to calculate any specific benefit with real data?`);
                }
                else {
                    resolve(`Understood. As **Legado AI**, I am processing your query about "${input}". 

To give you a precise legal response under Bolivian legislation, could you specify the context a little more?

I can help you in areas such as:
* Civil Law (Contracts, Debts)
* Commercial Law (Companies, Societies)
* Labor Law (Benefits, Contracts)
* Family Law (Family Assistance, Divorces)

Please provide me with more details.`);
                }
            }, 1000 + Math.random() * 1500); // Random realistic delay
        });
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.legadoApp = new LegadoManager();
});
