/**
 * Configurações da Aplicação
 * Substitua com suas chaves do Supabase
 */

const CONFIG = {
    // Supabase
    SUPABASE_URL: 'https://seu-projeto.supabase.co',
    SUPABASE_KEY: 'sua-chave-publica-aqui',
    
    // App
    APP_NAME: 'Sistema de Escala de Louvor',
    
    // Naipes vocais
    NAIPES: ['Soprano', 'Contralto', 'Tenor', 'Barítono', 'Baixo'],
    
    // Instrumentos da banda
    INSTRUMENTS: ['Violão', 'Teclado', 'Bateria', 'Baixo', 'Flauta', 'Trompete', 'Saxofone', 'Violino'],
    
    // Sincronização em tempo real
    SYNC_INTERVAL: 5000, // 5 segundos
    ENABLE_REALTIME: true
};

// Validar configurações
if (CONFIG.SUPABASE_URL === 'https://seu-projeto.supabase.co' || 
    CONFIG.SUPABASE_KEY === 'sua-chave-publica-aqui') {
    console.warn('⚠️ Configure suas chaves do Supabase em config.js');
}
