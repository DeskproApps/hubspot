import { msToDuration } from '../date/msToDuration';

describe('msToDuration', () => {
    it('should return "00:00:00" for undefined input', () => {
        expect(msToDuration()).toBe('0');
    });

    it('should return "00:00:00" for 0 milliseconds', () => {
        expect(msToDuration(0)).toBe('0');
    });

    it('should return "00:00:01" for 1000 milliseconds', () => {
        expect(msToDuration(1000)).toBe('00:00:01');
    });

    it('should return "00:01:00" for 60000 milliseconds', () => {
        expect(msToDuration(60000)).toBe('00:01:00');
    });

    it('should return "01:00:00" for 3600000 milliseconds', () => {
        expect(msToDuration(3600000)).toBe('01:00:00');
    });

    it('should return "01:01:01" for 3661000 milliseconds', () => {
        expect(msToDuration(3661000)).toBe('01:01:01');
    });

    it('should return "10:10:10" for 36610000 milliseconds', () => {
        expect(msToDuration(36610000)).toBe('10:10:10');
    });

    it('should return "00:00:59" for 59000 milliseconds', () => {
        expect(msToDuration(59000)).toBe('00:00:59');
    });

    it('should return "00:59:59" for 3599000 milliseconds', () => {
        expect(msToDuration(3599000)).toBe('00:59:59');
    });

    it('should return "23:59:59" for 86399000 milliseconds', () => {
        expect(msToDuration(86399000)).toBe('23:59:59');
    });
});