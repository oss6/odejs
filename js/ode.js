var ode = (function () {

    var $ = {}, // Public members
        _ = {}; // Private members
    
    _.subst = function (expr, vars) {
        
    };
    
    _.parse = function (expr) {
        
    };
    
    _.eval = function (rpn) {
        
    };
    
    $.euler = function (init, h, n, f) {
        var x0 = init['x0'],
            y0 = init['y0'],
            xs = [x0],
            ys = [y0];

        // Create xs
        for (var x = 1; x <= n; x++)
            xs.push(x0 + x * h);

        // Create ys
        for (var i = 0; i < n; i++) {
            var xn = xs[i],
                yn = ys[i];

            ys.push(yn + (h * f(xn, yn)))
        }

        return {
            'xs': xs,
            'ys': ys
        }
    };

    $.midPoint = function () {

    };

    return $;

})();
