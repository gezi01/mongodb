module.exports = function(app){
    [
        require("./login"),
        require("./customize-iteration")
    ].forEach(function(f){
        f(app);
    });
};