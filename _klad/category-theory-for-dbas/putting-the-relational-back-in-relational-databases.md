---
title: Putting the Relational back in Relational Databases
---

The concept of relations lies at the heart of relational databases. Despite this, awareness of what relations are and what properties they have is not widespread amongst people using databases. This article seeks to give a quick overview of what mathematical relations are, how these concepts are used in relational databases. Later articles will use this as a basis to apply even more advanced mathematical concepts to databases.

The use of relations to describe databases can be traced back to the original paper by Edgar F Codd [A relational model of data for large shared data banks](https://dl.acm.org/doi/10.1145/362384.362685). This paper introduces various important concepts such as joins and primary keys. To understand them properly first requires some introduction to the concept of relations. 

A relation is nothing more or less than some operation that relates one thing to another. There are various well known examples, such as equality '$=$', inequality '$\ne$', order '$\le$'. One a relation has a name it is possible to make statements about this relation such as '$1<2$' or '$0=1$' which may or may not be true. Typically this notation uses some symbol in between the two things that are related, but there are exceptions such as functions (which relate their input to their output).

Concretely a relation can be modelled as a set of pairs. If a relation $R$ contains the pair $(x,y)$ then $R$ relates $x$ to $y$ which is usually written $x R y$. This way of modelling relations model is the easiest to translate to a table in a database. Note that this model uses a *set* of pairs, which is the reason many set operations such as `UNION` or `INTERSECT` and `MINUS` exist in SQL. The main difference between tables and sets is that tables may contain the same row multiple times. Since set operations return a set not a table they each have the (sometimes useful) side effect that the result won't contain any duplicates.

<figure>
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
<defs>
<filter id="sketch">
    <feTurbulence type="turbulence" baseFrequency="0.01" numOctaves="3" result="noise" />
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G"/>
</filter>
<filter id="blackboard">
    <feFlood flood-color="rgb(255,240,255)" result="background" />
    <feBlend mode="normal" in="SourceGraphic" in2="background" />
    <feComponentTransfer>
        <feFuncR type="table" tableValues="1 0"/>
        <feFuncG type="table" tableValues="1 0"/>
        <feFuncB type="table" tableValues="1 0"/>
    </feComponentTransfer>
</filter>
<marker
      id="arrow"
      viewBox="0 0 10 10"
      refX="12"
      refY="5"
      markerUnits="strokeWidth"
      markerWidth="6" markerHeight="6"
      orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="black"/>
</marker>
</defs>
<g style="filter: url(#sketch)">
<circle cx="10" cy="20" r="2" fill="black"/>
<circle cx="30" cy="10" r="2" fill="black"/>
<circle cx="20" cy="80" r="2" fill="black"/>
<circle cx="40" cy="50" r="2" fill="black"/>
<circle cx="70" cy="30" r="2" fill="black"/>
<circle cx="80" cy="60" r="2" fill="black"/>
<circle cx="60" cy="80" r="2" fill="black"/>
<line x1=10 y1=20 x2=70 y2=30 marker-end="url(#arrow)" marker-start="url(#arrow)" stroke="black" />
<line x1=30 y1=10 x2=40 y2=50 marker-end="url(#arrow)" stroke="black" />
<line x1=70 y1=30 x2=20 y2=80 marker-end="url(#arrow)" stroke="black" />
<line x1=40 y1=50 x2=80 y2=60 marker-end="url(#arrow)" stroke="black" />
<path d="M 60,80 
         a 5 2 180 1 0 +10,+5
         a 5 2 180 1 0 -10,-5" 
         marker-end="url(#arrow)" stroke="black" fill="none"/>
</g>
</svg>

Figure 1. A graphical representation of a relation on a set of 7 points. Each arrow from a point $x$ to a point $y$ represents that the pair $(x,y)$ is in the relation. An arrow pointing both ways represents two arrows going each way.
</figure>

While this is a very flexible model it doesn't result in much useful properties to work with, hence why there are several different types of relations, each with its own set of defining properties.

## Ordinal Relations

Let's start with something somewhat familiar. Ordinal relations. These show up whenever one thing is greater than another. The most obvious are numbers like $3 \le \pi \le 22/7$ but this concept also shows up when sorting strings, with rules like "App $\le$ Apple $\le$ Bear". 

This concept can be generalized quite a bit, in fact it is enough to only require the following for all $x,y,z$

> $x \le x$  
> if $x \le y$ and $y \le z$ then $x \le z$

<figure>
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
<defs>
<filter id="sketch">
    <feTurbulence type="turbulence" baseFrequency="0.01" numOctaves="3" result="noise" />
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
</filter>
<marker
      id="arrow"
      viewBox="0 0 10 10"
      refX="12"
      refY="5"
      markerUnits="strokeWidth"
      markerWidth="6" markerHeight="6"
      orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="black"/>
</marker>
</defs>
<g style="filter: url(#sketch)">
<circle cx="10" cy="20" r="2" fill="black"/>
<circle cx="30" cy="10" r="2" fill="black"/>
<circle cx="20" cy="80" r="2" fill="black"/>
<circle cx="40" cy="50" r="2" fill="black"/>
<circle cx="70" cy="30" r="2" fill="black"/>
<circle cx="80" cy="60" r="2" fill="black"/>
<circle cx="60" cy="80" r="2" fill="black"/>
<line x1=10 y1=20 x2=70 y2=30 marker-end="url(#arrow)" marker-start="url(#arrow)" stroke="black" />
<line x1=30 y1=10 x2=40 y2=50 marker-end="url(#arrow)" stroke="black" />
<line x1=70 y1=30 x2=20 y2=80 marker-end="url(#arrow)" stroke="black" />
<line x1=40 y1=50 x2=80 y2=60 marker-end="url(#arrow)" stroke="black" />
<line x1=10 y1=20 x2=20 y2=80 marker-end="url(#arrow)" stroke="black" />
<line x1=30 y1=10 x2=80 y2=60 marker-end="url(#arrow)" stroke="black" />
<path d="M 10,20 
         a 5 2 180 1 0 -5,-5
         a 5 2 180 1 0 +5,+5" 
         marker-end="url(#arrow)" stroke="black" fill="none"/>
<path d="M 30,10 
         a 5 2 180 1 0 +10,+5
         a 5 1 180 1 0 -10,-5" 
         marker-end="url(#arrow)" stroke="black" fill="none"/>
<path d="M 20,80 
         a 2 5 180 1 0 -5,+5
         a 2 7 180 1 0 +5,-5" 
         marker-end="url(#arrow)" stroke="black" fill="none"/>
<path d="M 40,50 
         a 3 2 180 1 0 +10,+5
         a 4 2 180 1 0 -10,-5" 
         marker-end="url(#arrow)" stroke="black" fill="none"/>
<path d="M 70,30 
         a 4 2 180 1 0 +7,+5
         a 5 2 180 1 0 -7,-5" 
         marker-end="url(#arrow)" stroke="black" fill="none"/>
<path d="M 80,60 
         a 5 2 180 1 0 +10,+5
         a 5 2 180 1 0 -10,-5" 
         marker-end="url(#arrow)" stroke="black" fill="none"/>
<path d="M 60,80 
         a 5 2 180 1 0 +10,+5
         a 5 2 180 1 0 -10,-5" 
         marker-end="url(#arrow)" stroke="black" fill="none"/>
</g>
</svg>
Figure 2. A pre-order on set of 7 points, containing the relation in figure 1 as a subset.
</figure>

This is called a pre-order. Its main feature is the fact that it's transitive (meaning that if $x \le y$ and $y \le z$ then $x \le z$ as well). This is a lot more flexible than a general order, because two things don't even need to be comparable, and it is possible that $x \le y$ and $y \le x$ even if $x \ne y$. 

Among other things is not necessary for two things to even be comparable. It seems like this would be too general to make much sense, but as it turns out it shows up quite a bit, for example when dealing with time periods. It is easy to say that June 7th 2011 occurred before the year 2022 but should we try to compare week 35 2023 (from August 28 to September 2) with September 2023, then we run into a problem. Sure one of them *started* earlier, but the other *ended* earlier, so which was earlier? 

This generality also lends it to hierarchical or 'part of' relations. For example Utrecht is a part of the Netherlands is a part of Europe, but France is not a part of Australia nor is Australia a part of France. It's easy to check that this way regions form a hierarchy defined by the 'part of' relation and this relation is a pre-order.

It is also not the case that $x \le y$ and $y \le x$ can't both be true, even if $x \ne y$. In fact returning to the example of sorting strings, if we ignore case then "apple", "Apple" and "APPLE" could occur in any order. Of course we can always use some kind of tie break, but it makes more sense to just say "apple $\le$ APPLE" and "APPLE $\le$ apple", since they're both valid ways to sort those strings. [^strict]

[^strict]:Such a property is not possible to state with a strict inequality (where $x \not\lt x$) hence why this section introduced pre-orders first.

When we add the requirement that $x \le y$ and $y \le x$ implies that $x = y$ then we get what's called a partial order. Upon adding the condition that everything is comparable to everything else this becomes a total order. 

However partial-orders aren't necessarily more convenient than pre-orders. The pairs $(x,y)$ such that $x \le y$ and $y \le x$ are interesting in their own right, because they represent something that is *like* equality, without being equal. This concept is called an equivalence relation.

## Equivalence Relations

Equivalence relations show up whenever things are equal or equivalent. They're related to pre-orders with the only additional requirement that they are symmetric (this means that equivalence relations are *technically* also pre-orders, but things are either equivalent or not-comparable so it makes little sense to view them that way). 

Using the symbol '$\sim$' the rules for an equivalence relation are that for all $x$,$y$,$z$:

> $x \sim x$  
> if $x \sim y$ then $y \sim x$  
> if $x \sim y$ and $y \sim z$ then $x \sim z$

<figure>
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
<defs>
<filter id="sketch">
    <feTurbulence type="turbulence" baseFrequency="0.01" numOctaves="3" result="noise" />
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
</filter>
<marker
      id="arrow"
      viewBox="0 0 10 10"
      refX="12"
      refY="5"
      markerUnits="strokeWidth"
      markerWidth="6" markerHeight="6"
      orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="black"/>
</marker>
</defs>
<g style="filter: url(#sketch)">
<circle cx="10" cy="20" r="2" fill="black"/>
<circle cx="30" cy="10" r="2" fill="black"/>
<circle cx="20" cy="80" r="2" fill="black"/>
<circle cx="40" cy="50" r="2" fill="black"/>
<circle cx="70" cy="30" r="2" fill="black"/>
<circle cx="80" cy="60" r="2" fill="black"/>
<circle cx="60" cy="80" r="2" fill="black"/>
<line x1=10 y1=20 x2=70 y2=30 marker-end="url(#arrow)" marker-start="url(#arrow)" stroke="black" />
<line x1=30 y1=10 x2=40 y2=50 marker-end="url(#arrow)"  marker-start="url(#arrow)" stroke="black" />
<line x1=70 y1=30 x2=20 y2=80 marker-end="url(#arrow)"  marker-start="url(#arrow)" stroke="black" />
<line x1=40 y1=50 x2=80 y2=60 marker-end="url(#arrow)"  marker-start="url(#arrow)" stroke="black" />
<line x1=20 y1=80 x2=10 y2=20 marker-end="url(#arrow)"  marker-start="url(#arrow)" stroke="black" />
<line x1=30 y1=10 x2=80 y2=60 marker-end="url(#arrow)"  marker-start="url(#arrow)" stroke="black" />
</g>
</svg>
Figure 3. An equivalence relation on 7 points, the arrow from each point to itself has been omitted for clarity.
</figure>

in short, every object is equivalent to itself, equivalence is symmetric (it has no direction), equivalence is transitive (if x is equivalent to y which in turn is equivalent to z then x is also equivalent to z). It is easy to show that for any pre-order the set of pairs such that $x \le y$ and $y \le x$ forms an equivalence relation.

In databases these show up whenever an entity has multiple different identifiers (usually across different systems). In such a scenario a common problem is to figure out how to turn equivalence into equality. More on that later.

A less obvious example would be the relation of being 'related' or 'connected'. We could for instance consider two land masses to be connected if they are connected by land, in that case the Germany, Spain and France are all connected but the Netherlands and the UK are not.

An equivalence relation can be turned into equality by looking at equivalence classes, each class represents a set of entities that are all equivalent to each other. For things that are connected these are also called 'connected components'. A common notation for these is to denote the equivalence class of $x$ as $[x]$.

Mathematicians also like to play around by doing things like declaring two numbers equivalent when they differ by an even amount. This yields two equivalence classes, 'even' and 'odd', and as it turns out you can still do arithmetic with these ('odd' + 'odd' = 'even', 'even' + 'odd' = 'odd' etc.). This doesn't only work for even numbers, you can also declare numbers equivalent if they differ by a multiple of 7 or 12 (also called clock arithmetic) or any other number. In all cases it is possible to do arithmetic on the equivalence classes such that $[x+y]=[x]+[y]$ and $[x] [y] = [xy]$. This is called modular arithmetic, and numbers differing by a multiple of $m$ are said to be equal 'modulo' $m$.  [^nines]

[^nines]: Since this gives a way to reduce a calculation with big numbers to one with smaller numbers it gives an easy way to check calculations. Calculating the result modulo 10 is easy, it's just doing the same calculation on the last digit. More interesting is calculating the result modulo 9, because a number is equal to the sum of its digits modulo 9, this follow from the fact that $[10]=[1]$ and therefore $[10^n]=[1^n]=[1]$ and therefore $[d_0 + d_1 10 + d_2 100 + ... + d_n 10^n] = [d_0 + d_1 + ... + d_n]$ modulo 9. This is called casting out nines since $[9] = [0]$ modulo 9, so you can remove any digits that add up to nine.

## Functions

Functions are a special type of relation where the left hand side is guaranteed to be unique. Meaning that if a function $f$ has a pair $(x,y)$ then this is the only pair relating $x$ to some other value, there will never be *another* pair $(x,z)$ such that $z \ne y$. This is usually written $f(x) = y$. The infix notation $x f y$ is almost never used, though sometimes $f: x \mapsto y$ is used to denote a function.

<figure>
<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
<defs>
<filter id="sketch">
    <feTurbulence type="turbulence" baseFrequency="0.01" numOctaves="3" result="noise" />
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G" />
</filter>
<marker
      id="arrow"
      viewBox="0 0 10 10"
      refX="12"
      refY="5"
      markerUnits="strokeWidth"
      markerWidth="6" markerHeight="6"
      orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="black"/>
</marker>
</defs>
<g style="filter: url(#sketch)">
<circle cx="10" cy="20" r="2" fill="black"/>
<circle cx="30" cy="10" r="2" fill="black"/>
<circle cx="20" cy="80" r="2" fill="black"/>
<circle cx="40" cy="50" r="2" fill="black"/>
<circle cx="70" cy="30" r="2" fill="black"/>
<circle cx="80" cy="60" r="2" fill="black"/>
<circle cx="60" cy="80" r="2" fill="black"/>
<line x1=10 y1=20 x2=70 y2=30 marker-end="url(#arrow)" stroke="black" />
<line x1=20 y1=80 x2=70 y2=30 marker-end="url(#arrow)" stroke="black" />
<line x1=40 y1=50 x2=80 y2=60 marker-end="url(#arrow)" stroke="black" />
<line x1=30 y1=10 x2=80 y2=60 marker-end="url(#arrow)" stroke="black" />
<ellipse cx=22 cy=45 rx=22 ry=45 stroke="black" fill="none" style="stroke-dasharray: 2,2"/>
<ellipse cx=70 cy=55 rx=20 ry=35 stroke="black" fill="none" style="stroke-dasharray: 2,2"/>
</g>
</svg>
Figure 4. A function from a set of 4 points to a set of 3 points. The domain (set of inputs) and codomain (set of outputs) are delimited by dashed lines.
</figure>

The relevant database concept is a table with a primary key, which is precisely the constraint we need to turn the relation into a function, namely that a value is guaranteed to be unique across the whole table (if the table has multiple columns the corresponding function is a multivalued function). 

The nice thing about functions is that they can be composed, if there are two functions $f$ and $g$ where the outputs of $f$ are contained in the inputs of $g$ then they can be combined into a new relation $g \circ f$ which maps $x$ to $g(f(x))$. This new relation is also a function. 

To make this easier it is common to keep track of the possible inputs and outputs of each function. If $X$ is the set of inputs of a function and its outputs are in $Y$ then this is denoted $f: X \to Y$. This ensures that two functions $f: X \to Y$ and $g:Y \to Z$ always combine into a function $g \circ f: X \to Z$.

This also relates to the notion of foreign keys, which ensure that a value exists in the primary key of some other table. This has the same effect as restricting the range of possible outputs of a function.

Functions aren't the only type of relation that can be composed, in fact all types of relations can be composed, but doing so won't usually result in a relation of the same type. This more general operation is a well known concept in relational databases.

## Joins

Joins are the generalisation of function composition for general relations. 

For two relations $R$ and $S$ it is possible to identify all triples of values $x,y,z$ such that $x R y$ and $y S z$ and form a relation $S \circ R$ from the set of all pairs $(x,z)$. In relational databases this operation is usually called a join. There are also some variations like left and right joins, but those require the notion of a `NULL` value which is beyond the scope of this article.

For two functions $f,g$ this operation is indeed the same as composition since in that case $f(x) = y$ and $g(y) = z$ and therefore $(g \circ f)(x) = z$. Among other things this means that joining a table on a primary key is essentially the same as applying a function.

This concept is related to transitivity, a relation is transitive precisely when the composition $R \circ R$ is already contained within $R$

## Closure

In practice a relation $R$ is usually *known* to have certain properties, but only some of the pairs $x R y$ are known, not all. The goal then is to find the smallest relation that satisfies the desired properties and contains all known pairs.

The most common example of this is when a relation is known to be transitive, but only some of the pairs are known, the rest being implicit. The problem then becomes trying to find the smallest transitive relation that fits all known pairs. While some databases do support the required recursive join this is a feature that remains ill supported in SQL (even though it makes perfect sense from a relational point of view). 

Another example has to do with an equivalence relation which is only partially known. The usual solution to this problem is to use clustering. What clustering is and how to go beyond equivalence relations will be the subject for the next article in this series.
