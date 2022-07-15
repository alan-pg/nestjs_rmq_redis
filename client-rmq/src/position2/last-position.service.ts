import { Injectable } from '@nestjs/common';

@Injectable()
export class LastPositionService {
    async handlePosition(data: string): Promise<string> {
        console.log('data', data);
        return 'teste';
    }
}
