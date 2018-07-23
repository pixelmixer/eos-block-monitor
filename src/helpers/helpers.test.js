import { formatTime } from '../helpers/helpers'

it('formats time correctly', () => {
  expect(formatTime('2018-07-23T04:19:25.000')).toEqual('07/23/18 04:19:25')
})
