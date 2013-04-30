define('spec/Fields/PhoneField.spec', ['argos/Fields/PhoneField'], function(PhoneField) {
return describe('argos.Fields.PhoneField', function() {

    it('Can strip symbols characters when first character is not +', function() {
        var field = new PhoneField();

        field.inputNode.value = '01`~!@#$%^&*()-_=+[]{}\\|;:\'",<.>/?23';

        expect(field.getValue()).toEqual('0123');
    });
    it('Can leave symbols characters when first character is +', function() {
        var field = new PhoneField();

        field.inputNode.value = '+01_-~~23';

        expect(field.getValue()).toEqual('+01_-~~23');
    });
    it('Can leave letter characters when first character is +', function() {
        var field = new PhoneField();

        field.inputNode.value = '+01abc23';

        expect(field.getValue()).toEqual('+01abc23');
    });
    it('Can set original value on setValue with true flag', function() {
        var field = new PhoneField();

        field.setValue('test', true);

        expect(field.originalValue).toEqual('test');
    });
    it('Can not set original value on setValue with false flag', function() {
        var field = new PhoneField();

        field.setValue('test', false);

        expect(field.originalValue).toEqual(null);
    });

    it('Can clear previous value on setValue', function() {
        var field = new PhoneField();

        field.previousValue = 'test';

        field.setValue('test', false);

        expect(field.previousValue).toEqual(false);
    });
});
});
