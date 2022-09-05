import { e3 } from './e3';
import { suntech } from './suntech';

export type PositionProps = {
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
  heartBeat: string;
};

export type EventProps = {
  header: string;
  deviceId: string;
  dateSystem: string;
  event: string;
  eventSlug: string;
  isGPSOn?: boolean;
  dateTime?: string;
  latitude?: string;
  longitude?: string;
  speed?: string;
  direction?: string;
  ignition?: boolean;
  out1?: boolean;
  out2?: boolean;
  signal?: string;
  bateryPercent?: string;
  odometer?: string;
  voltage?: string;
  satellite?: string;
};

export interface DiscoveredData {
  error: boolean;
  errorMessage: string | null;
  ignore?: boolean;
  position?: PositionProps | null;
  event?: EventProps[] | null;
}

export function discover({
  model,
  data,
}: {
  model: string;
  data: string;
}): DiscoveredData {
  switch (model) {
    case 'E3':
      return e3(data);
    case 'SUNTECH':
      return suntech(data);
    default:
      return {
        error: true,
        errorMessage: 'device_model_not_found',
      };
  }
}
