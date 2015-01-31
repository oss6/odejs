var ode = (function () {

    var $ = {}, // Public members
        _ = {}; // Private members

    // Polyfills
    // Production steps of ECMA-262, Edition 5, 15.4.4.18
    // Reference: http://es5.github.io/#x15.4.4.18
    if (!Array.prototype.forEach) {

        Array.prototype.forEach = function(callback, thisArg) {

            var T, k;

            if (this == null) {
                throw new TypeError(' this is null or not defined');
            }

            // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
            var O = Object(this);

            // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
            // 3. Let len be ToUint32(lenValue).
            var len = O.length >>> 0;

            // 4. If IsCallable(callback) is false, throw a TypeError exception.
            // See: http://es5.github.com/#x9.11
            if (typeof callback !== "function") {
                throw new TypeError(callback + ' is not a function');
            }

            // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
            if (arguments.length > 1) {
                T = thisArg;
            }

            // 6. Let k be 0
            k = 0;

            // 7. Repeat, while k < len
            while (k < len) {

                var kValue;

                // a. Let Pk be ToString(k).
                //   This is implicit for LHS operands of the in operator
                // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
                //   This step can be combined with c
                // c. If kPresent is true, then
                if (k in O) {

                    // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                    kValue = O[k];

                    // ii. Call the Call internal method of callback with T as the this value and
                    // argument list containing kValue, k, and O.
                    callback.call(T, kValue, k, O);
                }
                // d. Increase k by 1.
                k++;
            }
            // 8. return undefined
        };
    }

    _.Stack = function (dataStore) {
            this.dataStore = dataStore || [];
            this.top = dataStore ? dataStore.length : 0;

            this.push = function (element) {
                this.dataStore[this.top++] = element;
            };
            this.pop = function () {
                return this.dataStore[--this.top];
            };
            this.peek = function () {
                return this.dataStore[this.top-1];
            };
            this.length = function () {
                return this.top;
            };
    };
    
    _.euler = function (init, h, n, f) {
        var x0 = init['x0'],
            y0 = init['y0'],
            xs = [x0],
            ys = [y0],
            e = parser.parse(f);

        // Create xs
        for (var x = 1; x <= n; x++)
            xs.push(x0 + x * h);

        // Create ys
        for (var i = 0; i < n; i++) {
            var xn = xs[i],
                yn = ys[i],
                fxy = e.evaluate({'x': xn, 'y': yn});//_.eval(f, {'x': xn, 'y': yn});

            ys.push(yn + (h * fxy));
        }

        return {
            'xs': xs,
            'ys': ys
        };
    };

    _.midPoint = function (init, h, n, f) {
        var x0 = init['x0'],
            y0 = init['y0'],
            xs = [x0],
            ys = [y0],
            e = parser.parse(f);

        // Create xs
        for (var x = 1; x <= n; x++)
            xs.push(x0 + x * h);

        for (var i = 0; i < n; i++) {
            var xn = xs[i],
                yn = ys[i],
                _fxy = e.evaluate({'x': xn, 'y': yn}),  //_.eval(f, {'x': xn, 'y': yn});
                fxy = e.evaluate({'x': xn + (h / 2), 'y': (h / 2) * _fxy}); //_.eval(f, {'x': xn + (h / 2), 'y': (h / 2) * _fxy});

            ys.push(yn + (h * fxy));
        }

        return {
            'xs': xs,
            'ys': ys
        };
    };

    _.rk4 = function (init, h, n, f) {
        var x0 = init['x0'],
            y0 = init['y0'],
            xs = [x0],
            ys = [y0],
            e = parser.parse(f);

        // Create xs
        for (var x = 1; x <= n; x++)
            xs.push(x0 + x * h);

        for (var i = 0; i < n; i++) {
            var xn = xs[i],
                yn = ys[i],

                k1 = e.evaluate({'x': xn, 'y': yn}), //_.eval(f, {'x': xn, 'y': yn}),
                k2 = e.evaluate({'x': xn + (h / 2), 'y': yn + (1 / 2) * k1 * h}), //_.eval(f, {'x': xn + (h / 2), 'y': yn + (1 / 2) * k1 * h}),
                k3 = e.evaluate({'x': xn + (h / 2), 'y': yn + (1 / 2) * k2 * h}) //_.eval(f, {'x': xn + (h / 2), 'y': yn + (1 / 2) * k2 * h}),
                k4 = e.evaluate({'x': xn + h, 'y': yn + k3 * h}) //_.eval(f, {'x': xn + h, 'y': yn + k3 * h});

            ys.push(yn + ((h / 6) * (k1 + (2 * k2) + (2 * k3) + k4)));
        }

        return {
            'xs': xs,
            'ys': ys
        };
    };

    $.solve = function (method, params) {
        var init = params.init,
            h    = params.h,
            n    = params.n,
            f    = params.f;

        switch(method) {
            case 'euler':    return _.euler(init, h, n, f);
            case 'midpoint': return _.midPoint(init, h, n, f);
            case 'rk4':      return _.rk4(init, h, n, f);
            default: return false; // throw exception
        }
    };

    return $;

})();
