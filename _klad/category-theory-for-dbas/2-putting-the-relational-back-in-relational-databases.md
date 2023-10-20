---
title: Putting the Relational back in Relational Databases
subtitle: Category Theory for DBAs &mdash; Part 2, How?
tag: category-theory-for-dbas
toc: true
---
* TOC
{:toc #TOC}

The concept of relations lies at the heart of relational databases. Despite this, awareness of what relations are and what properties they have is not widespread amongst people using databases. This article seeks to give a quick overview of what mathematical relations are and how these concepts are used in relational databases. Later articles will use this as a basis to apply even more advanced mathematical concepts to databases.

The use of relations to describe databases can be traced back to the paper by Edgar F. Codd [A relational model of data for large shared data banks](https://dl.acm.org/doi/10.1145/362384.362685). This paper introduces various important concepts such as joins and primary keys. To understand them properly requires some introduction to the concept of relations. 

While databases use relations between more than 2 things (so called $n$-ary relations) it is better to try to understand *binary* relations first. For one you can split any relation into a couple of binary ones, and secondly reasoning about $n$-ary relations gets inhumanly hard very quickly if $n$ rises above 2.

## Relations

A relation is nothing more or less than something that relates one thing to another. There are various well known examples, such as equality '$=$', inequality '$\ne$', order '&le;'. Once a relation has a name it is possible to make statements about this relation such as '$1<2$' or '$0=1$' (statements may turn out to be false). Typically this notation uses some symbol in between the two things that are related, but there are exceptions such as functions (which relate their input to their output).

Concretely a relation can be modelled as a set of pairs. If a relation $R$ contains the pair $(x,y)$ then $R$ relates $x$ to $y$ which is usually written $x R y$. This way of modelling relations is the easiest to translate to a table in a database. 

Note that this model uses a *set* of pairs, which is the reason many set operations such as `UNION` or `INTERSECT` and `MINUS` exist in SQL. The main difference between tables and sets is that tables may contain the same row multiple times. Since set operations return a set not a table they have the (sometimes useful) side effect that the result won't contain any row more than once.

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

Let's start with something somewhat familiar. Ordinal relations. These show up whenever one thing is greater than another. The obvious example are numbers like $3 \le \pi \le 22/7$ but this concept also extends to things like sorting strings, with rules like "App &le; Apple &le; Bear". 

Numbers have a very powerful ordering. All numbers are comparable and if two numbers are not equal then one of them is always higher than the other. However some orderings break one or both of these rules. Returning to the example of sorting string, it is common to ignore the difference between upper- and lower-case in which case both "apple &le; APPLE" and "APPLE &le; apple" are acceptable orderings.

To keep them apart mathematicians distinguish between total orders, partial orders and pre-orders. Pre-orders are by far the most general and only need to satisfy two rules for all $x,y$ and $z$.

> - $x \le x$  
> - if $x \le y$ and $y \le z$ then $x \le z$

The main feature of a pre-order is the fact that it is transitive (meaning that if $x \le y$ and $y \le z$ then $x \le z$ as well). There is nothing forcing that all $x$ and $y$ are comparable (meaning that neither $x \le y$ nor $x \le y$) and it is possible that both $x \le y$ and $y \le x$ even if $x \ne y$. 

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
Figure 2. A pre-order on set of 7 points, containing the relation in figure 1 as a subset. Note that this requires quite a lot more arrows to draw, even though this is the *smallest* pre-order containing all arrows from figure 1.
</figure>

Partial orders have the additional rule that if $x \le y$ and $y \le x$ then $x = y$ (this is called anti-symmetry). Total orders are partial orders with the additional rule that for *all* pairs $x,y$ either $x \le y$ or $y \le x$. This makes partial and total orders more powerful, but not necessarily more useful. In fact for finite sets there is basically only one kind of total order, which boils down to sorting the set.

Not requiring all things to be comparable allows partial orders to model hierarchical or 'part of' relations. For example Utrecht is a part of the Netherlands is a part of Europe, but France is not a part of Australia nor is Australia a part of France. Note that this is partial order, not a pre-order (can you tell why?). A more abstract version would the 'subset of' relation, which not coincidentally was given the symbol $\subseteq$ quite similar to $\le$. 

Also consider what happens when comparing time periods. It is easy to say that June 7th 2011 occurred before the year 2022. However it is a lot harder to say whether week 35 2023 (from August 28 to September 2) happens before or after September 2023. Sure one of them *started* earlier, but the other *ended* earlier, so which was earlier?[^strict]

[^strict]: Being later or earlier is an example of something that might be easier to model as a strict order, where the rule that $x \le x$ for all $x$ is replaced by the rule that $x \not< x$ for all $x$. Strict orders are basically equivalent to partial orders, but make it harder to talk about pre-orders hence why those are introduced first.

As noted sorting strings shows how $x \le y$ and $y \le x$ does not have to imply that $x=y$. In fact these pair are interesting in their own right, because they represent something that is *like* equality, without being equal. This is precisely how SQL Server uses collation, sorting order, to check strings for equivalence. The underlying concept is called an equivalence relation.

## Equivalence Relations

Equivalence relations show up whenever things are equal or equivalent. They're related to pre-orders with the only additional requirement that they are symmetric (this means that equivalence relations are *technically* also pre-orders, but things are either equivalent or not-comparable so it makes little sense to view them that way). 

Using the symbol '$\sim$' the rules for an equivalence relation are that for all $x$,$y$,$z$

> - $x \sim x$  
> - if $x \sim y$ then $y \sim x$  
> - if $x \sim y$ and $y \sim z$ then $x \sim z$.

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

In short, every object is equivalent to itself, equivalence is symmetric (it has no direction) and equivalence is transitive. It is easy to show that for any pre-order the set of pairs such that $x \le y$ and $y \le x$ forms an equivalence relation.

In databases these show up whenever an entity has multiple different identifiers (usually across different systems). These identifiers are all equivalent, but may not be equal. In such a scenario a common problem is to figure out how to turn equivalence into equality (more on that later).

A less obvious example would be the relation of being 'related' or 'connected'. For instance let's say two land masses are called 'connected' if they are connected by land, in that case the Germany, Spain and France are all connected but the Netherlands and the UK are not.[^border]

[^border]: This is different from sharing a land border, Germany and Spain share no land border but are connected by land through France. Being connected is what's called the 'transitive closure' of sharing a land border.

An equivalence relation can be turned into equality by looking at equivalence classes, each class represents a set of entities that are all equivalent to each other. When the relation is whether things are connected then these equivalence classes are also called 'connected components'. A common notation for these is to denote the equivalence class of $x$ as $[x]$.

Mathematicians also like to play around with these equivalence classed by doing things like declaring two numbers equivalent when they differ by an even amount. This yields two equivalence classes, 'even' and 'odd'. As it turns out you can still do arithmetic with these ('odd' + 'odd' = 'even', 'even' + 'odd' = 'odd' etc.). This doesn't only work for even numbers, you can also declare (whole) numbers equivalent if they differ by a multiple of 7 or 12 or any other whole number. In all cases it is possible to do arithmetic on the equivalence classes such that $[x+y]=[x]+[y]$ and $[x] [y] = [xy]$. This is called modular arithmetic, and numbers differing by a multiple of $m$ are said to be equal 'modulo' $m$.  [^nines]

[^nines]: Since this gives a way to reduce a calculation with big numbers to one with smaller numbers it gives an easy way to check calculations. Calculating the result modulo 10 is easy, it's just doing the same calculation on the last digit. More interesting is calculating the result modulo 9, because a number is equal to the sum of its digits modulo 9, this follow from the fact that $[10]=[1]$ and therefore $[10^n]=[1^n]=[1]$ and therefore $[d_0 + d_1 10 + d_2 100 + ... + d_n 10^n] = [d_0 + d_1 + ... + d_n]$ modulo 9. This is called casting out nines since $[9] = [0]$ modulo 9, so you can remove any digits that add up to nine.

## Functions

Functions are a special type of relation where the left hand side is guaranteed to be unique. Meaning that if a function $f$ has a pair $(x,y)$ then this is the only pair relating $x$ to some value, there will never be *another* pair $(x,z)$ with $z \ne y$. This is usually written $f(x) = y$. The infix notation $x f y$ is basically never used. Sometimes $f : x \mapsto y$ is used to describe a function (the symbol $\mapsto$ is read as 'maps to').

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

The relevant database concept is a table with a primary key, which is precisely the constraint needed to turn a relation into a function, namely that a value is guaranteed to only exist in one row (pair).

The nice thing about functions is that they can compose nicely. If there are two functions $f$ and $g$ where the outputs of $f$ are contained in the inputs of $g$ then they can be combined into a new relation $g \circ f$ which maps $x$ to $g(f(x))$. This new relation is also a function. 

To make function composition easier it is common to keep track of the possible inputs and outputs of each function. If $X$ is the set of inputs of a function and its outputs are in $Y$ then this is denoted $f: X \to Y$. This ensures that two functions $f: X \to Y$ and $g:Y \to Z$ always combine into a function $g \circ f: X \to Z$.

This also relates to the notion of foreign keys, which ensure that a value exists in the primary key of some other table. This has the same effect as specifying the range of possible outputs of a function.

However just because functions compose nicely doesn't mean they are the only type of relation that can be composed, in fact all types of relations can be composed, it's just that doing so doesn't usually result in a relation of the same type. This more general operation is in fact a well known concept in relational databases.

## Joins

Joins are the generalisation of function composition for general relations. 

For two relations $R$ and $S$ it is possible to identify all triples of values $x,y,z$ such that $x R y$ and $y S z$ and form a relation $S \circ R$ from the set of all pairs $(x,z)$. In relational databases this operation is usually called a join. There are also some variations like left and right joins, but those require the notion of a `NULL` value which is beyond the scope of this article.

Joining a relation $R$ to a function $f$ result in a relation with a pair $(x, f(y))$ for each pair $(x,y)$ in $R$. If $R$ is also a function then this is precisely the function composition described earlier. It also means that joining a table on a primary key is essentially the same as applying a function.

This concept is also related to transitivity, a relation is transitive precisely when the composition $R \circ R$ is contained within $R$

## Closure

In practice a relation $R$ is usually *known* to have certain properties, but only some of the pairs $x R y$ are known, not all. The goal then is to find the smallest relation that satisfies the desired properties and contains all known pairs.

The most common example of this is when a relation is known to be transitive, but only some of the pairs are known, the rest being implicit. The smallest transitive relation containing all known pairs is called the transitive closure.

Since the number of pairs in a transitive relation can grow explosively, not keeping a full list is the normal thing to do. The problem then becomes trying to work with the transitive closure. While some databases do support the required recursive join this is a feature that remains ill supported in SQL (even though it makes perfect sense from a relational point of view). 

Another example has to do with an equivalence relation which is only partially known. In many ways this is a special case of a transitive closure. What clustering is and how to go beyond equivalence relations will be the subject for the next article in this series.

## Back to Databases

Hopefully this article has given a bit of insight into the properties a relation may have and how these do or don't correspond ot things you can do in a database.

However as stated in the beginning of the article this is just the binary relations. Converting those back to a database you'd end up with a database containing tables with only 2 columns (to the delight of advocates for RDF triples[^trip]), in practice this is not what databases look like. Does this mean that knowledge of binary relations is not useful? Well obviously not, in fact most tables are secretly a collection of binary relations.

Take for instance a product table, it will contain various properties of each product such as its size, colour, possibly price etc. However usually it will also contain a product ID. Usually this is just a meaningless number that does nothing but identify the row. However if it is meaningless it should serve some purpose, otherwise why include it?

This product ID (or primary keys in general) is added to the table to turn it from an $n$-ary ($n$=number of columns) relation into $n$ binary relations. By design the product ID will uniquely refer to a single row which means each column of the table can be turned into a function from the product ID to the value in that column for that row. 

Now why do this instead of simply making a 2 column table for each property? That is because a well designed database doesn't just turn each column of the product table into a function of the product ID, it also does the opposite. If each product has a unique row in the product table then each property of a product, which must be some kind of function from the product to some range of values, can be turned into a column of the product table by simply putting the output of the function at the row for the corresponding product. By allowing a column to have empty values it also becomes possible to include properties which are only defined for *some* products.

In this way the product ID becomes a representative for the product itself since properties of the product are turned into functions of the product ID.

This trick is so pervasive in databases that any example where it doesn't work is almost automatically considered a data quality issue. This includes cases like having multiple sets of IDs for the same objects, tables without any kind of primary key. Although sometimes an ID is spread across multiple columns, but doing so doesn't change much, it is trivial to convert such a table to one with a singular ID column.

Is anything lost by turning all $n$-ary relations into $n-1$ functions? Well yes, for one there are binary relations that aren't functions, and while turning those into pairs of functions has some utility it is not the best way to view those relations. It is entirely possible some properties of trinary or $n$-ary relations are hidden by turning them into triples or $n$-tuples of functions, but mathematics doesn't seem ready to deal with those kinds of properties yet.  

So for all intents and purposes relational databases are just tables of functions bound together by using the primary key as the spine, and maybe a few link tables with some binary relations. Understanding binary relations is the best way to understand databases.

[^trip]: Don't let the name 'triple' confuse you, one of the three values is just the table name.