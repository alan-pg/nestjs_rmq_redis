import { e3 } from './e3';

export function discovery(model: string, type: string, data: string) {
    switch (model) {
        case 'E3':
            return e3(data);
            break;
        default:
            console.log('MODELO NÃO ENCONTRADO');
    }
}
