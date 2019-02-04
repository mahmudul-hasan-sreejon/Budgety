
// Budget Controller
let budgetController = (function() {
})();


// UI Controller
let UIController = (function() {
})();


// Global App Controller
let controller = (function(budgetCtrl, UICtrl) {

    let ctrtAddItem = function() {
        console.log('OK');
    };


    document.addEventListener('keypress', function(e) {
        if(e.keyCode === 13 || e.which === 13) {
            ctrtAddItem();
        }
    });

    document.querySelector('.add__btn').addEventListener('click', ctrtAddItem);

})(budgetController, UIController);
