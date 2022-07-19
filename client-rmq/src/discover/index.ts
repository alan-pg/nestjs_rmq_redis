import { e3 } from './e3';

type PositionProps = {
  cmd: string;
  header: string;
  deviceId: string;
  isGPSOn: boolean;
  dateTime: string;
  dateSystem: string;
  latitude: string;
  longitude: string;
  speed: string;
  direction: string;
  ignition: boolean;
  out1: boolean;
  out2: boolean;
  signal: string;
  bateryPercent: string;
  odometer: string;
  voltage: string;
  satellite: string;
};

type EventProps = {
  deviceId: number;
};

export interface DiscoveryProps {
  error: boolean;
  errorMessage: string | null;
  ignore: boolean;
  position: PositionProps | null;
  event: EventProps[] | null;
}

export function discover(
  model: string,
  type: string,
  data: string,
): DiscoveryProps {
  switch (model) {
    case 'E3':
      return e3(data);
      break;
    default:
      console.log('MODELO NÃO ENCONTRADO');
  }
}
