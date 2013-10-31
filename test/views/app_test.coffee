Formbuilder = window.Formbuilder

describe 'Formbuilder', ->
    beforeEach ->
        @view = new Formbuilder()

    it 'should exist', ->
        expect(@view).to.be.ok
