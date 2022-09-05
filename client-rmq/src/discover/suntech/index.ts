import { DiscoveredData, EventProps, PositionProps } from '..';
import {
  altId,
  dateNow,
  emgId,
  evtId,
  isGpsOn,
  suntechFromatDate,
  suntechIO,
} from './config';

interface TreatedHb {
  error: boolean;
  errorMessage: string | null;
  ignore: boolean;
  position: PositionProps | null;
}

interface TreatedEvent {
  error: boolean;
  errorMessage: string | null;
  ignore?: boolean;
  event?: EventProps[] | null;
}

function handleStt(fields: string[]): TreatedHb {
  console.log('🚀 ~ file: index.ts ~ line 34 ~ handleStt ~ fields', fields);
  try {
    const { ignition, out1, out2 } = suntechIO(fields[14]);
    const position = {
      cmd: fields[0].slice(-3),
      deviceId: fields[1],
      header: fields[0].slice(0, 5),
      dateTime: suntechFromatDate(fields[3], fields[4]),
      dateSystem: dateNow(),
      latitude: fields[6],
      longitude: fields[7],
      speed: fields[8],
      direction: fields[9],
      satellite: fields[10],
      isGPSOn: isGpsOn(fields[15]),
      voltage: fields[13],
      bateryPercent: fields[18],
      odometer: fields[12],
      signal: null,
      ignition,
      out1,
      out2,
      heartBeat: dateNow(),
    };
    return { error: false, errorMessage: null, ignore: false, position };
  } catch (error) {
    return {
      error: true,
      errorMessage: 'error_handle_stt',
      ignore: false,
      position: null,
    };
  }
}
function handleEmg(fields: string[]): TreatedEvent {
  console.log('🚀 ~ file: index.ts ~ line 34 ~ handleStt ~ fields', fields);
  try {
    const { ignition, out1, out2 } = suntechIO(fields[14]);
    const { event, eventSlug } = emgId(fields[15]);
    const eventResp = {
      cmd: fields[0].slice(-3),
      header: fields[0].slice(0, 5),
      deviceId: fields[1],
      dateTime: suntechFromatDate(fields[3], fields[4]),
      dateSystem: dateNow(),
      latitude: fields[6],
      longitude: fields[7],
      speed: fields[8],
      direction: fields[9],
      satellite: fields[10],
      isGPSOn: isGpsOn(fields[11]),
      odometer: fields[12],
      voltage: fields[13],
      bateryPercent: fields[17],
      signal: null,
      ignition,
      event,
      eventSlug,
      out1,
      out2,
    };
    console.log(
      '🚀 ~ file: index.ts ~ line 85 ~ handleEmg ~ eventResp',
      eventResp,
    );
    return {
      error: false,
      errorMessage: null,
      ignore: false,
      event: [eventResp],
    };
  } catch (error) {
    console.log('error_handle_emg', error);
    return {
      error: true,
      errorMessage: 'error_handle_emg',
      ignore: false,
      event: null,
    };
  }
}

function handleEvt(fields: string[]) {
  try {
    const { ignition, out1, out2 } = suntechIO(fields[14]);
    const { event, eventSlug } = evtId(fields[15]);
    const eventResp = {
      cmd: fields[0].slice(-3),
      header: fields[0].slice(0, 5),
      deviceId: fields[1],
      dateTime: suntechFromatDate(fields[3], fields[4]),
      dateSystem: dateNow(),
      latitude: fields[6],
      longitude: fields[7],
      speed: fields[8],
      direction: fields[9],
      satellite: fields[10],
      isGPSOn: isGpsOn(fields[11]),
      odometer: fields[12],
      voltage: fields[13],
      bateryPercent: fields[17],
      signal: null,
      ignition,
      event,
      eventSlug,
      out1,
      out2,
    };
    console.log(
      '🚀 ~ file: index.ts ~ line 85 ~ handleEmg ~ eventResp',
      eventResp,
    );
    return {
      error: false,
      errorMessage: null,
      ignore: false,
      event: [eventResp],
    };
  } catch (error) {
    console.log('error_handle_evt', error);
    return {
      error: true,
      errorMessage: 'error_handle_evt',
      ignore: false,
      event: null,
    };
  }
}

function handleAlt(fields: string[]) {
  try {
    const { ignition, out1, out2 } = suntechIO(fields[14]);
    const { event, eventSlug } = altId(fields[15]);
    const eventResp = {
      cmd: fields[0].slice(-3),
      header: fields[0].slice(0, 5),
      deviceId: fields[1],
      dateTime: suntechFromatDate(fields[3], fields[4]),
      dateSystem: dateNow(),
      latitude: fields[6],
      longitude: fields[7],
      speed: fields[8],
      direction: fields[9],
      satellite: fields[10],
      isGPSOn: isGpsOn(fields[11]),
      odometer: fields[12],
      voltage: fields[13],
      bateryPercent: fields[17],
      signal: null,
      ignition,
      event,
      eventSlug,
      out1,
      out2,
    };
    console.log(
      '🚀 ~ file: index.ts ~ line 85 ~ handleEmg ~ eventResp',
      eventResp,
    );
    return {
      error: false,
      errorMessage: null,
      ignore: false,
      event: [eventResp],
    };
  } catch (error) {
    console.log('error_handle_evt', error);
    return {
      error: true,
      errorMessage: 'error_handle_evt',
      ignore: false,
      event: null,
    };
  }
}

function handleAlive(fields: string[]) {
  return {
    error: false,
    errorMessage: null,
    ignore: true,
    position: null,
  };
}

export function suntech(data: string): DiscoveredData {
  const fields = data.split(';');
  const cmd = fields[0].slice(-3);
  switch (cmd) {
    case 'STT':
      return handleStt(fields);
    case 'EMG':
      return handleEmg(fields);
    case 'EVT':
      return handleEvt(fields);
    case 'ALT':
      return handleAlt(fields);
    case 'ALV':
      return handleAlive(fields);
    default:
      return {
        error: true,
        errorMessage: 'cmd_not_found',
      };
  }
}
