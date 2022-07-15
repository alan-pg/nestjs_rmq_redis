import { format, subHours, parseISO } from 'date-fns';
type event = {
  name: string;
  slug: string;
};

const statusCode = {
  bit1: {
    1: { name: 'Mal funcionamento do GPS', slug: 'gps_malfunction' },
    2: { name: 'Alarme de vibração', slug: 'vibration_alarm' },
    // 4: { name: 'Car is driving', slug: 'car_is_driving' },
    8: { name: 'Alarme de excesso de velocidade', slug: 'over_speed_alarm' },
  },
  bit2: {
    1: { name: 'Modo alarme', slug: 'alarm_mode' },
    // 2: {
    //   name: 'alarm against enter platform geo-fence(Square shape)',
    //   slug: 'alarm_against_enter_platform_geofence_square _shape)',
    // },
    // 4: {
    //   name: 'alarm against exit platform geo-fence(Square shape)',
    //   slug: 'alarm_against_exit_platform_geo-fence_square_shape)',
    // },
    8: {
      name: 'Baixa voltagem da bateria backup',
      slug: 'low_voltage_of_backup_battery',
    },
  },
  bit3: {
    // 1: { name: 'Output #2 on', slug: 'output2_on' },
    // 2: {
    //   name: 'Alarm of other car anti-theft device (input #2 on)',
    //   slug: 'Alarm_of_other_car_anti_theft_device_input2_on)',
    // },
    // 4: { name: 'Modo de economia de energia', slug: 'power_saving_mode' },
    // 8: {
    //   name: 'ACC (ignition) on (input #1)',
    //   slug: 'acc_ignition_on_input_1',
    // },
  },
  bit4: {
    // 1: { name: 'SOS alarm', slug: 'sos_alarm' },
    2: { name: 'Alarme de movimento', slug: 'movement_alarm' },
    powerCut: {
      name: 'Remoção de bateria principal',
      slug: 'alarm_against_external_power_cut',
    },
    lightViolation: {
      name: 'Violação do sensor de luz',
      slug: 'light_sensor_violation',
    },

    // 8: {
    //   name: 'Cut off engine power (output #1 on)',
    //   slug: 'cut_off_engine_power_output1_on)',
    // },
  },
  bit5: {
    // 1: {
    //   name: 'alarm against enter geo-fence 3 (Round shape)',
    //   slug: 'alarm_against_enter_geofence3_round_shape)',
    // },
    // 2: {
    //   name: 'alarm against exit geo-fence 3 (Round shape)',
    //   slug: 'alarm_against_exit_geofence3_round_shape)',
    // },
    // 4: { name: 'ADC alarm', slug: 'adc_alarm' },
    // 8: { name: 'Temperature alarm', slug: 'temperature_alarm' },
  },
  bit6: {
    // 1: {
    //   name: 'alarm against enter geo-fence 1 (Round shape)',
    //   slug: 'alarm_against_enter_geofence1_round_shape',
    // },
    // 2: {
    //   name: 'alarm against exit geo-fence 1 (Round shape)',
    //   slug: 'alarm_against_exit_geo-fence1_round_shape',
    // },
    // 4: {
    //   name: 'alarm against enter geo-fence 2 (Round shape)',
    //   slug: 'alarm_against_enter_geo-fence_round_shape)',
    // },
    // 8: {
    //   name: 'alarm against exit geo-fence 2 (Round shape)',
    //   slug: 'alarm_against_exit_geo-fence2_round_shape',
    // },
  },
  bit8: {
    1: { name: 'Aceleração brusca', slug: 'harsh_acceleration' },
    2: { name: 'Freada brusca', slug: 'harsh_brake' },
    4: { name: 'Freada de emergência', slug: 'urgent_brake' },
    // 8: {
    //   name: 'GPRS failure, unstable communication',
    //   slug: 'gprs_failure',
    // },
  },
  fd: {
    F10: {
      name: 'Falha ao ativar modo antifurto',
      slug: 'set_up anti_theft_mode_failed',
    },
    F11: {
      name: 'Modo antifurto ativado',
      slug: 'set_up_anti_theft_mode_success',
    },
    F20: {
      name: 'Falha ao desativar modo antifurto',
      slug: 'remove_anti_theft_mode_failed',
    },
    F21: {
      name: 'Modo antifurto desativado',
      slug: 'remove_anti_theft_mode_success',
    },
    Y10: {
      name: 'Falha ao ativar bloqueio',
      slug: 'set_output1_on_failed',
    },
    Y11: {
      name: 'Bloqueio ativado',
      slug: 'set_output1_on_success',
    },
    Y20: {
      name: 'Falha ao desativar bloqueio',
      slug: 'set_output1_off_failed',
    },
    Y21: {
      name: 'Bloqueio desativado',
      slug: 'set_output1_off_success',
    },
    Q10: {
      name: 'Falha ao ativar saída 2',
      slug: 'set_output2_on_failed',
    },
    Q11: {
      name: 'Saída 2 ativada',
      slug: 'set_output2_on_success',
    },
    Q20: {
      name: 'Falha ao desativar saída 2',
      slug: 'set_output2_off_failed',
    },
    Q21: {
      name: 'Saida 2 desativada',
      slug: 'set_output2_off_success',
    },
  },
};

export const latLon = (data: string) => {
  if (Number(data.charAt(0)) === 8) {
    return `-${(parseInt(data.substring(1), 16) / 600000).toFixed(7)}`;
  }
  return `${(parseInt(data, 16) / 600000).toFixed(7)}`;
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

export const status = (data: string, voltage: string) => {
  const status = [];
  if (Number(data.charAt(0)) > 0) {
    const value = statusCode.bit1[data[0]];
    value && status.push(value);
  }
  if (Number(data.charAt(1)) > 0) {
    const value = statusCode.bit2[data[1]];
    value && status.push(value);
  }
  if (Number(data.charAt(2)) > 0) {
    const value = statusCode.bit3[data[2]];
    value && status.push(value);
  }
  if (Number(data.charAt(3)) > 0) {
    if (Number(data.charAt(3)) == 4) {
      if (Number(voltage) > 4) {
        status.push(statusCode.bit4.lightViolation);
      } else {
        status.push(statusCode.bit4.powerCut);
      }
    } else {
      const value = statusCode.bit4[data.charAt(3)];
      value && status.push(value);
    }
  }
  if (Number(data.charAt(7)) > 0) {
    const value = statusCode.bit8[data.charAt(7)];
    value && status.push(value);
  }
  return status;
};

export const command = (data: string): event[] => {
  const commands: event[] = [];
  const indexF = data.indexOf('F');
  const indexY = data.indexOf('Y');
  const indexQ = data.indexOf('Q');
  if (indexF >= 0) {
    const command = data.substring(indexF, indexF + 3);
    const value = statusCode.fd[command];
    if (value === undefined) throw new Error('invalid_command');
    commands.push(value);
  }
  if (indexY >= 0) {
    const command = data.substring(indexY, indexY + 3);
    const value = statusCode.fd[command];
    if (value === undefined) throw new Error('invalid_command');
    commands.push(value);
  }
  if (indexQ >= 0) {
    const command = data.substring(indexQ, indexQ + 3);
    const value = statusCode.fd[command];
    if (value === undefined) throw new Error('invalid_command');
    commands.push(value);
  }
  return commands;
};

export const signal = (data: string) => {
  const signal = Number(data);
  if (isNaN(signal)) return undefined;
  if (signal > 32) return 100;
  return Math.round(Number(data) * (100 / 32));
};

export const speed = (data: string) => parseInt(data, 16) / 100;

export const direction = (data: string) => parseInt(data, 16) / 100;

export const ignition = (data: string) => Number(data.charAt(2)) === 8;

export const out1 = (data: string) => Number(data.charAt(3)) === 8;

export const out2 = (data: string) => Number(data.charAt(2)) === 1;

export const odometer = (data: string) => parseInt(data, 16) / 10;

export const satellite = (data: string) => data.slice(0, -1);

export const isGPSOn = (data: string) => data === 'A';

export const dateNow = () => format(new Date(), 'yyyy-MM-dd HH:mm:ss');
