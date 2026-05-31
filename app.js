// BIRUTINHAS GYM - App Application Logic
// Handles offline-first state, authentication, CRUD for exercises, and JSON import/export

const DEFAULT_DATABASE = {
    "DUDA": {
        "Treino A": [
            { "id": "d1", "name": "Leg Press 45°", "sets": "4", "reps": "12" },
            { "id": "d2", "name": "Cadeira Extensora", "sets": "4", "reps": "10 a 12" },
            { "id": "d3", "name": "Mesa Flexora", "sets": "4", "reps": "12" },
            { "id": "d4", "name": "Agachamento Sumô", "sets": "4", "reps": "10" }
        ],
        "Treino B": [
            { "id": "d5", "name": "Puxada Frente (Polia)", "sets": "3", "reps": "12" },
            { "id": "d6", "name": "Elevação Lateral (Halteres)", "sets": "4", "reps": "12" },
            { "id": "d7", "name": "Rosca Direta com Barra", "sets": "3", "reps": "10" },
            { "id": "d8", "name": "Tríceps Corda na Polia", "sets": "3", "reps": "12" }
        ],
        "Treino C": []
    },
    "MAURI": {
        "Treino A": [
            { "id": "m1", "name": "Supino Reto Barra", "sets": "4", "reps": "10" },
            { "id": "m2", "name": "Supino Inclinado Halteres", "sets": "4", "reps": "12" },
            { "id": "m3", "name": "Crucifixo Máquina (Peck Deck)", "sets": "3", "reps": "12" },
            { "id": "m4", "name": "Tríceps Pulley (Barra)", "sets": "4", "reps": "10" },
            { "id": "m5", "name": "Tríceps Testa com Barra W", "sets": "3", "reps": "12" }
        ],
        "Treino B": [
            { "id": "m6", "name": "Puxada Alta Pronada", "sets": "4", "reps": "10" },
            { "id": "m7", "name": "Remada Curvada com Barra", "sets": "4", "reps": "12" },
            { "id": "m8", "name": "Crucifixo Inverso Máquina", "sets": "3", "reps": "15" },
            { "id": "m9", "name": "Rosca Martelo Halteres", "sets": "4", "reps": "10" },
            { "id": "m10", "name": "Rosca Concentrada", "sets": "3", "reps": "12" }
        ],
        "Treino C": []
    },
    "KAUAN": {
        "Treino A": [
            { "id": "k1", "name": "Agachamento Livre Barra", "sets": "5", "reps": "5" },
            { "id": "k2", "name": "Levantamento Terra", "sets": "5", "reps": "5" },
            { "id": "k3", "name": "Supino Reto Barra", "sets": "5", "reps": "5" },
            { "id": "k4", "name": "Desenvolvimento Militar Barra", "sets": "5", "reps": "5" }
        ],
        "Treino B": [
            { "id": "k5", "name": "Barra Fixa (Pull-ups)", "sets": "4", "reps": "Máximo" },
            { "id": "k6", "name": "Remada Cavalinho", "sets": "4", "reps": "10" },
            { "id": "k7", "name": "Rosca Inversa com Barra", "sets": "3", "reps": "12" },
            { "id": "k8", "name": "Flexão de Braço (Push-ups)", "sets": "4", "reps": "15" }
        ],
        "Treino C": []
    },
    "GABI": {
        "Treino A": [
            { "id": "g1", "name": "Corrida Intensa na Esteira", "sets": "1", "reps": "20 min" },
            { "id": "g2", "name": "Agachamento Livre (Peso Corporal)", "sets": "4", "reps": "15" },
            { "id": "g3", "name": "Glúteo no Cabo (Polia)", "sets": "4", "reps": "12" },
            { "id": "g4", "name": "Elevação Pélvica", "sets": "4", "reps": "15" }
        ],
        "Treino B": [
            { "id": "g5", "name": "Prancha Abdominal Estática", "sets": "4", "reps": "1 min" },
            { "id": "g6", "name": "Abdominal Infra Solo", "sets": "4", "reps": "20" },
            { "id": "g7", "name": "Bicicleta Ergométrica (Intensa)", "sets": "1", "reps": "15 min" },
            { "id": "g8", "name": "Polichinelos Velocidade", "sets": "4", "reps": "50" }
        ],
        "Treino C": []
    }
};

// State Manager
class GymApp {
    constructor() {
        this.db = this.loadDatabase();
        this.currentUser = null;
        this.currentTab = "Treino A";
        this.completedExercises = this.loadCompletedState();
        this.adminSelectedUser = "DUDA";
        this.adminSelectedTab = "Treino A";

        this.initDOM();
        this.registerSW();

        // Sincronização automática em segundo plano na abertura
        this.syncWithCloud(true);
    }

    // Carregar Banco de Dados do LocalStorage (Offline-First)
    loadDatabase() {
        const stored = localStorage.getItem('birutinhas_gym_db');
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error("Erro ao ler banco de dados do localstorage, usando padrão.", e);
            }
        }
        // Inicializar com o padrão caso não exista
        localStorage.setItem('birutinhas_gym_db', JSON.stringify(DEFAULT_DATABASE));
        return JSON.parse(JSON.stringify(DEFAULT_DATABASE)); // Cópia profunda
    }

    // Salvar no LocalStorage
    saveDatabase() {
        localStorage.setItem('birutinhas_gym_db', JSON.stringify(this.db));
    }

    // Carrega o estado de conclusão dos exercícios
    loadCompletedState() {
        const stored = localStorage.getItem('birutinhas_gym_completed');
        return stored ? JSON.parse(stored) : {};
    }

    // Salva o estado de conclusão
    saveCompletedState() {
        localStorage.setItem('birutinhas_gym_completed', JSON.stringify(this.completedExercises));
    }

    // Inicialização da interface e eventos
    initDOM() {
        // Elementos de Navegação
        this.screens = {
            login: document.getElementById('screen-login'),
            workout: document.getElementById('screen-workout'),
            adminLogin: document.getElementById('screen-admin-login'),
            adminPanel: document.getElementById('screen-admin-panel')
        };

        // Form Login Usuário
        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username').value.trim().toUpperCase();
            const pass = document.getElementById('login-password').value;

            if (["DUDA", "MAURI", "KAUAN", "GABI"].includes(username)) {
                if (pass === "1234") {
                    this.loginUser(username);
                } else {
                    this.showToast("Senha incorreta!", "error");
                }
            } else {
                this.showToast("Usuário não cadastrado!", "error");
            }
        });

        // Form Login Admin
        const adminLoginForm = document.getElementById('admin-login-form');
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const adminUser = document.getElementById('admin-username').value.trim();
            const adminPass = document.getElementById('admin-password').value;

            if (adminUser === "mkj" && adminPass === "1234") {
                this.showScreen('adminPanel');
                this.showToast("Logado como Administrador!", "success");
                this.renderAdminPanel();
            } else {
                this.showToast("Credenciais incorretas!", "error");
            }
        });

        // Eventos do Admin Panel
        document.getElementById('admin-select-user').addEventListener('change', (e) => {
            this.adminSelectedUser = e.target.value;
            this.renderAdminPanel();
        });

        document.getElementById('admin-select-tab').addEventListener('change', (e) => {
            this.adminSelectedTab = e.target.value;
            this.renderAdminPanel();
        });

        // Form de Adicionar Exercício (Admin)
        const addExerciseForm = document.getElementById('add-exercise-form');
        addExerciseForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const nameInput = document.getElementById('exercise-name-input');
            const setsInput = document.getElementById('exercise-sets-input');
            const repsInput = document.getElementById('exercise-reps-input');

            const name = nameInput.value.trim();
            const sets = setsInput.value.trim();
            const reps = repsInput.value.trim();

            if (!name || !sets || !reps) {
                this.showToast("Preencha todos os campos!", "error");
                return;
            }

            const newEx = {
                id: Math.random().toString(36).substring(2, 9),
                name: name,
                sets: sets,
                reps: reps
            };

            // Garantir que a estrutura do treino existe
            if (!this.db[this.adminSelectedUser]) {
                this.db[this.adminSelectedUser] = {};
            }
            if (!this.db[this.adminSelectedUser][this.adminSelectedTab]) {
                this.db[this.adminSelectedUser][this.adminSelectedTab] = [];
            }

            this.db[this.adminSelectedUser][this.adminSelectedTab].push(newEx);
            this.saveDatabase();
            this.renderAdminPanel();
            this.showToast("Exercício adicionado!", "success");

            // Limpar formulário
            nameInput.value = "";
            setsInput.value = "";
            repsInput.value = "";
            nameInput.focus();
        });

        // Triggers de alternar telas externas
        document.getElementById('btn-go-admin-login').addEventListener('click', () => {
            this.showScreen('adminLogin');
        });

        document.getElementById('btn-back-to-login').addEventListener('click', () => {
            this.showScreen('login');
        });

        document.getElementById('btn-admin-logout').addEventListener('click', () => {
            this.showScreen('login');
            this.showToast("Sessão Admin fechada.", "success");
        });

        document.getElementById('btn-user-logout').addEventListener('click', () => {
            this.logoutUser();
        });

        // Configuração de Sincronização em Nuvem (Botão e Status)
        const saveCloudBtn = document.getElementById('btn-save-cloud');
        const statusBadge = document.getElementById('cloud-status-badge');

        const updateConnectionStatus = () => {
            if (navigator.onLine) {
                if (statusBadge) {
                    statusBadge.innerText = "🟢 CONECTADO";
                    statusBadge.style.color = "var(--green)";
                    statusBadge.style.textShadow = "0 0 5px var(--green-glow)";
                }
            } else {
                if (statusBadge) {
                    statusBadge.innerText = "🔴 OFFLINE";
                    statusBadge.style.color = "var(--red)";
                    statusBadge.style.textShadow = "0 0 5px rgba(255, 0, 85, 0.4)";
                }
            }
        };

        // Escutar status de conexão nativa do celular
        window.addEventListener('online', updateConnectionStatus);
        window.addEventListener('offline', updateConnectionStatus);
        updateConnectionStatus(); // Checar status inicial

        if (saveCloudBtn) {
            saveCloudBtn.addEventListener('click', () => {
                this.saveToCloud(false);
            });
        }

        // Limpar inputs de login ao iniciar
        document.getElementById('login-username').value = "";
        document.getElementById('login-password').value = "";
    }

    // Sair da conta de Usuário
    logoutUser() {
        this.currentUser = null;
        this.showScreen('login');
        this.showToast("Sessão finalizada.", "success");
        document.getElementById('login-password').value = "";
    }

    // Logar Usuário
    loginUser(user) {
        this.currentUser = user;
        document.getElementById('user-avatar-initial').innerText = user.charAt(0);
        document.getElementById('user-name-span').innerText = user;
        this.currentTab = "Treino A";
        this.showScreen('workout');
        this.showToast(`Bem-vindo, ${user}! ⚡`, "success");
        this.renderWorkoutTabs();
        this.renderWorkoutExercises();

        // Sincronizar em segundo plano imediatamente para ver se há novidades
        this.syncWithCloud(true);
    }

    // Controle de Exibição de Telas
    showScreen(screenKey) {
        Object.keys(this.screens).forEach(key => {
            this.screens[key].classList.remove('active');
        });
        this.screens[screenKey].classList.add('active');
        window.scrollTo(0, 0);
    }

    // Renderiza as Abas de Treino do Aluno
    renderWorkoutTabs() {
        const tabsContainer = document.getElementById('workout-tabs-container');
        tabsContainer.innerHTML = "";
        
        const tabs = ["Treino A", "Treino B", "Treino C"];
        tabs.forEach(tab => {
            const btn = document.createElement('button');
            btn.className = `tab-btn ${this.currentTab === tab ? 'active' : ''}`;
            btn.innerText = tab;
            btn.addEventListener('click', () => {
                this.currentTab = tab;
                this.renderWorkoutTabs();
                this.renderWorkoutExercises();
            });
            tabsContainer.appendChild(btn);
        });
    }

    // Renderiza os Exercícios do Treino do Aluno
    renderWorkoutExercises() {
        const listContainer = document.getElementById('workout-exercise-list');
        listContainer.innerHTML = "";

        const exercises = this.db[this.currentUser]?.[this.currentTab] || [];

        if (exercises.length === 0) {
            listContainer.innerHTML = `
                <div class="no-exercises">
                    <p>Sem exercícios cadastrados no ${this.currentTab} ainda.</p>
                    <p style="font-size: 0.8rem; margin-top: 5px; color: var(--text-muted)">Peça para o MKJ adicionar seus exercícios!</p>
                </div>
            `;
            return;
        }

        exercises.forEach(ex => {
            const card = document.createElement('div');
            const isCompleted = this.completedExercises[`${this.currentUser}_${ex.id}`] || false;
            card.className = `exercise-card ${isCompleted ? 'completed' : ''}`;

            card.innerHTML = `
                <div class="exercise-info">
                    <div class="exercise-name">${ex.name}</div>
                    <div class="exercise-details">
                        <span class="detail-badge highlight">${ex.sets} Séries</span>
                        <span class="detail-badge">${ex.reps} Repetições</span>
                    </div>
                </div>
                <button class="check-btn ${isCompleted ? 'checked' : ''}" id="check-btn-${ex.id}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </button>
            `;

            // Clique do Checkbox de Conclusão do Exercício
            card.querySelector('.check-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                const currentStatus = this.completedExercises[`${this.currentUser}_${ex.id}`] || false;
                this.completedExercises[`${this.currentUser}_${ex.id}`] = !currentStatus;
                this.saveCompletedState();
                this.renderWorkoutExercises();
                
                if (!currentStatus) {
                    this.showToast("Série concluída! 💪", "success");
                }
            });

            listContainer.appendChild(card);
        });
    }

    // Renderiza a Tela do Painel Admin
    renderAdminPanel() {
        const listContainer = document.getElementById('admin-exercise-list');
        listContainer.innerHTML = "";

        const exercises = this.db[this.adminSelectedUser]?.[this.adminSelectedTab] || [];

        document.getElementById('admin-title-username').innerText = this.adminSelectedUser;
        document.getElementById('admin-title-tab').innerText = this.adminSelectedTab;

        if (exercises.length === 0) {
            listContainer.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); padding: 20px;">
                    Nenhum exercício cadastrado.
                </div>
            `;
            return;
        }

        exercises.forEach(ex => {
            const item = document.createElement('div');
            item.className = "admin-exercise-card";
            item.innerHTML = `
                <div>
                    <div class="admin-exercise-name">${ex.name}</div>
                    <div class="admin-exercise-meta">${ex.sets} séries x ${ex.reps} repetições</div>
                </div>
                <div class="admin-action-btns">
                    <button class="btn-icon-danger" title="Excluir exercício">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" x2="10" y1="11" y2="17"></line><line x1="14" x2="14" y1="11" y2="17"></line></svg>
                    </button>
                </div>
            `;

            // Remover Exercício
            item.querySelector('.btn-icon-danger').addEventListener('click', () => {
                this.db[this.adminSelectedUser][this.adminSelectedTab] = 
                    this.db[this.adminSelectedUser][this.adminSelectedTab].filter(itemEx => itemEx.id !== ex.id);
                this.saveDatabase();
                this.renderAdminPanel();
                this.showToast("Exercício removido!", "error");
            });

            listContainer.appendChild(item);
        });
    }

    // Exibir Toast de Notificação
    showToast(message, type = "info") {
        let toast = document.getElementById('app-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = "app-toast";
            toast.className = "toast-cyber";
            document.body.appendChild(toast);
        }

        toast.innerText = message;
        toast.className = `toast-cyber ${type} show`;

        // Ocultar após 2.5 segundos
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2500);
    }

    // Registra Service Worker para suporte offline real (PWA)
    registerSW() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('./sw.js')
                    .then(reg => console.log('Service Worker registrado com sucesso!', reg.scope))
                    .catch(err => console.warn('Falha ao registrar Service Worker:', err));
            });
        }
    }

    // Sincroniza o banco de dados local com a nuvem (KVDB)
    syncWithCloud(silent = false) {
        if (!navigator.onLine) {
            if (!silent) this.showToast("Você está offline. Usando treinos locais.", "error");
            return;
        }

        // Usamos um bucket exclusivo e seguro no KVDB.io para sincronizar os dados
        fetch('https://kvdb.io/EK1hddFu2Eg2XpuPrq9Vpz/workouts')
            .then(res => {
                if (res.status === 404) {
                    // Se o banco ainda não existe na nuvem, inicializa salvando o padrão
                    this.saveToCloud(true);
                    throw new Error("Banco vazio na nuvem, inicializando...");
                }
                return res.json();
            })
            .then(data => {
                const validKeys = ["DUDA", "MAURI", "KAUAN", "GABI"];
                const isValid = validKeys.every(k => data[k] !== undefined);

                if (isValid) {
                    const oldStr = JSON.stringify(this.db);
                    const newStr = JSON.stringify(data);
                    
                    if (oldStr !== newStr) {
                        this.db = data;
                        this.saveDatabase();
                        
                        // Atualizar as telas que estão ativas na hora
                        if (this.currentUser) {
                            this.renderWorkoutTabs();
                            this.renderWorkoutExercises();
                        }
                        if (this.screens.adminPanel.classList.contains('active')) {
                            this.renderAdminPanel();
                        }
                        
                        if (!silent) this.showToast("Treinos atualizados da nuvem! ⚡", "success");
                    }
                }
            })
            .catch(err => {
                console.log("Status de sincronização da nuvem:", err.message);
            });
    }

    // Publica o banco de dados local na nuvem (KVDB)
    saveToCloud(silent = false) {
        if (!navigator.onLine) {
            this.showToast("Sem conexão com a internet para salvar na nuvem!", "error");
            return;
        }

        const btn = document.getElementById('btn-save-cloud');
        if (btn && !silent) {
            btn.innerText = "Publicando na Nuvem... ⏳";
            btn.disabled = true;
            btn.style.opacity = "0.7";
        }

        fetch('https://kvdb.io/EK1hddFu2Eg2XpuPrq9Vpz/workouts', {
            method: 'PUT',
            body: JSON.stringify(this.db)
        })
        .then(res => {
            if (res.ok) {
                if (!silent) this.showToast("Treinos publicados na nuvem com sucesso! 🌐⚡", "success");
            } else {
                throw new Error("Erro de resposta do servidor.");
            }
        })
        .catch(err => {
            console.error(err);
            if (!silent) this.showToast("Erro ao salvar dados na nuvem!", "error");
        })
        .finally(() => {
            if (btn && !silent) {
                btn.innerText = "SALVAR E PUBLICAR NA NUVEM 🌐⚡";
                btn.disabled = false;
                btn.style.opacity = "1";
            }
        });
    }
}

// Iniciar a aplicação
window.addEventListener('DOMContentLoaded', () => {
    window.gymApp = new GymApp();
});
