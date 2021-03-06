describe('chatVisitorFeedback', function() {

	var SurveyStates ;


	beforeEach(module('askjs.core', function($provide) {

	  	$provide.value('$log', console);

	  	jasmine.getJSONFixtures().fixturesPath='base/test/schemas';
		schema = getJSONFixture('chatVisitorFeedback.json') ;
	})) ;

	beforeEach(function() {

		inject(function ($injector) {
			SurveyStates = $injector.get('SurveyStates') ;
		}) ;
	}) ;

	describe('initialization', function() {

		it("Should clone all fields in schema", function() {

			var response = {answers:{}} ;
			var state = SurveyStates.init(schema, response) ;

			expect(state.schema.fields.length).toEqual(10) ;
			expect(state.schema.fieldsById["qGender"].question).toEqual("What gender are you?") ;
			expect(state.schema.fieldsById["qGender2"].question).toEqual("What best describes you?") ;
			expect(state.schema.fieldsById["qGender"].affectedFieldRules.length).toEqual(1) ;
			expect(state.schema.fieldsById["qWorthwhile"].affectedFieldRules.length).toEqual(1) ;
		})

		it ("Should have an unnamed page for all fields", function() {

			var response = {answers:{}} ;
			var state = SurveyStates.init(schema, response) ;

			expect(state.schema.pages.length).toEqual(1) ;
			expect(state.schema.pages[0].relevantFields.length).toEqual(10) ;
		})

		it ("Should clone all field rules in schema", function() {

			var response = {answers:{}} ;
			var state = SurveyStates.init(schema, response) ;

			console.log(state.schema.fieldRules) ;

			expect(state.schema.fieldRules.length).toEqual(2) ;
		})

		

	}) ;


	describe('field rules', function() {

		it("Should manage visibility of qGender2", function() {

			var response = {answers:{}} ;
			var state = SurveyStates.init(schema, response) ;

			expect(state.schema.fieldsById["qGender2"].visible).toEqual(false) ; 

			response.answers["qGender"] = {choice:"Male"} ;
			state.handleAnswerChanged("qGender") ;
			expect(state.schema.fieldsById["qGender2"].visible).toEqual(false) ; 

			response.answers["qGender"] = {choice:"Female"} ;
			state.handleAnswerChanged("qGender") ;
			expect(state.schema.fieldsById["qGender2"].visible).toEqual(false) ; 

			response.answers["qGender"] = {choice:"More options"} ;
			state.handleAnswerChanged("qGender") ;
			expect(state.schema.fieldsById["qGender2"].visible).toEqual(true) ; 
		}) ;

		it("Should manage visibility of qSuggestions", function() {

			var response = {answers:{}} ;
			var state = SurveyStates.init(schema, response) ;

			expect(state.schema.fieldsById["qSuggestions"].visible).toEqual(false) ; 

			response.answers["qWorthwhile"] = {choice:"Yes"} ;
			state.handleAnswerChanged("qWorthwhile") ;
			expect(state.schema.fieldsById["qSuggestions"].visible).toEqual(false) ;

			response.answers["qWorthwhile"] = {choice:"No"} ;
			state.handleAnswerChanged("qWorthwhile") ;
			expect(state.schema.fieldsById["qSuggestions"].visible).toEqual(true) ;  
		})
	}) ;

	describe('submission', function() {

		it ("Should only block submission for mandatory fields that are visible", function() {

			var response = {
				answers:{
					qVisitorId: {text:"visitorId"},
					qSessionId: {text:"sessionId"},
					qGender: {choice:"More options"},
					qPostcode: {number:2095},
					qForumMember: {choice:"Yes"},
					qMoodBefore: {mood:{name:"discouraged",valence:-0.5,arousal:-0.3}},
					qMoodNow: {mood:{name:"chill",valence:0.3,arousal:-0.5}},
					qWorthwhile: {choice:"No"}
				}
			} ;

			var state = SurveyStates.init(schema, response) ;

			state.handleContinue() ;
			expect(response.completed).toEqual(false) ;

			response.answers["qGender"] = {choice:"Male"} ;
			state.handleAnswerChanged("qGender") ;
			state.handleContinue() ;
			expect(response.completed).toEqual(true) ;
		}) ;

	}) ;


}) ;
