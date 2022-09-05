import { format } from 'date-fns';
const emergencyTypes: { [key: string]: { event: string; eventSlug: string } } =
{
    '1': {
        event: 'emergência por botão de pânico',
        eventSlug: 'emergency_by_panic_button',
    },
    '2': {
        event: 'emergência por bloqueio de estacionamento',
        eventSlug: 'emergency_by_parking_lock',
    },
    '3': {
        event: 'emergência removendo a alimentação principal',
        eventSlug: 'emergency_by_removing_main_power',
    },
};

const eventTypes: { [key: string]: { event: string; eventSlug: string } } = {
    '1': {
        event: 'Input1 vai para o estado fundamental',
        eventSlug: 'input1_goes_to_ground_state',
    },
    '2': {
        event: 'Input1 vai para o estado aberto.',
        eventSlug: 'input1_goes_to_open_state',
    },
    '3': {
        event: 'Input2 vai para o estado fundamental',
        eventSlug: 'input2_goes_to_ground_state',
    },
    '4': {
        event: 'Input2 vai para o estado aberto.',
        eventSlug: 'input2_goes_to_open_state',
    },
    '5': {
        event: 'Input2 vai para o estado fundamental',
        eventSlug: 'input2_goes_to_ground_state',
    },
    '6': {
        event: 'Input2 vai para o estado aberto.',
        eventSlug: 'input2_goes_to_open_state',
    },
};

const alertTypes: { [key: string]: { event: string; eventSlug: string } } = {
    '1': {
        event: 'Ultrapassou limite de velocidade',
        eventSlug: 'start_driving_faster_than_speed_slimit',
    },
    '2': {
        event: 'Condição de excesso de velocidade encerrada.',
        eventSlug: 'ended_over_speed_condition',
    },
    '3': {
        event: 'Antena GPS desconectada',
        eventSlug: 'disconnected_gps_antenna',
    },
    '4': {
        event: 'Antena GPS reconectada depois de desconectada.',
        eventSlug: 'reconnected_gps_antenna_after_disconnected',
    },
    '5': {
        event: 'O veículo saiu da cerca geográfica que tem o seguinte ID.',
        eventSlug: 'the_vehicle_went_out_from_the_geo_fence_that_has_following_id',
    },
    '6': {
        event: 'O veículo entrou na geocerca que tem o seguinte ID.',
        eventSlug: 'the_vehicle_entered_into_the_geo_fence_that_has_following_id',
    },
    '8': {
        event: 'Antena GPS em curto.',
        eventSlug: 'Shorted_gps_antenna',
    },
    '9': {
        event: 'Entrou no modo de suspensão profunda.',
        eventSlug: 'enter_to_deep_sleep_mode',
    },
    '10': {
        event: 'Saiu do modo de suspensão profunda.',
        eventSlug: 'exit_from_deep_sleep_mode',
    },
    '13': {
        event: 'Erro de bateria de backup.',
        eventSlug: 'backup_battery_error',
    },
    '14': {
        event: 'A bateria do veículo desce para um nível tão baixo.',
        eventSlug: 'vehicle_battery_goes_down_to_so_low_level',
    },
    '15': {
        event: 'choque.',
        eventSlug: 'shocked',
    },
    '16': {
        event: 'ocorreu alguma colisão.',
        eventSlug: 'occurred_some_collision',
    },
    '18': {
        event: 'Desvio de rota predefinida.',
        eventSlug: 'Deviate_from_predefined_route',
    },
    '19': {
        event: 'Entrou na rota predefinida.',
        eventSlug: 'enter_into_predefined_route',
    },
    '40': {
        event: 'Entrou na rota predefinida.',
        eventSlug: 'connected_main_power',
    },
    '41': {
        event: 'Energia principal desligada.',
        eventSlug: 'disconected_main_power',
    },
    '44': {
        event: 'Bateria de backup conectada.',
        eventSlug: 'connected_backup_battery',
    },
    '45': {
        event: 'Bateria de backup desconectada.',
        eventSlug: 'disconnected_backup_battery',
    },
    '50': {
        event: 'Jamming detectado.',
        eventSlug: 'jamming_detected',
    },
};

export function suntechFromatDate(date: string, time: string) {
    return `${date.slice(0, 4)}-${date.slice(4, 6)}-${date.slice(6, 8)} ${time}`;
}
export const dateNow = () => format(new Date(), 'yyyy-MM-dd HH:mm:ss');

export const suntechIO = (
    data: string,
): { ignition: boolean; out1: boolean; out2: boolean } => {
    return {
        ignition: data[0] === '1' ? true : false,
        out1: data[4] === '1' ? true : false,
        out2: data[5] === '1' ? true : false,
    };
};

export const isGpsOn = (data: string) => {
    return data === '1' ? true : false;
};

export const emgId = (value: string) => {
    return emergencyTypes[value] || null;
};

export const evtId = (value: string) => {
    return eventTypes[value] || null;
};
export const altId = (value: string) => {
    return alertTypes[value] || null;
};
