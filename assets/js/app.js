
// Budget Controller
let budgetController = (function() {
})();


// UI Controller
let UIController = (function() {

    let DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn'
    };

    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMstrings.inputType).value,
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
            
        },

        getDOMstrings: function() {
            return DOMstrings;
        }
    };

})();


// Global App Controller
let controller = (function(budgetCtrl, UICtrl) {

    let setupEventListeners = function() {
        let DOM = UICtrl.getDOMstrings();

        document.addEventListener('keypress', function(e) {
            if(e.keyCode === 13 || e.which === 13) {
                ctrtAddItem();
            }
        });
    
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrtAddItem);
    }

    let ctrtAddItem = function() {
        let inputs = UICtrl.getInput();
    };

    return {
        init: function() {
            console.log('Application has started...');
            setupEventListeners();
        }
    };

})(budgetController, UIController);

controller.init();
