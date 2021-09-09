import randomRightAscensionAndDeclination from '../helpers';

describe('helper functions', () => {

    it('calculates random alpha and delta values', () => {
        expect.hasAssertions();
        const {alpha, delta} = randomRightAscensionAndDeclination();
        expect(alpha).toBeGreaterThanOrEqual(0);
        expect(alpha).toBeLessThan(6.3);
        expect(delta).toBeGreaterThanOrEqual(-1.6);
        expect(delta).toBeLessThan(1.6);
    });

});

