import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function timeFromNow(lastUpdated: string) {
  return `${dayjs(lastUpdated).fromNow()}`;
}

export function since(firstUpdated: string) {
  return `${dayjs(firstUpdated).format('DD/MM/YYYY')}`;
}
