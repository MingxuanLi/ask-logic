describe('genderAndParenthood', function() {

	var SurveyStates ;

	beforeEach(module('ask-logic', function($provide) {

	  $provide.value('$log', console);

	  jasmine.getJSONFixtures().fixturesPath='base/test/schemas';
	  schema = getJSONFixture('genderAndParenthood.json') ;

	})) ;

	beforeEach(

	 	inject(function ($injector) {
	        SurveyStates = $injector.get('SurveyStates') ;
		}) 
	);

	it ("Should inject blank answers for question fields", function() {

		var response = {} ;
		var state = SurveyStates.init(schema, response) ;

		expect(response.answers.qGender).toBeTruthy() ;
		expect(response.answers.qDependents).toBeTruthy() ;

		expect(response.answers.pMales).toBeUndefined() ;
		expect(response.answers.iMales).toBeUndefined() ;

	}) ;

	it("Should handle no gender (skip to end)", function() {

		//can skip right to end if user doesn't give a gender,
		//and then skip right back to start if they ask to go back
		var response = {
			answers:{
				qGender:{choice:"I'd rather not say"},
				qDependents: {number:2}
			}
		} ;
		var state = SurveyStates.init(schema, response) ;

		state.handleContinue() ;
		expect(response.completed).toEqual(true) ;

		state.handleBack() ;
		expect(response.pageIndex).toEqual(0) ;
		expect(response.completed).toEqual(false) ;
	}) ;

	it("Should handle male with no dependents", function() {

		var response = {
			answers:{
				qGender:{choice:"Male"},
				qDependents: {number:0}
			}
		} ;
		var state = SurveyStates.init(schema, response) ;

		state.handleContinue()
		expect(state.page.id).toEqual('pMales') ;
		expect(response.completed).toEqual(false) ;

		state.handleContinue() ;
		expect(response.completed).toEqual(true) ;

		state.handleBack()
		expect(state.page.id).toEqual('pMales') ;
		expect(response.completed).toEqual(false) ;

		state.handleBack()
		expect(response.pageIndex).toEqual(0) ;
		expect(response.completed).toEqual(false) ;
	}) ;

	it("Should handle male with dependents", function() {

		var response = {
			answers:{
				qGender:{choice:"Male"},
				qDependents: {number:2}
			}
		} ;
		var state = SurveyStates.init(schema, response) ;

		state.handleContinue()
		expect(state.page.id).toEqual('pMales') ;
		expect(response.completed).toEqual(false) ;

		state.handleContinue() ;
		expect(state.page.id).toEqual('pFathers') ;
		expect(response.completed).toEqual(false) ;

		state.handleContinue() ;
		expect(response.completed).toEqual(true) ;

		state.handleBack()
		expect(state.page.id).toEqual('pFathers') ;
		expect(response.completed).toEqual(false) ;

		state.handleBack()
		expect(state.page.id).toEqual('pMales') ;
		expect(response.completed).toEqual(false) ;

		state.handleBack()
		expect(response.pageIndex).toEqual(0) ;
		expect(response.completed).toEqual(false) ;
	}) ;

	it("Should handle female with no dependents", function() {

		var response = {
			answers:{
				qGender:{choice:"Female"},
				qDependents: {number:0}
			}
		} ;
		var state = SurveyStates.init(schema, response) ;

		state.handleContinue()
		expect(state.page.id).toEqual('pFemales') ;
		expect(response.completed).toEqual(false) ;

		state.handleContinue() ;
		expect(response.completed).toEqual(true) ;

		state.handleBack()
		expect(state.page.id).toEqual('pFemales') ;
		expect(response.completed).toEqual(false) ;

		state.handleBack()
		expect(response.pageIndex).toEqual(0) ;
		expect(response.completed).toEqual(false) ;
	}) ;

	it("Should handle female with dependents", function() {

		var response = {
			answers:{
				qGender:{choice:"Female"},
				qDependents: {number:2}
			}
		} ;
		var state = SurveyStates.init(schema, response) ;

		state.handleContinue()
		expect(state.page.id).toEqual('pFemales') ;
		expect(response.completed).toEqual(false) ;

		state.handleContinue() ;
		expect(state.page.id).toEqual('pMothers') ;
		expect(response.completed).toEqual(false) ;

		state.handleContinue() ;
		expect(response.completed).toEqual(true) ;

		state.handleBack()
		expect(state.page.id).toEqual('pMothers') ;
		expect(response.completed).toEqual(false) ;

		state.handleBack()
		expect(state.page.id).toEqual('pFemales') ;
		expect(response.completed).toEqual(false) ;

		state.handleBack()
		expect(response.pageIndex).toEqual(0) ;
		expect(response.completed).toEqual(false) ;
	}) ;

}) ;