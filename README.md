# Register machine simulator

Based on syntax and specification from lecture theoretical computer science @ DHBW Lörrach

https://fabian-z.github.io/registersim/

## Syntax and Semantics

A register machine consists of a number of registers, indexed by numbers from ℕ₀. Two instructions can be executed for these registers.

The set of register machine programs RMP is inductively defined:

| Program       | Function
| ------------- |-------------
| aᵢ for i ∈ ℕ₀ | The program increments the content of register i by 1
| sᵢ for i ∈ ℕ₀ | The program decrements the content of register i by 1

With p, q ∈ RMP, the following programs are also elements of RMP:

| Program         | Function
| --------------- |-------------
| pq              | Concatenation - the program executes p first and q second
| (p)ᵢ for i ∈ ℕ₀ | Iteration - the program p will be executed by first checking if register i has the value 0. If not, p is executed until the register i hast the value 0.

Note that this simulator allows whitespace anywhere but before the specification of register indexes.

## Input / Output

The input of a register machine program consists of an assignment of register values. A finite number of registers may contain values different from 0.

If the program runs to the end, an output is shown.

The output consists of the register state after finishing execution of the last instruction in RMP. Because the input did only contain a finite number of register values different from 0 and the program did only modify a finite number of registers, only a finite number of register values is output.

## Example

Example register program

### Addition 
* Adding values in registers 0 and 1
* Saving the output to register 2
* Restore input values for registers 0 and 1
* Register 3 is used as auxilliary register

```
(s0 a2 a3)0 (s3 a0)3 (s1 a2 a3)1 (s3 a1)3
```

## Building

Tested only on Linux

```
npm install

# Only needed when modifying parser grammar
npm run build-peg

npm run build
```

After successfully executing these commands, the folder dist/ will contain a static set of HTML, JS and CSS files which contain the simulator.

You can also download a copy of the repository and view index.html with your web browser.

## Contributions

Contributions and issues are always welcome. Feel free to create an issue or fork the repository and experiment or make a pull request.

