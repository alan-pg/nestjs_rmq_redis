import { format, subHours, parseISO } from 'date-fns';

const statusCode = {
  alarm: {
    '02': {
      name: 'Remoção de bateria principal',
      slug: 'alarm_against_external_power_cut',
    },
    '03': { name: 'Alarme de vibração', slug: 'vibration_alarm' },
  },
  commandContent: {
    445944: {
      name: 'Saída ativada',
      slug: 'enable_output',
    },
    484659: {
      name: 'Saída desativada',
      slug: 'disable_output',
    },
  },
};

export const latLon = (data: string) => {
  return (parseInt(data, 16) / 1800000) * -1;
};

export const dateTime = (date: string, time: string) => {
  try {
    const years = 2000 + parseInt(date.substring(0, 2), 16);
    const months = ('0' + parseInt(date.substring(2, 4), 16)).slice(-2);
    const days = ('0' + parseInt(date.substring(4, 6), 16)).slice(-2);
    const hours = ('0' + parseInt(time.substring(0, 2), 16)).slice(-2);
    const minutes = ('0' + parseInt(time.substring(2, 4), 16)).slice(-2);
    const seconds = ('0' + parseInt(time.substring(4, 6), 16)).slice(-2);

    // eslint-disable-next-line max-len
    const formatedDate = `${years}-${months}-${days}T${hours}:${minutes}:${seconds}`;

    return format(subHours(parseISO(formatedDate), 3), 'yyyy-MM-dd HH:mm:ss');
  } catch (error) {
    throw new Error('invalid_date');
  }
};

export const status = (data: string) => {
  const status = [];
  if (Number(data.charAt(3)) > 0) {
    const value = statusCode.alarm[data[3]];
    value && status.push(value);
  }
  return status;
};

export const command = (data: string) => {
  const commands = [];
  const command = data.slice(0, 3);

  if (Number(command) > 5) {
    const value = statusCode.commandContent[command];
    if (value === undefined) throw new Error('invalid_command');
    commands.push(value);
  }
  return commands;
};

export const signal = (data: string) => {
  const gsmSignal = {
    '00': 0,
    '01': 25,
    '02': 50,
    '03': 75,
    '04': 100,
    default: null,
  };
  return gsmSignal[data] || gsmSignal.default;
};

export const speed = (data: string) => parseInt(data, 16);

export const direction = (data: string) => {
  const courseStatus = parseInt(data, 16).toString(2).slice(-10);
  return parseInt(courseStatus, 2);
};

export const ignition = (data: string) => {
  const terminalInformation = parseInt(data, 16).toString(2).padStart(8);
  return Number(terminalInformation.charAt(6)) === 1;
};

export const out1 = (data: string) => {
  const terminalInformation = parseInt(data, 16).toString(2).padStart(8);
  return terminalInformation.charAt(0) === '1';
};

export const satellite = (data: string) => {
  return parseInt(data.slice(0, -1), 16);
};

export const isGPSOn = (data: string) => {
  const terminalInformation = parseInt(data, 16).toString(2).padStart(8);
  return terminalInformation.charAt(1) === '1';
};

export const dateNow = () => format(new Date(), 'yyyy-MM-dd HH:mm:ss');
