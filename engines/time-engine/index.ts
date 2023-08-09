// @ts-ignore
import moment from 'moment';

export function humanizeDate(date: string): string {
    // @ts-ignore
    return moment.duration(moment() - moment(date)).humanize();
}


export default moment();
