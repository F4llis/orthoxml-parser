/**
 * @jest-environment jsdom
 */

const OrthoxmlParser = require("./dist-jest/orthoxml-parser").OrthoxmlParser;
const fs = require("fs");
const path = require("path");

const data_simple = fs.readFileSync(path.join('./examples/data/', "./", "HOG_C0348246.orthoxml"), "utf8");
const data_augmented = fs.readFileSync(path.join('./examples/data/', "./", "HOG_C0348246_augmented.orthoxml"), "utf8");

expect.extend({
    toContainObject(received, argument) {

        const pass = this.equals(received,
            expect.arrayContaining([
                expect.objectContaining(argument)
            ])
        )

        if (pass) {
            return {
                message: () => (`expected ${this.utils.printReceived(received)} not to contain object ${this.utils.printExpected(argument)}`),
                pass: true
            }
        } else {
            return {
                message: () => (`expected ${this.utils.printReceived(received)} to contain object ${this.utils.printExpected(argument)}`),
                pass: false
            }
        }
    }
})

test('check parser finish on simple', () => {
    var data = OrthoxmlParser.parse(data_simple);
    expect(data.id).toBe('HOG:C0348246')
})

test('check parser finish on augmented', () => {
    var data = OrthoxmlParser.parse(data_augmented);
    expect(data.id).toBe('HOG:C0348246_4892')
})

test('check extended information parsed', () => {

    var data = OrthoxmlParser.parse(data_augmented);
    expect(data.id).toBe('HOG:C0348246_4892');
    expect(data.completeness_score).toBe('0.889');
    expect(data.nr_members).toBe('32');
    expect(data.taxid).toBe('4892');
    expect(data.paralog).toBe(false);

})

test('check hierarchy simple', () => {

    var data = OrthoxmlParser.parse(data_simple);

    // CHECK ROOT
    expect(data.children.length).toBe(6)

    // CHECK LEVEL -1
    var c2_para = false;
    var c2_ortho  = false;
    var c6 = false;
    var c10 = false;

    for (c in data.children){

        var c = data.children[c];

        if (c.children) {

            switch (c.children.length) {
                case 2:
                    if (c.paralog){c2_para = c}
                    else {c2_ortho = c}
                    break;
                case 6:
                    c6 = c;
                    break;
                case 10:
                    c10 = c;
                    break;
                default:
                    expect(false).toBeTruthy()
            }
        }

        else{
            expect([{ id: 'CANAR04081'},{ id: 'DIURU02455'}]).toContainObject(c)
        }

    }

    expect(c2_para).not.toBeFalsy();
    expect(c2_ortho).not.toBeFalsy();
    expect(c6).not.toBeFalsy();
    expect(c10).not.toBeFalsy();

    // CHECK LEVEL -2 PARA2
    expect(c2_para.children[1].id).toBe('KOMPG01877');
    check_children(c2_para.children[0].children, [{ id: 'CYBFA04928'},{ id: 'CYBJN05984'}])

    // CHECK LEVEL -2 ORTHO2
    check_children(c2_ortho.children, [{ id: 'DEKBR02017'},{ id: 'OGAPD03941'}])

    // CHECK LEVEL -2 ORTHO6

    for (var i= 0; i < c6.children.length -1; i++) {
        expect([{ id: 'DEBHA03089'},{ id: 'PICGU00133'},{ id: 'PICST05083'},{ id: 'SPAPN01027'},{ id: 'CANTE02132'}]).toContainObject(c6.children[i])
    }
    var c6_2 = c6.children[5];

    // CHECK LEVEL -3 ORTHO6
    expect([{ id: 'LODEL04560'}]).toContainObject(c6_2.children[0])
    var c6_2_2 = c6_2.children[1]

    // CHECK LEVEL -4 ORTHO6
    expect([{ id: 'CANMX05265'}]).toContainObject(c6_2_2.children[0])
    var c6_2_2_2 = c6_2_2.children[1]

    // CHECK LEVEL -5 ORTHO6
    check_children(c6_2_2_2.children, [{ id: 'CANAL05165'},{ id: 'CANAW01585'}])

    // CHECK LEVEL -2 ORTHO10

    for (var i= 0; i < 5; i++) {
        expect([{ id: 'KAZNA03900'},{ id: 'NAUCC04118'},{ id: 'KLULA00014'},{ id: 'CANGA00641'},{ id: 'VANPO03904'},{ id: 'ZYGRO01712'}]).toContainObject(c10.children[i])
    }

    expect([{ id: 'KAZNA03900'},{ id: 'NAUCC04118'},{ id: 'KLULA00014'},{ id: 'CANGA00641'},{ id: 'VANPO03904'},{ id: 'ZYGRO01712'}]).toContainObject(c10.children[7])


    var o5 =[{ id: 'ERECY03926'},{ id: 'ASHGO02161'}]
    var o6 =[{ id: 'LACFM00560'},{ id: 'LACTC03075'}]
    var o8 =[{ id: 'TETBL01629'},{ id: 'TETPH01551'}]
    var o9 =[{ id: 'YEAST00015'},{ id: 'YEASA02780'}, { id: 'YEASO02411'},{ id: 'YEASV03814'}]

    check_children(c10.children[5].children, o5)
    check_children(c10.children[6].children, o6)
    check_children(c10.children[8].children, o8)
    check_children(c10.children[9].children, o9)


})

function check_children(children, ref){

    for (const childrenKey in children) {
        expect(ref).toContainObject(children[childrenKey])
    }
}