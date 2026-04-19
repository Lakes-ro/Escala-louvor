/**
 * Configurações da Aplicação
 * Substitua com suas chaves do Supabase
 */

const CONFIG = {
    // Supabase
    SUPABASE_URL: 'https://cymgsrlhoymaclvnhsed.supabase.co',
    SUPABASE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5bWdzcmxob3ltYWNsdm5oc2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3MjIzODAsImV4cCI6MjA4NDI5ODM4MH0.OPXpO9-LGRjaG_xWMWY744jxTjb8pShYePOlHKQEvrw',
    
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
if (CONFIG.SUPABASE_URL === 'https://cymgsrlhoymaclvnhsed.supabase.co' || 
    CONFIG.SUPABASE_KEY === 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN5bWdzcmxob3ltYWNsdm5oc2VkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg3MjIzODAsImV4cCI6MjA4NDI5ODM4MH0.OPXpO9-LGRjaG_xWMWY744jxTjb8pShYePOlHKQEvrw') {
    console.warn('⚠️ Configure suas chaves do Supabase em config.js');
}
