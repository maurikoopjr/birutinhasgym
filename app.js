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
        "Treino C": [],
        "medidas": {
            "panturrilha": "34", "coxa": "54", "cintura": "70", "quadril": "95", "peitoral": "88",
            "antebraco": "24", "biceps": "30", "triceps": "28", "ombro": "100", "peso": "58", "altura": "1.65"
        }
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
        "Treino C": [],
        "medidas": {
            "panturrilha": "38", "coxa": "60", "cintura": "80", "quadril": "98", "peitoral": "104",
            "antebraco": "28", "biceps": "36", "triceps": "34", "ombro": "118", "peso": "76.5", "altura": "1.76"
        }
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
        "Treino C": [],
        "medidas": {
            "panturrilha": "40", "coxa": "62", "cintura": "84", "quadril": "100", "peitoral": "108",
            "antebraco": "30", "biceps": "38", "triceps": "36", "ombro": "124", "peso": "82", "altura": "1.80"
        }
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
        "Treino C": [],
        "medidas": {
            "panturrilha": "32", "coxa": "50", "cintura": "66", "quadril": "90", "peitoral": "82",
            "antebraco": "22", "biceps": "26", "triceps": "24", "ombro": "94", "peso": "52", "altura": "1.60"
        }
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

    // Carregar Banco de Dados do LocalStorage (Offline-First) com Migração Dinâmica
    loadDatabase() {
        const stored = localStorage.getItem('birutinhas_gym_db');
        let db;
        if (stored) {
            try {
                db = JSON.parse(stored);
            } catch (e) {
                console.error("Erro ao ler banco de dados do localstorage, usando padrão.", e);
                db = JSON.parse(JSON.stringify(DEFAULT_DATABASE));
            }
        } else {
            db = JSON.parse(JSON.stringify(DEFAULT_DATABASE));
        }

        // Migração dinâmica: garantir que a chave "medidas" existe para todos os usuários
        const users = ["DUDA", "MAURI", "KAUAN", "GABI"];
        let migrated = false;
        users.forEach(u => {
            if (db[u]) {
                if (!db[u].medidas) {
                    db[u].medidas = {
                        panturrilha: "",
                        coxa: "",
                        cintura: "",
                        quadril: "",
                        peitoral: "",
                        antebraco: "",
                        biceps: "",
                        triceps: "",
                        ombro: "",
                        peso: "",
                        altura: ""
                    };
                    migrated = true;
                }
            }
        });

        if (migrated) {
            localStorage.setItem('birutinhas_gym_db', JSON.stringify(db));
        }
        return db;
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
                this.triggerCapyLoadingOverlay(() => {
                    this.showScreen('adminPanel');
                    this.showToast("Logado como Administrador!", "success");
                    
                    // Resetar o controle de abas do editor admin para Exercícios ao logar
                    const btnAdminWorkouts = document.getElementById('btn-admin-show-workouts');
                    const btnAdminMeasurements = document.getElementById('btn-admin-show-measurements');
                    const viewAdminWorkouts = document.getElementById('admin-workouts-view');
                    const viewAdminMeasurements = document.getElementById('admin-measurements-view');
                    
                    if (btnAdminWorkouts && btnAdminMeasurements && viewAdminWorkouts && viewAdminMeasurements) {
                        btnAdminWorkouts.classList.add('active');
                        btnAdminMeasurements.classList.remove('active');
                        viewAdminWorkouts.classList.add('active');
                        viewAdminMeasurements.classList.remove('active');
                    }
                    
                    this.renderAdminPanel();
                });
            } else {
                this.showToast("Credenciais incorretas!", "error");
            }
        });

        // Lógica de Seletores Customizados (Alunos)
        const userSelector = document.getElementById('admin-user-selector');
        if (userSelector) {
            const buttons = userSelector.querySelectorAll('.selector-pill');
            buttons.forEach(btn => {
                btn.addEventListener('click', () => {
                    buttons.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    this.adminSelectedUser = btn.getAttribute('data-value');
                    this.renderAdminPanel();
                });
            });
        }

        // Lógica do Dropdown Customizado (Planilha de Treino)
        const workoutDropdown = document.getElementById('admin-workout-dropdown');
        if (workoutDropdown) {
            const trigger = workoutDropdown.querySelector('.cyber-dropdown-trigger');
            const optionsContainer = workoutDropdown.querySelector('.cyber-dropdown-options');
            const options = workoutDropdown.querySelectorAll('.cyber-dropdown-option');
            const label = document.getElementById('admin-selected-tab-label');

            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                workoutDropdown.classList.toggle('open');
            });

            options.forEach(opt => {
                opt.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const val = opt.getAttribute('data-value');
                    
                    // Fechar dropdown e atualizar label
                    workoutDropdown.classList.remove('open');
                    if (label) label.innerText = val;
                    
                    // Atualizar classe ativa das opções
                    options.forEach(o => o.classList.remove('active'));
                    opt.classList.add('active');
                    
                    // Atualizar estado e renderizar
                    this.adminSelectedTab = val;
                    const tabTitle = document.getElementById('admin-title-tab');
                    if (tabTitle) tabTitle.innerText = val;
                    this.renderAdminPanel();
                });
            });

            // Fechar ao clicar fora
            document.addEventListener('click', () => {
                workoutDropdown.classList.remove('open');
            });
        }

        // Lógica do Modal Dual (Adicionar / Editar)
        const modal = document.getElementById('exercise-modal');
        const modalForm = document.getElementById('exercise-form');
        const modalTitle = document.getElementById('modal-title-text');
        const modalSubmitBtn = document.getElementById('btn-modal-submit');
        const modalDeleteBtn = document.getElementById('btn-modal-delete');
        
        const nameInput = document.getElementById('exercise-name-input');
        const setsInput = document.getElementById('exercise-sets-input');
        const repsInput = document.getElementById('exercise-reps-input');
        const idInput = document.getElementById('exercise-id-input');

        // Helpers de abrir/fechar modal
        this.openModal = (mode, exData = null) => {
            if (!modal) return;
            
            if (mode === 'add') {
                if (modalTitle) modalTitle.innerText = "NOVO EXERCÍCIO";
                if (modalSubmitBtn) modalSubmitBtn.innerText = "ADICIONAR AO TREINO 🏋️‍♂️";
                if (modalDeleteBtn) modalDeleteBtn.style.display = "none";
                
                // Limpar campos
                if (idInput) idInput.value = "";
                if (nameInput) nameInput.value = "";
                if (setsInput) setsInput.value = "";
                if (repsInput) repsInput.value = "";
            } else if (mode === 'edit' && exData) {
                if (modalTitle) modalTitle.innerText = "EDITAR EXERCÍCIO";
                if (modalSubmitBtn) modalSubmitBtn.innerText = "SALVAR ALTERAÇÕES 💾";
                if (modalDeleteBtn) modalDeleteBtn.style.display = "block";
                
                // Preencher campos
                if (idInput) idInput.value = exData.id;
                if (nameInput) nameInput.value = exData.name;
                if (setsInput) setsInput.value = exData.sets;
                if (repsInput) repsInput.value = exData.reps;
            }
            
            modal.classList.add('active');
            if (nameInput) nameInput.focus();
        };

        this.closeModal = () => {
            if (modal) modal.classList.remove('active');
        };

        // Eventos para abrir e fechar modal
        const btnOpenAddModal = document.getElementById('btn-open-add-modal');
        if (btnOpenAddModal) {
            btnOpenAddModal.addEventListener('click', () => {
                this.openModal('add');
            });
        }

        const btnCloseModal = document.getElementById('btn-close-modal');
        if (btnCloseModal) {
            btnCloseModal.addEventListener('click', () => {
                this.closeModal();
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // Submissão do Form (Dual: Salvar Edição ou Criar Novo)
        if (modalForm) {
            modalForm.addEventListener('submit', (e) => {
                e.preventDefault();
                
                const name = nameInput.value.trim();
                const sets = setsInput.value.trim();
                const reps = repsInput.value.trim();
                const id = idInput.value.trim();

                if (!name || !sets || !reps) {
                    this.showToast("Preencha todos os campos!", "error");
                    return;
                }

                // Garantir que a estrutura do treino existe
                if (!this.db[this.adminSelectedUser]) {
                    this.db[this.adminSelectedUser] = {};
                }
                if (!this.db[this.adminSelectedUser][this.adminSelectedTab]) {
                    this.db[this.adminSelectedUser][this.adminSelectedTab] = [];
                }

                if (id) {
                    // MODO EDIÇÃO
                    const exercises = this.db[this.adminSelectedUser][this.adminSelectedTab];
                    const idx = exercises.findIndex(ex => ex.id === id);
                    if (idx !== -1) {
                        exercises[idx] = { id, name, sets, reps };
                        this.showToast("Exercício atualizado com sucesso! 💾⚡", "success");
                    }
                } else {
                    // MODO ADIÇÃO
                    const newEx = {
                        id: Math.random().toString(36).substring(2, 9),
                        name: name,
                        sets: sets,
                        reps: reps
                    };
                    this.db[this.adminSelectedUser][this.adminSelectedTab].push(newEx);
                    this.showToast("Exercício adicionado! 🏋️‍♂️💪", "success");
                }

                this.saveDatabase();
                this.renderAdminPanel();
                this.closeModal();
            });
        }

        // Ação de Excluir de dentro do Modal
        if (modalDeleteBtn) {
            modalDeleteBtn.addEventListener('click', () => {
                const id = idInput.value.trim();
                if (!id) return;
                
                this.db[this.adminSelectedUser][this.adminSelectedTab] = 
                    this.db[this.adminSelectedUser][this.adminSelectedTab].filter(ex => ex.id !== id);
                
                this.saveDatabase();
                this.renderAdminPanel();
                this.closeModal();
                this.showToast("Exercício excluído!", "error");
            });
        }

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

        // ==========================================================================
        // EVENTOS DAS ABAS SEGMENTADAS (TREINO VS MEDIDAS)
        // ==========================================================================

        // 1. Alternador na Tela do Aluno
        const btnShowWorkouts = document.getElementById('btn-show-workouts');
        const btnShowMeasurements = document.getElementById('btn-show-measurements');
        const viewStudentWorkouts = document.getElementById('student-workouts-view');
        const viewStudentMeasurements = document.getElementById('student-measurements-view');

        if (btnShowWorkouts && btnShowMeasurements && viewStudentWorkouts && viewStudentMeasurements) {
            btnShowWorkouts.addEventListener('click', () => {
                btnShowWorkouts.classList.add('active');
                btnShowMeasurements.classList.remove('active');
                viewStudentWorkouts.classList.add('active');
                viewStudentMeasurements.classList.remove('active');
                this.renderWorkoutExercises();
            });

            btnShowMeasurements.addEventListener('click', () => {
                btnShowMeasurements.classList.add('active');
                btnShowWorkouts.classList.remove('active');
                viewStudentMeasurements.classList.add('active');
                viewStudentWorkouts.classList.remove('active');
                this.renderWorkoutMeasurements();
            });
        }

        // 2. Alternador na Tela do Admin
        const btnAdminShowWorkouts = document.getElementById('btn-admin-show-workouts');
        const btnAdminShowMeasurements = document.getElementById('btn-admin-show-measurements');
        const viewAdminWorkouts = document.getElementById('admin-workouts-view');
        const viewAdminMeasurements = document.getElementById('admin-measurements-view');

        if (btnAdminShowWorkouts && btnAdminShowMeasurements && viewAdminWorkouts && viewAdminMeasurements) {
            btnAdminShowWorkouts.addEventListener('click', () => {
                btnAdminShowWorkouts.classList.add('active');
                btnAdminShowMeasurements.classList.remove('active');
                viewAdminWorkouts.classList.add('active');
                viewAdminMeasurements.classList.remove('active');
                this.renderAdminPanel();
            });

            btnAdminShowMeasurements.addEventListener('click', () => {
                btnAdminShowMeasurements.classList.add('active');
                btnAdminShowWorkouts.classList.remove('active');
                viewAdminMeasurements.classList.add('active');
                viewAdminWorkouts.classList.remove('active');
                this.renderAdminMeasurementsForm();
            });
        }

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

    // Logar Aluno acionando a animação da Capivara Sofrendo
    loginUser(user) {
        this.triggerCapyLoadingOverlay(() => {
            this.currentUser = user;
            document.getElementById('user-avatar-initial').innerText = user.charAt(0);
            document.getElementById('user-name-span').innerText = user;
            this.currentTab = "Treino A";
            this.showScreen('workout');
            this.showToast(`Bem-vindo, ${user}! ⚡`, "success");
            
            // Resetar o controle de abas segmentadas para Treinos ao logar
            const btnWorkouts = document.getElementById('btn-show-workouts');
            const btnMeasurements = document.getElementById('btn-show-measurements');
            const viewStudentWorkouts = document.getElementById('student-workouts-view');
            const viewStudentMeasurements = document.getElementById('student-measurements-view');
            
            if (btnWorkouts && btnMeasurements && viewStudentWorkouts && viewStudentMeasurements) {
                btnWorkouts.classList.add('active');
                btnMeasurements.classList.remove('active');
                viewStudentWorkouts.classList.add('active');
                viewStudentMeasurements.classList.remove('active');
            }

            this.renderWorkoutTabs();
            this.renderWorkoutExercises();

            // Sincronizar em segundo plano imediatamente para ver se há novidades
            this.syncWithCloud(true);
        });
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

    // Renderiza a Tela do Painel Admin (Fidelidade Mockup e Correção de Bugs)
    renderAdminPanel() {
        const gridContainer = document.getElementById('admin-exercise-grid');
        if (!gridContainer) return;
        gridContainer.innerHTML = "";

        const exercises = this.db[this.adminSelectedUser]?.[this.adminSelectedTab] || [];

        // Atualizar aba ativa no título de forma segura
        const tabTitle = document.getElementById('admin-title-tab');
        if (tabTitle) tabTitle.innerText = this.adminSelectedTab;

        // Recarregar o formulário de medidas ao mudar de aluno se a aba de medidas estiver ativa
        const viewAdminMeasurements = document.getElementById('admin-measurements-view');
        if (viewAdminMeasurements && viewAdminMeasurements.classList.contains('active')) {
            this.renderAdminMeasurementsForm();
        }

        if (exercises.length === 0) {
            gridContainer.innerHTML = `
                <div style="text-align: center; color: var(--text-muted); padding: 40px 20px; grid-column: span 2; border: 1px dashed var(--border-color); border-radius: 12px; background: rgba(0,0,0,0.15);">
                    Nenhum exercício cadastrado no ${this.adminSelectedTab} ainda.
                </div>
            `;
            return;
        }

        exercises.forEach((ex, idx) => {
            const card = document.createElement('div');
            card.className = "admin-exercise-card";
            card.innerHTML = `
                <button class="card-kebab-btn" title="Excluir Exercício">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-more-vertical"><circle cx="12" cy="12" r="1"></circle><circle cx="12" cy="5" r="1"></circle><circle cx="12" cy="19" r="1"></circle></svg>
                </button>
                <div class="card-content-wrap">
                    <div class="card-title">${idx + 1}. ${ex.name}</div>
                    <div class="card-details-text">${ex.sets} séries | ${ex.reps} reps</div>
                    <div class="card-badges-row">
                        <div class="card-badge-item" title="Peso livre / Halteres">
                            <svg class="badge-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6.5 6.5 11 11"/><path d="m21 21-1-1"/><path d="m3 3 1 1"/><path d="m18.5 5.5 3 3"/><path d="m2.5 15.5 3 3"/><path d="m16 5 3 3"/><path d="m5 16 3 3"/><path d="m7.5 4.5 12 12"/><path d="m4.5 7.5 12 12"/></svg>
                            <span class="badge-text">Barbell</span>
                        </div>
                        <div class="card-badge-item" title="Observações">
                            <svg class="badge-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/></svg>
                            <span class="badge-text">Note</span>
                        </div>
                        <div class="card-badge-item" title="Repetições">
                            <svg class="badge-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
                            <span class="badge-text">Reps</span>
                        </div>
                    </div>
                </div>
                <button class="card-edit-btn" title="Editar Exercício">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-pencil"><path d="M12 20h9"></path><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                </button>
            `;

            // Evento de Editar (Lápis)
            card.querySelector('.card-edit-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.openModal('edit', ex);
            });

            // Evento de Excluir Rápido (Kebab)
            card.querySelector('.card-kebab-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                if (confirm(`Excluir o exercício "${ex.name}"?`)) {
                    this.db[this.adminSelectedUser][this.adminSelectedTab] = 
                        this.db[this.adminSelectedUser][this.adminSelectedTab].filter(itemEx => itemEx.id !== ex.id);
                    this.saveDatabase();
                    this.renderAdminPanel();
                    this.showToast("Exercício removido!", "error");
                }
            });

            gridContainer.appendChild(card);
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

    // Sincroniza o banco de dados local com a nuvem (KVDB) com Migração Adaptativa
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
                    // MIGRAR PAYLOAD ONLINE (Garantir chave medidas nas informações da nuvem)
                    const users = ["DUDA", "MAURI", "KAUAN", "GABI"];
                    users.forEach(u => {
                        if (data[u] && !data[u].medidas) {
                            data[u].medidas = {
                                panturrilha: "",
                                coxa: "",
                                cintura: "",
                                quadril: "",
                                peitoral: "",
                                antebraco: "",
                                biceps: "",
                                triceps: "",
                                ombro: "",
                                peso: "",
                                altura: ""
                            };
                        }
                    });

                    const oldStr = JSON.stringify(this.db);
                    const newStr = JSON.stringify(data);
                    
                    if (oldStr !== newStr) {
                        this.db = data;
                        this.saveDatabase();
                        
                        // Atualizar as telas que estão ativas na hora
                        if (this.currentUser) {
                            const viewStudentMeasurements = document.getElementById('student-measurements-view');
                            if (viewStudentMeasurements && viewStudentMeasurements.classList.contains('active')) {
                                this.renderWorkoutMeasurements();
                            } else {
                                this.renderWorkoutTabs();
                                this.renderWorkoutExercises();
                            }
                        }
                        if (this.screens.adminPanel.classList.contains('active')) {
                            const viewAdminMeasurements = document.getElementById('admin-measurements-view');
                            if (viewAdminMeasurements && viewAdminMeasurements.classList.contains('active')) {
                                this.renderAdminMeasurementsForm();
                            } else {
                                this.renderAdminPanel();
                            }
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

    // ==========================================================================
    // MÉTODOS COMPLEMENTARES - MÓDULO DE MEDIDAS & IMC
    // ==========================================================================

    // Cálculo dinâmico e classificação de IMC
    calculateIMC(pesoStr, alturaStr) {
        const peso = parseFloat(pesoStr?.replace(',', '.'));
        const altura = parseFloat(alturaStr?.replace(',', '.'));
        
        if (isNaN(peso) || isNaN(altura) || peso <= 0 || altura <= 0) {
            return {
                value: "-",
                badge: "PENDENTE",
                class: "imc-normal",
                desc: "Preencha o peso e a altura no painel de medidas para calcular seu IMC automaticamente."
            };
        }
        
        const imc = peso / (altura * altura);
        const imcFixed = imc.toFixed(1);
        
        if (imc < 18.5) {
            return {
                value: imcFixed,
                badge: "ABAIXO DO PESO",
                class: "imc-under",
                desc: "Seu Índice de Massa Corporal indica que você está abaixo da faixa recomendada. Foque em superavit calórico e treinos de força! 💪"
            };
        } else if (imc >= 18.5 && imc < 25) {
            return {
                value: imcFixed,
                badge: "PESO NORMAL",
                class: "imc-normal",
                desc: "Parabéns! Seu Índice de Massa Corporal está na faixa saudável recomendada pela OMS. Continue mantendo seus bons hábitos! ⚡"
            };
        } else if (imc >= 25 && imc < 30) {
            return {
                value: imcFixed,
                badge: "SOBREPESO",
                class: "imc-over",
                desc: "Seu Índice de Massa Corporal indica sobrepeso leve. Não desanime! Mantenha a consistência nos treinos e ajuste a alimentação."
            };
        } else {
            return {
                value: imcFixed,
                badge: "OBESIDADE",
                class: "imc-obese",
                desc: "Seu Índice de Massa Corporal está na faixa de obesidade. Foque em consistência, reeducação alimentar e treinos cardiovasculares."
            };
        }
    }

    // Renderiza as medidas salvas para o Aluno
    renderWorkoutMeasurements() {
        const grid = document.getElementById('student-measurements-grid');
        const imcCard = document.getElementById('student-imc-card');
        if (!grid || !imcCard) return;
        
        const medidas = this.db[this.currentUser]?.medidas || {
            panturrilha: "", coxa: "", cintura: "", quadril: "", peitoral: "",
            antebraco: "", biceps: "", triceps: "", ombro: "", peso: "", altura: ""
        };
        
        const labels = {
            panturrilha: "Panturrilha",
            coxa: "Coxa",
            cintura: "Cintura",
            quadril: "Quadril",
            peitoral: "Peitoral",
            antebraco: "Antebraço",
            biceps: "Bíceps",
            triceps: "Tríceps",
            ombro: "Ombro",
            peso: "Peso",
            altura: "Altura"
        };
        
        const suffixes = {
            peso: " kg",
            altura: " m"
        };
        
        grid.innerHTML = "";
        Object.keys(labels).forEach(key => {
            const suffix = suffixes[key] || " cm";
            const val = medidas[key] ? `${medidas[key]}${suffix}` : "--";
            
            const item = document.createElement('div');
            item.className = "measurement-item-box";
            item.innerHTML = `
                <span class="measurement-item-label">${labels[key]}</span>
                <span class="measurement-item-value">${val}</span>
            `;
            grid.appendChild(item);
        });
        
        // Calcular e Renderizar IMC do Aluno
        const imcInfo = this.calculateIMC(medidas.peso, medidas.altura);
        imcCard.className = `login-card imc-result-card ${imcInfo.class}`;
        imcCard.innerHTML = `
            <div class="imc-header-row">
                <span class="imc-title">Cálculo de IMC</span>
                <span class="imc-status-badge">${imcInfo.badge}</span>
            </div>
            <div class="imc-value-display">${imcInfo.value}</div>
            <p class="imc-desc">${imcInfo.desc}</p>
        `;
    }

    // Carrega e gerencia os formulários administrativos de medidas
    renderAdminMeasurementsForm() {
        const form = document.getElementById('admin-measurements-form');
        if (!form) return;
        
        const medidas = this.db[this.adminSelectedUser]?.medidas || {
            panturrilha: "", coxa: "", cintura: "", quadril: "", peitoral: "",
            antebraco: "", biceps: "", triceps: "", ombro: "", peso: "", altura: ""
        };
        
        const keys = ["panturrilha", "coxa", "cintura", "quadril", "peitoral", "antebraco", "biceps", "triceps", "ombro", "peso", "altura"];
        
        keys.forEach(key => {
            const input = document.getElementById(`m-${key}`);
            if (input) {
                input.value = medidas[key] || "";
                
                // Gravação instantânea no LocalStorage ao digitar
                input.oninput = () => {
                    if (!this.db[this.adminSelectedUser].medidas) {
                        this.db[this.adminSelectedUser].medidas = {};
                    }
                    this.db[this.adminSelectedUser].medidas[key] = input.value.trim();
                    this.saveDatabase();
                    this.renderAdminIMCLive();
                };
            }
        });
        
        this.renderAdminIMCLive();
    }

    // Prévia IMC ao vivo para o Admin
    renderAdminIMCLive() {
        const imcCard = document.getElementById('admin-imc-live-card');
        if (!imcCard) return;
        
        const medidas = this.db[this.adminSelectedUser]?.medidas || { peso: "", altura: "" };
        const imcInfo = this.calculateIMC(medidas.peso, medidas.altura);
        
        imcCard.className = `login-card imc-result-card ${imcInfo.class}`;
        imcCard.innerHTML = `
            <div class="imc-header-row">
                <span class="imc-title">IMC Prévia (Ao Vivo)</span>
                <span class="imc-status-badge">${imcInfo.badge}</span>
            </div>
            <div class="imc-value-display">${imcInfo.value}</div>
            <p class="imc-desc" style="font-size: 0.78rem; margin-top: 4px;">Alterações salvas localmente ao digitar. Clique no botão de Salvar no final da página para publicar as alterações na Nuvem.</p>
        `;
    }

    // Gerencia o overlay hilarante de carregamento da Capivara Sofrendo
    triggerCapyLoadingOverlay(onComplete) {
        const overlay = document.getElementById('capy-loading-overlay');
        const messageEl = document.getElementById('capy-loading-message');
        if (!overlay) {
            onComplete();
            return;
        }

        const messages = [
            "CARREGANDO FICHA... (E SOFRENDO COMO ESSA CAPIVARA) 🥵🏋️‍♂️",
            "INICIANDO MODO SOFRIMENTO COM PESOS... 💀🏋️‍♂️",
            "A CAPIVARA JÁ TÁ CHORANDO, AGORA É SUA VEZ! 😭🏋️‍♂️",
            "CALIBRANDO OS MÚSCULOS... PREPARA O LOMBAR! 🥵",
            "PROCURANDO FORÇAS DO ALÉM PARA ESSE AGACHAMENTO... 🧠⚡",
            "LEVANTANDO PESO DE VERDADE... OU QUASE ISSO! 🏋️‍♂️💀"
        ];

        // Escolher frase de sofrimento aleatória hilarante
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        if (messageEl) messageEl.innerText = randomMsg;

        // Limpar estados antigos e ativar overlay
        overlay.classList.remove('fade-out');
        overlay.classList.add('active');

        // Aguardar exatamente 5 segundos de carregamento / sofrimento
        setTimeout(() => {
            // Iniciar o efeito fade-out suave de 500ms
            overlay.classList.add('fade-out');
            
            setTimeout(() => {
                overlay.classList.remove('active', 'fade-out');
                onComplete(); // Seguir com o login real!
            }, 500);
        }, 5000);
    }
}

// Iniciar a aplicação
window.addEventListener('DOMContentLoaded', () => {
    window.gymApp = new GymApp();
});
