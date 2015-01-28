var odeApp = (function () {

    var $ = {}, // Public members
        _ = {}, // Private members
        canvas,
        ctx;

    _.MethodVisualizer = function (points) {
        this.chart  = null;
        this.canvas = null;
        this.ctx    = null;
        this.points = points;

        this.draw = function (id) {
            var options = {
                pointDotRadius : 3,
                //datasetStroke : false,
            };

            this.canvas = document.getElementById(id);
            this.canvas.width = 500;
            this.canvas.height = 500;
            this.ctx = this.canvas.getContext('2d');
            this.chart = new Chart(this.ctx).Line(this.getData(), options);
        };

        this.getData = function () {
            return {
                        labels: this.points.xs,
                        datasets: [{
                            label: "ODE dataset",
                            fillColor: "rgba(220,220,220,0.2)",
                            strokeColor: "rgba(220,220,220,1)",
                            pointColor: "rgba(220,220,220,1)",
                            pointStrokeColor: "#fff",
                            pointHighlightFill: "#fff",
                            pointHighlightStroke: "rgba(220,220,220,1)",
                            data: this.points.ys
                        }]
            };
        };
    };

    // Global configurations
    //Chart.defaults.global.responsive = true;
    Chart.defaults.global.showTooltips = false;
    //Chart.defaults.global.scaleShowLabels = false;

    $.init = function () {
        // Get data
        var params = {
            f: 'x*y + 2*x + 3',
            init: {
                'x0': 0,
                'y0': 3
            },
            h: 0.01,
            n: 50
        },
        euler    = new _.MethodVisualizer(ode.solve('euler', params)),
        midPoint = new _.MethodVisualizer(ode.solve('midpoint', params)),
        rk4      = new _.MethodVisualizer(ode.solve('rk4', params));

        // Event handlers
        /*window.addEventListener('resize', function () {
            _.draw();
        }, false);*/

        // Set canvas (visualization)
        euler.draw('eulerChart');
        midPoint.draw('midPointChart');
        rk4.draw('rk4Chart');
    };

    return $;
})();

window.onload = odeApp.init;
