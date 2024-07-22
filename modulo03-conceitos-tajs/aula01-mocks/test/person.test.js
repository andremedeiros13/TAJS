import{describe, it, expect, jest} from '@jest/globals';
import Person from '../src/person';

describe('#Person Suite', ()=>{
    describe('#validade', ()=>{
        it('should throw if then name is not present', ()=>{
            //mock é a entrada para que o teste funcione
            const mockInvalidPerson ={
                name: '',
                cpf: '111.111.111-11'
            }

            expect(() => Person.validate(mockInvalidPerson)).toThrow(new Error('name is required'))
        })

        it('should throw if then cpf is not present', ()=>{
            const mockInvalidPerson={
                name:'Jose da Silva',
                cpf: ''
            }

            expect(()=> Person.validate(mockInvalidPerson)).toThrow(new Error('cpf is required'))
        })


        it('should not throw if then cpf is not present', ()=>{
            const mockInvalidPerson={
                name:'Jose da Silva',
                cpf: '111.111.111-11'
            }

            expect(()=> Person.validate(mockInvalidPerson)).not.toThrow()
        })
    })

    describe('#format', ()=> {
        //parte do principio que os dados ja foram validados!

        it('should format the person name and CPF', () =>{
            // AAA

            // Arrange = Preparar
            const mockPerson = {
                name: 'Jose da Silva Moreira',
                cpf: '111.000.111-00'
            }

            // Act = Executar
            const formattedPerson = Person.format(mockPerson)

            // Assert = Validar

            const expected = {
                name: 'Jose',
                cpf: '11100011100',
                lastName: 'da Silva Moreira'
            }

            expect(formattedPerson).toStrictEqual(expected)
        })
    })

    describe('#Save', ()=> {
        it('should be throw if CPF not present', ()=> {
            const mockInvalidPerson = {
                name: 'Jose',
                cpf: '',
                lastName: 'da Silva'
            }

            expect(()=> Person.save(mockInvalidPerson)).toThrow(new Error(`cannot save invalide person: ${JSON.stringify(mockInvalidPerson)}`))
        })

        it('should be throw if name not present', ()=> {
            const mockInvalidPerson = {
                name: '',
                cpf: '11100011100',
                lastName: 'da Silva'
            }

            expect(()=> Person.save(mockInvalidPerson)).toThrow(new Error(`cannot save invalide person: ${JSON.stringify(mockInvalidPerson)}`))
        })

        it('should be throw if lastName not present', ()=> {
            const mockInvalidPerson = {
                name: 'Jose',
                cpf: '11100011100',
                lastName: ''
            }

            expect(()=> Person.save(mockInvalidPerson)).toThrow(new Error(`cannot save invalide person: ${JSON.stringify(mockInvalidPerson)}`))
        })

        it('should be throw if data not present', ()=> {
            const mockInvalidPerson = {
                name: '',
                cpf: '',
                lastName: ''
            }

            expect(()=> Person.save(mockInvalidPerson)).toThrow(new Error(`cannot save invalide person: ${JSON.stringify(mockInvalidPerson)}`))
        })
    })

    describe('#process', () =>{
        it('should process a valid person', ()=>{
            // É importante não restestar o que já foi testado
            // Checkpoints
            // Se foi testado do caminho A ao caminho B
            //  agora deve ser testado do caminho B ao caminho C
            // Então, deve ser pulado A(validade), B(format)
            // e vamos direto para o caminho C(save), visto que
            // os caminhos anteriores já foram testados.

            // O metodo a seguir faz sentidos quando existe interações externas
            // por exemplo, API, banco de dados e etc...

            // Mocks são simulações de funções que você pode fazer ao tentar o comportamento


            /// AAA = Arrange, Act e Assert
            
            // Arrange
            const mockPerson = {
                name: 'Jose da Silva',
                cpf: '111-444-666-11'
            }
            jest.spyOn(Person, Person.validate.name).mockReturnValue()
            jest.spyOn(Person, Person.format.name).mockReturnValue({
                name: 'Jose',
                lastName: 'da Silva',
                cpf: '11144466611'
            })

            //Act
            const result = Person.process(mockPerson)

            //Assert
            const expected = 'ok'
            expect(result).toStrictEqual(expected)
        })
    })
})