# odejs
Numerical methods for first-order ordinary differential equations in Javascript

## Euler method
**Description**

It is the most basic explicit method for numerical integration of ordinary differential equations and is the simplest Runge–Kutta method

**Function interface**
```javascript
euler(init, h, n, f)
```
Where *init* is a 2-key object ('x0' and 'y0') that defines the Cauchy problem.
*h* is the step, *n* is the maximum range and *f* is the expression passed
as a string.

**Usage**
```javascript
ode.euler({'x0': 0, 'y0': 1}, 0.01, 50, 'x + y');
```

## Midpoint (Runge-Kutta second order)
**TODO**

## Runge-Kutta method (RK4)
**TODO**
