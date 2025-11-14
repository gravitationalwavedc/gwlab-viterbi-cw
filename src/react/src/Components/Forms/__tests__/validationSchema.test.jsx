import validationSchema from '../validationSchema';

describe('the validation schema', () => {
    it('name field should not allow initial values', async () => {
        expect.hasAssertions();
        const schema = validationSchema({name: 'InitialName'});
        await expect(schema.validateAt('name', {name: 'InitialName'}))
            .rejects.toThrow('Name must be modified from default');
        await expect(schema.validateAt('name', {name: 'DifferentName'})).resolves.toBeDefined();
    });

    it('description field should not allow initial values', async () => {
        expect.hasAssertions();
        const schema = validationSchema({description: 'Initial description'});
        await expect(schema.validateAt('description', {description: 'Initial description'}))
            .rejects.toThrow('Description must be modified from default');
        await expect(schema.validateAt('description', {description: 'Different description'})).resolves.toBeDefined();
    });
});