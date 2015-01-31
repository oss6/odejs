var parser = (function () {

    var $ = {},
        _ = {},

        operators = {
            '+': {
                'arity': 2,
                'precedence': 2,
                'associativity': 'L',
                'fn': function (a, b) { return a + b }
            },

            '-': {
                'arity': 2,
                'precedence': 2,
                'associativity': 'L',
                'fn': function (a, b) { return a - b }
            },

            '*': {
                'arity': 2,
                'precedence': 3,
                'associativity': 'L',
                'fn': function (a, b) { return a * b }
            },

            '/': {
                'arity': 2,
                'precedence': 3,
                'associativity': 'L',
                'fn': function (a, b) { return a / b }
            },

            '^': {
                'arity': 2,
                'precedence': 4,
                'associativity': 'R',
                'fn': function (a, b) { return Math.pow(a, b) }
            },
        };

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

    _.postfix = function (infix) {
        var s = new _.Stack(),
            token,
            postfix = "",
            o1, o2;

        for (var i = 0, len = infix.length; i < len; i++) {
            token = infix[i];

            if (token == "(") { // if token is left parenthesis
                s.push(token); // then push it onto the stack
            }
            else if (token == ")") { // if token is right parenthesis
                while (s.peek() != "("){ // until token at top is (
                    postfix += s.pop() + " ";
                }

                s.pop(); // pop (, but not onto the output queue
            }
            else if (!operators.hasOwnProperty(token)) {
                postfix += token + " ";
            }
            else { // if token is an operator
                o1 = token;
                o2 = s.peek();
                while (operators.hasOwnProperty(o2) && ( // while operator token, o2, on top of the stack
                    // and o1 is left-associative and its precedence is less than or equal to that of o2
                    (operators[o1].associativity === "L" && (operators[o1].precedence <= operators[o2].precedence) ) ||
                    // or o1 is right-associative and its precedence is less than that of o2
                    (operators[o1].associativity === "R" && (operators[o1].precedence < operators[o2].precedence))
                )) {
                    postfix += o2 + " "; // add o2 to output queue
                    s.pop(); // pop o2 of the stack
                    o2 = s.peek(); // next round
                }
                s.push(o1); // push o1 onto the stack
            }
        }

        while (s.length() > 0) {
            postfix += s.pop() + " ";
        }

        return postfix.slice(0, postfix.length - 1);
    };

    _.getComponents = function (str) {
        var arr = [],
            num = '';

        for (var i = 0, len = str.length; i < len; i++) {
            var ch = str[i];

            if (ch === '(' || ch === ')' || operators.hasOwnProperty(ch)) {
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

    _.eval = function (root, scope) {
        var isLeaf = (root.left === null && root.right === null),
            val = root.val;
            
        if (isLeaf) { return scope[val] !== undefined ? scope[val] : val; }
        else {
            return operators[val].fn(_.eval(root.left, scope), _.eval(root.right, scope));  // Check this
        }
    };

    // From string expr to expr tree
    $.parse = function (expr) {
        // Get postfix notation
        var pfix = _.postfix(_.getComponents(expr)).split(' '),
            expt = null, // Empty tree
            pstack = [];

        // From postfix notation to expr tree
        for (var i = 0, len = pfix.length; i < len; i++) {
            var sym = pfix[i];

            if (!operators.hasOwnProperty(sym)) { // Operands
                pstack.push($.Node(sym, null, null)); // Leaf node
            }
            else { // Operator
                var arity = operators[sym].arity,
                    syms = [];

                for (var j = 0; j < arity; j++) {
                    syms.push(pstack.pop());
                }

                pstack.push(syms.length === 1 ?
                        $.Node(sym,
                            $.Node(syms[0].val, null, null),
                            null
                        ) :
                        $.Node(sym,
                            $.Node(syms[0].val, null, null),
                            $.Node(syms[1].val, null, null)
                        )
                );
            }
        }

        if (pstack.length === 1) return $.ExprTree(pstack[0]);
        else return false;
    };

    $.Node = function (val, left, right) {
        if (!(this instanceof $.Node)) {
            return new $.Node(val, left, right);
        }

        if (!(left instanceof $.Node && right instanceof $.Node) && (left !== null && right !== null)) {
            throw new Exception('Error! Not a valid node.');
        }

        this.val = val;
        this.left = left;
        this.right = right;
    };

    $.ExprTree = function (root) {
        if (!(this instanceof $.ExprTree)) {
            return new $.ExprTree(root);
        }

        this.root = root;

        this.evaluate = function (scope) {
            return _.eval(this.root, scope);
        };
    };


    return $;
})();
