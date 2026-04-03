/**
 * Autenticação
 * Gerencia login, registro e sessão do usuário
 */

class Auth {
    constructor() {
        this.user = null;
        this.subscribers = [];
    }

    /**
     * Inicializa autenticação
     */
    async init() {
        try {
            const { data: { session } } = await supabase.getClient().auth.getSession();
            
            if (session?.user) {
                this.user = session.user;
                console.log('✅ Usuário autenticado:', this.user.email);
                this.notifySubscribers();
            } else {
                console.log('ℹ️ Nenhum usuário autenticado');
            }

            // Ouvir mudanças de autenticação
            supabase.getClient().auth.onAuthStateChange((event, session) => {
                console.log('🔐 Mudança de autenticação:', event);
                this.user = session?.user || null;
                this.notifySubscribers();
            });
        } catch (error) {
            console.error('Erro ao inicializar autenticação:', error);
        }
    }

    /**
     * Registra novo usuário
     */
    async register(email, password, name) {
        try {
            const { data, error } = await supabase.getClient().auth.signUp({
                email,
                password,
                options: {
                    data: { name }
                }
            });

            if (error) throw error;

            console.log('✅ Usuário registrado:', email);
            return { success: true, message: 'Conta criada com sucesso! Verifique seu email.' };
        } catch (error) {
            console.error('Erro ao registrar:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Faz login
     */
    async login(email, password) {
        try {
            const { data, error } = await supabase.getClient().auth.signInWithPassword({
                email,
                password
            });

            if (error) throw error;

            this.user = data.user;
            console.log('✅ Login realizado:', email);
            this.notifySubscribers();
            return { success: true };
        } catch (error) {
            console.error('Erro ao fazer login:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Faz logout
     */
    async logout() {
        try {
            const { error } = await supabase.getClient().auth.signOut();
            
            if (error) throw error;

            this.user = null;
            console.log('✅ Logout realizado');
            this.notifySubscribers();
            return { success: true };
        } catch (error) {
            console.error('Erro ao fazer logout:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Obtém usuário atual
     */
    getUser() {
        return this.user;
    }

    /**
     * Verifica se está autenticado
     */
    isAuthenticated() {
        return !!this.user;
    }

    /**
     * Inscreve em mudanças de autenticação
     */
    subscribe(callback) {
        this.subscribers.push(callback);
        // Chamar imediatamente com estado atual
        callback({
            user: this.user,
            isAuthenticated: this.isAuthenticated()
        });
    }

    /**
     * Notifica subscribers
     */
    notifySubscribers() {
        this.subscribers.forEach(callback => {
            callback({
                user: this.user,
                isAuthenticated: this.isAuthenticated()
            });
        });
    }
}

// Instância global
const auth = new Auth();
