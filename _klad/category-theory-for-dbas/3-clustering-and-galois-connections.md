---
title: Clustering Data and Galois Connections
subtitle: Category Theory for DBAs &mdash; Part 3, Who?
tag: category-theory-for-dbas
progress: 60% (pending rewrite to show work)
excerpt: |
    TODO
---
## Introduction

I won't say this article is the end goal of this sequence of articles, but it is *a* justification. After this it will become clearer why I chose to write about the [mathematical foundations of databases](https://pragmathics.nl/2023/10/18/category-theory-for-dbas/), the [actual mathematics of relations](https://pragmathics.nl/2023/10/24/putting-the-relational-back-in-relational-databases/), and [Galois, a mathematician who died too early, but also long before databases were a thing](**TODO**).

This time I also want to avoid just presenting the results as a foregone conclusion while ignoring the trial and error that went before it. This might not make it clearer, but hopefully it's a bit easier to follow by not erasing all tracks[^abel].

## Clustering Data

The goal of this article is to find a way to cluster data that fits nicely in the relational model that databases use. And also to go a bit further by thinking about what happens when some data points are equal, but some are more equal than others.

To start let's look at what related concepts and methods are already known, and how to translate those to the world of relational databases. The first is somewhat obvious, if we're reasoning about equivalence then we should look at equivalence relations.

<!-- 
### Clustering from a Mathematical Standpoint

Most people will have some idea about what it means to cluster data, 
but let's try to make this precise. At the start we have some set of data $X$ about some objects, and for some pieces of data,
let's call them $x$ and $y$, we know they are referring to the same object $x\sim y$. 

To cluster this data we want to have some kind of function that identifies which cluster each piece of data is in. Let's call this $f$. 
This can't be just any function, at the very least we'll need to have that if $x\sim y$ then $f(x)=f(y)$. 

This is not enough however, because right now there's nothing preventing this function from 
simply clustering *everything* in the same cluster. What we want is that that $f(x) = f(y)$ 
if *and only if* $x \sim y$.

Now while it is possible to go through all possible pairs $x \sim y$ and check that $f(x) = f(y)$
it is a lot more manageable to pick one representative $r(c)$ for each cluster $c$ and check that 
a datum is mapped to that cluster ($f(x) = c$) if and only if it is equivalent to the representative ($x \sim r(c)$).

The advantage of this approach is that we only need to reason about maps that *preserve* a structure.
The equivalence on one side is mapped to equality on the other, and the other way around
(as $x\sim y$ implies $f(x)=f(y)$ and implicitly $c = d$ implies $r(c) \sim r(d)$). This is especially relevant if
a full list of all pairs $x\sim y$ is not available, but only a 
partial list of such pairs. In that case it is easy to check that a function *preserves* the
relations we know about, but if $f(x)=f(y)$ it can be hard to check if $x \sim y$. Indeed being able to know *if* $x\sim y$ is one of the more important reasons to cluster data in the first place.

This still leaves the problem of checking that $f(x) = c$ if and only if $x \sim r(c)$. While this is more manageable than checking all pairs $x \sim y$ it can still be tricky. This can be made simpler by being slightly more flexible. -->

## Equivalence ~ Equality

Let's recall [the definition](https://pragmathics.nl/2023/10/24/putting-the-relational-back-in-relational-databases/#equivalence-relations) of an equivalence relation:

> - $x \sim x$  
> - if $x \sim y$ then $y \sim x$  
> - if $x \sim y$ and $y \sim z$ then $x \sim z$.

As noted before these relations result in equivalence classes, where the equivalence class $[x]$ is the set of all objects $y$ such that $x \sim y$. These have the nice property that $x ~ y$ if and *only if* $[x] = [y]$. This is precisely what you want to achieve by clustering!

Of course, as is typical in mathematics the only thing that is shown is that the above definition works, but not *how* to find these classes in a way that's actually workable. Identifying the whole set and comparing sets is incredibly time consuming, especially if we only know a part of the equivalence relation (which is pretty likely since the number of possible pairs in a cluster grows quite rapidly as the cluster becomes bigger).

This is where the next bit of prior-art comes to our rescue.

## Union-Find

Various algorithms were made to to make it possible for computers to actually do clustering efficiently. A particularly nice example is Union-Find, which is nice because it's simple enough that you can work it out by hand (just more slowly).

The basic idea is quite simple. Put the elements in a hierarchy, so you can control a whole group of elements by updating the element at the top. In such a structure it is possible to find out what cluster an element is in by finding the element at the top, and it's possible to merge two clusters by putting the top element of one directly under the top element of the other.

This is not quite the full story however. While this does work it is not particularly efficient. To make it efficient requires two changes. First when looking up the top element update the list for all underlying to point directly at the top element. Secondly keep track of the height of each cluster and when merging always place the bigger cluster on top in the hierarchy.

<details>
<summary>Example</summary>

Consider the equivalence relation generated by $1 \sim 2, 2 \sim 4, 1 \sim 3, 1 \sim 5$. We first initialize the hierarchy so each element is in its own cluster:

| ID| Parent| Height|
|--:|--:|--:|
|  1|  1|  1|
|  2|  2|  1|
|  3|  3|  1|
|  4|  4|  1|
|  5|  5|  1|

now let's pick our first edge $1 \sim 3$, both are at the top of their cluster so the find step is trivial, next we need to put one below the other so let's put 1 below 3:

| ID| Parent| Height|
|--:|--:|--:|
|  1|  2|  1|
|  2|  2|  2|
|  3|  3|  1|
|  4|  4|  1|
|  5|  5|  1|

things go similarly for $2 \sim 4$ 

| ID| Parent| Height|
|--:|--:|--:|
|  1|  2|  1|
|  2|  2|  2|
|  3|  4|  1|
|  4|  4|  2|
|  5|  5|  1|

now it gets interesting, for $1 \sim 3$ we note that neither is at the top, so we first find the top of both clusters which are $2$ and $4$. Then we put $2$ below $4$.

| ID| Parent| Height|
|--:|--:|--:|
|  1|  2|  1|
|  2|  4|  2|
|  3|  4|  1|
|  4|  4|  3|
|  5|  5|  1|

An interesting thing has now happened, the parent of $1$ is no longer at the top of its cluster, so for the next edge $1 \sim 5$ we need to update this parent during the find step. After that we find that $4$ and $5$ are at the top, and $5$ is the smaller cluster so we put it below (ensuring that the $4$ cluster doesn't get any higher)


| ID| Parent| Height|
|--:|--:|--:|
|  1|  4|  1|
|  2|  4|  2|
|  3|  4|  1|
|  4|  4|  3|
|  5|  4|  1|

And there we have it, after going through all edges we end up with a single cluster.
</details>

## Unwinding

So that's what we already have. Now we get to one of my favourite bits, unwinding the definitions into something closer to what we need. In my case I was interested in something that would be easy to implement in a relational database, and less interested in speed.

For instance the full version of the union find is incredibly efficient, but to make things a bit easier to implement and more 'relational' there are a couple of shortcuts that one can take. 

Firstly note that the whole structure that we need to maintain is essentially a function $f$ that points each element at its parent. This turns the algorithm into something relational.

Secondly instead of recursively finding the top of the cluster and updating all parents en-route you can also just flatten the hierarchy by only doing a single step, i.e. update the parent so it points at the grandparent. This is much easier to achieve in a relational database since you're basically just updating the relation $f$ to the relation composed with itself $f^2 = f \circ f$ (recall that composition is the same as a join).

Thirdly it's not *that* necessary to keep track of the height, it's nice if possible but as I just noted you can halve the height of the whole hierarchy in a single query so it's not too big a deal if the hierarchy ends up a bit higher than necessary.

So what we end up with is a single relation $f$ and to update it we have two steps one that updates $f$ to $f^2$ and another that updates it to cluster a few elements that weren't in there already. 

## Going a bit deeper

Now in fact I was also interested into a clustering method that somehow worked for *directed* relations. The idea I had was that something should be allowed to merge into a higher key, but only if it could be done with conflicts. So $a \le c$ and $b \le c$ could all be merged into $c$, but $c \le a$ and $c \le b$ doesn't allow $c$ to be merged with both $a$ and $b$ because that would identify $a$ and $b$ while they're not comparable.

To see how to do this requires digging even deeper into what makes the union-find algorithm work and what it is even trying to do exactly.



<!-- 
Instead of going directly from equivalence to equality, there's no reason we couldn't do this halfway and go from one equivalence to another equivalence. Leaving aside why this is useful for now let's define this first.

In this case a clustering is again two functions $(f,r)$ going both ways and which both preserve the structure, 
such that for all datums $x,y$ and clusters $c,d$ 

$$
x \sim y \Rightarrow f(x) \approx f(y)\\
c \approx d \Rightarrow r(c) \sim r(d)
$$

and we also want $r$ to function as a kind of representative of the cluster by requiring

$$
x \sim r(c) \Leftrightarrow f(x) \approx c.
$$

Is this the same as a representative? Well, almost. Instead of requiring that $r(c)$ is actually mapped into the cluster $c$ we instead get $f(r(c)) \approx c$.

Now why would this be useful? Well it gives more freedom in the clustering, in the strict definition it
is necessary to put *all* pairs $x \sim y$ into the same cluster, but with this more flexible definition 
it is good enough to put them into *equivalent* clusters.

This flexibility makes it possible to build clusters gradually, first just sending $x$ to $x$ and then gradually improving
the clustering. In fact 'improving' a clustering can now be made precise. We can say a clustering $(h,t)$ is an improvement over $(f,r)$ if there exists a clustering $(g,s)$ such that $h(x) = g(f(x))$ and $t(c) = r(s(c))$. In some sense the clusterings now compose, which gives a way to improve an existing one. Note that not all clusterings are comparable, making this a partial order.

Now we can also talk about the best clustering, one which cannot be improved upon. It's fairly easy
to see that we can improve any clustering $(f,r)$ such that $x \sim y$ and $f(x) \approx f(y)$ but $f(x) \ne f(y)$ by merely changing
the value of $f(x)$ to $f(y)$. This implies that a *maximal* clustering is one that sends equivalence to equality, it's not hard to see that this makes the maximal clustering unique.

This proof also gives a constructive way of creating such a clustering. Given any non-maximal clustering it gives a way to improve it, and in this relaxed definition the map $f(x) = x$ gives a perfectly valid clustering. This gives an algorithm to cluster data (on finite sets). A better algorithm also uses the fact that you can improve a clustering $(f,r)$ into $(f\circ r \circ f, r \circ f \circ r)$. These two operations form the basis of the Union-Find algorithm. -->

## Clustering -> Galois

So this works fine if we've got a data source telling us some things are equal (or equivalent), 
but in reality two pieces of data are rarely equal, usually one of the two is simply better
(because it is more specific, or better defined).

If for example we have data on restaurants then some of it could simply mention the name and/or location, 
and we may have some official sources that links location and name to an official government issued identifier.
In such a situation the official source is definitely better, and even if some other data source
links to two entries together.
XXXXXXXXXXXXXXXXXXXXXXX

So basically what we have here is an *ordering* of data, where if $x \le z$ and $y \le z$ we *do* want 
to cluster $x,y$ and $z$ together but not if $z \le x$ and $z \le y$. 
Not entirely accidentally this can be achieved by swapping equivalence to inequality in the above definition of a clustering:

> - $x \le y$ implies $f(x) \le f(y)$  
> - $c \le d$ implies $r(c) \le r(d)$  
> - $x \le r(c)$ if and only if $f(x) \le c$.

This is what is called a Galois connection. 

## Beyond Ordinal Relations and Ordinary Relational Databases

TODO (?)

--------

[^abel]: Which style is best was also a point of discussion during Galois' time when his contemporary Abel criticized Gauss' writing style by complaining that "He is like the fox, who effaces his tracks in the sand with his tail".