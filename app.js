/**
 * Aplicação Principal
 * Lógica central com sincronização em tempo real
 */

class ScalaLouvorApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.currentUser = null;
        this.voiceMembers = [];
        this.bandMembers = [];
        this.songs = [];
        this.scales = [];
        this.syncTimer = null;
    }

    async init() {
        console.log('🚀 Iniciando aplicação...');
        
        // Inicializar autenticação
        await auth.init();
        
        // Inscrever em mudanças de autenticação
        auth.subscribe((authState) => {
            this.currentUser = authState.user;
            if (authState.isAuthenticated) {
                this.loadData();
                this.renderApp();
                this.setupRealTimeSync();
            } else {
                this.renderLogin();
            }
        });

        // Verificar se já está autenticado
        if (auth.isAuthenticated()) {
            this.currentUser = auth.getUser();
            this.loadData();
            this.renderApp();
            this.setupRealTimeSync();
        } else {
            this.renderLogin();
        }
    }

    /**
     * Configura sincronização em tempo real
     */
    setupRealTimeSync() {
        // Inscrever em mudanças de membros vocais
        db.onDataChange('voice_members', () => {
            console.log('📡 Sincronizando membros vocais...');
            this.loadVoiceMembers();
        });

        // Inscrever em mudanças de músicos da banda
        db.onDataChange('band_members', () => {
            console.log('📡 Sincronizando músicos da banda...');
            this.loadBandMembers();
        });

        // Inscrever em mudanças de músicas
        db.onDataChange('songs', () => {
            console.log('📡 Sincronizando músicas...');
            this.loadSongs();
        });

        // Inscrever em mudanças de escalas
        db.onDataChange('scales', () => {
            console.log('📡 Sincronizando escalas...');
            this.loadScales();
        });

        // Sincronização periódica
        this.syncTimer = setInterval(() => {
            this.loadData();
        }, CONFIG.SYNC_INTERVAL);
    }

    /**
     * Carrega todos os dados
     */
    async loadData() {
        try {
            await this.loadVoiceMembers();
            await this.loadBandMembers();
            await this.loadSongs();
            await this.loadScales();
            console.log('✅ Dados sincronizados');
        } catch (error) {
            console.error('Erro ao carregar dados:', error);
        }
    }

    async loadVoiceMembers() {
        const result = await db.getVoiceMembers();
        if (result.success) {
            this.voiceMembers = result.data;
            this.renderPageIfActive('vocal-members');
        }
    }

    async loadBandMembers() {
        const result = await db.getBandMembers();
        if (result.success) {
            this.bandMembers = result.data;
            this.renderPageIfActive('band-members');
        }
    }

    async loadSongs() {
        const result = await db.getSongs();
        if (result.success) {
            this.songs = result.data;
            this.renderPageIfActive('songs');
            this.renderPageIfActive('history');
        }
    }

    async loadScales() {
        const result = await db.getScales();
        if (result.success) {
            this.scales = result.data;
            this.renderPageIfActive('vocal-scales');
            this.renderPageIfActive('band-scales');
        }
    }

    /**
     * Renderiza página se estiver ativa
     */
    renderPageIfActive(pageName) {
        if (this.currentPage === pageName) {
            this.renderPage(pageName);
        }
    }

    renderLogin() {
        const app = document.getElementById('app');
        app.innerHTML = '';
        app.className = 'login-page';

        const container = document.createElement('div');
        container.className = 'login-container';

        const title = document.createElement('h1');
        title.textContent = CONFIG.APP_NAME;
        container.appendChild(title);

        const form = document.createElement('form');
        form.className = 'login-form';

        const emailInput = UI.input('email', 'Email');
        const passwordInput = UI.input('password', 'Senha');
        const loginBtn = UI.button('Entrar', () => this.handleLogin(form), 'btn-primary');
        const registerBtn = UI.button('Criar Conta', () => this.showRegisterForm(), 'btn-secondary');

        form.appendChild(emailInput);
        form.appendChild(passwordInput);
        form.appendChild(loginBtn);
        form.appendChild(registerBtn);

        container.appendChild(form);
        app.appendChild(container);
    }

    async handleLogin(form) {
        const email = form.querySelector('input[type="email"]').value;
        const password = form.querySelector('input[type="password"]').value;

        if (!email || !password) {
            UI.toast('Preencha todos os campos', 'warning');
            return;
        }

        const result = await auth.login(email, password);
        if (!result.success) {
            UI.toast(result.error, 'error');
        }
    }

    showRegisterForm() {
        const modal = UI.modal('Criar Conta', '', [
            {
                text: 'Registrar',
                className: 'btn-primary',
                onClick: () => this.handleRegister()
            }
        ]);

        const form = UI.form([
            { name: 'name', label: 'Nome', type: 'text', placeholder: 'Seu nome', required: true },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'seu@email.com', required: true },
            { name: 'password', label: 'Senha', type: 'password', placeholder: 'Sua senha', required: true }
        ]);

        modal.querySelector('.modal-content').appendChild(form);
        document.body.appendChild(modal);
    }

    async handleRegister() {
        const form = document.querySelector('.form');
        const name = form.querySelector('input[name="name"]').value;
        const email = form.querySelector('input[name="email"]').value;
        const password = form.querySelector('input[name="password"]').value;

        if (!name || !email || !password) {
            UI.toast('Preencha todos os campos', 'warning');
            return;
        }

        const result = await auth.register(email, password, name);
        if (!result.success) {
            UI.toast(result.error, 'error');
        } else {
            UI.toast(result.message, 'success');
        }
    }

    renderApp() {
        const app = document.getElementById('app');
        app.innerHTML = '';
        app.className = 'app-container';

        // Sidebar
        const sidebar = this.createSidebar();
        app.appendChild(sidebar);

        // Main content
        const main = document.createElement('main');
        main.className = 'main-content';

        // Header
        const header = this.createHeader();
        main.appendChild(header);

        // Page content
        const content = document.createElement('div');
        content.id = 'page-content';
        content.className = 'page-content';
        main.appendChild(content);

        app.appendChild(main);

        // Renderizar página atual
        this.renderPage(this.currentPage);
    }

    createSidebar() {
        const items = [
            { label: '📊 Dashboard', href: '#', onClick: () => this.navigateTo('dashboard') },
            { label: '👥 Membros Vocais', href: '#', onClick: () => this.navigateTo('vocal-members') },
            { label: '🎸 Músicos da Banda', href: '#', onClick: () => this.navigateTo('band-members') },
            { label: '🎵 Escalas Vocais', href: '#', onClick: () => this.navigateTo('vocal-scales') },
            { label: '🎼 Escalas Banda', href: '#', onClick: () => this.navigateTo('band-scales') },
            { label: '🎶 Músicas', href: '#', onClick: () => this.navigateTo('songs') },
            { label: '📅 Histórico', href: '#', onClick: () => this.navigateTo('history') },
            { label: '⚙️ Configurações', href: '#', onClick: () => this.navigateTo('settings') }
        ];

        const sidebar = UI.sidebar(items);
        const logoutBtn = UI.button('🚪 Sair', () => this.handleLogout(), 'btn-logout');
        sidebar.appendChild(logoutBtn);

        return sidebar;
    }

    createHeader() {
        const header = document.createElement('header');
        header.className = 'app-header';

        const title = document.createElement('h1');
        title.textContent = CONFIG.APP_NAME;

        const userInfo = document.createElement('div');
        userInfo.className = 'user-info';
        userInfo.textContent = `👤 ${this.currentUser?.email || 'Anônimo'}`;

        header.appendChild(title);
        header.appendChild(userInfo);

        return header;
    }

    navigateTo(page) {
        this.currentPage = page;
        this.renderPage(page);
    }

    renderPage(page) {
        const content = document.getElementById('page-content');
        if (!content) return;

        content.innerHTML = '';

        switch (page) {
            case 'dashboard':
                this.renderDashboard(content);
                break;
            case 'vocal-members':
                this.renderVocalMembers(content);
                break;
            case 'band-members':
                this.renderBandMembers(content);
                break;
            case 'vocal-scales':
                this.renderVocalScales(content);
                break;
            case 'band-scales':
                this.renderBandScales(content);
                break;
            case 'songs':
                this.renderSongs(content);
                break;
            case 'history':
                this.renderHistory(content);
                break;
            case 'settings':
                this.renderSettings(content);
                break;
            default:
                this.renderDashboard(content);
        }
    }

    renderDashboard(container) {
        container.innerHTML = '<h2>Dashboard</h2>';
        
        const stats = document.createElement('div');
        stats.className = 'stats-grid';

        const cards = [
            { title: 'Membros Vocais', value: this.voiceMembers.length, icon: '👥' },
            { title: 'Músicos da Banda', value: this.bandMembers.length, icon: '🎸' },
            { title: 'Músicas', value: this.songs.length, icon: '🎶' },
            { title: 'Escalas', value: this.scales.length, icon: '📋' }
        ];

        cards.forEach(card => {
            const cardEl = UI.card(
                `${card.icon} ${card.title}`,
                `<p class="stat-value">${card.value}</p>`
            );
            stats.appendChild(cardEl);
        });

        container.appendChild(stats);
    }

    renderVocalMembers(container) {
        container.innerHTML = '<h2>👥 Membros Vocais</h2>';
        
        const addBtn = UI.button('+ Adicionar Membro', () => this.showAddVoiceMemberForm(), 'btn-primary');
        container.appendChild(addBtn);

        const list = document.createElement('div');
        list.className = 'members-list';

        if (this.voiceMembers.length === 0) {
            list.innerHTML = '<p class="empty-state">Nenhum membro vocal cadastrado</p>';
        } else {
            this.voiceMembers.forEach(member => {
                const card = UI.card(
                    member.name,
                    `<p><strong>Naipe:</strong> ${member.naipe}</p><p><strong>Email:</strong> ${member.email || 'N/A'}</p><p><strong>Telefone:</strong> ${member.phone || 'N/A'}</p>`
                );
                list.appendChild(card);
            });
        }

        container.appendChild(list);
    }

    renderBandMembers(container) {
        container.innerHTML = '<h2>🎸 Músicos da Banda</h2>';
        
        const addBtn = UI.button('+ Adicionar Músico', () => this.showAddBandMemberForm(), 'btn-primary');
        container.appendChild(addBtn);

        const list = document.createElement('div');
        list.className = 'members-list';

        if (this.bandMembers.length === 0) {
            list.innerHTML = '<p class="empty-state">Nenhum músico cadastrado</p>';
        } else {
            this.bandMembers.forEach(member => {
                const card = UI.card(
                    member.name,
                    `<p><strong>Instrumento:</strong> ${member.instrument}</p><p><strong>Email:</strong> ${member.email || 'N/A'}</p><p><strong>Telefone:</strong> ${member.phone || 'N/A'}</p>`
                );
                list.appendChild(card);
            });
        }

        container.appendChild(list);
    }

    renderVocalScales(container) {
        container.innerHTML = '<h2>🎵 Escalas Vocais</h2>';
        
        const addBtn = UI.button('+ Criar Escala', () => this.showCreateScaleForm('vocal'), 'btn-primary');
        container.appendChild(addBtn);

        const list = document.createElement('div');
        list.className = 'scales-list';

        const vocalScales = this.scales.filter(s => s.type === 'vocal' || s.type === 'both');
        
        if (vocalScales.length === 0) {
            list.innerHTML = '<p class="empty-state">Nenhuma escala vocal criada</p>';
        } else {
            vocalScales.forEach(scale => {
                const date = new Date(scale.scale_date).toLocaleDateString('pt-BR');
                const card = UI.card(
                    `Escala de ${date}`,
                    `<p><strong>Tipo:</strong> ${scale.type}</p><p><strong>Publicada:</strong> ${scale.is_published ? '✅ Sim' : '❌ Não'}</p><p><strong>Notas:</strong> ${scale.notes || 'N/A'}</p>`
                );
                list.appendChild(card);
            });
        }

        container.appendChild(list);
    }

    renderBandScales(container) {
        container.innerHTML = '<h2>🎼 Escalas da Banda</h2>';
        
        const addBtn = UI.button('+ Criar Escala', () => this.showCreateScaleForm('band'), 'btn-primary');
        container.appendChild(addBtn);

        const list = document.createElement('div');
        list.className = 'scales-list';

        const bandScales = this.scales.filter(s => s.type === 'band' || s.type === 'both');
        
        if (bandScales.length === 0) {
            list.innerHTML = '<p class="empty-state">Nenhuma escala de banda criada</p>';
        } else {
            bandScales.forEach(scale => {
                const date = new Date(scale.scale_date).toLocaleDateString('pt-BR');
                const card = UI.card(
                    `Escala de ${date}`,
                    `<p><strong>Tipo:</strong> ${scale.type}</p><p><strong>Publicada:</strong> ${scale.is_published ? '✅ Sim' : '❌ Não'}</p><p><strong>Notas:</strong> ${scale.notes || 'N/A'}</p>`
                );
                list.appendChild(card);
            });
        }

        container.appendChild(list);
    }

    renderSongs(container) {
        container.innerHTML = '<h2>🎶 Músicas</h2>';
        
        const addBtn = UI.button('+ Adicionar Música', () => this.showAddSongForm(), 'btn-primary');
        container.appendChild(addBtn);

        const list = document.createElement('div');
        list.className = 'songs-list';

        if (this.songs.length === 0) {
            list.innerHTML = '<p class="empty-state">Nenhuma música cadastrada</p>';
        } else {
            this.songs.forEach(song => {
                const card = UI.card(
                    song.title,
                    `<p><strong>Artista:</strong> ${song.artist || 'N/A'}</p><p><strong>Tom:</strong> ${song.tone || 'N/A'}</p>`
                );
                card.style.cursor = 'pointer';
                card.addEventListener('click', () => this.showSongDetails(song));
                list.appendChild(card);
            });
        }

        container.appendChild(list);
    }

    renderHistory(container) {
        container.innerHTML = '<h2>📅 Histórico de Músicas</h2>';
        
        const list = document.createElement('div');
        list.className = 'history-list';

        // Agrupar por data
        const grouped = {};
        this.songs.forEach(song => {
            const date = song.created_at.split('T')[0];
            if (!grouped[date]) grouped[date] = [];
            grouped[date].push(song);
        });

        if (Object.keys(grouped).length === 0) {
            list.innerHTML = '<p class="empty-state">Nenhum histórico disponível</p>';
        } else {
            Object.keys(grouped).sort().reverse().forEach(date => {
                const dateCard = UI.card(
                    new Date(date).toLocaleDateString('pt-BR'),
                    grouped[date].map(s => `<p>🎵 ${s.title} (${s.artist || 'Artista desconhecido'})</p>`).join('')
                );
                list.appendChild(dateCard);
            });
        }

        container.appendChild(list);
    }

    renderSettings(container) {
        container.innerHTML = '<h2>⚙️ Configurações</h2>';
        
        const settings = document.createElement('div');
        settings.className = 'settings-form';

        const section = document.createElement('div');
        section.className = 'settings-section';
        section.innerHTML = '<h3>Preferências da Aplicação</h3>';

        const themeLabel = document.createElement('label');
        themeLabel.textContent = 'Tema: ';
        const themeSelect = UI.select([
            { value: 'light', label: '☀️ Claro' },
            { value: 'dark', label: '🌙 Escuro' }
        ]);
        section.appendChild(themeLabel);
        section.appendChild(themeSelect);

        settings.appendChild(section);
        container.appendChild(settings);
    }

    showAddVoiceMemberForm() {
        const modal = UI.modal('Adicionar Membro Vocal', '', [
            {
                text: 'Adicionar',
                className: 'btn-primary',
                onClick: () => this.handleAddVoiceMember()
            }
        ]);

        const form = UI.form([
            { name: 'name', label: 'Nome', type: 'text', placeholder: 'Nome completo', required: true },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' },
            { 
                name: 'naipe', 
                label: 'Naipe', 
                type: 'select', 
                options: CONFIG.NAIPES.map(n => ({ value: n, label: n })),
                required: true 
            },
            { name: 'phone', label: 'Telefone', type: 'tel', placeholder: '(00) 00000-0000' }
        ]);

        modal.querySelector('.modal-content').appendChild(form);
        document.body.appendChild(modal);
    }

    async handleAddVoiceMember() {
        const form = document.querySelector('.form');
        const data = {
            name: form.querySelector('input[name="name"]').value,
            email: form.querySelector('input[name="email"]').value,
            naipe: form.querySelector('select[name="naipe"]').value,
            phone: form.querySelector('input[name="phone"]').value
        };

        if (!data.name || !data.naipe) {
            UI.toast('Preencha os campos obrigatórios', 'warning');
            return;
        }

        const result = await db.createVoiceMember(data);
        if (result.success) {
            UI.toast('✅ Membro adicionado com sucesso', 'success');
            document.querySelector('.modal').remove();
            await this.loadVoiceMembers();
        } else {
            UI.toast('❌ Erro ao adicionar membro', 'error');
        }
    }

    showAddBandMemberForm() {
        const modal = UI.modal('Adicionar Músico', '', [
            {
                text: 'Adicionar',
                className: 'btn-primary',
                onClick: () => this.handleAddBandMember()
            }
        ]);

        const form = UI.form([
            { name: 'name', label: 'Nome', type: 'text', placeholder: 'Nome completo', required: true },
            { name: 'email', label: 'Email', type: 'email', placeholder: 'email@example.com' },
            { name: 'instrument', label: 'Instrumento', type: 'text', placeholder: 'Ex: Violão', required: true },
            { name: 'phone', label: 'Telefone', type: 'tel', placeholder: '(00) 00000-0000' }
        ]);

        modal.querySelector('.modal-content').appendChild(form);
        document.body.appendChild(modal);
    }

    async handleAddBandMember() {
        const form = document.querySelector('.form');
        const data = {
            name: form.querySelector('input[name="name"]').value,
            email: form.querySelector('input[name="email"]').value,
            instrument: form.querySelector('input[name="instrument"]').value,
            phone: form.querySelector('input[name="phone"]').value
        };

        if (!data.name || !data.instrument) {
            UI.toast('Preencha os campos obrigatórios', 'warning');
            return;
        }

        const result = await db.createBandMember(data);
        if (result.success) {
            UI.toast('✅ Músico adicionado com sucesso', 'success');
            document.querySelector('.modal').remove();
            await this.loadBandMembers();
        } else {
            UI.toast('❌ Erro ao adicionar músico', 'error');
        }
    }

    showAddSongForm() {
        const modal = UI.modal('Adicionar Música', '', [
            {
                text: 'Adicionar',
                className: 'btn-primary',
                onClick: () => this.handleAddSong()
            }
        ]);

        const form = UI.form([
            { name: 'title', label: 'Título', type: 'text', placeholder: 'Título da música', required: true },
            { name: 'artist', label: 'Artista', type: 'text', placeholder: 'Nome do artista' },
            { name: 'tone', label: 'Tom', type: 'text', placeholder: 'Ex: Sol Maior' },
            { name: 'externalLink', label: 'Link Externo', type: 'url', placeholder: 'https://...' },
            { name: 'videoLink', label: 'Link do Vídeo', type: 'url', placeholder: 'https://youtube.com/...' },
            { name: 'lyrics', label: 'Letra', type: 'textarea', placeholder: 'Letra da música' },
            { name: 'notes', label: 'Notas', type: 'textarea', placeholder: 'Notas adicionais' }
        ]);

        modal.querySelector('.modal-content').appendChild(form);
        document.body.appendChild(modal);
    }

    async handleAddSong() {
        const form = document.querySelector('.form');
        const data = {
            title: form.querySelector('input[name="title"]').value,
            artist: form.querySelector('input[name="artist"]').value,
            tone: form.querySelector('input[name="tone"]').value,
            externalLink: form.querySelector('input[name="externalLink"]').value,
            videoLink: form.querySelector('input[name="videoLink"]').value,
            lyrics: form.querySelector('textarea[name="lyrics"]').value,
            notes: form.querySelector('textarea[name="notes"]').value
        };

        if (!data.title) {
            UI.toast('Preencha o título da música', 'warning');
            return;
        }

        const result = await db.createSong(data);
        if (result.success) {
            UI.toast('✅ Música adicionada com sucesso', 'success');
            document.querySelector('.modal').remove();
            await this.loadSongs();
        } else {
            UI.toast('❌ Erro ao adicionar música', 'error');
        }
    }

    showSongDetails(song) {
        const modal = UI.modal(song.title, `
            <div class="song-details">
                <p><strong>Artista:</strong> ${song.artist || 'N/A'}</p>
                <p><strong>Tom:</strong> ${song.tone || 'N/A'}</p>
                ${song.external_link ? `<p><a href="${song.external_link}" target="_blank">🔗 Link Externo</a></p>` : ''}
                ${song.video_link ? `<p><a href="${song.video_link}" target="_blank">🎥 Vídeo</a></p>` : ''}
                ${song.lyrics ? `<div class="lyrics"><h4>Letra:</h4><pre>${song.lyrics}</pre></div>` : ''}
                ${song.notes ? `<p><strong>Notas:</strong> ${song.notes}</p>` : ''}
            </div>
        `, [
            {
                text: 'Fechar',
                className: 'btn-secondary',
                onClick: () => {}
            }
        ]);
        document.body.appendChild(modal);
    }

    showCreateScaleForm(type) {
        const modal = UI.modal('Criar Escala', '', [
            {
                text: 'Criar',
                className: 'btn-primary',
                onClick: () => this.handleCreateScale(type)
            }
        ]);

        const form = UI.form([
            { name: 'date', label: 'Data', type: 'date', required: true },
            { name: 'notes', label: 'Notas', type: 'textarea', placeholder: 'Notas sobre a escala' }
        ]);

        modal.querySelector('.modal-content').appendChild(form);
        document.body.appendChild(modal);
    }

    async handleCreateScale(type) {
        const form = document.querySelector('.form');
        const data = {
            scaleDate: form.querySelector('input[name="date"]').value,
            type: type,
            notes: form.querySelector('textarea[name="notes"]').value
        };

        if (!data.scaleDate) {
            UI.toast('Selecione uma data', 'warning');
            return;
        }

        const result = await db.createScale(data);
        if (result.success) {
            UI.toast('✅ Escala criada com sucesso', 'success');
            document.querySelector('.modal').remove();
            await this.loadScales();
        } else {
            UI.toast('❌ Erro ao criar escala', 'error');
        }
    }

    async handleLogout() {
        UI.confirm('Deseja sair da aplicação?', async () => {
            const result = await auth.logout();
            if (result.success) {
                UI.toast('✅ Logout realizado com sucesso', 'success');
                clearInterval(this.syncTimer);
            }
        });
    }
}

// Inicializar app quando DOM estiver pronto
document.addEventListener('DOMContentLoaded', async () => {
    const app = new ScalaLouvorApp();
    await app.init();
});
