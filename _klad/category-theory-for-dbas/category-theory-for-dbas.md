---
title: Category Theory for DBAs
---

Mathematics and information technology have had a symbiotic relationship from the very start. To name but a few examples: 

- The first programmer was the mathematician Ada Lovelace who wrote a program to calculate the Bernouilli numbers. 
- The concept of 'bits' was invented by Shannon, who single handedly wrote the book on the mathematical theory of communication. 
- And relational databases use the relational algebra based on the work of Edgar F Codd, [A relational model of data for large shared data banks](https://dl.acm.org/doi/10.1145/362384.362685).

This series of events started in 1843 and ran all the way through 1970 to finally end up at the design of the first 'modern' databases. 

However in recent years the mathematical foundations of databases have started to be forgotten a bit. Meanwhile mathematics has gone its own way and databases still only support the bare minimum of relational algebra. 

While there seems to be some consensus that databases have stagnated a bit and that a more modern approach could yield many benefits, any attempt that fails to properly recognise what relational databases *are* risks reinventing relational databases before getting to the real problem.

For example, one such attempt to modernise databases are the graph databases, based on graph theory (invented by Euler in 1735). Amusingly people seem to recognise that a hypergraph database would be even more powerful but haven't yet realised that this is exactly the notion of a relational database (assuming said database has `NULL`s, another concept that seems to keep getting reinvented).

Clearly it is not desirable to reinvent concepts that have been known for centuries, and while Codd's work in the 1970s was important, the notion of relations wasn't exactly cutting edge either (though his application of them was novel). 

This means there are several problems that need to be solved.

Firstly awareness of the mathematical notions behind databases need to be improved, to avoid reinventing concepts that have been known for centuries to mathematicians just because they are not part of 'ordinary' SQL, or simply forgotten. 

Secondly it is time to bring the state of mathematics used in databases to at least somewhere in the later half of the 20th century. As important as the relational algebra of Codd was, it didn't exactly represent the cutting edge of mathematics at the time. Of the cutting edge mathematics of that time the field of category theory in particular has since found many uses in other areas (including information technology) so it is time to bring it to the world of databases as well.

And then finally the third problem

<figure>
<svg viewBox="0 0 100 75" xmlns="http://www.w3.org/2000/svg">
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
<text x="45" y="10" style="font-size: 5px;" text-anchor="middle">
Potential Audience
</text>
<line x1="45" y1="12" x2="47.5" y2="35" marker-end="url(#arrow)" stroke="black" />
<text x="25" y="40" style="font-size: 5px;" text-anchor="middle">
<tspan x="25">Familiar</tspan>
<tspan x="25" dy="1.2em">with databases</tspan>
</text>
<text x="70" y="40" style="font-size: 5px;" text-anchor="middle">
<tspan x="70">Interested in</tspan>
<tspan x="70" dy="1.2em">Category Theory</tspan>
</text>
</g>
</svg>

Figure 1. A Venn diagram representing the third problem.
</figure>

So if you're still reading this then I hereby invite you to read the posts in these series as they come online. The first couple of these will necessarily focus on increasing the potential audience by reviewing the mathematical notions that relational databases were built on (e.g. relations) and by showing some useful applications as bait to interest more people in category theory.