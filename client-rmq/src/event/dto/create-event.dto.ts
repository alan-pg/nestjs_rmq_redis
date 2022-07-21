export class CreateEventDto {
    id: string;
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
}
