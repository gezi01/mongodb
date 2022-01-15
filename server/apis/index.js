module.exports = function(app){
    [
        require("./login"),
        require("./customize-iteration"),
        require("./more-iteration")
    ].forEach(function(f){
        f(app);
    });
};