---
title: Differential Privacy and Information Theory
subtitle: How to Secure Data with a Broken Wifi Connection
date: 2022-01-15
excerpt: |
    The goal of this article is to provide a link between differential
    privacy and information theory. It will start with a short overview of
    the definitions for differential privacy and information theory. The
    next section will show how differential privacy and information theory
    are linked, explain Shannon's noisy channel theorem and what it means
    for differential privacy. Finally this article will demonstrate how
    properties of information can be used to protect data by seeing what
    happens when we try to get more information out of a dataset than we're
    supposed to.
---
{::options parse_block_html=true /}
## Introduction

The goal of this article is to provide a link between differential privacy and information theory. It will start with a short overview of the definitions for differential privacy and information theory. The next section will show how differential privacy and information theory are linked, explain Shannon's noisy channel theorem and what it means for differential privacy. Finally this article will demonstrate how properties of information can be used to protect data by seeing what happens when we try to get more information out of a dataset than we're supposed to.

Differential privacy is a method to ensure private data is kept secure while still allowing aggregated statistics like averages, correlation coefficients, histograms to be calculated and published. The ability to do this in a way that is secure is of great importance, not only because the aggregated data can be of great value to society as a whole but also because current methods vary between redacting the parts that are considered identifying, which is far from secure, or labelling everything private information and forbidding all processing thereof.

While differential privacy is a relatively recent concept, this article will show it is linked to some of the earliest theorems of information theory (due to Shannon) and that by linking differential privacy with information theory it becomes possible to reason about flows of private information and choose an appropriate level of protection for the data.

The method used in this article also gives a way to relax the requirements of differential privacy in a way that ensures the information is still protected. Differential privacy does provide a parameter that can be tuned which raise or lowers the amount of information that can be leaked about an individual (also called a privacy budget), resulting in a lower or higher amount of noise added to the output. This article will show what effect this parameter has on the amount of information that can be leaked, why it does not allow certain types of noise, and how to relax the conditions to allow more types of noise and what the trade-offs are.

Along the way it will become clear that where Shannon was concerned with getting the maximum amount of information through a channel and differential privacy is concerned with limiting the flow of information from a dataset, they both measure this flow of information in an analogous way but for the opposite purpose. In this sense differential privacy is like protecting private information by putting it behind a deliberately broken wifi connection, incapable of transmitting any useful amount of information (except by aggregating the output of *many* such connections at the same time).

## Differential privacy

Differential privacy is a method to protect individual rows in a dataset while still allowing the calculation of aggregated statistics. It does this by limiting how much the value of one row (or one individual) is allowed to affect the output of a query. The idea is that this will prevent the query from leaking information that can be tied to a single individual.

Recently the concept of differential privacy has been developed further and implemented by several organisations to allow researchers to use datasets while protecting personally identifiable information. Among others the U.S. census bureau has started using it in their publications about census results and Microsoft has collaborated with Harvard to build an open source implementation as part of the [OpenDP Project](https://opendp.org/)

The advantage of this approach to other approaches such as pseudonymisation or redacting part of the data is that it can limit the leakage of *any* information regardless of what knowledge an attacker already has. In the past approaches based on merely redacting data have proven to be vulnerable. One such example was Netflix's contest to improve its recommender engine, in which they provided a limited redacted subset of viewer data, which nevertheless contained enough information to allow researchers to identify individuals in the database uniquely by combining it with other information ([Narayanan and Shmatikov 2006](#ref-Arvind_2006)). Similar incidents have happened through the sharing or selling of anonymized medical records, best exemplified by Latanya Sweeney who deanonymised the medical records of a U.S. senator and went on to show how to do the same for many other such records using publicly available information like newspaper articles ([Sweeney 2015](#ref-sweeney2015only)).

While differential privacy provides tools to prevent the leakage of private information at the source the mathematical theory behind it has so far shied away from actually calling it information, mostly focussing on the *how* and not necessarily the *why* or *what*, this has led to the (re)discovery of several theorems about information that aren't identified as such and were partially or fully known as other theorems. This is not surprising since there are gaps in the information theory required to reason about differential privacy and some theory simply does not (yet) exist. Hopefully this article can help close the gap somewhat and both allow the usage of whatever mathematical machinery already exists as well as give a clearer picture of *why* this all works.

The exact definitions will follow later in the article, but for now the key thing to take away is that differential privacy prevents the leakage of information by limiting the change in probability of a particular output for two datasets differing by a single row. And when it comes to flows of information as well as measuring differences between probabilities, Shannon's work can not be ignored.

## Shannon and Information Theory

Shannon lay the foundations for information theory by applying the concept of entropy to the problem of communicating over a noisy channel. In his article 'A Mathematical Theory of Communication' ([Shannon 1948](#ref-shannon1948mathematical)) he showed how entropy could be used to define the information capacity of a channel mathematically, what the maximum possible rate of information is and how it could (theoretically) be achieved. In some sense the main problems of information theory were solved before the field of information theory even existed.

Entropy is a measure of the amount of randomness and in general if it is higher then the output is less 'known' (so if we want to communicate information the end result should be a *decrease* in entropy). This can also be generalized into something called relative entropy or divergence which is a measure of how different two probability functions are. In particular how much information is lost or gained if we use one probability function over the other. This relative entropy is particularly important when defining how much information can pass through a channel (where the relative entropy is used to calculate how much information was gained after receiving a signal).

Linking these concepts to differential privacy requires the work of Rényi, a Hungarian mathematician who generalized the concept of entropy that Shannon was working with. He showed a way to add an additional parameter to the definition of entropy which when set to 1 results in the definitions used by Shannon, but also allows other values which result in a similar but slightly different notion of entropy. This generalisation makes it possible to interpolate between Shannon's definitions and the ones used in differential privacy, which has been done before ([Mironov 2017](#ref-Mironov_2017)). This article will go a step further and show that the information capacity of a channel as defined by Shannon and the privacy of a system as defined in differential privacy are specific cases of a more general Rényi channel capacity (which will be defined in the following section).

Unfortunately while Rényi's definitions have been used before in information theory, their use is not particularly widespread and there is some ambiguity on how to define some of the concepts. The definitions used in this article were chosen to facilitate proofs and get some useful properties for the protection of privacy (the group-privacy property in particular).

## Definitions

$$ % Definitions
\gdef\d{\textrm{d}}
\gdef\D{\textrm{D}}
\gdef\H{\textrm{H}}
\gdef\I{\textrm{I}}
\gdef\E{\mathbb{E}}
$$

### $\varepsilon$-privacy

Differential privacy uses a concept called $\varepsilon$-privacy, which puts a limit on the amount of effect a change in a single row is allowed to have on the output of a query. The usual definition of $\varepsilon$-privacy is as follows. If $f$ is a stochastic function representing the query, then $f$ is defined to be $\varepsilon$-private if $$
P(f(D) \in E) \le e^\varepsilon P(f(D') \in E)
$$ for all events $E$, and all datasets $D$ and $D'$ that only differ on a single row.

Note that this results in a randomized answer for a specific query, where the randomization ensures that the probability to get a specific answer does not change much when just a single row is changed. This ensures a query is not able to leak much information (which will become explicit once the amount of information leaked by the query is defined).

### $(\varepsilon, \delta)$-privacy

To relax the strict requirements of $\varepsilon$-privacy a common extension of $\varepsilon$-privacy is $(\varepsilon, \delta)$-privacy, which adds an additional term $\delta$ to the condition

$$
P(f(D) \in E) \le e^\varepsilon P(f(D') \in E) + \delta.
$$

This is often explained as being $\varepsilon$-private with probability $1-\delta$ (though what happens the remaining $\delta$ part of the time is left dangerously unspecified).

The reason such a relaxation of $\varepsilon$-privacy exists suggests that $\varepsilon$-privacy is restrictive to the point that it gets unpractical. However it turns out the amount of information that $\varepsilon$-privacy allows to leak through is proportional to $\varepsilon$ so if it is not the amount of information then what is it exactly that $\varepsilon$-privacy does not allow? To answer this requires a more precise notion of information and an additional parameter $\alpha$ (which can also be used to relax $\varepsilon$-privacy but in a more controlled fashion than with $\delta$).

### Relative Entropy / Divergence

Relative entropy or divergence measures how much information is gained when going from a probability distribution $Q$ to a probability distribution $P$. To keep things brief the exact definitions as used by Shannon are skipped and we immediately go to the generalization due to Rényi. This relative entropy, better known as the Rényi divergence, from $Q$ to $P$ is defined to be

$$
\D_\alpha(P \| Q) 
= \log \, \biggl\|\frac{\d P}{\d Q}\biggr\|_{P,\alpha-1}
$$

here the expression $\frac{\d P}{\d Q}$ can be thought of as the quotient of the two probability densities.

This divergence has a parameter $\alpha$. Setting this $\alpha$ to $1$ turns this divergence into the Kullback-Leibler divergence which is based on Shannon's notion of entropy. Almost every definition or formula based on this divergence will have a (famous) analogue based on Shannon's notion of entropy when setting $\alpha$ to $1$. At higher $\alpha$ the maximum distance between the two probability densities starts dominating the expression until eventually at $\alpha=\infty$ the value is simply equal to the maximum of $\log \frac{\d P}{\d Q}$ (this is related to the so called max-entropy).

Some useful properties of this divergence are that it is non-negative, increases monotonically with $\alpha$, and is 0 if and only if $P$ and $Q$ are the same.

<details markdown="block">
<summary>
More details
</summary>

1.  As $\alpha$ goes to 1 this definition approaches the Kullback-Leibler divergence, which is related to Shannon's definition of entropy: $$
     \D_{KL}(P \| Q) 
     = \E_P\left[\log \left(\frac{\d P}{\d Q}\right) \right]
     $$

2.  The actual definition of $\frac{\d P}{\d Q}$ is the Radon-Nikodym derivative. Importantly this makes the divergence independent of the choice of coordinates.

3.  The (absolute) entropy can be recovered by comparing a probability measure to a uniform measure (though then the result will depend on the choice of coordinates used).

4.  The notation $\| f \|_{P, a}$ is used here to emphasize the relation to the $\alpha-1$-norm. It is defined as follows\
    $$
       \| f \|_{P, a} = \E_P[ |f|^a ]^{1/a}  = \biggl( \int |f|^a \d P \biggr)^{1/a}
       $$\
    in particular this implies that as $\alpha$ goes to $\infty$ the result will be the logarithm of the $\infty$-norm, which is essentially the maximum value, ignoring probability 0 subsets. Some properties of the $\alpha-1$-norm carry over to the $\alpha$-divergence, in particular the Hölder inequality is useful.

5.  For more properties of the $\alpha$-divergence see ([Erven and Harremoës 2014](#ref-van_Erven_2014)).

</details>

### Mutual information

With relative entropy it is possible to express how much two random variables $X$ and $Y$ depend on one another by looking at how much difference there is between sampling $X$ and $Y$ independently from one another, and sampling them together. This can be done by measuring the divergence of the joint probability $P_{XY}$ from the product of the two marginal probabilities $P_X P_Y$. This is the justification for defining the Rényi mutual information to be

$$
\I_\alpha(X; Y) = \D_\alpha(P_{XY} \| P_X P_Y).
$$

### Channel Capacity

A channel is a pair of random variables $X$ and $Y$ that are linked to one another. The assumption is that $X$ can be chosen by the sender with $Y$ being the received signal. A noisy channel is one where the received signal is not deterministic but instead is random with distribution $P_{Y|X}$.

One example is the binary symmetric channel where $X$ is either $0$ or $1$, and $Y$ has the same value with probability $1-p$, or the opposite value with probability $p$. Another example is the "Additive White Noise Gaussian" channel, where $Y$ is $X + N$ where $N$ is some random noise with a gaussian distribution.

The maximum capacity of such a channel is the maximum of the mutual information for all (possible) choices of $P_X$, keeping $P_{Y|X}$ fixed.

$$
C_\alpha = \sup_{P_X} \I_\alpha(X ; Y).
$$

This definition of channel capacity agrees with the one used by Shannon in his proof of the noisy channel theorem at $\alpha=1$. This channel capacity also increases monotonically in $\alpha$ (since $\I_\alpha$ does).

Other definitions for both the mutual information and channel capacity exist, but may fail to be able to ensure $\varepsilon$-privacy. The definitions used here are compatible with the definition of $\varepsilon$-privacy, ensure the properties of the $\alpha$-divergence carry over directly to the channel capacity, and make the proofs of various properties easier (and possible).

<details markdown="block">
<summary id="sibson">
Sibson's definition
</summary>

One such alternative definition, due to Sibson ([Verdú 2015](#ref-Sergio_2015)), can be defined as follows:

$$
\I^s_\alpha(X;Y) = \min_{Q_Y} \D_\alpha(P_{Y|X} P_X \| Q_Y P_X).
$$

the reasoning behind this definition is that unlike in the $\alpha=1$ case the $P_Y$ distribution does not actually properly minimize the distance to $P_{Y|X}$ on average, so in some sense this was information that was already 'known' but that the 'naive' definition didn't take into account.

The minimizing distribution $Q_Y^*$ can in fact be identified and this gives an easier to calculate expression for the mutual information, which is very helpful in estimating channel capacity.

$$
\begin{aligned}
Q_Y^* &= \frac1{Z} \left\| \frac{\d P_{Y|X}}{\d Y} \right\|_{P_X, \alpha}\\
\I^s_\alpha(X;Y) &= \frac{\alpha}{\alpha-1} \log (Z) =  \frac{\alpha}{\alpha-1} \log \int \left\| \frac{\d P_{Y|X}}{\d Y} \right\|_{P_X, \alpha} \d Y
\end{aligned}
$$

Here $Z$ is a normalizing constant, and the norm $\left\| \frac{\d P_{Y|X}}{\d Y} \right\|_{P_X, \alpha}$ is the norm as function of $X$. The definition uses an apparently arbitrary measure on $Y$ but is in fact independent of which measure is chosen as long as $P_{Y|X}$ is absolutely continuous with respect to that measure for almost all $X$.

Despite these nice properties it isn't useful as a definition of channel capacity when it comes to differential privacy as it cannot guarantee $\varepsilon$-privacy even at $\alpha=\infty$. Consider for instance the binary symmetric channel where $X$ and $Y$ both have two possible values and they agree with probability $1-p$. In this case $Q_Y$ will be the uniform distribution in order to minimize the worst case divergence, but $P_Y$ can be anything including $(p, 1-p)$, which leads to the worst case $D_\infty(P_{Y|X} \| P_Y P_X) = \log(\max(\tfrac{p}{1-p}, \tfrac{1-p}{p}))$, which matches the value used in $\varepsilon$-privacy, instead of $\I^s_\infty(X;Y) = \log(2 \max(p, 1-p))$. One of these diverges to infinity as $p \to 0$ whereas the other goes to $\log(2)$ instead (indeed the channel can only transmit 1 bit per second, but unfortunately that's not exactly what we're interested in).

Sibson's definition may still be useful as a necessary condition for a sufficient level of privacy as it will always be a lower bound for the channel capacity as defined here. This lower bound can be consider the 'radius' of the set of distributions $P_{Y|X}$ with the divergence as metric, while the 'diameter' always gives an upper bound

$$
\sup_{P_X} \I^s_\alpha = \inf_{Q_Y} \sup_x \D_\alpha(P_{Y | X=x} | Q_Y) \le C_\alpha \le \sup_{x, x} \D_\alpha(P_{Y | X=x} \| P_{Y | X=x'}).
$$

At $\alpha=\infty$ the latter inequality becomes an equality and this turns out to be very important when it comes to connecting channel capacity to $\varepsilon$-privacy.

</details>
<p>

## The Information Theory of Privacy

### Connecting Differential Privacy to Shannon

So on one hand there is the concept of $\varepsilon$-privacy that limits the difference between two probabilities and on the other hand there is the concept of channel capacity in terms of the difference between two probability densities. At this point it probably won't come as a surprise that these are equivalent.

To go from one to the other $\varepsilon$-privacy needs to be rephrased in terms of random variables by randomizing the value of a particular row in the database. Let $X$ be a random value and let $Y=f(D)$ be the output of $f$ if we replace a particular row (let's say the first one) with $X$, then $f$ is $\varepsilon$-private precisely when

$$
C_\infty = \sup_{P_X} \I_\infty(X ; Y) \le \varepsilon.
$$

<details markdown="block">
<summary>
Mathematical Details
</summary>

Recall the definition of $\varepsilon$-privacy: [^1]

$$
P_{Y | X = x}(y) \le e^\varepsilon P_{Y | X = x'}(y)  \quad \textrm{For almost all $y$, $x$ and $x'$}
$$

Since the $\infty$-norm equals the maximum of a function this is precisely.

$$ 
\sup_{x,x'} D_\infty(P_{Y | X = x} \| P_{Y | X = x'}) 
=
\sup_{y,x,x'} \log \left( \frac{\d P_{Y | X = x}}{\d P_{Y | X = x'}} (y) \right) 
\le 
\varepsilon
$$

Since the probability distributions such that $P_X(X = x') = 1$ are a subset of all possible distributions

$$
\begin{aligned}
   \sup_{x,x'} D_\infty(P_{Y | X = x} \| P_{Y | X = x'})
&\ge \sup_{x,P_X} \log \, \biggl\| \frac{\d P_{Y | X = x}}{\d P_{Y}} \biggr\|_{\infty} \\
&= \sup_{P_X} \log \, \biggl\| \frac{\d P_{XY}}{\d P_X P_Y} \biggr\|_{\infty} \\
&= \sup_{P_X} \D_\infty\bigl(P_{XY} \| P_X P_Y\bigr) = \sup_{P_X} \I_\infty(X ; Y).
\end{aligned}
$$

And with judicious use of Jensen's inequality the mutual information can be bounded above by $$
\begin{aligned}
\I_\alpha(X;Y) 
&= 
\frac1{\alpha-1} \log \, \int \left(\frac{\d P_{Y | X}}{\d P_{Y}}\right)^{\alpha-1} \d P_{Y|X} \d P_X \\
&\le 
\frac1{\alpha-1} \log \, \int \left(\frac{\d P_{Y | X = x}}{\d P_{Y | X = x'}}\right)^{\alpha-1} \d P_{Y|X} \d P_X(x) \d P_X(x') \\
&\le \sup_{x, x'} \D_\alpha(P_{Y | X = x} \| P_{Y | X = x'})
\end{aligned}
$$

so at $\alpha=\infty$ the supremum of $D_\infty(P_{Y | X = x} \| P_{Y | X = x'})$ is exactly the channel capacity and this is bounded by $\varepsilon$ if and only if the system is $\varepsilon$-private.

</details>

Worth noting is that $\varepsilon$-privacy restricts the channel capacity for all other $\alpha$ $$
\sup_{P_X} \I_\alpha(X ; Y) \le \sup_{P_X} \I_\infty(X ; Y).
$$

This needs to be generalized a bit to allow functions to depend on multiple rows. Say $Y$ is a function of the whole dataset $D$ then we should limit the channel capacity for each $X_i$ individually for all possible datasets

$$
\sup_{P_{D}} \I_\alpha(X_i ; Y) \le \varepsilon.
$$

Such a function can then be said to be $\varepsilon$-private at level $\alpha$ (it is $\varepsilon$ private precisely when it is $\varepsilon$-private at all levels).

This definition is slightly different from the normal channel capacity, where only the distribution of one of the variables is changed, but this definition avoids the pitfall of only checking the output looks random if we don't know the rest of the dataset. The difference between two random rows in the dataset might look random but nevertheless transmits the exact value of one row to anyone who already knows the other. The definition above protects the information regardless of what other knowledge someone may already have.

Instead of taking the supremum over all distributions for the whole dataset it would also have been possible to view the channel capacity as a conditional mutual information, where one row is random and the others are kept fixed. This is not done for a couple of reasons.

-   Using a supremum over all distributions for the whole dataset makes it easier to prove properties.
-   In the course of various proofs a useful definition for conditional mutual information is encountered, which does not yield a higher channel capacity.
-   It is more useful to know a property holds for all possible distributions of datasets.
-   This definition gives full control over the distribution of the entire dataset, which gives a more natural way to e.g. restrict the variance of some values in the dataset. Such a restriction is in fact quite common in information theory where an unrestricted channel would be able to drown out pretty much all noise by raising the signal volume arbitrarily high. The usual approach in differential privacy requires processing the data with a function that limits the signal volume, which is a bit awkward.

### What is $\alpha$? The Different Levels of Channel Capacity

To give an idea what the effect of this new parameter $\alpha$ is this section will give some examples, in particular for the two extremes $\alpha=1$ and $\alpha=\infty$.

Looking at this in a Bayesian perspective, if at first $X$ was believed to have the prior distribution $P_X$ then after getting the output this belief should be updated to be $P_{X|Y}$. If a system is $\varepsilon$-private then the information gain (measured by the divergence from $P_X$ to $P_{X|Y}$) is limited by $$
\D_\infty\bigl(P_{X | Y} \| P_{X}\bigr) \le \I_\infty(X ; Y) \le C_\infty = \varepsilon
$$

with probability 1. Compare this to the channel capacity as used by Shannon which only limits the divergence *on average*

$$
\E_X\bigl[ \D_{1}(P_{X|Y} \| P_X) \bigr] = \I_1(X ; Y) \le C_1
$$

while other choices of $\alpha$ guarantee that

$$
\log \, \Bigl\| e^{\D_\alpha(P_{X|Y} \| P_X)} \Bigr\|_{\alpha-1} = \I_\alpha(X ; Y) \le C_\alpha.
$$

For $\alpha<\infty$ it is not possible to say with 100% certainty that the output of a query won't leak information. However if the channel capacity is low then the probability to leak a significant amount of information must also be low otherwise the average amount of information leaked would exceed the channel capacity. More precisely the probability that $D_\alpha(P_{X|Y} \| P_X)$ exceeds $R$ is at most[^2]

$$
P(\D_\alpha(P_{X|Y} \| P_X) \ge R) 
\le \frac{e^{(\alpha-1)\varepsilon} - 1}{e^{(\alpha-1)R} - 1}
$$

in the special case $\alpha=1$ the right hand side becomes $\varepsilon / R$. In general a higher $\alpha$ increases how quickly this probability must go to 0. In particular $\varepsilon$-privacy is quite restrictive, it forbids $D_\alpha(P_{X|Y} \| P_X)$ from *ever* being higher than the channel capacity, limiting the leakage of information even in the worst possible case (when the output $Y$ causes the biggest leak of information possible).

This makes $\varepsilon$-privacy so restrictive that among other things it does not allow gaussian noise because, while *exceedingly* unlikely, it is in theory possible for gaussian noise to produce a value say $100$ standard deviations from the mean which would allow one to determine with a decent level of certainty whether the mean was a tenth of a standard deviation higher or lower. This is of great annoyance to anyone wanting to use $\varepsilon$-privacy since gaussian noise has some very desirable properties [^3].

In summary $\alpha$ interpolates between a measure of privacy that limits the average information gain at $\alpha=1$, and one that limits the information gain even in the worst case at $\alpha=\infty$, with higher $\alpha$ placing stronger emphasis on the worst case. However placing stronger restrictions on a system is not without its cost.

It is also important to keep in mind a particular system doesn't have a singular channel capacity but rather a channel capacity for all possible $\alpha$, some of which are more important than others. In particular the capacity at $\alpha=1$ has some important consequences.

### Noisy Channel Theorem

Shannon's definition for the channel capacity ($\alpha=1$) has one distinct advantage, which is that it not only gives an upper limit for the amount of 'information' that can pass through a channel but in his famous noisy channel theorem Shannon also showed that this limit can be achieved.

A brief summary of this theorem is as follows. It is possible to define a typical set of messages and outputs, consisting of blocks of $n$ sent and received signals, and encode a set of $e^{nR}$ messages such that with arbitrarily high probability, each message and its resulting output are in the typical set and no other possible messages are in the typical set with the same output. This makes it possible to send information at a rate of $R$ nats per signal by mapping $e^{nR}$ codewords to the possible messages and decoding the resulting output by picking the codeword corresponding to the only possible message with that output in the typical set. [^4]

<details markdown="block">
<summary>
Extremely Abridged Proof
</summary>

Given a tuple $(X^{(n)}, Y^{(n)})$ of $n$ independent draws from $P(X,Y)$ then by the strong law of large numbers

$$
\frac1n \log \left(\frac{P(X^{(n)}, Y^{(n)})}{P(X^{(n)}) P(Y^{(n)})}\right) = \frac1n \sum_i \log \left( \frac{P(X_i, Y_i)}{P(X_i) P(Y_i)} \right) \to \E \left[ \log \left(\frac{P(X, Y)}{P(X) P(Y)}\right) \right] = \I(X;Y)
$$

almost surely, so for any $\delta$ we can pick an $n$ large enough that

$$
e^{nI(X;Y) - \delta} \le \frac{P(X^{(n)}, Y^{(n)})}{P(X^{(n)}) P(Y^{(n)})} \le e^{nI(X;Y) + \delta}
$$

with probability at least $1 - \delta$. The set of tuples for which this holds is called the typical set and is denoted $A^n_\delta$.

For a random subset $M$ consisting of $e^{nR}$ independent samples of $X^{(n)}$ and any fixed $Y^{(n)}$ the average number of $X^{(n)}$ in $M$ such that $(X^{(n)}, Y^{(n)})$ is in $A_\delta^{(n)}$ is

$$
\sum_{\mathclap{\substack{X^{(n)} \\ (X^{(n)}, Y^{(n)}) \in A_\delta^{(n)} }}} |M| P\bigl( X^{(n)} )
\le e^{nR} \sum_{\mathclap{\substack{X^{(n)} \\ (X^{(n)}, Y^{(n)}) \in A_\delta^{(n)} }}} e^{-n\I(X;Y)+\delta} \frac{P(X^{(n)}, Y^{(n)})}{P(Y^{(n)})}
\le e^{n(R-\I(X;Y))+\delta}.
$$

If $R < I(X;Y)$ this can be made arbitrarily small by increasing $n$. If at least one such $X^{(n)} \in M$ exists then the chance of there being another is bounded by the same expression because the $|M|$ messages are chosen independently from on another. $\square$
</details>

A consequence of this theorem is that the channel capacity at level $\alpha=1$ effectively dictates at what rate it is possible to leak (sensitive) information out of the system. In fact given no further restriction on what queries are allowed this can be done for all rows in the dataset simultaneously (so from an information theoretical point of view it might be a good idea to limit the global channel capacity as well, not just the row-wise capacity).

The best we can expect from an $\varepsilon$-private query at $\alpha>1$ is that it does not have a channel capacity higher than $\varepsilon$ at $\alpha=1$. This means that of the two ways to relax the requirement that a system is $\varepsilon$-private at level $\alpha$, raising $\varepsilon$ allows *more* information to leak, while restricting the channel capacity at a lower $\alpha$ does not allow information to leak at a higher rate *on average* but does allow more outliers in the rate at which information leaks.

## Hacking $\varepsilon$-privacy

To figure out how this all can be used to protect privacy let us see what limitations we encounter when we try to do the reverse and get more information out of a dataset than we're supposed to. Along the way we encounter restrictions that all boil down to somewhat intuitive statements about how information behaves.

### Data Processing Inequality

While it might seem promising to use post-processing to enhance the output of a query into something more informative, alas the information that can pass through a channel doesn't suddenly change if something is done to it's output

> **Data Processing Inequality**
>
> No matter what kind of processing is used the information does not increase. In differential privacy this is also known as robustness to postprocessing. The exact statement is that for any (stochastic) function $g$ of $Y$ the mutual information between $X$ and $g(Y)$ cannot be greater than between $X$ and $Y$. $$
> \I_\alpha(X; g(Y)) \le \I_\alpha(X; Y) \le C_\alpha.
> $$

This simple fact, also known as the data processing inequality, has big consequences because it forbids certain end results, even when we don't know how such an end result could be reached.

The data processing inequality also works the other way around (since the definition for mutual information is symmetric), no matter what private information has been processed to calculate the values in the dataset this information is protected in the same way.

### Protection against B... Outcomes

The full effect of the data processing inequality becomes apparent if we try to circumvent the protection and just try to make a system that tries to treat some people worse than others. Let's say that we have a group of people $A$ that we want to make some set of 'bad' outcomes $B$ more likely for, since membership of $A$ and membership of $B$ are both binary variables the data processing inequality allows us to reduce this to the problem of sending 1 bit over a channel.

In differential privacy the very definition gives an immediate way to limit $P_{Y|X}$ but this does not generalize well to lower $\alpha$[^5]. To show how restricting the channel capacity restricts the possible outcomes it is best to look at an illustrative example. The example chosen here is the binary symmetric channel for which the channel capacity is well known (due to Shannon) and this turns out to generalise nicely into a result that exemplifies the protection against bad outcomes.

In a binary symmetric channel members of $A$ get an outcome in $B$ with probability $1-p$ and other people get an outcome in $B$ with probability $p$. If such a system is $\varepsilon$-private at level $\alpha$ then picking ${ P_X = (\tfrac12, \tfrac12) }$ and calculating the mutual information results in the following

$$
\log(2) - \H_\alpha(p) \le \varepsilon
$$

were ${ \H_\alpha(p) =-\frac1{\alpha-1}\log( p^\alpha + (1-p)^\alpha ) }$ is the binary Rényi entropy. At $\alpha=1$ this turns into the regular Shannon entropy and the above turns into a well known formula for the channel capacity of a binary symmetric channel. At $p=\frac12$ the channel capacity reaches its minimum of $0$ and a small deviation from $p=\frac12$ causes the channel capacity to rise (with higher $\alpha$ the channel capacity rises more quickly). This forces the probability $p$ to be close to $\frac12$ as $\varepsilon$ gets smaller, meaning that membership of $A$ is only allowed to have a weak effect on any outcome based on an $\varepsilon$-private system.

<details markdown="block">
<summary>
Sufficient vs Necessary
</summary>

This equation is a necessary condition for a system to be $\varepsilon$-private at level $\alpha$ but no its own it is not sufficient, systems that satisfy the equation may fail to be $\varepsilon$-private. For $\alpha=1$ the left hand side does agree exactly with the channel capacity, but for higher $\alpha$ the left hand side is slightly less than the channel capacity. The exact channel capacity is somewhat tricky to calculate, but a simple sufficient condition can be found by looking at the maximum divergence between the probability of $B$ given $A$ and given $\neg A$, this yields

$$
\frac1{\alpha-1} \log \biggl( \frac{p^\alpha}{(1-p)^{\alpha-1}} + \frac{(1-p)^\alpha}{p^{\alpha-1}}\biggr) \le \varepsilon
$$

if $X$ and $Y$ are the binary variables denoting membership of $A$ and $B$ respectively then this is precisely the diameter of the channel $\sup_{x,x'} \D_\alpha(P_{Y|X=x} \| P_{Y | X=x'})$ while $\log(2) - \H_\alpha(p)$ is the radius of the channel. Careful readers may remember that these are exactly the two bounds discussed in the section on [Sibson's definition](#sibson). Not coincidentally the ratio between the radius and the diameter approaches 2 in the small $\varepsilon$ high $\alpha$ limit.

</details>
<p>

Note however that this protection can only prevent people from being singled out, it cannot prevent someone from doing bad things with the data and does not protect larger groups of people. Besides, mathematics does not care if $B$ stands for 'bad' or 'beneficial' so it would be equally accurate to term this the 'protection against beneficial outcomes' (though that name has never caught on for some reason). Strengthening this protection would prevent *any* outcome, bad or otherwise.

Given a choice to participate this protection does ensure that participating will not lead to a hugely different outcome for that person, but if the data is used in an irresponsible or discriminatory way the outcome may still hurt the people who's data was included in the dataset[^6]. Even if someone's individual choice does not matter it may in some cases still be better for people to decline in the hopes that other people are wise enough to make the same choice (much like voting). Differential privacy is not a magic bullet that makes algorithms behave responsibly, responsibility still lies with the people using the algorithms.

### Group Privacy and Composability

Another approach to try and get more information out of the dataset is to combine the information of multiple queries and/or multiple rows. While this does work a bit the effect is limited. Which is to be expected from an information theoretical point of view, intuitively the information that can flow from $n$ rows is the sum of the amount of information per row, and the amount of information of $n$ queries (about one row) is the total sum of the information per query (about that row). So unfortunately for any would-be hackers the combined information can never be more than the sum of its parts. The following makes this explicit.

In differential privacy terminology these two properties are called group privacy when it comes to combining multiple inputs with one output and composability when it comes to combining multiple outputs with the same input. These properties make it possible to combine queries without needing to completely recalculate the channel capacity or to reason how quickly the privacy deteriorates when looking at greater groups of people (as noted before privacy *should* deteriorate for larger groups or there would be no useful queries). Unfortunately the added flexibility of having multiple levels of privacy makes these properties a bit messier than their Shannon / differential privacy counterparts.

> **Group privacy**
>
> If $Y$ is $\varepsilon$-private at level $\alpha$ for each row then it is $n \varepsilon$-private for a group of $n$ rows at level $1+\frac{\alpha-1}{n}$.
>
> More generally if $Y$ is $\varepsilon_i$-private at level $\alpha_i$ for row $X_i$ then $Y$ is $\sum_i \varepsilon_i$-private at level $\alpha$ (where $\frac1{\alpha-1} = \sum_i \frac1{\alpha_i - 1}$).[^7] For a group of $n$ rows $X^{(n)}$. In general $\alpha$ will get closer to 1 as the group size increases (this is not necessarily a bad thing since it means we're more likely to get useful information out of a big group), if we're already at $\alpha=1$ the level doesn't drop any lower.

> **Composability**
>
> Analogously if $n$ queries are conditionally independent given the dataset $D$ and each is $\varepsilon$-private at level $\alpha$ then the combined query is $n \varepsilon$-private at level $1+\frac{\alpha-1}{n}$.
>
> More generally if $Y_i$ is $\varepsilon_i$-private at level $\alpha_i$ for row $X$ then $Y^{(n)}$ is $\sum_i \varepsilon_i$-private at level $\alpha$ (again where $\frac1{\alpha-1} = \sum_i \frac1{\alpha_i - 1}$)) for row $X$. This theorem holds row-wise, so if the queries use disjoint sets of rows then the combined query is $\max_i \varepsilon_i$-private at level $\min_i \alpha_i$.

Note that phrasing privacy in terms of information that flows from the rows to the output makes it easier to talk about the effect a query has on a particular individual in the dataset, and makes it a lot more natural to prove these statements in a way that tells us the exposure *per row* rather than requiring different theorems depending on whether the queries do or do not look at the same rows.

Now except for $\alpha=1$ and $\alpha=\infty$ the $n\varepsilon$-privacy for the combined input/output holds at a different level than the original because of the interactions between the random variables (if we had input/output pairs that were fully independent from each other the level wouldn't change). In the $\alpha=\infty$ case these interactions do not matter much because the channel capacity assumes the worst case anyway, and for $\alpha=1$ we're in some sense at the 'lowest' level already so the level does not drop any lower.

<details markdown="block">
<summary>
Derivation
</summary>

Proving these two properties requires some setup. The most straightforward derivation uses the following definition of conditional mutual information

$$
\I_\alpha(X ; Y | Z)
= \frac1{\alpha-1}\log \E\left[ \left( \frac{\d P_{XY|Z}}{\d P_{X|Z} P_{Y|Z}} \right)^{\alpha-1} \right].
$$

Firstly using a telescoping product and Hölder's theorem we get the following chain rule for all $\frac1{\alpha-1} = \sum_i \frac1{\alpha_i - 1}$.

$$
\begin{aligned}
\I_\alpha(X^{(n)} ; Y )
&= \log \left\| \frac{\d P_{Y | X^{(n)}}}{\d P_Y} \right\|_{\alpha-1}\\
&= \log \left\| \prod_i \frac{\d P_{Y | X^{(i)}}}{\d P_{Y | X^{(i-1)}}} \right\|_{\alpha-1}\\
&\le \sum_i \log \left\| \frac{\d P_{Y | X^{(i)}}}{\d P_{Y | X^{(i-1)}}} \right\|_{\alpha_i -1}
 =   \sum_i \I_{\alpha_i} (X_i ; Y | X^{(i-1)} )
\end{aligned}
$$

Here $X^{(i)}$ is $i$-tuple containing the first $i$ values. For brevity the measure in the subscript of the norms is omitted, here it is always the joint probability.

Secondly the conditional channel capacity (when conditional mutual information is defined as below) is at most the unconditional channel capacity. This is because they are equal when conditioned on a dirac delta measure.

$$
\begin{aligned}
\sup_{P_{XZ}} \I_\alpha(X ; Y | Z)
&= \sup_{P_Z P_{X|Z}} \frac1{\alpha-1}\log \E\left[ \left( \frac{\d P_{XY|Z}}{\d P_{X|Z} P_{Y|Z}} \right)^{\alpha-1} \right]\\
&= \sup_{z, P_{X|Z}} \frac1{\alpha-1}\log \E\left[ \left( \frac{\d P_{XY|Z=z}}{\d P_{X|Z=z} P_{Y|Z=z}} \right)^{\alpha-1} \right] & \textrm{ Average can't exceed the maximum } \\
&= \sup_{z, P_{X|Z}} \frac1{\alpha-1}\log \E\left[ \left( \frac{\d P_{XY}}{\d P_{X} P_{Y}} \right)^{\alpha-1} \right] & \textrm{where } P_Z = \delta_z\\
&\le \sup_{P_{XZ}} \I_\alpha(X ; Y).
\end{aligned}
$$

The group privacy property now follows quite easily

$$
\begin{aligned}
\sup_{P_{X^{(n)}}} \I_\alpha(X^{(n)} ; Y)
&\le \sup_{P_{X^{(n)}}} \sum_i \I_{\alpha_i}(X_i ; Y | X^{(<i)})\\
&\le \sum_i \sup_{P_{X^{(n)}}} \I_{\alpha_i}(X_i ; Y | X^{(<i)})
 \le \sum_i \sup_{P_{X^{(n)}}} \I_{\alpha_i}(X_i ; Y)
= \sum_i \varepsilon_i
\end{aligned}
$$

To proof for composability is a bit subtle, the simplest method is to assume each query is looking at a different the database and calculate the channel capacity using the supremum of the joint probability over all $n$ databases. Since this includes all distributions where the databases are equal this gives an upper limit for the channel capacity. Since the dependence of $Y_i$ on any other $Y_j$ only goes through $P_{D_i}$ the conditional mutual information can be turned into an unconditional one and the rest of the proof follows analogously to the above

So let $P_{\tilde{Y}_i | D_i} = P_{Y_i | D}$ and $P_{\tilde{Y}^{(n)} | D^{(n)}} = \prod_i P_{\tilde{Y}_i | D_i}$ then

$$
\begin{aligned}
\sup_{P_{D}} \I_\alpha(X(D) ; Y^{(n)})
&\le \sum_i \sup_{P_{D}} \I_{\alpha_i}(X(D) ; Y_i | Y^{(<i)})\\
&\le \sum_i \sup_{P_{D^{(n)}}} \I_{\alpha_i}(X(D_i) ; \tilde{Y}_i | \tilde{Y}^{(<i)})
 \le \sum_i \sup_{P_{D_i}} \I_{\alpha_i}(X(D_i) ; \tilde{Y}_i) 
 \le \sum_i \varepsilon_i.
\end{aligned}
$$

</details>

### To Fix a Broken Wifi

If we want to leak data at the highest rate possible it makes sense to use Shannon's theorem to get the maximum out of the noisy channels available to us. A slight complication is that it's somewhat hard to tell what the maximum capacity is for an arbitrary query. For most classes of $\varepsilon$-private queries the maximum capacity that can be achieved at level $\alpha=1$ is proportional to $\varepsilon^2$ (the first order derivative vanishes since $\varepsilon=0$ is an extremum). However in theory at least we could achieve a capacity of $\varepsilon$. To avoid the problem let's just assume we can make a channel that is $\varepsilon$-private at all levels and has a channel capacity of $C$ at $\alpha=1$ (this implies $C \le \varepsilon$)

Now the first part is that we won't simply plug the data from the dataset through the channel, instead we use Shannon's theorem to turn our channel into one that can send $nR$ nats of data (with $R < C$) in blocks of size $n$. This is possible because Shannon's Theorem assures the existence of a so called error correction code that allows us to send useful information despite the noise. These error correction codes are also what is used to make keep wifi useful in noisy environments, or to get satellites to send information with a low power antenna through the atmosphere of the earth. A situation as in differential privacy where each signal is far less than a single bit is likely a bit extreme, but there has been plenty of research into the subject ever since Shannon showed such error correction codes must exist.

Using the data processing inequality we know that the channel capacity doesn't increase if we do some pre-processing so we can now take $nR$ nats of data from any row in the database and send it using $n$ queries. The data processing inequality ensures these queries are still $\varepsilon$-private. Because of composability, it is also possible to pick $R$ nats of data from $n$ rows and send it using one query, if the rate is high enough to make this useful. Alternatively we can send $nR$ nats of data from all rows at the same time using $n$ queries.

The fact that an attack on 1 row scales to an attack on all rows is something that should be somewhat concerning to people interested in keeping the data private, but it is easily prevented by placing some global limits on the channel capacity for queries (it would be enough to limit the channel capacity at $\alpha=1$), or by limiting the number of independent queries by calculating the full set of results once and running the queries against that dataset instead.

### Hacking $(\varepsilon, \delta)$-privacy

If we wanted to hack a protected dataset we could make our lives a bit easier if we were allowed to use the less restrictive $(\varepsilon, \delta)$-privacy where the privacy condition is relaxed to

$$
P(f(D) \in E) \le e^\varepsilon P(f(D') \in E) + \delta.
$$

While this definition is similar to $\varepsilon$-privacy it loses the connection to information theory and most of the theorems about channel capacity no longer apply.

The concept of $(\varepsilon, \delta)$-privacy was previously summarised as being $\varepsilon$-private with probability $1-\delta$. Which is one way of phrasing it. If our query function $f$ is equal to an $\varepsilon$-private function $g$ with probability $1 - \delta$ and some other function $h$ with probability $\delta$ then this function is indeed $(\varepsilon, \delta)$-private

$$
\begin{aligned}
P(f(D) \in E)
&= (1-\delta)P(g(D) \in E) + \delta P(h(D) \in E)\\
&\le (1-\delta) e^\varepsilon P(g(D') \in E) + \delta P(h(D) \in E)\\
&\le e^\varepsilon P(f(D') \in E) + \delta.
\end{aligned}
$$

Of course $h$ can be anything, including a hack that leaks the whole database. In information theoretical terms the best that can be said is that the rate of information is actually still limited, though it is mostly limited by the amount of information available. To make this secure the number of tries required ($1/\delta$ on average) should be prohibitively large.

## Epilogue

In conclusion, differential privacy can be seen as a way to directly prevent the leakage of private information. Information theory makes this precise in terms of the (relative) Rényi entropy and can be used to show that most of the nicer properties of $\varepsilon$-privacy are direct consequences of intuitive features of information. Among other things this gives meaning to the parameter $\varepsilon$ (as the amount of nats that a query is allowed to leak per row), and makes it easier to reason about the trade-offs between protecting information and using it.

As shown in this article this gives a framework to protect privacy by limiting the amount of information that any one query can leak per individual. Since information does not increase by processing something this provides a robust protection. Because this is true regardless of *how* the information is processed it also prevents someone from being treated (much) differently as a result of such a query, as doing so would also constitute a leak of information. And finally since combining information does not cause the amount of information to exceed the sum of its parts it is simple to reason about the effect of multiple independent queries or how much information is leaked about groups of individuals. Conversely such a system allows for aggregated statistics to still give useful amounts of information by aggregating the tiny bits of information of many different rows.

In an information theoretical perspective several 'weak' spots of differential privacy also become apparent. For example that on its own differential privacy does not really restrict the global information rate. Which is not necessarily a problem, but left unchecked does allow any attack on an individual row to scale to an attack on the whole dataset. If necessary this can be prevented by limiting the number of queries and the amount of information per query. More troubling is the use of $(\varepsilon, \delta)$-privacy as an alternative to $\varepsilon$-privacy, since this loses most of the protections that come from limiting the rate of information, by allowing the information rate to be unbounded with probability $\delta$. It should also be kept in mind that differential privacy only protects privacy. And that since it allows beneficial research to be done it stands to reason that harmful uses are also still possible. On its own privacy is not enough for responsible AI.

The measure of information used by $\varepsilon$-privacy turns out to be particularly sensitive to outliers, even for events that have no realistic chance of occurring. This prevents the use of systems even if from an information theoretical point of view they are incapable of transmitting useful amounts of information. This can be understood best by rephrasing $\varepsilon$-privacy in terms of the Rényi channel capacity where $\varepsilon$-privacy restricts the channel capacity at $\alpha=\infty$, while the amount of information that can be transmitted is determined by the channel capacity at $\alpha=1$ (because of Shannon's noisy channel theorem). To understand the benefit of restricting the channel capacity all the way at $\alpha=\infty$ as opposed to restricting it at $\alpha=1$ requires understanding the difference between the Shannon entropy and the Rényi entropy at $\alpha=\infty$ (also called the max-entropy).

As an example of what can be done using the more relaxed definition of privacy, the related concept of Rényi differential privacy ([Mironov 2017](#ref-Mironov_2017)) has been used to implement a differentially private stochastic gradient descent on a dataset ([Fu, Chen, and Ling 2022](#ref-FU_2022)). They use an adaptation of $\varepsilon$-privacy called $(\varepsilon, \alpha)$-RDP, which among other things implies the channel capacity at level $\alpha$ is at most $\varepsilon$. This is then weakened into $(\varepsilon, \delta)$-privacy. However as shown in this article that actually weakens the privacy guarantee significantly. It would be better to keep the guarantee as is, which gives a version of gradient descent with limited channel capacity at level $\alpha$ and all the privacy protecting properties that entails. It is also possible to give a better bound on the channel capacity, by generalizing the Shannon--Hartley theorem for the Rényi divergence.

Since information theory is such a powerful tool when it comes to protecting information, it may be worth looking into the other possible definitions for the mutual information and channel capacity, and their properties. As an example the definitions used in this article would consider a channel that transmits a single bit without noise to have infinite channel capacity at $\alpha=\infty$, while according to other definitions the rate is 1 bit. Which definition has the most desirable properties when it comes to *restricting* information has not been investigated yet. The one given in this article is functional, easy to use in proofs, but does make it hard to calculate the channel capacity exactly (an easier to calculate upper bound exists, which is equivalent to the $(\varepsilon,\alpha)$-RDRP defined by Mironov ([2017](#ref-Mironov_2017))).

Moving away from $\varepsilon$-privacy and $(\varepsilon,\delta)$-privacy and analysing the flows of information instead will give more power and flexibility to the theory and gives more meaning to the parameters involved. Even complex algorithms like stochastic gradient descent can have their channel capacity restricted ([Fu, Chen, and Ling 2022](#ref-FU_2022)) showing that with this approach even advanced statistical analysis is still possible. For example [Smartnoise](https://github.com/opendp/smartnoise-sdk) uses this technique to generate synthetic data, though it must be said their choice of defaults for the parameters seem a bit off. As of January 2023 their readme shows a default of $\epsilon=1$ and $\delta=0.01$ for a dataset that contains data like income and race. Other restrictions are in place but leaking such information at a rate of approx. $1.44$ bits per query, or with unbounded rate with a probability of $1\%$ clearly does not give the best example for how to treat the highest category of sensitive data (at least according to Dutch law).

## Bibliography

- Dwork, Cynthia, and Aaron Roth. 2014. "[The Algorithmic Foundations of Differential Privacy](https://doi.org/10.1561/0400000042)." *Foundations and Trends® in Theoretical Computer Science* 9 (3-4): 211--407, preprint <https://www.cis.upenn.edu/~aaroth/Papers/privacybook.pdf>.
- Erven, Tim van, and Peter Harremoës. 2014. "[Rényi Divergence and Kullback-Leibler Divergence](https://doi.org/10.1109/tit.2014.2320500)." *IEEE Transactions on Information Theory* 60 (7): 3797--3820, preprint <https://arxiv.org/abs/1206.2459>.
- Fu, Jie, Zhili Chen, and XinPeng Ling. 2022. "[SA-DPSGD: Differentially Private Stochastic Gradient Descent Based on Simulated Annealing](https://doi.org/10.48550/ARXIV.2211.07218)." arXiv.
- Mironov, Ilya. 2017. "[Rényi Differential Privacy](https://doi.org/10.1109/csf.2017.11)." In *2017 IEEE 30th Computer Security Foundations Symposium (CSF)*. IEEE, preprint <https://arxiv.org/abs/1702.07476>.
- Narayanan, Arvind, and Vitaly Shmatikov. 2006. "[How to Break Anonymity of the Netflix Prize Dataset](https://doi.org/10.48550/ARXIV.CS/0610105)." arXiv.
- Shannon, C. E. 1948. "[A Mathematical Theory of Communication](https://doi.org/10.1002/j.1538-7305.1948.tb01338.x)." *The Bell System Technical Journal* 27 (3): 379--423.
- Sweeney, Latanya. 2015. "[Only You, Your Doctor, and Many Others May Know](https://techscience.org/a/2015092903/)." *Technology Science*, no. 9.
- Verdú, Sergio. 2015. "[$\alpha$-Mutual Information](https://doi.org/10.1109/ITA.2015.7308959)." In *2015 Information Theory and Applications Workshop (ITA)*, 1--6.

[^1]: In the following there will be some shenanigans going as to what happens for probability 0 subsets, especially since the value of a conditional probability is not well defined in such cases. Luckily this issue is mostly ignored in articles over differential privacy so it shall be ignored here as well.

[^2]: Because of Markov's inequality ${ P(\D_\alpha(P_{X|Y} \| P_X) \ge R) \le \frac{\E_Y [ e^{(\alpha-1)\D_\alpha(P_{X|Y} \| P_X)} - 1]}{e^{(\alpha-1)R} - 1} }$.

[^3]: Gaussian noise is easy to generalize to higher dimensions, and when a value is normally distributed it remains so with the addition of gaussian noise.

[^4]: It is conventional to do all of this with powers of 2 instead of $e$, which would give a channel capacity in bits, but differential privacy articles always seem to use $e$, hence why the rate is in nats.

[^5]: For instance Erven and Harremoës ([2014](#ref-van_Erven_2014)) show that ${ P_{XY}(A \times B) \le (e^{\I_\alpha(X;Y)} P_X(A) P_Y(B))^\frac{\alpha}{\alpha-1} }$, which mirrors the typical statement of the protection against bad outcomes more closely but completely fails to restrict anything at $\alpha=1$ and has an annoying dependence on $P_X$ (it holds for all choices of $P_X$ which makes it difficult to interpret), it is possible to get a more powerful and simpler result via another route.

[^6]: Of course because of the privacy protection the outcome must also hurt the people who's data *was not* included in the dataset.

[^7]: The $\frac1{\alpha-1} = \sum_i \frac1{\alpha_i - 1}$ condition follows from the Hölder inequality and the fact that the mutual information is more or less an $\alpha-1$-norm.

{::options parse_block_html=false /}