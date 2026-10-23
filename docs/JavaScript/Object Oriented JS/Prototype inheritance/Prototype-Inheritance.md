# Prototype Inheritance in JavaScript

Prototype inheritance lets one object inherit properties and methods from another object through the prototype chain.

## Inheriting with Object.create

```js
const animal = {
  eat() {
    return `${this.name} is eating`;
  },
};

const dog = Object.create(animal);
dog.name = "Rex";
dog.bark = function () {
  return `${this.name} says woof`;
};

dog.eat();  // "Rex is eating"  (inherited)
dog.bark(); // "Rex says woof"  (own)
```

## Inheritance with Constructor Functions

### Step 1: Parent Constructor

```js
function Animal(name) {
  this.name = name;
}

Animal.prototype.eat = function () {
  return `${this.name} is eating`;
};
```

### Step 2: Child Constructor

```js
function Dog(name, breed) {
  Animal.call(this, name); // inherit instance properties
  this.breed = breed;
}
```

`Animal.call(this, name)` runs the parent constructor with `this` set to the new `Dog`.

### Step 3: Link the Prototypes

```js
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog; // restore the constructor reference
```

### Step 4: Add Child Methods

```js
Dog.prototype.bark = function () {
  return `${this.name} says woof`;
};
```

### Using It

```js
const rex = new Dog("Rex", "Labrador");

rex.eat();   // "Rex is eating"   (from Animal.prototype)
rex.bark();  // "Rex says woof"   (from Dog.prototype)

rex instanceof Dog;    // true
rex instanceof Animal; // true
```

The chain is: `rex` → `Dog.prototype` → `Animal.prototype` → `Object.prototype` → `null`.

## Overriding Methods

```js
Dog.prototype.eat = function () {
  const base = Animal.prototype.eat.call(this);
  return `${base} (and wagging its tail)`;
};

rex.eat(); // "Rex is eating (and wagging its tail)"
```

## Why Not Dog.prototype = Animal.prototype?

```js
Dog.prototype = Animal.prototype; // wrong
```

Both would share the same object, so adding a method to `Dog.prototype` would also add it to `Animal.prototype`. `Object.create(Animal.prototype)` creates a separate object that links to it.

## Why Not Dog.prototype = new Animal()?

This runs the parent constructor at setup time and can leave unwanted properties on the prototype. `Object.create(Animal.prototype)` avoids that.

## Checking Inheritance

```js
Animal.prototype.isPrototypeOf(rex);     // true
rex instanceof Animal;                   // true
Object.getPrototypeOf(rex) === Dog.prototype; // true
```

## Setting the Prototype Directly

```js
Object.setPrototypeOf(Dog.prototype, Animal.prototype);
```

## Key Points

- Objects inherit through the prototype chain.
- Use `Parent.call(this, ...)` to inherit instance properties.
- Use `Object.create(Parent.prototype)` to inherit methods.
- Reset `Child.prototype.constructor` after replacing the prototype.
