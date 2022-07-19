import { DiscoveredData, EventProps, PositionProps } from '..';
import {
  status,
  speed,
  signal,
  satellite,
  out2,
  out1,
  odometer,
  latLon,
  isGPSOn,
  ignition,
  direction,
  dateTime,
  dateNow,
  command,
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

function handleHB(fields: string[]): TreatedHb {
  try {
    const treatedData = {
      cmd: fields[2],
      header: fields[0],
      deviceId: fields[1],
      isGPSOn: isGPSOn(fields[3]),
      dateTime: dateTime(fields[4], fields[5]),
      dateSystem: dateNow(),
      latitude: latLon(fields[6]),
      longitude: latLon(fields[7]),
      speed: speed(fields[8]),
      direction: direction(fields[9]),
      ignition: ignition(fields[10]),
      out1: out1(fields[10]),
      out2: out2(fields[10]),
      signal: signal(fields[11]),
      bateryPercent: fields[12],
      odometer: odometer(fields[14]),
      voltage: fields[19],
      satellite: satellite(fields[20]),
    };

    return {
      error: false,
      ignore: false,
      errorMessage: null,
      position: treatedData,
    };
  } catch (error) {
    console.log('HB_error', error);
    return {
      error: true,
      ignore: false,
      errorMessage: 'HB_error',
      position: null,
    };
  }
}

function handleAM(fields: string[]): DiscoveredData {
  try {
    const voltage = fields[16];
    const events = status(fields[10], voltage);

    if (!events.length) {
      return {
        error: false,
        errorMessage: null,
        event: null,
        ignore: true,
      };
    }

    const treatedData = {
      cmd: fields[2],
      header: fields[0],
      deviceId: fields[1],
      isGPSOn: isGPSOn(fields[3]),
      dateTime: dateTime(fields[4], fields[5]),
      dateSystem: dateNow(),
      latitude: latLon(fields[6]),
      longitude: latLon(fields[7]),
      speed: speed(fields[8]),
      direction: direction(fields[9]),
      ignition: ignition(fields[10]),
      out1: out1(fields[10]),
      out2: out2(fields[10]),
      signal: signal(fields[11]),
      bateryPercent: fields[12],
      odometer: odometer(fields[14]),
      voltage,
      satellite: satellite(fields[17]),
      ignore: false,
    };

    const treatedEvents = events.map((e) => {
      return {
        ...treatedData,
        event: e.name,
        eventSlug: e.slug,
      };
    });

    return {
      error: false,
      errorMessage: null,
      event: treatedEvents,
    };
  } catch (error) {
    console.log('AM_error', error);
    return {
      error: true,
      errorMessage: 'AM_error',
    };
  }
}

function handleCC(fields: string[]) {
  try {
    // const ignitionIsOn = ignition(fields[11]);

    const treatedData = {
      // cmd: fields[2],
      // header: fields[0],
      // deviceId: fields[1],
      // isGPSOn: isGPSOn(fields[4]),
      // dateTime: dateTime(fields[5], fields[6]),
      // dateSystem: dateNow(),
      // latitude: latLon(fields[7]),
      // longitude: latLon(fields[8]),
      // speed: speed(fields[9]),
      // direction: direction(fields[10]),
      // ignition: ignitionIsOn,
      // out1: out1(fields[11]),
      // out2: out2(fields[11]),
      // signal: signal(fields[12]),
      // bateryPercent: fields[13],
      // odometer: odometer(fields[15]),
      // voltage: fields[17],
      // satellite: satellite(fields[18]),
      type: ['position'],
      ignore: true,
    };

    return treatedData;
  } catch (error) {
    console.log('CC_error', error);
    throw new Error('CC_error');
  }
}

function handleFD(fields: string[]): TreatedEvent {
  try {
    const commandEvents = command(fields[3]);
    if (!commandEvents.length) {
      return {
        error: true,
        errorMessage: 'invalid_command',
      };
    }

    const treatedData = {
      header: fields[0],
      deviceId: fields[1],
      outputMode: fields[2],
    };

    const treatedCommands = commandEvents.map((commandEvent) => {
      return {
        ...treatedData,
        event: commandEvent.name,
        eventSlug: commandEvent.slug,
        dateSystem: dateNow(),
      };
    });

    return {
      error: false,
      errorMessage: null,
      event: treatedCommands,
    };
  } catch (error) {
    console.log('FD_error', error);
    return {
      error: true,
      errorMessage: 'FD_error',
      ignore: false,
    };
  }
}

export function e3(data: string): DiscoveredData {
  if (!data || typeof data !== 'string') {
    return {
      error: true,
      errorMessage: 'data_is_missing',
    };
  }

  if (data.charAt(0) !== '*' || data.charAt(data.length - 1) !== '#') {
    return {
      error: true,
      errorMessage: 'invalid_data_structure',
    };
  }

  const fields = data.split(',');
  const cmd = fields[2];

  switch (cmd) {
    case 'HB':
      return handleHB(fields);
    case 'AM':
      return handleAM(fields);
    case 'CC':
      return { error: false, errorMessage: null, ignore: true };
    case 'FD':
      return handleFD(fields);
    default:
      return {
        error: true,
        errorMessage: 'cmd_not_found',
      };
  }
}
