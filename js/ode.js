var ode = (function () {

    var $ = {}, // Public members
        _ = {}, // Private members

        ops = "-+/*^",
        op_map = {
            '+': function (a, b) { return a + b },
            '-': function (a, b) { return a - b },
            '*': function (a, b) { return a * b },
            '/': function (a, b) { return a / b },
            '^': function (a, b) { return Math.pow(a, b) }
        },
        precedence = {"^":4, "*":3, "/":3, "+":2, "-":2},
        associativity = {"^":"Right", "*":"Left", "/":"Left", "+":"Left", "-":"Left"};

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

    // does not work for sin cos and company...
    _.subst = function (expr, vars) {
        var nexpr = '';

        for (var i = 0, len = expr.length; i < len; i++) {
            var ch = expr[i];

            nexpr += (vars[ch] !== undefined ? vars[ch] : ch);
        }

        return nexpr;
    };

    _.postfix = function (infix) {
        var s = new _.Stack(),
            token,
            postfix = "",
            o1, o2;

        for (var i = 0, len = infix.length; i < len; i++) {
            token = infix[i];
            if (token >= "0" && token < "9") { // if token is operand (here limited to 0 <= x <= 9)
                postfix += token + " ";
            }
            else if (ops.indexOf(token) != -1) { // if token is an operator
                o1 = token;
                o2 = s.peek();
                while (ops.indexOf(o2)!=-1 && ( // while operator token, o2, on top of the stack
                    // and o1 is left-associative and its precedence is less than or equal to that of o2
                    (associativity[o1] == "Left" && (precedence[o1] <= precedence[o2]) ) ||
                    // the algorithm on wikipedia says: or o1 precedence < o2 precedence, but I think it should be
                    // or o1 is right-associative and its precedence is less than that of o2
                    (associativity[o1] == "Right" && (precedence[o1] < precedence[o2]))
                )){
                    postfix += o2 + " "; // add o2 to output queue
                    s.pop(); // pop o2 of the stack
                    o2 = s.peek(); // next round
                }
                s.push(o1); // push o1 onto the stack
            }
            else if (token == "(") { // if token is left parenthesis
                s.push(token); // then push it onto the stack
            }
            else if (token == ")") { // if token is right parenthesis
                while (s.peek() != "("){ // until token at top is (
                    postfix += s.pop() + " ";
                }
                s.pop(); // pop (, but not onto the output queue
                }
            }
            while (s.length()>0){
                postfix += s.pop() + " ";
            }

        return postfix;
    };

    _.getComponents = function (str) {
        var arr = [],
            num = '',
            operators = ops.split('');

        for (var i = 0, len = str.length; i < len; i++) {
            var ch = str[i];

            if (ch === '(' || ch === ')' || operators.indexOf(ch) !== -1) {
                if (num !== '') arr.push(num);
                num = '';
                arr.push(ch);
            }
            else {
                num += ch;
            }
        }

        arr.push(num); // Push remaining number

        return arr;
    };

    _.eval = function (e, vars) {
        var expr = _.subst(e.replace(/\s+/g, ''), vars),
            rpn = _.postfix(_.getComponents(expr)),
            tokens = rpn.slice(0, rpn.length - 1).split(' '),
            stack = [],
            operators = ops.split('');

        // Evaluate RPN
        tokens.forEach(function (token) {
            if (operators.indexOf(token) === -1) {
                stack.push(token);
            }
            else {
                if (stack.length < 2) return false; // throw exception
                else {
                    // Pop 2 values
                    var op1 = parseFloat(stack.pop()),
                        op2 = parseFloat(stack.pop()),
                        fn = op_map[token];

                    stack.push(fn(op1, op2));
                }
            }
        });

        if (stack.length === 1) return stack[0];

        return false; // throw exception
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
                yn = ys[i],
                fxy = _.eval(f, {'x': xn, 'y': yn});

            ys.push(yn + (h * fxy));
        }

        return {
            'xs': xs,
            'ys': ys
        };
    };

    $.midPoint = function (init, h, n, f) {
        var x0 = init['x0'],
            y0 = init['y0'],
            xs = [x0],
            ys = [y0];

        // Create xs
        for (var x = 1; x <= n; x++)
            xs.push(x0 + x * h);

        for (var i = 0; i < n; i++) {
            var xn = xs[i],
                yn = ys[i],
                _fxy = _.eval(f, {'x': xn, 'y': yn});
                fxy = _.eval(f, {'x': xn + (h / 2), 'y': (h / 2) * _fxy});

            ys.push(yn + (h * fxy));
        }

        return {
            'xs': xs,
            'ys': ys
        };
    };

    $.rk4 = function (init, h, n, f) {
        var x0 = init['x0'],
            y0 = init['y0'],
            xs = [x0],
            ys = [y0];

        // Create xs
        for (var x = 1; x <= n; x++)
            xs.push(x0 + x * h);

        for (var i = 0; i < n; i++) {
            var xn = xs[i],
                yn = ys[i],

                // Fix these
                k1 = 0,
                k2 = 0,
                k3 = 0,
                k4 = 0;

            ys.push(yn + ((h / 6) * (k1 + 2 * k2 + 2 * k3 + k4)));
        }

        return {
            'xs': xs,
            'ys': ys
        };
    };

    return $;

})();
