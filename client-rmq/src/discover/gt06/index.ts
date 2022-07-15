import {
  status,
  speed,
  signal,
  satellite,
  out1,
  latLon,
  isGPSOn,
  ignition,
  direction,
  dateTime,
  dateNow,
  command,
} from './config';

function handlePosition(dataFields, complementFields, deviceId) {
  try {
    const treatedData = {
      cmd: dataFields[3],
      header: dataFields.slice(0, 2).join(''),
      deviceId,
      isGPSOn: isGPSOn(complementFields[4]),
      dateTime: dateTime(
        dataFields.slice(4, 7).join(''),
        dataFields.slice(7, 10).join(''),
      ),
      dateSystem: dateNow(),
      latitude: latLon(dataFields.slice(11, 15).join('')),
      longitude: latLon(dataFields.slice(15, 19).join('')),
      speed: speed(dataFields[19]),
      direction: direction(dataFields.slice(20, 22).join('')),
      ignition: ignition(complementFields[4]),
      out1: out1(complementFields[4]),
      out2: null,
      signal: signal(complementFields[6]),
      bateryPercent: null,
      odometer: null,
      voltage: null,
      satellite: satellite(dataFields[10]),
      type: ['position'],
    };
    return treatedData;
  } catch (error) {
    console.log('Position_error', error);
    throw new Error('Position_error');
  }
}

function handleEvent(fields, deviceId) {
  try {
    const events = status(fields.slice(31, 36));
    if (!events.length) {
      return {
        type: ['event'],
        ignore: true,
      };
    }

    const treatedData = {
      cmd: fields[3],
      header: fields.slice(0, 2).join(''),
      deviceId,
      isGPSOn: isGPSOn(fields[33]),
      dateTime: dateTime(
        fields.slice(4, 7).join(''),
        fields.slice(7, 10).join(''),
      ),
      dateSystem: dateNow(),
      latitude: latLon(fields.slice(11, 15).join('')),
      longitude: latLon(fields.slice(15, 19).join('')),
      speed: speed(fields[19]),
      direction: direction(fields.slice(20, 22).join('')),
      ignition: ignition(fields[31]),
      out1: out1(fields[31]),
      out2: null,
      signal: signal(fields[33]),
      bateryPercent: null,
      odometer: null,
      voltage: null,
      satellite: satellite(fields[10]),
      ignore: false,
    };

    const treatedEvents = events.map((e) => {
      return {
        ...treatedData,
        event: e.name,
        eventSlug: e.slug,
      };
    });

    return { type: ['event'], items: treatedEvents };
  } catch (error) {
    console.log('Event_error', error);
    throw new Error('Event_error');
  }
}

function handleCommandReply(fields, deviceId) {
  try {
    const commandEvents = command(fields.slice(9, -8));
    if (!commandEvents.length) throw new Error('invalid_command');

    const treatedData = {
      header: fields.slice(0, 2).join(''),
      deviceId,
      outputMode: fields.slice(9, -8).join(''),
    };

    const treatedCommands = commandEvents.map((commandEvent) => {
      return {
        ...treatedData,
        event: commandEvent.name,
        eventSlug: commandEvent.slug,
        dateSystem: dateNow(),
      };
    });

    return { type: ['event', 'command'], items: treatedCommands };
  } catch (error) {
    console.log('commandContent', error);
    throw new Error('commandContent');
  }
}

module.exports = {
  gt06(data, complement, deviceId) {
    if (
      !data ||
      typeof data !== 'string' ||
      !complement ||
      typeof complement !== 'string'
    )
      throw new Error('data_is_missing');
    if (data.substring(0, 4) !== '7878' || data.slice(-4) !== '0d0a')
      throw new Error('invalid_data_structure');

    const dataFields = data.match(/.{1,2}/g);
    const complementFields = complement.match(/.{1,2}/g);
    const cmd = dataFields[3];

    switch (cmd) {
      case '12':
        return handlePosition(dataFields, complementFields, deviceId);
      case '15':
        return handleCommandReply(dataFields, deviceId);
      case '16':
        return handleEvent(dataFields, deviceId);
      default:
        throw new Error('cmd_not_found');
    }
  },
};
