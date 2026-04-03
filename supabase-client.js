/**
 * Cliente Supabase
 * Gerencia conexão e operações com banco de dados
 */

class SupabaseClient {
    constructor() {
        this.client = null;
        this.subscriptions = [];
    }

    /**
     * Inicializa conexão com Supabase
     */
    init() {
        const { createClient } = window.supabase;
        this.client = createClient(CONFIG.SUPABASE_URL, CONFIG.SUPABASE_KEY);
        console.log('✅ Supabase inicializado');
    }

    /**
     * Obtém cliente Supabase
     */
    getClient() {
        if (!this.client) {
            this.init();
        }
        return this.client;
    }

    /**
     * Inscreve em mudanças em tempo real
     */
    subscribe(table, callback) {
        if (!CONFIG.ENABLE_REALTIME) return;

        const client = this.getClient();
        const subscription = client
            .channel(`public:${table}`)
            .on('postgres_changes', 
                { event: '*', schema: 'public', table: table },
                (payload) => {
                    console.log(`📡 Mudança em ${table}:`, payload);
                    callback(payload);
                }
            )
            .subscribe();

        this.subscriptions.push(subscription);
        return subscription;
    }

    /**
     * Remove inscrição
     */
    unsubscribe(subscription) {
        if (subscription) {
            this.getClient().removeChannel(subscription);
        }
    }

    /**
     * Remove todas as inscrições
     */
    unsubscribeAll() {
        this.subscriptions.forEach(sub => this.unsubscribe(sub));
        this.subscriptions = [];
    }

    /**
     * Executa query SELECT
     */
    async select(table, filters = {}) {
        try {
            let query = this.getClient().from(table).select('*');

            // Aplicar filtros
            Object.keys(filters).forEach(key => {
                query = query.eq(key, filters[key]);
            });

            const { data, error } = await query;

            if (error) throw error;
            return { success: true, data: data || [] };
        } catch (error) {
            console.error(`Erro ao buscar ${table}:`, error);
            return { success: false, error: error.message, data: [] };
        }
    }

    /**
     * Insere registro
     */
    async insert(table, data) {
        try {
            const { data: result, error } = await this.getClient()
                .from(table)
                .insert([data])
                .select();

            if (error) throw error;
            console.log(`✅ Inserido em ${table}:`, result);
            return { success: true, data: result };
        } catch (error) {
            console.error(`Erro ao inserir em ${table}:`, error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Atualiza registro
     */
    async update(table, id, data) {
        try {
            const { data: result, error } = await this.getClient()
                .from(table)
                .update(data)
                .eq('id', id)
                .select();

            if (error) throw error;
            console.log(`✅ Atualizado em ${table}:`, result);
            return { success: true, data: result };
        } catch (error) {
            console.error(`Erro ao atualizar em ${table}:`, error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Deleta registro
     */
    async delete(table, id) {
        try {
            const { error } = await this.getClient()
                .from(table)
                .delete()
                .eq('id', id);

            if (error) throw error;
            console.log(`✅ Deletado de ${table}:`, id);
            return { success: true };
        } catch (error) {
            console.error(`Erro ao deletar de ${table}:`, error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Executa RPC (função no Supabase)
     */
    async rpc(functionName, params = {}) {
        try {
            const { data, error } = await this.getClient()
                .rpc(functionName, params);

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error(`Erro ao executar RPC ${functionName}:`, error);
            return { success: false, error: error.message };
        }
    }
}

// Instância global
const supabase = new SupabaseClient();
supabase.init();
