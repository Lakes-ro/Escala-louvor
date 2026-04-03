/**
 * Banco de Dados
 * Operações CRUD compartilhadas (todos os usuários veem todos os dados)
 */

class Database {
    constructor() {
        this.listeners = {};
    }

    /**
     * Registra listener para mudanças em tempo real
     */
    onDataChange(table, callback) {
        if (!this.listeners[table]) {
            this.listeners[table] = [];
        }
        this.listeners[table].push(callback);

        // Inscrever em mudanças do Supabase
        supabase.subscribe(table, (payload) => {
            callback(payload);
        });
    }

    /**
     * Notifica listeners
     */
    notifyListeners(table, data) {
        if (this.listeners[table]) {
            this.listeners[table].forEach(callback => callback(data));
        }
    }

    // ============ MEMBROS VOCAIS ============

    /**
     * Obtém todos os membros vocais (compartilhado)
     */
    async getVoiceMembers() {
        return await supabase.select('voice_members');
    }

    /**
     * Cria novo membro vocal
     */
    async createVoiceMember(data) {
        const result = await supabase.insert('voice_members', {
            name: data.name,
            email: data.email || null,
            naipe: data.naipe,
            phone: data.phone || null,
            created_at: new Date().toISOString()
        });

        if (result.success) {
            this.notifyListeners('voice_members', { event: 'INSERT', new: result.data[0] });
        }
        return result;
    }

    /**
     * Atualiza membro vocal
     */
    async updateVoiceMember(id, data) {
        const result = await supabase.update('voice_members', id, data);
        if (result.success) {
            this.notifyListeners('voice_members', { event: 'UPDATE', new: result.data[0] });
        }
        return result;
    }

    /**
     * Deleta membro vocal
     */
    async deleteVoiceMember(id) {
        const result = await supabase.delete('voice_members', id);
        if (result.success) {
            this.notifyListeners('voice_members', { event: 'DELETE', old: { id } });
        }
        return result;
    }

    // ============ MÚSICOS DA BANDA ============

    /**
     * Obtém todos os músicos da banda (compartilhado)
     */
    async getBandMembers() {
        return await supabase.select('band_members');
    }

    /**
     * Cria novo músico da banda
     */
    async createBandMember(data) {
        const result = await supabase.insert('band_members', {
            name: data.name,
            email: data.email || null,
            instrument: data.instrument,
            phone: data.phone || null,
            created_at: new Date().toISOString()
        });

        if (result.success) {
            this.notifyListeners('band_members', { event: 'INSERT', new: result.data[0] });
        }
        return result;
    }

    /**
     * Atualiza músico da banda
     */
    async updateBandMember(id, data) {
        const result = await supabase.update('band_members', id, data);
        if (result.success) {
            this.notifyListeners('band_members', { event: 'UPDATE', new: result.data[0] });
        }
        return result;
    }

    /**
     * Deleta músico da banda
     */
    async deleteBandMember(id) {
        const result = await supabase.delete('band_members', id);
        if (result.success) {
            this.notifyListeners('band_members', { event: 'DELETE', old: { id } });
        }
        return result;
    }

    // ============ MÚSICAS ============

    /**
     * Obtém todas as músicas (compartilhado)
     */
    async getSongs() {
        return await supabase.select('songs');
    }

    /**
     * Cria nova música
     */
    async createSong(data) {
        const result = await supabase.insert('songs', {
            title: data.title,
            artist: data.artist || null,
            tone: data.tone || null,
            external_link: data.externalLink || null,
            video_link: data.videoLink || null,
            lyrics: data.lyrics || null,
            notes: data.notes || null,
            created_at: new Date().toISOString()
        });

        if (result.success) {
            this.notifyListeners('songs', { event: 'INSERT', new: result.data[0] });
        }
        return result;
    }

    /**
     * Atualiza música
     */
    async updateSong(id, data) {
        const result = await supabase.update('songs', id, data);
        if (result.success) {
            this.notifyListeners('songs', { event: 'UPDATE', new: result.data[0] });
        }
        return result;
    }

    /**
     * Deleta música
     */
    async deleteSong(id) {
        const result = await supabase.delete('songs', id);
        if (result.success) {
            this.notifyListeners('songs', { event: 'DELETE', old: { id } });
        }
        return result;
    }

    // ============ ESCALAS ============

    /**
     * Obtém todas as escalas (compartilhado)
     */
    async getScales() {
        return await supabase.select('scales');
    }

    /**
     * Cria nova escala
     */
    async createScale(data) {
        const result = await supabase.insert('scales', {
            scale_date: data.scaleDate,
            type: data.type,
            notes: data.notes || null,
            is_published: false,
            created_at: new Date().toISOString()
        });

        if (result.success) {
            this.notifyListeners('scales', { event: 'INSERT', new: result.data[0] });
        }
        return result;
    }

    /**
     * Atualiza escala
     */
    async updateScale(id, data) {
        const result = await supabase.update('scales', id, data);
        if (result.success) {
            this.notifyListeners('scales', { event: 'UPDATE', new: result.data[0] });
        }
        return result;
    }

    /**
     * Deleta escala
     */
    async deleteScale(id) {
        const result = await supabase.delete('scales', id);
        if (result.success) {
            this.notifyListeners('scales', { event: 'DELETE', old: { id } });
        }
        return result;
    }

    // ============ HISTÓRICO DE MÚSICAS ============

    /**
     * Obtém histórico de músicas
     */
    async getSongHistory() {
        return await supabase.select('song_history');
    }

    /**
     * Registra música no histórico
     */
    async addToHistory(songId, scaleId) {
        const result = await supabase.insert('song_history', {
            song_id: songId,
            scale_id: scaleId,
            used_at: new Date().toISOString()
        });

        if (result.success) {
            this.notifyListeners('song_history', { event: 'INSERT', new: result.data[0] });
        }
        return result;
    }

    /**
     * Obtém músicas usadas em uma data
     */
    async getSongsUsedOnDate(date) {
        try {
            const startOfDay = `${date}T00:00:00`;
            const endOfDay = `${date}T23:59:59`;

            const { data, error } = await supabase.getClient()
                .from('song_history')
                .select('songs(*)')
                .gte('used_at', startOfDay)
                .lte('used_at', endOfDay);

            if (error) throw error;
            return { success: true, data: data || [] };
        } catch (error) {
            console.error('Erro ao buscar histórico:', error);
            return { success: false, error: error.message, data: [] };
        }
    }
}

// Instância global
const db = new Database();
