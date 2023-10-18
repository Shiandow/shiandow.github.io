---
title: Those Who Don't Know History&hellip;
subtitle: Category Theory for DBAs &mdash; Part 1, Why?
tag: category-theory-for-dbas
---

Mathematics and information technology have had a symbiotic relationship from the very start. Many useful tools and concepts were born as a result of this relationship. This cross-pollination started before the first computer and lay the foundation for programming, the internet and the first 'modern' databases. 

- (1843) The first programmer, mathematician Ada Lovelace, wrote a program to calculate the Bernoulli numbers. 
- (1948) The concept of 'bits' was invented by Shannon, who single-handedly wrote the book on [the mathematical theory of communication](https://ieeexplore.ieee.org/document/6773024). 
- (1970) Edgar F. Codd publishes [A relational model of data for large shared data banks](https://dl.acm.org/doi/10.1145/362384.362685), laying the foundations for relational databases.

However in recent years the mathematical foundations of (relational) databases have started to be forgotten a bit. Meanwhile mathematics has gone its own way and databases still only support the bare minimum of relational algebra. And while the popularity of NoSQL suggests a consensus that it's time for a more modern approach, any attempt that fails to properly recognise what relational databases *are*, risks reinventing relational databases before getting to the real problem.

Take for example graph databases, an attempt to modernise database by basing them on graph theory (invented by Euler in 1735). Not only are relations and graphs similar in many ways, the obvious generalisation from graphs to hypergraphs (analogous to moving from binary to $n$-ary relations) results in much the same model as the relational databases described by Edgar F. Codd (though the equivalence requires the use of `NULL`s, another concept that seems to keep getting reinvented).

While such efforts do bring some much needed fresh air, they would be more effective if the effort was not spent reinventing the parts that are already there. And while Codd's work in the 1970s was important, very little of the mathematics developed since then has seen much use in databases. This suggests several areas of improvement.

Firstly awareness of the mathematical notions behind databases needs to be improved. In order to avoid reinventing concepts simply because they are not part of 'ordinary' SQL, or simply forgotten. Even if those concepts have been known to mathematicians for centuries. 

Secondly it is time to bring the state of mathematics used in databases to at least somewhere in the later half of the 20th century. As important as the relational algebra of Codd was, it didn't exactly represent the cutting edge of mathematics at the time. Of the cutting edge mathematics of that time the field of category theory in particular has since found many uses in other areas (including information technology) so it is time to bring it to the world of databases as well.

There is, however, one small problem which will need to be tackled first. 

<figure>
<svg viewBox="0 0 100 75" xmlns="http://www.w3.org/2000/svg">
<defs>
<filter id="sketch">
    <feTurbulence type="turbulence" baseFrequency="0.01" numOctaves="3" result="noise" />
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="10" xChannelSelector="R" yChannelSelector="G"/>
</filter>
<filter id="sketchy">
    <feTurbulence type="turbulence" baseFrequency="0.03" numOctaves="3" result="noise" />
    <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" xChannelSelector="R" yChannelSelector="G"/>
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
      refX="8"
      refY="5"
      markerUnits="strokeWidth"
      markerWidth="6" markerHeight="6"
      orient="auto-start-reverse">
      <path d="M 0 0 L 10 5 L 0 10 z" fill="black"/>
</marker>
</defs>
<g style="filter: url(#sketch); font-family: 'Comic Sans MS', 'Comic Sans',cursive;">
<circle cx="25" cy="40" r="23" fill="none" stroke="black"/>
<circle cx="70" cy="40" r="23" fill="none" stroke="black"/>
<line x1="45" y1="12" x2="47.5" y2="35" marker-end="url(#arrow)" stroke="black" />
</g>
<g style="filter: url(#sketchy); font-family: 'Comic Sans MS', 'Comic Sans',cursive;">
<text x="47" y="10" style="font-size: 5px;" text-anchor="middle">
Potential Audience
</text>
<text x="27" y="40" style="font-size: 5px;" text-anchor="middle">
<tspan x="27">Reads articles</tspan>
<tspan x="27" dy="1.2em">about databases</tspan>
</text>
<text x="72" y="35" style="font-size: 5px;" text-anchor="middle">
<tspan x="72">Reads articles</tspan>
<tspan x="72" dy="1.2em">containing</tspan>
<tspan x="72" dy="1.2em">Mathematics</tspan>
</text>
</g>
</svg>

Figure 1. The problem.
</figure>

The healthy cross-pollination between mathematics and databases can not happen without people interested in both. Therefore anyone still reading this is cordially invited to read the other posts in these series as they come online. The first couple of these will necessarily focus on increasing the potential audience by reviewing the mathematical notions that relational databases were built on (e.g. relations) and by showing some useful applications as bait to interest more people in mathematics (or databases).

More posts in this series:
{% render see-also.html tag="category-theory-for-dbas" %}