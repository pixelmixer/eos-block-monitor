import moment from 'moment';

const formatTime = (time) => moment(time).format('MM/DD/YY hh:mm:ss')

export { formatTime }
