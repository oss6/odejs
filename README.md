# odejs
Numerical methods for first-order ordinary differential equations in Javascript

## API
```javascript
ode.solve(method, params)
```
- `method : string` specifies the used method ('euler' or 'midpoint' or 'rk4')
- `params : object` specifies the method parameters:
    - `init : object` contains the initial point
    - `h : number` specifies the step
    - `n : number` specifies the x range
    - `f : string` specifies the derivative expression `y' = f(x, y)`

**N.B.: at the moment the accepted operators are just the basic ones. Later there will be support for trigonometric functions.**

In the following methods the `params` variable will be:
```javascript
var params = {
    'init' : {'x0': 0, 'y0': 1},
    'h'    : 0.01,
    'n'    : 50,
    'f'    : 'x + y'
};
```

## Euler method
**Description**

It is the most basic explicit method for numerical integration of ordinary differential equations and is the simplest Runge–Kutta method.

**Usage**
```javascript
var points = ode.solve('euler', params);
```

## Midpoint (Runge-Kutta second order)
**Description**

The Euler method uses a one-sided estimate of the derivative to advance the system from time i to time i+1. We would do better if we could use a centered estimate--that is, if we know the derivative at the center of the interval, at time i + 1/2. The reason for this becomes clear if we look at the Taylor series. Imagine applying the Euler method, but use the derivative at the mid-point, instead of at the start of the range.

**Usage**
```javascript
var points = ode.solve('midpoint', params);
```

## Runge-Kutta method (RK4)
**Description**


**Usage**
```javascript
var points = ode.solve('rk4', params);
```
