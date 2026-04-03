/**
 * Componentes de Interface
 * Componentes reutilizáveis para UI
 */

class UIComponents {
    static createButton(text, onClick, className = '') {
        const button = document.createElement('button');
        button.textContent = text;
        button.className = `btn ${className}`;
        button.addEventListener('click', onClick);
        return button;
    }

    static createInput(type, placeholder, className = '') {
        const input = document.createElement('input');
        input.type = type;
        input.placeholder = placeholder;
        input.className = `input ${className}`;
        return input;
    }

    static createSelect(options, className = '') {
        const select = document.createElement('select');
        select.className = `select ${className}`;
        
        options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            select.appendChild(option);
        });
        
        return select;
    }

    static createCard(title, content, className = '') {
        const card = document.createElement('div');
        card.className = `card ${className}`;
        
        if (title) {
            const titleEl = document.createElement('h3');
            titleEl.className = 'card-title';
            titleEl.textContent = title;
            card.appendChild(titleEl);
        }
        
        if (content) {
            const contentEl = document.createElement('div');
            contentEl.className = 'card-content';
            contentEl.innerHTML = content;
            card.appendChild(contentEl);
        }
        
        return card;
    }

    static createModal(title, content, actions = []) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        backdrop.addEventListener('click', () => modal.remove());
        modal.appendChild(backdrop);
        
        const dialog = document.createElement('div');
        dialog.className = 'modal-dialog';
        
        if (title) {
            const titleEl = document.createElement('h2');
            titleEl.className = 'modal-title';
            titleEl.textContent = title;
            dialog.appendChild(titleEl);
        }
        
        if (content) {
            const contentEl = document.createElement('div');
            contentEl.className = 'modal-content';
            contentEl.innerHTML = content;
            dialog.appendChild(contentEl);
        }
        
        if (actions.length > 0) {
            const actionsEl = document.createElement('div');
            actionsEl.className = 'modal-actions';
            
            actions.forEach(action => {
                const btn = this.createButton(action.text, () => {
                    action.onClick();
                    modal.remove();
                }, action.className || 'btn-primary');
                actionsEl.appendChild(btn);
            });
            
            dialog.appendChild(actionsEl);
        }
        
        modal.appendChild(dialog);
        return modal;
    }

    static showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }

    static createForm(fields) {
        const form = document.createElement('form');
        form.className = 'form';
        
        fields.forEach(field => {
            const group = document.createElement('div');
            group.className = 'form-group';
            
            if (field.label) {
                const label = document.createElement('label');
                label.textContent = field.label;
                group.appendChild(label);
            }
            
            let input;
            if (field.type === 'select') {
                input = this.createSelect(field.options);
            } else if (field.type === 'textarea') {
                input = document.createElement('textarea');
                input.placeholder = field.placeholder;
            } else {
                input = this.createInput(field.type, field.placeholder);
            }
            
            input.name = field.name;
            input.required = field.required || false;
            group.appendChild(input);
            
            form.appendChild(group);
        });
        
        return form;
    }

    static createSidebar(items) {
        const sidebar = document.createElement('aside');
        sidebar.className = 'sidebar';
        
        items.forEach(item => {
            const link = document.createElement('a');
            link.href = item.href;
            link.textContent = item.label;
            link.className = `sidebar-item ${item.active ? 'active' : ''}`;
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (item.onClick) item.onClick();
            });
            sidebar.appendChild(link);
        });
        
        return sidebar;
    }

    static showLoading(message = 'Carregando...') {
        const loader = document.createElement('div');
        loader.className = 'loader';
        loader.innerHTML = `
            <div class="spinner"></div>
            <p>${message}</p>
        `;
        document.body.appendChild(loader);
        return loader;
    }

    static hideLoading(loader) {
        if (loader) {
            loader.remove();
        }
    }

    static showConfirm(message, onConfirm, onCancel) {
        const modal = this.createModal('Confirmação', message, [
            {
                text: 'Confirmar',
                className: 'btn-primary',
                onClick: onConfirm
            },
            {
                text: 'Cancelar',
                className: 'btn-secondary',
                onClick: onCancel || (() => {})
            }
        ]);
        document.body.appendChild(modal);
    }
}

// API simplificada
const UI = {
    button: (text, onClick, className) => UIComponents.createButton(text, onClick, className),
    input: (type, placeholder, className) => UIComponents.createInput(type, placeholder, className),
    select: (options, className) => UIComponents.createSelect(options, className),
    card: (title, content, className) => UIComponents.createCard(title, content, className),
    modal: (title, content, actions) => UIComponents.createModal(title, content, actions),
    toast: (message, type, duration) => UIComponents.showToast(message, type, duration),
    form: (fields) => UIComponents.createForm(fields),
    sidebar: (items) => UIComponents.createSidebar(items),
    loading: (message) => UIComponents.showLoading(message),
    hideLoading: (loader) => UIComponents.hideLoading(loader),
    confirm: (message, onConfirm, onCancel) => UIComponents.showConfirm(message, onConfirm, onCancel)
};
