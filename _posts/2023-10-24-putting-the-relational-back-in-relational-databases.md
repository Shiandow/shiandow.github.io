---
title: Putting the Relational back in Relational Databases
subtitle: Category Theory for DBAs &mdash; Part 2, How?
tag: category-theory-for-dbas
toc: true
excerpt: |
    The concept of relations lies at the heart of relational databases. Despite this, awareness of what relations are and what properties they have is not widespread amongst people using databases (see also the [preceding article](/2023/10/18/category-theory-for-dbas/)). This article seeks to give a quick overview of what mathematical relations are and how these concepts are used in relational databases. Later articles will use this as a basis to apply even more advanced mathematical concepts to databases.
---
{% include toc.md %}

The concept of relations lies at the heart of relational databases. Despite this, awareness of what relations are and what properties they have is not widespread amongst people using databases (see also the [preceding article](/2023/10/18/category-theory-for-dbas/)). This article seeks to give a quick overview of what mathematical relations are and how these concepts are used in relational databases. Later articles will use this as a basis to apply even more advanced mathematical concepts to databases.

The use of relations to describe databases can be traced back to the paper by Edgar F. Codd [A relational model of data for large shared data banks](https://dl.acm.org/doi/10.1145/362384.362685). This paper introduces various important concepts such as joins and primary keys. To understand them properly requires some introduction to the concept of relations. 

While databases use relations between more than 2 things (so called $n$-ary relations) it is better to try to understand *binary* relations first. For one you can split any relation into a couple of binary ones, and secondly reasoning about $n$-ary relations gets inhumanly hard very quickly if $n$ rises above 2.

## Relations

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

Figure 1. A graphical representation of a relation on a set of 7 points. Each arrow from a point $x$ to a point $y$ represents that the $x$ relates to $y$. An arrow pointing both ways represents two arrows going each way.
</figure>

A relation is nothing more or less than something that relates one thing to another. There are various well known examples, such as equality '$=$', inequality '$\ne$', order '&le;'. Once a relation has a name it is possible to make statements about this relation such as '$1<2$' or '$0=1$' (statements may turn out to be false). Typically this notation uses some symbol in between the two things that are related, but there are exceptions such as functions (which are a special kind of relation).

Concretely a relation can be modelled as a set of pairs. If a relation $R$ contains the pair $(x,y)$ then $R$ relates $x$ to $y$ which is usually written $x R y$. This way of modelling relations is the easiest to translate to a table in a database. 

Note that this model uses a *set* of pairs, which is the reason many set operations such as `UNION` or `INTERSECT` and `MINUS` exist in SQL. The main difference between tables and sets is that tables may contain the same row multiple times. Since set operations return a set not a table they have the (sometimes useful) side effect that the result won't contain any row more than once.

While this is a very flexible model it doesn't result in much useful properties to work with, hence why there are several different types of relations, each with its own set of defining properties.

## Ordinal Relations

Let's start with something somewhat familiar. Ordinal relations. These show up whenever one thing is greater than another. The obvious example are numbers like $3 \le \pi \le 22/7$ but this concept also extends to things like sorting strings, with rules like "App &le; Apple &le; Bear". 

Numbers have a very powerful ordering. All numbers are comparable and if two numbers are not equal then one of them is always higher than the other. Some orderings break one or both of these rules. Going back to the example of sorting strings, it is common to ignore the difference between upper- and lower-case in which case both "apple &le; APPLE" and "APPLE &le; apple" are acceptable orderings.

To keep the different types of orderings apart mathematicians distinguish between total orders, partial orders and pre-orders. Pre-orders are by far the most general and only need to satisfy two rules for all $x,y$ and $z$.

> - $x \le x$  
> - if $x \le y$ and $y \le z$ then $x \le z$

The main feature of a pre-order is the fact that it is transitive (meaning that if $x \le y$ and $y \le z$ then $x \le z$ as well). Most transitive relations are either pre-orders or can trivially be turned into one.

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
Figure 2. A pre-order on set of 7 points, containing the relation in figure 1 as a subset. Note that this requires quite a lot more arrows to draw, even though this is the <em>smallest</em> pre-order containing all arrows from figure 1.
</figure>

Partial orders have the additional rule that if $x \le y$ and $y \le x$ then $x = y$ (this is called anti-symmetry). Total orders are partial orders with the additional rule that for *all* pairs $x,y$ either $x \le y$ or $y \le x$. This makes partial and total orders more powerful than pre-orders, but not necessarily more useful. In fact for finite sets there is basically only one kind of total order, which boils down to just numbering the set from $1$ to $n$ (total orders often boil down to just numerical order).

Not requiring all things to be comparable allows partial orders to model hierarchical or 'part of' relations. For example Utrecht is a part of the Netherlands is a part of Europe, but France is not a part of Australia nor is Australia a part of France. Note that this is partial order, not a pre-order (can you tell why?). A more abstract version would the 'subset of' relation, which is why the symbol for 'subset of' $\subseteq$ is quite similar to $\le$.

Another examples shows up when trying to order time periods. It is easy to say that June 7th 2011 occurred before the year 2022. However it is a lot harder to say whether week 35 2023 (from August 28 to September 2) happens before or after September 2023. Sure one of them *started* earlier, but the other *ended* earlier, so which was earlier?[^strict]

And as noted earlier, sorting strings shows how $x \le y$ and $y \le x$ does not have to imply that $x=y$. In fact this is precisely how SQL Server uses collation, sorting order, to check strings for equivalence while ignoring differences in case and equivalent ways to encode the same unicode characters. This means the pairs where both $x \le y$ and $y \le x$ are interesting in their own right because they represent something that is *like* equality, without being equal. They form what is called an equivalence relation.

## Equivalence Relations

Equivalence relations show up whenever things are equal or equivalent. They're related to pre-orders with the only additional requirement that they are symmetric. Using the symbol '$\sim$' the rules for an equivalence relation are that for all $x$,$y$,$z$

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

When dealing with data these types of relation often show up whenever an entity has multiple different identifiers (usually across different systems). These identifiers are all equivalent, but may not be equal. Sometimes it is obvious which identifiers belong together, sometimes it requires some guess work. Either way this typically results in a big list of identifiers that are equivalent. An interesting problem is that this list is not a full equivalence in its own right, just a subset of one, the trick then becomes to find the 'best' equivalence relation that matches the known data (more on that later).

Things don't have to refer to the same entity to form an equivalence relation. A less obvious example would be the relation of being 'connected'. For instance let's say two land masses are called 'connected' if they are connected by land, in that case the Germany, Spain and France are all connected but the Netherlands and the UK are not.[^border]

An important concept when dealing with equivalence relations are equivalence classes. These are sets such that two things are equivalent exactly when they are in the same equivalence class. A common notation for these is to denote the equivalence class of $x$ as $[x]$ (the definition then becomes $x \sim y$ if and only if $[x] = [y]$). An equivalence class of things that are connected is also called a 'connected component'.

Mathematicians like to play around with these equivalence classes by doing things like declaring numbers equivalent when they differ by an even amount. This yields two equivalence classes, 'even' and 'odd'. As it turns out you can still do arithmetic with these ('odd' + 'odd' = 'even', 'even' + 'odd' = 'odd' etc.). This doesn't only work for even numbers, you can also declare (whole) numbers equivalent if they differ by a multiple of 7 or 12 or any other whole number. In all cases it is possible to do arithmetic on the equivalence classes such that $[x+y]=[x]+[y]$ and $[x] [y] = [xy]$. This is called modular arithmetic, and numbers differing by a multiple of $m$ are said to be equal 'modulo' $m$. [^nines]

## Functions

A completely different type of relation is a function. Functions are a special type of relation where the left hand side is guaranteed to be unique. This means that if a function $f$ has a pair $(x,y)$ then this is the only pair relating $x$ to some value, there will never be *another* pair $(x,z)$ with $z \ne y$. This is usually written $f(x) = y$, or sometimes this is written $f : x \mapsto y$ (the symbol $\mapsto$ is read as 'maps to'). The infix notation $x f y$ is basically never used.

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

The relevant database concept is a table with a primary key, which is precisely the constraint needed to turn a relation into a function. It is also common to keep track of the possible outputs of each function. If $X$ is the set of inputs of a function and its outputs are in $Y$ then this is denoted $f: X \to Y$. In databases this is done by specifying a foreign key, which ensures that the output falls within a certain range.

The nice thing about functions is that they compose nicely. If there are two functions $f: X \to Y$ and $g:Y \to Z$ then they can be combined into a new relation $g \circ f: X \to Z$ which maps $x$ to $g(f(x))$. This new relation is also a function. Making this work seamlessly is precisely why it's so useful to keep track of the possible inputs and outputs.

However functions are not the only type of relation that can be composed, functions just do it in a way that behaves better. The more general way to compose relations is in fact a well known concept in relational databases.

## Joins

Joins are the generalisation of function composition for general relations. 

For two relations $R$ and $S$ it is possible to identify all triples of values $x,y,z$ such that $x R y$ and $y S z$ and form a relation $S \circ R$ from the set of all pairs $(x,z)$. In relational databases this operation is usually called a join. There are also some variations like left and right joins, but those require the notion of a `NULL` value which is beyond the scope of this article.

Joining a relation $R$ to a function $f$ result in a relation with a pair $(x, f(y))$ for each pair $(x,y)$ in $R$ (whenever $f(y)$ exists). If $R$ is also a function then this is precisely the function composition described earlier. This also shows that joining a table on a primary key is essentially the same as applying a function.

Note that a relation is transitive precisely when the composition $R \circ R$ is contained in $R$. Conversely a (finite) relation can be made transitive by repeatedly joining copies until it eventually is transitive. Obviously this process can grow a relation considerably, so instead of pre-calculating the result it would be nice if database supported repeatedly joining a relation like that...

## Back to Databases

Hopefully this has given a bit of insight into the properties a relation may have and how these do or do not correspond to database concepts.

However as stated in the beginning of the article this is just the binary relations. Converting those back to a database you'd end up with a database containing tables with only 2 columns (to the delight of advocates for RDF triples[^trip]), in practice this is not what databases look like. Does this mean that knowledge of binary relations is not useful? Well obviously not, it just means we need to decompose those $n$-ary relations into binary relations. It is entirely possible some properties are hidden by only looking at binary relations, but mathematics is not quite ready to deal with $n$-ary relations for $n>2$ in any way that makes sense. So for all intents and purposes understanding binary relations is the best way to understand relational databases.

A well designed database also makes it easy to find useful binary relations. Take for instance a product table, at a minimum it will list all products but it will also contain various properties of each product such as its size, colour, possibly price etc. Usually it will also contain a product ID as primary key. Since the product ID is a primary key each column of the table can be turned into a function from the product ID to the value in that column for that row.

This also works the other way around, if something is a function of the product ID it can be included as a column in a product table and become a property of the product. By allowing a column to have empty values it is even possible to include properties which are only defined for *some* products. This way the product ID becomes a representative for the product itself since properties of the product are made equivalent to functions of the product ID.

Now if relations are so powerful then why are people looking for alternatives to SQL databases? There are a couple of reasons, some of which have little to do with relations, but one of the reasons is that SQL doesn't support all things possible to do with a relation equally well. Transitive closure in particular has varying and often lacking support in relational databases that use SQL.[^break]

Transitive closure is a way to find the smallest transitive relation (or a pre-order) containing some other relation as a subset (compare figure 1 and 2 for an example). Since a transitive relation can grow quite large it's often not practical to store it in full so first-class support for transitive closures is very useful. Consider how keeping track of a hierarchy is usually done by only storing the next-highest level, or how equivalence relations may sometimes need to be built from a partial list of equivalent objects. This also relates to the notion of clustering, which will be the subject of the next post in this series.

More posts in this series:
{% include see-also.html tag="category-theory-for-dbas" %}
----------------------------------------------------------------------

[^strict]: Being later or earlier is an example of something that might be easier to model as a strict order, where the rule that $x \le x$ must always be true is replaced by the rule that $x < x$ must always be false, for all $x$. Strict orders are basically equivalent to partial orders but make it harder to talk about pre-orders hence why those are introduced first.

[^border]: This is different from sharing a land border, Germany and Spain share no land border but are connected by land through France. Being connected is what's called the 'transitive closure' of sharing a land border.

[^nines]: Since this gives a way to reduce a calculation with big numbers to one with smaller numbers it gives an easy way to check calculations. Calculating the result modulo 10 is easy, it's just doing the same calculation on the last digit. More interesting is calculating the result modulo 9, because a number is equal to the sum of its digits modulo 9, this follow from the fact that $[10]=[1]$ and therefore $[10^n]=[1^n]=[1]$ and therefore $[d_0 + d_1 10 + d_2 100 + ... + d_n 10^n] = [d_0 + d_1 + ... + d_n]$ modulo 9. This is called casting out nines since $[9] = [0]$ modulo 9, so you can remove any digits that add up to nine.

[^trip]: Don't let the name 'triple' confuse you, one of the three values is just the table name.

[^break]: Of course once you know the concept and the various ways transitive closure can be used it becomes possible to leverage this little support into something more powerful.