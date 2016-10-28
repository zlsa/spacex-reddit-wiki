# Reusability

## How have SpaceX's attempts at recovering Falcon boosters gone so far?

See /r/spacex/wiki/dev for a full breakdown of all reusability test flights to date.

## Are Falcon's booster landing legs reusable?



## Can Falcon boosters retract their landing legs?

No. The mechanism to deploy the landing legs is one-way, utilizing helium to extend them. Once they deploy fully, retracting them is relatively complex. Because of the complexity, SpaceX removes the landing legs rather than stowing them directly. This was demonstrated after the Orbcomm OG-2 Launch 2 with the recovered core.

## Can Falcon launch from Texas and land in Florida?

No. Elon Musk on Twitter stated: ["Side boosters fall short &amp;amp; center core goes too far + Florida is heavily populated. Landing permission tricky :)"](https://www.twitter.com/elonmusk/status/330395232564826112).

For a Falcon Heavy, the side boosters separate too early to easily travel to the cape. And the center core separates too late. And the larger issue comes in that flying a rocket stage on a ballistic trajectory over populated areas is too dangerous. Whereas a rocket launching from the Cape only travels over land [at the last second](https://i.imgur.com/Z81NgAk.png) (credit u/zlsa), a rocket launching from Texas would have to travel all the way across Florida.

## Can Falcon's landing legs be used for aerobraking?



## Falcon sometimes topples over after landing. Would it help to add wires that could quickly support it, or cushions for it to fall on?

The Falcon booster is over 40 meters tall (as tall as a 13 story building), and weighs approximately 20 tonnes. Any structure 'catching' the booster would need to close very rapidly, and so the forces involved in manipulating an object of this size are huge. The rocket body is as thin as a scaled up coke can, and not designed to handle sidewards forces. In addition, the 'catching structure' would need to be very far out to avoid getting caught on the legs as they came down, particularly if the rocket was off center.

The trouble with surrounding the pad with a soft surface for the booster to fall onto is it'll need to be very close to where the booster lands, and it won't be able to land directly on the soft surface. As a result of this, it dramatically shrinks the possible landing area, making a botched landing all that more likely. In addition, the fragile booster likely won't survive falling on its side, no matter how soft the landing.

We know it's fun to think about ways to fix a problem, but this is a problem that is easily fixed by improving the robustness of the current system, so that everything works as designed. SpaceX's goal is to develop the technology needed to land on other surfaces than the earth, where there will be no pre-built landing support systems.

## How badly is the ASDS damaged when a booster explodes?



## How could reusability lower launch costs?



## When does SpaceX plan on reusing the second stage?



## How does SpaceX plan to recover Falcon boosters?

There are two general methodologies that SpaceX use to recover boosters: either [Return To Launch Site (RTLS),](https://imgur.com/rWSpbWO) or landing at sea on the [Autonomous Spaceport Drone Ship (ASDS).](https://i.imgur.com/s61bv2t.jpg)

For RTLS, after stage separation, SpaceX rotates the first stage so that the engines are facing in the direction that the booster is flying. Three engines relight, burning to slowing the stage down to a halt and reversing its trajectory to carry it back to the launch site. This is known as the *boostback burn*. After the boostback burn is complete, the four grid fins deploy; they are used to guide the booster through the hypersonic region of the atmospheric reentry. Then, immediately before reentry, the three engines ignite again so the booster can reenter the atmosphere at a safe speed. This is known as the *reentry burn*. After the reentry burn has completed and the booster is within the atmosphere, the stage will continue to fall under gravity, slowing the whole time due to air resistance, until it is at terminal velocity (the fastest speed it will reach, due to the opposing forces of gravity and aerodynamic drag). A few hundred meters above the surface of the landing zone, the single center engine will reignite again to slow the booster to a stop, aiming to reach zero meters per second at the exact point that the altitude reaches zero. The booster cannot hover; this is because the thrust from even a single Merlin engine, throttled down to its minimum thrust of 70%, is greater than the weight of the booster. When landing on the ASDS, everything is the same, except they omit the boostback burn so as to land downrange.

## How does the first stage of Falcon return to launch site?



## At what time does the landing occur?



## How is the distance to the ground measured from Falcon or Dragon 2?



## How will SpaceX roll out reusability?



## What is 'payload penalty'?

All of the structures and propellants required for landing the booster takes away from the payload capacity, due to the fact that they take up mass that would normally be carried to orbit. This effect is much worse for the second stage than it is for the first stage: every kilogram of reusability equipment on the second stage eats up one kilogram of the payload; this ratio is much lower (around 10%? **fact check needed**) for the first stage. Some attempt to lessen the amount of fuel needed to boostback is made by flying a more vertical trajectory on the ascent, with lower lateral velocity and hence lower the fuel needed to boostback. This does however result in a slightly less efficient orbital insertion.

## What is a Autonomous Spaceport Drone Ship (ASDS)?

The ASDS, or Autonomous Spaceport Drone Ship, is an ocean-going, barge-derived, floating landing platform used by SpaceX began as landing platforms for boosters recovery at sea. The original ASDS that has been used for all landing attempts in the first half of 2015 was the Marmac 300, which was named by Elon Musk as *Just Read The Instructions*. In mid 2015, Marmac 300 was returned to the owners (the barges are only rented), and SpaceX took delivery of Marmac 303 and Marmac 304. Marmac 304 is currently on the East Coast for catching stages launched from Cape Canaveral, Florida. This barge has been named *Of Course I Still Love You*. Marmac 303 was bought through the Panama Canal to the West Coast and moored at LA, in order to catch future stages launched from Vandenberg, California. This barge was again named *Just Read The Instructions*. The names are references to ships from the late Iain M. Banks' Culture novels.

## What is the process for bringing back boosters that land on the ASDS?

The first job is to secure the booster. While the center of gravity is pretty low for the booster, as all the engines and residual propellant is at the bottom, SpaceX also tie the rocket down to the droneship to prevent it from potentially sliding during transport. Then the tug Elsbeth III tows the ASDS back to port. At port, the booster is lifted off the barge using a crane, and placed onto a stand which supports the weight of the booster from the launch hold-down point. Once on the stand, the legs are removed, and then the booster is rotated to the horizontal, and placed on the back of a truck, to be taken back to the launch site. At the launch site, the stage is inspected, any required maintenance is carried out, and then a series of test fires are carried out in order to requalify the booster for relaunch.

## Why do we lose the live video feed from the ASDS as the booster comes in to land?



## Why does Falcon have 4 legs? Wouldn't more legs provide better redundancy?



## Why does SpaceX sometimes land on the ASDS when they could land back at the pad?

Initially, barge landings were about safety, and were used for practice before moving towards landing back at the launch site. However, even though RTLS has now been proven to work, the booster cannot always land at the launch site. The main practical difference is that RTLS trajectory consumes more fuel than ASDS, which eats into the payload capability. RTLS loses about 30% total capacity, vs about 15% for ASDS landings. Barge landings are needed for high mass / high velocity launches, such as Geostationary Transfer Orbit missions. During these types of missions, it's just not physically possible to return to launch site. This is because they put such a high demand on the rocket; the rocket needs to work hard to raise a heavy bird to the speeds required for high orbits. To land back at the pad, speed at stage separation cannot be greater than about 6000 km/hr. If you can land on a ship, there's no need to zero out the booster's lateral velocity, so stage separation can occur at up to around 9000 km/h. Put another way, the extra ∆V "boost back" expense inflicts a penalty on payload mass.

## Why does half of Falcon look black or dirty after it has landed?  Why is the other half still white or clean? What causes this distinctive pattern?



## Why doesn't SpaceX save fuel during booster reuse by adding parachutes?

SpaceX experimented with using parachutes in the past (mainly for their Falcon 1 vehicles), but parachutes are poorly suited to this application, as extreme speeds and loads cause them to shred. Parachutes large enough to recover the stage are also quite heavy, a weight which could be used for fuel for a propulsive landing and for primary mission assurance. Parachutes also cannot be steered.

Essentially, this becomes a problem of people overestimating the amount of fuel required to bring the stage back, underestimating the weight of the parachute system (which would be in the hundreds of kilograms at least), and underestimating the fragility and controllability of a parachute system.

## Why is SpaceX pursuing rocket reusability?

Read [this article by SpaceX](http://www.spacex.com/news/2013/03/31/reusability-key-making-human-life-multi-planetary), which explains their motives.